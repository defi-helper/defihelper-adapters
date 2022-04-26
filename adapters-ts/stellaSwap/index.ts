import type ethersType from "ethers";

import {
  contractsResolver,
  stakingAdapter,
} from "../utils/ethereum/adapter/base";
import * as masterChef from "../utils/ethereum/adapter/masterChef";
import * as ethereum from "../utils/ethereum/base";
import * as cache from "../utils/cache";
import { bignumber as bn, ethers, ethersMulticall } from "../lib";
import { bridgeWrapperBuild } from "../utils/coingecko";
import bridgeTokens from "./data/bridgeTokens.json";
import stellaSwapDistributorAbi from "./data/stellaSwapDistributor.json";
import { ResolvedContract, Staking } from "../utils/adapter/base";
import * as erc20 from "../utils/ethereum/erc20";
import { V2 as uniswap } from "../utils/ethereum/uniswap";

const STELLA_SWAP_DISTRIBUTOR_ADDRESS =
  "0xEDFB330F5FA216C9D2039B99C8cE9dA85Ea91c1E";

function masterChefProviderFactory(
  address: string,
  abi: any,
  provider: ethersType.providers.Provider | ethersType.Signer,
  blockTag: ethereum.BlockNumber,
  avgBlockTime: number
) {
  return masterChef.buildMasterChefProvider(
    new ethers.Contract(address, abi, provider),
    { blockTag },
    {
      rewardToken() {
        return "0x0E358838ce72d5e61E0018a2ffaC4bEC5F4c88d2";
      },
      poolInfo(poolIndex) {
        return this.contract
          .poolInfo(poolIndex, { blockTag: this.options.blockTag })
          .then(
            ({
              lpToken,
              allocPoint,
              accStellaPerShare,
            }: {
              lpToken: string;
              allocPoint: ethersType.BigNumber;
              accStellaPerShare: ethersType.BigNumber;
            }) => ({
              lpToken,
              allocPoint: ethereum.toBN(allocPoint),
              accRewardPerShare: ethereum.toBN(accStellaPerShare),
            })
          );
      },
      rewardPerSecond() {
        return this.contract
          .stellaPerBlock({ blockTag: this.options.blockTag })
          .then((v: ethersType.BigNumber) =>
            ethereum.toBN(v).multipliedBy(1000).div(avgBlockTime)
          );
      },
      pendingReward(poolIndex, wallet) {
        return this.contract
          .pendingStella(poolIndex, wallet)
          .then(ethereum.toBN);
      },
    }
  );
}

module.exports = {
  stellaSwapDistributor: stakingAdapter(
    async (
      provider,
      contractAddress,
      initOptions = ethereum.defaultOptions()
    ) => {
      const options = {
        ...ethereum.defaultOptions(),
        ...initOptions,
      };
      const blockTag = options.blockNumber;
      const network = await provider
        .getNetwork()
        .then(({ chainId }) => chainId);
      const block = await provider.getBlock(blockTag);
      const multicall = new ethersMulticall.Provider(provider, network);
      await multicall.init();

      const priceFeed = bridgeWrapperBuild(
        bridgeTokens,
        blockTag,
        block,
        network
      );

      const masterChefSavedPools = await cache.read(
        "stellaSwap",
        "masterChefPools"
      );

      const pool = masterChefSavedPools.find(
        (p) => p.stakingToken.toLowerCase() === contractAddress.toLowerCase()
      );
      if (!pool) {
        throw new Error("Pool is not found");
      }

      const avgBlockTime = await ethereum.getAvgBlockTime(
        provider,
        block.number
      );

      const masterChefProvider = masterChefProviderFactory(
        STELLA_SWAP_DISTRIBUTOR_ADDRESS,
        stellaSwapDistributorAbi,
        provider,
        blockTag,
        avgBlockTime
      );

      const poolInfo = await masterChefProvider.poolInfo(pool.index);

      const rewardToken = await masterChefProvider.rewardToken();
      const rewardTokenDecimals = 18;
      const rewardTokenPriceUSD = await priceFeed(rewardToken);

      const stakingToken = await masterChefProvider.stakingToken(poolInfo);
      const stakingTokenDecimals = 18;
      const stakingTokenPair = await uniswap.pair.PairInfo.create(
        multicall,
        stakingToken,
        options
      );
      const token0PriceUSD = new bn(await priceFeed(stakingTokenPair.token0));
      const token1PriceUSD = new bn(await priceFeed(stakingTokenPair.token1));

      const stakingTokenPriceUSD = stakingTokenPair.calcPrice(
        token0PriceUSD,
        token1PriceUSD
      );

      const totalLocked = await masterChefProvider
        .totalLocked(poolInfo)
        .then((v) => v.div(`1e${stakingTokenDecimals}`));
      const tvl = new bn(totalLocked).multipliedBy(stakingTokenPriceUSD);

      const [rewardPerSecond, totalAllocPoint] = await Promise.all([
        masterChefProvider.rewardPerSecond(),
        masterChefProvider.totalAllocPoint(),
      ]);
      const rewardPerSec = poolInfo.allocPoint
        .multipliedBy(rewardPerSecond)
        .div(totalAllocPoint)
        .div(`1e${rewardTokenDecimals}`);
      const aprSecond = rewardPerSec.multipliedBy(rewardTokenPriceUSD).div(tvl);
      const aprDay = aprSecond.multipliedBy(86400);
      const aprWeek = aprDay.multipliedBy(7);
      const aprMonth = aprDay.multipliedBy(30);
      const aprYear = aprDay.multipliedBy(365);

      return {
        stakeToken: {
          address: stakingToken,
          decimals: stakingTokenDecimals,
          priceUSD: stakingTokenPriceUSD.toString(10),
          parts: [
            {
              address: stakingTokenPair.token0,
              decimals: stakingTokenPair.token0Decimals,
              priceUSD: token0PriceUSD.toString(10),
            },
            {
              address: stakingTokenPair.token1,
              decimals: stakingTokenPair.token1Decimals,
              priceUSD: token1PriceUSD.toString(10),
            },
          ],
        },

        rewardToken: {
          address: rewardToken,
          decimals: rewardTokenDecimals,
          priceUSD: rewardTokenPriceUSD.toString(10),
        },

        metrics: {
          tvl: tvl.toString(10),
          aprDay: aprDay.toString(10),
          aprWeek: aprWeek.toString(10),
          aprMonth: aprMonth.toString(10),
          aprYear: aprYear.toString(10),
        },

        wallet: async (walletAddress: string) => {
          const balance = await masterChefProvider
            .userInfo(pool.index, walletAddress)
            .then(({ amount }) => amount.div(`1e${stakingTokenDecimals}`));

          const earned = await masterChefProvider
            .pendingReward(pool.index, walletAddress)
            .then((v) => v.div(`1e${rewardTokenDecimals}`));
          const expandedBalance = stakingTokenPair.expandBalance(balance);
          const reviewedBalance = [
            {
              token: stakingTokenPair.token0,
              balance: expandedBalance.token0.toString(10),
              usd: expandedBalance.token0
                .multipliedBy(token0PriceUSD)
                .toString(10),
            },
            {
              token: stakingTokenPair.token1,
              balance: expandedBalance.token1.toString(10),
              usd: expandedBalance.token1
                .multipliedBy(token1PriceUSD)
                .toString(10),
            },
          ];
          const earnedUSD = earned.multipliedBy(rewardTokenPriceUSD);

          return {
            staked: reviewedBalance.reduce<
              Record<string, { balance: string; usd: string }>
            >(
              (res, b) => ({
                ...res,
                [b.token]: {
                  balance: b.balance,
                  usd: b.usd,
                },
              }),
              {}
            ),

            earned: {
              [rewardToken]: {
                balance: earned.toString(10),
                usd: earnedUSD.toString(10),
              },
            },

            metrics: {
              staking: balance.toString(10),
              stakingUSD: balance
                .multipliedBy(stakingTokenPriceUSD)
                .toString(10),
              earned: earned.toString(10),
              earnedUSD: earnedUSD.toString(10),
            },

            tokens: Staking.tokens(
              ...reviewedBalance.map((b) => ({
                token: b.token,
                data: {
                  balance: b.balance,
                  usd: b.usd,
                },
              })),
              {
                token: rewardToken,
                data: {
                  balance: earned.toString(10),
                  usd: earnedUSD.toString(10),
                },
              }
            ),
          };
        },

        actions: masterChef.stakingActionComponents({
          masterChefProvider,
          poolIndex: pool.index,
          poolInfo,
          signer: options.signer,
          etherscanAddressURL: "https://moonscan.io/address",
        }),
      };
    }
  ),

  automates: {
    contractsResolver: {
      default: contractsResolver(async (provider, options = {}) => {
        const multicall = new ethersMulticall.Provider(provider);
        await multicall.init();

        const masterChiefV1Contract = new ethersMulticall.Contract(
          STELLA_SWAP_DISTRIBUTOR_ADDRESS,
          stellaSwapDistributorAbi
        );

        const [totalPoolsV1] = await multicall.all([
          masterChiefV1Contract.poolLength(),
        ]);

        const invalidPools: Array<number> = [];

        const poolsV1Index = Array.from(
          Array(totalPoolsV1.toNumber()).keys()
        ).filter((index) => !invalidPools.includes(index));

        const poolsV1Info = await multicall.all(
          poolsV1Index.map((poolIndex) =>
            masterChiefV1Contract.poolInfo(poolIndex)
          )
        );

        const poolsV1StakingTokensSymbol = await multicall.all(
          poolsV1Info.map(({ lpToken }) =>
            erc20.multicallContract(lpToken).symbol()
          )
        );

        type ResolvedPool = ResolvedContract & {
          poolIndex: number;
          stakingToken: string;
        };

        const poolsV1: Array<ResolvedPool> = await Promise.all(
          poolsV1Info.map(async (info, index) => {
            const stakingTokenSymbol = poolsV1StakingTokensSymbol[index];
            const isPair = stakingTokenSymbol === "STELLA LP";

            let token0Symbol, token1Symbol;
            if (isPair) {
              const [token0, token1] = await multicall.all([
                uniswap.pair.multicallContract(info.lpToken).token0(),
                uniswap.pair.multicallContract(info.lpToken).token1(),
              ]);
              const pairSymbols = await multicall.all([
                uniswap.pair.multicallContract(token0).symbol(),
                uniswap.pair.multicallContract(token1).symbol(),
              ]);
              token0Symbol = pairSymbols[0];
              token1Symbol = pairSymbols[1];
            }

            const autorestakeAdapter = "stellaSwapDistributor";

            return {
              poolIndex: index,
              stakingToken: info.lpToken,
              name: isPair
                ? `${token0Symbol}-${token1Symbol}`
                : stakingTokenSymbol,
              address: info.lpToken,
              blockchain: "ethereum",
              network: "1284",
              layout: "staking",
              adapter: "stellaSwapDistributor",
              description: "",
              automate: {
                autorestakeAdapter,
                adapters: ["stellaSwapDistributor"],
                buyLiquidity: isPair
                  ? {
                      router: "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F",
                      pair: info.lpToken,
                    }
                  : undefined,
              },
              link: "https://app.stellaswap.com/farm",
            };
          })
        );

        if (options.cacheAuth) {
          cache.write(
            options.cacheAuth,
            "stellaSwap",
            "masterChefPools",
            poolsV1.map(({ poolIndex, stakingToken }) => ({
              index: poolIndex,
              stakingToken,
            }))
          );
        }

        return poolsV1;
      }),
    },
  },
};

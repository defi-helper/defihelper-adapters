import type ethersType from "ethers";
import { bignumber as bn, ethers, ethersMulticall } from "../lib";
import { Staking, ResolvedContract } from "../utils/adapter/base";
import {
  stakingAdapter,
  contractsResolver,
  governanceSwapAdapter,
} from "../utils/ethereum/adapter/base";
import { bridgeWrapperBuild } from "../utils/coingecko";
import * as cache from "../utils/cache";
import * as ethereum from "../utils/ethereum/base";
import * as erc20 from "../utils/ethereum/erc20";
import * as dfh from "../utils/dfh";
import { V2 as uniswap } from "../utils/ethereum/uniswap";
import * as masterChef from "../utils/ethereum/adapter/masterChef";
import * as govSwap from "../utils/ethereum/adapter/govSwap";
import masterChefABI from "./data/masterChefABI.json";
import tomTokenABI from "./data/tomTokenABI.json";
import masterChefFinnLpRestakeABI from "./data/masterChefFinnLpRestakeABI.json";

const masterChefAddress = "0x1f4b7660b6AdC3943b5038e3426B33c1c0e343E6";
const routeTokens = ["0x98878B06940aE243284CA214f92Bb71a2b032B8A"];
const tomAddress = "0x37619cc85325afea778830e184cb60a3abc9210b";

function masterChefProviderFactory(
  providerOrSigner: ethereum.ProviderOrSigner,
  blockTag: ethereum.BlockNumber
) {
  return masterChef.buildMasterChefProvider(
    new ethers.Contract(masterChefAddress, masterChefABI, providerOrSigner),
    { blockTag },
    {
      rewardToken() {
        return "0x9a92b5ebf1f6f6f7d93696fcd44e5cf75035a756";
      },
      poolInfo(poolIndex) {
        return this.contract
          .poolInfo(poolIndex, { blockTag: this.options.blockTag })
          .then(
            ({
              lpToken,
              allocPoint,
              accRewardPerShare,
            }: {
              lpToken: string;
              allocPoint: ethersType.BigNumber;
              accRewardPerShare: ethersType.BigNumber;
            }) => ({
              lpToken,
              allocPoint: ethereum.toBN(allocPoint),
              accRewardPerShare: ethereum.toBN(accRewardPerShare),
            })
          );
      },
      rewardPerSecond() {
        return this.contract
          .finnPerSecond({ blockTag: this.options.blockTag })
          .then(ethereum.toBN);
      },
      pendingReward(poolIndex, wallet) {
        return this.contract
          .pendingReward(poolIndex, wallet)
          .then(ethereum.toBN);
      },
    }
  );
}

module.exports = {
  masterChefPair: stakingAdapter(
    async (
      provider,
      contractAddress,
      initOptions = ethereum.defaultOptions()
    ) => {
      const options = {
        ...ethereum.defaultOptions(),
        ...initOptions,
      };
      const masterChefSavedPools = await cache.read(
        "moonriverHuckleberry",
        "masterChefPools"
      );
      const blockTag = options.blockNumber;
      const network = await provider
        .getNetwork()
        .then(({ chainId }) => chainId);
      const block = await provider.getBlock(blockTag);
      const priceFeed = bridgeWrapperBuild(
        await dfh.getPriceFeeds(network),
        blockTag,
        block,
        network
      );
      const multicall = new ethersMulticall.Provider(provider);
      await multicall.init();

      const pool = masterChefSavedPools.find(
        (p) => p.stakingToken.toLowerCase() === contractAddress.toLowerCase()
      );
      if (!pool) {
        throw new Error("Pool is not found");
      }

      const masterChefProvider = masterChefProviderFactory(provider, blockTag);
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
      const token0PriceUSD = await priceFeed(stakingTokenPair.token0);
      const token1PriceUSD = await priceFeed(stakingTokenPair.token1);
      const stakingTokenPriceUSD = stakingTokenPair.calcPrice(
        token0PriceUSD,
        token1PriceUSD
      );

      const totalLocked = await masterChefProvider
        .totalLocked(poolInfo)
        .then((v) => v.div(`1e${stakingTokenDecimals}`));
      const tvl = totalLocked.multipliedBy(stakingTokenPriceUSD);

      const [rewardPerSecond, totalAllocPoint] = await Promise.all([
        masterChefProvider.rewardPerSecond(),
        masterChefProvider.totalAllocPoint(),
      ]);
      const rewardPerSec = poolInfo.allocPoint
        .multipliedBy(rewardPerSecond)
        .div(totalAllocPoint)
        .div(`1e${rewardTokenDecimals}`);
      const aprSec = tvl.gt(0)
        ? rewardPerSec.multipliedBy(rewardTokenPriceUSD).div(tvl)
        : new bn(0);
      const aprDay = aprSec.multipliedBy(60 * 60 * 24);
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
        wallet: async (walletAddress) => {
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
            staked: reviewedBalance.reduce(
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
          etherscanAddressURL: "https://moonriver.moonscan.io/address",
        }),
      };
    }
  ),
  masterChefSingle: stakingAdapter(
    async (
      provider,
      contractAddress,
      initOptions = ethereum.defaultOptions()
    ) => {
      const options = {
        ...ethereum.defaultOptions(),
        ...initOptions,
      };
      const masterChefSavedPools = await cache.read(
        "moonriverHuckleberry",
        "masterChefPools"
      );
      const blockTag = options.blockNumber;
      const network = await provider
        .getNetwork()
        .then(({ chainId }) => chainId);
      const block = await provider.getBlock(blockTag);
      const priceFeed = bridgeWrapperBuild(
        await dfh.getPriceFeeds(network),
        blockTag,
        block,
        network
      );

      const pool = masterChefSavedPools.find(
        (p) => p.stakingToken.toLowerCase() === contractAddress.toLowerCase()
      );
      if (!pool) {
        throw new Error("Pool is not found");
      }

      const masterChefProvider = masterChefProviderFactory(provider, blockTag);
      const poolInfo = await masterChefProvider.poolInfo(pool.index);

      const rewardToken = await masterChefProvider.rewardToken();
      const rewardTokenDecimals = 18;
      const rewardTokenPriceUSD = await priceFeed(rewardToken);
      const stakingToken = contractAddress.toLowerCase();
      const stakingTokenDecimals = await erc20
        .contract(provider, stakingToken)
        .decimals()
        .then((v: ethersType.BigNumber) => Number(v.toString()));
      let stakingTokenPriceUSD = new bn(0);
      // Tom token price feed
      if (stakingToken.toLowerCase() === tomAddress) {
        const [tomTotalSupply, finnBalance, finnPriceUSD] = await Promise.all([
          erc20
            .contract(provider, stakingToken)
            .totalSupply({ blockTag })
            .then((v: ethersType.BigNumber) => new bn(v.toString())),
          erc20
            .contract(provider, rewardToken)
            .balanceOf(stakingToken, { blockTag })
            .then((v: ethersType.BigNumber) => new bn(v.toString())),
          priceFeed(rewardToken),
        ]);
        stakingTokenPriceUSD = finnBalance
          .div(tomTotalSupply)
          .multipliedBy(finnPriceUSD);
      } else {
        stakingTokenPriceUSD = await priceFeed(stakingToken);
      }

      const totalLocked = await masterChefProvider
        .totalLocked(poolInfo)
        .then((v) => v.div(`1e${stakingTokenDecimals}`));
      const tvl = totalLocked.multipliedBy(stakingTokenPriceUSD);

      const [rewardPerSecond, totalAllocPoint] = await Promise.all([
        masterChefProvider.rewardPerSecond(),
        masterChefProvider.totalAllocPoint(),
      ]);
      const rewardPerSec = poolInfo.allocPoint
        .multipliedBy(rewardPerSecond)
        .div(totalAllocPoint)
        .div(`1e${rewardTokenDecimals}`);
      const aprSec = tvl.gt(0)
        ? rewardPerSec.multipliedBy(rewardTokenPriceUSD).div(tvl)
        : new bn(0);
      const aprDay = aprSec.multipliedBy(60 * 60 * 24);
      const aprWeek = aprDay.multipliedBy(7);
      const aprMonth = aprDay.multipliedBy(30);
      const aprYear = aprDay.multipliedBy(365);

      return {
        stakeToken: {
          address: stakingToken,
          decimals: stakingTokenDecimals,
          priceUSD: stakingTokenPriceUSD.toString(10),
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
        wallet: async (walletAddress) => {
          const balance = await masterChefProvider
            .userInfo(pool.index, walletAddress)
            .then(({ amount }) => amount.div(`1e${stakingTokenDecimals}`));
          const earned = await masterChefProvider
            .pendingReward(pool.index, walletAddress)
            .then((v) => v.div(`1e${rewardTokenDecimals}`));
          const balanceUSD = balance.multipliedBy(stakingTokenPriceUSD);
          const earnedUSD = earned.multipliedBy(rewardTokenPriceUSD);

          return {
            staked: {
              [stakingToken]: {
                balance: balance.toString(10),
                usd: balanceUSD.toString(10),
              },
            },
            earned: {
              [rewardToken]: {
                balance: earned.toString(10),
                usd: earnedUSD.toString(10),
              },
            },
            metrics: {
              staking: balance.toString(10),
              stakingUSD: balanceUSD.toString(10),
              earned: earned.toString(10),
              earnedUSD: earnedUSD.toString(10),
            },
            tokens: Staking.tokens(
              {
                token: stakingToken,
                data: {
                  balance: balance.toString(10),
                  usd: balanceUSD.toString(10),
                },
              },
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
          etherscanAddressURL: "https://moonriver.moonscan.io/address",
        }),
      };
    }
  ),
  tom: governanceSwapAdapter(
    async (provider, tomAddress, initOptions = ethereum.defaultOptions()) => {
      const options = {
        ...ethereum.defaultOptions(),
        ...initOptions,
      };
      const blockTag = options.blockNumber;
      const network = await provider
        .getNetwork()
        .then(({ chainId }) => chainId);
      const block = await provider.getBlock(blockTag);
      const priceFeed = bridgeWrapperBuild(
        await dfh.getPriceFeeds(network),
        blockTag,
        block,
        network
      );

      const finnAddress = "0x9a92b5ebf1f6f6f7d93696fcd44e5cf75035a756";
      const finnContract = erc20.contract(provider, finnAddress);
      const finnDecimals = 18;
      const tomContract = new ethers.Contract(
        tomAddress,
        tomTokenABI,
        provider
      );
      const tomDecimals = 18;

      const [finnBalance, finnPriceUSD] = await Promise.all([
        finnContract
          .balanceOf(tomAddress, { blockTag })
          .then((v: ethersType.BigNumber) =>
            ethereum.toBN(v).div(`1e${finnDecimals}`)
          ),
        priceFeed(finnAddress),
      ]);
      const tvl = finnBalance.multipliedBy(finnPriceUSD);

      return {
        stakeToken: {
          address: finnAddress,
          decimals: finnDecimals,
          priceUSD: finnPriceUSD.toString(10),
        },
        rewardToken: {
          address: tomAddress,
          decimals: tomDecimals,
          priceUSD: finnPriceUSD.toString(10),
        },
        metrics: {
          tvl: tvl.toString(10),
          aprDay: "0",
          aprWeek: "0",
          aprMonth: "0",
          aprYear: "0",
        },
        wallet: async (walletAddress) => {
          const [tomBalance, finnBalance, tomTotalSupply, finnPriceUSD] =
            await Promise.all([
              tomContract
                .balanceOf(walletAddress, { blockTag })
                .then((v: ethersType.BigNumber) =>
                  new bn(v.toString()).div(`1e${tomDecimals}`)
                ),
              finnContract
                .balanceOf(tomAddress, { blockTag })
                .then((v: ethersType.BigNumber) =>
                  new bn(v.toString()).div(`1e${finnDecimals}`)
                ),
              tomContract
                .totalSupply({ blockTag })
                .then((v: ethersType.BigNumber) =>
                  new bn(v.toString()).div(`1e${tomDecimals}`)
                ),
              priceFeed(finnAddress),
            ]);
          const k = finnBalance.div(tomTotalSupply);
          const balance = tomBalance.multipliedBy(k);
          const balanceUSD = balance.multipliedBy(finnPriceUSD);
          const earned = tomBalance;
          const earnedUSD = balanceUSD;

          return {
            staked: {
              [finnAddress]: {
                balance: balance.toString(10),
                usd: balanceUSD.toString(10),
              },
            },
            earned: {
              [tomAddress]: {
                balance: earned.toString(10),
                usd: earnedUSD.toString(10),
              },
            },
            metrics: {
              staking: balance.toString(10),
              stakingUSD: balanceUSD.toString(10),
              earned: earned.toString(10),
              earnedUSD: earnedUSD.toString(10),
            },
            tokens: Staking.tokens(
              {
                token: finnAddress,
                data: {
                  balance: balance.toString(10),
                  usd: balanceUSD.toString(10),
                },
              },
              {
                token: tomAddress,
                data: {
                  balance: earned.toString(10),
                  usd: earnedUSD.toString(10),
                },
              }
            ),
          };
        },
        actions: govSwap.actionComponents({
          tokenContract: finnContract,
          govContract: tomContract,
          getTokenSymbol: () => "FINN",
          getTokenDecimals: () => finnDecimals,
          getGovSymbol: () => "TOM",
          getGovDecimals: () => tomDecimals,
          signer: options.signer,
          etherscanAddressURL: "https://moonriver.moonscan.io/address",
        }),
      };
    }
  ),
  automates: {
    contractsResolver: {
      default: contractsResolver(async (provider, options = {}) => {
        const multicall = new ethersMulticall.Provider(provider);
        await multicall.init();

        const masterChiefContract = new ethersMulticall.Contract(
          masterChefAddress,
          masterChefABI
        );

        const [totalPools] = await multicall.all([
          masterChiefContract.poolLength(),
        ]);
        const poolsIndex = Array.from(new Array(totalPools.toNumber()).keys());
        const poolsInfo = await multicall.all(
          poolsIndex.map((poolIndex) => masterChiefContract.poolInfo(poolIndex))
        );
        const poolsStakingTokensSymbol = await multicall.all(
          poolsInfo.map(({ lpToken }) =>
            erc20.multicallContract(lpToken).symbol()
          )
        );
        type ResolvedPool = ResolvedContract & {
          poolIndex: number;
          stakingToken: string;
        };

        const pools: Array<ResolvedPool> = await Promise.all(
          poolsInfo.map(async (info, index) => {
            const stakingTokenSymbol = poolsStakingTokensSymbol[index];
            const isPair = stakingTokenSymbol === "HBLP";

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

            return {
              poolIndex: index,
              stakingToken: info.lpToken,
              name: isPair
                ? `${token0Symbol}-${token1Symbol}`
                : stakingTokenSymbol,
              address: info.lpToken,
              blockchain: "ethereum",
              network: "1285",
              layout: "staking",
              adapter: isPair ? "masterChefPair" : "masterChefSingle",
              description: "",
              automate: {
                adapters: isPair ? ["masterChefPair"] : ["masterChefSingle"],
                autorestakeAdapter: isPair
                  ? "MasterChefFinnLpRestake"
                  : undefined,
                lpTokensManager: isPair
                  ? {
                      router: "0x2d4e873f9Ab279da9f1bb2c532d4F06f67755b77",
                      pair: info.lpToken,
                    }
                  : undefined,
              },
              link: "",
            };
          })
        );
        if (options.cacheAuth) {
          cache.write(
            options.cacheAuth,
            "moonriverHuckleberry",
            "masterChefPools",
            pools.map(({ poolIndex, stakingToken, adapter }) => ({
              index: poolIndex,
              stakingToken,
              type: adapter === "masterChefPair" ? "lp" : "single",
            }))
          );
        }

        return pools;
      }),
    },
    deploy: {
      MasterChefFinnLpRestake: masterChef.stakingAutomateDeployTabs({
        liquidityRouter: "0x2d4e873f9Ab279da9f1bb2c532d4F06f67755b77",
        stakingAddress: masterChefAddress,
        poolsLoader: () =>
          cache
            .read("moonriverHuckleberry", "masterChefPools")
            .then((pools) => pools.filter(({ type }) => type === "lp")),
      }),
    },
    MasterChefFinnLpRestake: (
      signer: ethersType.Signer,
      contractAddress: string
    ) => {
      if (!signer.provider) throw new Error("Provider not found");

      return masterChef.stakingPairAutomateAdapter({
        masterChefProvider: masterChefProviderFactory(signer, "latest"),
        automateABI: masterChefFinnLpRestakeABI,
        stakingABI: masterChefABI,
        routeTokens,
      })(signer, contractAddress);
    },
  },
};

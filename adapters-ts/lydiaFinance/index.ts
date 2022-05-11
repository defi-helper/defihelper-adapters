import type ethersType from "ethers";
import { ethers, bignumber as bn, ethersMulticall } from "../lib";
import * as ethereum from "../utils/ethereum/base";
import * as erc20 from "../utils/ethereum/erc20";
import { V2 as uniswap } from "../utils/ethereum/uniswap";
import { bridgeWrapperBuild } from "../utils/coingecko";
import * as masterChef from "../utils/ethereum/adapter/masterChef";
import * as cache from "../utils/cache";
import * as dfh from "../utils/dfh";
import { Staking, ResolvedContract } from "../utils/adapter/base";
import {
  stakingAdapter,
  contractsResolver,
} from "../utils/ethereum/adapter/base";
import croesusABI from "./data/croesusABI.json";
import croesusLpRestakeABI from "./data/croesusLpRestakeABI.json";
import croesusSingleRestakeABI from "./data/croesusSingleRestakeABI.json";

function masterChefProviderFactory(
  address: string,
  abi: any,
  provider: ethersType.providers.Provider | ethersType.Signer,
  blockTag: ethereum.BlockNumber
) {
  return masterChef.buildMasterChefProvider(
    new ethers.Contract(address, abi, provider),
    { blockTag },
    {
      rewardToken() {
        return "0x4C9B4E1AC6F24CdE3660D5E4Ef1eBF77C710C084";
      },
      poolInfo(poolIndex) {
        return this.contract
          .poolInfo(poolIndex, { blockTag: this.options.blockTag })
          .then(
            ({
              lpToken,
              allocPoint,
              accLydPerShare,
            }: {
              lpToken: string;
              allocPoint: ethersType.BigNumber;
              accLydPerShare: ethersType.BigNumber;
            }) => ({
              lpToken,
              allocPoint: ethereum.toBN(allocPoint),
              accRewardPerShare: ethereum.toBN(accLydPerShare),
            })
          );
      },
      rewardPerSecond() {
        return this.contract
          .lydPerSec({ blockTag: this.options.blockTag })
          .then(ethereum.toBN);
      },
      pendingReward(poolIndex, wallet) {
        return this.contract.pendingLyd(poolIndex, wallet).then(ethereum.toBN);
      },
      deposit(poolIndex, amount) {
        if (poolIndex.toString() === "0") {
          return this.contract.enterStaking(amount);
        } else {
          return this.contract.deposit(poolIndex, amount);
        }
      },
      withdraw(poolIndex, amount) {
        if (poolIndex.toString() === "0") {
          return this.contract.leaveStaking(amount);
        } else {
          return this.contract.withdraw(poolIndex, amount);
        }
      },
    }
  );
}

const croesusAddress = "0xFb26525B14048B7BB1F3794F6129176195Db7766";
const routeTokens = ["0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7"];

module.exports = {
  croesusPair: stakingAdapter(
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
        "lydiaFinance",
        "croesusPools"
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

      const masterChefProvider = masterChefProviderFactory(
        croesusAddress,
        croesusABI,
        provider,
        blockTag
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
      const token0PriceUSD = await priceFeed(stakingTokenPair.token0);
      const token1PriceUSD = await priceFeed(stakingTokenPair.token1);
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
      const aprSecond = tvl.gt(0)
        ? rewardPerSec.multipliedBy(rewardTokenPriceUSD).div(tvl)
        : new bn(0);
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
          etherscanAddressURL: "https://snowtrace.io/address",
        }),
      };
    }
  ),
  croesusSingle: stakingAdapter(
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
        "lydiaFinance",
        "croesusPools"
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

      const masterChefProvider = masterChefProviderFactory(
        croesusAddress,
        croesusABI,
        provider,
        blockTag
      );
      const poolInfo = await masterChefProvider.poolInfo(pool.index);

      const rewardToken = await masterChefProvider.rewardToken();
      const rewardTokenDecimals = 18;
      const rewardTokenPriceUSD = await priceFeed(rewardToken);
      const stakingToken = contractAddress.toLowerCase();
      const stakingTokenDecimals = await erc20
        .contract(provider, stakingToken)
        .decimals()
        .then((v: ethersType.BigNumber) => Number(v.toString()));
      const stakingTokenPriceUSD = await priceFeed(stakingToken);

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
      let aprSec = tvl.gt(0)
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
          etherscanAddressURL: "https://snowtrace.io/address",
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
          croesusAddress,
          croesusABI
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
            const isPair = stakingTokenSymbol === "Lydia-LP";

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
              network: "43114",
              layout: "staking",
              adapter: isPair ? "croesusPair" : "croesusSingle",
              description: "",
              automate: {
                adapters: isPair ? ["croesusPair"] : ["croesusSingle"],
                autorestakeAdapter: isPair
                  ? "CroesusLpRestake"
                  : "CroesusSingleRestake",
                buyLiquidity: isPair
                  ? {
                      router: "0xA52aBE4676dbfd04Df42eF7755F01A3c41f28D27",
                      pair: info.lpToken,
                    }
                  : undefined,
              },
              link: "https://www.lydia.finance/farms",
            };
          })
        );
        if (options.cacheAuth) {
          cache.write(
            options.cacheAuth,
            "lydiaFinance",
            "croesusPools",
            pools.map(({ poolIndex, stakingToken, adapter }) => ({
              index: poolIndex,
              stakingToken,
              type: adapter === "croesusPair" ? "lp" : "single",
            }))
          );
        }

        return pools;
      }),
    },
    deploy: {
      MasterChefLpRestake: masterChef.stakingAutomateDeployTabs({
        liquidityRouter: "0xA52aBE4676dbfd04Df42eF7755F01A3c41f28D27",
        stakingAddress: croesusAddress,
        poolsLoader: () =>
          cache
            .read("lydiaFinance", "croesusPools")
            .then((pools) => pools.filter(({ type }) => type === "lp")),
      }),
      MasterChefSingleRestake: masterChef.stakingAutomateDeployTabs({
        liquidityRouter: "0xA52aBE4676dbfd04Df42eF7755F01A3c41f28D27",
        stakingAddress: croesusAddress,
        poolsLoader: () =>
          cache
            .read("lydiaFinance", "croesusPools")
            .then((pools) => pools.filter(({ type }) => type === "single")),
      }),
    },
    CroesusLpRestake: async (
      signer: ethersType.Signer,
      contractAddress: string
    ) => {
      if (!signer.provider) throw new Error("Provider not found");

      return masterChef.stakingPairAutomateAdapter({
        masterChefProvider: masterChefProviderFactory(
          croesusAddress,
          croesusABI,
          signer,
          "latest"
        ),
        automateABI: croesusLpRestakeABI,
        stakingABI: croesusABI,
        routeTokens,
      })(signer, contractAddress);
    },
    MasterChefSingleRestake: async (
      signer: ethersType.Signer,
      contractAddress: string
    ) => {
      if (!signer.provider) throw new Error("Provider not found");

      return masterChef.stakingPairAutomateAdapter({
        masterChefProvider: masterChefProviderFactory(
          croesusAddress,
          croesusABI,
          signer,
          "latest"
        ),
        automateABI: croesusSingleRestakeABI,
        stakingABI: croesusABI,
        routeTokens,
      })(signer, contractAddress);
    },
  },
};

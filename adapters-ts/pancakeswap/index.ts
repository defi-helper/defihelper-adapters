import type ethersType from "ethers";
import { bignumber as bn, dayjs, ethers, ethersMulticall } from "../lib";
import { Staking, Action, ResolvedContract } from "../utils/adapter/base";
import type BigNumber from "bignumber.js";
import {
  stakingAdapter,
  contractsResolver,
  deployAdapter,
  automateAdapter,
  Deploy,
  Automate,
  mixComponent,
} from "../utils/ethereum/adapter/base";
import { bridgeWrapperBuild } from "../utils/coingecko";
import * as cache from "../utils/cache";
import * as ethereum from "../utils/ethereum/base";
import * as erc20 from "../utils/ethereum/erc20";
import * as dfh from "../utils/dfh";
import { V2 as uniswap } from "../utils/ethereum/uniswap";
import * as masterChef from "../utils/ethereum/adapter/masterChef";
import masterChefABI from "./data/masterChefABI.json";
import masterChef2ABI from "./data/masterChefV2ABI.json";
import smartChefInitializableABI from "./data/smartChefInitializableABI.json";
import smartChefInitializableRestakeABI from "./data/smartChefInitializableRestakeABI.json";
import masterChefSingleRestakeABI from "./data/masterChefSingleRestakeABI.json";
import masterChefLpRestakeABI from "./data/masterChefLpRestakeABI.json";
import masterChef2SingleRestakeABI from "./data/masterChef2SingleRestakeABI.json";
import masterChef2LpRestakeABI from "./data/masterChef2LpRestakeABI.json";

const masterChefAddressResolver = (chainId: number) =>
  ({
    56: "0x73feaa1ee314f8c655e354234017be2193c9e24e",
  }[chainId]);
const masterChef2AddressResolver = (chainId: number) =>
  ({
    5: "0x946BD2cF228e9B458Ab09c8536550C41Bdd14512",
    56: "0xa5f8C5Dbd5F286960b9d90548680aE5ebFf07652",
  }[chainId]);
const liquidityRouterResolve = (chainId: number) =>
  ({
    5: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    56: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
  }[chainId]);
const routeTokens = ["0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"];

function masterChefProviderFactory(
  providerOrSigner: ethereum.ProviderOrSigner,
  networkId: number,
  blockTag: ethereum.BlockNumber
) {
  const provider = ethers.providers.Provider.isProvider(providerOrSigner)
    ? providerOrSigner
    : providerOrSigner.provider;
  if (!provider) throw new Error("Provider not found");
  const address = masterChefAddressResolver(networkId);
  if (!address) {
    throw new Error("Master chef contract not found for current network");
  }

  return masterChef.buildMasterChefProvider(
    new ethers.Contract(address, masterChefABI, providerOrSigner),
    { blockTag },
    {
      rewardToken() {
        return "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82";
      },
      poolInfo(poolIndex) {
        return this.contract
          .poolInfo(poolIndex, { blockTag: this.options.blockTag })
          .then(
            ({
              lpToken,
              allocPoint,
              accCakePerShare,
            }: {
              lpToken: string;
              allocPoint: ethersType.BigNumber;
              accCakePerShare: ethersType.BigNumber;
            }) => ({
              lpToken,
              allocPoint: ethereum.toBN(allocPoint),
              accRewardPerShare: ethereum.toBN(accCakePerShare),
            })
          );
      },
      async rewardPerSecond() {
        const avgBlockTime = await ethereum.getAvgBlockTime(provider, blockTag);
        return this.contract
          .cakePerBlock({ blockTag: this.options.blockTag })
          .then((v: ethersType.BigNumber) =>
            ethereum.toBN(v).multipliedBy(1000).div(avgBlockTime)
          );
      },
      pendingReward(poolIndex, wallet) {
        return this.contract.pendingCake(poolIndex, wallet).then(ethereum.toBN);
      },
    }
  );
}

function masterChef2ProviderFactory(
  providerOrSigner: ethereum.ProviderOrSigner,
  networkId: number,
  blockTag: ethereum.BlockNumber,
  poolIndex?: number
) {
  const provider = ethers.providers.Provider.isProvider(providerOrSigner)
    ? providerOrSigner
    : providerOrSigner.provider;
  if (!provider) throw new Error("Provider not found");
  const address = masterChef2AddressResolver(networkId);
  if (!address) {
    throw new Error("Master chef 2 contract not found for current network");
  }

  return masterChef.buildMasterChefProvider(
    new ethers.Contract(address, masterChef2ABI, providerOrSigner),
    { blockTag },
    {
      async totalAllocPoint() {
        const isRegular = poolIndex
          ? await this.contract
              .poolInfo(poolIndex, {
                blockTag: this.options.blockTag,
              })
              .then(({ isRegular }: { isRegular: boolean }) => isRegular)
          : true;

        return isRegular
          ? this.contract
              .totalRegularAllocPoint({ blockTag: this.options.blockTag })
              .then(ethereum.toBN)
          : this.contract
              .totalSpecialAllocPoint({ blockTag: this.options.blockTag })
              .then(ethereum.toBN);
      },
      rewardToken() {
        return this.contract.CAKE();
      },
      async poolInfo(poolIndex) {
        const lpToken = await this.contract.lpToken(poolIndex, {
          blockTag: this.options.blockTag,
        });

        return this.contract
          .poolInfo(poolIndex, { blockTag: this.options.blockTag })
          .then(
            ({
              allocPoint,
              accCakePerShare,
            }: {
              allocPoint: ethersType.BigNumber;
              accCakePerShare: ethersType.BigNumber;
            }) => ({
              lpToken,
              allocPoint: ethereum.toBN(allocPoint),
              accRewardPerShare: ethereum.toBN(accCakePerShare),
            })
          );
      },
      async rewardPerSecond() {
        const avgBlockTime = await ethereum.getAvgBlockTime(provider, blockTag);
        return this.contract
          .cakePerBlock({ blockTag: this.options.blockTag })
          .then((v: ethersType.BigNumber) =>
            ethereum.toBN(v).multipliedBy(1000).div(avgBlockTime)
          );
      },
      pendingReward(poolIndex, wallet) {
        return this.contract.pendingCake(poolIndex, wallet).then(ethereum.toBN);
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
        "pancakeswap",
        56,
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
        network,
        provider
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
        provider,
        network,
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
          etherscanAddressURL: "https://bscscan.com/address",
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
        "pancakeswap",
        56,
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
        network,
        provider,
      );

      const pool = masterChefSavedPools.find(
        (p) => p.stakingToken.toLowerCase() === contractAddress.toLowerCase()
      );
      if (!pool) {
        throw new Error("Pool is not found");
      }

      const masterChefProvider = masterChefProviderFactory(
        provider,
        network,
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
          etherscanAddressURL: "https://bscscan.com/address",
        }),
      };
    }
  ),
  masterChef2Pair: stakingAdapter(
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
      const networkId = await provider
        .getNetwork()
        .then(({ chainId }) => chainId);
      const masterChefSavedPools = await cache.read(
        "pancakeswap",
        networkId,
        "masterChef2Pools"
      );
      const block = await provider.getBlock(blockTag);
      const priceFeed = bridgeWrapperBuild(
        await dfh.getPriceFeeds(networkId),
        blockTag,
        block,
        network,
        provider,
        networkId
      );
      const multicall = new ethersMulticall.Provider(provider);
      await multicall.init();

      const pool = masterChefSavedPools.find(
        (p) => p.stakingToken.toLowerCase() === contractAddress.toLowerCase()
      );
      if (!pool) {
        throw new Error("Pool is not found");
      }

      const masterChefProvider = masterChef2ProviderFactory(
        provider,
        networkId,
        blockTag,
        pool.index
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
          etherscanAddressURL: "https://bscscan.com/address",
        }),
      };
    }
  ),
  masterChef2Single: stakingAdapter(
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
      const networkId = await provider
        .getNetwork()
        .then(({ chainId }) => chainId);
      const masterChefSavedPools = await cache.read(
        "pancakeswap",
        networkId,
        "masterChef2Pools"
      );
      const block = await provider.getBlock(blockTag);
      const priceFeed = bridgeWrapperBuild(
        await dfh.getPriceFeeds(networkId),
        blockTag,
        block,
        network,
        provider,
        networkId
      );

      const pool = masterChefSavedPools.find(
        (p) => p.stakingToken.toLowerCase() === contractAddress.toLowerCase()
      );
      if (!pool) {
        throw new Error("Pool is not found");
      }

      const masterChefProvider = masterChef2ProviderFactory(
        provider,
        networkId,
        blockTag,
        pool.index
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
          etherscanAddressURL: "https://bscscan.com/address",
        }),
      };
    }
  ),
  smartChefInitializable: stakingAdapter(
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
      const blockNumber = block.number;
      const priceFeed = bridgeWrapperBuild(
        await dfh.getPriceFeeds(network),
        blockTag,
        block,
        network,
        provider,
      );
      const avgBlockTime = await ethereum.getAvgBlockTime(
        provider,
        blockNumber
      );

      const contract = new ethers.Contract(
        contractAddress,
        smartChefInitializableABI,
        provider
      );
      const [rewardTokenAddress, stakedTokenAddress] = await Promise.all([
        contract.rewardToken().then((res: string) => res.toLowerCase()),
        contract.stakedToken().then((res: string) => res.toLowerCase()),
      ]);
      const [rewardTokenDecimals, stakedTokenDecimals] = await Promise.all([
        erc20
          .contract(provider, rewardTokenAddress)
          .decimals()
          .then((v: ethersType.BigNumber) => Number(v.toString())),
        erc20
          .contract(provider, stakedTokenAddress)
          .decimals()
          .then((v: ethersType.BigNumber) => Number(v.toString())),
      ]);
      const stakedTokenPriceUSD = await priceFeed(stakedTokenAddress);
      const rewardTokenPriceUSD = await priceFeed(rewardTokenAddress);
      const totalLocked = await erc20
        .contract(provider, stakedTokenAddress)
        .balanceOf(contractAddress, { blockTag })
        .then((v: ethersType.BigNumber) =>
          ethereum.toBN(v).div(`1e${stakedTokenDecimals}`)
        );
      const tvl = new bn(totalLocked).multipliedBy(stakedTokenPriceUSD);

      const bonusEndBlock = await contract
        .bonusEndBlock({ blockTag })
        .then(ethereum.toBN);
      const rewardPerBlock = await contract
        .rewardPerBlock({ blockTag })
        .then((v: ethersType.BigNumber) =>
          ethereum
            .toBN(v)
            .div(`1e${rewardTokenDecimals}`)
            .multipliedBy(bonusEndBlock.lte(blockNumber) ? 0 : 1)
        );

      const aprBlock = tvl.gt(0)
        ? rewardPerBlock.multipliedBy(rewardTokenPriceUSD).div(tvl)
        : new bn(0);
      const blocksPerDay = new bn((1000 * 60 * 60 * 24) / avgBlockTime);
      const aprDay = aprBlock.multipliedBy(blocksPerDay);
      const aprWeek = aprBlock.multipliedBy(blocksPerDay.multipliedBy(7));
      const aprMonth = aprBlock.multipliedBy(blocksPerDay.multipliedBy(30));
      const aprYear = aprBlock.multipliedBy(blocksPerDay.multipliedBy(365));

      return {
        stakeToken: {
          address: stakedTokenAddress,
          decimals: stakedTokenDecimals,
          priceUSD: stakedTokenPriceUSD.toString(10),
        },
        rewardToken: {
          address: rewardTokenAddress,
          decimals: rewardTokenDecimals,
          priceUSD: rewardTokenPriceUSD.toString(10),
        },
        metrics: {
          tvl: tvl.toString(10),
          aprDay: aprDay.toString(10),
          aprWeek: aprWeek.toString(10),
          aprMonth: aprMonth.toString(10),
          aprYear: aprYear.toString(10),
          tokenPerBlock: rewardPerBlock.toString(),
          rewardPerDay: rewardPerBlock.multipliedBy(blocksPerDay).toString(),
        },
        wallet: async (walletAddress) => {
          const { amount } = await contract.userInfo(walletAddress, {
            blockTag,
          });
          const balance = new bn(amount.toString()).div(
            `1e${stakedTokenDecimals}`
          );
          const earned = await contract
            .pendingReward(walletAddress, { blockTag })
            .then((v: ethersType.BigNumber) =>
              ethereum.toBN(v).div(`1e${rewardTokenDecimals}`)
            );
          const balanceUSD = balance.multipliedBy(stakedTokenPriceUSD);
          const earnedUSD = earned.multipliedBy(stakedTokenPriceUSD);

          return {
            staked: {
              [stakedTokenAddress]: {
                balance: balance.toString(10),
                usd: balanceUSD.toString(10),
              },
            },
            earned: {
              [rewardTokenAddress]: {
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
                token: stakedTokenAddress,
                data: {
                  balance: balance.toString(10),
                  usd: balanceUSD.toString(10),
                },
              },
              {
                token: rewardTokenAddress,
                data: {
                  balance: earned.toString(10),
                  usd: earnedUSD.toString(10),
                },
              }
            ),
          };
        },
        actions: async (walletAddress) => {
          if (options.signer === null) {
            throw new Error(
              "Signer not found, use options.signer for use actions"
            );
          }
          const { signer } = options;

          const stakingContract = contract.connect(signer);
          const rewardTokenContract = erc20
            .contract(provider, rewardTokenAddress)
            .connect(signer);
          const stakingTokenContract = erc20
            .contract(provider, stakedTokenAddress)
            .connect(signer);
          const [rewardTokenSymbol, stakingTokenSymbol] = await Promise.all([
            rewardTokenContract.symbol(),
            stakingTokenContract.symbol(),
          ]);
          const etherscanAddressURL = "https://bscscan.com/address";

          return {
            stake: {
              name: "staking-stake",
              methods: {
                symbol: () => stakingTokenSymbol,
                link: () =>
                  `${etherscanAddressURL}/${stakingTokenContract.address}`,
                balanceOf: () =>
                  stakingTokenContract
                    .balanceOf(walletAddress)
                    .then((v: ethersType.BigNumber) =>
                      ethereum
                        .toBN(v)
                        .div(`1e${stakedTokenDecimals}`)
                        .toString(10)
                    ),
                isApproved: async (amount: string) => {
                  const allowance = await stakingTokenContract
                    .allowance(walletAddress, stakingContract.address)
                    .then(ethereum.toBN);

                  return allowance.isGreaterThanOrEqualTo(
                    new bn(amount).multipliedBy(`1e${stakedTokenDecimals}`)
                  );
                },
                approve: async (amount: string) => ({
                  tx: await erc20.approveAll(
                    stakingTokenContract,
                    walletAddress,
                    stakingContract.address,
                    new bn(amount)
                      .multipliedBy(`1e${stakedTokenDecimals}`)
                      .toFixed(0)
                  ),
                }),
                can: async (amount: string) => {
                  if (amount === "") return Error("Invalid amount");

                  const amountInt = new bn(amount).multipliedBy(
                    `1e${stakedTokenDecimals}`
                  );
                  if (amountInt.isNaN() || amountInt.lte(0))
                    return Error("Invalid amount");

                  const balance = await stakingTokenContract
                    .balanceOf(walletAddress)
                    .then(ethereum.toBN);
                  if (amountInt.gt(balance))
                    return Error("Insufficient funds on the balance");

                  return true;
                },
                stake: async (amount: string) => ({
                  tx: await stakingContract.deposit(
                    new bn(amount)
                      .multipliedBy(`1e${stakedTokenDecimals}`)
                      .toFixed(0)
                  ),
                }),
              },
            },
            unstake: {
              name: "staking-unstake",
              methods: {
                symbol: () => stakingTokenSymbol,
                link: () =>
                  `${etherscanAddressURL}/${stakingTokenContract.address}`,
                balanceOf: () =>
                  stakingContract
                    .userInfo(walletAddress)
                    .then(({ amount }: { amount: ethersType.BigNumber }) =>
                      ethereum
                        .toBN(amount)
                        .div(`1e${stakedTokenDecimals}`)
                        .toString(10)
                    ),
                can: async (amount) => {
                  if (amount === "") return Error("Invalid amount");

                  const amountInt = new bn(amount).multipliedBy(
                    `1e${stakedTokenDecimals}`
                  );
                  if (amountInt.isNaN() || amountInt.lte(0))
                    return Error("Invalid amount");

                  const userInfo = await stakingContract.userInfo(
                    walletAddress
                  );
                  if (amountInt.isGreaterThan(userInfo.amount.toString())) {
                    return Error("Amount exceeds balance");
                  }

                  return true;
                },
                unstake: async (amount) => ({
                  tx: await stakingContract.withdraw(
                    new bn(amount)
                      .multipliedBy(`1e${stakedTokenDecimals}`)
                      .toFixed(0)
                  ),
                }),
              },
            },
            claim: {
              name: "staking-claim",
              methods: {
                symbol: () => rewardTokenSymbol,
                link: () =>
                  `${etherscanAddressURL}/${rewardTokenContract.address}`,
                balanceOf: () =>
                  stakingContract
                    .pendingReward(walletAddress)
                    .then((earned: ethersType.BigNumber) =>
                      ethereum
                        .toBN(earned)
                        .div(`1e${rewardTokenDecimals}`)
                        .toString(10)
                    ),
                can: async () => {
                  const earned = await stakingContract
                    .pendingReward(walletAddress)
                    .then(ethereum.toBN);
                  if (earned.isLessThanOrEqualTo(0)) {
                    return Error("No earnings");
                  }

                  return true;
                },
                claim: async () => ({
                  tx: await stakingContract.deposit(0),
                }),
              },
            },
            exit: {
              name: "staking-exit",
              methods: {
                can: async () => {
                  const earned = await stakingContract
                    .pendingReward(walletAddress)
                    .then(ethereum.toBN);
                  const amount = await stakingContract
                    .userInfo(walletAddress)
                    .then(({ amount }: { amount: ethersType.BigNumber }) =>
                      ethereum.toBN(amount)
                    );
                  if (
                    earned.isLessThanOrEqualTo(0) &&
                    amount.isLessThanOrEqualTo(0)
                  ) {
                    return Error("No staked");
                  }

                  return true;
                },
                exit: async () => {
                  const amount = await stakingContract
                    .userInfo(walletAddress)
                    .then(({ amount }: { amount: ethersType.BigNumber }) =>
                      ethereum.toBN(amount)
                    );
                  if (amount.isGreaterThan(0)) {
                    await stakingContract
                      .withdraw(amount.toFixed(0))
                      .then((tx: ethersType.ContractTransaction) => tx.wait());
                  }

                  return { tx: await stakingContract.deposit(0) };
                },
              },
            },
          };
        },
      };
    }
  ),
  automates: {
    contractsResolver: {
      default: contractsResolver(async (provider, options = {}) => {
        const networkId = await provider
          .getNetwork()
          .then(({ chainId }) => chainId);
        const multicall = new ethersMulticall.Provider(provider);
        await multicall.init();
        type ResolvedPool = ResolvedContract & {
          poolIndex: number;
          stakingToken: string;
        };

        const masterChefAddress = masterChefAddressResolver(networkId);
        let masterChefPools: ResolvedPool[] = [];
        if (masterChefAddress) {
          const masterChiefContract = new ethersMulticall.Contract(
            masterChefAddress,
            masterChefABI
          );
          const [totalPools] = await multicall.all([
            masterChiefContract.poolLength(),
          ]);
          const poolsIndex = Array.from(
            new Array(totalPools.toNumber()).keys()
          ).filter((poolIndex) => ![64, 105, 444].includes(poolIndex));
          const poolsInfo = await multicall.all(
            poolsIndex.map((poolIndex) =>
              masterChiefContract.poolInfo(poolIndex)
            )
          );
          const poolsStakingTokensSymbol = await multicall.all(
            poolsInfo.map(({ lpToken }) =>
              erc20.multicallContract(lpToken).symbol()
            )
          );

          masterChefPools = await Promise.all(
            poolsIndex.map(async (index, i) => {
              const info = poolsInfo[i];
              const stakingTokenSymbol = poolsStakingTokensSymbol[i];
              const isPair = stakingTokenSymbol === "Cake-LP";

              let token0Symbol, token1Symbol;
              if (isPair) {
                const [token0, token1] = await multicall.all([
                  uniswap.pair.multicallContract(info.lpToken).token0(),
                  uniswap.pair.multicallContract(info.lpToken).token1(),
                ]);
                const pairSymbols = await multicall.all([
                  erc20.multicallContract(token0).symbol(),
                  erc20.multicallContract(token1).symbol(),
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
                network: String(networkId),
                layout: "staking",
                adapter: isPair ? "masterChefPair" : "masterChefSingle",
                description: "",
                automate: {
                  /*
                  autorestakeAdapter: isPair
                    ? "MasterChefLpRestake"
                    : "MasterChefSingleRestake",
                    */
                  adapters: isPair ? ["masterChefPair"] : ["masterChefSingle"],
                  lpTokensManager: isPair
                    ? {
                        router: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
                        pair: info.lpToken,
                      }
                    : undefined,
                },
                link: "https://pancakeswap.finance/farms",
              };
            })
          );
          if (options.cacheAuth) {
            cache.write(
              options.cacheAuth,
              "pancakeswap",
              networkId,
              "masterChefPools",
              masterChefPools.map(({ poolIndex, stakingToken, adapter }) => ({
                index: poolIndex,
                stakingToken,
                type: adapter === "masterChefPair" ? "lp" : "single",
              }))
            );
          }
        }

        const masterChef2Address = masterChef2AddressResolver(networkId);
        let masterChef2Pools: ResolvedPool[] = [];
        if (masterChef2Address) {
          const liquidityRouter = liquidityRouterResolve(networkId);
          const contract = new ethersMulticall.Contract(
            masterChef2Address,
            masterChef2ABI
          );
          const [poolLength] = await multicall.all([contract.poolLength()]);
          const poolIndex = Array.from(new Array(poolLength.toNumber()).keys());
          const poolTokens = await multicall.all(
            poolIndex.map((poolIndex) => contract.lpToken(poolIndex))
          );
          const poolTokensSymbol = await multicall.all(
            poolTokens.map((lpToken) =>
              erc20.multicallContract(lpToken).symbol()
            )
          );

          masterChef2Pools = await Promise.all(
            poolIndex.map(async (index, i) => {
              const lpToken = poolTokens[i];
              const stakingTokenSymbol = poolTokensSymbol[i];
              const isPair = ["UNI-V2", "Cake-LP"].includes(stakingTokenSymbol);

              let token0Symbol, token1Symbol;
              if (isPair) {
                const [token0, token1] = await multicall.all([
                  uniswap.pair.multicallContract(lpToken).token0(),
                  uniswap.pair.multicallContract(lpToken).token1(),
                ]);
                const pairSymbols = await multicall.all([
                  erc20.multicallContract(token0).symbol(),
                  erc20.multicallContract(token1).symbol(),
                ]);
                token0Symbol = pairSymbols[0];
                token1Symbol = pairSymbols[1];
              }

              return {
                poolIndex: index,
                stakingToken: lpToken,
                name: isPair
                  ? `${token0Symbol}-${token1Symbol}`
                  : stakingTokenSymbol,
                address: lpToken,
                blockchain: "ethereum",
                network: String(networkId),
                layout: "staking",
                adapter: isPair ? "masterChef2Pair" : "masterChef2Single",
                description: "",
                automate: {
                  autorestakeAdapter: isPair
                    ? "MasterChef2LpRestake"
                    : "MasterChef2SingleRestake",
                  autorestakeStopLoss: true,
                  adapters: isPair
                    ? ["masterChef2Pair"]
                    : ["masterChef2Single"],
                  lpTokensManager:
                    isPair && liquidityRouter
                      ? {
                          router: liquidityRouter,
                          pair: lpToken,
                        }
                      : undefined,
                },
                link: "https://pancakeswap.finance/farms",
              };
            })
          );
          if (options.cacheAuth) {
            cache.write(
              options.cacheAuth,
              "pancakeswap",
              networkId,
              "masterChef2Pools",
              masterChef2Pools.map(({ poolIndex, stakingToken, adapter }) => ({
                index: poolIndex,
                stakingToken,
                type: adapter === "masterChef2Pair" ? "lp" : "single",
              }))
            );
          }
        }

        let chefInitializablePools: ResolvedContract[] = [];
        if (networkId === 56) {
          const chefInitializableAddresses = [
            "0x80762101bd79D6e7A175E9678d05c7f815b8D7d7",
            "0xAaF43935a526DF88AB57FC69b1d80a8d35e1De82",
            "0x921Ea7e12A66025F2BD287eDbff6dc5cEABd6477",
            "0xeAd7b8fc5F2E5672FAe9dCf14E902287F35CB169",
            "0x1c9E3972fdBa29b40954Bb7594Da6611998F8830",
            "0xa34832efe74133763A85060a64103542031B0A7E",
            "0x92c07c325cE7b340Da2591F5e9CbB1F5Bab73FCF",
            "0x25ca61796D786014FfE15E42aC11C7721d46E120",
            "0x1A777aE604CfBC265807A46Db2d228d4CC84E09D",
            "0x09e727c83a75fFdB729280639eDBf947dB76EeB7",
            "0x2718D56aE2b8F08B3076A409bBF729542233E451",
            "0x2461ea28907A2028b2bCa40040396F64B4141004",
            "0x1c0C7F3B07a42efb4e15679a9ed7e70B2d7Cc157",
            "0x56Bfb98EBEF4344dF2d88c6b80694Cba5EfC56c8",
            "0x9e31aef040941E67356519f44bcA07c5f82215e5",
          ];
          chefInitializablePools = await Promise.all(
            chefInitializableAddresses.map(async (address) => {
              const [stakedToken, rewardToken] = await multicall.all([
                new ethersMulticall.Contract(
                  address,
                  smartChefInitializableABI
                ).stakedToken(),
                new ethersMulticall.Contract(
                  address,
                  smartChefInitializableABI
                ).rewardToken(),
              ]);
              const [stakingTokenSymbol, rewardTokenSymbol] =
                await multicall.all([
                  erc20.multicallContract(stakedToken).symbol(),
                  erc20.multicallContract(rewardToken).symbol(),
                ]);

              return {
                stakingToken: stakedToken,
                name: `${rewardTokenSymbol} from ${stakingTokenSymbol}`,
                address,
                blockchain: "ethereum",
                network: String(networkId),
                layout: "staking",
                adapter: "smartChefInitializable",
                description: "",
                automate: {
                  // autorestakeAdapter: "SmartChefInitializableRestake",
                  adapters: ["smartChefInitializable"],
                },
                link: "https://pancakeswap.finance/pools",
              };
            })
          );
          if (options.cacheAuth) {
            cache.write(
              options.cacheAuth,
              "pancakeswap",
              networkId,
              "smartChefInitializableContracts",
              chefInitializablePools.map(({ address }) => ({
                stakingContract: address,
              }))
            );
          }
        }

        return [
          ...masterChefPools,
          ...masterChef2Pools,
          ...chefInitializablePools,
        ];
      }),
    },
    deploy: {
      MasterChefLpRestake: masterChef.stakingAutomateDeployTabs({
        liquidityRouterResolve,
        stakingAddressResolve: masterChefAddressResolver,
        poolsLoader: () =>
          cache
            .read("pancakeswap", 56, "masterChefPools")
            .then((pools) => pools.filter(({ type }) => type === "lp")),
      }),
      MasterChefSingleRestake: masterChef.stakingAutomateDeployTabs({
        liquidityRouterResolve,
        stakingAddressResolve: masterChefAddressResolver,
        poolsLoader: () =>
          cache
            .read("pancakeswap", 56, "masterChefPools")
            .then((pools) => pools.filter(({ type }) => type === "single")),
      }),
      MasterChef2LpRestake: masterChef.stakingAutomateDeployTabs({
        liquidityRouterResolve,
        stakingAddressResolve: masterChef2AddressResolver,
        poolsLoader: (networkId) =>
          cache
            .read("pancakeswap", networkId, "masterChef2Pools")
            .then((pools) => pools.filter(({ type }) => type === "lp")),
      }),
      MasterChef2SingleRestake: masterChef.stakingAutomateDeployTabs({
        liquidityRouterResolve,
        stakingAddressResolve: masterChef2AddressResolver,
        poolsLoader: (networkId) =>
          cache
            .read("pancakeswap", networkId, "masterChef2Pools")
            .then((pools) => pools.filter(({ type }) => type === "single")),
      }),
      SmartChefInitializableRestake: deployAdapter(
        async (
          signer,
          factoryAddress,
          prototypeAddress,
          contractAddress = undefined
        ) => {
          const networkId = await signer.getChainId();
          const stakingContracts = await cache.read(
            "pancakeswap",
            networkId,
            "smartChefInitializableContracts"
          );
          const stakingContract =
            contractAddress ?? stakingContracts[0].stakingContract;

          return {
            deploy: [
              {
                name: "Deploy",
                info: async () => ({
                  description: "Deploy your own contract",
                  inputs: [
                    Action.input({
                      placeholder: "Liquidity pool router address",
                      value: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
                    }),
                    Action.input({
                      placeholder: "Slippage (percent)",
                      value: "1",
                    }),
                    Action.input({
                      placeholder: "Deadline (seconds)",
                      value: "300",
                    }),
                  ],
                }),
                can: async (router, slippage, deadline) => {
                  if (slippage < 0 || slippage > 100)
                    return new Error("Invalid slippage percent");
                  if (deadline < 0)
                    return new Error("Deadline has already passed");

                  return true;
                },
                send: async (router, slippage, deadline) =>
                  Deploy.deploy(
                    signer,
                    factoryAddress,
                    prototypeAddress,
                    new ethers.utils.Interface(
                      smartChefInitializableRestakeABI
                    ).encodeFunctionData("init", [
                      stakingContract,
                      router,
                      Math.floor(slippage * 100),
                      deadline,
                    ])
                  ),
              },
            ],
          };
        }
      ),
    },
    MasterChefLpRestake: async (
      signer: ethersType.Signer,
      contractAddress: string
    ) => {
      const chainId = await signer.getChainId();
      return masterChef.stakingPairAutomateAdapter({
        masterChefProvider: masterChefProviderFactory(
          signer,
          chainId,
          "latest"
        ),
        automateABI: masterChefLpRestakeABI,
        stakingABI: masterChefABI,
        routeTokens,
      })(signer, contractAddress);
    },
    MasterChef2LpRestake: async (
      ethSigner: ethersType.Signer,
      contractAddress: string
    ) => {
      const signer = new ethereum.Signer(ethSigner);
      const chainId = await signer.chainId;
      const masterChefProvider = masterChef2ProviderFactory(
        signer.signer,
        chainId,
        "latest"
      );
      const automate = signer.contract(
        masterChef2LpRestakeABI,
        contractAddress
      );

      return {
        deposit: mixComponent(
          await masterChef.AutoRestake.useDeposit({
            signer,
            automate,
          }),
          {
            tokenPriceUSD: uniswap.pair.usePriceUSD({
              pair: await uniswap.pair.PairInfo.create(
                await signer.multicall,
                await automate.contract.stakingToken()
              ),
              network: await signer.chainId,
            }),
          }
        ),
        refund: await masterChef.AutoRestake.useRefund({
          signer,
          automate,
          masterChefProvider,
        }),
        migrate: await masterChef.AutoRestake.useMigrate({
          signer,
          automate,
          masterChefProvider,
        }),
        run: await masterChef.AutoRestake.usePairRun({
          signer,
          automate,
          masterChefProvider,
          routeTokens,
        }),
        stopLoss:
          await masterChef.AutoRestake.StopLoss.usePairStopLossComponent({
            signer,
            automate,
            masterChef: masterChefProvider,
            middleTokens: routeTokens,
          }),
      };
    },
    MasterChefSingleRestake: async (
      signer: ethersType.Signer,
      contractAddress: string
    ) => {
      const chainId = await signer.getChainId();
      return masterChef.stakingSingleAutomateAdapter({
        masterChefProvider: masterChefProviderFactory(
          signer,
          chainId,
          "latest"
        ),
        automateABI: masterChefSingleRestakeABI,
        stakingABI: masterChefABI,
        routeTokens,
      })(signer, contractAddress);
    },
    MasterChef2SingleRestake: async (
      ethSigner: ethersType.Signer,
      contractAddress: string
    ) => {
      const signer = new ethereum.Signer(ethSigner);
      const chainId = await signer.chainId;
      const masterChefProvider = masterChef2ProviderFactory(
        signer.signer,
        chainId,
        "latest"
      );
      const automate = signer.contract(
        masterChef2SingleRestakeABI,
        contractAddress
      );

      return {
        deposit: await masterChef.AutoRestake.useDeposit({ signer, automate }),
        refund: await masterChef.AutoRestake.useRefund({
          signer,
          automate,
          masterChefProvider,
        }),
        migrate: await masterChef.AutoRestake.useMigrate({
          signer,
          automate,
          masterChefProvider,
        }),
        run: await masterChef.AutoRestake.useSingleRun({
          signer,
          automate,
          masterChefProvider,
          routeTokens,
        }),
        stopLoss:
          await masterChef.AutoRestake.StopLoss.useSingleStopLossComponent({
            signer,
            automate,
            masterChef: masterChefProvider,
            middleTokens: routeTokens,
          }),
      };
    },
    SmartChefInitializableRestake: automateAdapter(
      async (signer, contractAddress) => {
        if (!signer.provider) throw new Error("Provider not found");
        const provider = signer.provider;
        const signerAddress = await signer.getAddress();
        const automate = new ethers.Contract(
          contractAddress,
          smartChefInitializableRestakeABI,
          signer
        );
        const stakingAddress = await automate.staking();
        const staking = new ethers.Contract(
          stakingAddress,
          smartChefInitializableABI,
          signer
        );
        const stakingTokenAddress = await automate.stakingToken();
        const stakingToken = erc20.contract(signer, stakingTokenAddress);
        const stakingTokenDecimals = await stakingToken
          .decimals()
          .then((v: ethersType.BigNumber) => Number(v.toString()));
        const stakingTokenSymbol = await stakingToken.symbol();

        const deposit: Automate.AdapterActions["deposit"] = {
          name: "automateRestake-deposit",
          methods: {
            tokenAddress: () => stakingTokenAddress,
            symbol: () => stakingTokenSymbol,
            tokenPriceUSD: () => Promise.resolve("0"),
            balanceOf: () =>
              stakingToken
                .balanceOf(signerAddress)
                .then((v: ethersType.BigNumber) =>
                  ethereum.toBN(v).div(`1e${stakingTokenDecimals}`).toString(10)
                ),
            canTransfer: async (amount: string) => {
              const signerBalance = await stakingToken
                .balanceOf(signerAddress)
                .then(ethereum.toBN);
              const amountInt = new bn(amount).multipliedBy(
                `1e${stakingTokenDecimals}`
              );
              if (amountInt.lte(0)) {
                return Error("Invalid amount");
              }
              if (amountInt.gt(signerBalance)) {
                return Error("Insufficient funds on the balance");
              }

              return true;
            },
            transfer: async (amount: string) => ({
              tx: await stakingToken.transfer(
                automate.address,
                new bn(amount)
                  .multipliedBy(`1e${stakingTokenDecimals}`)
                  .toFixed(0)
              ),
            }),
            transferred: () =>
              stakingToken
                .balanceOf(automate.address)
                .then((v: ethersType.BigNumber) =>
                  ethereum.toBN(v).div(`1e${stakingTokenDecimals}`).toString(10)
                ),
            canDeposit: async () => {
              const automateBalance = await stakingToken
                .balanceOf(automate.address)
                .then(ethereum.toBN);
              if (automateBalance.lte(0)) {
                return new Error(
                  "Insufficient funds on the automate contract balance"
                );
              }
              const automateOwner = await automate.owner();
              if (signerAddress.toLowerCase() !== automateOwner.toLowerCase()) {
                return new Error("Someone else contract");
              }

              return true;
            },
            deposit: async () => ({
              tx: await automate.deposit(),
            }),
          },
        };
        const refund: Automate.AdapterActions["refund"] = {
          name: "automateRestake-refund",
          methods: {
            tokenAddress: () => stakingTokenAddress,
            symbol: () => stakingTokenSymbol,
            staked: () =>
              staking
                .userInfo(automate.address)
                .then(({ amount }: { amount: ethersType.BigNumber }) =>
                  ethereum
                    .toBN(amount)
                    .div(`1e${stakingTokenDecimals}`)
                    .toString(10)
                ),
            can: async () => {
              const automateStaked = staking
                .userInfo(automate.address)
                .then(({ amount }: { amount: ethersType.BigNumber }) =>
                  ethereum
                    .toBN(amount)
                    .div(`1e${stakingTokenDecimals}`)
                    .toString(10)
                );
              if (automateStaked.lte(0)) {
                return new Error(
                  "Insufficient funds on the automate contract balance"
                );
              }
              const automateOwner = await automate.owner();
              if (signerAddress.toLowerCase() !== automateOwner.toLowerCase()) {
                return new Error("Someone else contract");
              }

              return true;
            },
            refund: async () => ({
              tx: await automate.refund(),
            }),
          },
        };
        const migrate: Automate.AdapterActions["migrate"] = {
          name: "automateRestake-migrate",
          methods: {
            staked: () =>
              staking
                .userInfo(signerAddress)
                .then(({ amount }: { amount: ethersType.BigNumber }) =>
                  ethereum
                    .toBN(amount)
                    .div(`1e${stakingTokenDecimals}`)
                    .toString(10)
                ),
            canWithdraw: async () => {
              const ownerStaked = staking
                .userInfo(signerAddress)
                .then(({ amount }: { amount: ethersType.BigNumber }) =>
                  ethereum.toBN(amount)
                );
              if (ownerStaked.lte(0)) {
                return new Error("Insufficient funds on the staking");
              }

              return true;
            },
            withdraw: async () => {
              const amount = staking
                .userInfo(signerAddress)
                .then(({ amount }: { amount: ethersType.BigNumber }) =>
                  ethereum.toBN(amount)
                );

              return {
                tx: await staking.withdraw(amount.toFixed(10)),
              };
            },
            ...deposit.methods,
          },
        };
        const runParams = async () => {
          const multicall = new ethersMulticall.Provider(provider);
          await multicall.init();
          const automateMulticall = new ethersMulticall.Contract(
            contractAddress,
            smartChefInitializableRestakeABI
          );

          const [
            routerAddress,
            slippagePercent,
            deadlineSeconds,
            rewardTokenAddress,
          ] = await multicall.all([
            automateMulticall.liquidityRouter(),
            automateMulticall.slippage(),
            automateMulticall.deadline(),
            automateMulticall.rewardToken(),
          ]);

          const rewardToken = erc20.contract(provider, rewardTokenAddress);
          const rewardTokenBalance = await rewardToken
            .balanceOf(contractAddress)
            .then(ethereum.toBN);
          const pendingReward = await staking
            .pendingReward(contractAddress)
            .then(ethereum.toBN);
          const earned = new bn(pendingReward).plus(rewardTokenBalance);
          if (earned.toString(10) === "0") return new Error("No earned");

          const router = uniswap.router.contract(provider, routerAddress);
          const slippage = 1 - slippagePercent / 10000;
          const tokenAmountIn = earned.toFixed(0);
          const swap = [[rewardTokenAddress, stakingTokenAddress], "0"];
          if (
            stakingTokenAddress.toLowerCase() !==
            rewardTokenAddress.toLowerCase()
          ) {
            const { path, amountOut } = await uniswap.router.autoRoute(
              router,
              tokenAmountIn,
              rewardTokenAddress,
              stakingTokenAddress,
              routeTokens
            );
            swap[0] = path;
            swap[1] = new bn(amountOut).multipliedBy(slippage).toFixed(0);
          }

          const deadline = dayjs().add(deadlineSeconds, "seconds").unix();

          const gasLimit = new bn(
            await automate.estimateGas
              .run(0, deadline, swap)
              .then((v) => v.toString())
          )
            .multipliedBy(1.1)
            .toFixed(0);
          const gasPrice = await signer.getGasPrice().then((v) => v.toString());
          const gasFee = new bn(gasLimit).multipliedBy(gasPrice).toFixed(0);

          await automate.estimateGas.run(gasFee, deadline, swap);
          return {
            gasPrice,
            gasLimit,
            calldata: [gasFee, deadline, swap],
          };
        };
        const run = async () => {
          const params = await runParams();
          if (params instanceof Error) return params;

          const { gasPrice, gasLimit, calldata } = params;
          return automate.run.apply(automate, [
            ...calldata,
            {
              gasPrice,
              gasLimit,
            },
          ]);
        };

        return {
          contract: contractAddress,
          deposit,
          refund,
          migrate,
          runParams,
          run,
        };
      }
    ),
  },
};

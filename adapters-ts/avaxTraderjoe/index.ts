import type ethersType from "ethers";
import { ethers, bignumber as bn, ethersMulticall } from "../lib";
import { debug, debugo } from "../utils/base";
import * as ethereum from "../utils/ethereum/base";
import * as erc20 from "../utils/ethereum/erc20";
import { V2 as uniswap } from "../utils/ethereum/uniswap";
import { bridgeWrapperBuild } from "../utils/coingecko";
import * as masterChef from "../utils/ethereum/adapter/masterChef";
import * as cache from "../utils/cache";
import * as dfh from "../utils/dfh";
import * as govSwap from "../utils/ethereum/adapter/govSwap";
import { Staking, ResolvedContract } from "../utils/adapter/base";
import {
  stakingAdapter,
  contractsResolver,
  governanceSwapAdapter,
} from "../utils/ethereum/adapter/base";
import masterChefV2ABI from "./data/masterChefV2ABI.json";
import masterChefV3ABI from "./data/masterChefV3ABI.json";
import boostedMasterChefJoeABI from "./data/boostedMasterChefJoe.json";

import xJoeTokenABI from "./data/xJoeTokenABI.json";
import masterChefV2LpRestakeABI from "./data/masterChefV2LpRestakeABI.json";
import masterChefV2SingleRestakeABI from "./data/masterChefV2SingleRestakeABI.json";
import masterChefV3LpRestakeABI from "./data/masterChefV3LpRestakeABI.json";
import boostedMasterChefJoeLpRestakeABI from "./data/boostedMasterChefJoeLpRestakeABI.json";

const masterChefV2Address = "0xd6a4F121CA35509aF06A0Be99093d08462f53052";
const masterChefV3Address = "0x188bED1968b795d5c9022F6a0bb5931Ac4c18F00";
const boostedMasterChefJoeAddress = "0x4483f0b6e2F5486D06958C20f8C39A7aBe87bf8F";

const routeTokens = ["0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7"];

function masterChefProviderFactory(
  address: string,
  abi: any,
  providerOrSigner: ethereum.ProviderOrSigner,
  blockTag: ethereum.BlockNumber
) {
  return masterChef.buildMasterChefProvider(
    new ethers.Contract(address, abi, providerOrSigner),
    { blockTag },
    {
      rewardToken() {
        return "0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd";
      },
      poolInfo(poolIndex) {
        return this.contract
          .poolInfo(poolIndex, { blockTag: this.options.blockTag })
          .then(
            ({
              lpToken,
              allocPoint,
              accJoePerShare,
            }: {
              lpToken: string;
              allocPoint: ethersType.BigNumber;
              accJoePerShare: ethersType.BigNumber;
            }) => ({
              lpToken,
              allocPoint: ethereum.toBN(allocPoint),
              accRewardPerShare: ethereum.toBN(accJoePerShare),
            })
          );
      },
      rewardPerSecond() {
        return this.contract
          .joePerSec({ blockTag: this.options.blockTag })
          .then(ethereum.toBN);
      },
      pendingReward(poolIndex, wallet) {
        return this.contract
          .pendingTokens(poolIndex, wallet)
          .then(({ pendingJoe }: { pendingJoe: ethersType.BigNumber }) =>
            ethereum.toBN(pendingJoe)
          );
      },
    }
  );
}

const masterChefV2ProviderFactory = masterChefProviderFactory.bind(
  null,
  masterChefV2Address,
  masterChefV2ABI
);

const masterChefV3ProviderFactory = masterChefProviderFactory.bind(
  null,
  masterChefV3Address,
  masterChefV3ABI
);

const boostedMasterChefJoeProviderFactory = masterChefProviderFactory.bind(
  null,
  boostedMasterChefJoeAddress,
  boostedMasterChefJoeABI
);

module.exports = {
  masterChefV2Pair: stakingAdapter(
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
        "avaxTraderjoe",
        "masterChefV2Pools"
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

      const masterChefProvider = masterChefV2ProviderFactory(
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

      const [
        rewardPerSecond,
        totalAllocPoint,
        devPercent,
        treasuryPercent,
        investorPercent,
      ] = await Promise.all([
        masterChefProvider.rewardPerSecond(),
        masterChefProvider.totalAllocPoint(),
        masterChefProvider.contract
          .devPercent({ blockTag })
          .then(ethereum.toBN),
        masterChefProvider.contract
          .treasuryPercent({ blockTag })
          .then(ethereum.toBN),
        masterChefProvider.contract
          .investorPercent({ blockTag })
          .then(ethereum.toBN),
      ]);
      const lpPercent = new bn(1000)
        .minus(devPercent)
        .minus(treasuryPercent)
        .minus(investorPercent)
        .div(1000);
      const rewardPerSec = poolInfo.allocPoint
        .multipliedBy(rewardPerSecond)
        .div(totalAllocPoint)
        .multipliedBy(lpPercent)
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
  masterChefV2Single: stakingAdapter(
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
        "avaxTraderjoe",
        "masterChefV2Pools"
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

      const masterChefProvider = masterChefV2ProviderFactory(
        provider,
        blockTag
      );
      const poolInfo = await masterChefProvider.poolInfo(pool.index);

      const rewardToken = await masterChefProvider.rewardToken();
      const rewardTokenDecimals = 18;
      const rewardTokenPriceUSD = await priceFeed(rewardToken);
      const stakingToken = await masterChefProvider.stakingToken(poolInfo);
      const stakingTokenDecimals = await erc20
        .contract(provider, stakingToken)
        .decimals()
        .then((v: ethersType.BigNumber) => Number(v.toString()));
      let stakingTokenPriceUSD = new bn("0");
      // xJoe price feed
      if (
        stakingToken.toLowerCase() ===
        "0x57319d41f71e81f3c65f2a47ca4e001ebafd4f33"
      ) {
        const [xJoeTotalSupply, joeBalance, joePriceUSD] = await Promise.all([
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
        stakingTokenPriceUSD = joeBalance
          .div(xJoeTotalSupply)
          .multipliedBy(joePriceUSD);
      } else {
        stakingTokenPriceUSD = await priceFeed(stakingToken);
      }

      const totalLocked = await masterChefProvider
        .totalLocked(poolInfo)
        .then((v) => v.div(`1e${stakingTokenDecimals}`));
      const tvl = new bn(totalLocked).multipliedBy(stakingTokenPriceUSD);

      const [
        rewardPerSecond,
        totalAllocPoint,
        devPercent,
        treasuryPercent,
        investorPercent,
      ] = await Promise.all([
        masterChefProvider.rewardPerSecond(),
        masterChefProvider.totalAllocPoint(),
        masterChefProvider.contract
          .devPercent({ blockTag })
          .then(ethereum.toBN),
        masterChefProvider.contract
          .treasuryPercent({ blockTag })
          .then(ethereum.toBN),
        masterChefProvider.contract
          .investorPercent({ blockTag })
          .then(ethereum.toBN),
      ]);
      const lpPercent = new bn(1000)
        .minus(devPercent)
        .minus(treasuryPercent)
        .minus(investorPercent)
        .div(1000);
      const rewardPerSec = poolInfo.allocPoint
        .multipliedBy(rewardPerSecond)
        .div(totalAllocPoint)
        .multipliedBy(lpPercent)
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
          etherscanAddressURL: "https://snowtrace.io/address",
        }),
      };
    }
  ),
  masterChefV3Pair: stakingAdapter(
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
        "avaxTraderjoe",
        "masterChefV3Pools"
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

      const masterChefProvider = masterChefV3ProviderFactory(
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
  boostedMasterChefJoePair: stakingAdapter(
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
        "avaxTraderjoe",
        "boostedMasterChefJoePools"
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

      const masterChefProvider = boostedMasterChefJoeProviderFactory(
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
  xJoe: governanceSwapAdapter(
    async (provider, xJoeAddress, initOptions = ethereum.defaultOptions()) => {
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

      const joeAddress = "0x6e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd";
      const joeContract = erc20.contract(provider, joeAddress);
      const joeDecimals = 18;
      const xJoeContract = new ethers.Contract(
        xJoeAddress,
        xJoeTokenABI,
        provider
      );
      const xJoeDecimals = 18;

      const [joeBalance, joePriceUSD] = await Promise.all([
        joeContract
          .balanceOf(xJoeAddress, { blockTag })
          .then((v: ethersType.BigNumber) =>
            ethereum.toBN(v).div(`1e${joeDecimals}`)
          ),
        priceFeed(joeAddress),
      ]);
      const tvl = joeBalance.multipliedBy(joePriceUSD);

      return {
        stakeToken: {
          address: joeAddress,
          decimals: joeDecimals,
          priceUSD: joePriceUSD.toString(10),
        },
        rewardToken: {
          address: xJoeAddress,
          decimals: xJoeDecimals,
          priceUSD: joePriceUSD.toString(10),
        },
        metrics: {
          tvl: tvl.toString(10),
          aprDay: "0",
          aprWeek: "0",
          aprMonth: "0",
          aprYear: "0",
        },
        wallet: async (walletAddress) => {
          const [xJoeBalance, joeBalance, xJoeTotalSupply, joePriceUSD] =
            await Promise.all([
              xJoeContract
                .balanceOf(walletAddress, { blockTag })
                .then((v: ethersType.BigNumber) =>
                  new bn(v.toString()).div(`1e${xJoeDecimals}`)
                ),
              joeContract
                .balanceOf(xJoeAddress, { blockTag })
                .then((v: ethersType.BigNumber) =>
                  new bn(v.toString()).div(`1e${joeDecimals}`)
                ),
              xJoeContract
                .totalSupply({ blockTag })
                .then((v: ethersType.BigNumber) =>
                  new bn(v.toString()).div(`1e${xJoeDecimals}`)
                ),
              priceFeed(joeAddress),
            ]);
          const k = joeBalance.div(xJoeTotalSupply);
          const balance = xJoeBalance.multipliedBy(k);
          const balanceUSD = balance.multipliedBy(joePriceUSD);
          const earned = xJoeBalance;
          const earnedUSD = balanceUSD;

          return {
            staked: {
              [joeAddress]: {
                balance: balance.toString(10),
                usd: balanceUSD.toString(10),
              },
            },
            earned: {
              [xJoeAddress]: {
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
                token: joeAddress,
                data: {
                  balance: balance.toString(10),
                  usd: balanceUSD.toString(10),
                },
              },
              {
                token: xJoeAddress,
                data: {
                  balance: earned.toString(10),
                  usd: earnedUSD.toString(10),
                },
              }
            ),
          };
        },
        actions: govSwap.actionComponents({
          tokenContract: joeContract,
          govContract: xJoeContract,
          getTokenSymbol: () => "JOE",
          getTokenDecimals: () => joeDecimals,
          getGovSymbol: () => "xJOE",
          getGovDecimals: () => xJoeDecimals,
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

        const masterChiefV2Contract = new ethersMulticall.Contract(
          masterChefV2Address,
          masterChefV2ABI
        );
        const masterChiefV3Contract = new ethersMulticall.Contract(
          masterChefV3Address,
          masterChefV3ABI
        );
        const boostedMasterChefJoeContract = new ethersMulticall.Contract(
          boostedMasterChefJoeAddress,
          boostedMasterChefJoeABI
        );

        const [totalPoolsV2, totalPoolsV3, totalBoostedMasterChefJoePools] = await multicall.all([
          masterChiefV2Contract.poolLength(),
          masterChiefV3Contract.poolLength(),
          boostedMasterChefJoeContract.poolLength(),
        ]);

        const poolsV2Index = Array.from(
          new Array(totalPoolsV2.toNumber()).keys()
        );
        const poolsV3Index = Array.from(
          new Array(totalPoolsV3.toNumber()).keys()
        );
        const totalBoostedMasterChefJoePoolsIndex = Array.from(
          new Array(totalBoostedMasterChefJoePools.toNumber()).keys()
        );

        const poolsV2Info = await multicall.all(
          poolsV2Index.map((poolIndex) =>
            masterChiefV2Contract.poolInfo(poolIndex)
          )
        );
        const poolsV3Info = await multicall.all(
          poolsV3Index.map((poolIndex) =>
            masterChiefV3Contract.poolInfo(poolIndex)
          )
        );
        const totalBoostedMasterChefJoeInfo = await multicall.all(
          totalBoostedMasterChefJoePoolsIndex.map((poolIndex) =>
            boostedMasterChefJoeContract.poolInfo(poolIndex)
          )
        );
        const poolsV2StakingTokensSymbol: string[] = await multicall.all(
          poolsV2Info.map(({ lpToken }) =>
            new ethersMulticall.Contract(lpToken, erc20.abi).symbol()
          )
        );
        const poolsV3StakingTokensSymbol: string[] = await multicall.all(
          poolsV3Info.map(({ lpToken }) =>
            new ethersMulticall.Contract(lpToken, erc20.abi).symbol()
          )
        );
        const boostedMasterChefJoeStakingTokensSymbol: string[] = await multicall.all(
          totalBoostedMasterChefJoeInfo.map(({ lpToken }) =>
            new ethersMulticall.Contract(lpToken, erc20.abi).symbol()
          )
        );
        type ResolvedPool = ResolvedContract & {
          poolIndex: number;
          stakingToken: string;
        };

        const poolsV2: Array<ResolvedPool> = await Promise.all(
          poolsV2Info.map(async (info, index) => {
            const stakingTokenSymbol = poolsV2StakingTokensSymbol[index];
            const isPair = stakingTokenSymbol === "JLP";

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

            let autorestakeAdapter = undefined;
            if (isPair) {
              autorestakeAdapter = "MasterChefV2LpRestake";
            }
            // Skip xJoe autorestake
            else if (
              info.lpToken.toLowerCase() !==
              "0x57319d41f71e81f3c65f2a47ca4e001ebafd4f33"
            ) {
              autorestakeAdapter = "MasterChefV2SingleRestake";
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
              adapter: isPair ? "masterChefV2Pair" : "masterChefV2Single",
              description: "",
              automate: {
                autorestakeAdapter,
                adapters: isPair
                  ? ["masterChefV2Pair"]
                  : ["masterChefV2Single"],
                lpTokensManager: isPair
                  ? {
                      router: "0x60aE616a2155Ee3d9A68541Ba4544862310933d4",
                      pair: info.lpToken,
                    }
                  : undefined,
              },
              link: `https://traderjoexyz.com/farm/${info.lpToken}-${masterChefV2Address}`,
            };
          })
        );
        const poolsV3: Array<ResolvedPool> = await Promise.all(
          poolsV3Info.map(async (info, index) => {
            const stakingTokenSymbol = poolsV3StakingTokensSymbol[index];
            const isPair = stakingTokenSymbol === "JLP";
            if (!isPair) return null;

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
              adapter: isPair ? "masterChefV3Pair" : "masterChefV3Single",
              description: "",
              automate: {
                autorestakeAdapter: isPair
                  ? "MasterChefV3LpRestake"
                  : "MasterChefV3SingleRestake",
                adapters: isPair
                  ? ["masterChefV3Pair"]
                  : ["masterChefV3Single"],
                lpTokensManager: isPair
                  ? {
                      router: "0x60aE616a2155Ee3d9A68541Ba4544862310933d4",
                      pair: info.lpToken,
                    }
                  : undefined,
              },
              link: `https://traderjoexyz.com/farm/${info.lpToken}-${masterChefV3Address}`,
            } as ResolvedContract & { poolIndex: number; stakingToken: string };
          })
        ).then((pools) =>
          pools.filter((pool): pool is ResolvedPool => pool !== null)
        );

        const boostedMasterChefJoePools: Array<ResolvedPool> = await Promise.all(
          totalBoostedMasterChefJoeInfo.map(async (info, index) => {
            const stakingTokenSymbol = boostedMasterChefJoeStakingTokensSymbol[index];
            const isPair = stakingTokenSymbol === "JLP";
            if (!isPair) return null;

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
              adapter: isPair ? "boostedMasterChefJoePair" : "boostedMasterChefJoeSingle",
              description: "",
              automate: {
                autorestakeAdapter: isPair
                  ? "boostedMasterChefJoeLpRestake"
                  : "boostedMasterChefJoeSingleRestake",
                adapters: isPair
                  ? ["boostedMasterChefJoePair"]
                  : ["boostedMasterChefJoeSingle"],
                lpTokensManager: isPair
                  ? {
                    router: "0x60aE616a2155Ee3d9A68541Ba4544862310933d4",
                    pair: info.lpToken,
                  }
                  : undefined,
              },
              link: `https://traderjoexyz.com/farm/${info.lpToken}-${masterChefV3Address}`,
            } as ResolvedContract & { poolIndex: number; stakingToken: string };
          })
        ).then((pools) =>
          pools.filter((pool): pool is ResolvedPool => pool !== null)
        );

        if (options.cacheAuth) {
          cache.write(
            options.cacheAuth,
            "avaxTraderjoe",
            "masterChefV2Pools",
            poolsV2.map(({ poolIndex, stakingToken, adapter }) => ({
              index: poolIndex,
              stakingToken,
              type: adapter === "masterChefV2Pair" ? "lp" : "single",
            }))
          );
          cache.write(
            options.cacheAuth,
            "avaxTraderjoe",
            "masterChefV3Pools",
            poolsV3.map(({ poolIndex, stakingToken, adapter }) => ({
              index: poolIndex,
              stakingToken,
              type: adapter === "masterChefV3Pair" ? "lp" : "single",
            }))
          );
          cache.write(
            options.cacheAuth,
            "avaxTraderjoe",
            "boostedMasterChefJoePools",
            boostedMasterChefJoePools.map(({ poolIndex, stakingToken, adapter }) => ({
              index: poolIndex,
              stakingToken,
              type: adapter === "boostedMasterChefJoePair" ? "lp" : "single",
            }))
          );
        }

        return [...poolsV2, ...poolsV3, ...boostedMasterChefJoePools];
      }),
    },
    deploy: {
      MasterChefV2LpRestake: masterChef.stakingAutomateDeployTabs({
        liquidityRouter: "0x60aE616a2155Ee3d9A68541Ba4544862310933d4",
        stakingAddress: masterChefV2Address,
        poolsLoader: () =>
          cache
            .read("avaxTraderjoe", "masterChefV2Pools")
            .then((pools) => pools.filter(({ type }) => type === "lp")),
      }),
      MasterChefV2SingleRestake: masterChef.stakingAutomateDeployTabs({
        liquidityRouter: "0x60aE616a2155Ee3d9A68541Ba4544862310933d4",
        stakingAddress: masterChefV2Address,
        poolsLoader: () =>
          cache
            .read("avaxTraderjoe", "masterChefV2Pools")
            .then((pools) => pools.filter(({ type }) => type === "single")),
      }),
      MasterChefV3LpRestake2: masterChef.stakingAutomateDeployTabs({
        liquidityRouter: "0x60aE616a2155Ee3d9A68541Ba4544862310933d4",
        stakingAddress: masterChefV3Address,
        poolsLoader: () =>
          cache
            .read("avaxTraderjoe", "masterChefV3Pools")
            .then((pools) => pools.filter(({ type }) => type === "lp")),
      }),
      BoostedMasterChefJoeLpRestake: masterChef.stakingAutomateDeployTabs({
        liquidityRouter: "0x60aE616a2155Ee3d9A68541Ba4544862310933d4",
        stakingAddress: boostedMasterChefJoeAddress,
        poolsLoader: () =>
          cache
            .read("avaxTraderjoe", "boostedMasterChefJoePools")
            .then((pools) => pools.filter(({ type }) => type === "lp")),
      }),
    },
    MasterChefV2LpRestake: (
      signer: ethersType.Signer,
      contractAddress: string
    ) => {
      if (!signer.provider) throw new Error("Provider not found");

      return masterChef.stakingPairAutomateAdapter({
        masterChefProvider: masterChefV2ProviderFactory(signer, "latest"),
        automateABI: masterChefV2LpRestakeABI,
        stakingABI: masterChefV2ABI,
        routeTokens,
      })(signer, contractAddress);
    },
    MasterChefV2SingleRestake: (
      signer: ethersType.Signer,
      contractAddress: string
    ) => {
      if (!signer.provider) throw new Error("Provider not found");

      return masterChef.stakingSingleAutomateAdapter({
        masterChefProvider: masterChefV2ProviderFactory(signer, "latest"),
        automateABI: masterChefV2SingleRestakeABI,
        stakingABI: masterChefV2ABI,
        routeTokens,
      })(signer, contractAddress);
    },
    MasterChefV3LpRestake: (
      signer: ethersType.Signer,
      contractAddress: string
    ) => {
      if (!signer.provider) throw new Error("Provider not found");

      return masterChef.stakingPairAutomateAdapter({
        masterChefProvider: masterChefV3ProviderFactory(signer, "latest"),
        automateABI: masterChefV3LpRestakeABI,
        stakingABI: masterChefV3ABI,
        routeTokens,
      })(signer, contractAddress);
    },
    BoostedMasterChefJoeLpRestake: (
      signer: ethersType.Signer,
      contractAddress: string
    ) => {
      if (!signer.provider) throw new Error("Provider not found");

      return masterChef.stakingPairAutomateAdapter({
        masterChefProvider: boostedMasterChefJoeProviderFactory(signer, "latest"),
        automateABI: boostedMasterChefJoeLpRestakeABI,
        stakingABI: boostedMasterChefJoeABI,
        routeTokens,
      })(signer, contractAddress);
    },
  },
};

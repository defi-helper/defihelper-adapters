import type ethersType from "ethers";
import { ethers, bignumber as bn, ethersMulticall, dayjs } from "../lib";
import * as ethereum from "../utils/ethereum/base";
import * as erc20 from "../utils/ethereum/erc20";
import * as uniswap from "../utils/ethereum/uniswap";
import { bridgeWrapperBuild } from "../utils/coingecko";
import {
  buildMasterChefStakingActions,
  buildMasterChefProvider,
  buildMasterChefRestakeDeployTabs,
} from "../utils/ethereum/adapter/masterChef";
import * as cache from "../utils/cache";
import {
  stakingAdapter,
  contractsResolver,
  deployAdapter,
  automateAdapter,
  Staking,
  Deploy,
  Action,
  governanceSwapAdapter,
  ResolvedContract,
} from "../utils/ethereum/adapter/base";
import masterChefV2ABI from "./data/masterChefV2ABI.json";
import masterChefV3ABI from "./data/masterChefV3ABI.json";
import xJoeTokenABI from "./data/xJoeTokenABI.json";
import MasterChefV2LpRestakeABI from "./data/masterChefV2LpRestakeABI.json";
import MasterChefV2SingleRestakeABI from "./data/masterChefV2SingleRestakeABI.json";
import MasterChefV3LpRestakeABI from "./data/masterChefV3LpRestakeABI.json";
import bridgeTokens from "./data/bridgeTokens.json";

const masterChefV2Address = "0xd6a4F121CA35509aF06A0Be99093d08462f53052";
const masterChefV3Address = "0x188bED1968b795d5c9022F6a0bb5931Ac4c18F00";
const routeTokens = ["0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7"];

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
        bridgeTokens,
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

      const masterChefProvider = buildMasterChefProvider(
        new ethers.Contract(masterChefV2Address, masterChefV2ABI, provider),
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
        actions: async (walletAddress) => {
          if (options.signer === null) {
            throw new Error(
              "Signer not found, use options.signer for use actions"
            );
          }
          const { signer } = options;

          return buildMasterChefStakingActions(masterChefProvider, {
            poolIndex: pool.index,
            poolInfo,
            signer,
            etherscanAddressURL: "https://snowtrace.io/address",
          }).then((actions) => actions(walletAddress));
        },
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
        bridgeTokens,
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

      const masterChefProvider = buildMasterChefProvider(
        new ethers.Contract(masterChefV2Address, masterChefV2ABI, provider),
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
        actions: async (walletAddress) => {
          if (options.signer === null) {
            throw new Error(
              "Signer not found, use options.signer for use actions"
            );
          }
          const { signer } = options;

          return buildMasterChefStakingActions(masterChefProvider, {
            poolIndex: pool.index,
            poolInfo,
            signer,
            etherscanAddressURL: "https://snowtrace.io/address",
          }).then((actions) => actions(walletAddress));
        },
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
        bridgeTokens,
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

      const masterChefProvider = buildMasterChefProvider(
        new ethers.Contract(masterChefV3Address, masterChefV3ABI, provider),
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
        actions: async (walletAddress) => {
          if (options.signer === null) {
            throw new Error(
              "Signer not found, use options.signer for use actions"
            );
          }
          const { signer } = options;

          return buildMasterChefStakingActions(masterChefProvider, {
            poolIndex: pool.index,
            poolInfo,
            signer,
            etherscanAddressURL: "https://snowtrace.io/address",
          }).then((actions) => actions(walletAddress));
        },
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
        bridgeTokens,
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
            new bn(v.toString()).div(`1e${joeDecimals}`)
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
        actions: async (walletAddress) => {
          if (options.signer === null) {
            throw new Error(
              "Signer not found, use options.signer for use actions"
            );
          }
          const { signer } = options;
          joeContract.connect(signer);
          const etherscanAddressURL = "https://snowtrace.io/address";

          return {
            stake: {
              name: "governanceSwap-stake",
              methods: {
                fromSymbol: () => "JOE",
                fromLink: () => `${etherscanAddressURL}/${joeAddress}`,
                toSymbol: () => "xJOE",
                toLink: () => `${etherscanAddressURL}/${xJoeAddress}`,
                balanceOf: () =>
                  joeContract
                    .balanceOf(walletAddress)
                    .then((v: ethersType.BigNumber) =>
                      ethereum.toBN(v).div(`1e${joeDecimals}`).toString(10)
                    ),
                isApproved: async (amount: string) => {
                  const allowance = await joeContract
                    .allowance(walletAddress, xJoeContract.contract.address)
                    .then(ethereum.toBN);

                  return allowance.isGreaterThanOrEqualTo(
                    new bn(amount).multipliedBy(`1e${joeDecimals}`)
                  );
                },
                approve: async (amount: string) => ({
                  tx: await erc20.approveAll(
                    joeContract,
                    walletAddress,
                    xJoeContract.contract.address,
                    new bn(amount).multipliedBy(`1e${joeDecimals}`).toFixed(0)
                  ),
                }),
                can: async (amount: string) => {
                  const amountInt = new bn(amount).multipliedBy(
                    `1e${joeDecimals}`
                  );
                  if (amountInt.lte(0)) return Error("Invalid amount");

                  const balance = await joeContract
                    .balanceOf(walletAddress)
                    .then(ethereum.toBN);
                  if (amountInt.gt(balance))
                    return Error("Insufficient funds on the balance");

                  return true;
                },
                stake: async (amount: string) => ({
                  tx: await xJoeContract.deposit(
                    new bn(amount).multipliedBy(`1e${joeDecimals}`).toFixed(0)
                  ),
                }),
              },
            },
            unstake: {
              name: "governanceSwap-unstake",
              methods: {
                fromSymbol: () => "xJOE",
                fromLink: () => `${etherscanAddressURL}/${xJoeAddress}`,
                toSymbol: () => "JOE",
                toLink: () => `${etherscanAddressURL}/${joeAddress}`,
                balanceOf: () =>
                  xJoeContract
                    .balanceOf(walletAddress)
                    .then((v: ethersType.BigNumber) =>
                      ethereum.toBN(v).div(`1e${xJoeDecimals}`).toString(10)
                    ),
                can: async (amount: string) => {
                  const amountInt = new bn(amount).multipliedBy(
                    `1e${xJoeDecimals}`
                  );
                  if (amountInt.lte(0)) return Error("Invalid amount");

                  const balance = await xJoeContract
                    .balanceOf(walletAddress)
                    .then(ethereum.toBN);
                  if (amountInt.isGreaterThan(balance)) {
                    return Error("Amount exceeds balance");
                  }

                  return true;
                },
                unstake: async (amount: string) => ({
                  tx: await xJoeContract.withdraw(
                    new bn(amount).multipliedBy(`1e${xJoeDecimals}`).toFixed(0)
                  ),
                }),
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
        const [totalPoolsV2, totalPoolsV3] = await multicall.all([
          masterChiefV2Contract.poolLength(),
          masterChiefV3Contract.poolLength(),
        ]);
        const poolsV2Index = Array.from(
          new Array(totalPoolsV2.toNumber()).keys()
        );
        const poolsV3Index = Array.from(
          new Array(totalPoolsV3.toNumber()).keys()
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
                buyLiquidity: isPair
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
                buyLiquidity: isPair
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
        }

        return [...poolsV2, ...poolsV3];
      }),
    },
    /*
    deploy: {
      MasterChefV2LpRestake: async (
        signer,
        factoryAddress,
        prototypeAddress,
        contractAddress = undefined
      ) => {
        const masterChefSavedPools = await cache.read(
          "avaxTraderjoe",
          "masterChefV2Pools"
        );
        const firstPoolCandidate = masterChefSavedPools.find(
          ({ type }) => type === "lp"
        );
        let poolIndex = firstPoolCandidate
          ? firstPoolCandidate.index.toString()
          : "";
        if (contractAddress) {
          poolIndex =
            masterChefSavedPools.find(
              ({ stakingToken }) =>
                stakingToken.toLowerCase() === contractAddress.toLowerCase()
            )?.index ?? poolIndex;
        }

        return {
          deploy: [
            Action.tab(
              "Deploy",
              async () => ({
                description: "Deploy your own contract",
                inputs: [
                  Action.input({
                    placeholder: "Liquidity pool router address",
                    value: "0x60aE616a2155Ee3d9A68541Ba4544862310933d4",
                  }),
                  Action.input({
                    placeholder: "Target pool index",
                    value: poolIndex,
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
              async (router, pool, slippage, deadline) => {
                if (
                  !masterChefSavedPools.find(
                    ({ index }) => index === parseInt(pool, 10)
                  )
                )
                  return new Error("Invalid pool index");
                if (slippage < 0 || slippage > 100)
                  return new Error("Invalid slippage percent");
                if (deadline < 0)
                  return new Error("Deadline has already passed");

                return true;
              },
              async (router, pool, slippage, deadline) =>
                Action.ethereum.proxyDeploy(
                  signer,
                  factoryAddress,
                  prototypeAddress,
                  new ethers.utils.Interface(
                    MasterChefV2LpRestakeABI
                  ).encodeFunctionData("init", [
                    masterChefV2Address,
                    router,
                    pool,
                    Math.floor(slippage * 100),
                    deadline,
                  ])
                )
            ),
          ],
        };
      },
      MasterChefV2SingleRestake: async (
        signer,
        factoryAddress,
        prototypeAddress,
        contractAddress = undefined
      ) => {
        const masterChefSavedPools = await cache.read(
          "avaxTraderjoe",
          "masterChefV2Pools"
        );
        const firstPoolCandidate = masterChefSavedPools.find(
          ({ type }) => type === "single"
        );
        let poolIndex = firstPoolCandidate
          ? firstPoolCandidate.index.toString()
          : "";
        if (contractAddress) {
          poolIndex =
            masterChefSavedPools.find(
              ({ stakingToken }) =>
                stakingToken.toLowerCase() === contractAddress.toLowerCase()
            )?.index ?? poolIndex;
        }

        return {
          deploy: [
            Action.tab(
              "Deploy",
              async () => ({
                description: "Deploy your own contract",
                inputs: [
                  Action.input({
                    placeholder: "Liquidity pool router address",
                    value: "0x60aE616a2155Ee3d9A68541Ba4544862310933d4",
                  }),
                  Action.input({
                    placeholder: "Target pool index",
                    value: poolIndex,
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
              async (router, pool, slippage, deadline) => {
                if (
                  !masterChefSavedPools.find(
                    ({ index }) => index === parseInt(pool, 10)
                  )
                )
                  return new Error("Invalid pool index");
                if (slippage < 0 || slippage > 100)
                  return new Error("Invalid slippage percent");
                if (deadline < 0)
                  return new Error("Deadline has already passed");

                return true;
              },
              async (router, pool, slippage, deadline) =>
                Action.ethereum.proxyDeploy(
                  signer,
                  factoryAddress,
                  prototypeAddress,
                  new ethers.utils.Interface(
                    MasterChefV2SingleRestakeABI
                  ).encodeFunctionData("init", [
                    masterChefV2Address,
                    router,
                    pool,
                    Math.floor(slippage * 100),
                    deadline,
                  ])
                )
            ),
          ],
        };
      },
      MasterChefV3LpRestake: async (
        signer,
        factoryAddress,
        prototypeAddress,
        contractAddress = undefined
      ) => {
        const masterChefSavedPools = await cache.read(
          "avaxTraderjoe",
          "masterChefV3Pools"
        );
        const firstPoolCandidate = masterChefSavedPools.find(
          ({ type }) => type === "lp"
        );
        let poolIndex = firstPoolCandidate
          ? firstPoolCandidate.index.toString()
          : "";
        if (contractAddress) {
          poolIndex =
            masterChefSavedPools.find(
              ({ stakingToken }) =>
                stakingToken.toLowerCase() === contractAddress.toLowerCase()
            )?.index ?? poolIndex;
        }

        return {
          deploy: [
            Action.tab(
              "Deploy",
              async () => ({
                description: "Deploy your own contract",
                inputs: [
                  Action.input({
                    placeholder: "Liquidity pool router address",
                    value: "0x60aE616a2155Ee3d9A68541Ba4544862310933d4",
                  }),
                  Action.input({
                    placeholder: "Target pool index",
                    value: poolIndex,
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
              async (router, pool, slippage, deadline) => {
                if (
                  !masterChefSavedPools.find(
                    ({ index }) => index === parseInt(pool, 10)
                  )
                )
                  return new Error("Invalid pool index");
                if (slippage < 0 || slippage > 100)
                  return new Error("Invalid slippage percent");
                if (deadline < 0)
                  return new Error("Deadline has already passed");

                return true;
              },
              async (router, pool, slippage, deadline) =>
                Action.ethereum.proxyDeploy(
                  signer,
                  factoryAddress,
                  prototypeAddress,
                  new ethers.utils.Interface(
                    MasterChefV3LpRestakeABI
                  ).encodeFunctionData("init", [
                    masterChefV3Address,
                    router,
                    pool,
                    Math.floor(slippage * 100),
                    deadline,
                  ])
                )
            ),
          ],
        };
      },
    },
    MasterChefV2LpRestake: async (signer, contractAddress) => {
      const signerAddress = await signer.getAddress();
      const automate = new ethers.Contract(
        contractAddress,
        MasterChefV2LpRestakeABI,
        signer
      );
      const stakingAddress = await automate.staking();
      const staking = new ethers.Contract(
        stakingAddress,
        masterChefV2ABI,
        signer
      );
      const stakingTokenAddress = await automate.stakingToken();
      const stakingToken = ethereum.erc20(signer, stakingTokenAddress);
      const stakingTokenDecimals = await stakingToken
        .decimals()
        .then((v) => v.toString());
      const poolId = await automate.pool().then((v) => v.toString());

      const deposit = [
        Action.tab(
          "Transfer",
          async () => ({
            description: "Transfer your tokens to your contract",
            inputs: [
              Action.input({
                placeholder: "amount",
                value: new bn(
                  await stakingToken
                    .balanceOf(signerAddress)
                    .then((v) => v.toString())
                )
                  .div(`1e${stakingTokenDecimals}`)
                  .toString(10),
              }),
            ],
          }),
          async (amount) => {
            const signerBalance = await stakingToken
              .balanceOf(signerAddress)
              .then((v) => v.toString());
            const amountInt = new bn(amount).multipliedBy(
              `1e${stakingTokenDecimals}`
            );
            if (amountInt.lte(0)) return Error("Invalid amount");
            if (amountInt.gt(signerBalance))
              return Error("Insufficient funds on the balance");

            return true;
          },
          async (amount) => ({
            tx: await stakingToken.transfer(
              automate.address,
              new bn(amount)
                .multipliedBy(`1e${stakingTokenDecimals}`)
                .toFixed(0)
            ),
          })
        ),
        Action.tab(
          "Deposit",
          async () => ({
            description: "Stake your tokens to the contract",
          }),
          async () => {
            const automateBalance = new bn(
              await stakingToken
                .balanceOf(automate.address)
                .then((v) => v.toString())
            );
            const automateOwner = await automate.owner();
            if (automateBalance.lte(0))
              return new Error(
                "Insufficient funds on the automate contract balance"
              );
            if (signerAddress.toLowerCase() !== automateOwner.toLowerCase())
              return new Error("Someone else contract");

            return true;
          },
          async () => ({
            tx: await automate.deposit(),
          })
        ),
      ];
      const refund = [
        Action.tab(
          "Refund",
          async () => ({
            description: "Transfer your tokens from automate",
          }),
          async () => {
            const automateOwner = await automate.owner();
            if (signerAddress.toLowerCase() !== automateOwner.toLowerCase())
              return new Error("Someone else contract");

            return true;
          },
          async () => ({
            tx: await automate.refund(),
          })
        ),
      ];
      const migrate = [
        Action.tab(
          "Withdraw",
          async () => ({
            description: "Withdraw your tokens from staking",
          }),
          async () => {
            const userInfo = await staking.userInfo(poolId, signerAddress);
            if (new bn(userInfo.amount.toString()).lte(0))
              return new Error(
                "Insufficient funds on the staking contract balance"
              );

            return true;
          },
          async () => {
            const userInfo = await staking.userInfo(poolId, signerAddress);
            return {
              tx: await staking.withdraw(poolId, userInfo.amount.toString()),
            };
          }
        ),
        ...deposit,
      ];
      const runParams = async () => {
        const provider = signer.provider || signer;
        const chainId = await provider
          .getNetwork()
          .then(({ chainId }) => chainId);
        const multicall = new ethersMulticall.Provider(signer, chainId);
        const automateMulticall = new ethersMulticall.Contract(
          contractAddress,
          MasterChefV2LpRestakeABI
        );
        const stakingTokenMulticall = new ethersMulticall.Contract(
          stakingTokenAddress,
          ethereum.uniswap.pairABI
        );

        const [
          routerAddress,
          slippagePercent,
          deadlineSeconds,
          token0Address,
          token1Address,
          rewardTokenAddress,
        ] = await multicall.all([
          automateMulticall.liquidityRouter(),
          automateMulticall.slippage(),
          automateMulticall.deadline(),
          stakingTokenMulticall.token0(),
          stakingTokenMulticall.token1(),
          automateMulticall.rewardToken(),
        ]);
        const rewardToken = new ethers.Contract(
          rewardTokenAddress,
          ethereum.abi.ERC20ABI,
          provider
        );
        const rewardTokenBalance = await rewardToken
          .balanceOf(contractAddress)
          .then((v) => v.toString());
        const pendingReward = await staking
          .pendingTokens(poolId, contractAddress)
          .then(({ pendingJoe }) => pendingJoe.toString());

        const earned = new bn(pendingReward).plus(rewardTokenBalance);
        if (earned.toString(10) === "0") return new Error("No earned");
        const router = new ethersMulticall.Contract(
          routerAddress,
          ethereum.abi.UniswapRouterABI
        );

        const slippage = 1 - slippagePercent / 10000;
        const token0AmountIn = new bn(earned.toString(10)).div(2).toFixed(0);
        const swap0 = [[rewardTokenAddress, token0Address], "0"];
        if (token0Address.toLowerCase() !== rewardTokenAddress.toLowerCase()) {
          const { path, amountOut } = await ethereum.uniswap.autoRoute(
            multicall,
            router,
            token0AmountIn,
            rewardTokenAddress,
            token0Address,
            routeTokens
          );
          swap0[0] = path;
          swap0[1] = new bn(amountOut.toString())
            .multipliedBy(slippage)
            .toFixed(0);
        }
        const token1AmountIn = new bn(earned.toString(10))
          .minus(token0AmountIn)
          .toFixed(0);
        const swap1 = [[rewardTokenAddress, token1Address], "0"];
        if (token1Address.toLowerCase() !== rewardTokenAddress.toLowerCase()) {
          const { path, amountOut } = await ethereum.uniswap.autoRoute(
            multicall,
            router,
            token1AmountIn,
            rewardTokenAddress,
            token1Address,
            routeTokens
          );
          swap1[0] = path;
          swap1[1] = new bn(amountOut.toString())
            .multipliedBy(slippage)
            .toFixed(0);
        }

        const deadline = dayjs().add(deadlineSeconds, "seconds").unix();

        const gasLimit = new bn(
          await automate.estimateGas
            .run(0, deadline, swap0, swap1)
            .then((v) => v.toString())
        )
          .multipliedBy(1.1)
          .toFixed(0);
        const gasPrice = await signer.getGasPrice().then((v) => v.toString());
        const gasFee = new bn(gasLimit).multipliedBy(gasPrice).toFixed(0);

        await automate.estimateGas.run(gasFee, deadline, swap0, swap1);
        return {
          gasPrice,
          gasLimit,
          calldata: [gasFee, deadline, swap0, swap1],
        };
      };
      const run = async () => {
        const { gasPrice, gasLimit, calldata } = await runParams();
        return automate.run.apply(automate, [
          ...calldata,
          {
            gasPrice,
            gasLimit,
          },
        ]);
      };

      return {
        contract: stakingTokenAddress,
        deposit,
        refund,
        migrate,
        runParams,
        run,
      };
    },
    MasterChefV2SingleRestake: async (signer, contractAddress) => {
      const signerAddress = await signer.getAddress();
      const automate = new ethers.Contract(
        contractAddress,
        MasterChefV2SingleRestakeABI,
        signer
      );
      const stakingAddress = await automate.staking();
      const staking = new ethers.Contract(
        stakingAddress,
        masterChefV2ABI,
        signer
      );
      const stakingTokenAddress = await automate.stakingToken();
      const stakingToken = ethereum.erc20(signer, stakingTokenAddress);
      const stakingTokenDecimals = await stakingToken
        .decimals()
        .then((v) => v.toString());
      const poolId = await automate.pool().then((v) => v.toString());

      const deposit = [
        Action.tab(
          "Transfer",
          async () => ({
            description: "Transfer your tokens to your contract",
            inputs: [
              Action.input({
                placeholder: "amount",
                value: new bn(
                  await stakingToken
                    .balanceOf(signerAddress)
                    .then((v) => v.toString())
                )
                  .div(`1e${stakingTokenDecimals}`)
                  .toString(10),
              }),
            ],
          }),
          async (amount) => {
            const signerBalance = await stakingToken
              .balanceOf(signerAddress)
              .then((v) => v.toString());
            const amountInt = new bn(amount).multipliedBy(
              `1e${stakingTokenDecimals}`
            );
            if (amountInt.lte(0)) return Error("Invalid amount");
            if (amountInt.gt(signerBalance))
              return Error("Insufficient funds on the balance");

            return true;
          },
          async (amount) => ({
            tx: await stakingToken.transfer(
              automate.address,
              new bn(amount)
                .multipliedBy(`1e${stakingTokenDecimals}`)
                .toFixed(0)
            ),
          })
        ),
        Action.tab(
          "Deposit",
          async () => ({
            description: "Stake your tokens to the contract",
          }),
          async () => {
            const automateBalance = new bn(
              await stakingToken
                .balanceOf(automate.address)
                .then((v) => v.toString())
            );
            const automateOwner = await automate.owner();
            if (automateBalance.lte(0))
              return new Error(
                "Insufficient funds on the automate contract balance"
              );
            if (signerAddress.toLowerCase() !== automateOwner.toLowerCase())
              return new Error("Someone else contract");

            return true;
          },
          async () => ({
            tx: await automate.deposit(),
          })
        ),
      ];
      const refund = [
        Action.tab(
          "Refund",
          async () => ({
            description: "Transfer your tokens from automate",
          }),
          async () => {
            const automateOwner = await automate.owner();
            if (signerAddress.toLowerCase() !== automateOwner.toLowerCase())
              return new Error("Someone else contract");

            return true;
          },
          async () => ({
            tx: await automate.refund(),
          })
        ),
      ];
      const migrate = [
        Action.tab(
          "Withdraw",
          async () => ({
            description: "Withdraw your tokens from staking",
          }),
          async () => {
            const userInfo = await staking.userInfo(poolId, signerAddress);
            if (new bn(userInfo.amount.toString()).lte(0))
              return new Error(
                "Insufficient funds on the staking contract balance"
              );

            return true;
          },
          async () => {
            const userInfo = await staking.userInfo(poolId, signerAddress);
            return {
              tx: await staking.withdraw(poolId, userInfo.amount.toString()),
            };
          }
        ),
        ...deposit,
      ];
      const runParams = async () => {
        const provider = signer.provider || signer;
        const chainId = await provider
          .getNetwork()
          .then(({ chainId }) => chainId);
        const multicall = new ethersMulticall.Provider(signer, chainId);
        const automateMulticall = new ethersMulticall.Contract(
          contractAddress,
          MasterChefV2SingleRestakeABI
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

        const rewardToken = new ethers.Contract(
          rewardTokenAddress,
          ethereum.abi.ERC20ABI,
          provider
        );
        const rewardTokenBalance = await rewardToken
          .balanceOf(contractAddress)
          .then((v) => v.toString());
        const pendingReward = await staking
          .pendingTokens(poolId, contractAddress)
          .then(({ pendingJoe }) => pendingJoe.toString());
        const earned = new bn(pendingReward).plus(rewardTokenBalance);
        if (earned.toString(10) === "0") return new Error("No earned");

        const router = new ethersMulticall.Contract(
          routerAddress,
          ethereum.abi.UniswapRouterABI
        );
        const slippage = 1 - slippagePercent / 10000;
        const tokenAmountIn = earned.toFixed(0);
        const swap = [[rewardTokenAddress, stakingTokenAddress], "0"];
        if (
          stakingTokenAddress.toLowerCase() !== rewardTokenAddress.toLowerCase()
        ) {
          const { path, amountOut } = await ethereum.uniswap.autoRoute(
            multicall,
            router,
            tokenAmountIn,
            rewardTokenAddress,
            stakingTokenAddress,
            routeTokens
          );
          swap[0] = path;
          swap[1] = new bn(amountOut.toString())
            .multipliedBy(slippage)
            .toFixed(0);
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
        const { gasPrice, gasLimit, calldata } = await runParams();
        return automate.run.apply(automate, [
          ...calldata,
          {
            gasPrice,
            gasLimit,
          },
        ]);
      };

      return {
        contract: stakingTokenAddress,
        deposit,
        refund,
        migrate,
        runParams,
        run,
      };
    },
    MasterChefV3LpRestake: async (signer, contractAddress) => {
      const signerAddress = await signer.getAddress();
      const automate = new ethers.Contract(
        contractAddress,
        MasterChefV3LpRestakeABI,
        signer
      );
      const stakingAddress = await automate.staking();
      const staking = new ethers.Contract(
        stakingAddress,
        masterChefV3ABI,
        signer
      );
      const stakingTokenAddress = await automate.stakingToken();
      const stakingToken = ethereum.erc20(signer, stakingTokenAddress);
      const stakingTokenDecimals = await stakingToken
        .decimals()
        .then((v) => v.toString());
      const poolId = await automate.pool().then((v) => v.toString());

      const deposit = [
        Action.tab(
          "Transfer",
          async () => ({
            description: "Transfer your tokens to your contract",
            inputs: [
              Action.input({
                placeholder: "amount",
                value: new bn(
                  await stakingToken
                    .balanceOf(signerAddress)
                    .then((v) => v.toString())
                )
                  .div(`1e${stakingTokenDecimals}`)
                  .toString(10),
              }),
            ],
          }),
          async (amount) => {
            const signerBalance = await stakingToken
              .balanceOf(signerAddress)
              .then((v) => v.toString());
            const amountInt = new bn(amount).multipliedBy(
              `1e${stakingTokenDecimals}`
            );
            if (amountInt.lte(0)) return Error("Invalid amount");
            if (amountInt.gt(signerBalance))
              return Error("Insufficient funds on the balance");

            return true;
          },
          async (amount) => ({
            tx: await stakingToken.transfer(
              automate.address,
              new bn(amount)
                .multipliedBy(`1e${stakingTokenDecimals}`)
                .toFixed(0)
            ),
          })
        ),
        Action.tab(
          "Deposit",
          async () => ({
            description: "Stake your tokens to the contract",
          }),
          async () => {
            const automateBalance = new bn(
              await stakingToken
                .balanceOf(automate.address)
                .then((v) => v.toString())
            );
            const automateOwner = await automate.owner();
            if (automateBalance.lte(0))
              return new Error(
                "Insufficient funds on the automate contract balance"
              );
            if (signerAddress.toLowerCase() !== automateOwner.toLowerCase())
              return new Error("Someone else contract");

            return true;
          },
          async () => ({
            tx: await automate.deposit(),
          })
        ),
      ];
      const refund = [
        Action.tab(
          "Refund",
          async () => ({
            description: "Transfer your tokens from automate",
          }),
          async () => {
            const automateOwner = await automate.owner();
            if (signerAddress.toLowerCase() !== automateOwner.toLowerCase())
              return new Error("Someone else contract");

            return true;
          },
          async () => ({
            tx: await automate.refund(),
          })
        ),
      ];
      const migrate = [
        Action.tab(
          "Withdraw",
          async () => ({
            description: "Withdraw your tokens from staking",
          }),
          async () => {
            const userInfo = await staking.userInfo(poolId, signerAddress);
            if (new bn(userInfo.amount.toString()).lte(0))
              return new Error(
                "Insufficient funds on the staking contract balance"
              );

            return true;
          },
          async () => {
            const userInfo = await staking.userInfo(poolId, signerAddress);
            return {
              tx: await staking.withdraw(poolId, userInfo.amount.toString()),
            };
          }
        ),
        ...deposit,
      ];
      const runParams = async () => {
        const provider = signer.provider || signer;
        const chainId = await provider
          .getNetwork()
          .then(({ chainId }) => chainId);
        const multicall = new ethersMulticall.Provider(signer, chainId);
        const automateMulticall = new ethersMulticall.Contract(
          contractAddress,
          MasterChefV2LpRestakeABI
        );
        const stakingTokenMulticall = new ethersMulticall.Contract(
          stakingTokenAddress,
          ethereum.uniswap.pairABI
        );

        const [
          routerAddress,
          slippagePercent,
          deadlineSeconds,
          token0Address,
          token1Address,
          rewardTokenAddress,
        ] = await multicall.all([
          automateMulticall.liquidityRouter(),
          automateMulticall.slippage(),
          automateMulticall.deadline(),
          stakingTokenMulticall.token0(),
          stakingTokenMulticall.token1(),
          automateMulticall.rewardToken(),
        ]);
        const rewardToken = new ethers.Contract(
          rewardTokenAddress,
          ethereum.abi.ERC20ABI,
          provider
        );
        const rewardTokenBalance = await rewardToken
          .balanceOf(contractAddress)
          .then((v) => v.toString());
        const pendingReward = await staking
          .pendingTokens(poolId, contractAddress)
          .then(({ pendingJoe }) => pendingJoe.toString());

        const earned = new bn(pendingReward).plus(rewardTokenBalance);
        if (earned.toString(10) === "0") return new Error("No earned");
        const router = new ethersMulticall.Contract(
          routerAddress,
          ethereum.abi.UniswapRouterABI
        );

        const slippage = 1 - slippagePercent / 10000;
        const token0AmountIn = new bn(earned.toString(10)).div(2).toFixed(0);
        const swap0 = [[rewardTokenAddress, token0Address], "0"];
        if (token0Address.toLowerCase() !== rewardTokenAddress.toLowerCase()) {
          const { path, amountOut } = await ethereum.uniswap.autoRoute(
            multicall,
            router,
            token0AmountIn,
            rewardTokenAddress,
            token0Address,
            routeTokens
          );
          swap0[0] = path;
          swap0[1] = new bn(amountOut.toString())
            .multipliedBy(slippage)
            .toFixed(0);
        }
        const token1AmountIn = new bn(earned.toString(10))
          .minus(token0AmountIn)
          .toFixed(0);
        const swap1 = [[rewardTokenAddress, token1Address], "0"];
        if (token1Address.toLowerCase() !== rewardTokenAddress.toLowerCase()) {
          const { path, amountOut } = await ethereum.uniswap.autoRoute(
            multicall,
            router,
            token1AmountIn,
            rewardTokenAddress,
            token1Address,
            routeTokens
          );
          swap1[0] = path;
          swap1[1] = new bn(amountOut.toString())
            .multipliedBy(slippage)
            .toFixed(0);
        }

        const deadline = dayjs().add(deadlineSeconds, "seconds").unix();

        const gasLimit = new bn(
          await automate.estimateGas
            .run(0, deadline, swap0, swap1)
            .then((v) => v.toString())
        )
          .multipliedBy(1.1)
          .toFixed(0);
        const gasPrice = await signer.getGasPrice().then((v) => v.toString());
        const gasFee = new bn(gasLimit).multipliedBy(gasPrice).toFixed(0);

        await automate.estimateGas.run(gasFee, deadline, swap0, swap1);
        return {
          gasPrice,
          gasLimit,
          calldata: [gasFee, deadline, swap0, swap1],
        };
      };
      const run = async () => {
        const { gasPrice, gasLimit, calldata } = await runParams();
        return automate.run.apply(automate, [
          ...calldata,
          {
            gasPrice,
            gasLimit,
          },
        ]);
      };

      return {
        contract: stakingTokenAddress,
        deposit,
        refund,
        migrate,
        runParams,
        run,
      };
    },
    */
  },
};

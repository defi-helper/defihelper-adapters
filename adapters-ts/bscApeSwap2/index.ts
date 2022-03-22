import type ethersType from "ethers";
import { bignumber as bn, dayjs, ethers, ethersMulticall, axios } from "../lib";
import {
  stakingAdapter,
  contractsResolver,
  deployAdapter,
  automateAdapter,
  Staking,
  Deploy,
  Action,
} from "../utils/ethereum/adapter/base";
import * as cache from "../utils/cache";
import { bridgeWrapperBuild } from "../utils/coingecko";
import * as ethereum from "../utils/ethereum/base";
import * as erc20 from "../utils/ethereum/erc20";
import * as uniswap from "../utils/ethereum/uniswap";
import {
  buildMasterChefActions,
  buildMasterChefProvider,
} from "../utils/ethereum/adapter/masterChef";
import masterChefABI from "./data/masterChefABI.json";
import apeRewardV4ABI from "./data/apeRewardV4ABI.json";
import masterChefLpRestakeABI from "./data/masterChefLpRestakeABI.json";
import masterChefSingleRestakeABI from "./data/masterChefSingleRestakeABI.json";
import apeRewardV4RestakeABI from "./data/apeRewardV4RestakeABI.json";
import bridgeTokens from "./data/bridgeTokens.json";

const masterChefAddress = "0x5c8D727b265DBAfaba67E050f2f739cAeEB4A6F9";
const routeTokens = ["0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"];

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
        "bscApeSwap",
        "masterChefPools"
      );
      const blockTag = options.blockNumber;
      const network = await provider
        .getNetwork()
        .then(({ chainId }) => chainId);
      const block = await provider.getBlock(blockTag);
      const blockNumber = block.number;
      const priceFeed = bridgeWrapperBuild(
        bridgeTokens,
        blockTag,
        block,
        network
      );
      const avgBlockTime = await ethereum.getAvgBlockTime(
        provider,
        blockNumber
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
        new ethers.Contract(masterChefAddress, masterChefABI, provider),
        { blockTag },
        {
          rewardToken() {
            return "0x603c7f932ED1fc6575303D8Fb018fDCBb0f39a95";
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
          rewardPerSecond() {
            return this.contract
              .cakePerBlock({ blockTag: this.options.blockTag })
              .then((v: ethersType.BigNumber) =>
                ethereum.toBN(v).multipliedBy(1000).div(avgBlockTime)
              );
          },
          pendingReward(poolIndex, wallet) {
            return this.contract
              .pendingCake(poolIndex, wallet)
              .then(ethereum.toBN);
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
        staking: {
          token: stakingToken,
          decimals: stakingTokenDecimals,
        },
        reward: {
          token: rewardToken,
          decimals: rewardTokenDecimals,
        },
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

          return buildMasterChefActions(masterChefProvider, {
            poolIndex: pool.index,
            poolInfo,
            signer,
            etherscanAddressURL: "https://bscscan.com/address",
          }).then((actions) => actions(walletAddress));
        },
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
        "bscApeSwap",
        "masterChefPools"
      );
      const blockTag = options.blockNumber;
      const network = await provider
        .getNetwork()
        .then(({ chainId }) => chainId);
      const block = await provider.getBlock(blockTag);
      const blockNumber = block.number;
      const priceFeed = bridgeWrapperBuild(
        bridgeTokens,
        blockTag,
        block,
        network
      );
      const avgBlockTime = await ethereum.getAvgBlockTime(
        provider,
        blockNumber
      );

      const pool = masterChefSavedPools.find(
        (p) => p.stakingToken.toLowerCase() === contractAddress.toLowerCase()
      );
      if (!pool) {
        throw new Error("Pool is not found");
      }

      const masterChefProvider = buildMasterChefProvider(
        new ethers.Contract(masterChefAddress, masterChefABI, provider),
        { blockTag },
        {
          rewardToken() {
            return "0x603c7f932ED1fc6575303D8Fb018fDCBb0f39a95";
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
          rewardPerSecond() {
            return this.contract
              .cakePerBlock({ blockTag: this.options.blockTag })
              .then((v: ethersType.BigNumber) =>
                ethereum.toBN(v).multipliedBy(1000).div(avgBlockTime)
              );
          },
          pendingReward(poolIndex, wallet) {
            return this.contract
              .pendingCake(poolIndex, wallet)
              .then(ethereum.toBN);
          },
        }
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
      const aprSecond = rewardPerSec.multipliedBy(rewardTokenPriceUSD).div(tvl);
      const aprDay = aprSecond.multipliedBy(86400);
      const aprWeek = aprDay.multipliedBy(7);
      const aprMonth = aprDay.multipliedBy(30);
      const aprYear = aprDay.multipliedBy(365);

      return {
        staking: {
          token: stakingToken,
          decimals: stakingTokenDecimals,
        },
        reward: {
          token: rewardToken,
          decimals: rewardTokenDecimals,
        },
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

          return buildMasterChefActions(masterChefProvider, {
            poolIndex: pool.index,
            poolInfo,
            signer,
            etherscanAddressURL: "https://bscscan.com/address",
          }).then((actions) => actions(walletAddress));
        },
      };
    }
  ),
  apeRewardV4: stakingAdapter(
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
        bridgeTokens,
        blockTag,
        block,
        network
      );
      const avgBlockTime = await ethereum.getAvgBlockTime(
        provider,
        blockNumber
      );

      const apeRewardContract = new ethers.Contract(
        contractAddress,
        apeRewardV4ABI,
        provider
      );
      const rewardToken = await apeRewardContract
        .REWARD_TOKEN()
        .then((v: ethersType.BigNumber) => v.toString().toLowerCase());
      const rewardTokenDecimals = await erc20
        .contract(provider, rewardToken)
        .decimals()
        .then((v: ethersType.BigNumber) => Number(v.toString()));
      const rewardTokenPriceUSD = await priceFeed(rewardToken);
      const rewardTokenPerBlock = await apeRewardContract
        .rewardPerBlock({ blockTag })
        .then((v: ethersType.BigNumber) =>
          ethereum.toBN(v).div(`1e${rewardTokenDecimals}`)
        );

      const stakingToken = await apeRewardContract
        .STAKE_TOKEN()
        .then((v: ethersType.BigNumber) => v.toString().toLowerCase());
      const stakingTokenDecimals = await erc20
        .contract(provider, stakingToken)
        .decimals()
        .then((v: ethersType.BigNumber) => Number(v.toString()));
      const stakingTokenPriceUSD = await priceFeed(stakingToken);

      const totalLocked = await apeRewardContract
        .totalStaked({ blockTag })
        .then((v: ethersType.BigNumber) =>
          ethereum.toBN(v).div(`1e${stakingTokenDecimals}`)
        );
      const tvl = new bn(totalLocked).multipliedBy(stakingTokenPriceUSD);

      let aprBlock = rewardTokenPerBlock
        .multipliedBy(rewardTokenPriceUSD)
        .div(tvl);
      if (!aprBlock.isFinite()) aprBlock = new bn(0);

      const blocksPerDay = new bn((1000 * 60 * 60 * 24) / avgBlockTime);
      const aprDay = aprBlock.multipliedBy(blocksPerDay);
      const aprWeek = aprDay.multipliedBy(7);
      const aprMonth = aprDay.multipliedBy(30);
      const aprYear = aprDay.multipliedBy(365);

      return {
        staking: {
          token: stakingToken,
          decimals: stakingTokenDecimals,
        },
        reward: {
          token: rewardToken,
          decimals: rewardTokenDecimals,
        },
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
          const balance = await apeRewardContract
            .userInfo(walletAddress, {
              blockTag,
            })
            .then(({ amount }: { amount: ethersType.BigNumber }) =>
              ethereum.toBN(amount).div(`1e${stakingTokenDecimals}`)
            );
          const earned = await apeRewardContract
            .pendingReward(walletAddress, { blockTag })
            .then((amount: ethersType.BigNumber) =>
              ethereum.toBN(amount).div(`1e${rewardTokenDecimals}`)
            );
          const earnedUSD = earned.multipliedBy(rewardTokenPriceUSD);

          return {
            staked: {
              [stakingToken]: {
                balance: balance.toString(10),
                usd: balance.multipliedBy(stakingTokenPriceUSD).toString(10),
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
              stakingUSD: balance
                .multipliedBy(stakingTokenPriceUSD)
                .toString(10),
              earned: earned.toString(10),
              earnedUSD: earnedUSD.toString(10),
            },
            tokens: Staking.tokens(
              {
                token: stakingToken,
                data: {
                  balance: balance.toString(10),
                  usd: balance.multipliedBy(stakingTokenPriceUSD).toString(10),
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
          const stakingContract = apeRewardContract.connect(signer);
          const rewardTokenContract = erc20
            .contract(provider, rewardToken)
            .connect(signer);
          const stakingTokenContract = erc20
            .contract(provider, stakingToken)
            .connect(signer);
          const [
            rewardTokenSymbol,
            rewardTokenDecimals,
            stakingTokenSymbol,
            stakingTokenDecimals,
          ] = await Promise.all([
            rewardTokenContract.symbol(),
            rewardTokenContract.decimals().then(ethereum.toBN),
            stakingTokenContract.symbol(),
            stakingTokenContract.decimals().then(ethereum.toBN),
          ]);
          const etherscanAddressURL = "https://bscscan.com/address";

          return {
            stake: Action.component("Stake", {
              symbol: () => stakingTokenSymbol,
              link: () =>
                `${etherscanAddressURL}/${stakingTokenContract.address}`,
              balanceOf: () =>
                stakingTokenContract
                  .balanceOf(walletAddress)
                  .then((v: ethersType.BigNumber) =>
                    ethereum
                      .toBN(v)
                      .div(`1e${stakingTokenDecimals}`)
                      .toString(10)
                  ),
              isApproved: async (amount: string) => {
                const allowance = await stakingTokenContract
                  .allowance(walletAddress, stakingContract.contract.address)
                  .then(ethereum.toBN);

                return allowance.isGreaterThanOrEqualTo(
                  new bn(amount).multipliedBy(`1e${stakingTokenDecimals}`)
                );
              },
              approve: (amount: string) => ({
                tx: erc20.approveAll(
                  stakingTokenContract,
                  walletAddress,
                  stakingTokenContract.contract.address,
                  new bn(amount)
                    .multipliedBy(`1e${stakingTokenDecimals}`)
                    .toFixed(0)
                ),
              }),
              can: async (amount: string) => {
                const amountInt = new bn(amount).multipliedBy(
                  `1e${stakingTokenDecimals}`
                );
                if (amountInt.lte(0)) return Error("Invalid amount");

                const balance = await stakingTokenContract
                  .balanceOf(walletAddress)
                  .then((v: ethersType.BigNumber) => v.toString());
                if (amountInt.gt(balance))
                  return Error("Insufficient funds on the balance");

                return true;
              },
              stake: async (amount: string) => ({
                tx: await stakingContract.deposit(
                  new bn(amount)
                    .multipliedBy(`1e${stakingTokenDecimals}`)
                    .toFixed(0)
                ),
              }),
            }),
            unstake: Action.component("Unstake", {
              symbol: () => stakingTokenSymbol,
              link: () =>
                `${etherscanAddressURL}/${stakingTokenContract.address}`,
              balanceOf: () =>
                stakingContract
                  .userInfo(walletAddress)
                  .then(({ amount }: { amount: ethersType.BigNumber }) =>
                    ethereum
                      .toBN(amount)
                      .div(`1e${stakingTokenDecimals}`)
                      .toString(10)
                  ),
              can: async (amount) => {
                const amountInt = new bn(amount).multipliedBy(
                  `1e${stakingTokenDecimals}`
                );
                if (amountInt.lte(0)) return Error("Invalid amount");

                const userInfo = await stakingContract.userInfo(walletAddress);
                if (amountInt.isGreaterThan(userInfo.amount.toString())) {
                  return Error("Amount exceeds balance");
                }

                return true;
              },
              unstake: async (amount) => ({
                tx: await stakingContract.withdraw(
                  new bn(amount)
                    .multipliedBy(`1e${stakingTokenDecimals}`)
                    .toFixed(0)
                ),
              }),
            }),
            claim: Action.component("Claim", {
              symbol: () => rewardTokenSymbol,
              link: () =>
                `${etherscanAddressURL}/${rewardTokenContract.address}`,
              balanceOf: () =>
                stakingContract
                  .pendingReward(walletAddress)
                  .then((v: ethersType.BigNumber) =>
                    ethereum.toBN(v).div(`1e${rewardTokenDecimals}`)
                  ),
              can: async () => {
                const earned = await stakingContract
                  .pendingReward(walletAddress)
                  .then((v: ethersType.BigNumber) => ethereum.toBN(v));
                if (earned.isLessThanOrEqualTo(0)) {
                  return Error("No earnings");
                }

                return true;
              },
              claim: async () => ({
                tx: await stakingContract.deposit(0),
              }),
            }),
            exit: Action.component("Exit", {
              can: async () => {
                const earned = await stakingContract
                  .pendingReward(walletAddress)
                  .then((v: ethersType.BigNumber) => v.toString());
                const userInfo = await stakingContract.userInfo(walletAddress);
                if (
                  new bn(earned).isLessThanOrEqualTo(0) &&
                  new bn(userInfo.amount.toString()).isLessThanOrEqualTo(0)
                ) {
                  return Error("No staked");
                }

                return true;
              },
              exit: async () => {
                const userInfo = await stakingContract.userInfo(walletAddress);
                if (new bn(userInfo.amount.toString()).isGreaterThan(0)) {
                  await stakingContract.withdraw(userInfo.amount.toString());
                }

                return { tx: await stakingContract.deposit(0) };
              },
            }),
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

        const uniswapLiquidityPools = await Promise.all(
          poolsInfo.map(async (info, index) => {
            const stakingTokenSymbol = poolsStakingTokensSymbol[index];
            const isPair = stakingTokenSymbol === "APE-LP";

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
              network: "56",
              layout: "staking",
              adapter: isPair ? "masterChefPair" : "masterChefSingle",
              description: "",
              automate: {
                autorestakeAdapter: isPair
                  ? "MasterChefLpRestake"
                  : "MasterChefSingleRestake",
                adapters: isPair ? ["masterChefPair"] : ["masterChefSingle"],
                buyLiquidity: isPair
                  ? {
                      router: "0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7",
                      pair: info.lpToken,
                    }
                  : undefined,
              },
              link: "https://apeswap.finance/farms",
            };
          })
        );
        if (options.cacheAuth) {
          cache.write(
            options.cacheAuth,
            "bscApeSwap",
            "masterChefPools",
            uniswapLiquidityPools.map(
              ({ poolIndex, stakingToken, adapter }) => ({
                index: poolIndex,
                stakingToken,
                type: adapter === "masterChefPair" ? "lp" : "single",
              })
            )
          );
        }

        const poolsJsonRaw = (
          await axios.get("http://api.apeswap.finance/stats")
        ).data.incentivizedPools.filter(
          (v: { address: string; active: boolean }) => {
            return (
              !uniswapLiquidityPools.some(
                (pool) => v.address === pool.address
              ) && v.active
            );
          }
        );

        const poolsApeReward = poolsJsonRaw.map(
          ({
            address,
            name,
            rewardTokenSymbol,
            stakedTokenAddress,
          }: {
            address: string;
            name: string;
            rewardTokenSymbol: string;
            stakedTokenAddress: string;
          }) => ({
            stakingToken: stakedTokenAddress,
            name: `${name}-${rewardTokenSymbol}`,
            address,
            blockchain: "ethereum",
            network: "56",
            layout: "staking",
            adapter: "apeRewardV4",
            description: "",
            automate: {
              autorestakeAdapter: "ApeRewardV4Restake",
              adapters: ["apeRewardV4"],
            },
            link: "https://apeswap.finance/pools",
          })
        );

        return [...uniswapLiquidityPools, ...poolsApeReward];
      }),
    },
    deploy: {
      MasterChefLpRestake: deployAdapter(
        async (
          signer,
          factoryAddress,
          prototypeAddress,
          contractAddress = undefined
        ) => {
          const masterChefSavedPools = await cache.read(
            "bscApeSwap",
            "masterChefPools"
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
                      value: "0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7",
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
                async (_, pool, slippage, deadline) => {
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
                  Deploy.deploy(
                    signer,
                    factoryAddress,
                    prototypeAddress,
                    new ethers.utils.Interface(
                      masterChefLpRestakeABI
                    ).encodeFunctionData("init", [
                      masterChefAddress,
                      router,
                      pool,
                      Math.floor(slippage * 100),
                      deadline,
                    ])
                  )
              ),
            ],
          };
        }
      ),
      MasterChefSingleRestake: deployAdapter(
        async (
          signer,
          factoryAddress,
          prototypeAddress,
          contractAddress = undefined
        ) => {
          const masterChefSavedPools = await cache.read(
            "bscApeSwap",
            "masterChefPools"
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
                      value: "0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7",
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
                async (_, pool, slippage, deadline) => {
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
                  Deploy.deploy(
                    signer,
                    factoryAddress,
                    prototypeAddress,
                    new ethers.utils.Interface(
                      masterChefSingleRestakeABI
                    ).encodeFunctionData("init", [
                      masterChefAddress,
                      router,
                      pool,
                      Math.floor(slippage * 100),
                      deadline,
                    ])
                  )
              ),
            ],
          };
        }
      ),
      ApeRewardV4Restake: deployAdapter(
        async (
          signer,
          factoryAddress,
          prototypeAddress,
          contractAddress = undefined
        ) => {
          const stakingContracts = await cache.read(
            "bscApeSwap",
            "apeRewardContracts"
          );
          const stakingContract =
            contractAddress ?? stakingContracts[0].stakingContract;

          return {
            deploy: [
              Action.tab(
                "Deploy",
                async () => ({
                  description: "Deploy your own contract",
                  inputs: [
                    Action.input({
                      placeholder: "Liquidity pool router address",
                      value: "0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7",
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
                async (_, slippage, deadline) => {
                  if (slippage < 0 || slippage > 100)
                    return new Error("Invalid slippage percent");
                  if (deadline < 0)
                    return new Error("Deadline has already passed");

                  return true;
                },
                async (router, slippage, deadline) =>
                  Deploy.deploy(
                    signer,
                    factoryAddress,
                    prototypeAddress,
                    new ethers.utils.Interface(
                      apeRewardV4RestakeABI
                    ).encodeFunctionData("init", [
                      stakingContract,
                      router,
                      Math.floor(slippage * 100),
                      deadline,
                    ])
                  )
              ),
            ],
          };
        }
      ),
    },
    MasterChefLpRestake: automateAdapter(async (signer, contractAddress) => {
      if (!signer.provider) throw new Error("Provider not found");
      const provider = signer.provider;
      const signerAddress = await signer.getAddress();
      const automate = new ethers.Contract(
        contractAddress,
        masterChefLpRestakeABI,
        signer
      );
      const stakingAddress = await automate.staking();
      const staking = new ethers.Contract(
        stakingAddress,
        masterChefABI,
        signer
      );
      const stakingTokenAddress = await automate.stakingToken();
      const stakingToken = erc20.contract(signer, stakingTokenAddress);
      const stakingTokenDecimals = await stakingToken
        .decimals()
        .then((v: ethersType.BigNumber) => v.toString());
      const poolId = await automate
        .pool()
        .then((v: ethersType.BigNumber) => v.toString());

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
                    .then((v: ethersType.BigNumber) => v.toString())
                )
                  .div(`1e${stakingTokenDecimals}`)
                  .toString(10),
              }),
            ],
          }),
          async (amount) => {
            const signerBalance = await stakingToken
              .balanceOf(signerAddress)
              .then((v: ethersType.BigNumber) => v.toString());
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
                .then((v: ethersType.BigNumber) => v.toString())
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
            if (poolId === "0") {
              return {
                tx: await staking.leaveStaking(userInfo.amount.toString()),
              };
            } else {
              return {
                tx: await staking.withdraw(poolId, userInfo.amount.toString()),
              };
            }
          }
        ),
        ...deposit,
      ];
      const runParams = async () => {
        const multicall = new ethersMulticall.Provider(provider);
        await multicall.init();
        const automateMulticall = new ethersMulticall.Contract(
          contractAddress,
          masterChefLpRestakeABI
        );
        const stakingTokenMulticall =
          uniswap.pair.multicallContract(stakingTokenAddress);

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
        const rewardToken = erc20.contract(provider, rewardTokenAddress);
        const rewardTokenBalance = await rewardToken
          .balanceOf(contractAddress)
          .then((v: ethersType.BigNumber) => v.toString());
        const pendingReward = await staking
          .pendingCake(poolId, contractAddress)
          .then((v: ethersType.BigNumber) => v.toString());

        const earned = new bn(pendingReward).plus(rewardTokenBalance);
        if (earned.toString(10) === "0") return new Error("No earned");
        const router = uniswap.router.contract(provider, routerAddress);

        const slippage = 1 - slippagePercent / 10000;
        const token0AmountIn = new bn(earned.toString(10)).div(2).toFixed(0);
        const swap0 = [[rewardTokenAddress, token0Address], "0"];
        if (token0Address.toLowerCase() !== rewardTokenAddress.toLowerCase()) {
          const { path, amountOut } = await uniswap.router.autoRoute(
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
          const { path, amountOut } = await uniswap.router.autoRoute(
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
        contract: stakingTokenAddress,
        deposit,
        refund,
        migrate,
        runParams,
        run,
      };
    }),
    MasterChefSingleRestake: automateAdapter(
      async (signer, contractAddress) => {
        if (!signer.provider) throw new Error("Provider not found");
        const provider = signer.provider;
        const signerAddress = await signer.getAddress();
        const automate = new ethers.Contract(
          contractAddress,
          masterChefSingleRestakeABI,
          signer
        );
        const stakingAddress = await automate.staking();
        const staking = new ethers.Contract(
          stakingAddress,
          masterChefABI,
          signer
        );
        const stakingTokenAddress = await automate.stakingToken();
        const stakingToken = erc20.contract(signer, stakingTokenAddress);
        const stakingTokenDecimals = await stakingToken
          .decimals()
          .then((v: ethersType.BigNumber) => v.toString());
        const poolId = await automate
          .pool()
          .then((v: ethersType.BigNumber) => v.toString());

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
                      .then((v: ethersType.BigNumber) => v.toString())
                  )
                    .div(`1e${stakingTokenDecimals}`)
                    .toString(10),
                }),
              ],
            }),
            async (amount) => {
              const signerBalance = await stakingToken
                .balanceOf(signerAddress)
                .then((v: ethersType.BigNumber) => v.toString());
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
                  .then((v: ethersType.BigNumber) => v.toString())
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
              if (poolId === "0") {
                return {
                  tx: await staking.leaveStaking(userInfo.amount.toString()),
                };
              } else {
                return {
                  tx: await staking.withdraw(
                    poolId,
                    userInfo.amount.toString()
                  ),
                };
              }
            }
          ),
          ...deposit,
        ];
        const runParams = async () => {
          const multicall = new ethersMulticall.Provider(provider);
          await multicall.init();
          const automateMulticall = new ethersMulticall.Contract(
            contractAddress,
            masterChefSingleRestakeABI
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
            .then((v: ethersType.BigNumber) => v.toString());
          const pendingReward = await staking
            .pendingCake(poolId, contractAddress)
            .then((v: ethersType.BigNumber) => v.toString());
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
          contract: stakingTokenAddress,
          deposit,
          refund,
          migrate,
          runParams,
          run,
        };
      }
    ),
    ApeRewardV4Restake: automateAdapter(async (signer, contractAddress) => {
      if (!signer.provider) throw new Error("Provider not found");
      const provider = signer.provider;
      const signerAddress = await signer.getAddress();
      const automate = new ethers.Contract(
        contractAddress,
        apeRewardV4RestakeABI,
        signer
      );
      const stakingAddress = await automate.staking();
      const staking = new ethers.Contract(
        stakingAddress,
        apeRewardV4ABI,
        signer
      );
      const stakingTokenAddress = await automate.stakingToken();
      const stakingToken = erc20.contract(signer, stakingTokenAddress);
      const stakingTokenDecimals = await stakingToken
        .decimals()
        .then((v: ethersType.BigNumber) => v.toString());

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
                    .then((v: ethersType.BigNumber) => v.toString())
                )
                  .div(`1e${stakingTokenDecimals}`)
                  .toString(10),
              }),
            ],
          }),
          async (amount) => {
            const signerBalance = await stakingToken
              .balanceOf(signerAddress)
              .then((v: ethersType.BigNumber) => v.toString());
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
                .then((v: ethersType.BigNumber) => v.toString())
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
            const userInfo = await staking.userInfo(signerAddress);
            if (new bn(userInfo.amount.toString()).lte(0))
              return new Error(
                "Insufficient funds on the staking contract balance"
              );

            return true;
          },
          async () => {
            const userInfo = await staking.userInfo(signerAddress);
            return {
              tx: await staking.withdraw(userInfo.amount.toString()),
            };
          }
        ),
        ...deposit,
      ];
      const runParams = async () => {
        const multicall = new ethersMulticall.Provider(provider);
        await multicall.init();
        const automateMulticall = new ethersMulticall.Contract(
          contractAddress,
          apeRewardV4RestakeABI
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
          .then((v: ethersType.BigNumber) => v.toString());
        const pendingReward = await staking
          .pendingReward(contractAddress)
          .then((v: ethersType.BigNumber) => v.toString());
        const earned = new bn(pendingReward).plus(rewardTokenBalance);
        if (earned.toString(10) === "0") return new Error("No earned");

        const router = uniswap.router.contract(provider, routerAddress);
        const slippage = 1 - slippagePercent / 10000;
        const tokenAmountIn = earned.toFixed(0);
        const swap = [[rewardTokenAddress, stakingTokenAddress], "0"];
        if (
          stakingTokenAddress.toLowerCase() !== rewardTokenAddress.toLowerCase()
        ) {
          const { path, amountOut } = await uniswap.router.autoRoute(
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
    }),
  },
};
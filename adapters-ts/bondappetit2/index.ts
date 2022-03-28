import type ethersType from "ethers";
import { bignumber as bn, ethers, ethersMulticall, axios } from "../lib";
import { stakingAdapter as ethStakingAdapter } from "../utils/ethereum/adapter/base";
import { stakingAdapter as wavesStakingAdapter } from "../utils/waves/adapter/base";
import { bridgeWrapperBuild } from "../utils/coingecko";
import { Staking } from "../utils/adapter/base";
import * as ethereum from "../utils/ethereum/base";
import * as erc20 from "../utils/ethereum/erc20";
import * as uniswap from "../utils/ethereum/uniswap";
import * as synthetix from "../utils/ethereum/adapter/synthetix";
import * as waves from "../utils/waves/base";
import synthetixStakingABI from "./data/stakingABI.json";
import synthetixUniswapLpRestakeABI from "./data/synthetixUniswapLpRestakeABI.json";
import stakingContracts from "./data/stakingContracts.json";

const swopTokenId = "Ehie5xYpeN8op1Cctc6aGUrqx8jq3jtf1DSjXDbfm7aT";

module.exports = {
  staking: ethStakingAdapter(
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
      const priceFeed = bridgeWrapperBuild({}, blockTag, block, network);
      const avgBlockTime = await ethereum.getAvgBlockTime(
        provider,
        blockNumber
      );
      const blocksPerDay = new bn((1000 * 60 * 60 * 24) / avgBlockTime);

      const synthetixContract = new ethers.Contract(
        contractAddress,
        synthetixStakingABI,
        provider
      );
      const multicall = new ethersMulticall.Provider(provider, network);
      const synthetixMulticallContract = new ethersMulticall.Contract(
        contractAddress,
        synthetixStakingABI
      );
      let [
        periodFinish,
        rewardRate,
        totalSupply,
        stakingTokenAddress,
        rewardTokenAddress,
      ] = await multicall.all(
        [
          synthetixMulticallContract.periodFinish(),
          synthetixMulticallContract.rewardRate(),
          synthetixMulticallContract.totalSupply(),
          synthetixMulticallContract.stakingToken(),
          synthetixMulticallContract.rewardsToken(),
        ],
        { blockTag }
      );
      let [stakingTokenDecimals, rewardsTokenDecimals] = await multicall.all([
        erc20.multicallContract(stakingTokenAddress).decimals(),
        erc20.multicallContract(rewardTokenAddress).decimals(),
      ]);
      stakingTokenDecimals = Number(stakingTokenDecimals);
      rewardsTokenDecimals = Number(rewardsTokenDecimals);
      periodFinish = periodFinish.toString();
      rewardRate = ethereum.toBN(rewardRate).div(`1e${rewardsTokenDecimals}`);
      if (new bn(periodFinish).lt(blockNumber)) rewardRate = new bn("0");
      totalSupply = ethereum
        .toBN(totalSupply)
        .div(`1e${uniswap.pair.decimals}`);
      stakingTokenAddress = stakingTokenAddress.toLowerCase();
      rewardTokenAddress = rewardTokenAddress.toLowerCase();
      const rewardTokenPriceUSD = await priceFeed(rewardTokenAddress);
      const stakingTokenPair = await uniswap.pair.PairInfo.create(
        multicall,
        stakingTokenAddress,
        options
      );
      const token0PriceUSD = await priceFeed(stakingTokenPair.token0);
      const token1PriceUSD = await priceFeed(stakingTokenPair.token1);
      const stakingTokenPriceUSD = stakingTokenPair.calcPrice(
        token0PriceUSD,
        token1PriceUSD
      );

      const tvl = totalSupply.multipliedBy(stakingTokenPriceUSD);
      let aprBlock = rewardRate.multipliedBy(rewardTokenPriceUSD).div(tvl);
      if (!aprBlock.isFinite()) aprBlock = new bn(0);
      const aprDay = aprBlock.multipliedBy(blocksPerDay);
      const aprWeek = aprDay.multipliedBy(7);
      const aprMonth = aprDay.multipliedBy(30);
      const aprYear = aprDay.multipliedBy(365);

      return {
        stakeToken: {
          address: stakingTokenAddress,
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
          address: rewardTokenAddress,
          decimals: rewardsTokenDecimals,
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
          let [balance, earned] = await multicall.all(
            [
              synthetixMulticallContract.balanceOf(walletAddress),
              synthetixMulticallContract.earned(walletAddress),
            ],
            { blockTag }
          );
          balance = ethereum.toBN(balance).div(`1e${uniswap.pair.decimals}`);
          earned = ethereum.toBN(earned).div(`1e${rewardsTokenDecimals}`);
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
              [rewardTokenAddress]: {
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
          const rewardTokenContract = erc20.contract(
            signer,
            rewardTokenAddress
          );
          const rewardTokenSymbol = await rewardTokenContract.symbol();
          const stakingTokenContract = erc20.contract(
            signer,
            stakingTokenAddress
          );
          const stakingTokenSymbol = await stakingTokenContract.symbol();
          const stakingTokenDecimals = await stakingTokenContract
            .decimals()
            .then((v: ethersType.BigNumber) => Number(v.toString()));
          const stakingContract = synthetixContract.connect(signer);
          const etherscanAddressURL = "https://etherscan.io/address";

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
                        .div(`1e${stakingTokenDecimals}`)
                        .toString(10)
                    ),
                isApproved: async (amount: string) => {
                  const allowance = await stakingTokenContract
                    .allowance(walletAddress, stakingContract.address)
                    .then(ethereum.toBN);

                  return allowance.isGreaterThanOrEqualTo(
                    new bn(amount).multipliedBy(`1e${stakingTokenDecimals}`)
                  );
                },
                approve: async (amount: string) => ({
                  tx: await erc20.approveAll(
                    stakingTokenContract,
                    walletAddress,
                    stakingContract.address,
                    new bn(amount)
                      .multipliedBy(`1e${stakingTokenDecimals}`)
                      .toFixed(0)
                  ),
                }),
                can: async (amount: string) => {
                  if (amount === "") return Error("Invalid amount");

                  const amountInt = new bn(amount).multipliedBy(
                    `1e${stakingTokenDecimals}`
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
                  tx: await stakingContract.stake(
                    new bn(amount)
                      .multipliedBy(`1e${stakingTokenDecimals}`)
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
                    .balanceOf(walletAddress)
                    .then((v: ethersType.BigNumber) =>
                      ethereum
                        .toBN(v)
                        .div(`1e${stakingTokenDecimals}`)
                        .toString(10)
                    ),
                can: async (amount) => {
                  if (amount === "") return Error("Invalid amount");

                  const amountInt = new bn(amount).multipliedBy(
                    `1e${stakingTokenDecimals}`
                  );
                  if (amountInt.isNaN() || amountInt.lte(0))
                    return Error("Invalid amount");

                  const balance = await stakingContract
                    .balanceOf(walletAddress)
                    .then(ethereum.toBN);
                  if (amountInt.isGreaterThan(balance)) {
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
                    .earned(walletAddress)
                    .then((v: ethersType.BigNumber) =>
                      ethereum
                        .toBN(v)
                        .div(`1e${rewardsTokenDecimals}`)
                        .toString(10)
                    ),
                can: async () => {
                  const earned = stakingContract
                    .earned(walletAddress)
                    .then(ethereum.toBN);
                  if (earned.isLessThanOrEqualTo(0)) {
                    return Error("No earnings");
                  }

                  return true;
                },
                claim: async () => ({
                  tx: await stakingContract.getReward(),
                }),
              },
            },
            exit: {
              name: "staking-exit",
              methods: {
                can: async () => {
                  const balance = await stakingContract
                    .balanceOf(walletAddress)
                    .then(ethereum.toBN);
                  const earned = stakingContract
                    .earned(walletAddress)
                    .then(ethereum.toBN);
                  if (
                    balance.isLessThanOrEqualTo(0) &&
                    earned.isLessThanOrEqualTo(0)
                  ) {
                    return Error("No staked");
                  }

                  return true;
                },
                exit: async () => ({
                  tx: await stakingContract.exit(),
                }),
              },
            },
          };
        },
      };
    }
  ),
  swopfiStaking: wavesStakingAdapter(
    async (provider, contractAddress, initOptions = waves.defaultOptions()) => {
      const options = {
        ...waves.defaultOptions(),
        ...initOptions,
      };
      const lpRes = await axios.get(
        `https://backend.swop.fi/exchangers/${contractAddress}`
      );
      const { stakingIncome, lpFees24, totalLiquidity } = lpRes.data.data;

      const farmingRes = await axios.get(
        "https://backend.swop.fi/farming/info"
      );
      let { shareToken, totalShareTokensLoked } = farmingRes.data.data.find(
        ({ pool }: { pool: string }) => pool === contractAddress
      ) || {
        pool: contractAddress,
        shareToken: "",
        totalShareTokensLoked: "0",
      };
      totalShareTokensLoked = new bn(totalShareTokensLoked).div("1e6");

      const shareTokenInfoRes = await axios.get(
        `https://nodes.wavesnodes.com/assets/details/${shareToken}`
      );
      const { decimals: shareTokenDecimals } = shareTokenInfoRes.data || {
        decimals: 6,
      };

      const ratesRes = await axios.get("https://backend.swop.fi/assets/rates");
      let { rate: swopRate } = ratesRes.data.data[swopTokenId] || { rate: "0" };
      swopRate = new bn(swopRate).div("1e6");
      let { rate: shareRate } = ratesRes.data.data[shareToken] || { rate: "" };
      shareRate = new bn(shareRate).div(`1e${shareTokenDecimals}`);

      const governanceRes = await axios.get(
        "https://backend.swop.fi/governance"
      );
      let { value: poolWeight } = governanceRes.data.data.find(
        ({ key }: { key: string }) =>
          key === `${contractAddress}_current_pool_fraction_reward`
      ) || {
        key: `${contractAddress}_current_pool_fraction_reward`,
        type: "int",
        value: "0",
      };
      poolWeight = new bn(poolWeight).div("1e10");

      const swopAPY =
        totalShareTokensLoked !== "0" && shareRate !== "0"
          ? new bn(1000000)
              .multipliedBy(poolWeight)
              .multipliedBy(swopRate)
              .div(totalShareTokensLoked)
              .div(shareRate)
          : new bn("0");
      const aprDay = new bn(stakingIncome).plus(lpFees24).div(totalLiquidity);
      const aprWeek = aprDay.multipliedBy(7);
      const aprMonth = aprDay.multipliedBy(30);
      const aprYear = aprDay.multipliedBy(365);

      return {
        stakeToken: {
          address: shareToken,
          decimals: 6,
          priceUSD: "0",
        },
        rewardToken: {
          address: swopTokenId,
          decimals: 6,
          priceUSD: "0",
        },
        metrics: {
          tvl: new bn(totalLiquidity).div(`1e6`).toString(10),
          aprDay: aprDay.plus(swopAPY).toString(10),
          aprWeek: aprWeek.plus(swopAPY).toString(10),
          aprMonth: aprMonth.plus(swopAPY).toString(10),
          aprYear: aprYear.plus(swopAPY).toString(10),
        },
        wallet: async (walletAddress) => {
          return {
            staked: {},
            earned: {},
            metrics: {
              staking: "0",
              stakingUSD: "0",
              earned: "0",
              earnedUSD: "0",
            },
            tokens: {},
          };
        },
      };
    }
  ),
  automates: {
    deploy: {
      SynthetixUniswapLpRestake: synthetix.stakingAutomateDeployTabs({
        liquidityRouter: "0x7a250d5630b4cf539739df2c5dacb4c659f2488d",
        defaultContractAddress: stakingContracts[0].stakingContract,
      }),
    },
    SynthetixUniswapLpRestake: synthetix.stakingPairAutomateAdapter({
      automateABI: synthetixUniswapLpRestakeABI,
      stakingABI: synthetixStakingABI,
    }),
  },
};

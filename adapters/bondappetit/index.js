const ethers = require("ethers");
const { coingecko, ethereum, waves, toFloat, tokens } = require("../utils");
const stakingABI = require("./stakingAbi.json");
const bn = require("bignumber.js");

const coingeckoTokenMap = {
  "0x28a06c02287e657ec3f8e151a13c36a1d43814b0": "bondappetit-gov-token",
  "0x9a1997c130f4b2997166975d9aff92797d5134c2": "bond-appetite-usd",
  "0xdac17f958d2ee523a2206206994597c13d831ec7": "tether",
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": "usd-coin",
  "0x674c6ad92fd080e4004b2312b45f796a192d27a0": "neutrino-usd",
  "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c": "wbnb",
  "0x1ad0132d8b5ef3cebda1a9692f36ac30be871b6b": "bondappetit-gov-token",
};
const swopTokenId = "Ehie5xYpeN8op1Cctc6aGUrqx8jq3jtf1DSjXDbfm7aT";

module.exports = {
  staking: async (
    provider,
    contractAddress,
    initOptions = ethereum.defaultOptions()
  ) => {
    const options = {
      ...ethereum.defaultOptions(),
      ...initOptions,
    }
    const blockTag =
      options.blockNumber === "latest"
        ? "latest"
        : parseInt(options.blockNumber, 10);
    const contract = new ethers.Contract(contractAddress, stakingABI, provider);
    const rewardsTokenDecimals = 18;
    const stakingTokenDecimals = 18;
    const block = await provider.getBlock(blockTag);
    const blockNumber = block.number;
    let [
      periodFinish,
      rewardRate,
      totalSupply,
      stakingToken,
      rewardsToken,
    ] = await Promise.all([
      contract.periodFinish({ blockTag }),
      contract.rewardRate({ blockTag }),
      contract.totalSupply({ blockTag }),
      contract.stakingToken({ blockTag }),
      contract.rewardsToken({ blockTag }),
    ]);
    periodFinish = periodFinish.toString();
    rewardRate = toFloat(rewardRate, rewardsTokenDecimals);
    if (new bn(periodFinish).lt(blockNumber)) rewardRate = new bn("0");
    totalSupply = toFloat(totalSupply, ethereum.uniswap.pairDecimals);
    stakingToken = stakingToken.toLowerCase();
    rewardsToken = rewardsToken.toLowerCase();
    const rewardTokenUSD = await coingecko.getPriceUSD(
      blockTag === "latest",
      block,
      coingeckoTokenMap[rewardsToken]
    );
    const {
      token0,
      reserve0,
      token1,
      reserve1,
      totalSupply: lpTotalSupply,
    } = await ethereum.uniswap.pairInfo(provider, stakingToken);
    const token0Usd = await coingecko.getPriceUSD(
      blockTag === "latest",
      block,
      coingeckoTokenMap[token0]
    );
    const token1Usd = await coingecko.getPriceUSD(
      blockTag === "latest",
      block,
      coingeckoTokenMap[token1]
    );
    let stakingTokenUSD = new bn(reserve0)
      .multipliedBy(token0Usd)
      .plus(new bn(reserve1).multipliedBy(token1Usd))
      .div(lpTotalSupply);
    if (!stakingTokenUSD.isFinite()) stakingTokenUSD = new bn(0);

    const tvl = totalSupply.multipliedBy(stakingTokenUSD);
    let aprBlock = rewardRate.multipliedBy(rewardTokenUSD).div(tvl);
    if (!aprBlock.isFinite()) aprBlock = new bn(0);
    let blocksPerDay = new bn(60).div(13.2).multipliedBy(60).multipliedBy(24);
    const aprDay = aprBlock.multipliedBy(blocksPerDay);
    const aprWeek = aprBlock.multipliedBy(blocksPerDay.multipliedBy(7));
    const aprMonth = aprBlock.multipliedBy(blocksPerDay.multipliedBy(30));
    const aprYear = aprBlock.multipliedBy(blocksPerDay.multipliedBy(365));

    return {
      staking: {
        token: stakingToken,
        decimals: stakingTokenDecimals,
      },
      reward: {
        token: rewardsToken,
        decimals: rewardsTokenDecimals,
      },
      metrics: {
        tvl: tvl.toString(10),
        aprDay: aprDay.toString(10),
        aprWeek: aprWeek.toString(10),
        aprMonth: aprMonth.toString(10),
        aprYear: aprYear.toString(10),
      },
      wallet: async (walletAddress) => {
        let [balance, earned] = await Promise.all([
          contract.balanceOf(walletAddress, {
            blockTag,
          }),
          contract.earned(walletAddress, {
            blockTag,
          }),
        ]);
        balance = toFloat(balance, ethereum.uniswap.pairDecimals);
        earned = toFloat(earned, rewardsTokenDecimals);
        let token0Balance = balance.multipliedBy(reserve0).div(lpTotalSupply);
        if (!token0Balance.isFinite()) token0Balance = new bn(0);
        const token0BalanceUSD = token0Balance.multipliedBy(token0Usd);
        let token1Balance = balance.multipliedBy(reserve1).div(lpTotalSupply);
        if (!token1Balance.isFinite()) token1Balance = new bn(0);
        const token1BalanceUSD = token1Balance.multipliedBy(token1Usd);
        const earnedUSD = earned.multipliedBy(rewardTokenUSD);

        return {
          staked: {
            [token0]: {
              balance: token0Balance.toString(10),
              usd: token0BalanceUSD.toString(10),
            },
            [token1]: {
              balance: token1Balance.toString(10),
              usd: token1BalanceUSD.toString(10),
            },
          },
          earned: {
            [rewardsToken]: {
              balance: earned.toString(10),
              usd: earnedUSD.toString(10),
            },
          },
          metrics: {
            staking: balance.toString(10),
            stakingUSD: balance.multipliedBy(stakingTokenUSD).toString(10),
            earned: earned.toString(10),
            earnedUSD: earnedUSD.toString(10),
          },
          tokens: tokens(
            {
              token: token0,
              data: {
                balance: token0Balance.toString(10),
                usd: token0BalanceUSD.toString(10),
              },
            },
            {
              token: token1,
              data: {
                balance: token1Balance.toString(10),
                usd: token1BalanceUSD.toString(10),
              },
            },
            {
              token: rewardsToken,
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
        const stakingTokenContract = ethereum
          .erc20(provider, stakingToken)
          .connect(signer);
        const stakingContract = contract.connect(signer);

        return {
          stake: {
            can: async (amount) => {
              const balance = await stakingTokenContract.balanceOf(
                walletAddress
              );
              if (bn(amount).isGreaterThan(balance.toString())) {
                return Error("Amount exceeds balance");
              }

              return true;
            },
            send: async (amount) => {
              await stakingTokenContract.approve(contractAddress, amount);
              await stakingContract.stake(amount);
            },
          },
          unstake: {
            can: async (amount) => {
              const balance = await contract.balanceOf(walletAddress);
              if (bn(amount).isGreaterThan(balance.toString())) {
                return Error("Amount exceeds balance");
              }

              return true;
            },
            send: async (amount) => {
              await stakingContract.withdraw(amount);
            },
          },
          claim: {
            can: async () => {
              const earned = await contract.earned(walletAddress);
              if (bn(earned).isLessThanOrEqualTo(0)) {
                return Error("No earnings");
              }
              return true;
            },
            send: async () => {
              await stakingContract.getReward();
            },
          },
          exit: {
            can: async () => {
              return true;
            },
            send: async () => {
              await stakingContract.exit();
            },
          },
        };
      },
    };
  },
  swopfiStaking: async (
    provider,
    contractAddress,
    initOptions = waves.defaultOptions()
  ) => {
    const options = {
      ...waves.defaultOptions(),
      ...initOptions,
    }
    const lpRes = await axios.get(
      `https://backend.swop.fi/exchangers/${contractAddress}`
    );
    const { stakingIncome, lpFees24, totalLiquidity } = lpRes.data.data;

    const farmingRes = await axios.get("https://backend.swop.fi/farming/info");
    let { shareToken, totalShareTokensLoked } = farmingRes.data.data.find(
      ({ pool }) => pool === contractAddress
    ) || { pool: contractAddress, shareToken: "", totalShareTokensLoked: "0" };
    totalShareTokensLoked = toFloat(totalShareTokensLoked, 6);

    const shareTokenInfoRes = await axios.get(
      `https://nodes.wavesnodes.com/assets/details/${shareToken}`
    );
    const { decimals: shareTokenDecimals } = shareTokenInfoRes.data || {
      decimals: 6,
    };

    const ratesRes = await axios.get("https://backend.swop.fi/assets/rates");
    let { rate: swopRate } = ratesRes.data.data[swopTokenId] || { rate: "0" };
    swopRate = toFloat(swopRate, 6);
    let { rate: shareRate } = ratesRes.data.data[shareToken] || { rate: "" };
    shareRate = toFloat(shareRate, shareTokenDecimals);

    const governanceRes = await axios.get("https://backend.swop.fi/governance");
    let { value: poolWeight } = governanceRes.data.data.find(
      ({ key }) => key === `${contractAddress}_current_pool_fraction_reward`
    ) || {
      key: `${contractAddress}_current_pool_fraction_reward`,
      type: "int",
      value: "0",
    };
    poolWeight = toFloat(poolWeight, 10);

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
      metrics: {
        tvl: toFloat(totalLiquidity, 6).toString(10),
        aprDay: aprDay.plus(swopAPY).toString(10),
        aprWeek: aprWeek.plus(swopAPY).toString(10),
        aprMonth: aprMonth.plus(swopAPY).toString(10),
        aprYear: aprYear.plus(swopAPY).toString(10),
      },
      wallet: async (walletAddress) => {
        return {
          tokens: {},
        };
      },
    };
  },
};

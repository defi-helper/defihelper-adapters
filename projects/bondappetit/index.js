const ethers = require("ethers");
const { coingecko, ethereum, toFloat, tokens } = require("../utils");
const stakingABI = require("./stakingAbi.json");
const bn = require("bignumber.js");

module.exports = {
  staking: async (provider, contractAddress) => {
    const contract = new ethers.Contract(contractAddress, stakingABI, provider);
    const rewardsTokenDecimals = 18;
    let [
      blockNumber,
      periodFinish,
      rewardRate,
      totalSupply,
      stakingToken,
      rewardsToken,
    ] = await Promise.all([
      provider.getBlockNumber(),
      contract.periodFinish(),
      contract.rewardRate(),
      contract.totalSupply(),
      contract.stakingToken(),
      contract.rewardsToken(),
    ]);
    blockNumber = blockNumber.toString();
    periodFinish = periodFinish.toString();
    rewardRate = toFloat(rewardRate, rewardsTokenDecimals);
    if (new bn(periodFinish).lt(blockNumber)) rewardRate = new bn("0");
    totalSupply = toFloat(totalSupply, ethereum.uniswap.pairDecimals);
    stakingToken = stakingToken.toLowerCase();
    rewardsToken = rewardsToken.toLowerCase();
    const rewardsTokenPrice = await coingecko.simple.tokenPrice(
      "ethereum",
      rewardsToken,
      "usd"
    );
    const rewardTokenUSD = rewardsTokenPrice[rewardsToken].usd;
    const { priceUSD: stakingTokenUSD } = await ethereum.uniswap.pairInfo(
      provider,
      stakingToken
    );

    const tvl = totalSupply.multipliedBy(stakingTokenUSD);
    let aprBlock = rewardRate.multipliedBy(rewardTokenUSD).div(tvl);
    if (aprBlock.isNaN()) aprBlock = new bn(0);
    let blocksPerDay = new bn(60).div(13.2).multipliedBy(60).multipliedBy(24);
    if (blocksPerDay.isNaN()) blocksPerDay = new bn(0);
    const aprDay = aprBlock.multipliedBy(blocksPerDay);
    const aprWeek = aprBlock.multipliedBy(blocksPerDay.multipliedBy(7));
    const aprMonth = aprBlock.multipliedBy(blocksPerDay.multipliedBy(30));
    const aprYear = aprBlock.multipliedBy(blocksPerDay.multipliedBy(365));

    return {
      metrics: {
        tvl: tvl.toString(10),
        aprDay: aprDay.toString(10),
        aprWeek: aprWeek.toString(10),
        aprMonth: aprMonth.toString(10),
        aprYear: aprYear.toString(10),
      },
      wallet: async (walletAddress) => {
        let [balance, earned] = await Promise.all([
          contract.balanceOf(walletAddress),
          contract.earned(walletAddress),
        ]);
        balance = toFloat(balance, ethereum.uniswap.pairDecimals);
        earned = toFloat(earned, rewardsTokenDecimals);
        const {
          token0,
          token0Usd,
          reserve0,
          token1,
          token1Usd,
          reserve1,
          totalSupply,
          priceUSD: stakingTokenUSD,
        } = await ethereum.uniswap.pairInfo(provider, stakingToken);
        const token0Balance = balance.multipliedBy(reserve0).div(totalSupply);
        const token0BalanceUSD = token0Balance.multipliedBy(token0Usd);
        const token1Balance = balance.multipliedBy(reserve1).div(totalSupply);
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

      stake: async () => {},
      unstake: async () => {},
      claim: async () => {},
      exit: async () => {},
    };
  },
};

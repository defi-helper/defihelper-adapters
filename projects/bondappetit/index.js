const ethers = require("ethers");
const { USDollar, Percent, coingecko, ethereum } = require("../utils");
const stakingABI = require("./stakingAbi.json");
const bn = require("bignumber.js");

module.exports = {
  metrics: {
    staking: {
      contract: async (provider, contractAddress) => {
        const contract = new ethers.Contract(
          contractAddress,
          stakingABI,
          provider
        );
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
        rewardRate = rewardRate.toString();
        if (new bn(periodFinish).lt(blockNumber)) {
          rewardRate = "0";
        }
        totalSupply = totalSupply.toString();
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

        const rewardsTokenDecimals = 18;
        let aprBlock = new bn(rewardRate)
          .div(new bn(10).pow(rewardsTokenDecimals))
          .multipliedBy(rewardTokenUSD)
          .div(
            new bn(totalSupply)
              .div(new bn(10).pow(ethereum.uniswap.pairDecimals))
              .multipliedBy(stakingTokenUSD)
          );
        if (aprBlock.isNaN()) aprBlock = new bn(0);
        let blocksPerDay = new bn(60)
          .div(13.2)
          .multipliedBy(60)
          .multipliedBy(24);
        if (blocksPerDay.isNaN()) blocksPerDay = new bn(0);

        return {
          tvl: USDollar(
            new bn(totalSupply)
              .div(new bn(10).pow(ethereum.uniswap.pairDecimals))
              .multipliedBy(stakingTokenUSD)
              .toString(10)
          ),
          aprDay: Percent(aprBlock.multipliedBy(blocksPerDay).toString(10)),
          aprWeek: Percent(
            aprBlock.multipliedBy(blocksPerDay.multipliedBy(7)).toString(10)
          ),
          aprMonth: Percent(
            aprBlock.multipliedBy(blocksPerDay.multipliedBy(30)).toString(10)
          ),
          aprYear: Percent(
            aprBlock.multipliedBy(blocksPerDay.multipliedBy(365)).toString(10)
          ),
        };
      },
      wallet: async (provider, contractAddress, walletAddress) => {
        const contract = new ethers.Contract(
          contractAddress,
          stakingABI,
          provider
        );
        let [balance, earned, stakingToken, rewardsToken] = await Promise.all([
          contract.balanceOf(walletAddress),
          contract.earned(walletAddress),
          contract.stakingToken(),
          contract.rewardsToken(),
        ]);
        balance = balance.toString();
        earned = earned.toString();
        stakingToken = stakingToken.toLowerCase();
        rewardsToken = rewardsToken.toLowerCase();
        const rewardsTokenDecimals = 18;
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

        return {
          balance: USDollar(
            new bn(balance)
              .div(new bn(10).pow(ethereum.uniswap.pairDecimals))
              .multipliedBy(stakingTokenUSD)
              .toString(10)
          ),
          earned: USDollar(
            new bn(earned)
              .div(new bn(10).pow(rewardsTokenDecimals))
              .multipliedBy(rewardTokenUSD)
              .toString(10)
          ),
        };
      },
    },
  },
};

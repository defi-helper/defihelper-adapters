const { ethers, bn, ethersMulticall, dayjs } = require('../lib');
const { ethereum, toFloat, tokens, coingecko, staking } = require('../utils');
const AutomateActions = require('../utils/automate/actions');
const masterChefABI = require('./abi/masterChefABI.json');
const apeRewardV4ABI = require('./abi/apeRewardV4.json');
const masterChefSavedPools = require('./abi/masterChefPools.json');
const bridgeTokens = require('./abi/bridgeTokens.json');

const masterChefAddress = '0x5c8D727b265DBAfaba67E050f2f739cAeEB4A6F9';

function masterChefActionsFactory(stakingTokenContract, stakingContract, pool) {
  return async (walletAddress) => ({
    stake: {
      can: async (amount) => {
        const balance = await stakingTokenContract.balanceOf(walletAddress);
        if (new bn(amount).isGreaterThan(balance.toString())) {
          return Error('Amount exceeds balance');
        }

        return true;
      },
      send: async (amount) => {
        await stakingTokenContract.approve(masterChefAddress, amount);
        await stakingContract.deposit(pool.index, amount);
      },
    },
    unstake: {
      can: async (amount) => {
        const userInfo = await stakingContract.userInfo(pool.index, walletAddress);
        if (new bn(amount).isGreaterThan(userInfo.amount.toString())) {
          return Error('Amount exceeds balance');
        }

        return true;
      },
      send: async (amount) => {
        await stakingContract.withdraw(pool.index, amount);
      },
    },
    claim: {
      can: async () => {
        const { amount, rewardDebt } = await stakingContract.userInfo(pool.index, walletAddress);
        const { accRewardPerShare } = await stakingContract.poolInfo(pool.index);
        const earned = new bn(amount.toString())
          .multipliedBy(accRewardPerShare.toString())
          .div(new bn(10).pow(12))
          .minus(rewardDebt.toString());
        if (earned.isLessThanOrEqualTo(0)) {
          return Error('No earnings');
        }
        return true;
      },
      send: async () => {
        await stakingContract.deposit(pool.index, 0);
      },
    },
    exit: {
      can: async () => {
        const userInfo = await stakingContract.userInfo(pool.index, walletAddress);
        if (new bn(userInfo.amount.toString()).isLessThanOrEqualTo(0)) {
          return Error('No LP in contract');
        }

        return true;
      },
      send: async () => {
        const userInfo = await stakingContract.userInfo(pool.index, walletAddress);
        await stakingContract.withdraw(pool.index, userInfo.amount.toString());
      },
    },
  });
}

module.exports = {
  masterChefPair: async (provider, contractAddress, initOptions = ethereum.defaultOptions()) => {
    const options = {
      ...ethereum.defaultOptions(),
      ...initOptions,
    };
    const blockTag = options.blockNumber === 'latest' ? 'latest' : parseInt(options.blockNumber, 10);
    const network = (await provider.detectNetwork()).chainId;
    const block = await provider.getBlock(blockTag);
    const blockNumber = block.number;
    const avgBlockTime = await ethereum.getAvgBlockTime(provider, blockNumber);
    const rewardTokenFunctionName = 'cake';

    const pool = masterChefSavedPools.find((p) => p.stakingToken.toLowerCase() === contractAddress.toLowerCase());
    if (!pool) {
      throw new Error('Pool is not found');
    }

    const masterChiefContract = new ethers.Contract(masterChefAddress, masterChefABI, provider);
    const poolInfo = await masterChiefContract.poolInfo(pool.index);

    const rewardToken = (await masterChiefContract[rewardTokenFunctionName]()).toLowerCase();
    const rewardsTokenDecimals = 18;
    const rewardTokenPriceUSD = await coingecko.getPriceUSDByContract(
      coingecko.platformByEthereumNetwork(network),
      blockTag === 'latest',
      block,
      rewardToken
    );
    const [rewardTokenPerBlock, totalAllocPoint] = await Promise.all([
      await masterChiefContract[`${rewardTokenFunctionName}PerBlock`](),
      await masterChiefContract.totalAllocPoint(),
    ]);
    const rewardPerBlock = toFloat(
      new bn(poolInfo.allocPoint.toString())
        .multipliedBy(rewardTokenPerBlock.toString())
        .dividedBy(totalAllocPoint.toString()),
      rewardsTokenDecimals
    );

    const stakingToken = contractAddress.toLowerCase();
    const stakingTokenDecimals = 18;
    const stakingTokenPair = await ethereum.uniswap.pairInfo(provider, stakingToken);
    const token0Alias = bridgeTokens[stakingTokenPair.token0.toLowerCase()];
    const token1Alias = bridgeTokens[stakingTokenPair.token1.toLowerCase()];
    const token0PriceUSD = await coingecko.getPriceUSDByContract(
      token0Alias ? token0Alias.platform : coingecko.platformByEthereumNetwork(network),
      blockTag === 'latest',
      block,
      token0Alias ? token0Alias.token : stakingTokenPair.token0
    );
    const token1PriceUSD = await coingecko.getPriceUSDByContract(
      token1Alias ? token1Alias.platform : coingecko.platformByEthereumNetwork(network),
      blockTag === 'latest',
      block,
      token1Alias ? token1Alias.token : stakingTokenPair.token1
    );
    const stakingTokenPriceUSD = stakingTokenPair.calcPrice(token0PriceUSD, token1PriceUSD);

    const totalLocked = toFloat(
      await ethereum.erc20(provider, contractAddress).balanceOf(masterChefAddress),
      stakingTokenDecimals
    );
    const tvl = new bn(totalLocked).multipliedBy(stakingTokenPriceUSD);

    let aprBlock = rewardPerBlock.multipliedBy(rewardTokenPriceUSD).div(tvl);
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
        const { amount, rewardDebt } = await masterChiefContract.userInfo(pool.index, walletAddress);
        const balance = toFloat(amount, stakingTokenDecimals);
        const earned = toFloat(
          new bn(amount.toString())
            .multipliedBy(poolInfo.accCakePerShare.toString())
            .div(new bn(10).pow(12))
            .minus(rewardDebt.toString())
            .toString(10),
          rewardsTokenDecimals
        );
        const expandedBalance = stakingTokenPair.expandBalance(balance);
        const reviewedBalance = [
          {
            token: stakingTokenPair.token0,
            balance: expandedBalance.token0.toString(10),
            usd: expandedBalance.token0.multipliedBy(token0PriceUSD).toString(10),
          },
          {
            token: stakingTokenPair.token1,
            balance: expandedBalance.token1.toString(10),
            usd: expandedBalance.token1.multipliedBy(token1PriceUSD).toString(10),
          },
        ];
        const earnedUSD = earned.multipliedBy(rewardTokenPriceUSD);

        return {
          staked: reviewedBalance.reduce((res, b) => {
            res[b.token] = {
              balance: b.balance,
              usd: b.usd,
            };
            return res;
          }, {}),
          earned: {
            [rewardToken]: {
              balance: earned.toString(10),
              usd: earnedUSD.toString(10),
            },
          },
          metrics: {
            staking: balance.toString(10),
            stakingUSD: balance.multipliedBy(stakingTokenPriceUSD).toString(10),
            earned: earned.toString(10),
            earnedUSD: earnedUSD.toString(10),
          },
          tokens: tokens(
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
          throw new Error('Signer not found, use options.signer for use actions');
        }
        const { signer } = options;

        return masterChefActionsFactory(
          ethereum.erc20(provider, stakingToken).connect(signer),
          masterChiefContract.connect(signer),
          pool
        )(walletAddress);
      },
    };
  },
  masterChefSingle: async (provider, contractAddress, initOptions = ethereum.defaultOptions()) => {
    const options = {
      ...ethereum.defaultOptions(),
      ...initOptions,
    };
    const blockTag = options.blockNumber === 'latest' ? 'latest' : parseInt(options.blockNumber, 10);
    const network = (await provider.detectNetwork()).chainId;
    const block = await provider.getBlock(blockTag);
    const blockNumber = block.number;
    const avgBlockTime = await ethereum.getAvgBlockTime(provider, blockNumber);
    const rewardTokenFunctionName = 'cake';

    const pool = masterChefSavedPools.find((p) => p.stakingToken.toLowerCase() === contractAddress.toLowerCase());
    if (!pool) {
      throw new Error('Pool is not found');
    }

    const masterChiefContract = new ethers.Contract(masterChefAddress, masterChefABI, provider);
    const poolInfo = await masterChiefContract.poolInfo(pool.index);

    const rewardToken = (await masterChiefContract[rewardTokenFunctionName]()).toLowerCase();
    const rewardsTokenDecimals = 18;
    const rewardTokenPriceUSD = await coingecko.getPriceUSDByContract(
      coingecko.platformByEthereumNetwork(network),
      blockTag === 'latest',
      block,
      rewardToken
    );
    const [rewardTokenPerBlock, totalAllocPoint] = await Promise.all([
      await masterChiefContract[`${rewardTokenFunctionName}PerBlock`](),
      await masterChiefContract.totalAllocPoint(),
    ]);
    const rewardPerBlock = toFloat(
      new bn(poolInfo.allocPoint.toString())
        .multipliedBy(rewardTokenPerBlock.toString())
        .dividedBy(totalAllocPoint.toString()),
      rewardsTokenDecimals
    );

    const stakingToken = contractAddress.toLowerCase();
    const stakingTokenDecimals = await ethereum
      .erc20(provider, stakingToken)
      .decimals()
      .then((v) => Number(v.toString()));
    const stakingTokenPriceUSD = await coingecko.getPriceUSDByContract(
      coingecko.platformByEthereumNetwork(network),
      blockTag === 'latest',
      block,
      stakingToken
    );

    const totalLocked = toFloat(
      await ethereum.erc20(provider, contractAddress).balanceOf(masterChefAddress),
      stakingTokenDecimals
    );
    const tvl = new bn(totalLocked).multipliedBy(stakingTokenPriceUSD);

    let aprBlock = rewardPerBlock.multipliedBy(rewardTokenPriceUSD).div(tvl);
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
        const { amount, rewardDebt } = await masterChiefContract.userInfo(pool.index, walletAddress);
        const balance = toFloat(amount, stakingTokenDecimals);
        const earned = toFloat(
          new bn(amount.toString())
            .multipliedBy(poolInfo.accCakePerShare.toString())
            .div(new bn(10).pow(12))
            .minus(rewardDebt.toString())
            .toString(10),
          rewardsTokenDecimals
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
            stakingUSD: balance.multipliedBy(stakingTokenPriceUSD).toString(10),
            earned: earned.toString(10),
            earnedUSD: earnedUSD.toString(10),
          },
          tokens: tokens(
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
          throw new Error('Signer not found, use options.signer for use actions');
        }
        const { signer } = options;

        return masterChefActionsFactory(
          ethereum.erc20(provider, stakingToken).connect(signer),
          masterChiefContract.connect(signer),
          pool
        )(walletAddress);
      },
    };
  },
  apeRewardV4: async (provider, contractAddress, initOptions = ethereum.defaultOptions()) => {
    const options = {
      ...ethereum.defaultOptions(),
      ...initOptions,
    };
    const blockTag = options.blockNumber === 'latest' ? 'latest' : parseInt(options.blockNumber, 10);
    const network = (await provider.detectNetwork()).chainId;
    const block = await provider.getBlock(blockTag);
    const blockNumber = block.number;
    const avgBlockTime = await ethereum.getAvgBlockTime(provider, blockNumber);

    const apeRewardContract = new ethers.Contract(contractAddress, apeRewardV4ABI, provider);
    const poolInfo = await apeRewardContract.poolInfo();

    const rewardToken = await apeRewardContract.REWARD_TOKEN().then((v) => v.toLowerCase());
    const rewardsTokenDecimals = await ethereum
      .erc20(provider, rewardToken)
      .decimals()
      .then((v) => Number(v.toString()));
    const rewardTokenPriceUSD = await coingecko.getPriceUSDByContract(
      coingecko.platformByEthereumNetwork(network),
      blockTag === 'latest',
      block,
      rewardToken
    );
    const rewardTokenPerBlock = await apeRewardContract
      .rewardPerBlock()
      .then((v) => toFloat(new bn(v.toString()), rewardsTokenDecimals));

    const stakingToken = await apeRewardContract.STAKE_TOKEN().then((v) => v.toLowerCase());
    const stakingTokenDecimals = await ethereum
      .erc20(provider, stakingToken)
      .decimals()
      .then((v) => Number(v.toString()));
    const stakingTokenPriceUSD = await coingecko.getPriceUSDByContract(
      coingecko.platformByEthereumNetwork(network),
      blockTag === 'latest',
      block,
      stakingToken
    );

    const totalLocked = toFloat(await apeRewardContract.totalStaked().then((v) => v.toString()), stakingTokenDecimals);
    const tvl = new bn(totalLocked).multipliedBy(stakingTokenPriceUSD);

    let aprBlock = rewardTokenPerBlock.multipliedBy(rewardTokenPriceUSD).div(tvl);
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
        const { amount, rewardDebt } = await apeRewardContract.userInfo(walletAddress);
        let accRewardTokenPerShare = new bn(poolInfo.accRewardTokenPerShare.toString());
        if (blockNumber > Number(poolInfo.lastRewardBlock.toString()) && totalLocked != 0) {
          const multiplier = await apeRewardContract
            .getMultiplier(poolInfo.lastRewardBlock.toString(), blockNumber)
            .then((v) => new bn(v.toString()));
          const tokenReward = multiplier
            .multipliedBy(new bn(rewardTokenPerBlock).multipliedBy(`1e${rewardsTokenDecimals}`))
            .multipliedBy(poolInfo.allocPoint.toString())
            .div(1000);
          accRewardTokenPerShare = accRewardTokenPerShare.plus(
            tokenReward.multipliedBy('1e30').div(new bn(totalLocked).multipliedBy(`1e${stakingTokenDecimals}`))
          );
        }

        const balance = toFloat(amount, stakingTokenDecimals);
        const earned = toFloat(
          new bn(amount.toString())
            .multipliedBy(accRewardTokenPerShare)
            .div(new bn(10).pow(30))
            .minus(rewardDebt.toString())
            .toString(10),
          rewardsTokenDecimals
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
            stakingUSD: balance.multipliedBy(stakingTokenPriceUSD).toString(10),
            earned: earned.toString(10),
            earnedUSD: earnedUSD.toString(10),
          },
          tokens: tokens(
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
          throw new Error('Signer not found, use options.signer for use actions');
        }
        const { signer } = options;
        const stakingTokenContract = ethereum.erc20(provider, stakingToken).connect(signer);
        const stakingContract = apeRewardContract.connect(signer);

        return {
          stake: {
            can: async (amount) => {
              const balance = await stakingTokenContract.balanceOf(walletAddress);
              if (new bn(amount).isGreaterThan(balance.toString())) {
                return Error('Amount exceeds balance');
              }

              return true;
            },
            send: async (amount) => {
              await stakingTokenContract.approve(contractAddress, amount);
              await stakingContract.deposit(amount);
            },
          },
          unstake: {
            can: async (amount) => {
              const userInfo = await stakingContract.userInfo(walletAddress);
              if (new bn(amount).isGreaterThan(userInfo.amount.toString())) {
                return Error('Amount exceeds balance');
              }

              return true;
            },
            send: async (amount) => {
              await stakingContract.withdraw(amount);
            },
          },
          claim: {
            can: async () => true,
            send: async () => {
              await stakingContract.deposit(0);
            },
          },
          exit: {
            can: async () => {
              const userInfo = await stakingContract.userInfo(walletAddress);
              if (new bn(userInfo.amount.toString()).isLessThanOrEqualTo(0)) {
                return Error('No token in contract');
              }

              return true;
            },
            send: async () => {
              const userInfo = await stakingContract.userInfo(walletAddress);
              await stakingContract.withdraw(userInfo.amount.toString());
            },
          },
        };
      },
    };
  },
  automates: {},
};

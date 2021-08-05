const { ethers, bn } = require('../lib');
const { coingecko, ethereum, toFloat, tokens } = require('../utils');
const masterChef = require('./abi/masterChefABI.json');

const masterChefAddress = '0x73feaa1ee314f8c655e354234017be2193c9e24e';
const valutAddress = '0xa80240Eb5d7E05d3F250cF000eEc0891d00b51CC';

module.exports = {
  cakeStaking: async (
    provider,
    contractAddress, //For instance: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82'
    initOptions = ethereum.defaultOptions()
  ) => {
    const options = {
      ...ethereum.defaultOptions(),
      ...initOptions,
    };
    const blockTag = options.blockNumber === 'latest' ? 'latest' : parseInt(options.blockNumber, 10);
    const network = (await provider.detectNetwork()).chainId;
    const block = await provider.getBlock(blockTag);
    const blockNumber = block.number;
    const avgBlockTime = await ethereum.getAvgBlockTime(provider, blockNumber);

    const masterChiefContract = new ethers.Contract(masterChefAddress, masterChef, provider);

    const pool = await masterChiefContract.poolInfo(0);

    const rewardsTokenDecimals = 18;
    const stakingTokenDecimals = 18;
    const stakingToken = (await masterChiefContract.cake()).toLowerCase();
    const rewardsToken = stakingToken;

    const [cakePerBlock, totalAllocPoint] = await Promise.all([
      await masterChiefContract.cakePerBlock(),
      await masterChiefContract.totalAllocPoint(),
    ]);

    const rewardPerBlock = toFloat(
      new bn(pool.allocPoint.toString()).multipliedBy(cakePerBlock.toString()).dividedBy(totalAllocPoint.toString()),
      rewardsTokenDecimals
    );

    const totalRawLocked = toFloat(
      await ethereum.erc20(provider, contractAddress).balanceOf(masterChefAddress),
      stakingTokenDecimals
    );
    const totalValutLocked = toFloat(
      (await masterChiefContract.userInfo(0, valutAddress)).amount,
      stakingTokenDecimals
    );
    const totalLocked = totalRawLocked.minus(totalValutLocked);

    let tokenUSD = new bn(
      await coingecko.getPriceUSDByContract(
        coingecko.platformByEthereumNetwork(network),
        blockTag === 'latest',
        block,
        stakingToken
      )
    );

    if (!tokenUSD.isFinite()) tokenUSD = new bn(0);

    const tvl = new bn(totalLocked).multipliedBy(tokenUSD);

    let aprBlock = rewardPerBlock.multipliedBy(tokenUSD).div(tvl);
    if (!aprBlock.isFinite()) aprBlock = new bn(0);

    const blocksPerDay = new bn((1000 * 60 * 60 * 24) / avgBlockTime);
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
        tokenPerBlock: rewardPerBlock.toString(),
        rewardPerDay: rewardPerBlock.multipliedBy(blocksPerDay).toString(),
      },
      wallet: async (walletAddress) => {
        let { amount, rewardDebt } = await masterChiefContract.userInfo(0, walletAddress);
        const balance = toFloat(amount, stakingTokenDecimals);
        const earned = toFloat(rewardDebt, rewardsTokenDecimals);
        const balanceUsd = balance.multipliedBy(tokenUSD);
        const earnedUSD = earned.multipliedBy(tokenUSD);

        return {
          staked: {
            [stakingToken]: {
              balance: balance.toString(10),
              usd: balanceUsd.toString(10),
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
            stakingUSD: balanceUsd.toString(10),
            earned: earned.toString(10),
            earnedUSD: earnedUSD.toString(10),
          },
          tokens: tokens({
            token: rewardsToken,
            data: {
              balance: earned.plus(balance).toString(10),
              usd: earnedUSD.plus(balanceUsd).toString(10),
            },
          }),
        };
      },

      actions: async (walletAddress) => {
        if (options.signer === null) {
          throw new Error('Signer not found, use options.signer for use actions');
        }
        const { signer } = options;
        const stakingTokenContract = ethereum.erc20(provider, stakingToken).connect(signer);
        const stakingContract = masterChiefContract.connect(signer);

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
              await stakingTokenContract.approve(masterChefAddress, amount);
              await stakingContract.enterStaking(amount);
            },
          },
          unstake: {
            can: async (amount) => {
              const userInfo = await stakingContract.userInfo(poolIndex, walletAddress);
              if (new bn(amount).isGreaterThan(userInfo.amount.toString())) {
                return Error('Amount exceeds balance');
              }

              return true;
            },
            send: async (amount) => {
              await stakingContract.leaveStaking(amount);
            },
          },
          claim: {
            can: async () => {
              const earned = await masterChiefContract.pendingCake(poolIndex, walletAddress);
              if (new bn(earned.toString()).isLessThanOrEqualTo(0)) {
                return Error('No earnings');
              }
              return true;
            },
            send: async () => {
              await stakingContract.leaveStaking(0);
            },
          },
          exit: {
            can: async () => {
              const userInfo = await stakingContract.userInfo(poolIndex, walletAddress);
              if (new bn(userInfo.amount.toString()).isLessThanOrEqualTo(0)) {
                return Error('No LP in contract');
              }

              return true;
            },
            send: async () => {
              const userInfo = await stakingContract.userInfo(poolIndex, walletAddress);
              await stakingContract.leaveStaking(userInfo.amount.toString());
            },
          },
        };
      },
    };
  },
};

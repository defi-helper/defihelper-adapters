const { ethers, bn } = require('../../lib');
const { bridgeWrapperBuild } = require('../coingecko');
const { ethereum } = require('../ethereum');
const { toFloat } = require('../toFloat');
const { tokens } = require('../tokens');
const AutomateActions = require('../automate/actions');
const { getMasterChefStakingToken } = require('./masterChefStakingToken');

module.exports = {
  /**
   *
   * @param {!string} masterChefAddress
   * @param {!string} rewardTokenFunctionName
   * @param {!*} masterChefABI
   * @param {{index: number, stakingToken: string}[]} masterChefSavedPools
   * @param {number[]} bannedPoolIndexes
   */
  masterChef: (
    masterChefAddress,
    rewardTokenFunctionName,
    masterChefABI,
    masterChefSavedPools,
    bannedPoolIndexes = []
  ) => {
    return async (provider, contractAddress, initOptions = ethereum.defaultOptions()) => {
      const options = {
        ...ethereum.defaultOptions(),
        ...initOptions,
      };
      const blockTag = options.blockNumber === 'latest' ? 'latest' : parseInt(options.blockNumber, 10);
      const network = (await provider.detectNetwork()).chainId;
      const block = await provider.getBlock(blockTag);
      const blockNumber = block.number;
      const priceFeed = bridgeWrapperBuild({}, blockTag, block, network);
      const avgBlockTime = await ethereum.getAvgBlockTime(provider, blockNumber);

      const masterChiefContract = new ethers.Contract(masterChefAddress, masterChefABI, provider);

      let poolIndex = -1;

      let masterChefPools = masterChefSavedPools;
      if (!masterChefSavedPools || masterChefSavedPools.length === 0) {
        const totalPools = await masterChiefContract.poolLength();
        masterChefPools = (
          await Promise.all(new Array(totalPools.toNumber()).fill(1).map((_, i) => masterChiefContract.poolInfo(i)))
        ).map((p, i) => ({
          index: i,
          stakingToken: p.lpToken,
        }));
      }

      const foundPoolIndex = masterChefPools.find(
        (p) => p.stakingToken.toLowerCase() === contractAddress.toLowerCase()
      );

      poolIndex = foundPoolIndex !== undefined ? foundPoolIndex.index : -1;

      if (bannedPoolIndexes.includes(poolIndex) || poolIndex === -1) {
        throw new Error('Pool is not found');
      }
      const pool = await masterChiefContract.poolInfo(poolIndex);

      const stakingToken = contractAddress.toLowerCase();
      const rewardsToken = (await masterChiefContract[rewardTokenFunctionName]()).toLowerCase();

      const [stakingTokenDecimals, rewardsTokenDecimals] = await Promise.all([
        ethereum
          .erc20(provider, stakingToken)
          .decimals()
          .then((res) => Number(res.toString())),
        ethereum
          .erc20(provider, rewardsToken)
          .decimals()
          .then((res) => Number(res.toString())),
      ]);

      const [rewardTokenPerBlock, totalAllocPoint] = await Promise.all([
        (masterChiefContract[`${rewardTokenFunctionName}PerBlock`]
          ? masterChiefContract[`${rewardTokenFunctionName}PerBlock`]
          : masterChiefContract[`${rewardTokenFunctionName}PerSec`])(),
        masterChiefContract.totalAllocPoint(),
      ]);

      const rewardPerBlock = toFloat(
        new bn(pool.allocPoint.toString())
          .multipliedBy(rewardTokenPerBlock.toString())
          .dividedBy(totalAllocPoint.toString()),
        rewardsTokenDecimals
      );
      const rewardTokenUSD = await priceFeed(rewardsToken);

      const totalLocked = toFloat(
        await ethereum.erc20(provider, contractAddress).balanceOf(masterChefAddress),
        stakingTokenDecimals
      );

      const masterChiefStakingToken = await getMasterChefStakingToken(provider, stakingToken, network, blockTag, block);

      const tvl = new bn(totalLocked).multipliedBy(masterChiefStakingToken.getUSD());

      let aprBlock = rewardPerBlock.multipliedBy(rewardTokenUSD).div(tvl);
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
          rewardPerDay: rewardPerBlock.multipliedBy(blocksPerDay).toString(),
        },
        wallet: async (walletAddress) => {
          let { amount, rewardDebt } = await masterChiefContract.userInfo(poolIndex, walletAddress);
          const balance = toFloat(amount, ethereum.uniswap.pairDecimals);
          const earned = toFloat(rewardDebt, rewardsTokenDecimals);
          const reviewedBalance = masterChiefStakingToken.reviewBalance(balance.toString(10));

          const earnedUSD = earned.multipliedBy(rewardTokenUSD);

          return {
            staked: reviewedBalance.reduce((res, b) => {
              res[b.token] = {
                balance: b.balance,
                usd: b.usd,
              };
              return res;
            }, {}),
            earned: {
              [rewardsToken]: {
                balance: earned.toString(10),
                usd: earnedUSD.toString(10),
              },
            },
            metrics: {
              staking: balance.toString(10),
              stakingUSD: balance.multipliedBy(masterChiefStakingToken.getUSD()).toString(10),
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
            throw new Error('Signer not found, use options.signer for use actions');
          }
          const { signer } = options;
          const stakingTokenContract = ethereum.erc20(provider, stakingToken).connect(signer);
          const stakingContract = masterChiefContract.connect(signer);

          return {
            stake: [
              AutomateActions.tab(
                'Stake',
                async () => ({
                  description: 'Stake your tokens to contract',
                  inputs: [
                    AutomateActions.input({
                      placeholder: 'amount',
                      value: new bn(await stakingTokenContract.balanceOf(walletAddress).then((v) => v.toString()))
                        .div(`1e${stakingTokenDecimals}`)
                        .toString(10),
                    }),
                  ],
                }),
                async (amount) => {
                  const amountInt = new bn(amount).multipliedBy(`1e${stakingTokenDecimals}`);
                  if (amountInt.lte(0)) return Error('Invalid amount');

                  const balance = await stakingTokenContract.balanceOf(walletAddress).then((v) => v.toString());
                  if (amountInt.gt(balance)) return Error('Insufficient funds on the balance');

                  return true;
                },
                async (amount) => {
                  const amountInt = new bn(amount).multipliedBy(`1e${stakingTokenDecimals}`);
                  await ethereum.erc20ApproveAll(
                    stakingTokenContract,
                    walletAddress,
                    masterChefAddress,
                    amountInt.toFixed(0)
                  );

                  return {
                    tx: await stakingContract.deposit(poolIndex, amountInt.toFixed(0)),
                  };
                }
              ),
            ],
            unstake: [
              AutomateActions.tab(
                'Unstake',
                async () => {
                  const userInfo = await stakingContract.userInfo(poolIndex, walletAddress);

                  return {
                    description: 'Unstake your tokens from contract',
                    inputs: [
                      AutomateActions.input({
                        placeholder: 'amount',
                        value: new bn(userInfo.amount.toString()).div(`1e${stakingTokenDecimals}`).toString(10),
                      }),
                    ],
                  };
                },
                async (amount) => {
                  const amountInt = new bn(amount).multipliedBy(`1e${stakingTokenDecimals}`);
                  if (amountInt.lte(0)) return Error('Invalid amount');

                  const userInfo = await stakingContract.userInfo(poolIndex, walletAddress);
                  if (amountInt.isGreaterThan(userInfo.amount.toString())) {
                    return Error('Amount exceeds balance');
                  }

                  return true;
                },
                async (amount) => {
                  const amountInt = new bn(amount).multipliedBy(`1e${stakingTokenDecimals}`);

                  return {
                    tx: await stakingContract.withdraw(poolIndex, amountInt.toFixed(0)),
                  };
                }
              ),
            ],
            claim: [
              AutomateActions.tab(
                'Claim',
                async () => ({
                  description: 'Claim your reward from contract',
                }),
                async () => {
                  const earned = await stakingContract
                    .pendingReward(poolIndex, walletAddress)
                    .then((v) => v.toString());
                  if (new bn(earned).isLessThanOrEqualTo(0)) {
                    return Error('No earnings');
                  }

                  return true;
                },
                async () => ({
                  tx: await stakingContract.deposit(poolIndex, 0),
                })
              ),
            ],
            exit: [
              AutomateActions.tab(
                'Exit',
                async () => ({
                  description: 'Get all tokens from contract',
                }),
                async () => {
                  const earned = await masterChiefContract
                    .pendingReward(poolIndex, walletAddress)
                    .then((v) => v.toString());
                  const userInfo = await stakingContract.userInfo(poolIndex, walletAddress);
                  if (
                    new bn(earned).isLessThanOrEqualTo(0) &&
                    new bn(userInfo.amount.toString()).isLessThanOrEqualTo(0)
                  ) {
                    return Error('No staked');
                  }

                  return true;
                },
                async () => {
                  const userInfo = await stakingContract.userInfo(poolIndex, walletAddress);
                  if (new bn(userInfo.amount.toString()).isGreaterThan(0)) {
                    await stakingContract.withdraw(poolIndex, userInfo.amount.toString()).then((tx) => tx.wait());
                  }

                  return {
                    tx: await stakingContract.deposit(poolIndex, 0),
                  };
                }
              ),
            ],
          };
        },
      };
    };
  },
};

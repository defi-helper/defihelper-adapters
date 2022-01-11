const { ethers, bn, ethersMulticall, dayjs } = require('../lib');
const { ethereum, toFloat, tokens, coingecko } = require('../utils');
const AutomateActions = require('../utils/automate/actions');
const masterChefABI = require('./abi/masterChefABI.json');
const apeRewardV4ABI = require('./abi/apeRewardV4.json');
const masterChefSavedPools = require('./abi/masterChefPools.json');
const stakingContracts = require('./abi/stakingContracts.json');
const MasterChefSingleRestakeABI = require('./abi/MasterChefSingleRestakeABI.json');
const MasterChefLpRestakeABI = require('./abi/MasterChefLpRestakeABI.json');
const ApeRewardV4RestakeABI = require('./abi/ApeRewardV4RestakeABI.json');
const bridgeTokens = require('./abi/bridgeTokens.json');

const masterChefAddress = '0x5c8D727b265DBAfaba67E050f2f739cAeEB4A6F9';
const routeTokens = ['0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'];

async function masterChefActionsFactory(rewardTokenContract, stakingTokenContract, stakingContract, pool) {
  const rewardTokenSymbol = await rewardTokenContract.symbol();
  const stakingTokenSymbol = await stakingTokenContract.symbol();
  const stakingTokenDecimals = await stakingTokenContract.decimals().then((v) => v.toString());

  return async (walletAddress) => ({
    stake: [
      AutomateActions.tab(
        'Stake',
        async () => ({
          description: `Stake your [${stakingTokenSymbol}](https://bscscan.com/address/${stakingTokenContract.address}) tokens to contract`,
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
          await ethereum.erc20ApproveAll(stakingTokenContract, walletAddress, masterChefAddress, amountInt.toFixed(0));

          if (pool.index === 0) {
            return { tx: await stakingContract.enterStaking(amountInt.toFixed(0)) };
          } else {
            return { tx: await stakingContract.deposit(pool.index, amountInt.toFixed(0)) };
          }
        }
      ),
    ],
    unstake: [
      AutomateActions.tab(
        'Unstake',
        async () => {
          const userInfo = await stakingContract.userInfo(pool.index, walletAddress);

          return {
            description: `Unstake your [${stakingTokenSymbol}](https://bscscan.com/address/${stakingTokenContract.address}) tokens from contract`,
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

          const userInfo = await stakingContract.userInfo(pool.index, walletAddress);
          if (amountInt.isGreaterThan(userInfo.amount.toString())) {
            return Error('Amount exceeds balance');
          }

          return true;
        },
        async (amount) => {
          const amountInt = new bn(amount).multipliedBy(`1e${stakingTokenDecimals}`);

          if (pool.index === 0) {
            return { tx: await stakingContract.leaveStaking(pool.index, amountInt.toFixed(0)) };
          } else {
            return { tx: await stakingContract.withdraw(pool.index, amountInt.toFixed(0)) };
          }
        }
      ),
    ],
    claim: [
      AutomateActions.tab(
        'Claim',
        async () => ({
          description: `Claim your [${rewardTokenSymbol}](https://bscscan.com/address/${rewardTokenContract.address}) reward from contract`,
        }),
        async () => {
          const earned = await stakingContract.pendingCake(pool.index, walletAddress).then((v) => v.toString());
          if (new bn(earned).isLessThanOrEqualTo(0)) {
            return Error('No earnings');
          }

          return true;
        },
        async () => {
          if (pool.index === 0) {
            return { tx: await stakingContract.enterStaking(0) };
          } else {
            return { tx: await stakingContract.deposit(pool.index, 0) };
          }
        }
      ),
    ],
    exit: [
      AutomateActions.tab(
        'Exit',
        async () => ({
          description: 'Get all tokens from contract',
        }),
        async () => {
          const earned = await stakingContract.pendingCake(pool.index, walletAddress).then((v) => v.toString());
          const userInfo = await stakingContract.userInfo(pool.index, walletAddress);
          if (new bn(earned).isLessThanOrEqualTo(0) && new bn(userInfo.amount.toString()).isLessThanOrEqualTo(0)) {
            return Error('No staked');
          }

          return true;
        },
        async () => {
          const userInfo = await stakingContract.userInfo(pool.index, walletAddress);
          if (new bn(userInfo.amount.toString()).isGreaterThan(0)) {
            if (pool.index === 0) {
              await stakingContract.leaveStaking(userInfo.amount.toString());
            } else {
              await stakingContract.withdraw(pool.index, userInfo.amount.toString());
            }
          }

          if (pool.index === 0) {
            return { tx: await stakingContract.enterStaking(0) };
          } else {
            return { tx: await stakingContract.deposit(pool.index, 0) };
          }
        }
      ),
    ],
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
        const { amount } = await masterChiefContract.userInfo(pool.index, walletAddress);
        const balance = toFloat(amount, stakingTokenDecimals);
        const earned = new bn(
          await masterChiefContract.pendingCake(pool.index, walletAddress).then((v) => v.toString())
        ).div(`1e${rewardsTokenDecimals}`);
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

        return (
          await masterChefActionsFactory(
            ethereum.erc20(provider, rewardToken).connect(signer),
            ethereum.erc20(provider, stakingToken).connect(signer),
            masterChiefContract.connect(signer),
            pool
          )
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
        const { amount } = await masterChiefContract.userInfo(pool.index, walletAddress);
        const balance = toFloat(amount, stakingTokenDecimals);
        const earned = new bn(
          await masterChiefContract.pendingCake(pool.index, walletAddress).then((v) => v.toString())
        ).div(`1e${rewardsTokenDecimals}`);
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

        return (
          await masterChefActionsFactory(
            ethereum.erc20(provider, rewardToken).connect(signer),
            ethereum.erc20(provider, stakingToken).connect(signer),
            masterChiefContract.connect(signer),
            pool
          )
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
        const { amount } = await apeRewardContract.userInfo(walletAddress);
        const balance = toFloat(amount, stakingTokenDecimals);
        const earned = toFloat(await apeRewardContract.pendingReward(walletAddress), rewardsTokenDecimals);
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
        const rewardTokenContract = ethereum.erc20(provider, rewardToken).connect(signer);
        const rewardTokenSymbol = await rewardTokenContract.symbol();
        const stakingTokenContract = ethereum.erc20(provider, stakingToken).connect(signer);
        const stakingTokenSymbol = await stakingTokenContract.symbol();
        const stakingContract = apeRewardContract.connect(signer);

        return {
          stake: [
            AutomateActions.tab(
              'Stake',
              async () => ({
                description: `Stake your [${stakingTokenSymbol}](https://bscscan.com/address/${stakingTokenContract.address}) tokens to contract`,
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
                  stakingContract.address,
                  amountInt.toFixed(0)
                );

                return { tx: await stakingContract.deposit(amountInt.toFixed(0)) };
              }
            ),
          ],
          unstake: [
            AutomateActions.tab(
              'Unstake',
              async () => {
                const userInfo = await stakingContract.userInfo(walletAddress);

                return {
                  description: `Unstake your [${stakingTokenSymbol}](https://bscscan.com/address/${stakingTokenContract.address}) tokens from contract`,
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

                const userInfo = await stakingContract.userInfo(walletAddress);
                if (amountInt.isGreaterThan(userInfo.amount.toString())) {
                  return Error('Amount exceeds balance');
                }

                return true;
              },
              async (amount) => {
                const amountInt = new bn(amount).multipliedBy(`1e${stakingTokenDecimals}`);

                return { tx: await stakingContract.withdraw(amountInt.toFixed(0)) };
              }
            ),
          ],
          claim: [
            AutomateActions.tab(
              'Claim',
              async () => ({
                description: `Claim your [${rewardTokenSymbol}](https://bscscan.com/address/${rewardTokenContract.address}) reward from contract`,
              }),
              async () => {
                const earned = await stakingContract.pendingReward(walletAddress).then((v) => v.toString());
                if (new bn(earned).isLessThanOrEqualTo(0)) {
                  return Error('No earnings');
                }

                return true;
              },
              async () => {
                return { tx: await stakingContract.deposit(0) };
              }
            ),
          ],
          exit: [
            AutomateActions.tab(
              'Exit',
              async () => ({
                description: 'Get all tokens from contract',
              }),
              async () => {
                const earned = await stakingContract.pendingReward(walletAddress).then((v) => v.toString());
                const userInfo = await stakingContract.userInfo(walletAddress);
                if (
                  new bn(earned).isLessThanOrEqualTo(0) &&
                  new bn(userInfo.amount.toString()).isLessThanOrEqualTo(0)
                ) {
                  return Error('No staked');
                }

                return true;
              },
              async () => {
                const userInfo = await stakingContract.userInfo(walletAddress);
                if (new bn(userInfo.amount.toString()).isGreaterThan(0)) {
                  await stakingContract.withdraw(userInfo.amount.toString());
                }

                return { tx: await stakingContract.deposit(0) };
              }
            ),
          ],
        };
      },
    };
  },
  automates: {
    contractsResolver: {
      default: async (provider) => {
        const multicall = new ethersMulticall.Provider(provider);
        await multicall.init();

        const masterChiefContract = new ethersMulticall.Contract(masterChefAddress, masterChefABI);
        const [totalPools] = await multicall.all([masterChiefContract.poolLength()]);
        const poolsIndex = Array.from(new Array(totalPools.toNumber()).keys());
        const poolsInfo = await multicall.all(poolsIndex.map((poolIndex) => masterChiefContract.poolInfo(poolIndex)));
        const poolsStakingTokensSymbol = await multicall.all(
          poolsInfo.map(({ lpToken }) => new ethersMulticall.Contract(lpToken, ethereum.abi.ERC20ABI).symbol())
        );
        return await Promise.all(
          poolsInfo.map(async (info, index) => {
            const stakingTokenSymbol = poolsStakingTokensSymbol[index];
            console.log(index, stakingTokenSymbol);
            const isPair = stakingTokenSymbol === 'APE-LP';

            let token0Symbol, token1Symbol;
            if (isPair) {
              const [token0, token1] = await multicall.all([
                new ethersMulticall.Contract(info.lpToken, ethereum.uniswap.pairABI).token0(),
                new ethersMulticall.Contract(info.lpToken, ethereum.uniswap.pairABI).token1(),
              ]);
              const pairSymbols = await multicall.all([
                new ethersMulticall.Contract(token0, ethereum.abi.ERC20ABI).symbol(),
                new ethersMulticall.Contract(token1, ethereum.abi.ERC20ABI).symbol(),
              ]);
              token0Symbol = pairSymbols[0];
              token1Symbol = pairSymbols[1];
            }

            return {
              poolIndex: index,
              name: isPair ? `${token0Symbol}-${token1Symbol}` : stakingTokenSymbol,
              address: info.lpToken,
              blockchain: 'ethereum',
              network: '56',
              layout: 'staking',
              adapter: isPair ? 'masterChefPair' : 'masterChefSingle',
              description: '',
              automate: {
                autorestakeAdapter: isPair ? 'MasterChefLpRestake' : 'MasterChefSingleRestake',
                adapters: isPair ? ['masterChefPair'] : ['masterChefSingle'],
              },
              link: 'https://apeswap.finance/farms',
            };
          })
        );
      },
    },
    deploy: {
      MasterChefLpRestake: async (signer, factoryAddress, prototypeAddress, contractAddress = undefined) => {
        const firstPoolCandidate = masterChefSavedPools.find(({ type }) => type === 'lp');
        let poolIndex = firstPoolCandidate ? firstPoolCandidate.index.toString() : '';
        if (contractAddress) {
          poolIndex =
            masterChefSavedPools.find(
              ({ stakingToken }) => stakingToken.toLowerCase() === contractAddress.toLowerCase()
            )?.index ?? poolIndex;
        }

        return {
          deploy: [
            AutomateActions.tab(
              'Deploy',
              async () => ({
                description: 'Deploy your own contract',
                inputs: [
                  AutomateActions.input({
                    placeholder: 'Liquidity pool router address',
                    value: '0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7',
                  }),
                  AutomateActions.input({
                    placeholder: 'Target pool index',
                    value: poolIndex,
                  }),
                  AutomateActions.input({
                    placeholder: 'Slippage (percent)',
                    value: '1',
                  }),
                  AutomateActions.input({
                    placeholder: 'Deadline (seconds)',
                    value: '300',
                  }),
                ],
              }),
              async (router, pool, slippage, deadline) => {
                if (!masterChefSavedPools.find(({ index }) => index === parseInt(pool, 10)))
                  return new Error('Invalid pool index');
                if (slippage < 0 || slippage > 100) return new Error('Invalid slippage percent');
                if (deadline < 0) return new Error('Deadline has already passed');

                return true;
              },
              async (router, pool, slippage, deadline) =>
                AutomateActions.ethereum.proxyDeploy(
                  signer,
                  factoryAddress,
                  prototypeAddress,
                  new ethers.utils.Interface(MasterChefSingleRestakeABI).encodeFunctionData('init', [
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
      },
      MasterChefSingleRestake: async (signer, factoryAddress, prototypeAddress, contractAddress = undefined) => {
        const firstPoolCandidate = masterChefSavedPools.find(({ type }) => type === 'single');
        let poolIndex = firstPoolCandidate ? firstPoolCandidate.index.toString() : '';
        if (contractAddress) {
          poolIndex =
            masterChefSavedPools.find(
              ({ stakingToken }) => stakingToken.toLowerCase() === contractAddress.toLowerCase()
            )?.index ?? poolIndex;
        }

        return {
          deploy: [
            AutomateActions.tab(
              'Deploy',
              async () => ({
                description: 'Deploy your own contract',
                inputs: [
                  AutomateActions.input({
                    placeholder: 'Liquidity pool router address',
                    value: '0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7',
                  }),
                  AutomateActions.input({
                    placeholder: 'Target pool index',
                    value: poolIndex,
                  }),
                  AutomateActions.input({
                    placeholder: 'Slippage (percent)',
                    value: '1',
                  }),
                  AutomateActions.input({
                    placeholder: 'Deadline (seconds)',
                    value: '300',
                  }),
                ],
              }),
              async (router, pool, slippage, deadline) => {
                if (!masterChefSavedPools.find(({ index }) => index === parseInt(pool, 10)))
                  return new Error('Invalid pool index');
                if (slippage < 0 || slippage > 100) return new Error('Invalid slippage percent');
                if (deadline < 0) return new Error('Deadline has already passed');

                return true;
              },
              async (router, pool, slippage, deadline) =>
                AutomateActions.ethereum.proxyDeploy(
                  signer,
                  factoryAddress,
                  prototypeAddress,
                  new ethers.utils.Interface(MasterChefSingleRestakeABI).encodeFunctionData('init', [
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
      },
      ApeRewardV4Restake: async (signer, factoryAddress, prototypeAddress, contractAddress = undefined) => {
        const stakingContract = contractAddress ?? stakingContracts[0].stakingContract; // todo

        return {
          deploy: [
            AutomateActions.tab(
              'Deploy',
              async () => ({
                description: 'Deploy your own contract',
                inputs: [
                  AutomateActions.input({
                    placeholder: 'Liquidity pool router address',
                    value: '0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7',
                  }),
                  AutomateActions.input({
                    placeholder: 'Slippage (percent)',
                    value: '1',
                  }),
                  AutomateActions.input({
                    placeholder: 'Deadline (seconds)',
                    value: '300',
                  }),
                ],
              }),
              async (router, slippage, deadline) => {
                if (slippage < 0 || slippage > 100) return new Error('Invalid slippage percent');
                if (deadline < 0) return new Error('Deadline has already passed');

                return true;
              },
              async (router, slippage, deadline) =>
                AutomateActions.ethereum.proxyDeploy(
                  signer,
                  factoryAddress,
                  prototypeAddress,
                  new ethers.utils.Interface(ApeRewardV4RestakeABI).encodeFunctionData('init', [
                    stakingContract,
                    router,
                    Math.floor(slippage * 100),
                    deadline,
                  ])
                )
            ),
          ],
        };
      },
    },
    MasterChefLpRestake: async (signer, contractAddress) => {
      const signerAddress = await signer.getAddress();
      const automate = new ethers.Contract(contractAddress, MasterChefLpRestakeABI, signer);
      const stakingAddress = await automate.staking();
      const staking = new ethers.Contract(stakingAddress, masterChefABI, signer);
      const stakingTokenAddress = await automate.stakingToken();
      const stakingToken = ethereum.erc20(signer, stakingTokenAddress);
      const stakingTokenDecimals = await stakingToken.decimals().then((v) => v.toString());
      const poolId = await automate.pool().then((v) => v.toString());

      const deposit = [
        AutomateActions.tab(
          'Transfer',
          async () => ({
            description: 'Transfer your tokens to your contract',
            inputs: [
              AutomateActions.input({
                placeholder: 'amount',
                value: new bn(await stakingToken.balanceOf(signerAddress).then((v) => v.toString()))
                  .div(`1e${stakingTokenDecimals}`)
                  .toString(10),
              }),
            ],
          }),
          async (amount) => {
            const signerBalance = await stakingToken.balanceOf(signerAddress).then((v) => v.toString());
            const amountInt = new bn(amount).multipliedBy(`1e${stakingTokenDecimals}`);
            if (amountInt.lte(0)) return Error('Invalid amount');
            if (amountInt.gt(signerBalance)) return Error('Insufficient funds on the balance');

            return true;
          },
          async (amount) => ({
            tx: await stakingToken.transfer(
              automate.address,
              new bn(amount).multipliedBy(`1e${stakingTokenDecimals}`).toFixed(0)
            ),
          })
        ),
        AutomateActions.tab(
          'Deposit',
          async () => ({
            description: 'Stake your tokens to the contract',
          }),
          async () => {
            const automateBalance = new bn(await stakingToken.balanceOf(automate.address).then((v) => v.toString()));
            const automateOwner = await automate.owner();
            if (automateBalance.lte(0)) return new Error('Insufficient funds on the automate contract balance');
            if (signerAddress.toLowerCase() !== automateOwner.toLowerCase()) return new Error('Someone else contract');

            return true;
          },
          async () => ({
            tx: await automate.deposit(),
          })
        ),
      ];
      const refund = [
        AutomateActions.tab(
          'Refund',
          async () => ({
            description: 'Transfer your tokens from automate',
          }),
          async () => {
            const automateOwner = await automate.owner();
            if (signerAddress.toLowerCase() !== automateOwner.toLowerCase()) return new Error('Someone else contract');

            return true;
          },
          async () => ({
            tx: await automate.refund(),
          })
        ),
      ];
      const migrate = [
        AutomateActions.tab(
          'Withdraw',
          async () => ({
            description: 'Withdraw your tokens from staking',
          }),
          async () => {
            const userInfo = await staking.userInfo(poolId, signerAddress);
            if (new bn(userInfo.amount.toString()).lte(0))
              return new Error('Insufficient funds on the staking contract balance');

            return true;
          },
          async () => {
            const userInfo = await staking.userInfo(poolId, signerAddress);
            if (poolId === '0') {
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
        const provider = signer.provider || signer;
        const chainId = await provider.getNetwork().then(({ chainId }) => chainId);
        const multicall = new ethersMulticall.Provider(signer, chainId);
        const automateMulticall = new ethersMulticall.Contract(contractAddress, MasterChefLpRestakeABI);
        const stakingTokenMulticall = new ethersMulticall.Contract(stakingTokenAddress, ethereum.uniswap.pairABI);

        const [routerAddress, slippagePercent, deadlineSeconds, token0Address, token1Address, rewardTokenAddress] =
          await multicall.all([
            automateMulticall.liquidityRouter(),
            automateMulticall.slippage(),
            automateMulticall.deadline(),
            stakingTokenMulticall.token0(),
            stakingTokenMulticall.token1(),
            automateMulticall.rewardToken(),
          ]);
        const rewardToken = new ethers.Contract(rewardTokenAddress, ethereum.abi.ERC20ABI, provider);
        const rewardTokenBalance = await rewardToken.balanceOf(contractAddress).then((v) => v.toString());
        const pendingReward = await staking.pendingCake(poolId, contractAddress).then((v) => v.toString());

        const earned = new bn(pendingReward).plus(rewardTokenBalance);
        if (earned.toString(10) === '0') return new Error('No earned');
        const router = new ethersMulticall.Contract(routerAddress, ethereum.abi.UniswapRouterABI);

        const slippage = 1 - slippagePercent / 10000;
        const token0AmountIn = new bn(earned.toString(10)).div(2).toFixed(0);
        const swap0 = [[rewardTokenAddress, token0Address], '0'];
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
          swap0[1] = new bn(amountOut.toString()).multipliedBy(slippage).toFixed(0);
        }
        const token1AmountIn = new bn(earned.toString(10)).minus(token0AmountIn).toFixed(0);
        const swap1 = [[rewardTokenAddress, token1Address], '0'];
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
          swap1[1] = new bn(amountOut.toString()).multipliedBy(slippage).toFixed(0);
        }

        const deadline = dayjs().add(deadlineSeconds, 'seconds').unix();

        const gasLimit = new bn(await automate.estimateGas.run(0, deadline, swap0, swap1).then((v) => v.toString()))
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
    MasterChefSingleRestake: async (signer, contractAddress) => {
      const signerAddress = await signer.getAddress();
      const automate = new ethers.Contract(contractAddress, MasterChefSingleRestakeABI, signer);
      const stakingAddress = await automate.staking();
      const staking = new ethers.Contract(stakingAddress, masterChefABI, signer);
      const stakingTokenAddress = await automate.stakingToken();
      const stakingToken = ethereum.erc20(signer, stakingTokenAddress);
      const stakingTokenDecimals = await stakingToken.decimals().then((v) => v.toString());
      const poolId = await automate.pool().then((v) => v.toString());

      const deposit = [
        AutomateActions.tab(
          'Transfer',
          async () => ({
            description: 'Transfer your tokens to your contract',
            inputs: [
              AutomateActions.input({
                placeholder: 'amount',
                value: new bn(await stakingToken.balanceOf(signerAddress).then((v) => v.toString()))
                  .div(`1e${stakingTokenDecimals}`)
                  .toString(10),
              }),
            ],
          }),
          async (amount) => {
            const signerBalance = await stakingToken.balanceOf(signerAddress).then((v) => v.toString());
            const amountInt = new bn(amount).multipliedBy(`1e${stakingTokenDecimals}`);
            if (amountInt.lte(0)) return Error('Invalid amount');
            if (amountInt.gt(signerBalance)) return Error('Insufficient funds on the balance');

            return true;
          },
          async (amount) => ({
            tx: await stakingToken.transfer(
              automate.address,
              new bn(amount).multipliedBy(`1e${stakingTokenDecimals}`).toFixed(0)
            ),
          })
        ),
        AutomateActions.tab(
          'Deposit',
          async () => ({
            description: 'Stake your tokens to the contract',
          }),
          async () => {
            const automateBalance = new bn(await stakingToken.balanceOf(automate.address).then((v) => v.toString()));
            const automateOwner = await automate.owner();
            if (automateBalance.lte(0)) return new Error('Insufficient funds on the automate contract balance');
            if (signerAddress.toLowerCase() !== automateOwner.toLowerCase()) return new Error('Someone else contract');

            return true;
          },
          async () => ({
            tx: await automate.deposit(),
          })
        ),
      ];
      const refund = [
        AutomateActions.tab(
          'Refund',
          async () => ({
            description: 'Transfer your tokens from automate',
          }),
          async () => {
            const automateOwner = await automate.owner();
            if (signerAddress.toLowerCase() !== automateOwner.toLowerCase()) return new Error('Someone else contract');

            return true;
          },
          async () => ({
            tx: await automate.refund(),
          })
        ),
      ];
      const migrate = [
        AutomateActions.tab(
          'Withdraw',
          async () => ({
            description: 'Withdraw your tokens from staking',
          }),
          async () => {
            const userInfo = await staking.userInfo(poolId, signerAddress);
            if (new bn(userInfo.amount.toString()).lte(0))
              return new Error('Insufficient funds on the staking contract balance');

            return true;
          },
          async () => {
            const userInfo = await staking.userInfo(poolId, signerAddress);
            if (poolId === '0') {
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
        const provider = signer.provider || signer;
        const chainId = await provider.getNetwork().then(({ chainId }) => chainId);
        const multicall = new ethersMulticall.Provider(signer, chainId);
        const automateMulticall = new ethersMulticall.Contract(contractAddress, MasterChefSingleRestakeABI);

        const [routerAddress, slippagePercent, deadlineSeconds, rewardTokenAddress] = await multicall.all([
          automateMulticall.liquidityRouter(),
          automateMulticall.slippage(),
          automateMulticall.deadline(),
          automateMulticall.rewardToken(),
        ]);

        const rewardToken = new ethers.Contract(rewardTokenAddress, ethereum.abi.ERC20ABI, provider);
        const rewardTokenBalance = await rewardToken.balanceOf(contractAddress).then((v) => v.toString());
        const pendingReward = await staking.pendingCake(poolId, contractAddress).then((v) => v.toString());
        const earned = new bn(pendingReward).plus(rewardTokenBalance);
        if (earned.toString(10) === '0') return new Error('No earned');

        const router = new ethersMulticall.Contract(routerAddress, ethereum.abi.UniswapRouterABI);
        const slippage = 1 - slippagePercent / 10000;
        const tokenAmountIn = earned.toFixed(0);
        const swap = [[rewardTokenAddress, stakingTokenAddress], '0'];
        if (stakingTokenAddress.toLowerCase() !== rewardTokenAddress.toLowerCase()) {
          const { path, amountOut } = await ethereum.uniswap.autoRoute(
            multicall,
            router,
            tokenAmountIn,
            rewardTokenAddress,
            stakingTokenAddress,
            routeTokens
          );
          swap[0] = path;
          swap[1] = new bn(amountOut.toString()).multipliedBy(slippage).toFixed(0);
        }

        const deadline = dayjs().add(deadlineSeconds, 'seconds').unix();

        const gasLimit = new bn(await automate.estimateGas.run(0, deadline, swap).then((v) => v.toString()))
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
    ApeRewardV4Restake: async (signer, contractAddress) => {
      const signerAddress = await signer.getAddress();
      const automate = new ethers.Contract(contractAddress, ApeRewardV4RestakeABI, signer);
      const stakingAddress = await automate.staking();
      const staking = new ethers.Contract(stakingAddress, apeRewardV4ABI, signer);
      const stakingTokenAddress = await automate.stakingToken();
      const stakingToken = ethereum.erc20(signer, stakingTokenAddress);
      const stakingTokenDecimals = await stakingToken.decimals().then((v) => v.toString());

      const deposit = [
        AutomateActions.tab(
          'Transfer',
          async () => ({
            description: 'Transfer your tokens to your contract',
            inputs: [
              AutomateActions.input({
                placeholder: 'amount',
                value: new bn(await stakingToken.balanceOf(signerAddress).then((v) => v.toString()))
                  .div(`1e${stakingTokenDecimals}`)
                  .toString(10),
              }),
            ],
          }),
          async (amount) => {
            const signerBalance = await stakingToken.balanceOf(signerAddress).then((v) => v.toString());
            const amountInt = new bn(amount).multipliedBy(`1e${stakingTokenDecimals}`);
            if (amountInt.lte(0)) return Error('Invalid amount');
            if (amountInt.gt(signerBalance)) return Error('Insufficient funds on the balance');

            return true;
          },
          async (amount) => ({
            tx: await stakingToken.transfer(
              automate.address,
              new bn(amount).multipliedBy(`1e${stakingTokenDecimals}`).toFixed(0)
            ),
          })
        ),
        AutomateActions.tab(
          'Deposit',
          async () => ({
            description: 'Stake your tokens to the contract',
          }),
          async () => {
            const automateBalance = new bn(await stakingToken.balanceOf(automate.address).then((v) => v.toString()));
            const automateOwner = await automate.owner();
            if (automateBalance.lte(0)) return new Error('Insufficient funds on the automate contract balance');
            if (signerAddress.toLowerCase() !== automateOwner.toLowerCase()) return new Error('Someone else contract');

            return true;
          },
          async () => ({
            tx: await automate.deposit(),
          })
        ),
      ];
      const refund = [
        AutomateActions.tab(
          'Refund',
          async () => ({
            description: 'Transfer your tokens from automate',
          }),
          async () => {
            const automateOwner = await automate.owner();
            if (signerAddress.toLowerCase() !== automateOwner.toLowerCase()) return new Error('Someone else contract');

            return true;
          },
          async () => ({
            tx: await automate.refund(),
          })
        ),
      ];
      const migrate = [
        AutomateActions.tab(
          'Withdraw',
          async () => ({
            description: 'Withdraw your tokens from staking',
          }),
          async () => {
            const userInfo = await staking.userInfo(signerAddress);
            if (new bn(userInfo.amount.toString()).lte(0))
              return new Error('Insufficient funds on the staking contract balance');

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
        const provider = signer.provider || signer;
        const chainId = await provider.getNetwork().then(({ chainId }) => chainId);
        const multicall = new ethersMulticall.Provider(signer, chainId);
        const automateMulticall = new ethersMulticall.Contract(contractAddress, ApeRewardV4RestakeABI);

        const [routerAddress, slippagePercent, deadlineSeconds, rewardTokenAddress] = await multicall.all([
          automateMulticall.liquidityRouter(),
          automateMulticall.slippage(),
          automateMulticall.deadline(),
          automateMulticall.rewardToken(),
        ]);

        const rewardToken = new ethers.Contract(rewardTokenAddress, ethereum.abi.ERC20ABI, provider);
        const rewardTokenBalance = await rewardToken.balanceOf(contractAddress).then((v) => v.toString());
        const pendingReward = await staking.pendingReward(contractAddress).then((v) => v.toString());
        const earned = new bn(pendingReward).plus(rewardTokenBalance);
        if (earned.toString(10) === '0') return new Error('No earned');

        const router = new ethersMulticall.Contract(routerAddress, ethereum.abi.UniswapRouterABI);
        const slippage = 1 - slippagePercent / 10000;
        const tokenAmountIn = earned.toFixed(0);
        const swap = [[rewardTokenAddress, stakingTokenAddress], '0'];
        if (stakingTokenAddress.toLowerCase() !== rewardTokenAddress.toLowerCase()) {
          const { path, amountOut } = await ethereum.uniswap.autoRoute(
            multicall,
            router,
            tokenAmountIn,
            rewardTokenAddress,
            stakingTokenAddress,
            routeTokens
          );
          swap[0] = path;
          swap[1] = new bn(amountOut.toString()).multipliedBy(slippage).toFixed(0);
        }

        const deadline = dayjs().add(deadlineSeconds, 'seconds').unix();

        const gasLimit = new bn(await automate.estimateGas.run(0, deadline, swap).then((v) => v.toString()))
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
  },
};

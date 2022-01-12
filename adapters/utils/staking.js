const { ethers, bn, ethersMulticall } = require('../lib');
const { ethereum } = require('./ethereum');
const { coingecko } = require('./coingecko');
const { toFloat } = require('./toFloat');
const { tokens } = require('./tokens');
const AutomateActions = require('./automate/actions');

const stakingABI = require('./abi/stakingAbi.json');

const getApyPerDayFunctionDefault = (
  provider,
  stakingToken,
  contractAddress,
  rewardRate,
  rewardTokenUSD,
  tvl,
  blocksPerDay
) => {
  let aprBlock = new bn(rewardRate.toString()).multipliedBy(rewardTokenUSD).div(tvl);
  if (!aprBlock.isFinite()) aprBlock = new bn(0);
  return aprBlock.multipliedBy(blocksPerDay);
};

module.exports = {
  synthetixStaking:
    (getApyPerDayFunction = getApyPerDayFunctionDefault) =>
    async (provider, contractAddress, initOptions = ethereum.defaultOptions()) => {
      const options = {
        ...ethereum.defaultOptions(),
        ...initOptions,
      };
      const blockTag = options.blockNumber === 'latest' ? 'latest' : parseInt(options.blockNumber, 10);
      const contract = new ethers.Contract(contractAddress, stakingABI, provider);
      const network = (await provider.detectNetwork()).chainId;
      const block = await provider.getBlock(blockTag);
      const blockNumber = block.number;
      const avgBlockTime = await ethereum.getAvgBlockTime(provider, blockNumber);
      const blocksPerDay = new bn((1000 * 60 * 60 * 24) / avgBlockTime);

      const multicall = new ethersMulticall.Provider(provider, network);
      const multicallContract = new ethersMulticall.Contract(contractAddress, stakingABI);
      let [periodFinish, rewardRate, totalSupply, stakingToken, rewardsToken] = await multicall.all(
        [
          multicallContract.periodFinish(),
          multicallContract.rewardRate(),
          multicallContract.totalSupply(),
          multicallContract.stakingToken(),
          multicallContract.rewardsToken(),
        ],
        { blockTag }
      );
      let [stakingTokenDecimals, rewardsTokenDecimals] = await multicall.all([
        new ethersMulticall.Contract(stakingToken, ethereum.abi.ERC20ABI).decimals(),
        new ethersMulticall.Contract(rewardsToken, ethereum.abi.ERC20ABI).decimals(),
      ]);
      stakingTokenDecimals = parseInt(stakingTokenDecimals, 10);
      rewardsTokenDecimals = parseInt(rewardsTokenDecimals, 10);

      periodFinish = periodFinish.toString();
      rewardRate = toFloat(rewardRate, rewardsTokenDecimals);
      if (new bn(periodFinish).lt(blockNumber)) rewardRate = new bn('0');
      totalSupply = toFloat(totalSupply, ethereum.uniswap.pairDecimals);
      stakingToken = stakingToken.toLowerCase();
      rewardsToken = rewardsToken.toLowerCase();
      const rewardTokenUSD = await coingecko.getPriceUSDByContract(
        coingecko.platformByEthereumNetwork(network),
        blockTag === 'latest',
        block,
        rewardsToken
      );
      const {
        token0,
        reserve0,
        token1,
        reserve1,
        totalSupply: lpTotalSupply,
      } = await ethereum.uniswap.pairInfo(provider, stakingToken);
      const token0Usd = await coingecko.getPriceUSDByContract(
        coingecko.platformByEthereumNetwork(network),
        blockTag === 'latest',
        block,
        token0
      );
      const token1Usd = await coingecko.getPriceUSDByContract(
        coingecko.platformByEthereumNetwork(network),
        blockTag === 'latest',
        block,
        token1
      );
      let stakingTokenUSD = new bn(reserve0)
        .multipliedBy(token0Usd)
        .plus(new bn(reserve1).multipliedBy(token1Usd))
        .div(lpTotalSupply);
      if (!stakingTokenUSD.isFinite()) stakingTokenUSD = new bn(0);

      const tvl = totalSupply.multipliedBy(stakingTokenUSD);

      const aprDay = await getApyPerDayFunction(
        provider,
        stakingToken,
        contractAddress,
        rewardRate,
        rewardTokenUSD,
        tvl,
        blocksPerDay
      );
      const aprWeek = aprDay.multipliedBy(7);
      const aprMonth = aprDay.multipliedBy(30);
      const aprYear = aprDay.multipliedBy(365);

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
          let [balance, earned] = await multicall.all(
            [multicallContract.balanceOf(walletAddress), multicallContract.earned(walletAddress)],
            { blockTag }
          );
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
            throw new Error('Signer not found, use options.signer for use actions');
          }
          const { signer } = options;
          const rewardTokenContract = ethereum.erc20(provider, rewardsToken).connect(signer);
          const rewardTokenSymbol = await rewardTokenContract.symbol();
          const stakingTokenContract = ethereum.erc20(provider, stakingToken).connect(signer);
          const stakingTokenSymbol = await stakingTokenContract.symbol();
          const stakingTokenDecimals = await stakingTokenContract.decimals().then((v) => v.toString());
          const stakingContract = contract.connect(signer);

          return {
            stake: [
              AutomateActions.tab(
                'Stake',
                async () => ({
                  description: `Stake your [${stakingTokenSymbol}](https://etherscan.io/address/${stakingToken}) tokens to contract`,
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
                    tx: await stakingContract.stake(amountInt.toFixed(0)),
                  };
                }
              ),
            ],
            unstake: [
              AutomateActions.tab(
                'Unstake',
                async () => ({
                  description: `Unstake your [${stakingTokenSymbol}](https://etherscan.io/address/${stakingToken}) tokens from contract`,
                  inputs: [
                    AutomateActions.input({
                      placeholder: 'amount',
                      value: new bn(stakingContract.balanceOf(walletAddress).then((v) => v.toString()))
                        .div(`1e${stakingTokenDecimals}`)
                        .toString(10),
                    }),
                  ],
                }),
                async (amount) => {
                  const amountInt = new bn(amount).multipliedBy(`1e${stakingTokenDecimals}`);
                  if (amountInt.lte(0)) return Error('Invalid amount');

                  const balance = await stakingContract.balanceOf(walletAddress).then((v) => v.toString());
                  if (amountInt.isGreaterThan(balance)) {
                    return Error('Amount exceeds balance');
                  }

                  return true;
                },
                async (amount) => {
                  const amountInt = new bn(amount).multipliedBy(`1e${stakingTokenDecimals}`);

                  return {
                    tx: await stakingContract.withdraw(amountInt.toFixed(0)),
                  };
                }
              ),
            ],
            claim: [
              AutomateActions.tab(
                'Claim',
                async () => ({
                  description: `Claim your [${rewardTokenSymbol}](https://etherscan.io/address/${rewardsToken}) reward from contract`,
                }),
                async () => {
                  const earned = await stakingContract.earned(walletAddress).then((v) => v.toString());
                  if (new bn(earned).isLessThanOrEqualTo(0)) {
                    return Error('No earnings');
                  }

                  return true;
                },
                async () => ({
                  tx: await stakingContract.getReward(),
                })
              ),
            ],
            exit: [
              AutomateActions.tab(
                'Exit',
                async () => ({
                  description: 'Get all tokens from contract',
                }),
                () => true,
                async () => ({
                  tx: await stakingContract.exit(),
                })
              ),
            ],
          };
        },
      };
    },
};

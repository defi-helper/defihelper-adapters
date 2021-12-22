const { ethers, bn, ethersMulticall, dayjs } = require('../lib');
const { ethereum, toFloat, tokens, coingecko, staking } = require('../utils');
const { getUniPairToken } = require('../utils/masterChef/masterChefStakingToken');
const AutomateActions = require('../utils/automate/actions');
const masterChefABI = require('./abi/masterChefABI.json');
const MasterChefFinnLpRestakeABI = require('./abi/MasterChefFinnLpRestakeABI.json');
const masterChefSavedPools = require('./abi/masterChefPools.json');
const bridgeTokens = require('./abi/bridgeTokens.json');

const masterChefAddress = '0x1f4b7660b6AdC3943b5038e3426B33c1c0e343E6';

module.exports = {
  masterChef: async (provider, contractAddress, initOptions = ethereum.defaultOptions()) => {
    const options = {
      ...ethereum.defaultOptions(),
      ...initOptions,
    };
    const blockTag = options.blockNumber === 'latest' ? 'latest' : parseInt(options.blockNumber, 10);
    const network = (await provider.detectNetwork()).chainId;
    const block = await provider.getBlock(blockTag);
    const rewardTokenFunctionName = 'finn';

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
    const [rewardTokenPerSec, totalAllocPoint] = await Promise.all([
      await masterChiefContract[`${rewardTokenFunctionName}PerSecond`](),
      await masterChiefContract.totalAllocPoint(),
    ]);
    const rewardPerSec = toFloat(
      new bn(poolInfo.allocPoint.toString())
        .multipliedBy(rewardTokenPerSec.toString())
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

    let aprSec = rewardPerSec.multipliedBy(rewardTokenPriceUSD).div(tvl);
    if (!aprSec.isFinite()) aprSec = new bn(0);

    const aprDay = aprSec.multipliedBy(60 * 60 * 24);
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
        const balance = toFloat(amount, ethereum.uniswap.pairDecimals);
        const earned = toFloat(
          new bn(amount.toString())
            .multipliedBy(poolInfo.accRewardPerShare.toString())
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
              const { amount, rewardDebt } = await masterChiefContract.userInfo(pool.index, walletAddress);
              const { accRewardPerShare } = await masterChiefContract.poolInfo(pool.index);
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
              // https://github.com/sushiswap/sushiswap-interface/blob/05324660917f44e3c360dc7e2892b2f58e21647e/src/features/farm/useMasterChef.ts#L64
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
        };
      },
    };
  },
  automates: {
    contractsResolver: {
      default: async (provider, initOptions = ethereum.defaultOptions()) => {
        const options = {
          ...ethereum.defaultOptions(),
          ...initOptions,
        };
        const blockTag = options.blockNumber === 'latest' ? 'latest' : parseInt(options.blockNumber, 10);
        const network = (await provider.detectNetwork()).chainId;
        const block = await provider.getBlock(blockTag);

        const masterChiefContract = new ethers.Contract(masterChefAddress, masterChefABI, provider);

        const totalPools = await masterChiefContract.poolLength();
        return (
          await Promise.all(
            (
              await Promise.all(new Array(totalPools.toNumber()).fill(1).map((_, i) => masterChiefContract.poolInfo(i)))
            ).map(async (p, i) => {
              let pair;
              try {
                pair = await getUniPairToken(provider, p.lpToken, network, blockTag, block);
              } catch {
                return null;
              }

              const [token0, token1] = await Promise.all([
                ethereum.erc20Info(provider, pair.token0),
                ethereum.erc20Info(provider, pair.token1),
              ]);

              return {
                poolIndex: i,
                name: `Huckleberry ${token0.symbol}-${token1.symbol} LP`,
                address: p.lpToken,
                deployBlockNumber: pair.block.number,
                blockchain: 'ethereum',
                network: pair.network,
                layout: 'stacking',
                adapter: 'masterChef',
                description: '',
                automate: {
                  autorestakeAdapter: 'MasterChefFinnLpRestake',
                  adapters: ['masterChef'],
                },
                link: '',
              };
            })
          )
        ).filter((v) => v);
      },
    },
    deploy: {
      MasterChefFinnLpRestake: async (signer, factoryAddress, prototypeAddress, contractAddress = undefined) => {
        let poolIndex = masterChefSavedPools[0].index.toString();
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
                    value: '0x2d4e873f9Ab279da9f1bb2c532d4F06f67755b77',
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
                  new ethers.utils.Interface(MasterChefFinnLpRestakeABI).encodeFunctionData('init', [
                    masterChefAddress,
                    router,
                    pool,
                    Math.floor(slippage * 10),
                    deadline,
                  ])
                )
            ),
          ],
        };
      },
    },
    MasterChefFinnLpRestake: async (signer, contractAddress) => {
      const signerAddress = await signer.getAddress();
      const automate = new ethers.Contract(contractAddress, MasterChefFinnLpRestakeABI, signer);
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
            return {
              tx: await staking.withdraw(poolId, userInfo.amount.toString()),
            };
          }
        ),
        ...deposit,
      ];
      const runParams = async () => {
        const provider = signer.provider || signer;
        const chainId = await provider.getNetwork().then(({ chainId }) => chainId);
        const multicall = new ethersMulticall.Provider(signer, chainId);
        const automateMulticall = new ethersMulticall.Contract(contractAddress, MasterChefFinnLpRestakeABI);
        const stakingMulticall = new ethersMulticall.Contract(stakingAddress, masterChefABI);
        const stakingTokenMulticall = new ethersMulticall.Contract(stakingTokenAddress, ethereum.uniswap.pairABI);

        const [
          routerAddress,
          slippagePercent,
          deadlineSeconds,
          token0Address,
          token1Address,
          rewardTokenAddress,
          { amount, rewardDebt },
          { accRewardPerShare },
        ] = await multicall.all([
          automateMulticall.liquidityRouter(),
          automateMulticall.slippage(),
          automateMulticall.deadline(),
          stakingTokenMulticall.token0(),
          stakingTokenMulticall.token1(),
          automateMulticall.rewardToken(),
          stakingMulticall.userInfo(poolId, contractAddress),
          stakingMulticall.poolInfo(poolId),
        ]);

        const earned = new bn(amount.toString())
          .multipliedBy(accRewardPerShare.toString())
          .div(new bn(10).pow(12))
          .minus(rewardDebt.toString());
        if (earned.toString(10) === '0') return new Error('No earned');
        const router = ethereum.uniswap.router(signer, routerAddress);

        const slippage = 1 - slippagePercent / 10000;
        const token0AmountIn = new bn(earned.toString(10)).div(2).toFixed(0);
        let token0Min = new bn(token0AmountIn).multipliedBy(slippage).toFixed(0);
        if (token0Address.toLowerCase() !== rewardTokenAddress.toLowerCase()) {
          const [, amountOut] = await router.getAmountsOut(token0AmountIn, [rewardTokenAddress, token0Address]);
          token0Min = new bn(amountOut.toString()).multipliedBy(slippage).toFixed(0);
        }
        const token1AmountIn = new bn(earned.toString(10)).minus(token0AmountIn).toFixed(0);
        let token1Min = new bn(token1AmountIn).multipliedBy(slippage).toFixed(0);
        if (token1Address.toLowerCase() !== rewardTokenAddress.toLowerCase()) {
          const [, amountOut] = await router.getAmountsOut(token1AmountIn, [rewardTokenAddress, token1Address]);
          token1Min = new bn(amountOut.toString()).multipliedBy(slippage).toFixed(0);
        }

        const deadline = dayjs().add(deadlineSeconds, 'seconds').unix();

        const gasLimit = new bn(
          await automate.estimateGas.run(0, deadline, [token0Min, token1Min]).then((v) => v.toString())
        )
          .multipliedBy(1.1)
          .toFixed(0);

        const gasPrice = await signer.getGasPrice().then((v) => v.toString());
        const gasFee = new bn(gasLimit).multipliedBy(gasPrice).toFixed(0);

        await automate.estimateGas.run(gasFee, deadline, [token0Min, token1Min]);
        return {
          gasPrice,
          gasLimit,
          calldata: [gasFee, deadline, [token0Min, token1Min]],
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

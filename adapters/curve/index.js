const { bn, ethers, ethersMulticall } = require('../lib');
const { ethereum } = require('../utils/ethereum');
const { bridgeWrapperBuild } = require('../utils/coingecko');
const registryABI = require('./abi/registryABI.json');
const gaugeABI = require('./abi/gaugeABI.json');
const poolABI = require('./abi/poolABI.json');
const landingPoolABI = require('./abi/landingPoolABI.json');
const minterABI = require('./abi/minterABI.json');
const veCRVABI = require('./abi/veCRVABI.json');
const feeDistributorABI = require('./abi/feeDistributorABI.json');
const gaugeControllerABI = require('./abi/gaugeControllerABI.json');
const gaugeUniswapRestakeABI = require('./abi/gaugeUniswapRestakeABI.json');
const { tokens } = require('../utils');
const AutomateActions = require('../utils/automate/actions');
const bridgeTokens = require('./abi/bridgeTokens.json');

class Pool {
  constructor(connect, info) {
    this.connect = connect;
    this.info = info;
    this.pool = new ethersMulticall.Contract(info.address, info.abi);
    this.lpToken = new ethersMulticall.Contract(info.lpToken, ethereum.abi.ERC20ABI);
    this.gauge = new ethersMulticall.Contract(info.gauge, gaugeABI);
  }

  async balances() {
    const { multicall, blockTag } = this.connect;
    const balances = await multicall.all(
      this.info.coins.map((coin, i) => {
        return this.pool.balances(i);
      }),
      { blockTag }
    );

    return balances.map((balance) => balance.toString());
  }

  async underlyingBalance(amount) {
    const { multicall, blockTag } = this.connect;
    const [totalSupply] = await multicall.all([this.lpToken.totalSupply()], { blockTag });
    const balances = await this.balances();

    return balances.map((balance) => new bn(balance).multipliedBy(amount).div(totalSupply.toString()).toFixed(0));
  }
}

class PoolRegistry {
  constructor(connect) {
    this.connect = connect;
    this.registry = new ethersMulticall.Contract('0x90E00ACe148ca3b23Ac1bC8C240C2a7Dd9c2d7f5', registryABI);
  }

  async getInfoForPool(poolAddress) {
    const { multicall, blockTag } = this.connect;
    let [coinsAddresses, lpToken] = await multicall.all(
      [this.registry.get_coins(poolAddress), this.registry.get_lp_token(poolAddress)],
      { blockTag }
    );
    coinsAddresses = coinsAddresses.filter((address) => address !== '0x0000000000000000000000000000000000000000');
    if (lpToken === '0x0000000000000000000000000000000000000000') {
      throw new Error(`LP token for pool with address "${poolAddress}" not found`);
    }
    let [[gauges]] = await multicall.all([this.registry.get_gauges(poolAddress)], { blockTag });
    gauges = gauges.filter((address) => address !== '0x0000000000000000000000000000000000000000');
    const gauge = gauges[gauges.length - 1];
    if (!gauge || gauge === '0x0000000000000000000000000000000000000000') {
      throw new Error(`Gauge for pool with address "${poolAddress}" not found`);
    }
    const coinsDecimals = await multicall.all(
      coinsAddresses.map((address) => new ethersMulticall.Contract(address, ethereum.abi.ERC20ABI).decimals())
    );

    return {
      address: poolAddress,
      lpToken,
      gauge,
      coins: coinsAddresses.map((address, i) => ({ address, decimals: coinsDecimals[i].toString() })),
    };
  }

  async findByLp(lpToken) {
    const { multicall, blockTag } = this.connect;
    const [poolAddress] = await multicall.all([this.registry.get_pool_from_lp_token(lpToken)], { blockTag });
    if (poolAddress === '0x0000000000000000000000000000000000000000') {
      return poolAddress;
    }

    return this.getInfoForPool(poolAddress);
  }

  async findByGauge(gaugeAddress) {
    const { multicall, blockTag } = this.connect;
    const [lpToken] = await multicall.all([new ethersMulticall.Contract(gaugeAddress, gaugeABI).lp_token()], {
      blockTag,
    });

    return this.findByLp(lpToken);
  }
}

async function getUnderlyingBalance(pools, priceFeed, pool, amount) {
  const balances = await pool.underlyingBalance(amount);

  return pool.info.coins.reduce(async (resultPromise, { address, decimals }, i) => {
    const result = await resultPromise;

    const subpoolInfo = await pools.findByLp(address);
    if (subpoolInfo !== '0x0000000000000000000000000000000000000000') {
      return [
        ...result,
        await getUnderlyingBalance(
          pools,
          priceFeed,
          new Pool(pool.connect, { ...subpoolInfo, abi: pool.info.abi }),
          balances[i]
        ),
      ];
    }
    const balance = new bn(balances[i]).div(Number(`1e${decimals}`)).toString(10);
    const priceUSD = await priceFeed(address);

    return [
      ...result,
      {
        address,
        decimals,
        balance,
        balanceUSD: new bn(balance).multipliedBy(priceUSD).toString(10),
      },
    ];
  }, Promise.resolve([]));
}

function e18(v) {
  return new bn(v.toString()).div(1e18);
}

function stakingAdapterFactory(poolABI) {
  return async (provider, contractAddress, initOptions = ethereum.defaultOptions()) => {
    const options = {
      ...ethereum.defaultOptions(),
      ...initOptions,
    };

    const blockTag = options.blockNumber === 'latest' ? 'latest' : parseInt(options.blockNumber, 10);
    const network = (await provider.detectNetwork()).chainId;
    const block = await provider.getBlock(blockTag);
    const multicall = new ethersMulticall.Provider(provider, network);
    const priceFeed = bridgeWrapperBuild(bridgeTokens, blockTag, block, network);
    const gaugeController = new ethersMulticall.Contract(
      '0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB',
      gaugeControllerABI
    );
    const crvToken = '0xD533a949740bb3306d119CC777fa900bA034cd52';
    const crvPriceUSD = await priceFeed(crvToken);
    const minter = new ethersMulticall.Contract('0xd061D61a4d941c39E5453435B6345Dc261C2fcE0', minterABI);
    const pools = new PoolRegistry({ multicall, blockTag });

    const poolInfo = await pools.findByGauge(contractAddress);
    const pool = new Pool({ multicall, blockTag }, { ...poolInfo, abi: poolABI });
    const [stakedTotalSupply, inflationRate, workingSupply, virtualPrice, relativeWeight] = await multicall.all([
      pool.gauge.totalSupply(),
      pool.gauge.inflation_rate(),
      pool.gauge.working_supply(),
      pool.pool.get_virtual_price(),
      gaugeController.gauge_relative_weight(pool.gauge.address),
    ]);
    const stakingTokenDecimals = 18;

    const totalSupplyTokens = await getUnderlyingBalance(pools, priceFeed, pool, stakedTotalSupply.toString());
    const stakedTokens = totalSupplyTokens.flat(Infinity);
    const tvl = stakedTokens.reduce((sum, { balanceUSD }) => sum.plus(balanceUSD), new bn(0));

    const aprDay = new bn(e18(inflationRate))
      .multipliedBy(e18(relativeWeight))
      .multipliedBy(86400)
      .div(e18(workingSupply))
      .multipliedBy(0.4)
      .div(e18(virtualPrice))
      .multipliedBy(crvPriceUSD);

    return {
      stakeToken: {
        address: poolInfo.lpToken,
        decimals: 18,
        parts: stakedTokens.map(({ address, decimals, balance, balanceUSD }) => ({
          address,
          decimals,
          priceUSD: new bn(balanceUSD).div(balance).toString(10),
        })),
      },
      rewardToken: {
        address: crvToken,
        decimals: 18,
        priceUSD: crvPriceUSD.toString(10),
      },
      metrics: {
        tvl: tvl.toString(10),
        aprDay: aprDay.toString(10),
        aprWeek: aprDay.multipliedBy(7).toString(10),
        aprMonth: aprDay.multipliedBy(30).toString(10),
        aprYear: aprDay.multipliedBy(365).toString(10),
      },
      wallet: async (walletAddress) => {
        const [staked] = await multicall.all([pool.gauge.balanceOf(walletAddress)]);
        const gauge = new ethers.Contract(pool.info.gauge, gaugeABI, provider);
        const earned = await gauge.callStatic.claimable_tokens(walletAddress).then((v) => v.toString());
        const stakedTokens = (await getUnderlyingBalance(pools, priceFeed, pool, staked.toString())).flat(Infinity);
        const earnedNormalize = new bn(earned.toString()).div(1e18).toString(10);
        const earnedUSD = new bn(earnedNormalize).multipliedBy(crvPriceUSD).toString(10);

        return {
          staked: stakedTokens.reduce(
            (result, { address, balance, balanceUSD }) => ({
              ...result,
              [address]: {
                balance,
                usd: balanceUSD,
              },
            }),
            {}
          ),
          earned: {
            [crvToken]: {
              balance: earnedNormalize,
              usd: earnedUSD,
            },
          },
          metrics: {
            staking: stakedTokens.reduce((sum, { balance }) => sum.plus(balance), new bn(0)).toString(10),
            stakingUSD: stakedTokens.reduce((sum, { balanceUSD }) => sum.plus(balanceUSD), new bn(0)).toString(10),
            earned: earnedNormalize,
            earnedUSD,
          },
          tokens: tokens(
            ...stakedTokens.concat([{ address: crvToken, balance: earnedNormalize, balanceUSD: earnedUSD }]).reduce(
              (result, { address, balance, balanceUSD }) => [
                ...result,
                {
                  token: address,
                  data: {
                    balance,
                    usd: balanceUSD,
                  },
                },
              ],
              []
            )
          ),
        };
      },
      actions: async (walletAddress) => {
        if (options.signer === null) {
          throw new Error('Signer not found, use options.signer for use actions');
        }
        const { signer } = options;
        const rewardTokenContract = ethereum.erc20(provider, crvToken).connect(signer);
        const rewardTokenSymbol = await rewardTokenContract.symbol();
        const stakingTokenContract = ethereum.erc20(signer, pool.lpToken.address);
        const stakingTokenSymbol = await stakingTokenContract.symbol();
        const stakingContract = new ethers.Contract(pool.gauge.address, gaugeABI, signer);
        const minterContract = new ethers.Contract(minter.address, minterABI, signer);

        return {
          stake: [
            AutomateActions.tab(
              'Stake',
              async () => ({
                description: `Stake your [${stakingTokenSymbol}](etherscan.io/address/${pool.lpToken.address}) tokens to contract`,
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
                  pool.gauge.address,
                  amountInt.toFixed(0)
                );

                return {
                  tx: await stakingContract.deposit(amountInt.toFixed(0)),
                };
              }
            ),
          ],
          unstake: [
            AutomateActions.tab(
              'Unstake',
              async () => ({
                description: `Unstake your [${stakingTokenSymbol}](etherscan.io/address/${pool.lpToken.address}) tokens from contract`,
                inputs: [
                  AutomateActions.input({
                    placeholder: 'amount',
                    value: new bn(await stakingContract.balanceOf(walletAddress).then((v) => v.toString()))
                      .div(`1e${stakingTokenDecimals}`)
                      .toString(10),
                  }),
                ],
              }),
              async (amount) => {
                const amountInt = new bn(amount).multipliedBy(`1e${stakingTokenDecimals}`);
                if (amountInt.lte(0)) return Error('Invalid amount');

                const balance = await stakingContract.balanceOf(walletAddress).then((v) => v.toString());
                if (amountInt.gt(balance)) return Error('Amount exceeds balance');

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
                description: `Claim your [${rewardTokenSymbol}](etherscan.io/address/${rewardToken}) reward`,
              }),
              async () => {
                const earned = await minterContract.minted(walletAddress, pool.gauge.address).then((v) => v.toString());
                if (new bn(earned).isLessThanOrEqualTo(0)) {
                  return Error('No earnings');
                }

                return true;
              },
              async () => ({
                tx: await minterContract.mint(pool.gauge.address),
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
                return true;
              },
              async () => {
                const earned = await minterContract.minted(walletAddress, pool.gauge.address).then((v) => v.toString());
                if (new bn(earned).isGreaterThan(0)) {
                  await minterContract.mint(pool.gauge.address);
                }

                const balance = await stakingContract.balanceOf(walletAddress).then((v) => v.toString());
                return {
                  tx: await stakingContract.withdraw(balance),
                };
              }
            ),
          ],
        };
      },
    };
  };
}

module.exports = {
  staking: stakingAdapterFactory(poolABI),
  stakingLanding: stakingAdapterFactory(landingPoolABI),
  veCRV: async (provider, contractAddress, initOptions = ethereum.defaultOptions()) => {
    const options = {
      ...ethereum.defaultOptions(),
      ...initOptions,
    };

    const blockTag = options.blockNumber === 'latest' ? 'latest' : parseInt(options.blockNumber, 10);
    const network = (await provider.detectNetwork()).chainId;
    const block = await provider.getBlock(blockTag);
    const multicall = new ethersMulticall.Provider(provider, network);
    const priceFeed = bridgeWrapperBuild(bridgeTokens, blockTag, block, network);

    return {
      metrics: {
        tvl: '0',
        aprDay: '0',
        aprWeek: '0',
        aprMonth: '0',
        aprYear: '0',
      },
      wallet: async (walletAddress) => {
        const veCRVAddress = '0x5f3b5DfEb7B28CDbD7FAba78963EE202a494e2A2';
        const feeDistributorAddress = '0xA464e6DCda8AC41e03616F95f4BC98a13b8922Dc';
        const veCRVContract = new ethers.Contract(veCRVAddress, veCRVABI, provider);
        const feeDistributorContract = new ethers.Contract(feeDistributorAddress, feeDistributorABI, provider);
        const staked = await veCRVContract.callStatic['locked(address)'](walletAddress).then(({ amount }) =>
          new bn(amount.toString()).div('1e18')
        );
        const stakedUSD = staked.multipliedBy(await priceFeed(veCRVAddress));
        const rewardTokenAddress = await feeDistributorContract.token();
        const pools = new PoolRegistry({ multicall, blockTag });
        const poolInfo = await pools.findByLp(rewardTokenAddress);
        const pool = new Pool({ multicall, blockTag }, { ...poolInfo, abi: poolABI });
        const earned = await feeDistributorContract.callStatic['claim(address)'](walletAddress).then(
          (v) => new bn(v.toString())
        );
        const rewardTokens = (await getUnderlyingBalance(pools, priceFeed, pool, earned.toString(10))).flat(Infinity);

        return {
          staked: {
            [veCRVAddress]: {
              balance: staked.toString(10),
              usd: stakedUSD.toString(10),
            },
          },
          earned: rewardTokens.reduce(
            (result, { address, balance, balanceUSD }) => ({
              ...result,
              [address]: {
                balance,
                usd: balanceUSD,
              },
            }),
            {}
          ),
          metrics: {
            staking: staked.toString(10),
            stakingUSD: stakedUSD.toString(10),
            earned: earned.div('1e18').toString(10),
            earnedUSD: rewardTokens.reduce((sum, { balanceUSD }) => sum.plus(balanceUSD), new bn(0)).toString(10),
          },
          tokens: tokens(
            ...rewardTokens
              .concat([{ address: veCRVAddress, balance: staked.toString(10), balanceUSD: stakedUSD.toString(10) }])
              .reduce(
                (result, { address, balance, balanceUSD }) => [
                  ...result,
                  {
                    token: address,
                    data: {
                      balance,
                      usd: balanceUSD,
                    },
                  },
                ],
                []
              )
          ),
        };
      },
      actions: async (walletAddress) => {
        return {
          stake: [],
          unstake: [],
          claim: [],
          exit: [],
        };
      },
    };
  },
  automates: {
    deploy: {
      GaugeUniswapRestake: async (signer, factoryAddress, prototypeAddress, contractAddress = undefined) => {
        const network = await signer.getChainId();
        const multicall = new ethersMulticall.Provider(signer, network);
        const pools = new PoolRegistry({ multicall, blockTag: 'latest' });
        let gaugeInfo = await pools.findByGauge('0xbFcF63294aD7105dEa65aA58F8AE5BE2D9d0952A'); // 3pool default
        let gauge = gaugeInfo.gauge;
        let swapToken = gaugeInfo.coins[0].address;
        if (contractAddress) {
          gaugeInfo = await pools.findByGauge(contractAddress);
          gauge = gaugeInfo.gauge;
          swapToken = gaugeInfo.coins[0].address;
        }

        return {
          deploy: [
            AutomateActions.tab(
              'Deploy',
              async () => ({
                description: 'Deploy your own contract',
                inputs: [
                  AutomateActions.input({
                    placeholder: 'Target gauge',
                    value: gauge,
                  }),
                  AutomateActions.input({
                    placeholder: 'Liquidity pool router address',
                    value: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
                  }),
                  AutomateActions.input({
                    placeholder: 'Swap token address',
                    value: swapToken,
                  }),
                  AutomateActions.input({
                    placeholder: 'Slippage percent',
                    value: '1',
                  }),
                  AutomateActions.input({
                    placeholder: 'Deadline (seconds)',
                    value: '300',
                  }),
                ],
              }),
              async (gauge, router, swapToken, slippage, deadline) => {
                if (slippage < 0 || slippage > 100) return new Error('Invalid slippage percent');
                if (deadline < 0) return new Error('Deadline has already passed');

                return true;
              },
              async (gauge, router, swapToken, slippage, deadline) =>
                AutomateActions.ethereum.proxyDeploy(
                  signer,
                  factoryAddress,
                  prototypeAddress,
                  new ethers.utils.Interface(gaugeUniswapRestakeABI).encodeFunctionData('init', [
                    gauge,
                    router,
                    swapToken,
                    Math.floor(slippage * 100),
                    deadline,
                  ])
                )
            ),
          ],
        };
      },
      GaugeUniswapClaim: async (signer, factoryAddress, prototypeAddress, contractAddress = undefined) => {
        const signerAddress = await signer.getAddress();
        const network = await signer.getChainId();
        const multicall = new ethersMulticall.Provider(signer, network);
        const pools = new PoolRegistry({ multicall, blockTag: 'latest' });
        let gaugeInfo = await pools.findByGauge('0xbFcF63294aD7105dEa65aA58F8AE5BE2D9d0952A'); // 3pool default
        let gauge = gaugeInfo.gauge;
        let swapToken = gaugeInfo.coins[0].address;
        if (contractAddress) {
          gaugeInfo = await pools.findByGauge(contractAddress);
          gauge = gaugeInfo.gauge;
          swapToken = gaugeInfo.coins[0].address;
        }

        return {
          deploy: [
            AutomateActions.tab(
              'Deploy',
              async () => ({
                description: 'Deploy your own contract',
                inputs: [
                  AutomateActions.input({
                    placeholder: 'Target gauge',
                    value: gauge,
                  }),
                  AutomateActions.input({
                    placeholder: 'Liquidity pool router address',
                    value: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
                  }),
                  AutomateActions.input({
                    placeholder: 'Swap token address',
                    value: swapToken,
                  }),
                  AutomateActions.input({
                    placeholder: 'Slippage percent',
                    value: '1',
                  }),
                  AutomateActions.input({
                    placeholder: 'Deadline (seconds)',
                    value: '300',
                  }),
                  AutomateActions.input({
                    placeholder: 'Recipient wallet address',
                    value: signerAddress,
                  }),
                ],
              }),
              async (gauge, router, swapToken, slippage, deadlinem, recipient) => {
                if (slippage < 0 || slippage > 100) return new Error('Invalid slippage percent');
                if (deadline < 0) return new Error('Deadline has already passed');

                return true;
              },
              async (gauge, router, swapToken, slippage, deadline, recipient) =>
                AutomateActions.ethereum.proxyDeploy(
                  signer,
                  factoryAddress,
                  prototypeAddress,
                  new ethers.utils.Interface(gaugeUniswapRestakeABI).encodeFunctionData('init', [
                    gauge,
                    router,
                    swapToken,
                    Math.floor(slippage * 100),
                    deadline,
                    recipient,
                  ])
                )
            ),
          ],
        };
      },
    },
    GaugeUniswapRestake: async (signer, contractAddress) => {
      const signerAddress = await signer.getAddress();
      const automate = new ethers.Contract(contractAddress, gaugeUniswapRestakeABI, signer);
      const stakingAddress = await automate.staking();
      const staking = new ethers.Contract(stakingAddress, gaugeABI, signer);
      const stakingTokenAddress = await staking.lp_token();
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
            const stakingBalance = new bn(await staking.balanceOf(signerAddress).then((v) => v.toString()));
            if (stakingBalance.lte(0)) return new Error('Insufficient funds on the staking contract balance');

            return true;
          },
          async () => {
            const stakingBalance = await staking.balanceOf(signerAddress).then((v) => v.toString());
            return {
              tx: await staking.withdraw(stakingBalance),
            };
          }
        ),
        ...deposit,
      ];
      const runParams = async () => {
        const multicall = new ethersMulticall.Provider(signer, await signer.getChainId());
        const automateMulticall = new ethersMulticall.Contract(contractAddress, gaugeUniswapRestakeABI);
        const stakingMulticall = new ethersMulticall.Contract(stakingAddress, gaugeABI);
        const [routerAddress, slippagePercent, deadlineSeconds, swapTokenAddress, rewardTokenAddress] =
          await multicall.all([
            automateMulticall.liquidityRouter(),
            automateMulticall.slippage(),
            automateMulticall.deadline(),
            automateMulticall.swapToken(),
            stakingMulticall.crv_token(),
          ]);
        const earned = await staking.callStatic.claimable_tokens(contractAddress).then((v) => v.toString());
        if (earned.toString() === '0') return new Error('No earned');
        const router = ethereum.uniswap.router(signer, routerAddress);

        const slippage = 1 - slippagePercent / 10000;
        const [, swapAmountOut] = await router.getAmountsOut(earned.toString(), [rewardTokenAddress, swapTokenAddress]);
        const swapOutMin = new bn(swapAmountOut.toString()).multipliedBy(slippage).toFixed(0);
        const lpAmountOut = await automate.calcTokenAmount(swapOutMin);
        const lpOutMin = new bn(lpAmountOut.toString()).multipliedBy(slippage).toFixed(0);
        const deadline = dayjs().add(deadlineSeconds, 'seconds').unix();

        const gasLimit = new bn(
          await automate.estimateGas.run(0, deadline, swapOutMin, lpOutMin).then((v) => v.toString())
        )
          .multipliedBy(1.1)
          .toFixed(0);
        const gasPrice = await signer.getGasPrice();
        const gasFee = new bn(gasLimit.toString()).multipliedBy(gasPrice.toString()).toFixed(0);

        await automate.estimateGas.run(gasFee, deadline, swapOutMin, lpOutMin);
        return {
          gasPrice,
          gasLimit,
          calldata: [gasFee, deadline, swapOutMin, lpOutMin],
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
        contract: stakingAddress,
        deposit,
        refund,
        migrate,
        runParams,
        run,
      };
    },
    GaugeUniswapClaim: async (signer, contractAddress) => {
      const signerAddress = await signer.getAddress();
      const automate = new ethers.Contract(contractAddress, gaugeUniswapRestakeABI, signer);
      const stakingAddress = await automate.staking();
      const staking = new ethers.Contract(stakingAddress, gaugeABI, signer);
      const stakingTokenAddress = await staking.lp_token();
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
            const stakingBalance = new bn(await staking.balanceOf(signerAddress).then((v) => v.toString()));
            if (stakingBalance.lte(0)) return new Error('Insufficient funds on the staking contract balance');

            return true;
          },
          async () => {
            const stakingBalance = await staking.balanceOf(signerAddress).then((v) => v.toString());
            return {
              tx: await staking.withdraw(stakingBalance),
            };
          }
        ),
        ...deposit,
      ];
      const runParams = async () => {
        const multicall = new ethersMulticall.Provider(signer, await signer.getChainId());
        const automateMulticall = new ethersMulticall.Contract(contractAddress, gaugeUniswapRestakeABI);
        const stakingMulticall = new ethersMulticall.Contract(stakingAddress, gaugeABI);
        const [routerAddress, slippagePercent, deadlineSeconds, swapTokenAddress, rewardTokenAddress] =
          await multicall.all([
            automateMulticall.liquidityRouter(),
            automateMulticall.slippage(),
            automateMulticall.deadline(),
            automateMulticall.swapToken(),
            stakingMulticall.crv_token(),
          ]);
        const earned = await staking.callStatic.claimable_tokens(contractAddress).then((v) => v.toString());
        if (earned.toString() === '0') return new Error('No earned');
        const router = ethereum.uniswap.router(signer, routerAddress);

        const slippage = 1 - slippagePercent / 10000;
        const [, swapAmountOut] = await router.getAmountsOut(earned.toString(), [rewardTokenAddress, swapTokenAddress]);
        const swapOutMin = new bn(swapAmountOut.toString()).multipliedBy(slippage).toFixed(0);
        const deadline = dayjs().add(deadlineSeconds, 'seconds').unix();

        const gasLimit = new bn(await automate.estimateGas.run(0, deadline, swapOutMin).then((v) => v.toString()))
          .multipliedBy(1.1)
          .toFixed(0);
        const gasPrice = await signer.getGasPrice();
        const gasFee = new bn(gasLimit.toString()).multipliedBy(gasPrice.toString()).toFixed(0);

        await automate.estimateGas.run(gasFee, deadline, swapOutMin);
        return {
          gasPrice,
          gasLimit,
          calldata: [gasFee, deadline, swapOutMin],
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
        contract: stakingAddress,
        deposit,
        refund,
        migrate,
        runParams,
        run,
      };
    },
  },
};

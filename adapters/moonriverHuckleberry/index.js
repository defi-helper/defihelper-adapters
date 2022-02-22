const { ethers, bn, ethersMulticall, dayjs } = require('../lib');
const { ethereum } = require('../utils/ethereum');
const { tokens } = require('../utils/tokens');
const { bridgeWrapperBuild } = require('../utils/coingecko');
const { buildMasterChefProvider, toBN, buildMasterChefActions } = require('../utils/masterChef/provider');
const cache = require('../utils/cache');
const AutomateActions = require('../utils/automate/actions');
const masterChefABI = require('./abi/masterChefABI.json');
const tomTokenABI = require('./abi/TomTokenABI.json');
const MasterChefFinnLpRestakeABI = require('./abi/MasterChefFinnLpRestakeABI.json');
const bridgeTokens = require('./abi/bridgeTokens.json');

const masterChefAddress = '0x1f4b7660b6AdC3943b5038e3426B33c1c0e343E6';
const routeTokens = ['0x98878B06940aE243284CA214f92Bb71a2b032B8A'];

module.exports = {
  masterChefPair: async (provider, contractAddress, initOptions = ethereum.defaultOptions()) => {
    const options = {
      ...ethereum.defaultOptions(),
      ...initOptions,
    };
    const masterChefSavedPools = await cache.read('moonriverHuckleberry', 'masterChefPools');
    const blockTag = options.blockNumber === 'latest' ? 'latest' : parseInt(options.blockNumber, 10);
    const network = (await provider.detectNetwork()).chainId;
    const block = await provider.getBlock(blockTag);
    const priceFeed = bridgeWrapperBuild(bridgeTokens, blockTag, block, network);

    const pool = masterChefSavedPools.find((p) => p.stakingToken.toLowerCase() === contractAddress.toLowerCase());
    if (!pool) {
      throw new Error('Pool is not found');
    }

    const masterChefProvider = buildMasterChefProvider(
      new ethers.Contract(masterChefAddress, masterChefABI, provider),
      { blockTag },
      {
        rewardToken() {
          return '0x9a92b5ebf1f6f6f7d93696fcd44e5cf75035a756';
        },
        poolInfo(poolIndex) {
          return this.contract
            .poolInfo(poolIndex, { blockTag: this.options.blockTag })
            .then(({ lpToken, allocPoint, accRewardPerShare }) => ({
              lpToken,
              allocPoint: toBN(allocPoint),
              accRewardPerShare: toBN(accRewardPerShare),
            }));
        },
        rewardPerSecond() {
          return this.contract.finnPerSecond({ blockTag: this.options.blockTag }).then(toBN);
        },
        pendingReward(poolIndex, wallet) {
          return this.contract.pendingReward(poolIndex, wallet).then(toBN);
        },
      }
    );
    const poolInfo = await masterChefProvider.poolInfo(pool.index);

    const rewardToken = await masterChefProvider.rewardToken();
    const rewardTokenDecimals = 18;
    const rewardTokenPriceUSD = await priceFeed(rewardToken);

    const stakingToken = await masterChefProvider.stakingToken(poolInfo);
    const stakingTokenDecimals = 18;
    const stakingTokenPair = await ethereum.uniswap.pairInfo(provider, stakingToken, options);
    const token0PriceUSD = await priceFeed(stakingTokenPair.token0);
    const token1PriceUSD = await priceFeed(stakingTokenPair.token1);
    const stakingTokenPriceUSD = stakingTokenPair.calcPrice(token0PriceUSD, token1PriceUSD);

    const totalLocked = await masterChefProvider.totalLocked(poolInfo).then((v) => v.div(`1e${stakingTokenDecimals}`));
    const tvl = totalLocked.multipliedBy(stakingTokenPriceUSD);

    const [rewardPerSecond, totalAllocPoint] = await Promise.all([
      masterChefProvider.rewardPerSecond({ blockTag }),
      masterChefProvider.totalAllocPoint({ blockTag }),
    ]);
    const rewardPerSec = poolInfo.allocPoint
      .multipliedBy(rewardPerSecond)
      .div(totalAllocPoint)
      .div(`1e${rewardTokenDecimals}`);
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
        decimals: rewardTokenDecimals,
      },
      stakeToken: {
        address: stakingToken,
        decimals: stakingTokenDecimals,
        priceUSD: stakingTokenPriceUSD.toString(10),
        parts: [
          {
            address: stakingTokenPair.token0,
            decimals: stakingTokenPair.token0Decimals,
            priceUSD: token0PriceUSD.toString(10),
          },
          {
            address: stakingTokenPair.token1,
            decimals: stakingTokenPair.token1Decimals,
            priceUSD: token1PriceUSD.toString(10),
          },
        ],
      },
      rewardToken: {
        address: rewardToken,
        decimals: rewardTokenDecimals,
        priceUSD: rewardTokenPriceUSD.toString(10),
      },
      metrics: {
        tvl: tvl.toString(10),
        aprDay: aprDay.toString(10),
        aprWeek: aprWeek.toString(10),
        aprMonth: aprMonth.toString(10),
        aprYear: aprYear.toString(10),
      },
      wallet: async (walletAddress) => {
        const balance = await masterChefProvider
          .userInfo(pool.index, walletAddress)
          .then(({ amount }) => amount.div(`1e${stakingTokenDecimals}`));
        const earned = await masterChefProvider
          .pendingReward(pool.index, walletAddress)
          .then((v) => v.div(`1e${rewardTokenDecimals}`));
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

        return buildMasterChefActions(masterChefProvider, {
          poolIndex: pool.index,
          poolInfo,
          signer,
          etherscanAddressURL: 'https://moonriver.moonscan.io/address',
        }).then((actions) => actions(walletAddress));
      },
    };
  },
  masterChefSingle: async (provider, contractAddress, initOptions = ethereum.defaultOptions()) => {
    const options = {
      ...ethereum.defaultOptions(),
      ...initOptions,
    };
    const masterChefSavedPools = await cache.read('moonriverHuckleberry', 'masterChefPools');
    const blockTag = options.blockNumber === 'latest' ? 'latest' : parseInt(options.blockNumber, 10);
    const network = (await provider.detectNetwork()).chainId;
    const block = await provider.getBlock(blockTag);
    const priceFeed = bridgeWrapperBuild(bridgeTokens, blockTag, block, network);

    const pool = masterChefSavedPools.find((p) => p.stakingToken.toLowerCase() === contractAddress.toLowerCase());
    if (!pool) {
      throw new Error('Pool is not found');
    }

    const masterChefProvider = buildMasterChefProvider(
      new ethers.Contract(masterChefAddress, masterChefABI, provider),
      { blockTag },
      {
        rewardToken() {
          return '0x9a92b5ebf1f6f6f7d93696fcd44e5cf75035a756';
        },
        poolInfo(poolIndex) {
          return this.contract
            .poolInfo(poolIndex, { blockTag: this.options.blockTag })
            .then(({ lpToken, allocPoint, accRewardPerShare }) => ({
              lpToken,
              allocPoint: toBN(allocPoint),
              accRewardPerShare: toBN(accRewardPerShare),
            }));
        },
        rewardPerSecond() {
          return this.contract.finnPerSecond({ blockTag: this.options.blockTag }).then(toBN);
        },
        pendingReward(poolIndex, wallet) {
          return this.contract.pendingReward(poolIndex, wallet).then(toBN);
        },
      }
    );
    const poolInfo = await masterChefProvider.poolInfo(pool.index);

    const rewardToken = await masterChefProvider.rewardToken();
    const rewardTokenDecimals = 18;
    const rewardTokenPriceUSD = await priceFeed(rewardToken);

    const stakingToken = contractAddress.toLowerCase();
    const stakingTokenDecimals = await ethereum
      .erc20(provider, stakingToken)
      .decimals()
      .then((v) => Number(v.toString()));
    let stakingTokenPriceUSD = '0';
    // Tom token price feed
    if (stakingToken.toLowerCase() === '0x37619cc85325afea778830e184cb60a3abc9210b') {
      const [tomTotalSupply, finnBalance, finnPriceUSD] = await Promise.all([
        ethereum
          .erc20(provider, stakingToken)
          .totalSupply({ blockTag })
          .then((v) => new bn(v.toString())),
        ethereum
          .erc20(provider, rewardToken)
          .balanceOf(stakingToken, { blockTag })
          .then((v) => new bn(v.toString())),
        priceFeed(rewardToken),
      ]);
      stakingTokenPriceUSD = finnBalance.div(tomTotalSupply).multipliedBy(finnPriceUSD).toString(10);
    } else {
      stakingTokenPriceUSD = await priceFeed(stakingToken);
    }

    const totalLocked = await masterChefProvider.totalLocked(poolInfo).then((v) => v.div(`1e${stakingTokenDecimals}`));
    const tvl = totalLocked.multipliedBy(stakingTokenPriceUSD);

    const [rewardPerSecond, totalAllocPoint] = await Promise.all([
      masterChefProvider.rewardPerSecond({ blockTag }),
      masterChefProvider.totalAllocPoint({ blockTag }),
    ]);
    const rewardPerSec = poolInfo.allocPoint
      .multipliedBy(rewardPerSecond)
      .div(totalAllocPoint)
      .div(`1e${rewardTokenDecimals}`);
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
        decimals: rewardTokenDecimals,
      },
      stakeToken: {
        address: stakingToken,
        decimals: stakingTokenDecimals,
        priceUSD: stakingTokenPriceUSD.toString(10),
      },
      rewardToken: {
        address: rewardToken,
        decimals: rewardTokenDecimals,
        priceUSD: rewardTokenPriceUSD.toString(10),
      },
      metrics: {
        tvl: tvl.toString(10),
        aprDay: aprDay.toString(10),
        aprWeek: aprWeek.toString(10),
        aprMonth: aprMonth.toString(10),
        aprYear: aprYear.toString(10),
      },
      wallet: async (walletAddress) => {
        const balance = await masterChefProvider
          .userInfo(pool.index, walletAddress)
          .then(({ amount }) => amount.div(`1e${stakingTokenDecimals}`));
        const earned = await masterChefProvider
          .pendingReward(pool.index, walletAddress)
          .then((v) => v.div(`1e${rewardTokenDecimals}`));
        const balanceUSD = balance.multipliedBy(stakingTokenPriceUSD);
        const earnedUSD = earned.multipliedBy(rewardTokenPriceUSD);

        return {
          staked: {
            [stakingToken]: {
              balance: balance.toString(10),
              usd: balanceUSD.toString(10),
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
            stakingUSD: balanceUSD.toString(10),
            earned: earned.toString(10),
            earnedUSD: earnedUSD.toString(10),
          },
          tokens: tokens(
            {
              token: stakingToken,
              data: {
                balance: balance.toString(10),
                usd: balanceUSD.toString(10),
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

        return buildMasterChefActions(masterChefProvider, {
          poolIndex: pool.index,
          poolInfo,
          signer,
          etherscanAddressURL: 'https://moonriver.moonscan.io/address',
        }).then((actions) => actions(walletAddress));
      },
    };
  },
  tom: async (provider, tomAddress, initOptions = ethereum.defaultOptions()) => {
    const options = {
      ...ethereum.defaultOptions(),
      ...initOptions,
    };
    const blockTag = options.blockNumber === 'latest' ? 'latest' : parseInt(options.blockNumber, 10);
    const network = (await provider.detectNetwork()).chainId;
    const block = await provider.getBlock(blockTag);
    const priceFeed = bridgeWrapperBuild(bridgeTokens, blockTag, block, network);

    const finnAddress = '0x9a92b5ebf1f6f6f7d93696fcd44e5cf75035a756';
    const finnContract = ethereum.erc20(provider, finnAddress);
    const finnDecimals = 18;
    const tomContract = new ethers.Contract(tomAddress, tomTokenABI, provider);
    const tomDecimals = 18;

    const [finnBalance, finnPriceUSD] = await Promise.all([
      finnContract.balanceOf(tomAddress, { blockTag }).then((v) => new bn(v.toString()).div(`1e${finnDecimals}`)),
      priceFeed(finnAddress),
    ]);
    const tvl = finnBalance.multipliedBy(finnPriceUSD);

    return {
      staking: {
        token: finnAddress,
        decimals: finnDecimals,
      },
      stakeToken: {
        address: finnAddress,
        decimals: finnDecimals,
        priceUSD: finnPriceUSD.toString(10),
      },
      rewardToken: {
        address: tomAddress,
        decimals: tomDecimals,
        priceUSD: finnPriceUSD.toString(10),
      },
      metrics: {
        tvl: tvl.toString(10),
        aprDay: '0',
        aprWeek: '0',
        aprMonth: '0',
        aprYear: '0',
      },
      wallet: async (walletAddress) => {
        const [tomBalance, finnBalance, tomTotalSupply, finnPriceUSD] = await Promise.all([
          tomContract.balanceOf(walletAddress, { blockTag }).then((v) => new bn(v.toString()).div(`1e${tomDecimals}`)),
          finnContract.balanceOf(tomAddress, { blockTag }).then((v) => new bn(v.toString()).div(`1e${finnDecimals}`)),
          tomContract.totalSupply({ blockTag }).then((v) => new bn(v.toString()).div(`1e${tomDecimals}`)),
          priceFeed(finnAddress),
        ]);
        const k = finnBalance.div(tomTotalSupply);
        const balance = tomBalance.multipliedBy(k);
        const balanceUSD = balance.multipliedBy(finnPriceUSD);
        const earned = tomBalance;
        const earnedUSD = balanceUSD;

        return {
          staked: {
            [finnAddress]: {
              balance: balance.toString(10),
              usd: balanceUSD.toString(10),
            },
          },
          earned: {
            [tomAddress]: {
              balance: earned.toString(10),
              usd: earnedUSD.toString(10),
            },
          },
          metrics: {
            staking: balance.toString(10),
            stakingUSD: balanceUSD.toString(10),
            earned: earned.toString(10),
            earnedUSD: earnedUSD.toString(10),
          },
          tokens: tokens(
            {
              token: finnAddress,
              data: {
                balance: balance.toString(10),
                usd: balanceUSD.toString(10),
              },
            },
            {
              token: tomAddress,
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

        return {
          stake: [
            AutomateActions.tab(
              'Stake',
              async () => ({
                description: `Swap your [FINN](https://moonriver.moonscan.io/address/${finnAddress}) tokens to [TOM](https://moonriver.moonscan.io/address/${tomAddress}) tokens`,
                inputs: [
                  AutomateActions.input({
                    placeholder: 'amount',
                    value: new bn(await finnContract.balanceOf(walletAddress).then((v) => v.toString()))
                      .div(`1e${finnDecimals}`)
                      .toString(10),
                  }),
                ],
              }),
              async (amount) => {
                const amountInt = new bn(amount).multipliedBy(`1e${finnDecimals}`);
                if (amountInt.lte(0)) return Error('Invalid amount');

                const balance = await finnContract.balanceOf(walletAddress).then((v) => v.toString());
                if (amountInt.gt(balance)) return Error('Insufficient funds on the balance');

                return true;
              },
              async (amount) => {
                const amountInt = new bn(amount).multipliedBy(`1e${finnDecimals}`);
                await ethereum.erc20ApproveAll(
                  finnContract.connect(signer),
                  walletAddress,
                  tomAddress,
                  amountInt.toFixed(0)
                );

                return { tx: await tomContract.connect(signer).deposit(amountInt.toFixed(0)) };
              }
            ),
          ],
          unstake: [
            AutomateActions.tab(
              'Unstake',
              async () => ({
                description: `Swap your [TOM](https://moonriver.moonscan.io/address/${tomAddress}) tokens to [FINN](https://moonriver.moonscan.io/address/${finnAddress}) tokens`,
                inputs: [
                  AutomateActions.input({
                    placeholder: 'amount',
                    value: new bn(await tomContract.balanceOf(walletAddress).then((v) => v.toString()))
                      .div(`1e${tomDecimals}`)
                      .toString(10),
                  }),
                ],
              }),
              async (amount) => {
                const amountInt = new bn(amount).multipliedBy(`1e${tomDecimals}`);
                if (amountInt.lte(0)) return Error('Invalid amount');

                const balance = await tomContract.balanceOf(walletAddress).then((v) => v.toString());
                if (amountInt.isGreaterThan(balance)) {
                  return Error('Amount exceeds balance');
                }

                return true;
              },
              async (amount) => {
                const amountInt = new bn(amount).multipliedBy(`1e${tomDecimals}`);
                await ethereum.erc20ApproveAll(
                  tomContract.connect(signer),
                  walletAddress,
                  tomAddress,
                  amountInt.toFixed(0)
                );

                return { tx: await tomContract.connect(signer).withdraw(amountInt.toFixed(0)) };
              }
            ),
          ],
        };
      },
    };
  },
  automates: {
    contractsResolver: {
      default: async (provider, options = {}) => {
        const multicall = new ethersMulticall.Provider(provider);
        await multicall.init();

        const masterChiefContract = new ethersMulticall.Contract(masterChefAddress, masterChefABI);

        const [totalPools] = await multicall.all([masterChiefContract.poolLength()]);
        const poolsIndex = Array.from(new Array(totalPools.toNumber()).keys());
        const poolsInfo = await multicall.all(poolsIndex.map((poolIndex) => masterChiefContract.poolInfo(poolIndex)));
        const poolsStakingTokensSymbol = await multicall.all(
          poolsInfo.map(({ lpToken }) => new ethersMulticall.Contract(lpToken, ethereum.abi.ERC20ABI).symbol())
        );

        const pools = await Promise.all(
          poolsInfo.map(async (info, index) => {
            const stakingTokenSymbol = poolsStakingTokensSymbol[index];
            const isPair = stakingTokenSymbol === 'HBLP';

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
            const automate = {
              adapters: isPair ? ['masterChefPair'] : ['masterChefSingle'],
            };
            if (isPair) {
              automate.autorestakeAdapter = 'MasterChefFinnLpRestake';
              automate.buyLiquidity = {
                router: '0x2d4e873f9Ab279da9f1bb2c532d4F06f67755b77',
                pair: info.lpToken,
              };
            }

            return {
              poolIndex: index,
              stakingToken: info.lpToken,
              name: isPair ? `${token0Symbol}-${token1Symbol}` : stakingTokenSymbol,
              address: info.lpToken,
              blockchain: 'ethereum',
              network: '1285',
              layout: 'staking',
              adapter: isPair ? 'masterChefPair' : 'masterChefSingle',
              description: '',
              automate,
              link: '',
            };
          })
        );
        if (options.cacheAuth) {
          cache.write(
            options.cacheAuth,
            'moonriverHuckleberry',
            'masterChefPools',
            pools.map(({ poolIndex, stakingToken, adapter }) => ({
              index: poolIndex,
              stakingToken,
              type: adapter === 'masterChefPair' ? 'lp' : 'single',
            }))
          );
        }

        return pools;
      },
    },
    deploy: {
      MasterChefFinnLpRestake: async (signer, factoryAddress, prototypeAddress, contractAddress = undefined) => {
        const masterChefSavedPools = await cache.read('moonriverHuckleberry', 'masterChefPools');
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
                    Math.floor(slippage * 100),
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
        const pendingReward = await staking.pendingReward(poolId, contractAddress).then((v) => v.toString());

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
  },
};

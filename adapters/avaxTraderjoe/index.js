const { ethers, bn, ethersMulticall, dayjs } = require('../lib');
const { ethereum } = require('../utils/ethereum');
const { tokens } = require('../utils/tokens');
const { coingecko } = require('../utils/coingecko');
const { buildMasterChefProvider, toBN, buildMasterChefActions } = require('../utils/masterChef/provider');
const cache = require('../utils/cache');
const masterChefV2ABI = require('./abi/masterChefV2ABI.json');
const masterChefV3ABI = require('./abi/masterChefV3ABI.json');
const bridgeTokens = require('./abi/bridgeTokens.json');

const masterChefV2Address = '0xd6a4F121CA35509aF06A0Be99093d08462f53052';
const masterChefV3Address = '0x188bED1968b795d5c9022F6a0bb5931Ac4c18F00';

module.exports = {
  masterChefV2Pair: async (provider, contractAddress, initOptions = ethereum.defaultOptions()) => {
    const options = {
      ...ethereum.defaultOptions(),
      ...initOptions,
    };
    const masterChefSavedPools = await cache.read('avaxTraderjoe', 'masterChefV2Pools');
    const blockTag = options.blockNumber === 'latest' ? 'latest' : parseInt(options.blockNumber, 10);
    const network = (await provider.detectNetwork()).chainId;
    const block = await provider.getBlock(blockTag);

    const pool = masterChefSavedPools.find((p) => p.stakingToken.toLowerCase() === contractAddress.toLowerCase());
    if (!pool) {
      throw new Error('Pool is not found');
    }

    const masterChefProvider = buildMasterChefProvider(
      new ethers.Contract(masterChefV2Address, masterChefV2ABI, provider),
      { blockTag },
      {
        rewardToken() {
          return '0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd';
        },
        poolInfo(poolIndex) {
          return this.contract
            .poolInfo(poolIndex, { blockTag: this.options.blockTag })
            .then(({ lpToken, allocPoint, accJoePerShare }) => ({
              lpToken,
              allocPoint: toBN(allocPoint),
              accRewardPerShare: toBN(accJoePerShare),
            }));
        },
        rewardPerSecond() {
          return this.contract.joePerSec({ blockTag: this.options.blockTag }).then(toBN);
        },
        pendingReward(poolIndex, wallet) {
          return this.contract.pendingTokens(poolIndex, wallet).then(({ pendingJoe }) => toBN(pendingJoe));
        },
      }
    );
    const poolInfo = await masterChefProvider.poolInfo(pool.index);

    const rewardToken = await masterChefProvider.rewardToken();
    const rewardTokenDecimals = 18;
    const rewardTokenPriceUSD = await coingecko.getPriceUSDByContract(
      coingecko.platformByEthereumNetwork(network),
      blockTag === 'latest',
      block,
      rewardToken
    );

    const stakingToken = await masterChefProvider.stakingToken(poolInfo);
    const stakingTokenDecimals = 18;
    const stakingTokenPair = await ethereum.uniswap.pairInfo(provider, stakingToken, options);
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

    const totalLocked = await masterChefProvider.totalLocked(poolInfo).then((v) => v.div(`1e${stakingTokenDecimals}`));
    const tvl = new bn(totalLocked).multipliedBy(stakingTokenPriceUSD);

    const [rewardPerSecond, totalAllocPoint, devPercent, treasuryPercent, investorPercent] = await Promise.all([
      masterChefProvider.rewardPerSecond({ blockTag }),
      masterChefProvider.totalAllocPoint({ blockTag }),
      masterChefProvider.contract.devPercent({ blockTag }).then(toBN),
      masterChefProvider.contract.treasuryPercent({ blockTag }).then(toBN),
      masterChefProvider.contract.investorPercent({ blockTag }).then(toBN),
    ]);
    const lpPercent = new bn(1000).minus(devPercent).minus(treasuryPercent).minus(investorPercent).div(1000);
    const aprSecond = poolInfo.allocPoint
      .multipliedBy(rewardPerSecond)
      .div(totalAllocPoint)
      .multipliedBy(lpPercent)
      .div(`1e${rewardTokenDecimals}`)
      .multipliedBy(rewardTokenPriceUSD)
      .div(tvl);
    const aprDay = aprSecond.multipliedBy(86400);
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
          etherscanAddressURL: 'https://snowtrace.io/address',
        }).then((actions) => actions(walletAddress));
      },
    };
  },
  masterChefV2Single: async (provider, contractAddress, initOptions = ethereum.defaultOptions()) => {
    const options = {
      ...ethereum.defaultOptions(),
      ...initOptions,
    };
    const masterChefSavedPools = await cache.read('avaxTraderjoe', 'masterChefV2Pools');
    const blockTag = options.blockNumber === 'latest' ? 'latest' : parseInt(options.blockNumber, 10);
    const network = (await provider.detectNetwork()).chainId;
    const block = await provider.getBlock(blockTag);

    const pool = masterChefSavedPools.find((p) => p.stakingToken.toLowerCase() === contractAddress.toLowerCase());
    if (!pool) {
      throw new Error('Pool is not found');
    }

    const masterChefProvider = buildMasterChefProvider(
      new ethers.Contract(masterChefV2Address, masterChefV2ABI, provider),
      { blockTag },
      {
        rewardToken() {
          return '0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd';
        },
        poolInfo(poolIndex) {
          return this.contract
            .poolInfo(poolIndex, { blockTag: this.options.blockTag })
            .then(({ lpToken, allocPoint, accJoePerShare }) => ({
              lpToken,
              allocPoint: toBN(allocPoint),
              accRewardPerShare: toBN(accJoePerShare),
            }));
        },
        rewardPerSecond() {
          return this.contract.joePerSec({ blockTag: this.options.blockTag }).then(toBN);
        },
        pendingReward(poolIndex, wallet) {
          return this.contract.pendingTokens(poolIndex, wallet).then(({ pendingJoe }) => toBN(pendingJoe));
        },
      }
    );
    const poolInfo = await masterChefProvider.poolInfo(pool.index);

    const rewardToken = await masterChefProvider.rewardToken();
    const rewardTokenDecimals = 18;
    const rewardTokenPriceUSD = await coingecko.getPriceUSDByContract(
      coingecko.platformByEthereumNetwork(network),
      blockTag === 'latest',
      block,
      rewardToken
    );

    const stakingToken = await masterChefProvider.stakingToken(poolInfo);
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

    const totalLocked = await masterChefProvider.totalLocked(poolInfo).then((v) => v.div(`1e${stakingTokenDecimals}`));
    const tvl = new bn(totalLocked).multipliedBy(stakingTokenPriceUSD);

    const [rewardPerSecond, totalAllocPoint, devPercent, treasuryPercent, investorPercent] = await Promise.all([
      masterChefProvider.rewardPerSecond({ blockTag }),
      masterChefProvider.totalAllocPoint({ blockTag }),
      masterChefProvider.contract.devPercent({ blockTag }).then(toBN),
      masterChefProvider.contract.treasuryPercent({ blockTag }).then(toBN),
      masterChefProvider.contract.investorPercent({ blockTag }).then(toBN),
    ]);
    const lpPercent = new bn(1000).minus(devPercent).minus(treasuryPercent).minus(investorPercent).div(1000);
    const aprSecond = poolInfo.allocPoint
      .multipliedBy(rewardPerSecond)
      .div(totalAllocPoint)
      .multipliedBy(lpPercent)
      .div(`1e${rewardTokenDecimals}`)
      .multipliedBy(rewardTokenPriceUSD)
      .div(tvl);
    const aprDay = aprSecond.multipliedBy(86400);
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
          etherscanAddressURL: 'https://snowtrace.io/address',
        }).then((actions) => actions(walletAddress));
      },
    };
  },
  masterChefV3Pair: async (provider, contractAddress, initOptions = ethereum.defaultOptions()) => {
    const options = {
      ...ethereum.defaultOptions(),
      ...initOptions,
    };
    const masterChefSavedPools = await cache.read('avaxTraderjoe', 'masterChefV3Pools');
    const blockTag = options.blockNumber === 'latest' ? 'latest' : parseInt(options.blockNumber, 10);
    const network = (await provider.detectNetwork()).chainId;
    const block = await provider.getBlock(blockTag);

    const pool = masterChefSavedPools.find((p) => p.stakingToken.toLowerCase() === contractAddress.toLowerCase());
    if (!pool) {
      throw new Error('Pool is not found');
    }

    const masterChefProvider = buildMasterChefProvider(
      new ethers.Contract(masterChefV3Address, masterChefV3ABI, provider),
      { blockTag },
      {
        rewardToken() {
          return '0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd';
        },
        poolInfo(poolIndex) {
          return this.contract
            .poolInfo(poolIndex, { blockTag: this.options.blockTag })
            .then(({ lpToken, allocPoint, accJoePerShare }) => ({
              lpToken,
              allocPoint: toBN(allocPoint),
              accRewardPerShare: toBN(accJoePerShare),
            }));
        },
        rewardPerSecond() {
          return this.contract.joePerSec({ blockTag: this.options.blockTag }).then(toBN);
        },
        pendingReward(poolIndex, wallet) {
          return this.contract.pendingTokens(poolIndex, wallet).then(({ pendingJoe }) => toBN(pendingJoe));
        },
      }
    );
    const poolInfo = await masterChefProvider.poolInfo(pool.index);

    const rewardToken = await masterChefProvider.rewardToken();
    const rewardTokenDecimals = 18;
    const rewardTokenPriceUSD = await coingecko.getPriceUSDByContract(
      coingecko.platformByEthereumNetwork(network),
      blockTag === 'latest',
      block,
      rewardToken
    );

    const stakingToken = await masterChefProvider.stakingToken(poolInfo);
    const stakingTokenDecimals = 18;
    const stakingTokenPair = await ethereum.uniswap.pairInfo(provider, stakingToken, options);
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

    const totalLocked = await masterChefProvider.totalLocked(poolInfo).then((v) => v.div(`1e${stakingTokenDecimals}`));
    const tvl = new bn(totalLocked).multipliedBy(stakingTokenPriceUSD);

    const [rewardPerSecond, totalAllocPoint] = await Promise.all([
      masterChefProvider.rewardPerSecond({ blockTag }),
      masterChefProvider.totalAllocPoint({ blockTag }),
    ]);
    const aprSecond = poolInfo.allocPoint
      .multipliedBy(rewardPerSecond)
      .div(totalAllocPoint)
      .div(`1e${rewardTokenDecimals}`)
      .multipliedBy(rewardTokenPriceUSD)
      .div(tvl);
    const aprDay = aprSecond.multipliedBy(86400);
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
          etherscanAddressURL: 'https://snowtrace.io/address',
        }).then((actions) => actions(walletAddress));
      },
    };
  },
  automates: {
    contractsResolver: {
      default: async (provider, options = {}) => {
        const multicall = new ethersMulticall.Provider(provider);
        await multicall.init();

        const masterChiefV2Contract = new ethersMulticall.Contract(masterChefV2Address, masterChefV2ABI);
        const masterChiefV3Contract = new ethersMulticall.Contract(masterChefV3Address, masterChefV3ABI);
        const [totalPoolsV2, totalPoolsV3] = await multicall.all([
          masterChiefV2Contract.poolLength(),
          masterChiefV3Contract.poolLength(),
        ]);
        const poolsV2Index = Array.from(new Array(totalPoolsV2.toNumber()).keys());
        const poolsV3Index = Array.from(new Array(totalPoolsV3.toNumber()).keys());
        const poolsV2Info = await multicall.all(
          poolsV2Index.map((poolIndex) => masterChiefV2Contract.poolInfo(poolIndex))
        );
        const poolsV3Info = await multicall.all(
          poolsV3Index.map((poolIndex) => masterChiefV3Contract.poolInfo(poolIndex))
        );
        const poolsV2StakingTokensSymbol = await multicall.all(
          poolsV2Info.map(({ lpToken }) => new ethersMulticall.Contract(lpToken, ethereum.abi.ERC20ABI).symbol())
        );
        const poolsV3StakingTokensSymbol = await multicall.all(
          poolsV3Info.map(({ lpToken }) => new ethersMulticall.Contract(lpToken, ethereum.abi.ERC20ABI).symbol())
        );

        const poolsV2 = await Promise.all(
          poolsV2Info.map(async (info, index) => {
            const stakingTokenSymbol = poolsV2StakingTokensSymbol[index];
            const isPair = stakingTokenSymbol === 'JLP';

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
              stakingToken: info.lpToken,
              name: isPair ? `${token0Symbol}-${token1Symbol}` : stakingTokenSymbol,
              address: info.lpToken,
              blockchain: 'ethereum',
              network: '43114',
              layout: 'staking',
              adapter: isPair ? 'masterChefV2Pair' : 'masterChefV2Single',
              description: '',
              automate: {
                autorestakeAdapter: isPair ? 'MasterChefV2LpRestake' : 'MasterChefV2SingleRestake',
                adapters: isPair ? ['masterChefV2Pair'] : ['masterChefV2Single'],
              },
              link: `https://traderjoexyz.com/farm/${info.lpToken}-${masterChefV2Address}`,
            };
          })
        );
        const poolsV3 = await Promise.all(
          poolsV3Info.map(async (info, index) => {
            const stakingTokenSymbol = poolsV3StakingTokensSymbol[index];
            const isPair = stakingTokenSymbol === 'JLP';
            if (!isPair) return null;

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
              stakingToken: info.lpToken,
              name: isPair ? `${token0Symbol}-${token1Symbol}` : stakingTokenSymbol,
              address: info.lpToken,
              blockchain: 'ethereum',
              network: '43114',
              layout: 'staking',
              adapter: isPair ? 'masterChefV3Pair' : 'masterChefV3Single',
              description: '',
              automate: {
                autorestakeAdapter: isPair ? 'MasterChefV3LpRestake' : 'MasterChefV3SingleRestake',
                adapters: isPair ? ['masterChefV3Pair'] : ['masterChefV3Single'],
              },
              link: `https://traderjoexyz.com/farm/${info.lpToken}-${masterChefV3Address}`,
            };
          })
        ).then((pools) => pools.filter((pool) => pool));
        if (options.cacheAuth) {
          cache.write(
            options.cacheAuth,
            'avaxTraderjoe',
            'masterChefV2Pools',
            poolsV2.map(({ poolIndex, stakingToken }) => ({
              index: poolIndex,
              stakingToken,
              type: adapter === 'masterChefV2Pair' ? 'lp' : 'single',
            }))
          );
          cache.write(
            options.cacheAuth,
            'avaxTraderjoe',
            'masterChefV3Pools',
            poolsV2.map(({ poolIndex, stakingToken }) => ({
              index: poolIndex,
              stakingToken,
              type: adapter === 'masterChefV3Pair' ? 'lp' : 'single',
            }))
          );
        }

        return [...poolsV2, ...poolsV3];
      },
    },
  },
};

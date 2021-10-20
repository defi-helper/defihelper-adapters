const { bn, ethers, ethersMulticall } = require('../lib');
const { ethereum } = require('../utils/ethereum');
const { coingecko } = require('../utils/coingecko');
const gaugeABI = require('./abi/gaugeABI.json');
const poolABI = require('./abi/poolABI.json');
const minterABI = require('./abi/minterABI.json');
const gaugeControllerABI = require('./abi/gaugeControllerABI.json');
const { tokens } = require('../utils');

class Pool {
  constructor(connect, info) {
    this.connect = connect;
    this.info = info;
    this.pool = new ethersMulticall.Contract(info.address, poolABI);
    this.lpToken = new ethersMulticall.Contract(info.lpToken, ethereum.abi.ERC20ABI);
    this.gauge = new ethersMulticall.Contract(info.gauge, gaugeABI);
  }

  async balances() {
    const { multicall, blockTag } = this.connect;
    const balances = await multicall.all(
      this.info.coins.map((coin, i) => this.pool.balances(i)),
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

const pools = [
  {
    name: '3pool',
    address: '0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7',
    lpToken: '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490',
    gauge: '0xbFcF63294aD7105dEa65aA58F8AE5BE2D9d0952A',
    coins: [
      {
        address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        decimals: 18,
      },
      {
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        decimals: 6,
      },
      {
        address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        decimals: 6,
      },
    ],
  },
  {
    name: 'tusd',
    address: '0xEcd5e75AFb02eFa118AF914515D6521aaBd189F1',
    lpToken: '0xEcd5e75AFb02eFa118AF914515D6521aaBd189F1',
    gauge: '0x359FD5d6417aE3D8D6497d9B2e7A890798262BA4',
    coins: [
      {
        address: '0x0000000000085d4780B73119b644AE5ecd22b376',
        decimals: 18,
      },
      {
        address: '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490',
        decimals: 18,
      },
    ],
  },
];

async function getUnderlyingBalance(getPriceUSD, pool, amount) {
  const balances = await pool.underlyingBalance(amount);

  return pool.info.coins.reduce(async (resultPromise, { address, decimals }, i) => {
    const result = await resultPromise;

    const subpoolInfo = pools.find(({ lpToken }) => lpToken === address);
    if (subpoolInfo) {
      return [...result, await getUnderlyingBalance(getPriceUSD, new Pool(pool.connect, subpoolInfo), balances[i])];
    }
    const balance = new bn(balances[i]).div(Number(`1e${decimals}`)).toString(10);
    const priceUSD = await getPriceUSD(address);

    return [
      ...result,
      {
        address,
        balance,
        balanceUSD: new bn(balance).multipliedBy(priceUSD).toString(10),
      },
    ];
  }, Promise.resolve([]));
}

function e18(v) {
  return new bn(v.toString()).div(1e18);
}

module.exports = {
  staking: async (provider, contractAddress, initOptions = ethereum.defaultOptions()) => {
    const options = {
      ...ethereum.defaultOptions(),
      ...initOptions,
    };

    const blockTag = options.blockNumber === 'latest' ? 'latest' : parseInt(options.blockNumber, 10);
    const network = (await provider.detectNetwork()).chainId;
    const block = await provider.getBlock(blockTag);
    const multicall = new ethersMulticall.Provider(provider, network);
    const getPriceUSD = coingecko.getPriceUSDByContract.bind(
      coingecko,
      coingecko.platformByEthereumNetwork(network),
      blockTag === 'latest',
      block
    );
    const gaugeController = new ethersMulticall.Contract(
      '0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB',
      gaugeControllerABI
    );
    const crvToken = '0xD533a949740bb3306d119CC777fa900bA034cd52';
    const crvPriceUSD = await getPriceUSD(crvToken);
    const minter = new ethersMulticall.Contract('0xd061D61a4d941c39E5453435B6345Dc261C2fcE0', minterABI);

    const poolInfo = pools.find(({ gauge }) => gauge === contractAddress);
    if (!poolInfo) throw new Error(`Undefined gauge "${contractAddress}"`);
    const pool = new Pool({ multicall, blockTag }, poolInfo);
    const [stakedTotalSupply, inflationRate, workingSupply, virtualPrice, relativeWeight] = await multicall.all([
      pool.gauge.totalSupply(),
      pool.gauge.inflation_rate(),
      pool.gauge.working_supply(),
      pool.pool.get_virtual_price(),
      gaugeController.gauge_relative_weight(pool.gauge.address),
    ]);

    const totalSupplyTokens = await getUnderlyingBalance(getPriceUSD, pool, stakedTotalSupply.toString());
    const tvl = totalSupplyTokens.flat(Infinity).reduce((sum, { balanceUSD }) => sum.plus(balanceUSD), new bn(0));

    const aprDay = new bn(e18(inflationRate))
      .multipliedBy(e18(relativeWeight))
      .multipliedBy(86400)
      .div(e18(workingSupply))
      .multipliedBy(0.4)
      .div(e18(virtualPrice))
      .multipliedBy(crvPriceUSD);

    return {
      metrics: {
        tvl: tvl.toString(10),
        aprDay: aprDay.toString(10),
        aprWeek: aprDay.multipliedBy(7).toString(10),
        aprMonth: aprDay.multipliedBy(30).toString(10),
        aprYear: aprDay.multipliedBy(365).toString(10),
      },
      wallet: async (walletAddress) => {
        const [staked, earned] = await multicall.all([
          pool.gauge.balanceOf(walletAddress),
          minter.minted(walletAddress, pool.info.gauge),
        ]);
        const stakedTokens = (await getUnderlyingBalance(getPriceUSD, pool, staked.toString())).flat(Infinity);
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
        const stakingTokenContract = ethereum.erc20(signer, pool.lpToken.address);
        const stakingContract = new ethers.Contract(pool.gauge.address, gaugeABI, signer);
        const minterContract = new ethers.Contract(minter.address, minterABI, signer);

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
              const balance = await contract.balanceOf(walletAddress);
              if (new bn(amount).isGreaterThan(balance.toString())) {
                return Error('Amount exceeds balance');
              }

              return true;
            },
            send: async (amount) => {
              await stakingContract.withdraw(amount);
            },
          },
          claim: {
            can: async () => {
              const earned = await minterContract.minted(walletAddress, pool.gauge.address);
              if (new bn(earned.toString()).isLessThanOrEqualTo(0)) {
                return Error('No earnings');
              }
              return true;
            },
            send: async () => {
              await minterContract.mint(pool.gauge.address);
            },
          },
          exit: {
            can: async () => {
              return true;
            },
            send: async () => {
              const earned = await minterContract.minted(walletAddress, pool.gauge.address);
              if (new bn(earned.toString()).isGreaterThan(0)) {
                await minterContract.mint(pool.gauge.address);
              }
              const balance = await stakingContract.balanceOf(walletAddress);
              if (new bn(balance.toString()).isGreaterThan(0)) {
                await stakingContract.withdraw(balance.toString());
              }
            },
          },
        };
      },
    };
  },
};

const { ethers, bn, ethersMulticall } = require('../lib');
const ERC20ABI = require('./abi/erc20.json');
const DFHStorageABI = require('./abi/dfh/storage.json');
const UniswapPairABI = require('./abi/uniswap/pair.json');
const UniswapRouterABI = require('./abi/uniswap/router.json');

const ethereum = {
  abi: {
    ERC20ABI,
    UniswapPairABI,
  },
  defaultOptions: () => ({
    blockNumber: 'latest',
    signer: null,
  }),
  getAvgBlockTime: async (provider, blockNumber) => {
    const interval = 30000;
    const currentBlockNumber = blockNumber || (await provider.getBlockNumber());
    const [fiftyBlockEarlier, currentBlock] = await Promise.all([
      provider.getBlock(currentBlockNumber - interval),
      provider.getBlock(currentBlockNumber),
    ]);

    return (
      (1000 * (currentBlock.timestamp - fiftyBlockEarlier.timestamp)) / (currentBlock.number - fiftyBlockEarlier.number)
    );
  },
  erc20: (provider, address) => new ethers.Contract(address, ERC20ABI, provider),
  erc20Info: async (provider, address, options = ethereum.defaultOptions()) => {
    const multicall = new ethersMulticall.Provider(provider);
    await multicall.init();
    const multicallToken = new ethersMulticall.Contract(address, ERC20ABI);
    const [name, symbol, decimals, totalSupply] = await multicall.all(
      [multicallToken.name(), multicallToken.symbol(), multicallToken.decimals(), multicallToken.totalSupply()],
      { blockTag: options.blockNumber }
    );

    return {
      name,
      symbol,
      decimals: decimals.toString(),
      totalSupply: totalSupply.toString(),
    };
  },
  dfh: {
    storageABI: DFHStorageABI,
    storage: (provider, address) => new ethers.Contract(address, DFHStorageABI, provider),
    storageKey: (k) => ethers.utils.keccak256(ethers.utils.toUtf8Bytes(k)),
  },
  uniswap: {
    PairInfo: class {
      constructor({
        address,
        token0,
        token0Decimals,
        reserve0,
        token1,
        token1Decimals,
        reserve1,
        totalSupply,
        blockTimestampLast,
      }) {
        this.address = address;
        this.token0 = token0;
        this.token0Decimals = token0Decimals;
        this.reserve0 = reserve0;
        this.token1 = token1;
        this.token1Decimals = token1Decimals;
        this.reserve1 = reserve1;
        this.totalSupply = totalSupply;
        this.blockTimestampLast = blockTimestampLast;
      }

      expandBalance(balance) {
        return {
          token0: new bn(balance).multipliedBy(this.reserve0).div(this.totalSupply),
          token1: new bn(balance).multipliedBy(this.reserve1).div(this.totalSupply),
        };
      }

      calcPrice(token0Price, token1Price) {
        const reserve0 = new bn(this.reserve0).multipliedBy(token0Price);
        const reserve1 = new bn(this.reserve1).multipliedBy(token1Price);
        return reserve0.plus(reserve1).div(this.totalSupply);
      }
    },
    pairDecimals: 18,
    pairABI: UniswapPairABI,
    pair: (provider, address) => new ethers.Contract(address, UniswapPairABI, provider),
    pairInfo: async (provider, address, options = ethereum.defaultOptions()) => {
      const multicall = new ethersMulticall.Provider(provider);
      await multicall.init();
      const multicallPair = new ethersMulticall.Contract(address, UniswapPairABI);
      let [token0, token1, reserves, totalSupply] = await multicall.all(
        [multicallPair.token0(), multicallPair.token1(), multicallPair.getReserves(), multicallPair.totalSupply()],
        { blockTag: options.blockNumber }
      );
      token0 = token0.toLowerCase();
      token1 = token1.toLowerCase();
      const blockTimestampLast = reserves[2];
      totalSupply = new bn(totalSupply.toString()).div(new bn(10).pow(ethereum.uniswap.pairDecimals)).toString();
      let [{ decimals: token0Decimals }, { decimals: token1Decimals }] = await Promise.all([
        ethereum.erc20Info(provider, token0, options),
        ethereum.erc20Info(provider, token1, options),
      ]);
      token0Decimals = token0Decimals.toString();
      token1Decimals = token1Decimals.toString();
      const reserve0 = new bn(reserves[0].toString()).div(new bn(10).pow(token0Decimals)).toString(10);
      const reserve1 = new bn(reserves[1].toString()).div(new bn(10).pow(token1Decimals)).toString(10);

      return new ethereum.uniswap.PairInfo({
        token0,
        token0Decimals,
        reserve0,
        token1,
        token1Decimals,
        reserve1,
        blockTimestampLast,
        totalSupply,
      });
    },
    routerABI: UniswapRouterABI,
    router: (provider, address) => new ethers.Contract(address, UniswapRouterABI, provider),
    getPrice: async (router, amountIn, path, options = ethereum.defaultOptions()) => {
      try {
        const amountsOut = await router.getAmountsOut(amountIn, path, { blockTag: options.blockNumber });

        return amountsOut[amountsOut.length - 1];
      } catch (e) {
        throw new Error(`Resolver price "${JSON.stringify(path)}" by uniswap router error: ${e}`);
      }
    },
  },
};

module.exports = {
  ethereum,
};

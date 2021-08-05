const { ethers, bn } = require('../lib');
const ERC20ABI = require('./abi/erc20.json');
const UniswapPairABI = require('./abi/uniswap/pair.json');

const ethereum = {
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
    const token = ethereum.erc20(provider, address);
    const [name, symbol, decimals, totalSupply] = await Promise.all([
      token.name({
        blockTag: options.blockNumber,
      }),
      token.symbol({
        blockTag: options.blockNumber,
      }),
      token.decimals({
        blockTag: options.blockNumber,
      }),
      token.totalSupply({
        blockTag: options.blockNumber,
      }),
    ]);

    return {
      name,
      symbol,
      decimals: decimals.toString(),
      totalSupply: totalSupply.toString(),
    };
  },
  uniswap: {
    pairDecimals: 18,
    pair: (provider, address) => new ethers.Contract(address, UniswapPairABI, provider),
    pairInfo: async (provider, address, options = ethereum.defaultOptions()) => {
      const pair = ethereum.uniswap.pair(provider, address);
      let [token0, token1, reserves, totalSupply] = await Promise.all([
        pair.token0({
          blockTag: options.blockNumber,
        }),
        pair.token1({
          blockTag: options.blockNumber,
        }),
        pair.getReserves({
          blockTag: options.blockNumber,
        }),
        pair.totalSupply({
          blockTag: options.blockNumber,
        }),
      ]);
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

      return {
        token0,
        token0Decimals,
        reserve0,
        token1,
        token1Decimals,
        reserve1,
        blockTimestampLast,
        totalSupply,
      };
    },
  },
};

module.exports = {
  ethereum,
};

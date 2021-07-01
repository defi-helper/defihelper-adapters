const ethers = require("ethers");
const ERC20ABI = require("./abi/erc20.json");
const UniswapPairABI = require("./abi/uniswap/pair.json");
const bn = require("bignumber.js");

const tokens = (...tokens) =>
  tokens.reduce((prev, { token, data }) => {
    if (prev[token]) {
      return {
        ...prev,
        [token]: Object.entries(data).reduce(
          (prev, [k, v]) => ({
            ...prev,
            [k]: prev[k] ? new bn(prev[k]).plus(v).toString(10) : v,
          }),
          prev[token]
        ),
      };
    } else {
      return { ...prev, [token]: data };
    }
  }, {});

const coingecko = {
  simple: {
    tokenPrice: async (id, contractAddresses, vsCurrencies) => {
      const normalizeContractAddresses = Array.isArray(contractAddresses)
        ? contractAddresses.join(",")
        : contractAddresses;
      const normalizeVsCurrencies = Array.isArray(vsCurrencies)
        ? vsCurrencies.join(",")
        : vsCurrencies;

      const resp = await axios.get(
        `https://api.coingecko.com/api/v3/simple/token_price/${id}?contract_addresses=${normalizeContractAddresses}&vs_currencies=${normalizeVsCurrencies}`
      );

      return resp.data;
    },
  },
};

const ethereum = {
  erc20: (provider, address) =>
    new ethers.Contract(address, ERC20ABI, provider),
  erc20Info: async (provider, address) => {
    const token = ethereum.erc20(provider, address);
    const [name, symbol, decimals, totalSupply] = await Promise.all([
      token.name(),
      token.symbol(),
      token.decimals(),
      token.totalSupply(),
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
    pair: (provider, address) =>
      new ethers.Contract(address, UniswapPairABI, provider),
    pairInfo: async (provider, address) => {
      const pair = ethereum.uniswap.pair(provider, address);
      let [token0, token1, reserves, totalSupply] = await Promise.all([
        pair.token0(),
        pair.token1(),
        pair.getReserves(),
        pair.totalSupply(),
      ]);
      token0 = token0.toLowerCase();
      token1 = token1.toLowerCase();
      blockTimestampLast = reserves[2];
      totalSupply = new bn(totalSupply.toString())
        .div(new bn(10).pow(ethereum.uniswap.pairDecimals))
        .toString();
      let [
        { decimals: token0Decimals },
        { decimals: token1Decimals },
      ] = await Promise.all([
        ethereum.erc20Info(provider, token0),
        ethereum.erc20Info(provider, token1),
      ]);
      token0Decimals = token0Decimals.toString();
      token1Decimals = token1Decimals.toString();
      reserve0 = new bn(reserves[0].toString())
        .div(new bn(10).pow(token0Decimals))
        .toString(10);
      reserve1 = new bn(reserves[1].toString())
        .div(new bn(10).pow(token1Decimals))
        .toString(10);
      const prices = await coingecko.simple.tokenPrice(
        "ethereum",
        [token0, token1],
        "usd"
      );
      const token0Usd = prices[token0.toLowerCase()].usd;
      const token1Usd = prices[token1.toLowerCase()].usd;

      return {
        token0,
        token0Decimals,
        reserve0,
        token0Usd,
        token1,
        token1Decimals,
        reserve1,
        token1Usd,
        blockTimestampLast,
        totalSupply,
        priceUSD: new bn(reserve0)
          .multipliedBy(token0Usd)
          .plus(new bn(reserve1).multipliedBy(token1Usd))
          .div(totalSupply)
          .toString(10),
      };
    },
  },
};

module.exports = {
  toFloat: (n, decimals) => new bn(n.toString()).div(new bn(10).pow(decimals)),
  tokens,
  ethereum,
  coingecko,
};

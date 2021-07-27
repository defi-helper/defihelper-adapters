const getaxios = () => {
  try {
    return axios = axios === undefined ? require("axios") : axios;
  } catch {
    return require("axios");
  }
}
axios = getaxios();
const ethers = require("ethers");
const ERC20ABI = require("./abi/erc20.json");
const UniswapPairABI = require("./abi/uniswap/pair.json");
const bn = require("bignumber.js");
const dayjs = require("dayjs");

const ethereumNetworkCoingeckoPlatformsMap = {
  "1": "ethereum",
  "56": "binance-smart-chain",
  "128": "huobi-token",
  "137": "polygon-pos",
  "250": "fantom",
};

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
  apiUrl: "https://api.coingecko.com/api/v3",
  getPriceUSD: async (isCurrent, block, tokenId) => {
    let priceUSD = "0";
    if (isCurrent) {
      const currentPrice = await coingecko.simple.price(tokenId, "usd");
      if (currentPrice[tokenId].usd === undefined) return priceUSD;

      priceUSD = currentPrice[tokenId].usd;
    } else {
      const historyPrice = await coingecko.coins.history(
        tokenId,
        dayjs.unix(block.timestamp)
      );
      if (
        historyPrice.market_data === undefined ||
        historyPrice.market_data.current_price === undefined
      )
        return priceUSD;

      priceUSD = historyPrice.market_data.current_price.usd;
    }

    return priceUSD;
  },
  getPriceUSDByContract: async (platform, isCurrent, block, tokenAddress) => {
    let priceUSD = "0";
    if (isCurrent) {
      const currentPrice = await coingecko.simple.tokenPrice(
        platform,
        tokenAddress,
        "usd"
      );
      if (currentPrice[tokenAddress].usd === undefined) return priceUSD;

      priceUSD = currentPrice[tokenAddress].usd;
    } else {
      const coingeckoContractInfo = await coingecko.coins.contract(
        platform,
        tokenAddress
      );
      const historyPrice = await coingecko.coins.history(
        coingeckoContractInfo.id,
        dayjs.unix(block.timestamp)
      );
      if (
        historyPrice.market_data === undefined ||
        historyPrice.market_data.current_price === undefined
      )
        return priceUSD;

      priceUSD = historyPrice.market_data.current_price.usd;
    }

    return priceUSD;
  },
  simple: {
    price: async (ids, vsCurrencies) => {
      const normalizeIds = (Array.isArray(ids) ? ids : [ids]).join(",");
      const normalizeVsCurrencies = (Array.isArray(vsCurrencies)
        ? vsCurrencies
        : [vsCurrencies]
      ).join(",");

      const resp = await axios.get(
        `${coingecko.apiUrl}/simple/price?ids=${normalizeIds}&vs_currencies=${normalizeVsCurrencies}`
      );

      return resp.data;
    },
    tokenPrice: async (id, contractAddresses, vsCurrencies) => {
      const normalizeContractAddresses = (Array.isArray(contractAddresses)
        ? contractAddresses
        : [contractAddresses]
      ).join(",");
      const normalizeVsCurrencies = (Array.isArray(vsCurrencies)
        ? vsCurrencies
        : [vsCurrencies]
      ).join(",");

      const resp = await axios.get(
        `${coingecko.apiUrl}/simple/token_price/${id}?contract_addresses=${normalizeContractAddresses}&vs_currencies=${normalizeVsCurrencies}`
      );

      return resp.data;
    },
  },
  coins: {
    contract: async (id, contractAddress) => {
      const resp = await axios.get(
        `${coingecko.apiUrl}/coins/${id}/contract/${contractAddress}`
      );

      return resp.data;
    },
    history: async (id, date) => {
      const normalizeDate =
        typeof date === "string"
          ? date
          : dayjs.isDayjs(date)
          ? date.format("DD-MM-YYYY")
          : dayjs(date).format("DD-MM-YYYY");

      const resp = await axios.get(
        `${coingecko.apiUrl}/coins/${id}/history?date=${normalizeDate}`
      );

      return resp.data;
    },
  },
  platformByEthereumNetwork(network) {
    return ethereumNetworkCoingeckoPlatformsMap[network.toString()];
  },
};

const ethereum = {

  defaultOptions: () => ({
    blockNumber: "latest",
    signer: null,
  }),
  getAvgBlockTime: async (provider, blockNumber) => {
    const interval = 30000
    const currentBlockNumber = blockNumber || await provider.getBlockNumber();
    const [fiftyBlockEarlier, currentBlock] = await Promise.all([
        provider.getBlock(currentBlockNumber - interval),
        provider.getBlock(currentBlockNumber),
      ]);

    return 1000 * (currentBlock.timestamp - fiftyBlockEarlier.timestamp) / (currentBlock.number - fiftyBlockEarlier.number);
  },
  erc20: (provider, address) =>
    new ethers.Contract(address, ERC20ABI, provider),
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
    pair: (provider, address) =>
      new ethers.Contract(address, UniswapPairABI, provider),
    pairInfo: async (
      provider,
      address,
      options = ethereum.defaultOptions()
    ) => {
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
      blockTimestampLast = reserves[2];
      totalSupply = new bn(totalSupply.toString())
        .div(new bn(10).pow(ethereum.uniswap.pairDecimals))
        .toString();
      let [
        { decimals: token0Decimals },
        { decimals: token1Decimals },
      ] = await Promise.all([
        ethereum.erc20Info(provider, token0, options),
        ethereum.erc20Info(provider, token1, options),
      ]);
      token0Decimals = token0Decimals.toString();
      token1Decimals = token1Decimals.toString();
      reserve0 = new bn(reserves[0].toString())
        .div(new bn(10).pow(token0Decimals))
        .toString(10);
      reserve1 = new bn(reserves[1].toString())
        .div(new bn(10).pow(token1Decimals))
        .toString(10);

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

const waves = {
  defaultOptions: () => ({}),
};

module.exports = {
  toFloat: (n, decimals) => new bn(n.toString()).div(new bn(10).pow(decimals)),
  tokens,
  ethereum,
  waves,
  coingecko,
};

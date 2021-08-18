const { dayjs, axios } = require('../lib');

const ethereumNetworkCoingeckoPlatformsMap = {
  1: 'ethereum',
  56: 'binance-smart-chain',
  128: 'huobi-token',
  137: 'polygon-pos',
  250: 'fantom',
};

const coingecko = {
  apiUrl: 'https://coingecko.defihelper.io/api/v3',
  getPriceUSD: async (isCurrent, block, tokenId) => {
    let priceUSD = '0';
    if (isCurrent) {
      const currentPrice = await coingecko.simple.price(tokenId, 'usd');
      if (currentPrice[tokenId].usd === undefined) return priceUSD;

      priceUSD = currentPrice[tokenId].usd;
    } else {
      const historyPrice = await coingecko.coins.history(tokenId, dayjs.unix(block.timestamp));
      if (historyPrice.market_data === undefined || historyPrice.market_data.current_price === undefined)
        return priceUSD;

      priceUSD = historyPrice.market_data.current_price.usd;
    }

    return priceUSD;
  },
  getPriceUSDByContract: async (platform, isCurrent, block, tokenAddress) => {
    let priceUSD = '0';
    if (isCurrent) {
      const currentPrice = await coingecko.simple.tokenPrice(platform, tokenAddress, 'usd');
      if (currentPrice[tokenAddress].usd === undefined) return priceUSD;

      priceUSD = currentPrice[tokenAddress].usd;
    } else {
      const coingeckoContractInfo = await coingecko.coins.contract(platform, tokenAddress);
      const historyPrice = await coingecko.coins.history(coingeckoContractInfo.id, dayjs.unix(block.timestamp));
      if (historyPrice.market_data === undefined || historyPrice.market_data.current_price === undefined)
        return priceUSD;

      priceUSD = historyPrice.market_data.current_price.usd;
    }

    return priceUSD;
  },
  simple: {
    price: async (ids, vsCurrencies) => {
      const normalizeIds = (Array.isArray(ids) ? ids : [ids]).join(',');
      const normalizeVsCurrencies = (Array.isArray(vsCurrencies) ? vsCurrencies : [vsCurrencies]).join(',');

      const resp = await axios.get(
        `${coingecko.apiUrl}/simple/price?ids=${normalizeIds}&vs_currencies=${normalizeVsCurrencies}`
      );

      return resp.data;
    },
    tokenPrice: async (id, contractAddresses, vsCurrencies) => {
      const normalizeContractAddresses = (
        Array.isArray(contractAddresses) ? contractAddresses : [contractAddresses]
      ).join(',');
      const normalizeVsCurrencies = (Array.isArray(vsCurrencies) ? vsCurrencies : [vsCurrencies]).join(',');

      const resp = await axios.get(
        `${coingecko.apiUrl}/simple/token_price/${id}?contract_addresses=${normalizeContractAddresses}&vs_currencies=${normalizeVsCurrencies}`
      );

      return resp.data;
    },
  },
  coins: {
    contract: async (id, contractAddress) => {
      const resp = await axios.get(`${coingecko.apiUrl}/coins/${id}/contract/${contractAddress}`);

      return resp.data;
    },
    history: async (id, date) => {
      const normalizeDate =
        typeof date === 'string'
          ? date
          : dayjs.isDayjs(date)
          ? date.format('DD-MM-YYYY')
          : dayjs(date).format('DD-MM-YYYY');

      const resp = await axios.get(`${coingecko.apiUrl}/coins/${id}/history?date=${normalizeDate}`);

      return resp.data;
    },
  },
  platformByEthereumNetwork(network) {
    return ethereumNetworkCoingeckoPlatformsMap[network.toString()];
  },
};

module.exports = {
  coingecko,
};

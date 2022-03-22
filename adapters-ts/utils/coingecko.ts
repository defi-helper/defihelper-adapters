import { AxiosError } from "axios";
import * as base from "./ethereum/base";
import { dayjs, axios } from "../lib";

export function isAvailablePlatform(
  chainId: number
): chainId is keyof typeof CoingeckoProvider.platformMap {
  return Object.hasOwnProperty.call(CoingeckoProvider.platformMap, chainId);
}

const errorHandler = (e: AxiosError) => {
  const { method, url } = e.config;
  throw new Error(`coingecko ${method} ${url}: ${e}`);
};

export class CoingeckoProvider {
  static DEFAULT_API_URL = "https://coingecko.defihelper.io/api/v3";

  static platformMap = {
    1: "ethereum",
    56: "binance-smart-chain",
    128: "huobi-token",
    137: "polygon-pos",
    250: "fantom",
    1285: "moonriver",
    43114: "avalanche",
  };

  constructor(
    public readonly network: {
      block: { timestamp: number };
      blockTag: base.BlockNumber;
    },
    public readonly apiURL = CoingeckoProvider.DEFAULT_API_URL,
    public platform: string = CoingeckoProvider.platformMap[1]
  ) {}

  initPlatform(chainId: number) {
    if (!isAvailablePlatform(chainId)) {
      throw new Error(`Chain "${chainId}" not supported`);
    }

    this.platform = CoingeckoProvider.platformMap[chainId];

    return this;
  }

  async price(id: string) {
    if (this.network.blockTag === "latest") {
      const { data } = await axios
        .get(`${this.apiURL}/simple/price?ids=${id}&vs_currencies=usd`)
        .catch(errorHandler);
      if (typeof data[id] !== "object" || data[id].usd === undefined) {
        throw new Error(`Price for "coingecko:${id}" not resolved`);
      }

      return data[id].usd;
    } else {
      const date = dayjs(this.network.block.timestamp).format("DD-MM-YYYY");
      const { data } = await axios
        .get(`${this.apiURL}/coins/${id}/history?date=${date}`)
        .catch(errorHandler);
      if (
        data.market_data === undefined ||
        data.market_data.current_price === undefined ||
        data.market_data.current_price.usd === undefined
      ) {
        throw new Error(`Price for "coingecko:${id}" not resolved`);
      }

      return data.market_data.current_price.usd;
    }
  }

  async contractPrice(address: string) {
    address = address.toLowerCase();

    if (this.network.blockTag === "latest") {
      const { data } = await axios
        .get(
          `${this.apiURL}/simple/token_price/${this.platform}?contract_addresses=${address}&vs_currencies=usd`
        )
        .catch(errorHandler);
      if (
        typeof data !== "object" ||
        data[address] === undefined ||
        data[address].usd === undefined
      ) {
        throw new Error(`Price for "coingecko:${address}" not resolved`);
      }

      return data[address].usd;
    } else {
      const { data: contractInfo } = await axios
        .get(`${this.apiURL}/coins/${this.platform}/contract/${address}`)
        .catch(errorHandler);
      if (typeof contractInfo !== "object" || contractInfo.id === undefined) {
        throw new Error(`Contract id for "coingecko:${address}" not resolved`);
      }

      return this.price(contractInfo.id);
    }
  }
}

export type IdAlias = { id: string };
export type AddressAlias = {
  network: number;
  address: string;
};

export type Alias = IdAlias | AddressAlias;

function isIdAlias(alias: Alias): alias is IdAlias {
  return Object.hasOwnProperty.call(alias, "id");
}

export function bridgeWrapperBuild(
  aliases: { [address: string]: Alias },
  blockTag: base.BlockNumber,
  block: { timestamp: number },
  network: number
) {
  return (address: string) => {
    const alias = aliases[address] ?? aliases[address.toLowerCase()];

    if (alias) {
      return isIdAlias(alias)
        ? new CoingeckoProvider({ block, blockTag }).price(alias.id)
        : new CoingeckoProvider({
            block,
            blockTag,
          })
            .initPlatform(alias.network)
            .contractPrice(alias.address);
    }

    return new CoingeckoProvider({ block, blockTag })
      .initPlatform(network)
      .contractPrice(address);
  };
}

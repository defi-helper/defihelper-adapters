import type BigNumber from "bignumber.js";
import { AxiosError } from "axios";
import * as base from "./ethereum/base";
import { bignumber as bn, dayjs, axios } from "../lib";
import { V2 as uniswap } from "../utils/ethereum/uniswap";
import * as ethereum from "../utils/ethereum/base";
import type ethersType from "ethers";
import * as erc20 from "../utils/ethereum/erc20";

export class PriceNotResolvedError extends Error {
  constructor(
    public readonly address: string,
    public readonly network: number
  ) {
    super(`Price "coingecko:${network}:${address}" not resolved`);
  }
}

export interface PriceFeed {
  (address: string): Promise<BigNumber>;
}

export function isAvailablePlatform(
  chainId: number
): chainId is keyof typeof CoingeckoProvider.platformMap {
  return Object.hasOwnProperty.call(CoingeckoProvider.platformMap, chainId);
}

const errorHandler = (e: AxiosError) => {
  const { method, url } = e.config;
  throw new Error(`coingecko ${method} ${url}: ${e}`);
};

export class UniswapV2RouterProvider {
  static routingMap = {
    1: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    10: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    25: "0xcd7d16fB918511BF7269eC4f48d61D79Fb26f918",
    56: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
    137: "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32",
    250: "0xF491e7B69E4244ad4002BC14e878a34207E38c29",
    42161: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
    1313161554: "0xA1B1742e9c32C7cAa9726d8204bD5715e3419861",
  };

  constructor(
    public readonly provider: ethersType.ethers.providers.Provider,
  ) {}

  async price(route: string[]) {
    console.info('network, ' + this.provider.getNetwork())
    const currentNetwork = await this.provider.getNetwork()
    const routerAddress = UniswapV2RouterProvider.routingMap[currentNetwork.chainId as keyof typeof UniswapV2RouterProvider.routingMap]
    if(!routerAddress) {
      throw new Error('no router configured for network ' + currentNetwork.chainId)
    }
    
    const router = uniswap.router.contract(this.provider, routerAddress);

    const decimals = await erc20
      .contract(this.provider, route[0])
      .decimals();

    const [, priceInStablecoin] = await router.getAmountsOut(
      ethereum.toBN(`1e${decimals}`),
      route
    );

    return priceInStablecoin.div(`1e6`);
  }
}

export class CoingeckoProvider {
  static DEFAULT_API_URL = "https://coingecko.defihelper.io/api/v3";

  static platformMap = {
    1: "ethereum",
    10: "optimistic-ethereum",
    56: "binance-smart-chain",
    128: "huobi-token",
    137: "polygon-pos",
    250: "fantom",
    1285: "moonriver",
    1284: "moonbeam",
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

    return this.setPlatform(CoingeckoProvider.platformMap[chainId]);
  }

  setPlatform(platform: string) {
    this.platform = platform;

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

      return new bn(data[id].usd);
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

      return new bn(data.market_data.current_price.usd);
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

      return new bn(data[address].usd);
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
export type UniswapRouterV2Alias = { route: string[] };
export type NetworkAlias = {
  network: number;
  address: string;
};
export type PlatformAlias = {
  platform: string;
  address: string;
};

export type Alias = IdAlias | NetworkAlias | PlatformAlias | UniswapRouterV2Alias;

function isIdAlias(alias: Alias): alias is IdAlias {
  return Object.hasOwnProperty.call(alias, "id");
}

function isNetworkAlias(alias: Alias): alias is NetworkAlias {
  return Object.hasOwnProperty.call(alias, "network");
}

function isUniswapRouterV2Alias(alias: Alias): alias is UniswapRouterV2Alias {
  return Object.hasOwnProperty.call(alias, "network");
}

export function bridgeWrapperBuild(
  aliases: { [address: string]: Alias },
  blockTag: base.BlockNumber,
  block: { timestamp: number },
  network: number,
  provider?: ethersType.ethers.providers.Provider,
): PriceFeed {
  return (address: string) => {
    const alias =
      aliases[address] ??
      aliases[address.toLowerCase()] ??
      Object.entries(aliases).find(
        ([aliasAddress]) =>
          aliasAddress.toLocaleLowerCase() === address.toLowerCase()
      )?.[1] ??
      null;

    if (alias) {
      if (isIdAlias(alias)) {
        return new CoingeckoProvider({ block, blockTag }).price(alias.id);
      } else if (isNetworkAlias(alias)) {
        return new CoingeckoProvider({
          block,
          blockTag,
        })
          .initPlatform(alias.network)
          .contractPrice(alias.address);
      } else if (isUniswapRouterV2Alias(alias)) {
        if(!provider) {
          throw new Error('You have to pass a provider before')
        }

        return new UniswapV2RouterProvider(provider)
          .price(alias.route)
      } else {
        return new CoingeckoProvider({
          block,
          blockTag,
        })
          .setPlatform(alias.platform)
          .contractPrice(alias.address);
      }
    }

    return new CoingeckoProvider({ block, blockTag })
      .initPlatform(network)
      .contractPrice(address)
      .catch((e) => {
        throw e instanceof Error
          ? new PriceNotResolvedError(address, network)
          : e;
      });
  };
}

import type BigNumber from "bignumber.js";
import { AxiosError } from "axios";
import * as base from "./ethereum/base";
import * as ethereum from "../utils/ethereum/base";
import { V2 as uniswap } from "../utils/ethereum/uniswap";
import type ethersType from "ethers";
import { CoingeckoProvider } from "./coingecko";

export class PriceNotResolvedError extends Error {
  constructor(
    public readonly address: string,
    public readonly network: number
  ) {
    super(`Price "uniswapRouterV2:${network}:${address}" not resolved`);
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
  throw new Error(`uniswapRouterV2 ${method} ${url}: ${e}`);
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

    const [, priceInStablecoin] = await router.getAmountsOut(
      ethereum.toBN(`1e${tokenDecimals}`),
      route
    );

    console.info(priceInStablecoin)

    return priceInStablecoin;
  }
}
import type ethersType from "ethers";
import type { Provider } from "@defihelper/ethers-multicall";
import type BN from "bignumber.js";
import { bignumber as bn } from "../../../../lib";
import * as ethereum from "../../base";
import * as erc20 from "../../erc20";
import abi from "./abi/pair.json";
import * as dfh from "../../../dfh";
import { debugo } from "../../../base";
import { bridgeWrapperBuild } from "../../../coingecko";

export { abi };

export const decimals = 18;

export const contract = ethereum.contract(abi);

export const multicallContract = ethereum.multicallContract(abi);

export class ConnectedPair extends erc20.ConnectedToken {
  static async fromContract(contract: ethereum.Contract) {
    const multicall = await contract.node.multicall;
    const [name, symbol, decimals] = await multicall.all([
      contract.multicall.name(),
      contract.multicall.symbol(),
      contract.multicall.decimals(),
    ]);

    return new ConnectedPair(name, symbol, decimals.toString(), contract);
  }

  static fromAddress(node: ethereum.Node, address: string) {
    return ConnectedPair.fromContract(node.contract(abi, address));
  }

  public readonly info = new Promise<{
    token0: erc20.ConnectedToken;
    token1: erc20.ConnectedToken;
    reserves: [erc20.TokenAmount, erc20.TokenAmount];
    totalSupply: erc20.TokenAmount;
  }>((resolve) => {
    this.contract.node.multicall.then(async (multicall) => {
      const [token0Address, token1Address, reserves, totalSupply] =
        await multicall.all(
          [
            this.contract.multicall.token0(),
            this.contract.multicall.token1(),
            this.contract.multicall.getReserves(),
            this.contract.multicall.totalSupply(),
          ],
          { blockTag: this.contract.node.blockNumber }
        );
      const [token0, token1] = await Promise.all([
        erc20.ConnectedToken.fromAddress(this.contract.node, token0Address),
        erc20.ConnectedToken.fromAddress(this.contract.node, token1Address),
      ]);

      resolve({
        token0,
        token1,
        reserves: [
          token0.amountInt(reserves[0].toString()),
          token1.amountInt(reserves[1].toString()),
        ],
        totalSupply: this.amountInt(totalSupply.toString()),
      });
    });
  });

  constructor(
    name: string,
    symbol: string,
    decimals: number,
    public readonly contract: ethereum.Contract
  ) {
    super(name, symbol, decimals, contract);
  }

  async price(token0Price: erc20.TokenAmount, token1Price: erc20.TokenAmount) {
    if (token0Price.token.decimals !== token1Price.token.decimals) {
      throw new Error("Tokens must be equal to calculate the price");
    }

    const {
      reserves: [token0Reserve, token1Reserve],
      totalSupply,
    } = await this.info;
    const reserve0 = token0Reserve.int.multipliedBy(token0Price.int);
    const reserve1 = token1Reserve.int.multipliedBy(token1Price.int);

    return reserve0.plus(reserve1).div(totalSupply.int);
  }

  async expandBalance(balance: erc20.TokenAmount) {
    const {
      token0,
      token1,
      reserves: [token0Reserve, token1Reserve],
      totalSupply,
    } = await this.info;

    return {
      token0: token0.amountInt(
        balance.int
          .multipliedBy(token0Reserve.int)
          .div(totalSupply.int)
          .toFixed(0)
      ),
      token1: token1.amountInt(
        balance.int
          .multipliedBy(token1Reserve.int)
          .div(totalSupply.int)
          .toFixed(0)
      ),
    };
  }
}

export const useTokensList =
  ({ pair }: { pair: ConnectedPair }) =>
  async () => {
    debugo({ _prefix: "tokensList", pair: pair.contract.contract.address });
    const { token0, token1 } = await pair.info;
    debugo({
      _prefix: "tokensList",
      token0: token0.address,
      token1: token1.address,
    });
    return [token0.address, token1.address];
  };

export class PairInfo {
  static async create(
    multicall: Provider,
    address: string,
    options = ethereum.defaultOptions()
  ) {
    const multicallPair = multicallContract(address);
    const [token0, token1, reserves, totalSupply] = await multicall.all(
      [
        multicallPair.token0(),
        multicallPair.token1(),
        multicallPair.getReserves(),
        multicallPair.totalSupply(),
      ],
      { blockTag: options.blockNumber }
    );
    const [token0Decimals, token1Decimals] = await multicall.all(
      [
        erc20.multicallContract(token0).decimals(),
        erc20.multicallContract(token1).decimals(),
      ],
      { blockTag: options.blockNumber }
    );

    return new PairInfo(
      address,
      token0.toLowerCase(),
      token0Decimals.toString(),
      new bn(reserves[0].toString()).div(`1e${token0Decimals}`).toString(10),
      token1.toLowerCase(),
      token1Decimals.toString(),
      new bn(reserves[1].toString()).div(`1e${token1Decimals}`).toString(10),
      new bn(totalSupply.toString()).div(`1e${decimals}`).toString()
    );
  }

  constructor(
    public readonly address: string,
    public readonly token0: string,
    public readonly token0Decimals: number,
    public readonly reserve0: string,
    public readonly token1: string,
    public readonly token1Decimals: number,
    public readonly reserve1: string,
    public readonly totalSupply: string
  ) {}

  expandBalance(balance: BN | string | number) {
    return {
      token0: new bn(balance).multipliedBy(this.reserve0).div(this.totalSupply),
      token1: new bn(balance).multipliedBy(this.reserve1).div(this.totalSupply),
    };
  }

  calcPrice(
    token0Price: BN | string | number,
    token1Price: BN | string | number
  ) {
    const reserve0 = new bn(this.reserve0).multipliedBy(token0Price);
    const reserve1 = new bn(this.reserve1).multipliedBy(token1Price);
    return reserve0.plus(reserve1).div(this.totalSupply);
  }
}

export const usePriceUSD =
  ({ pair, network }: { pair: PairInfo; network: number }) =>
  async () => {
    debugo({
      _prefix: "usePriceUSD",
      pair: pair.address,
      network,
    });
    const priceFeed = bridgeWrapperBuild(
      await dfh.getPriceFeeds(network),
      "latest",
      { timestamp: 0 },
      network
    );

    const [token0PriceUSD, token1PriceUSD] = await Promise.all([
      priceFeed(pair.token0),
      priceFeed(pair.token1),
    ]);
    debugo({
      token0PriceUSD,
      token1PriceUSD,
    });
    return pair.calcPrice(token0PriceUSD, token1PriceUSD).toString(10);
  };

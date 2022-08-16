import type { Provider } from "@defihelper/ethers-multicall";
import type BN from "bignumber.js";
import { bignumber as bn } from "../../../../lib";
import * as base from "../../base";
import * as erc20 from "../../erc20";
import abi from "./abi/pair.json";

export { abi };

export const decimals = 18;

export const contract = base.contract(abi);

export const multicallContract = base.multicallContract(abi);

export class PairInfo {
  static async create(
    multicall: Provider,
    address: string,
    options = base.defaultOptions()
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

  predictUnresolvedTokenPrice(
    tokenIndex: 1 | 0,
    knownSidePrice: BN
  ): BN {
    const realReservesToken0 = new bn(this.reserve0).div(`1e${this.token0Decimals}`);
    const realReservesToken1 = new bn(this.reserve1).div(`1e${this.token1Decimals}`);
    const totalReserves = realReservesToken0.plus(realReservesToken1)

    const token0ReservesPiePercentage = new bn(100).minus(
      (tokenIndex === 0 ? realReservesToken1 : realReservesToken0)
        .div(totalReserves).multipliedBy(100)
    )
    return knownSidePrice.multipliedBy(token0ReservesPiePercentage.div(100))
  }
}

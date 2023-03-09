import type ethersType from "ethers";
import { ethers, axios } from "../../../../lib";
import BN from "bignumber.js";
import * as ethereum from "../../../ethereum/base";
import swapRouterABI from "./abi/swapRouter.json";
import quoterABI from "./abi/quoter.json";
import { ConnectedToken, TokenAmount } from "../../erc20";

export const pathWithFees = (path: string[], fee: number) =>
  path
    .reduce<Array<string | number>>((res, token) => [...res, token, fee], [])
    .slice(0, -1);

export const packPath = (path: Array<string | number>) =>
  ethers.utils.solidityPack(
    path.map((v) => (typeof v === "string" ? "address" : "uint24")),
    path
  );

export class SwapRouter {
  static fromContract(router: ethereum.Contract, quoter: ethereum.Contract) {
    return new SwapRouter(router, quoter);
  }

  static fromAddress(node: ethereum.Node, router: string, quoter: string) {
    return SwapRouter.fromContract(
      node.contract(swapRouterABI, router),
      node.contract(quoterABI, quoter)
    );
  }

  constructor(
    public readonly router: ethereum.Contract,
    public readonly quoter: ethereum.Contract
  ) {}

  amountOut(path: Array<string | number>, amountIn: BN | string | number) {
    return this.quoter.contract.callStatic
      .quoteExactInput(packPath(path), new BN(amountIn).toFixed(0))
      .then((v: ethersType.BigNumber) => new BN(v.toString()));
  }
}

export class AutoRoute {
  constructor(public readonly url: string, public readonly network: number) {}

  route(
    from: ConnectedToken,
    to: ConnectedToken,
    amount: TokenAmount
  ): Promise<Array<string | number> | Error> {
    const query = Object.entries({
      inToken: from.address,
      inDecimals: from.decimals,
      outToken: to.address,
      outDecimals: to.decimals,
      amount: amount.toString(),
    })
      .map(([k, v]) => `${k}=${v}`)
      .join("&");
    return axios
      .get<Array<string | number>>(`${this.url}/${this.network}?${query}`)
      .then(({ data }) => data)
      .catch((e) => e);
  }
}

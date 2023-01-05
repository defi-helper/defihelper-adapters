import type ethersType from "ethers";
import { dayjs, ethers } from "../../../../lib";
import BN from "bignumber.js";
import * as ethereum from "../../../ethereum/base";
import swapRouterABI from "./abi/swapRouter.json";
import quoterABI from "./abi/quoter.json";

export const pathWithFees = (path: string[], fee: number) =>
  path
    .reduce<Array<string | number>>((res, token) => [...res, token, fee], [])
    .slice(0, -1);

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
      .quoteExactInput(
        ethers.utils.solidityPack(
          path.map((v) => (typeof v === "string" ? "address" : "uint24")),
          path
        ),
        new BN(amountIn).toFixed(0)
      )
      .then((v: ethersType.BigNumber) => new BN(v.toString()));
  }
}

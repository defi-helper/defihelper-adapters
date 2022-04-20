import type { Contract, providers, Signer } from "ethers";
import type BN from "bignumber.js";
import { ethers } from "../../../../lib";
import quoterABI from "./abi/quoter.json";
import { toBN } from "../../base";

export class Quoter {
  static address = "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6";

  public readonly contract: Contract;

  constructor(provider: providers.Provider | Signer) {
    this.contract = new ethers.Contract(Quoter.address, quoterABI, provider);
  }

  exactInput(path: string[], amountIn: BN) {
    return this.contract.callStatic
      .quoteExactInput(path, amountIn.toFixed(0))
      .then(toBN);
  }

  exactOutput(path: string[], amountOut: BN) {
    return this.contract.callStatic
      .quoteExactOutput(path, amountOut.toFixed(0))
      .then(toBN);
  }
}

import type { Contract, ContractTransaction, providers, Signer } from "ethers";
import { ethers } from "../../../../lib";
import { FeeAmount, ZeroAddress } from "./constants";
import factoryABI from "./abi/factory.json";
import { Pool } from "./pool";

export class Factory {
  static address = "0x1F98431c8aD98523631AE4a59f267346ea31F984";

  public readonly contract: Contract;

  constructor(provider: providers.Provider | Signer) {
    this.contract = new ethers.Contract(Factory.address, factoryABI, provider);
  }

  async getPool(token0: string, token1: string, fee: FeeAmount) {
    const poolAddress = await this.contract.getPool(token0, token1, fee);
    if (poolAddress === ZeroAddress) return null;

    return new Pool(
      poolAddress,
      this.contract.signer ?? this.contract.provider
    );
  }

  async createPool(token0: string, token1: string, fee: FeeAmount) {
    const duplicate = await this.getPool(token0, token1, fee);
    if (duplicate !== null) return duplicate;

    const receipt = await this.contract
      .createPool(token0, token1, fee)
      .then((tx: ContractTransaction) => tx.wait());
    const poolAddress = receipt.events[0].args[4];

    return new Pool(
      poolAddress,
      this.contract.signer ?? this.contract.provider
    );
  }
}

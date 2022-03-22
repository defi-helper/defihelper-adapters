import type { Contract, BigNumber, ContractTransaction } from "ethers";
import type { Provider } from "@defihelper/ethers-multicall";
import * as base from "./base";
import type BN from "bignumber.js";
import { bignumber as bn } from "../../lib";
import abi from "./abi/erc20.json";
import { defaultOptions } from "./base";

export { abi };

export const contract = base.contract(abi);

export const multicallContract = base.multicallContract(abi);

export async function info(
  multicall: Provider,
  address: string,
  options = defaultOptions()
) {
  const token = multicallContract(address);
  const [name, symbol, decimals, totalSupply] = await multicall.all(
    [token.name(), token.symbol(), token.decimals(), token.totalSupply()],
    { blockTag: options.blockNumber }
  );

  return {
    name,
    symbol,
    decimals: decimals.toString(),
    totalSupply: totalSupply.toString(),
  };
}

export async function approveAll(
  erc20: Contract,
  owner: string,
  spender: string,
  value: BN | number | string
) {
  const allowance = await erc20
    .allowance(owner, spender)
    .then((v: BigNumber) => v.toString());
  if (new bn(allowance).isGreaterThanOrEqualTo(value)) return;
  if (new bn(allowance).isGreaterThan(0)) {
    await erc20
      .approve(spender, "0")
      .then((tx: ContractTransaction) => tx.wait());
  }

  return erc20
    .approve(spender, new bn(2).pow(256).minus(1).toFixed(0))
    .then((tx: ContractTransaction) => tx.wait());
}

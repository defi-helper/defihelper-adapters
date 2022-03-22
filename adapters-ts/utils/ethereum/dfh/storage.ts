import type { Signer, providers } from "ethers";
import { ethers, ethersMulticall } from "../../../lib";
import abi from "./abi/storage.json";

export { abi };

export function contract(
  provider: Signer | providers.Provider,
  address: string
) {
  return new ethers.Contract(address, abi, provider);
}

export function multicallContract(address: string) {
  return new ethersMulticall.Contract(address, abi);
}

export function key(k: string) {
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(k));
}

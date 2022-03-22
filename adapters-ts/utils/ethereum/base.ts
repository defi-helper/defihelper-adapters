import type { Signer, providers, BigNumber } from "ethers";
import { bignumber as bn, ethers, ethersMulticall } from "../../lib";

export type BlockNumber = "latest" | number;

export type Options = {
  blockNumber: BlockNumber;
  signer: Signer | null;
};

export const defaultOptions = (): Options => ({
  blockNumber: "latest",
  signer: null,
});

export const contract =
  (abi: any) => (provider: Signer | providers.Provider, address: string) =>
    new ethers.Contract(address, abi, provider);

export const multicallContract = (abi: any) => (address: string) =>
  new ethersMulticall.Contract(address, abi);

export const getAvgBlockTime = async (
  provider: providers.Provider,
  blockNumber: BlockNumber
) => {
  const interval = 30000;
  const currentBlockNumber =
    blockNumber === "latest" ? await provider.getBlockNumber() : blockNumber;
  const [fiftyBlockEarlier, currentBlock] = await Promise.all([
    provider.getBlock(currentBlockNumber - interval),
    provider.getBlock(currentBlockNumber),
  ]);

  return (
    (1000 * (currentBlock.timestamp - fiftyBlockEarlier.timestamp)) /
    (currentBlock.number - fiftyBlockEarlier.number)
  );
};

export function toBN(v: BigNumber) {
  return new bn(v.toString());
}

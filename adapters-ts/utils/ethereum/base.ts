import type { Provider as MulticallProvider } from "@defihelper/ethers-multicall";
import ethersType from "ethers";
import { bignumber as bn, ethers, ethersMulticall } from "../../lib";

export type BlockNumber = "latest" | number;

export type ProviderOrSigner =
  | ethersType.providers.Provider
  | ethersType.Signer;

export class Node {
  chainId = new Promise<number>((resolve) => {
    this.provider.getNetwork().then((v) => resolve(v.chainId));
  });

  multicall = new Promise<MulticallProvider>((resolve) => {
    this.chainId.then((chainId) => {
      resolve(new ethersMulticall.Provider(this.provider, chainId));
    });
  });

  constructor(
    public readonly provider: ethersType.providers.Provider,
    public readonly blockNumber: BlockNumber = "latest"
  ) {}

  contract(abi: any, address: string) {
    return new Contract(this, new ethers.Contract(address, abi, this.provider));
  }
}

export class Signer extends Node {
  constructor(public readonly signer: ethersType.Signer) {
    if (!signer.provider) throw new Error("Invalid signer");
    super(signer.provider);
  }

  contract(abi: any, address: string) {
    return super.contract(abi, address).sign(this);
  }
}

export class Contract {
  constructor(
    public readonly node: Node,
    public readonly contract: ethersType.Contract
  ) {}

  get multicall() {
    return new ethersMulticall.Contract(
      this.contract.address,
      JSON.parse(
        this.contract.interface.format(ethers.utils.FormatTypes.json) as string
      )
    );
  }

  sign(signer: Signer) {
    return new SignedContract(signer, this.contract);
  }
}

export class SignedContract extends Contract {
  constructor(
    public readonly signer: Signer,
    public readonly contract: ethersType.Contract
  ) {
    super(signer, contract.connect(signer.signer));
  }
}

export type Options = {
  blockNumber: BlockNumber;
  signer: ethersType.Signer | null;
};

export const defaultOptions = (): Options => ({
  blockNumber: "latest",
  signer: null,
});

export const contract =
  (abi: any) => (provider: ProviderOrSigner, address: string) =>
    new ethers.Contract(address, abi, provider);

export const multicallContract = (abi: any) => (address: string) =>
  new ethersMulticall.Contract(address, abi);

export const getAvgBlockTime = async (
  provider: ethersType.providers.Provider,
  blockNumber: BlockNumber
) => {
  const interval = 30000;
  const currentBlockNumber =
    blockNumber === "latest" ? await provider.getBlockNumber() : blockNumber;
  const [fiftyBlockEarlier, currentBlock] = await Promise.all([
    provider.getBlock(currentBlockNumber - interval),
    provider.getBlock(currentBlockNumber),
  ]);
  if (currentBlock === null) {
    throw new Error(`Invalid block: ${currentBlockNumber}`);
  }
  if (fiftyBlockEarlier === null) {
    throw new Error(`Invalid block: ${currentBlockNumber - interval}`);
  }

  return (
    (1000 * (currentBlock.timestamp - fiftyBlockEarlier.timestamp)) /
    (currentBlock.number - fiftyBlockEarlier.number)
  );
};

export function toBN(v: ethersType.BigNumber | number | string) {
  return new bn(v.toString());
}

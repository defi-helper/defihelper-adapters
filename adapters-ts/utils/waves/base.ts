import type { Signer } from "@waves/signer";

export const nodes: Record<number, string> = {
  87: "https://nodes.wavesnodes.com",
  84: "https://nodes-testnet.wavesnodes.com",
  83: "https://nodes-stagenet.wavesnodes.com",
};

export type Options = {
  node: string;
  signer?: Signer;
};

export const defaultOptions = (): Options => ({
  node: nodes[87],
});

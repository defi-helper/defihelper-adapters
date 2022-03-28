export const nodes = {
  87: "https://nodes.wavesnodes.com",
  84: "https://nodes-testnet.wavesnodes.com",
  83: "https://nodes-stagenet.wavesnodes.com",
};

export type Options = {
  node: string;
};

export const defaultOptions = (): Options => ({
  node: nodes[87],
});

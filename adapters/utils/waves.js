const nodes = {
  87: 'https://nodes.wavesnodes.com',
  84: 'https://nodes-testnet.wavesnodes.com',
  83: 'https://nodes-stagenet.wavesnodes.com',
};

const waves = {
  defaultOptions: () => ({
    node: 'https://nodes.wavesexplorer.com',
  }),
  nodes: {
    ...nodes,
    main: nodes[87],
    testnet: nodes[84],
    stagenet: nodes[83],
  },
};

module.exports = {
  waves,
};

const { ethersMulticall } = require('../lib');

const cache = new Map();

async function multicall(provider, network) {
  if (!cache.has(provider)) {
    const multicallProvider = new ethersMulticall.Provider(provider, network);
    if (typeof network !== 'number') await multicallProvider.init();
    cache.set(provider, multicallProvider);
  }

  return cache.get(provider);
}

function all(provider, network, calls, options) {
  return multicall(provider, network).then((multicall) => multicall.all(calls, options));
}

module.exports = {
  multicall,
  all,
};

const { migration } = require('../utils');

module.exports = migration(async ({ utils: { dfhNetwork, read, execute } }) => {
  const { GovernorMultisig } = dfhNetwork();

  if ((await read('pancakeswapMasterChefLpRestake', {}, 'owner')) === GovernorMultisig.address) {
    return;
  }

  await execute('pancakeswapMasterChefLpRestake', {}, 'transferOwnership', GovernorMultisig.address);
});
module.exports.tags = ['GovernanceOwner', 'PancakeSwap'];

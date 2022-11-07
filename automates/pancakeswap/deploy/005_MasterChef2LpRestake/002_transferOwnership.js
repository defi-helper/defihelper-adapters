const { migration } = require('../utils');

module.exports = migration(async ({ utils: { dfhNetwork, read, execute } }) => {
  const { GovernorMultisig, Timelock } = dfhNetwork();
  const owner = GovernorMultisig ?? Timelock;

  if ((await read('pancakeswapMasterChef2LpRestake', {}, 'owner')) === owner.address) {
    return;
  }

  await execute('pancakeswapMasterChef2LpRestake', {}, 'transferOwnership', owner.address);
});
module.exports.tags = ['GovernanceOwner', 'PancakeSwap'];

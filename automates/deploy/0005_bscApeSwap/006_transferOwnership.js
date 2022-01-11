const { migration } = require('../utils');

module.exports = migration(async ({ utils: { dfhNetwork, read, execute } }) => {
  const { GovernorMultisig } = dfhNetwork();

  if ((await read('bscApeSwapMasterChefLpRestake', {}, 'owner')) === GovernorMultisig.address) {
    return;
  }

  await execute('bscApeSwapMasterChefLpRestake', {}, 'transferOwnership', GovernorMultisig.address);
});
module.exports.tags = ['GovernanceOwner', 'ApeSwap'];

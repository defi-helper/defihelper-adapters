const { migration } = require('../utils');

module.exports = migration(async ({ utils: { dfhNetwork, read, execute } }) => {
  const { GovernorMultisig } = dfhNetwork();

  if ((await read('bscApeSwapApeRewardV4Restake', {}, 'owner')) === GovernorMultisig.address) {
    return;
  }

  await execute('bscApeSwapApeRewardV4Restake', {}, 'transferOwnership', GovernorMultisig.address);
});
module.exports.tags = ['GovernanceOwner', 'ApeSwap'];

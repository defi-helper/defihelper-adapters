const { migration } = require('../utils');

module.exports = migration(async ({ utils: { dfhNetwork, read, execute } }) => {
  const { GovernorMultisig } = dfhNetwork();

  if ((await read('bscApeRewardV4Restake', {}, 'owner')) === GovernorMultisig.address) {
    return;
  }

  await execute('bscApeRewardV4Restake', {}, 'transferOwnership', GovernorMultisig.address);
});
module.exports.tags = ['GovernanceOwner', 'ApeSwap'];

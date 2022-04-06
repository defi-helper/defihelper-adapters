const { migration } = require('./utils');

module.exports = migration(async ({ utils: { dfhNetwork, read, execute } }) => {
  const { GovernorMultisig } = dfhNetwork();

  if ((await read('bscApeSwap2ApeRewardV4Restake', {}, 'owner')) === GovernorMultisig.address) {
    return;
  }

  await execute('bscApeSwap2ApeRewardV4Restake', {}, 'transferOwnership', GovernorMultisig.address);
});
module.exports.tags = ['GovernanceOwner', 'ApeSwap'];

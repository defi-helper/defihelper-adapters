const { migration } = require('./utils');

module.exports = migration(async ({ utils: { dfhNetwork, read, execute } }) => {
  const { GovernorMultisig } = dfhNetwork();

  if ((await read('moonriverHuckleberry2MasterChefFinnLpRestake', {}, 'owner')) === GovernorMultisig.address) {
    return;
  }

  await execute('moonriverHuckleberry2MasterChefFinnLpRestake', {}, 'transferOwnership', GovernorMultisig.address);
});
module.exports.tags = ['GovernanceOwner', 'Moonriver'];

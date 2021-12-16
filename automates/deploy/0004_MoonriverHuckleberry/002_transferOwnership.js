const { migration } = require('../utils');

module.exports = migration(async ({ utils: { dfhNetwork, read, execute } }) => {
  const { GovernorMultisig } = dfhNetwork();

  if ((await read('moonriverHuckleberryMasterChefFinnLpRestake', {}, 'owner')) === GovernorMultisig.address) {
    return;
  }

  await execute('moonriverHuckleberryMasterChefFinnLpRestake', {}, 'transferOwnership', GovernorMultisig.address);
});
module.exports.tags = ['GovernanceOwner', 'Moonriver'];

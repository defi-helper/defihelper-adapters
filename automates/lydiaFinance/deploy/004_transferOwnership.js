const { migration } = require('./utils');

module.exports = migration(async ({ utils: { dfhNetwork, read, execute } }) => {
  const { GovernorMultisig } = dfhNetwork();

  if ((await read('CroesusLpRestake', {}, 'owner')) === GovernorMultisig.address) {
    return;
  }

  await execute('CroesusLpRestake', {}, 'transferOwnership', GovernorMultisig.address);
});
module.exports.tags = ['GovernanceOwner', 'LydiaFinance'];

const { migration } = require('./utils');

module.exports = migration(async ({ utils: { dfhNetwork, read, execute } }) => {
  const { GovernorMultisig } = dfhNetwork();

  if ((await read('avaxLydiaFinanceCroesusLpRestake', {}, 'owner')) === GovernorMultisig.address) {
    return;
  }

  await execute('avaxLydiaFinanceCroesusLpRestake', {}, 'transferOwnership', GovernorMultisig.address);
});
module.exports.tags = ['GovernanceOwner', 'LydiaFinance'];

const { migration } = require('./utils');

module.exports = migration(async ({ utils: { dfhNetwork, read, execute } }) => {
  const { GovernorMultisig } = dfhNetwork();

  if ((await read('lydiaFinanceCroesusLpRestake', {}, 'owner')) === GovernorMultisig.address) {
    return;
  }

  await execute('lydiaFinanceCroesusLpRestake', {}, 'transferOwnership', GovernorMultisig.address);
});
module.exports.tags = ['GovernanceOwner', 'LydiaFinance'];

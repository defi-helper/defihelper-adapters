const { migration } = require('./utils');

module.exports = migration(async ({ utils: { dfhNetwork, read, execute } }) => {
  const { GovernorMultisig } = dfhNetwork();

  if ((await read('avaxLydiaFinanceCroesusSingleRestake', {}, 'owner')) === GovernorMultisig.address) {
    return;
  }

  await execute('avaxLydiaFinanceCroesusSingleRestake', {}, 'transferOwnership', GovernorMultisig.address);
});
module.exports.tags = ['GovernanceOwner', 'LydiaFinance'];

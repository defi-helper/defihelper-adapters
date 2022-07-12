const { migration } = require('./utils');

module.exports = migration(async ({ utils: { dfhNetwork, read, execute } }) => {
  const { GovernorMultisig } = dfhNetwork();

  if ((await read('CroesusSingleRestake', {}, 'owner')) === GovernorMultisig.address) {
    return;
  }

  await execute('CroesusSingleRestake', {}, 'transferOwnership', GovernorMultisig.address);
});
module.exports.tags = ['GovernanceOwner', 'LydiaFinance'];

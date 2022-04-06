const { migration } = require('./utils');

module.exports = migration(async ({ utils: { dfhNetwork, read, execute } }) => {
  const { GovernorMultisig } = dfhNetwork();

  if ((await read('avaxTraderjoe2MasterChefV2LpRestake', {}, 'owner')) === GovernorMultisig.address) {
    return;
  }

  await execute('avaxTraderjoe2MasterChefV2LpRestake', {}, 'transferOwnership', GovernorMultisig.address);
});
module.exports.tags = ['GovernanceOwner', 'AvaxTraderjoe'];

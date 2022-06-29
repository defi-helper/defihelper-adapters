const { migration } = require('./utils');

module.exports = migration(async ({ utils: { dfhNetwork, read, execute } }) => {
  const { GovernorMultisig } = dfhNetwork();

  if ((await read('avaxTraderjoeMasterChefV2SingleRestake', {}, 'owner')) === GovernorMultisig.address) {
    return;
  }

  await execute('avaxTraderjoeMasterChefV2SingleRestake', {}, 'transferOwnership', GovernorMultisig.address);
});
module.exports.tags = ['GovernanceOwner', 'AvaxTraderjoe'];

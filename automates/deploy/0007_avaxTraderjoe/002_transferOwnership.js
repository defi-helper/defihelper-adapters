const { migration } = require('../utils');

module.exports = migration(async ({ utils: { dfhNetwork, read, execute } }) => {
  const { GovernorMultisig } = dfhNetwork();

  if ((await read('avaxTraderjoeMasterChefV3LpRestake', {}, 'owner')) === GovernorMultisig.address) {
    return;
  }

  await execute('avaxTraderjoeMasterChefV3LpRestake', {}, 'transferOwnership', GovernorMultisig.address);
});
module.exports.tags = ['GovernanceOwner', 'AvaxTraderjoe'];

const { migration } = require('./utils');

module.exports = migration(async ({ utils: { dfhNetwork, read, execute } }) => {
  const { GovernorMultisig } = dfhNetwork();

  if ((await read('avaxTraderjoeBoostedMasterChefJoeLpRestake', {}, 'owner')) === GovernorMultisig.address) {
    return;
  }

  await execute('avaxTraderjoeBoostedMasterChefJoeLpRestake', {}, 'transferOwnership', GovernorMultisig.address);
});
module.exports.tags = ['GovernanceOwner', 'AvaxTraderjoe'];

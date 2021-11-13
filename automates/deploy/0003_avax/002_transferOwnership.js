const { migration } = require('../utils');

module.exports = migration(async ({ utils: { dfhNetwork, read, execute } }) => {
  const { GovernorMultisig } = dfhNetwork();

  if ((await read('avaxSmartcoinMasterChefJoeLpRestake', {}, 'owner')) === GovernorMultisig.address) {
    return;
  }

  await execute('avaxSmartcoinMasterChefJoeLpRestake', {}, 'transferOwnership', GovernorMultisig.address);
});
module.exports.tags = ['GovernanceOwner', 'Avax'];

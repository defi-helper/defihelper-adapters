const { migration } = require('../utils');

module.exports = migration(async ({ utils: { dfhNetwork, read, execute } }) => {
  const { GovernorMultisig } = dfhNetwork();

  if ((await read('avaxMasterChefJoeLpRestake', {}, 'owner')) === GovernorMultisig.address) {
    return;
  }

  await execute('avaxMasterChefJoeLpRestake', {}, 'transferOwnership', GovernorMultisig.address);
});
module.exports.tags = ['GovernanceOwner', 'Avax'];

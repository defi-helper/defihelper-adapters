const { migration } = require('../utils');

module.exports = migration(async ({ utils: { dfhNetwork, read, execute } }) => {
  const { Timelock, GovernorMultisig } = dfhNetwork();
  const owner = Timelock ? Timelock.address : GovernorMultisig.address;

  if ((await read('mockEthAutomate', {}, 'owner')) === owner) {
    return;
  }

  await execute('mockEthAutomate', {}, 'transferOwnership', owner);
});
module.exports.tags = ['GovernanceOwner', 'Mock'];

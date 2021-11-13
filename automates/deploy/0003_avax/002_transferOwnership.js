const { migration } = require('../utils');

module.exports = migration(async ({ utils: { dfhNetwork, read, execute } }) => {
  const { Timelock } = dfhNetwork();

  if ((await read('avaxMasterChefJoeLpRestake', {}, 'owner')) === Timelock.address) {
    return;
  }

  await execute('avaxMasterChefJoeLpRestake', {}, 'transferOwnership', Timelock.address);
});
module.exports.tags = ['GovernanceOwner', 'Avax'];

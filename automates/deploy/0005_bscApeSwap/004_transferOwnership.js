const { migration } = require('../utils');

module.exports = migration(async ({ utils: { dfhNetwork, read, execute } }) => {
  const { GovernorMultisig } = dfhNetwork();

  if ((await read('bscApeMasterChefSingleRestake', {}, 'owner')) === GovernorMultisig.address) {
    return;
  }

  await execute('bscApeMasterChefSingleRestake', {}, 'transferOwnership', GovernorMultisig.address);
});
module.exports.tags = ['GovernanceOwner', 'ApeSwap'];

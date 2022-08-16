const { migration } = require('./utils');

module.exports = migration(async ({ utils: { dfhNetwork, read, execute } }) => {
  const { GovernorMultisig } = dfhNetwork();

  if ((await read('bscApeSwapMasterChefSingleRestake', {}, 'owner')) === GovernorMultisig.address) {
    return;
  }

  await execute('bscApeSwapMasterChefSingleRestake', {}, 'transferOwnership', GovernorMultisig.address);
});
module.exports.tags = ['GovernanceOwner', 'ApeSwap'];

const { migration } = require('./utils');

module.exports = migration(async ({ utils: { dfhNetwork, read, execute } }) => {
  const { GovernorMultisig } = dfhNetwork();

  if ((await read('bscApeSwap2MasterChefSingleRestake', {}, 'owner')) === GovernorMultisig.address) {
    return;
  }

  await execute('bscApeSwap2MasterChefSingleRestake', {}, 'transferOwnership', GovernorMultisig.address);
});
module.exports.tags = ['GovernanceOwner', 'ApeSwap'];

const { migration } = require('./utils');

module.exports = migration(async ({ utils: { dfhNetwork, read, execute } }) => {
  const { GovernorMultisig } = dfhNetwork();

  if ((await read('pancakeswap2SmartChefInitializableRestake', {}, 'owner')) === GovernorMultisig.address) {
    return;
  }

  await execute('pancakeswap2SmartChefInitializableRestake', {}, 'transferOwnership', GovernorMultisig.address);
});
module.exports.tags = ['GovernanceOwner', 'PancakeSwap'];

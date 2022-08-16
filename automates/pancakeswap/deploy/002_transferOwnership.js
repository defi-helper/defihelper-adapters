const { migration } = require('./utils');

module.exports = migration(async ({ utils: { dfhNetwork, read, execute } }) => {
  const { GovernorMultisig } = dfhNetwork();

  if ((await read('pancakeswapSmartChefInitializableRestake', {}, 'owner')) === GovernorMultisig.address) {
    return;
  }

  await execute('pancakeswapSmartChefInitializableRestake', {}, 'transferOwnership', GovernorMultisig.address);
});
module.exports.tags = ['GovernanceOwner', 'PancakeSwap'];

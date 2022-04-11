const { migration } = require('./utils');

module.exports = migration(async ({ utils: { dfhNetwork, read, execute } }) => {
  const { GovernorMultisig } = dfhNetwork();

  if ((await read('pancakeswapMasterChefSingleRestake', {}, 'owner')) === GovernorMultisig.address) {
    return;
  }

  await execute('pancakeswapMasterChefSingleRestake', {}, 'transferOwnership', GovernorMultisig.address);
});
module.exports.tags = ['GovernanceOwner', 'PancakeSwap'];

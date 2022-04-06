const { migration } = require('./utils');

module.exports = migration(async ({ utils: { dfhNetwork, read, execute } }) => {
  const { Timelock } = dfhNetwork();

  if ((await read('bondappetit2SynthetixUniswapLpRestake', {}, 'owner')) === Timelock.address) {
    return;
  }

  await execute('bondappetit2SynthetixUniswapLpRestake', {}, 'transferOwnership', Timelock.address);
});
module.exports.tags = ['GovernanceOwner', 'BondAppetit'];

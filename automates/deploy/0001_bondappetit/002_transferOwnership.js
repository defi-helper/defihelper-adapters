const { migration } = require('../utils');

module.exports = migration(async ({ utils: { dfhNetwork, read, execute } }) => {
  const { Timelock } = dfhNetwork();

  if ((await read('bondappetitSynthetixUniswapLpRestake', {}, 'owner')) === Timelock.address) {
    return;
  }

  await execute('bondappetitSynthetixUniswapLpRestake', {}, 'transferOwnership', Timelock.address);
});
module.exports.tags = ['GovernanceOwner', 'BondAppetit'];

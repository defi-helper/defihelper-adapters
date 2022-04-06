const { migration } = require('../utils');

module.exports = migration(async ({ utils: { dfhNetwork, read, execute } }) => {
  const { Timelock } = dfhNetwork();

  if ((await read('curve2GaugeUniswapClaim', {}, 'owner')) === Timelock.address) {
    return;
  }

  await execute('curve2GaugeUniswapClaim', {}, 'transferOwnership', Timelock.address);
});
module.exports.tags = ['GovernanceOwner', 'Curve'];

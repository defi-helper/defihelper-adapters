const { migration } = require('../utils');

module.exports = migration(async ({ utils: { dfhNetwork, read, execute } }) => {
  const { Timelock } = dfhNetwork();

  if ((await read('curveGaugeUniswapClaim', {}, 'owner')) === Timelock.address) {
    return;
  }

  await execute('curveGaugeUniswapClaim', {}, 'transferOwnership', Timelock.address);
});
module.exports.tags = ['GovernanceOwner', 'Curve'];

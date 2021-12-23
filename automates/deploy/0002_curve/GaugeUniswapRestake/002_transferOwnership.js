const { migration } = require('../../utils');

module.exports = migration(async ({ utils: { dfhNetwork, read, execute } }) => {
  const { Timelock } = dfhNetwork();

  if ((await read('curveGaugeUniswapRestake', {}, 'owner')) === Timelock.address) {
    return;
  }

  await execute('curveGaugeUniswapRestake', {}, 'transferOwnership', Timelock.address);
});
module.exports.tags = ['GovernanceOwner', 'Curve'];

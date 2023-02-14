const { migration } = require('../../../deploy/utils');

module.exports = migration(async ({ utils: { dfhNetwork, read, execute } }) => {
  const { GovernorMultisig, Timelock } = dfhNetwork();
  const owner = GovernorMultisig ?? Timelock;

  if ((await read('uniswap3Restake', {}, 'owner')) === owner.address) {
    return;
  }

  await execute('uniswap3Restake', {}, 'transferOwnership', owner.address);
});
module.exports.tags = ['GovernanceOwner', 'Uniswap3'];

const { migration } = require('../../../deploy/utils');

module.exports = migration(async ({ utils: { dfhNetwork, deploy, get } }) => {
  const { ERC1167, Storage } = dfhNetwork();
  const Rebalance = await get('uniswap3Rebalance');

  await deploy('uniswap3Restake', {
    contract: 'contracts/Restake.automate.sol:Restake',
    args: [Storage.address],
    libraries: {
      ERC1167: ERC1167.address,
      Rebalance: Rebalance.address
    },
  });
});
module.exports.tags = ['Automate', 'Uniswap3'];

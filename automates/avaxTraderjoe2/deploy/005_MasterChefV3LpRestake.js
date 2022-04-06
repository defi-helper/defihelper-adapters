const { migration } = require('./utils');

module.exports = migration(async ({ utils: { dfhNetwork, deploy } }) => {
  const { ERC1167, Storage } = dfhNetwork();

  await deploy('avaxTraderjoe2MasterChefV3LpRestake', {
    contract: 'contracts/MasterChefV3LpRestake.automate.sol:MasterChefV3LpRestake',
    args: [Storage.address],
    libraries: {
      ERC1167: ERC1167.address,
    },
  });
});
module.exports.tags = ['Automate', 'AvaxTraderjoe'];

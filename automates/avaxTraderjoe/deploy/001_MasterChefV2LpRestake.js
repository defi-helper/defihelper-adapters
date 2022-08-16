const { migration } = require('./utils');

module.exports = migration(async ({ utils: { dfhNetwork, deploy } }) => {
  const { ERC1167, Storage } = dfhNetwork();

  await deploy('avaxTraderjoeMasterChefV2LpRestake', {
    contract: 'contracts/MasterChefV2LpRestake.automate.sol:MasterChefV2LpRestake',
    args: [Storage.address],
    libraries: {
      ERC1167: ERC1167.address,
    },
  });
});
module.exports.tags = ['Automate', 'AvaxTraderjoe'];

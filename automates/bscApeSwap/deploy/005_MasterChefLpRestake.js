const { migration } = require('./utils');

module.exports = migration(async ({ utils: { dfhNetwork, deploy } }) => {
  const { ERC1167, Storage } = dfhNetwork();

  await deploy('bscApeSwapMasterChefLpRestake', {
    contract: 'contracts/MasterChefLpRestake.automate.sol:MasterChefLpRestake',
    args: [Storage.address],
    libraries: {
      ERC1167: ERC1167.address,
    },
  });
});
module.exports.tags = ['Automate', 'ApeSwap'];

const { migration } = require('./utils');

module.exports = migration(async ({ utils: { dfhNetwork, deploy } }) => {
  const { ERC1167, Storage } = dfhNetwork();

  await deploy('pancakeswapMasterChef2SingleRestake', {
    contract: 'contracts/MasterChef2SingleRestake.automate.sol:MasterChef2SingleRestake',
    args: [Storage.address],
    libraries: {
      ERC1167: ERC1167.address,
    },
  });
});
module.exports.tags = ['Automate', 'PancakeSwap'];

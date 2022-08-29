const { migration } = require('../utils');

module.exports = migration(async ({ utils: { dfhNetwork, deploy } }) => {
  const { ERC1167 } = dfhNetwork();

  await deploy('pancakeswapMasterChef2SingleRestake', {
    contract: 'contracts/MasterChef2SingleRestake.automate.sol:MasterChef2SingleRestake',
    args: ['0xBa4F0699c3B08a93E6EC359d8d487aafDe320ed8'],
    libraries: {
      ERC1167: ERC1167.address,
    },
  });
});
module.exports.tags = ['Automate', 'PancakeSwap'];

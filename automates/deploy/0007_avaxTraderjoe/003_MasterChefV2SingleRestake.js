const { migration } = require('../utils');

module.exports = migration(async ({ utils: { dfhNetwork, deploy } }) => {
  const { ERC1167, Storage } = dfhNetwork();

  await deploy('avaxTraderjoeMasterChefV2SingleRestake', {
    contract: 'automates/avaxTraderjoe/MasterChefV2SingleRestake.automate.sol:MasterChefV2SingleRestake',
    args: [Storage.address],
    libraries: {
      ERC1167: ERC1167.address,
    },
  });
});
module.exports.tags = ['Automate', 'AvaxTraderjoe'];

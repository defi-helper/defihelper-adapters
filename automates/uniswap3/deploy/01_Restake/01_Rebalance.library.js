const { migration } = require('../../../deploy/utils');

module.exports = migration(async ({ utils: { deploy } }) => {
  await deploy('uniswap3Rebalance', {
    contract: 'contracts/utils/UniswapV3/Rebalance.sol:Rebalance',
  });
});
module.exports.tags = ['Automate', 'Uniswap3'];

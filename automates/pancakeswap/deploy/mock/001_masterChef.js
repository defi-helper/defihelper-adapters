const { migration } = require('../utils');

module.exports = migration(async ({ utils: { deploy } }) => {
  await deploy('pancakeswapMasterChef2Mock', {
    contract: 'contracts/mock/MasterChef2Mock.sol:MasterChef2Mock',
    args: ['0xb181Ea0d2835Df254F8c9E6a0CDFC1024B6Aa3e8'], // goerli CAKE mock token
  });
});
module.exports.tags = ['Mock', 'PancakeSwap'];

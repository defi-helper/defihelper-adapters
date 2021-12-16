const { migration } = require('../utils');

module.exports = migration(async ({ utils: { deploy } }) => {
  await deploy('mockEthStaking', {
    contract: 'automates/mock/EthStaking.sol:EthStaking',
    args: ['0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846'], // ChainLink tokens in avalanche testnet
  });
});
module.exports.tags = ['Automate', 'Mock'];

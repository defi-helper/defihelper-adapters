const { masterChefConfigurable } = require('../utils');
const masterChefV1 = require('./abi/masterChefV1ABI.json');
const masterChefV1Pools = require('./abi/masterChiefV1Pools.json');

const masterChiefV1Address = '0x111E1E97435b57467E79d4930acc4B7EB3d478ad';

module.exports = {
  // For instance: 0x1A9Bd67c82C0e8E47C3ad2FA772FCb9B7A831A37
  masterChefV1: masterChefConfigurable(
    masterChiefV1Address,
    masterChefV1,
    masterChefV1Pools,
    {
      rewardTokenName: 'orca',
      rewardPerBlockFunctionName: 'rewardsPerSecond',
      rewardDebtPropertyName: 'rewardTokenDebt',
    },
    []
  ),
};

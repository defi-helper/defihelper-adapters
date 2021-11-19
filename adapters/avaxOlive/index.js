const { masterChefConfigurable } = require('../utils');
const masterChefV1 = require('./abi/masterChefV1ABI.json');
const masterChefV1Pools = require('./abi/masterChiefV1Pools.json');

const masterChiefV1Address = '0x5A9710f3f23053573301C2aB5024D0a43A461E80';

module.exports = {
  // For instance: 0x1A9Bd67c82C0e8E47C3ad2FA772FCb9B7A831A37
  masterChefV1: masterChefConfigurable(
    masterChiefV1Address,
    masterChefV1,
    masterChefV1Pools,
    {
      rewardTokenName: 'olive',
      rewardPerBlockFunctionName: 'olivePerBlock',
      rewardDebtPropertyName: 'rewardDebt',
    },
    []
  ),
};

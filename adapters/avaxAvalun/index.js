const { masterChefConfigurable } = require('../utils');
const masterChefV1 = require('./abi/masterChefV1ABI.json');
const masterChefV1Pools = require('./abi/masterChiefV1Pools.json');

const masterChiefV1Address = '0x9403B802dd7405d2ca4F501ec7A92c3a8b7051DE';

module.exports = {
  // For instance: 0xe72c5547B2C66436D4Cb9Fd674001027A0d83A46
  masterChefV1: masterChefConfigurable(
    masterChiefV1Address,
    masterChefV1,
    masterChefV1Pools,
    {
      rewardTokenName: 'luan',
      rewardPerBlockFunctionName: 'luanPerSec', //or reward per sec
      rewardDebtPropertyName: 'rewardDebt',
    },
    []
  ),
};

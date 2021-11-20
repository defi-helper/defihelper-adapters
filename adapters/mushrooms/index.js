const { masterChefConfigurable } = require('../utils');
const masterChefV1 = require('./abi/masterChefV1ABI.json');
const masterChefV1Pools = require('./abi/masterChiefV1Pools.json');

const masterChiefV1Address = '0xf8873a6080e8dbF41ADa900498DE0951074af577';

module.exports = {
  // For instance: 0xa283aA7CfBB27EF0cfBcb2493dD9F4330E0fd304
  masterChefV1: masterChefConfigurable(
    masterChiefV1Address,
    masterChefV1,
    masterChefV1Pools,
    {
      rewardTokenName: 'mm',
      rewardPerBlockFunctionName: 'mmPerBlock', //or reward per sec
      rewardDebtPropertyName: 'rewardDebt',
    },
    []
  ),
};

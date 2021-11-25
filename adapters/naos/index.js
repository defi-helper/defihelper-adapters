const { masterChefConfigurable } = require('../utils');
const masterChefV1 = require('./abi/masterChefV1ABI.json');
const masterChefV1Pools = require('./abi/masterChiefV1Pools.json');

const masterChiefV1Address = '0xc2EdaD668740f1aA35E4D8f227fB8E17dcA888Cd';

module.exports = {
  // For instance: 0x06da0fd433C1A5d7a4faa01111c044910A184553
  masterChefV1: masterChefConfigurable(
    masterChiefV1Address,
    masterChefV1,
    masterChefV1Pools,
    {
      rewardTokenName: 'sushi',
      rewardPerBlockFunctionName: 'sushiPerBlock', //or reward per sec
      rewardDebtPropertyName: 'rewardDebt',
    },
    []
  ),
};

const { masterChefConfigurable } = require('../utils');
const masterChefV1 = require('./abi/masterChefV1ABI.json');
const masterChefV1Pools = require('./abi/masterChiefV1Pools.json');

const masterChiefV1Address = '0xEC91B2808Ab778d8900634FD2811fD0Be07D9774';

module.exports = {
  // For instance: 0x951C8a8DEe33bd5039A71E7BD4244D5659CF1517
  masterChefV1: masterChefConfigurable(
    masterChiefV1Address,
    masterChefV1,
    masterChefV1Pools,
    {
      rewardTokenName: 'token',
      rewardPerBlockFunctionName: 'tokenPerSecond', //or reward per sec
      rewardDebtPropertyName: 'rewardDebt',
      isRewardPerSec: true,
    },
    []
  ),
};

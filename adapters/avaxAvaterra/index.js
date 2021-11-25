const { masterChefConfigurable } = require('../utils');
const masterChefV1 = require('./abi/masterChefV1ABI.json');
const masterChefV1Pools = require('./abi/masterChiefV1Pools.json');

const masterChiefV1Address = '0x74F53e67D68A348611979e3012EDf9781C437529';

module.exports = {
  // For instance: 0xe72c5547B2C66436D4Cb9Fd674001027A0d83A46
  masterChefV1: masterChefConfigurable(
    masterChiefV1Address,
    masterChefV1,
    masterChefV1Pools,
    {
      rewardTokenName: 'terra',
      rewardPerBlockFunctionName: 'terraPerSec', //or reward per sec
      rewardDebtPropertyName: 'rewardDebt',
    },
    []
  ),
};

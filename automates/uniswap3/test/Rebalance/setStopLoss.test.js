const { strictEqual } = require('assert');
const assertions = require('truffle-assertions');
const { ethers } = require('hardhat');
const utils = require('./utils');
const BN = require('bignumber.js');

describe('Uni3/Restake.setStopLoss', function () {
  let automate, token0, token1, positionManager, router, pool;
  before(async function () {
    account = await ethers.getImpersonatedSigner('0xFa02EDF9ebA53Ae811650e409A1da2E6103CDB54');

    const erc1167 = await utils.erc1167({ signer: account });
    const rebalance = await utils.rebalanceDeploy({ signer: account });

    const storage = await utils.storageDeploy({ data: [], signer: account });

    const uni3Contract = await utils.uni3({ signer: account });
    positionManager = uni3Contract.positionManager;
    router = uni3Contract.router;
    pool = uni3Contract.pool;
    token0 = uni3Contract.token0;
    token1 = uni3Contract.token1;

    const Automate = await ethers.getContractFactory('contracts/Restake.automate.sol:Restake', {
      signer: account,
      libraries: {
        ERC1167: erc1167.address,
        Rebalance: rebalance.address,
      },
    });
    automate = await Automate.deploy(storage.contract.address);
    await automate.deployed();
    await automate.init(positionManager.address, router.address, pool.address, 300);
  });

  it('setStopLoss: should set stop loss options', async function () {
    strictEqual(
      await automate
        .stopLoss()
        .then(({ fee, amountOut, amountOutMin }) => ({
          fee,
          amountOut: amountOut.toString(),
          amountOutMin: amountOutMin.toString(),
        }))
        .then(JSON.stringify),
      JSON.stringify({
        fee: 0,
        amountOut: '0',
        amountOutMin: '0',
      })
    );

    const stopLoss = {
      fee: 3000,
      amountOut: new BN('5e18').toString(10),
      amountOutMin: new BN('4e18').toString(10),
    };
    await automate.setStopLoss(
      [token0.address, token1.address],
      stopLoss.fee,
      stopLoss.amountOut,
      stopLoss.amountOutMin
    );
    strictEqual(
      await automate
        .stopLoss()
        .then(({ fee, amountOut, amountOutMin }) => ({
          fee,
          amountOut: amountOut.toString(),
          amountOutMin: amountOutMin.toString(),
        }))
        .then(JSON.stringify),
      JSON.stringify(stopLoss)
    );
  });
});

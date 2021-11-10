const { strictEqual } = require('assert');
const assertions = require('truffle-assertions');
const { fixtures } = require('./fixtures');
const { ethers } = require('hardhat');

describe('GaugeUniswapRestake.deposit', function () {
  let owner, notOwner, plainPoolGauge, plainPoolLP, automate;
  before(async function () {
    [owner, notOwner] = await ethers.getSigners();
    let { erc1167, storage, usdc, ...env } = await fixtures();
    plainPoolGauge = env.plainPoolGauge;
    plainPoolLP = env.plainPoolLP;

    const Automate = await ethers.getContractFactory(
      'automates/curve/GaugeUniswapRestake.automate.sol:GaugeUniswapRestake',
      {
        libraries: {
          ERC1167: erc1167.address,
        },
      }
    );
    automate = await Automate.deploy(storage.address);
    await automate.deployed();
    await automate.init(plainPoolGauge.address, usdc.address, 600, 0);
  });

  it('deposit: should stake all staking token', async function () {
    const startOwnerLPBalance = await plainPoolLP.balanceOf(owner.address).then((v) => v.toString());
    strictEqual(startOwnerLPBalance > 0, true, 'Invalid start balance owner');
    strictEqual(
      await plainPoolLP.balanceOf(automate.address).then((v) => v.toString()),
      '0',
      'Invalid start balance automate'
    );
    strictEqual(
      await plainPoolGauge.balanceOf(automate.address).then((v) => v.toString()),
      '0',
      'Invalid start staked automate'
    );

    await plainPoolLP.transfer(automate.address, startOwnerLPBalance);
    await automate.deposit();

    strictEqual(await plainPoolLP.balanceOf(owner.address).then((v) => v.toString()), '0', 'Invalid end balance owner');
    strictEqual(
      await plainPoolLP.balanceOf(automate.address).then((v) => v.toString()),
      '0',
      'Invalid end balance automate'
    );
    strictEqual(
      await plainPoolGauge.balanceOf(automate.address).then((v) => v.toString()),
      startOwnerLPBalance,
      'Invalid end staked automate'
    );
  });

  it('deposit: should revert tx if not owner call', async function () {
    await assertions.reverts(automate.connect(notOwner).deposit(), 'Automate: caller is not the owner');
  });
});

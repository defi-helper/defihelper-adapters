const { strictEqual } = require('assert');
const assertions = require('truffle-assertions');
const { fixtures } = require('./fixtures');
const { ethers } = require('hardhat');

describe('GaugeUniswapRestake.refund', function () {
  let owner, notOwner, plainPoolGauge, plainPoolLP, minter, crvToken, automate;
  const stakingTokenAmount = '1000';
  const rewardTokenAmount = '500';
  before(async function () {
    [owner, notOwner] = await ethers.getSigners();
    let { erc1167, storage, usdc, ...env } = await fixtures();
    plainPoolGauge = env.plainPoolGauge;
    plainPoolLP = env.plainPoolLP;
    minter = env.minter;
    crvToken = env.crvToken;

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
    await plainPoolLP.transfer(automate.address, stakingTokenAmount);
    await automate.deposit();
    await crvToken.transfer(minter.address, rewardTokenAmount);
    await minter.setMinted(automate.address, plainPoolGauge.address, rewardTokenAmount);
    plainPoolLP.transfer(notOwner.address, await plainPoolLP.balanceOf(owner.address));
    crvToken.transfer(notOwner.address, await crvToken.balanceOf(owner.address));
  });

  it('refund: should refund all staking and reward tokens', async function () {
    strictEqual(
      await plainPoolGauge.balanceOf(automate.address).then((v) => v.toString()),
      stakingTokenAmount,
      'Invalid start staked amount'
    );
    strictEqual(
      await minter.minted(automate.address, plainPoolGauge.address).then((v) => v.toString()),
      rewardTokenAmount,
      'Invalid start minted amount'
    );
    strictEqual(
      await plainPoolLP.balanceOf(owner.address).then((v) => v.toString()),
      '0',
      'Invalid start owner lp balance'
    );
    strictEqual(
      await crvToken.balanceOf(owner.address).then((v) => v.toString()),
      '0',
      'Invalid start owner crv balance'
    );

    await automate.refund();

    strictEqual(
      await plainPoolGauge.balanceOf(automate.address).then((v) => v.toString()),
      '0',
      'Invalid end staked amount'
    );
    strictEqual(
      await plainPoolLP.balanceOf(automate.address).then((v) => v.toString()),
      '0',
      'Invalid end automate lp balance'
    );
    strictEqual(
      await minter.minted(automate.address, plainPoolGauge.address).then((v) => v.toString()),
      '0',
      'Invalid end minted amount'
    );
    strictEqual(
      await crvToken.balanceOf(automate.address).then((v) => v.toString()),
      '0',
      'Invalid end automate crv balance'
    );
    strictEqual(
      await plainPoolLP.balanceOf(owner.address).then((v) => v.toString()),
      stakingTokenAmount,
      'Invalid end owner lp balance'
    );
    strictEqual(
      await crvToken.balanceOf(owner.address).then((v) => v.toString()),
      rewardTokenAmount,
      'Invalid end owner crv balance'
    );
  });

  it('refund: should revert tx if not owner call', async function () {
    await assertions.reverts(automate.connect(notOwner).refund(), 'Automate: caller is not the owner');
  });
});

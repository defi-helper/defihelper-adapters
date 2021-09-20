const { strictEqual } = require('assert');
const assertions = require('truffle-assertions');
const { ethers } = require('hardhat');
const { fixtures } = require('./fixtures');
const BN = require('bignumber.js');

describe('SynthetixUniswapLpRestake.deposit', function () {
  let automate, stakingToken, staking, other;
  const amount = 1000;
  before(async function () {
    [, other] = await ethers.getSigners();
    let { erc1167, storage } = await fixtures();

    const ERC20Mock = await ethers.getContractFactory('automates/utils/ERC20Mock.sol:ERC20Mock');
    stakingToken = await ERC20Mock.deploy('Staking token', 'S', amount);
    await stakingToken.deployed();

    const SynthetixStaking = await ethers.getContractFactory('automates/bondappetit/mock/StakingMock.sol:StakingMock');
    staking = await SynthetixStaking.deploy(stakingToken.address, stakingToken.address, 0, 0);
    await staking.deployed();

    const Automate = await ethers.getContractFactory(
      'automates/bondappetit/SynthetixUniswapLpRestake.automate.sol:SynthetixUniswapLpRestake',
      {
        libraries: {
          ERC1167: erc1167.address,
        },
      }
    );
    automate = await Automate.deploy(storage.address);
    await automate.deployed();
    await automate.init(staking.address, 600, 0);
    await stakingToken.transfer(automate.address, amount);
  });

  it('deposit: should stake all staking token', async function () {
    strictEqual(
      await stakingToken.allowance(automate.address, staking.address).then((res) => res.toString()),
      '0',
      'Invalid automate allowance start'
    );
    strictEqual(
      await stakingToken.balanceOf(automate.address).then((res) => res.toString()),
      amount.toString(),
      'Invalid automate balance start'
    );
    strictEqual(
      await stakingToken.balanceOf(staking.address).then((res) => res.toString()),
      '0',
      'Invalid staking balance start'
    );

    await automate.deposit();

    strictEqual(
      await stakingToken.allowance(automate.address, staking.address).then((res) => res.toString()),
      new BN(2).pow(256).minus(1).minus(amount).toString(10),
      'Invalid automate allowance start'
    );
    strictEqual(
      await stakingToken.balanceOf(automate.address).then((res) => res.toString()),
      '0',
      'Invalid automate balance end'
    );
    strictEqual(
      await stakingToken.balanceOf(staking.address).then((res) => res.toString()),
      amount.toString(),
      'Invalid staking balance end'
    );
  });

  it('deposit: should revert tx if not owner call', async function () {
    await assertions.reverts(automate.connect(other).deposit(), 'Automate: caller is not the owner');
  });
});

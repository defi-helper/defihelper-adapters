const { strictEqual } = require('assert');
const assertions = require('truffle-assertions');
const { ethers } = require('hardhat');
const { fixtures } = require('./fixtures');

describe('SynthetixUniswapLpRestake.refund', function () {
  let automate, stakingToken, rewardToken, staking, owner, other;
  const stakingTokenAmount = 1000;
  const rewardTokenAmount = 500;
  before(async function () {
    [owner, other] = await ethers.getSigners();
    let { erc1167, storage } = await fixtures();

    const ERC20Mock = await ethers.getContractFactory('automates/utils/ERC20Mock.sol:ERC20Mock');
    stakingToken = await ERC20Mock.deploy('Staking token', 'S', stakingTokenAmount);
    await stakingToken.deployed();
    rewardToken = await ERC20Mock.deploy('Reward token', 'R', rewardTokenAmount);
    await rewardToken.deployed();

    const SynthetixStaking = await ethers.getContractFactory('automates/bondappetit/mock/StakingMock.sol:StakingMock');
    staking = await SynthetixStaking.deploy(rewardToken.address, stakingToken.address, 0, 0);
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
    await stakingToken.transfer(automate.address, stakingTokenAmount);
    await automate.deposit();
    await rewardToken.transfer(staking.address, rewardTokenAmount);
    await staking.setReward(automate.address, rewardTokenAmount);
  });

  it('refund: should refund all staking and reward tokens', async function () {
    strictEqual(
      await staking.balanceOf(automate.address).then((res) => res.toString()),
      stakingTokenAmount.toString(),
      'Invalid staking start'
    );
    strictEqual(
      await staking.earned(automate.address).then((res) => res.toString()),
      rewardTokenAmount.toString(),
      'Invalid reward start'
    );
    strictEqual(
      await stakingToken.balanceOf(owner.address).then((res) => res.toString()),
      '0',
      'Invalid owner staking start'
    );
    strictEqual(
      await rewardToken.balanceOf(owner.address).then((res) => res.toString()),
      '0',
      'Invalid owner reward start'
    );

    await automate.refund();

    strictEqual(await staking.balanceOf(automate.address).then((res) => res.toString()), '0', 'Invalid staking end');
    strictEqual(await staking.earned(automate.address).then((res) => res.toString()), '0', 'Invalid reward end');
    strictEqual(
      await stakingToken.balanceOf(owner.address).then((res) => res.toString()),
      stakingTokenAmount.toString(),
      'Invalid owner staking end'
    );
    strictEqual(
      await rewardToken.balanceOf(owner.address).then((res) => res.toString()),
      rewardTokenAmount.toString(),
      'Invalid owner reward end'
    );
  });

  it('refund: should revert tx if not owner call', async function () {
    await assertions.reverts(automate.connect(other).refund(), 'Automate: caller is not the owner');
  });
});

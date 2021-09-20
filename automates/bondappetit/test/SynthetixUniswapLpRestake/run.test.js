const { strictEqual } = require('assert');
const dayjs = require('dayjs');
const { ethers } = require('hardhat');
const { storageKey, fixtures } = require('./fixtures');

describe('SynthetixUniswapLpRestake.run', function () {
  let automate, token0, token1, rewardToken, staking;
  const token0Amount = 1000;
  const token0Price = 20;
  const token1Amount = 1000;
  const token1Price = 30;
  const rewardTokenAmount = 500;
  const liquidityAmount = 100;
  const stakingTokenAmount = token0Amount + token1Amount - liquidityAmount;
  before(async function () {
    [owner] = await ethers.getSigners();
    let { erc1167, storage, balance } = await fixtures();

    await balance.mock.claim.returns(1);

    const ERC20Mock = await ethers.getContractFactory('automates/utils/ERC20Mock.sol:ERC20Mock');
    token0 = await ERC20Mock.deploy('Token0', 'T0', token0Amount);
    await token0.deployed();
    token1 = await ERC20Mock.deploy('Token1', 'T1', token1Amount);
    await token1.deployed();
    rewardToken = await ERC20Mock.deploy('Reward token', 'R', rewardTokenAmount);
    await rewardToken.deployed();
    const UniswapV2PairMock = await ethers.getContractFactory(
      'automates/bondappetit/mock/UniswapV2PairMock.sol:UniswapV2PairMock'
    );
    stakingToken = await UniswapV2PairMock.deploy(token0.address, token1.address, stakingTokenAmount + liquidityAmount);
    await stakingToken.deployed();

    const UniRouter = await ethers.getContractFactory(
      'automates/bondappetit/mock/UniswapV2RouterMock.sol:UniswapV2RouterMock'
    );
    uniRouter = await UniRouter.deploy(stakingToken.address);
    await uniRouter.deployed();
    await storage.mock.getAddress.withArgs(storageKey('UniswapV2:Contract:Router2')).returns(uniRouter.address);
    await uniRouter.setAmountsOut([rewardToken.address, token0.address], [100, token0Price]);
    await uniRouter.setAmountsOut([rewardToken.address, token1.address], [100, token1Price]);
    await token0.transfer(uniRouter.address, token0Price);
    await token1.transfer(uniRouter.address, token1Price);
    await stakingToken.transfer(uniRouter.address, liquidityAmount);

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

  it('run: should run automate', async function () {
    const deadline = dayjs().add(10, 'minutes').unix();
    const gasFee = await automate.estimateGas.run(1, deadline, [0, 0]);

    await automate.run(gasFee, deadline, [0, 0]);

    const endStakingBalance = await staking.balanceOf(automate.address);
    const endEarned = await staking.earned(automate.address);
    strictEqual(
      endStakingBalance.toString(),
      (stakingTokenAmount + liquidityAmount).toString(),
      'Invalid end staking balance'
    );
    strictEqual(endEarned.toString(), '0', 'Invalid end earned');
  });
});

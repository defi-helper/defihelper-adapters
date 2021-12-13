const { strictEqual } = require('assert');
const dayjs = require('dayjs');
const { ethers } = require('hardhat');
const { fixtures } = require('./fixtures');
const DFHFixtures = require('../../../test/dfh.fixtures');

describe('GaugeUniswapRestake.run', function () {
  let owner, plainPoolGauge, plainPoolLP, crvToken, minter, automate;
  const crvTokenLiquidity = 1000;
  const usdcTokenLiquidity = 500;
  const rewardTokenAmount = 100;
  const stakingTokenAmount = 1000;
  before(async function () {
    [owner] = await ethers.getSigners();
    let { erc1167, storage, balance, usdc, plainPool, ...env } = await fixtures();
    plainPoolGauge = env.plainPoolGauge;
    plainPoolLP = env.plainPoolLP;
    crvToken = env.crvToken;
    minter = env.minter;

    await balance.mock.claim.returns(1);

    await plainPoolLP.transfer(plainPool.address, 1000).then((tx) => tx.wait());

    const UniswapV2PairMock = await ethers.getContractFactory(
      'automates/bondappetit/mock/UniswapV2PairMock.sol:UniswapV2PairMock'
    );
    const uniPair = await UniswapV2PairMock.deploy(crvToken.address, usdc.address, '1000');
    await uniPair.deployed();

    const UniRouter = await ethers.getContractFactory(
      'automates/bondappetit/mock/UniswapV2RouterMock.sol:UniswapV2RouterMock'
    );
    uniRouter = await UniRouter.deploy(uniPair.address);
    await uniRouter.deployed();
    await crvToken.transfer(uniRouter.address, crvTokenLiquidity);
    await usdc.transfer(uniRouter.address, usdcTokenLiquidity);
    await uniRouter.setAmountsOut([crvToken.address, usdc.address], [crvTokenLiquidity, usdcTokenLiquidity]);

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
    await automate.init(plainPoolGauge.address, uniRouter.address, usdc.address, 600, 0);
    await plainPoolLP.transfer(automate.address, stakingTokenAmount);
    await automate.deposit();
    await crvToken.transfer(minter.address, rewardTokenAmount);
    await minter.setMinted(automate.address, plainPoolGauge.address, rewardTokenAmount);
  });

  it('run: should run automate', async function () {
    const deadline = dayjs().add(10, 'minutes').unix();
    const gasFee = await automate.estimateGas.run(1, deadline, 0, 0);

    await automate.run(gasFee, deadline, 0, 0);

    strictEqual(
      await minter.minted(automate.address, plainPoolGauge.address).then((v) => v.toString()),
      '0',
      'Invalid end earned'
    );
    strictEqual(
      await plainPoolGauge.balanceOf(automate.address).then((v) => v.toString()),
      (stakingTokenAmount + usdcTokenLiquidity).toString(),
      'Invalid end staked'
    );
  });
});

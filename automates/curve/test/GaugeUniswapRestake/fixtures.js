const DFHFixtures = require('../../../test/dfh.fixtures');
const { ethers } = require('hardhat');

const fixtures = async () => {
  const ERC20Mock = await ethers.getContractFactory('automates/utils/ERC20Mock.sol:ERC20Mock');
  const RegistryMock = await ethers.getContractFactory('automates/curve/mock/RegistryMock.sol:RegistryMock');
  const MinterMock = await ethers.getContractFactory('automates/curve/mock/MinterMock.sol:MinterMock');
  const PlainPoolMock = await ethers.getContractFactory('automates/curve/mock/PlainPoolMock.sol:PlainPoolMock');
  const MetaPoolMock = await ethers.getContractFactory('automates/curve/mock/MetaPoolMock.sol:MetaPoolMock');
  const GaugeMock = await ethers.getContractFactory('automates/curve/mock/GaugeMock.sol:GaugeMock');

  const dfhFixtures = await DFHFixtures.fixtures();

  const registry = await RegistryMock.deploy();
  await registry.deployed();
  const zeroAddress = '0x0000000000000000000000000000000000000000';
  const emptyRegistryPoolCoins = Array.from(new Array(8).keys()).map(() => zeroAddress);
  const crvToken = await ERC20Mock.deploy('CRV token', 'CRV', (100e18).toString());
  await crvToken.deployed();
  const minter = await MinterMock.deploy(crvToken.address);
  await minter.deployed();

  const usdc = await ERC20Mock.deploy('USDC', 'USDC', (100e6).toString());
  await usdc.deployed();
  const usdt = await ERC20Mock.deploy('USDT', 'USDT', (100e6).toString());
  await usdt.deployed();
  const dai = await ERC20Mock.deploy('DAI', 'DAI', (100e18).toString());
  await dai.deployed();
  const plainPoolLP = await ERC20Mock.deploy('3 Pool LP', '3Pool', (100e18).toString());
  await plainPoolLP.deployed();
  const plainPool = await PlainPoolMock.deploy(plainPoolLP.address, [dai.address, usdc.address, usdt.address]);
  await plainPool.deployed();
  const plainPoolGauge = await GaugeMock.deploy(minter.address, crvToken.address, plainPoolLP.address);
  await plainPoolGauge.deployed();
  await registry
    .addPool(plainPool.address, {
      n: 3,
      coins: [dai.address, usdc.address, usdt.address, ...emptyRegistryPoolCoins].slice(0, 8),
      lp: plainPoolLP.address,
    })
    .then((tx) => tx.wait());

  const tusd = await ERC20Mock.deploy('TUSD', 'TUSD', (100e18).toString());
  await tusd.deployed();
  const metaPoolLP = await ERC20Mock.deploy('USDT Pool', 'USDTPool', (100e18).toString());
  await metaPoolLP.deployed();
  const metaPool = await MetaPoolMock.deploy(metaPoolLP.address, [tusd.address, plainPoolLP.address]);
  await metaPool.deployed();
  const metaPoolGauge = await GaugeMock.deploy(minter.address, crvToken.address, metaPoolLP.address);
  await metaPoolGauge.deployed();
  await registry
    .addPool(metaPool.address, {
      n: 2,
      coins: [tusd.address, plainPoolLP.address, ...emptyRegistryPoolCoins].slice(0, 8),
      lp: metaPoolLP.address,
    })
    .then((tx) => tx.wait());

  await dfhFixtures.storage.mock.getAddress
    .withArgs(DFHFixtures.storageKey('Curve:Contract:Registry'))
    .returns(registry.address);

  return {
    ...dfhFixtures,
    registry,
    crvToken,
    minter,
    usdc,
    usdt,
    dai,
    plainPoolLP,
    plainPool,
    plainPoolGauge,
    tusd,
    metaPoolLP,
    metaPool,
    metaPoolGauge,
  };
};

module.exports = {
  fixtures,
};

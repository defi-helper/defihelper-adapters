const { strictEqual } = require('assert');
const assertions = require('truffle-assertions');
const { artifacts, ethers } = require('hardhat');

describe('Automate.init', function () {
  let proxyFactory, erc1167;
  let prototypeOwner, proxyOwner, newOwner;
  const infoAddress = '0x0000000000000000000000000000000000000001';
  const stakingAddress = '0x0000000000000000000000000000000000000002';
  before(async function () {
    [prototypeOwner, proxyOwner, newOwner] = await ethers.getSigners();

    const ERC1167 = await ethers.getContractFactory('automates/utils/DFH/proxy/ERC1167.sol:ERC1167');
    erc1167 = await ERC1167.deploy();
    await erc1167.deployed();

    const ProxyFactory = await ethers.getContractFactory('automates/utils/DFH/proxy/ProxyFactory.sol:ProxyFactory', {
      libraries: {
        ERC1167: erc1167.address,
      },
    });
    proxyFactory = await ProxyFactory.deploy();
    await proxyFactory.deployed();
  });

  it('init: should init contract', async function () {
    const { abi: AutomateABI } = await artifacts.readArtifact('automates/utils/DFH/mock/AutomateMock.sol:AutomateMock');
    const Prototype = await ethers.getContractFactory('automates/utils/DFH/mock/AutomateMock.sol:AutomateMock', {
      libraries: {
        ERC1167: erc1167.address,
      },
    });
    const prototype = await Prototype.deploy(infoAddress);
    await prototype.deployed();

    const proxyTx = await (
      await proxyFactory
        .connect(proxyOwner)
        .create(
          prototype.address,
          new ethers.utils.Interface(AutomateABI).encodeFunctionData('init', [stakingAddress, '1'])
        )
    ).wait();
    const proxyCreatedEvent = proxyTx.events.find(({ event }) => event === 'ProxyCreated');
    const proxy = new ethers.Contract(proxyCreatedEvent.args.proxy, AutomateABI, proxyOwner);

    strictEqual(await proxy.staking(), stakingAddress, 'Invalid staking address');

    await proxy.init(stakingAddress, '1').then((v) => v.wait());
  });

  it('init: revert tx if contract already initialized and staking address changed', async function () {
    const { abi: AutomateABI } = await artifacts.readArtifact('automates/utils/DFH/mock/AutomateMock.sol:AutomateMock');
    const Prototype = await ethers.getContractFactory('automates/utils/DFH/mock/AutomateMock.sol:AutomateMock', {
      libraries: {
        ERC1167: erc1167.address,
      },
    });
    const prototype = await Prototype.deploy(infoAddress);
    await prototype.deployed();

    const proxyTx = await (
      await proxyFactory
        .connect(proxyOwner)
        .create(
          prototype.address,
          new ethers.utils.Interface(AutomateABI).encodeFunctionData('init', [stakingAddress, '1'])
        )
    ).wait();
    const proxyCreatedEvent = proxyTx.events.find(({ event }) => event === 'ProxyCreated');
    const proxy = new ethers.Contract(proxyCreatedEvent.args.proxy, AutomateABI, proxyOwner);

    await assertions.reverts(
      proxy.init('0x0000000000000000000000000000000000000003', '1'),
      'AutomateMock::init: reinitialize staking address forbidden'
    );
  });
});

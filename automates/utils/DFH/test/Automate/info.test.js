const { strictEqual } = require('assert');
const { artifacts, ethers } = require('hardhat');

describe('Automate.info', function () {
  let proxyFactory, erc1167;
  let prototypeOwner, proxyOwner;
  const infoAddress = '0x0000000000000000000000000000000000000001';
  const stakingAddress = '0x0000000000000000000000000000000000000002';
  before(async function () {
    [prototypeOwner, proxyOwner] = await ethers.getSigners();

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

  it('info: should get DFH storage contract address', async function () {
    const { abi: AutomateABI } = await artifacts.readArtifact('automates/utils/DFH/mock/AutomateMock.sol:AutomateMock');
    const Prototype = await ethers.getContractFactory('automates/utils/DFH/mock/AutomateMock.sol:AutomateMock', {
      libraries: {
        ERC1167: erc1167.address,
      },
    });
    const prototype = await Prototype.deploy(infoAddress);
    await prototype.deployed();

    const proxy1Tx = await (
      await proxyFactory
        .connect(proxyOwner)
        .create(prototype.address, new ethers.utils.Interface(AutomateABI).encodeFunctionData('init', [stakingAddress]))
    ).wait();
    const proxy1CreatedEvent = proxy1Tx.events.find(({ event }) => event === 'ProxyCreated');
    const proxy1 = new ethers.Contract(proxy1CreatedEvent.args.proxy, AutomateABI, prototypeOwner);

    strictEqual(await prototype.info(), infoAddress, 'Invalid prototype info');
    strictEqual(await proxy1.info(), infoAddress, 'Invalid proxy info');
  });
});

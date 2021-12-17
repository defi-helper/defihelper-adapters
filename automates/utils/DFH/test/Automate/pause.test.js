const { strictEqual } = require('assert');
const { artifacts, ethers } = require('hardhat');
const assertions = require('truffle-assertions');
const { deployMockContract } = require('@ethereum-waffle/mock-contract');

const storageKey = (k) => ethers.utils.keccak256(ethers.utils.toUtf8Bytes(k));

describe('Automate.pause', function () {
  let proxyFactory, erc1167, prototype, proxy1, proxy2;
  let account, pauser, notOwner;
  const stakingAddress = '0x0000000000000000000000000000000000000002';
  before(async function () {
    [account, pauser, notOwner] = await ethers.getSigners();

    const storageArtifact = await artifacts.readArtifact('automates/utils/DFH/IStorage.sol:IStorage');
    const storage = await deployMockContract(account, storageArtifact.abi);
    await storage.mock.getAddress.withArgs(storageKey('DFH:Pauser')).returns(pauser.address);

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

    const { abi: AutomateABI } = await artifacts.readArtifact('automates/utils/DFH/mock/AutomateMock.sol:AutomateMock');
    const Prototype = await ethers.getContractFactory('automates/utils/DFH/mock/AutomateMock.sol:AutomateMock', {
      libraries: {
        ERC1167: erc1167.address,
      },
    });
    prototype = await Prototype.deploy(storage.address);
    await prototype.deployed();

    const proxy1Tx = await (
      await proxyFactory.create(
        prototype.address,
        new ethers.utils.Interface(AutomateABI).encodeFunctionData('init', [stakingAddress, '1'])
      )
    ).wait();
    const proxy1CreatedEvent = proxy1Tx.events.find(({ event }) => event === 'ProxyCreated');
    proxy1 = new ethers.Contract(proxy1CreatedEvent.args.proxy, AutomateABI, account);

    const proxy2Tx = await (
      await proxyFactory.create(
        prototype.address,
        new ethers.utils.Interface(AutomateABI).encodeFunctionData('init', [stakingAddress, '1'])
      )
    ).wait();
    const proxy2CreatedEvent = proxy2Tx.events.find(({ event }) => event === 'ProxyCreated');
    proxy2 = new ethers.Contract(proxy2CreatedEvent.args.proxy, AutomateABI, account);
  });

  it('pause: should pause contract', async function () {
    strictEqual(await proxy1.paused(), false, 'Invalid start paused state');

    await proxy1.pause();
    strictEqual(await proxy1.paused(), true, 'Invalid end paused state');
  });

  it('pause: should pause all proxies if pause prototype', async function () {
    strictEqual(await prototype.paused(), false, 'Invalid prototype start paused state');
    strictEqual(await proxy2.paused(), false, 'Invalid proxy 2 start paused state');

    await prototype.connect(pauser).pause();
    strictEqual(await prototype.paused(), true, 'Invalid prototype end paused state');
    strictEqual(await proxy2.paused(), true, 'Invalid proxy 2 end paused state');
  });

  it('pause: revert tx if caller proxy not owner', async function () {
    await assertions.reverts(proxy1.connect(notOwner).pause(), 'Automate: caller is not the pauser');
    await assertions.reverts(proxy1.connect(pauser).pause(), 'Automate: caller is not the pauser');
  });

  it('pause: revert tx if contract already paused', async function () {
    await assertions.reverts(proxy1.pause(), 'Automate: paused');
  });

  it('unpause: should unpause all proxies if unpause prototype', async function () {
    await prototype.connect(pauser).unpause();
    strictEqual(await prototype.paused(), false, 'Invalid prototype end paused state');
    strictEqual(await proxy2.paused(), false, 'Invalid proxy 2 end paused state');
  });

  it('unpause: should unpause contract', async function () {
    strictEqual(await proxy1.paused(), true, 'Invalid start paused state');

    await proxy1.unpause();
    strictEqual(await proxy1.paused(), false, 'Invalid end paused state');
  });

  it('unpause: revert tx if caller proxy not owner', async function () {
    await assertions.reverts(proxy1.connect(notOwner).unpause(), 'Automate: caller is not the pauser');
    await assertions.reverts(proxy1.connect(pauser).unpause(), 'Automate: caller is not the pauser');
  });
});

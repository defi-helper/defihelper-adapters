const { strictEqual } = require('assert');
const assertions = require('truffle-assertions');
const { artifacts, ethers } = require('hardhat');

describe('Automate.owner', function () {
  let proxyFactory, erc1167;
  let prototypeOwner, proxyOwner, newOwner;
  const infoAddress = '0x0000000000000000000000000000000000000001';
  const stakingAddress = '0x0000000000000000000000000000000000000002';
  const pool = '1';
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

  it('owner: should init owner address', async function () {
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
          new ethers.utils.Interface(AutomateABI).encodeFunctionData('init', [stakingAddress, pool])
        )
    ).wait();
    const proxyCreatedEvent = proxyTx.events.find(({ event }) => event === 'ProxyCreated');
    const proxy = new ethers.Contract(proxyCreatedEvent.args.proxy, AutomateABI, proxyOwner);

    strictEqual(await prototype.owner(), prototypeOwner.address, 'Invalid prototype owner');
    strictEqual(await proxy.owner(), proxyOwner.address, 'Invalid proxy owner');
  });

  it('transferOwnership: should change owner address', async function () {
    const Prototype = await ethers.getContractFactory('automates/utils/DFH/mock/AutomateMock.sol:AutomateMock', {
      libraries: {
        ERC1167: erc1167.address,
      },
    });
    const prototype = await Prototype.deploy(infoAddress);
    await prototype.deployed();

    await prototype.transferOwnership(newOwner.address);

    strictEqual(await prototype.owner(), newOwner.address, 'Invalid new owner address');
  });

  it('transferOwnership: revert tx if not owner called', async function () {
    const Prototype = await ethers.getContractFactory('automates/utils/DFH/mock/AutomateMock.sol:AutomateMock', {
      libraries: {
        ERC1167: erc1167.address,
      },
    });
    const prototype = await Prototype.deploy(infoAddress);
    await prototype.deployed();

    await assertions.reverts(
      prototype.connect(newOwner).transferOwnership(newOwner.address),
      'Automate: caller is not the owner'
    );
  });

  it('transferOwnership: revert tx if call proxy contract', async function () {
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
          new ethers.utils.Interface(AutomateABI).encodeFunctionData('init', [stakingAddress, pool])
        )
    ).wait();
    const proxyCreatedEvent = proxyTx.events.find(({ event }) => event === 'ProxyCreated');
    const proxy = new ethers.Contract(proxyCreatedEvent.args.proxy, AutomateABI, proxyOwner);

    await assertions.reverts(
      proxy.connect(proxyOwner).transferOwnership(newOwner.address),
      'Automate: change the owner failed'
    );
  });

  it('owner: should reinitialize if owner called', async function () {
    const { abi: AutomateABI } = await artifacts.readArtifact('automates/utils/DFH/mock/AutomateMock.sol:AutomateMock');
    const newPool = '2';
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
          new ethers.utils.Interface(AutomateABI).encodeFunctionData('init', [stakingAddress, pool])
        )
    ).wait();
    const proxyCreatedEvent = proxyTx.events.find(({ event }) => event === 'ProxyCreated');
    const proxy = new ethers.Contract(proxyCreatedEvent.args.proxy, AutomateABI, proxyOwner);

    strictEqual(await proxy.pool().then((v) => v.toString()), pool, 'Invalid configuration proxy');

    await proxy.init(stakingAddress, newPool);

    strictEqual(await proxy.pool().then((v) => v.toString()), newPool, 'Invalid reconfiguration proxy');
  });

  it('owner: revert tx if call reinitialize not owner', async function () {
    const { abi: AutomateABI } = await artifacts.readArtifact('automates/utils/DFH/mock/AutomateMock.sol:AutomateMock');
    const newStakingAddress = '0x0000000000000000000000000000000000000003';
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
          new ethers.utils.Interface(AutomateABI).encodeFunctionData('init', [stakingAddress, pool])
        )
    ).wait();
    const proxyCreatedEvent = proxyTx.events.find(({ event }) => event === 'ProxyCreated');
    const proxy = new ethers.Contract(proxyCreatedEvent.args.proxy, AutomateABI, proxyOwner);

    strictEqual(await proxy.staking(), stakingAddress, 'Invalid configuration proxy');

    await assertions.reverts(
      proxy.connect(newOwner.address).init(newStakingAddress, pool),
      'Automate: caller is not the owner'
    );
  });
});

const assertions = require('truffle-assertions');
const { strictEqual } = require('assert');
const { artifacts, ethers } = require('hardhat');
const { deployMockContract } = require('@ethereum-waffle/mock-contract');
const BN = require('bignumber.js');

const storageKey = (k) => ethers.utils.keccak256(ethers.utils.toUtf8Bytes(k));

describe('Automate.protocolFee', function () {
  let proxyFactory, erc1167, priceFeed, info;
  let prototypeOwner, proxyOwner, notOwner;
  const stakingAddress = '0x0000000000000000000000000000000000000002';
  const tokenPrice = 20e8; // 20$ on 1 ETH
  before(async function () {
    [prototypeOwner, proxyOwner, notOwner] = await ethers.getSigners();

    const priceFeedArtifact = await artifacts.readArtifact(
      '@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol:AggregatorV3Interface'
    );
    priceFeed = await deployMockContract(prototypeOwner, priceFeedArtifact.abi);
    await priceFeed.mock.latestRoundData.returns(0, tokenPrice, 0, 0, 0);

    const storageArtifact = await artifacts.readArtifact('automates/utils/DFH/IStorage.sol:IStorage');
    info = await deployMockContract(prototypeOwner, storageArtifact.abi);
    await info.mock.getAddress.withArgs(storageKey('DFH:Fee:PriceFeed')).returns(priceFeed.address);

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

  it('protocolFee: should get protocol fee in proxy', async function () {
    const proxyProtocolFee = 5e8;

    const { abi: AutomateABI } = await artifacts.readArtifact('automates/utils/DFH/mock/AutomateMock.sol:AutomateMock');
    const Prototype = await ethers.getContractFactory('automates/utils/DFH/mock/AutomateMock.sol:AutomateMock', {
      libraries: {
        ERC1167: erc1167.address,
      },
    });
    const prototype = await Prototype.deploy(info.address);
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
    const proxy = new ethers.Contract(proxyCreatedEvent.args.proxy, AutomateABI, prototypeOwner);
    await proxy.connect(prototypeOwner).changeProtocolFee(proxyProtocolFee);

    strictEqual(
      (await proxy.protocolFee()).toString(),
      new BN(proxyProtocolFee).multipliedBy(1e18).div(tokenPrice).toFixed(0),
      'Invalid protocol fee'
    );
  });

  it('protocolFee: should get protocol fee in prototype', async function () {
    const prototypeProtocolFee = 5e8;

    const { abi: AutomateABI } = await artifacts.readArtifact('automates/utils/DFH/mock/AutomateMock.sol:AutomateMock');
    const Prototype = await ethers.getContractFactory('automates/utils/DFH/mock/AutomateMock.sol:AutomateMock', {
      libraries: {
        ERC1167: erc1167.address,
      },
    });
    const prototype = await Prototype.deploy(info.address);
    await prototype.deployed();
    await prototype.connect(prototypeOwner).changeProtocolFee(prototypeProtocolFee);

    const proxyTx = await (
      await proxyFactory
        .connect(proxyOwner)
        .create(
          prototype.address,
          new ethers.utils.Interface(AutomateABI).encodeFunctionData('init', [stakingAddress, '1'])
        )
    ).wait();
    const proxyCreatedEvent = proxyTx.events.find(({ event }) => event === 'ProxyCreated');
    const proxy = new ethers.Contract(proxyCreatedEvent.args.proxy, AutomateABI, prototypeOwner);

    strictEqual(
      (await proxy.protocolFee()).toString(),
      new BN(prototypeProtocolFee).multipliedBy(1e18).div(tokenPrice).toFixed(0),
      'Invalid protocol fee'
    );
  });

  it('protocolFee: should get protocol fee in info', async function () {
    const infoProtocolFee = 5e8;

    await info.mock.getUint.withArgs(storageKey('DFH:Fee:Automate')).returns(infoProtocolFee);

    const { abi: AutomateABI } = await artifacts.readArtifact('automates/utils/DFH/mock/AutomateMock.sol:AutomateMock');
    const Prototype = await ethers.getContractFactory('automates/utils/DFH/mock/AutomateMock.sol:AutomateMock', {
      libraries: {
        ERC1167: erc1167.address,
      },
    });
    const prototype = await Prototype.deploy(info.address);
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
    const proxy = new ethers.Contract(proxyCreatedEvent.args.proxy, AutomateABI, prototypeOwner);

    strictEqual(
      (await proxy.protocolFee()).toString(),
      new BN(infoProtocolFee).multipliedBy(1e18).div(tokenPrice).toFixed(0),
      'Invalid protocol fee'
    );
  });

  it('changeProtocolFee: revert tx if caller not prototype owner', async function () {
    const { abi: AutomateABI } = await artifacts.readArtifact('automates/utils/DFH/mock/AutomateMock.sol:AutomateMock');
    const Prototype = await ethers.getContractFactory('automates/utils/DFH/mock/AutomateMock.sol:AutomateMock', {
      libraries: {
        ERC1167: erc1167.address,
      },
    });
    const prototype = await Prototype.deploy(info.address);
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
    const proxy = new ethers.Contract(proxyCreatedEvent.args.proxy, AutomateABI, prototypeOwner);

    await assertions.reverts(
      proxy.connect(proxyOwner).changeProtocolFee(0),
      'Automate::changeProtocolFee: caller is not the protocol owner'
    );
    await assertions.reverts(
      proxy.connect(notOwner).changeProtocolFee(0),
      'Automate::changeProtocolFee: caller is not the protocol owner'
    );
  });
});

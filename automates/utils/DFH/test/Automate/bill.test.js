const assertions = require('truffle-assertions');
const { artifacts, ethers } = require('hardhat');
const { deployMockContract } = require('@ethereum-waffle/mock-contract');

const storageKey = (k) => ethers.utils.keccak256(ethers.utils.toUtf8Bytes(k));

describe('Automate.bill', function () {
  let proxyFactory, erc1167, prototype, proxy;
  let owner, notOwner;
  const stakingAddress = '0x0000000000000000000000000000000000000002';
  const protocolFee = 100;
  before(async function () {
    [owner, notOwner] = await ethers.getSigners();

    const priceFeedArtifact = await artifacts.readArtifact(
      '@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol:AggregatorV3Interface'
    );
    const priceFeed = await deployMockContract(owner, priceFeedArtifact.abi);
    await priceFeed.mock.latestRoundData.returns(0, protocolFee, 0, 0, 0);

    const balanceArtifact = await artifacts.readArtifact('automates/utils/DFH/IBalance.sol:IBalance');
    const balance = await deployMockContract(owner, balanceArtifact.abi);
    await balance.mock.claim.returns(0);

    const storageArtifact = await artifacts.readArtifact('automates/utils/DFH/IStorage.sol:IStorage');
    const storage = await deployMockContract(owner, storageArtifact.abi);
    await storage.mock.getAddress.withArgs(storageKey('DFH:Contract:Balance')).returns(balance.address);
    await storage.mock.getAddress.withArgs(storageKey('DFH:Pauser')).returns(owner.address);
    await storage.mock.getAddress.withArgs(storageKey('DFH:Fee:PriceFeed')).returns(priceFeed.address);

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

    const proxyTx = await (
      await proxyFactory.create(
        prototype.address,
        new ethers.utils.Interface(AutomateABI).encodeFunctionData('init', [stakingAddress, '1'])
      )
    ).wait();
    const proxyCreatedEvent = proxyTx.events.find(({ event }) => event === 'ProxyCreated');
    proxy = new ethers.Contract(proxyCreatedEvent.args.proxy, AutomateABI, owner);
    await proxy.connect(owner).changeProtocolFee(protocolFee);
  });

  it('bill: should make bill', async function () {
    const x = 1;
    const y = 2;
    const gasFee = (await proxy.estimateGas.run(0, x, y)).toString();

    await proxy.connect(notOwner).run(gasFee, x, y);
  });

  it('bill: should skip if owner called', async function () {
    await proxy.run(0, 1, 2);
  });

  it('bill: revert tx if automate paused', async function () {
    const x = 1;
    const y = 2;

    await proxy.pause();
    await assertions.reverts(proxy.run(0, x, y), 'Automate: paused');

    await proxy.unpause();
    await prototype.pause();
    await assertions.reverts(proxy.run(0, x, y), 'Automate: paused');
  });
});

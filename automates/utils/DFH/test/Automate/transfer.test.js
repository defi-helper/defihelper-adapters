const { strictEqual } = require('assert');
const assertions = require('truffle-assertions');
const { artifacts, ethers } = require('hardhat');

describe('Automate.transfer', function () {
  let proxyFactory, erc1167, erc20, prototype, proxy;
  let owner, notOwner;
  const mintAmount = 100;
  const infoAddress = '0x0000000000000000000000000000000000000001';
  const stakingAddress = '0x0000000000000000000000000000000000000002';
  before(async function () {
    [owner, notOwner] = await ethers.getSigners();

    const ERC20 = await ethers.getContractFactory('automates/utils/ERC20Mock.sol:ERC20Mock');
    erc20 = await ERC20.deploy('Test', 'T', mintAmount);
    await erc20.deployed();

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
    prototype = await Prototype.deploy(infoAddress);
    await prototype.deployed();

    const proxyTx = await (
      await proxyFactory.create(
        prototype.address,
        new ethers.utils.Interface(AutomateABI).encodeFunctionData('init', [stakingAddress, '1'])
      )
    ).wait();
    const proxyCreatedEvent = proxyTx.events.find(({ event }) => event === 'ProxyCreated');
    proxy = new ethers.Contract(proxyCreatedEvent.args.proxy, AutomateABI, owner);
  });

  it('transfer: should transfer tokens to recipient', async function () {
    await erc20.transfer(proxy.address, mintAmount);
    strictEqual(
      (await erc20.balanceOf(proxy.address)).toString(),
      mintAmount.toString(),
      'Invalid start proxy balance'
    );
    strictEqual((await erc20.balanceOf(owner.address)).toString(), '0', 'Invalid start account balance');

    await proxy.transfer(erc20.address, owner.address, mintAmount);

    strictEqual((await erc20.balanceOf(proxy.address)).toString(), '0', 'Invalid end proxy balance');
    strictEqual(
      (await erc20.balanceOf(owner.address)).toString(),
      mintAmount.toString(),
      'Invalid end account balance'
    );
  });

  it('transfer: revert tx if not owner called', async function () {
    await assertions.reverts(
      proxy.connect(notOwner).transfer(erc20.address, owner.address, mintAmount),
      'Automate: caller is not the owner'
    );
  });
});

const { ethers, artifacts } = require('hardhat');
const { deployMockContract } = require('@ethereum-waffle/mock-contract');

const protocolFee = {
  automate: '100',
};

const storageKey = (k) => ethers.utils.keccak256(ethers.utils.toUtf8Bytes(k));

const fixtures = async () => {
  const [owner] = await ethers.getSigners();

  const ERC1167 = await ethers.getContractFactory('automates/utils/DFH/proxy/ERC1167.sol:ERC1167');
  const erc1167 = await ERC1167.deploy();
  await erc1167.deployed();

  const balanceArtifact = await artifacts.readArtifact('automates/utils/DFH/IBalance.sol:IBalance');
  const balance = await deployMockContract(owner, balanceArtifact.abi);

  const storageArtifact = await artifacts.readArtifact('automates/utils/DFH/IStorage.sol:IStorage');
  const storage = await deployMockContract(owner, storageArtifact.abi);
  await storage.mock.getAddress.withArgs(storageKey('DFH:Contract:Balance')).returns(balance.address);
  await storage.mock.getUint.withArgs(storageKey('DFH:Contract:Automate')).returns(protocolFee.automate);

  return {
    erc1167,
    balance,
    storage,
  };
};

module.exports = {
  protocolFee,
  storageKey,
  fixtures,
};

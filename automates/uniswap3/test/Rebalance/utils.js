const hardhat = require('hardhat');
const BN = require('bignumber.js');
const { ethers } = hardhat;

async function erc1167({ signer }) {
  const IERC1167 = await hardhat.artifacts.readArtifact('contracts/utils/DFH/proxy/ERC1167.sol:ERC1167');
  return new ethers.Contract('0x10bBA4e8A2f6F85B75cd75ef773f5Daca5596C87', IERC1167.abi, signer);
}

async function storageDeploy({ data, signer }) {
  const Storage = await ethers.getContractFactory('contracts/utils/DFH/Storage.sol:Storage', signer);
  const contract = await Storage.deploy();
  await contract.deployed();

  await data.reduce(async (prev, { method, key, value }) => {
    await prev;

    return contract[method](ethers.utils.keccak256(ethers.utils.toUtf8Bytes(key)), value);
  }, Promise.resolve(null));

  return {
    contract,
  };
}

const feeAmount = {
  LOWEST: 100,
  LOW: 500,
  MEDIUM: 3000,
  HIGH: 10000,
};

const tickSpacings = {
  [100]: 1,
  [500]: 10,
  [3000]: 60,
  [10000]: 200,
};

const MIN_TICK = -887272;
const MAX_TICK = -MIN_TICK;

function nearestUsableTick(tick, tickSpacing) {
  const rounded = Math.round(tick / tickSpacing) * tickSpacing;
  if (rounded < MIN_TICK) return rounded + tickSpacing;
  else if (rounded > MAX_TICK) return rounded - tickSpacing;
  else return rounded;
}

async function uni3({ signer } = {}) {
  signer = signer ?? (await ethers.getSigner());

  const IERC20 = await hardhat.artifacts.readArtifact('@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20');
  const token0 = new ethers.Contract('0x57f6d7137B4b535971cC832dE0FDDfE535A4DB22', IERC20.abi, signer);
  const token1 = new ethers.Contract('0xafd2Dfb918777d9bCC29E315C4Df4551208DBE82', IERC20.abi, signer);

  const IPositionManagerArtifact = await hardhat.artifacts.readArtifact(
    'contracts/utils/UniswapV3/INonfungiblePositionManager.sol:INonfungiblePositionManager'
  );
  const positionManager = new ethers.Contract(
    '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
    IPositionManagerArtifact.abi,
    signer
  );

  const IFactory = await hardhat.artifacts.readArtifact('contracts/utils/UniswapV3/IFactory.sol:IFactory');
  const factory = new ethers.Contract('0x1F98431c8aD98523631AE4a59f267346ea31F984', IFactory.abi, signer);

  const IPool = await hardhat.artifacts.readArtifact('contracts/utils/UniswapV3/IPool.sol:IPool');
  const pool = new ethers.Contract(
    await factory.getPool(token0.address, token1.address, feeAmount.MEDIUM),
    IPool.abi,
    signer
  );

  const IRouter = await hardhat.artifacts.readArtifact('contracts/utils/UniswapV3/ISwapRouter.sol:ISwapRouter');
  const router = new ethers.Contract('0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45', IRouter.abi, signer);

  const ILPTokensManager = await hardhat.artifacts.readArtifact(
    'contracts/utils/DFH/ILPTokensManager.sol:ILPTokensManager'
  );
  const lpTokensManager = new ethers.Contract(
    '0xD7C196a4a2Bffd3F16274630f80d23EDD491d8aC',
    ILPTokensManager.abi,
    signer
  );

  return {
    token0,
    token1,
    positionManager,
    factory,
    pool,
    router,
    lpTokensManager,
  };
}

async function rebalanceDeploy({ signer }) {
  const Rebalance = await ethers.getContractFactory('contracts/utils/UniswapV3/Rebalance.sol:Rebalance', signer);
  const contract = await Rebalance.deploy();
  await contract.deployed();
  return contract;
}

module.exports = {
  erc1167,
  storageDeploy,
  uni3,
  feeAmount,
  tickSpacings,
  nearestUsableTick,
  rebalanceDeploy,
};

const { ethers } = require('hardhat');
const bn = require('bignumber.js');
const dayjs = require('dayjs');
const ABI = {
  erc20: require('./abi/ERC20.json'),
  balance: require('./abi/Balance.json'),
  positionManager: require('./abi/PositionManager.json'),
  router: require('./abi/Router.json'),
  pool: require('./abi/Pool.json'),
  restake: require('./abi/Restake.json'),
  proxyFactory: require('./abi/ProxyFactory.json'),
};
const uniswap = {
  sdk: require('@uniswap/v3-sdk'),
  core: require('@uniswap/sdk-core'),
};

const toString = (v) => v.toString();

describe('Test', function () {
  let token0, token1, pool, poolSDK, positionManager, liquidityRouter, balance, automate;
  let account, consumer;
  before(async function () {
    //account = await ethers.getImpersonatedSigner('0xFa02EDF9ebA53Ae811650e409A1da2E6103CDB54');
    /*
    token0 = new ethers.Contract('0x57f6d7137B4b535971cC832dE0FDDfE535A4DB22', ABI.erc20, account);
    token1 = new ethers.Contract('0xafd2Dfb918777d9bCC29E315C4Df4551208DBE82', ABI.erc20, account);
    positionManager = new ethers.Contract('0xC36442b4a4522E871399CD717aBDD847Ab11FE88', ABI.positionManager, account);
    liquidityRouter = new ethers.Contract('0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45', ABI.router, account);
    pool = new ethers.Contract('0x35c37718b1384FE40AC0DF6351f5543EBF9DbF49', ABI.pool, account);
    const [fee, liquidity, [sqrtPriceX96, tick]] = await Promise.all([pool.fee(), pool.liquidity(), pool.slot0()]);
    poolSDK = new uniswap.sdk.Pool(
      new uniswap.core.Token(5, token0.address, 18, '', ''),
      new uniswap.core.Token(5, token1.address, 18, '', ''),
      fee,
      sqrtPriceX96.toString(),
      liquidity.toString(),
      tick
    );

    const Automate = await ethers.getContractFactory('Test', account);
    automate = await Automate.deploy(positionManager.address, liquidityRouter.address);
    await automate.deployed();
    */
    // optimism
    /*
    const [patreon] = await ethers.getSigners();
    account = await ethers.getImpersonatedSigner('0x8e7D2c8c65dae88Ab5ffECb95035799a2af7dd67');
    consumer = await ethers.getImpersonatedSigner('0xEc326340f5686dcd7b349a2151ACDc6bF25A2570');
    await patreon.sendTransaction({
      to: account.address,
      value: new bn(10).multipliedBy('1e18').toFixed(0),
    });
    balance = new ethers.Contract('0x9B8583F71240ea6fa1A2a1e60BF4CE7DAfd6D5E4', ABI.balance, account);
    await balance.deposit(account.address, { value: new bn(1).multipliedBy('1e18').toFixed(0) });
    token0 = new ethers.Contract('0x4200000000000000000000000000000000000042', ABI.erc20, account);
    token1 = new ethers.Contract('0x7F5c764cBc14f9669B88837ca1490cCa17c31607', ABI.erc20, account);
    positionManager = new ethers.Contract('0xC36442b4a4522E871399CD717aBDD847Ab11FE88', ABI.positionManager, account);
    liquidityRouter = new ethers.Contract('0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45', ABI.router, account);
    pool = new ethers.Contract('0x1C3140aB59d6cAf9fa7459C6f83D4B52ba881d36', ABI.pool, account);
    const [fee, liquidity, [sqrtPriceX96, tick]] = await Promise.all([pool.fee(), pool.liquidity(), pool.slot0()]);
    poolSDK = new uniswap.sdk.Pool(
      new uniswap.core.Token(5, token0.address, 18, '', ''),
      new uniswap.core.Token(5, token1.address, 18, '', ''),
      fee,
      sqrtPriceX96.toString(),
      liquidity.toString(),
      tick
    );
    */
    /*
    // polygon vlad
    account = await ethers.getImpersonatedSigner('0x8d22dbdd383eff153025108f803ab3f2cff6c795');
    consumer = await ethers.getImpersonatedSigner('0xCbA934FA4A5EC35E9Efd47B5FAa816f6510Ee000');
    token0 = new ethers.Contract('0x2791bca1f2de4661ed88a30c99a7a9449aa84174', ABI.erc20, account);
    token1 = new ethers.Contract('0x7ceb23fd6bc0add59e62ac25578270cff1b9f619', ABI.erc20, account);
    positionManager = new ethers.Contract('0xC36442b4a4522E871399CD717aBDD847Ab11FE88', ABI.positionManager, account);
    liquidityRouter = new ethers.Contract('0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45', ABI.router, account);
    pool = new ethers.Contract('0x45dda9cb7c25131df268515131f647d726f50608', ABI.pool, account);
    const [fee, liquidity, [sqrtPriceX96, tick]] = await Promise.all([pool.fee(), pool.liquidity(), pool.slot0()]);
    poolSDK = new uniswap.sdk.Pool(
      new uniswap.core.Token(5, token0.address, 18, '', ''),
      new uniswap.core.Token(5, token1.address, 18, '', ''),
      fee,
      sqrtPriceX96.toString(),
      liquidity.toString(),
      tick
    );
    */
    /*
    const [patreon] = await ethers.getSigners();
    account = await ethers.getImpersonatedSigner('0x8e7D2c8c65dae88Ab5ffECb95035799a2af7dd67');
    consumer = await ethers.getImpersonatedSigner('0xCbA934FA4A5EC35E9Efd47B5FAa816f6510Ee000');
    await patreon.sendTransaction({
      to: account.address,
      value: new bn(10).multipliedBy('1e18').toFixed(0),
    });
    balance = new ethers.Contract('0x92Df189712C2d1ABe508F1a7220F7ebc92c41A7E', ABI.balance, account);
    await balance.deposit(account.address, { value: new bn(1).multipliedBy('1e18').toFixed(0) });
    token0 = new ethers.Contract('0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', ABI.erc20, account);
    token1 = new ethers.Contract('0xc2132D05D31c914a87C6611C10748AEb04B58e8F', ABI.erc20, account);
    positionManager = new ethers.Contract('0xC36442b4a4522E871399CD717aBDD847Ab11FE88', ABI.positionManager, account);
    liquidityRouter = new ethers.Contract('0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45', ABI.router, account);
    pool = new ethers.Contract('0x9B08288C3Be4F62bbf8d1C20Ac9C5e6f9467d8B7', ABI.pool, account);
    const [fee, liquidity, [sqrtPriceX96, tick]] = await Promise.all([pool.fee(), pool.liquidity(), pool.slot0()]);
    poolSDK = new uniswap.sdk.Pool(
      new uniswap.core.Token(5, token0.address, 18, '', ''),
      new uniswap.core.Token(5, token1.address, 18, '', ''),
      fee,
      sqrtPriceX96.toString(),
      liquidity.toString(),
      tick
    );
    */
  });

  it('tick calculate', async function () {
    /*
    const tokenId = 315708;

    const tickSpacing = uniswap.sdk.TICK_SPACINGS[poolSDK.fee];
    const positionInfo = await positionManager.positions(tokenId);
    const tickInterval = uniswap.sdk.nearestUsableTick(
      Math.floor((positionInfo.tickUpper - positionInfo.tickLower) / 2),
      tickSpacing
    );
    console.log('token position', {
      tickSpacing,
      tickInterval,
      lowerTick: positionInfo.tickLower,
      upperTick: positionInfo.tickUpper,
    });

    const path = [poolSDK.token0, poolSDK.token1];
    const poolCurrentTick = uniswap.sdk.nearestUsableTick(await pool.slot0().then(([, tick]) => tick), tickSpacing);
    console.log('pool', {
      currentTick: poolCurrentTick,
      currentPrice: uniswap.sdk.tickToPrice(path[0], path[1], poolCurrentTick).toSignificant(5),
    });

    const lowerTick = uniswap.sdk.nearestUsableTick(
      new bn(poolCurrentTick).minus(tickInterval).toNumber(),
      tickSpacing
    );
    const upperTick = uniswap.sdk.nearestUsableTick(new bn(poolCurrentTick).plus(tickInterval).toNumber(), tickSpacing);
    console.log('rebalance', {
      middleTick: poolCurrentTick,
      lowerTick,
      upperTick,
    });
    */
  });

  it('deploy and rebalance', async function () {
    /*
    const tokenId = 694264;

    const Rebalance = await ethers.getContractFactory('contracts/utils/UniswapV3/Rebalance.sol:Rebalance', {
      signer: account,
    });
    const rebalance = await Rebalance.deploy();
    await rebalance.deployed();

    const Prototype = await ethers.getContractFactory('contracts/Restake.automate.sol:Restake', {
      signer: account,
      libraries: {
        ERC1167: '0x7ecFCbdeb6f195030B9Bf2ECc402f6d5433d116D',
        Rebalance: rebalance.address,
      },
    });
    const prototype = await Prototype.deploy('0xB0E5922Bf9F0AEac7f00198a5fe4ff59Be81225f');
    await prototype.deployed();

    const proxyFactory = new ethers.Contract('0x1C438184c2746b7887E97c8093a7A79A0429E8dC', ABI.proxyFactory, account);
    const createProxyReceipt = await proxyFactory
      .create(
        prototype.address,
        prototype.interface.encodeFunctionData('init', [
          positionManager.address,
          liquidityRouter.address,
          pool.address,
          300,
        ])
      )
      .then((tx) => tx.wait());

    const automate = new ethers.Contract(createProxyReceipt.events[0].args.proxy, ABI.restake, account);

    await positionManager.approve(automate.address, tokenId);
    await automate.deposit(tokenId);

    const positionInfo = await positionManager.positions(tokenId);
    console.log('token position', {
      lowerTick: positionInfo.tickLower,
      upperTick: positionInfo.tickUpper,
    });

    const path = [poolSDK.token0, poolSDK.token1];
    const tickSpacing = uniswap.sdk.TICK_SPACINGS[poolSDK.fee];
    const poolCurrentTick = uniswap.sdk.nearestUsableTick(await pool.slot0().then(([, tick]) => tick), tickSpacing);
    console.log('pool', {
      currentTick: poolCurrentTick,
      currentPrice: uniswap.sdk.tickToPrice(path[0], path[1], poolCurrentTick).toSignificant(5),
    });

    const tickInterval = Math.floor((positionInfo.tickUpper - positionInfo.tickLower) / 2);
    const lowerTick = uniswap.sdk.nearestUsableTick(
      new bn(poolCurrentTick).minus(tickInterval).toNumber(),
      tickSpacing
    );
    const upperTick = uniswap.sdk.nearestUsableTick(new bn(poolCurrentTick).plus(tickInterval).toNumber(), tickSpacing);
    console.log('rebalance', {
      tickSpacing,
      tickInterval,
      middleTick: poolCurrentTick,
      lowerTick,
      upperTick,
    });

    const gasPrice = await account.getGasPrice();
    const gasLimit = await automate
      .connect(consumer)
      .estimateGas.rebalance(1, lowerTick, upperTick, dayjs().add(1, 'months').unix());
    const gasFee = new bn(gasLimit.toString()).multipliedBy(gasPrice.toString()).toFixed(0);

    await automate
      .connect(consumer)
      .estimateGas.rebalance(gasFee.toString(), lowerTick, upperTick, dayjs().add(1, 'months').unix());
      */
  });

  it('rebalance token', async () => {
    /*
    const tokenId = 719223;

    const positionInfo = await positionManager.positions(tokenId);
    console.log('token position', {
      lowerTick: positionInfo.tickLower,
      upperTick: positionInfo.tickUpper,
    });

    const path = [poolSDK.token0, poolSDK.token1];
    const tickSpacing = uniswap.sdk.TICK_SPACINGS[poolSDK.fee];
    const poolCurrentTick = uniswap.sdk.nearestUsableTick(await pool.slot0().then(([, tick]) => tick), tickSpacing);
    console.log('pool', {
      currentTick: poolCurrentTick,
      currentPrice: uniswap.sdk.tickToPrice(path[0], path[1], poolCurrentTick).toSignificant(5),
    });

    const tickInterval = Math.floor((positionInfo.tickUpper - positionInfo.tickLower) / 2);
    const lowerTick = uniswap.sdk.nearestUsableTick(
      new bn(poolCurrentTick).minus(tickInterval).toNumber(),
      tickSpacing
    );
    const upperTick = uniswap.sdk.nearestUsableTick(new bn(poolCurrentTick).plus(tickInterval).toNumber(), tickSpacing);
    console.log('rebalance', {
      tickSpacing,
      tickInterval,
      middleTick: poolCurrentTick,
      lowerTick,
      upperTick,
    });

    const automate = new ethers.Contract('0xb7654F1abAc5E77E5d822E9B41F01D3e283ff27F', ABI.restake, account);
    await token1.transfer(automate.address, new bn(`1e14`).toFixed(0))
    await automate.rebalance(0, lowerTick, upperTick, dayjs().add(1, 'months').unix(), {
      gasLimit: 1200000,
    });
    */
  });

  it('stop loss', async () => {
    account = await ethers.getImpersonatedSigner('0x6179811b21af0349c4bb027faea5e0f81e6c5a3b');
    positionManager = new ethers.Contract('0xC36442b4a4522E871399CD717aBDD847Ab11FE88', ABI.positionManager, account);
    liquidityRouter = new ethers.Contract('0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45', ABI.router, account);
    pool = new ethers.Contract('0x1c3140ab59d6caf9fa7459c6f83d4b52ba881d36', ABI.pool, account);

    const Rebalance = await ethers.getContractFactory('contracts/utils/UniswapV3/Rebalance.sol:Rebalance', {
      signer: account,
    });
    const rebalance = await Rebalance.deploy();
    await rebalance.deployed();

    const Prototype = await ethers.getContractFactory('contracts/Restake.automate.sol:Restake', {
      signer: account,
      libraries: {
        ERC1167: '0xE5e4765eeA4Aea14e4C894a79d517277d6E241EE',
        Rebalance: rebalance.address,
      },
    });
    const prototype = await Prototype.deploy('0xB0E5922Bf9F0AEac7f00198a5fe4ff59Be81225f');
    await prototype.deployed();

    const proxyFactory = new ethers.Contract('0x309e4D1147Ee848527dbcC0502008FaF274B6C6c', ABI.proxyFactory, account);
    const createProxyReceipt = await proxyFactory
      .create(
        prototype.address,
        prototype.interface.encodeFunctionData('init', [
          positionManager.address,
          liquidityRouter.address,
          pool.address,
          300,
        ])
      )
      .then((tx) => tx.wait());

    const automate = new ethers.Contract(createProxyReceipt.events[0].args.proxy, ABI.restake, account);
    const oldAutomate = new ethers.Contract('0x017e1976e599a8BfEA3343F2c1ED9CfF6BEee00d', ABI.restake, account);

    const tokenId = '317185';
    await oldAutomate.refund();
    await positionManager.approve(automate.address, tokenId);
    await automate.deposit(tokenId);
    await automate.setStopLoss(
      ['0x7f5c764cbc14f9669b88837ca1490cca17c31607', '0x7f5c764cbc14f9669b88837ca1490cca17c31607'],
      3000,
      '1863397660',
      0
    );
    await automate.runStopLoss(0, 1679243964);

    /*
    token0 = new ethers.Contract('0x4200000000000000000000000000000000000042', ABI.erc20, account);
    token1 = new ethers.Contract('0x7F5c764cBc14f9669B88837ca1490cCa17c31607', ABI.erc20, account);
    //const amountIn = '647615398771770637430';
    //const amountIn = '5000000000000000000';
    await token0.approve(liquidityRouter.address, amountIn);
    await liquidityRouter.exactInput({
      path: ethers.utils.solidityPack(['address', 'uint24', 'address'], [token0.address, 3000, token1.address]),
      recipient: account.address,
      deadline: 1679243964,
      amountIn,
      amountOutMinimum: 0,
    });
    */
  });
});

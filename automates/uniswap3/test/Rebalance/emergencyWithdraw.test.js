const { strictEqual } = require('assert');
const assertions = require('truffle-assertions');
const { ethers } = require('hardhat');
const utils = require('./utils');
const BN = require('bignumber.js');

describe('Uni3/Restake.emergencyWithdraw', function () {
  let automate, notOwner, token0, token1, positionManager, router, pool, lpTokensManager, lpToken;
  before(async function () {
    account = await ethers.getImpersonatedSigner('0xFa02EDF9ebA53Ae811650e409A1da2E6103CDB54');
    [notOwner] = await ethers.getSigners();

    const erc1167 = await utils.erc1167({ signer: account });
    const rebalance = await utils.rebalanceDeploy({ signer: account });

    const storage = await utils.storageDeploy({ data: [], signer: account });

    const uni3Contract = await utils.uni3({ signer: account });
    positionManager = uni3Contract.positionManager;
    router = uni3Contract.router;
    pool = uni3Contract.pool;
    token0 = uni3Contract.token0;
    token1 = uni3Contract.token1;
    lpTokensManager = uni3Contract.lpTokensManager;

    const tickSpacing = await pool.tickSpacing();
    const currentTick = await pool.slot0().then(({ tick }) => utils.nearestUsableTick(tick, tickSpacing));
    const comission = await lpTokensManager.fee().then((v) => v.toString());
    const amount = new BN('10e18').toFixed(0);
    await token0.approve(lpTokensManager.address, amount);
    lpToken = await lpTokensManager
      .buyLiquidity(
        {
          positionManager: positionManager.address,
          router: router.address,
          from: token0.address,
          amount,
          swap: {
            path: '0x',
            outMin: 0,
          },
          to: pool.address,
          tickLower: currentTick - tickSpacing * 10,
          tickUpper: currentTick + tickSpacing * 10,
          deadline: Math.floor((Date.now() + 10_000) / 1_000),
        },
        { value: comission }
      )
      .then((tx) => tx.wait())
      .then(({ events }) => events.find(({ event }) => event === 'BuyLiquidity'))
      .then(({ args }) => args.tokenId.toString());

    const Automate = await ethers.getContractFactory('contracts/Restake.automate.sol:Restake', {
      signer: account,
      libraries: {
        ERC1167: erc1167.address,
        Rebalance: rebalance.address,
      },
    });
    automate = await Automate.deploy(storage.contract.address);
    await automate.deployed();
    await automate.init(positionManager.address, router.address, pool.address, 300);
  });

  it('emergencyWithdraw: throw error if not owner call', async function () {
    await assertions.reverts(automate.connect(notOwner).emergencyWithdraw(300), 'Automate: caller is not the owner');
  });

  it('emergencyWithdraw: throw error if token not deposit', async function () {
    await assertions.reverts(automate.emergencyWithdraw(300), 'Restake::tokenDeposited: token not deposited');
  });

  it('emergencyWithdraw: should withdraw tokens with stop loss options', async function () {
    await positionManager.approve(automate.address, lpToken);
    await automate.deposit(lpToken);
    await automate.setStopLoss([token0.address, token1.address], utils.feeAmount.MEDIUM, 1, 0);
    strictEqual(await positionManager.ownerOf(lpToken), automate.address);
    strictEqual(await positionManager.positions(lpToken).then(({liquidity}) => liquidity.toString()) > 0, true);

    await automate.emergencyWithdraw(Math.floor((Date.now() + 10_000) / 1_000));
    strictEqual(await positionManager.ownerOf(lpToken), account.address);
    strictEqual(await positionManager.positions(lpToken).then(({liquidity}) => liquidity.toString()) === '0', true);
  });
});

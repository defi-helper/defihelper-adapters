const { ethers, artifacts } = require('hardhat');
const { strictEqual } = require('assert');
const ERC20 = require('./IERC20.json');
const bn = require('bignumber.js');

describe('MasterChef2LpRestake', function () {
  let account, token0, token1, pair, tokenReward, automate;
  before(async function () {
    account = await ethers.getImpersonatedSigner('0xFa02EDF9ebA53Ae811650e409A1da2E6103CDB54');

    token0 = new ethers.Contract('0xafd2Dfb918777d9bCC29E315C4Df4551208DBE82', ERC20, account);
    token1 = new ethers.Contract('0x57f6d7137B4b535971cC832dE0FDDfE535A4DB22', ERC20, account);
    pair = new ethers.Contract(
      '0x18Ba91505DBa079329f2d318aAaEE742787750a4',
      await artifacts.readArtifact('contracts/utils/Uniswap/IUniswapV2Pair.sol:IUniswapV2Pair').then(({ abi }) => abi),
      account
    );
    tokenReward = new ethers.Contract('0xb181Ea0d2835Df254F8c9E6a0CDFC1024B6Aa3e8', ERC20, account);

    const Automate = await ethers.getContractFactory(
      'contracts/MasterChef2LpRestake.automate.sol:MasterChef2LpRestake',
      {
        signer: account,
        libraries: {
          ERC1167: '0x10bBA4e8A2f6F85B75cd75ef773f5Daca5596C87',
        },
      }
    );
    automate = await Automate.deploy('0xBa4F0699c3B08a93E6EC359d8d487aafDe320ed8');
    await automate.deployed();
    await automate.init(
      '0x90Be37825043Fb9bFdC9781618471302EFBb0b50',
      '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
      0,
      0,
      300
    );
    await pair.transfer(automate.address, new bn('10e18').toFixed(0));
    await automate.deposit();
  });

  it('', async function () {
    await automate.setStopLoss(
      ['0xafd2Dfb918777d9bCC29E315C4Df4551208DBE82', '0xb181Ea0d2835Df254F8c9E6a0CDFC1024B6Aa3e8'],
      new bn('50e18').toFixed(0),
      0
    );
    const startBalance = await tokenReward.balanceOf(account.address).then((v) => new bn(v.toString()));
    const tx = await automate.runStopLoss(0, 1693652783);
    const endBalance = await tokenReward.balanceOf(account.address).then((v) => new bn(v.toString()));
    console.log(endBalance.minus(startBalance).div('1e18').toString(10));
  });
});

const { ethers, artifacts } = require('hardhat');
const { strictEqual } = require('assert');
const ERC20 = require('./IERC20.json');
const bn = require('bignumber.js');

describe('MasterChef2SingleRestake', function () {
  let account, token0, tokenReward, automate;
  before(async function () {
    account = await ethers.getImpersonatedSigner('0xFa02EDF9ebA53Ae811650e409A1da2E6103CDB54');

    token0 = new ethers.Contract('0xafd2Dfb918777d9bCC29E315C4Df4551208DBE82', ERC20, account);
    tokenReward = new ethers.Contract('0xb181Ea0d2835Df254F8c9E6a0CDFC1024B6Aa3e8', ERC20, account);

    const Automate = await ethers.getContractFactory(
      'contracts/MasterChef2SingleRestake.automate.sol:MasterChef2SingleRestake',
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
      1,
      0,
      300
    );
    await token0.transfer(automate.address, new bn('10e18').toFixed(0));
    await automate.deposit();
  });

  it('', async function () {
    const outToken = tokenReward;
    await automate.setStopLoss(
      ['0xafd2Dfb918777d9bCC29E315C4Df4551208DBE82', outToken.address],
      new bn('15e18').toFixed(0),
      0
    );
    const startBalance = await outToken.balanceOf(account.address).then((v) => new bn(v.toString()));
    const tx = await automate.runStopLoss(0, 1693652783);
    const endBalance = await outToken.balanceOf(account.address).then((v) => new bn(v.toString()));
    console.log(endBalance.minus(startBalance).div('1e18').toString(10));
  });
});

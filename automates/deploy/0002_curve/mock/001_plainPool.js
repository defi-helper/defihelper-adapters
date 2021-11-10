const { migration } = require('../../utils');
const bn = require('bignumber.js');

module.exports = migration(async ({ utils: { deploy, get, execute } }) => {
  const dai = '0xc2118d4d90b274016cB7a54c03EF52E6c537D957';
  const usdc = '0x0D9C8723B343A8368BebE0B5E89273fF8D712e3C';
  const usdt = '0x516de3a7a567d81737e3a46ec4ff9cfd1fcb0136';

  const totalSupply = new bn(1000000000).multipliedBy(new bn(10).pow(18)).toFixed(0);
  await deploy('CurvePlainPoolLPMock', {
    contract: 'automates/utils/ERC20Mock.sol:ERC20Mock',
    args: ['CurvePlainPoolMock', 'PlainPool', totalSupply],
  });
  const lpToken = await get('CurvePlainPoolLPMock');

  await deploy('CurvePlainPoolMock', {
    contract: 'automates/curve/mock/PlainPoolMock.sol:PlainPoolMock',
    args: [lpToken.address, [dai, usdc, usdt]],
  });
  const pool = await get('CurvePlainPoolMock');
  await execute('CurvePlainPoolLPMock', {}, 'transfer', pool.address, totalSupply);
});
module.exports.tags = ['Mock', 'Curve'];

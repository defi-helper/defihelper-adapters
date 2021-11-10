const { migration } = require('../../utils');
const bn = require('bignumber.js');

module.exports = migration(async ({ utils: { deploy, get, execute } }) => {
  const totalSupply = new bn(1000000000).multipliedBy(new bn(10).pow(18)).toFixed(0);
  await deploy('CurveTokenMock', {
    contract: 'automates/utils/ERC20Mock.sol:ERC20Mock',
    args: ['CurveTokenMock', 'CurveToken', totalSupply],
  });
  const crv = await get('CurveTokenMock');

  await deploy('CurveMinterMock', {
    contract: 'automates/curve/mock/MinterMock.sol:MinterMock',
    args: [crv.address],
  });
  const minter = await get('CurveMinterMock');
  await execute('CurveTokenMock', {}, 'transfer', minter.address, totalSupply);
});
module.exports.tags = ['Mock', 'Curve'];

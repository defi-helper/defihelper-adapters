const { migration } = require('../../utils');
const bn = require('bignumber.js');

module.exports = migration(async ({ utils: { deploy, get, execute } }) => {
  const wbtc = '0xbde8bb00a7ef67007a96945b3a3621177b615c44';
  const plainPoolLpToken = await get('CurvePlainPoolLPMock');

  const totalSupply = new bn(1000000000).multipliedBy(new bn(10).pow(18)).toFixed(0);
  await deploy('CurveMetaPoolLPMock', {
    contract: 'automates/utils/ERC20Mock.sol:ERC20Mock',
    args: ['CurveMetaPoolMock', 'MetaPool', totalSupply],
  });
  const lpToken = await get('CurveMetaPoolLPMock');

  await deploy('CurveMetaPoolMock', {
    contract: 'automates/curve/mock/MetaPoolMock.sol:MetaPoolMock',
    args: [lpToken.address, [wbtc, plainPoolLpToken.address]],
  });
  const pool = await get('CurveMetaPoolMock');
  await execute('CurveMetaPoolLPMock', {}, 'transfer', pool.address, totalSupply);
});
module.exports.tags = ['Mock', 'Curve'];

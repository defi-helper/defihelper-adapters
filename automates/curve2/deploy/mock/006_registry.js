const { migration } = require('../utils');

module.exports = migration(async ({ utils: { deploy, get, execute } }) => {
  const zero = '0x0000000000000000000000000000000000000000';
  const dai = '0xc2118d4d90b274016cB7a54c03EF52E6c537D957';
  const usdc = '0x0D9C8723B343A8368BebE0B5E89273fF8D712e3C';
  const usdt = '0x516de3a7a567d81737e3a46ec4ff9cfd1fcb0136';
  const wbtc = '0xbde8bb00a7ef67007a96945b3a3621177b615c44';
  const plainPool = await get('CurvePlainPoolMock');
  const plainPoolLP = await get('CurvePlainPoolLPMock');
  const metaPool = await get('CurveMetaPoolMock');
  const metaPoolLP = await get('CurveMetaPoolLPMock');

  await deploy('CurveRegistryMock', {
    contract: 'automates/curve/mock/RegistryMock.sol:RegistryMock',
  });
  await execute('CurveRegistryMock', {}, 'addPool', plainPool.address, {
    n: 3,
    coins: [dai, usdc, usdt, zero, zero, zero, zero, zero],
    lp: plainPoolLP.address,
  });
  await execute('CurveRegistryMock', {}, 'addPool', metaPool.address, {
    n: 2,
    coins: [wbtc, plainPoolLP.address, zero, zero, zero, zero, zero, zero],
    lp: metaPoolLP.address,
  });
});
module.exports.tags = ['Mock', 'Curve'];

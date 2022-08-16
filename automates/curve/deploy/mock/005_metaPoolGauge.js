const { migration } = require('../utils');

module.exports = migration(async ({ utils: { deploy, get } }) => {
  const minter = await get('CurveMinterMock');
  const crv = await get('CurveTokenMock');
  const lpToken = await get('CurveMetaPoolLPMock');

  await deploy('CurveMetaPoolGaugeMock', {
    contract: 'automates/curve/mock/GaugeMock.sol:GaugeMock',
    args: [minter.address, crv.address, lpToken.address],
  });
});
module.exports.tags = ['Mock', 'Curve'];

const { migration } = require('../../utils');

module.exports = migration(async ({ utils: { deploy, get } }) => {
  const minter = await get('CurveMinterMock');
  const crv = await get('CurveTokenMock');
  const lpToken = await get('CurvePlainPoolLPMock');

  await deploy('CurvePlainPoolGaugeMock', {
    contract: 'automates/curve/mock/GaugeMock.sol:GaugeMock',
    args: [minter.address, crv.address, lpToken.address],
  });
});
module.exports.tags = ['Mock', 'Curve'];

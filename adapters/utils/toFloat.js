const { bn } = require('../lib');

module.exports = {
  toFloat: (n, decimals) => new bn(n.toString()).div(new bn(10).pow(decimals)),
};

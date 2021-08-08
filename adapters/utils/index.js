const { ethereum } = require('./ethereum');
const { waves } = require('./waves');
const { coingecko } = require('./coingecko');
const { masterChef } = require('./masterChef/masterChef');
const staking = require('./staking');
const { tokens } = require('./tokens');
const { toFloat } = require('./toFloat');

module.exports = {
  toFloat,
  tokens,
  ethereum,
  waves,
  coingecko,
  masterChef,
  staking,
};

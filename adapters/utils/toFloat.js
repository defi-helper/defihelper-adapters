const bn = require("bignumber.js");

module.exports = {
    toFloat: (n, decimals) => new bn(n.toString()).div(new bn(10).pow(decimals)),
}
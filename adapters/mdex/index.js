const { masterChef } = require("../utils");
const masterChefABI = require("./masterChefABI.json");
const masterChefPools = require("./masterChiefPools.json");

const masterChefAddress = "0xc48fe252aa631017df253578b1405ea399728a50";

module.exports = {
    //For instance: '0xcf7ca5e4968CF0d1dD26645e4cf3Cf4ED86b867F'
    masterChef: masterChef(
        masterChefAddress,
        'mdx',
        masterChefABI,
        masterChefPools,
        [],
    ),
};

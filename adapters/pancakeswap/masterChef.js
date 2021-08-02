const { masterChef } = require("../utils");
const masterChefABI = require("./masterChefABI.json");
const masterChefPools = require("./masterChefPools.json");

const masterChefAddress = "0x73feaa1ee314f8c655e354234017be2193c9e24e";

module.exports = {
    //For instance: '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16'
    masterChef: masterChef(
        masterChefAddress,
        'cake',
        masterChefABI,
        masterChefPools,
        [0],
    ),
};

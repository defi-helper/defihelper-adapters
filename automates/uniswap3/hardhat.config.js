const config = require('../../hardhat.config');
const path = require('path');

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    ...config,
  paths: {
    sources: path.resolve(__dirname, './contracts'),
    cache: path.resolve(__dirname, './artifacts/cache'),
    artifacts: path.resolve(__dirname, './artifacts/build'),
    deployments: path.resolve(__dirname, './artifacts/deploy'),
    tests: path.resolve(__dirname, './test'),
    deploy: path.resolve(__dirname, './deploy')
  },
};

const config = require('../../hardhat.config');
const path = require('path');

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    ...config,
  networks: {
    ...config.networks,
    hardhat: {
      blockGasLimit: 10000000,
      accounts: {
        mnemonic: process.env.ETH_MNEMONIC || '',
      },
      forking: {
        //url: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
        url: 'https://nameless-icy-night.optimism.quiknode.pro/44959fc074ae21c0ba41605b8fa770acd746f279/'
        //url: 'https://lively-prettiest-frost.matic.quiknode.pro/8d5c554471b2e3d33125e962d1ce0d58bb83eab0/'
      }
    },
  },
  paths: {
    sources: path.resolve(__dirname, './contracts'),
    cache: path.resolve(__dirname, './artifacts/cache'),
    artifacts: path.resolve(__dirname, './artifacts/build'),
    deployments: path.resolve(__dirname, './artifacts/deploy'),
    tests: path.resolve(__dirname, './test'),
    deploy: path.resolve(__dirname, './deploy')
  },
};

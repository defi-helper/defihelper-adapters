require('@nomiclabs/hardhat-ethers');
require('hardhat-deploy');
require('dotenv').config();

function maybeAccount(account) {
  return account ? [account] : [];
}

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: '0.8.6',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: './automates',
    artifacts: './automates-public/ethereum/build',
    tests: './automates',
    deployments: './automates-public/ethereum/deployment',
  },
  networks: {
    hardhat: {
      blockGasLimit: 10000000,
      accounts: {
        mnemonic: process.env.ETH_MNEMONIC || '',
      },
    },
    local: {
      url: 'http://127.0.0.1:8545',
      chainId: 31337,
      gasPrice: 1_000_000_000,
      accounts: {
        mnemonic: process.env.ETH_MNEMONIC || '',
      },
    },
    main: {
      url: process.env.ETH_MAIN_NODE || 'http://127.0.0.1:8545',
      chainId: 1,
      gasPrice: 12_000_000_000,
      blockGasLimit: 6_000_000,
      accounts: [...maybeAccount(process.env.ETH_MAIN_DEPLOYER)],
    },
    ropsten: {
      url: process.env.ETH_ROPSTEN_NODE || 'http://127.0.0.1:8545',
      chainId: 3,
      gasPrice: 2_000_000_000,
      blockGasLimit: 6_000_000,
      accounts: [...maybeAccount(process.env.ETH_ROPSTEN_DEPLOYER)],
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0,
      3: 0,
      56: 0,
    },
  },
};

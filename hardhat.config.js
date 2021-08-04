require('@nomiclabs/hardhat-ethers')
require('dotenv').config()

function maybeAccount(account) {
  return account ? [account] : []
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
        runs: 200
      }
    }
  },
  paths: {
    sources: './automates',
    artifacts: './automates-public/ethereum'
  },
  networks: {
    hardhat: {
      blockGasLimit: 10000000,
      accounts: {
        mnemonic: process.env.ETH_MNEMONIC || ''
      }
    },
    local: {
      url: 'http://127.0.0.1:8545',
      gasPrice: 12000000000,
      accounts: {
        mnemonic: process.env.ETH_MNEMONIC || ''
      }
    }
  }
}

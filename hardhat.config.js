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
        runs: 1_000_000,
      },
      metadata: {
        bytecodeHash: "none",
      },
    },
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
      gasPrice: 60_000_000_000,
      blockGasLimit: 2_000_000,
      accounts: [...maybeAccount(process.env.ETH_MAIN_DEPLOYER)],
    },
    ropsten: {
      url: process.env.ETH_ROPSTEN_NODE || 'http://127.0.0.1:8545',
      chainId: 3,
      gasPrice: 2_000_000_000,
      blockGasLimit: 6_000_000,
      accounts: [...maybeAccount(process.env.ETH_ROPSTEN_DEPLOYER)],
    },
    bsc: {
      url: process.env.BSC_NODE || 'http://127.0.0.1:8545',
      chainId: 56,
      gasPrice: 7_000_000_000,
      blockGasLimit: 6_000_000,
      accounts: [...maybeAccount(process.env.BSC_DEPLOYER)],
    },
    bscTest: {
      url: process.env.BSC_TEST_NODE || 'http://127.0.0.1:8545',
      chainId: 97,
      gasPrice: 10_000_000_000,
      blockGasLimit: 6_000_000,
      accounts: [...maybeAccount(process.env.BSC_TEST_DEPLOYER)],
    },
    avalanche: {
      url: process.env.AVALANCHE_NODE || 'http://127.0.0.1:8545',
      chainId: 43114,
      gasPrice: 25_000_000_000,
      blockGasLimit: 8_000_000,
      accounts: [...maybeAccount(process.env.AVALANCHE_DEPLOYER)],
    },
    avalancheTest: {
      url: process.env.AVALANCHE_TEST_NODE || 'http://127.0.0.1:8545',
      chainId: 43113,
      gasPrice: 25_000_000_000,
      blockGasLimit: 8_000_000,
      accounts: [...maybeAccount(process.env.AVALANCHE_TEST_DEPLOYER)],
    },
    moonriver: {
      url: process.env.MOONRIVER_NODE || 'http://127.0.0.1:8545',
      chainId: 1285,
      gasPrice: 1_000_000_000,
      blockGasLimit: 15_000_000,
      accounts: [...maybeAccount(process.env.MOONRIVER_DEPLOYER)],
    },
    moonbaseAlpha: {
      url: process.env.MOONBASE_ALPHA_NODE || 'http://127.0.0.1:8545',
      chainId: 1287,
      gasPrice: 1_000_000_000,
      blockGasLimit: 15_000_000,
      accounts: [...maybeAccount(process.env.MOONBASE_ALPHA_DEPLOYER)],
    },
    optimistic: {
      url: process.env.OPTIMISTIC_NODE || "http://127.0.0.1:8545",
      chainId: 10,
      gasPrice: 1_000_000,
      blockGasLimit: 6_000_000,
      accounts: [...maybeAccount(process.env.OPTIMISTIC_DEPLOYER)],
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0,
      3: 0,
      56: 0,
      97: 0,
      43113: 0,
      43114: 0,
    },
  },
};

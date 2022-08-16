var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var lib = {
  env: {"CACHE_HOST":"https://adapters-local.defihelper.info/cache"},
  bn: commonjsGlobal.bignumber,
  dayjs: commonjsGlobal.dayjs,
  axios: commonjsGlobal.axios,
  ethers: commonjsGlobal.ethers,
  ethersMulticall: commonjsGlobal.ethersMulticall,
  wavesSigner: commonjsGlobal.wavesSigner,
  wavesSeedProvider: commonjsGlobal.wavesSeedProvider,
  wavesTransaction: commonjsGlobal.wavesTransaction,
};

const { ethers: ethers$3, dayjs, axios } = lib;

const errorHandler = (e) => {
  const { method, url } = e.config;
  throw new Error(`coingecko ${method} ${url}: ${e}`);
};

class CoingeckoProvider$1 {
  static platformMap = {
    1: 'ethereum',
    56: 'binance-smart-chain',
    128: 'huobi-token',
    137: 'polygon-pos',
    250: 'fantom',
    1285: 'moonriver',
    43114: 'avalanche',
  };

  static defaultApiURL = 'https://coingecko.defihelper.io/api/v3';

  /**
   * @param {{
   *  block: {
   *   timestamp: number;
   *  };
   *  blockTag: 'latest' | number;
   *  platform?: string;
   * }} network
   * @param {string} apiURL;
   */
  constructor(
    { block, blockTag, platform = CoingeckoProvider$1.platformMap[1] },
    apiURL = CoingeckoProvider$1.defaultApiURL
  ) {
    this.network = {
      block,
      blockTag,
      platform,
    };
    this.apiURL = apiURL;
  }

  /**
   *
   * @param {number} chainId
   *
   * @returns {CoingeckoProvider}
   */
  initPlatform(chainId) {
    this.network.platform = CoingeckoProvider$1.platformMap[chainId];

    return this;
  }

  /**
   *
   * @param {string} id
   * @returns {Promise<string>}
   */
  async price(id) {
    if (this.network.blockTag === 'latest') {
      const { data } = await axios.get(`${this.apiURL}/simple/price?ids=${id}&vs_currencies=usd`).catch(errorHandler);
      if (typeof data[id] !== 'object' || data[id].usd === undefined) {
        throw new Error(`Price for "coingecko:${id}" not resolved`);
      }

      return data[id].usd;
    } else {
      const date = dayjs(this.network.block.timestamp).format('DD-MM-YYYY');
      const { data } = await axios.get(`${this.apiURL}/coins/${id}/history?date=${date}`).catch(errorHandler);
      if (
        data.market_data === undefined ||
        data.market_data.current_price === undefined ||
        data.market_data.current_price.usd === undefined
      ) {
        throw new Error(`Price for "coingecko:${id}" not resolved`);
      }

      return data.market_data.current_price.usd;
    }
  }

  /**
   *
   * @param {string} address
   * @returns {Promise<string>}
   */
  async contractPrice(address) {
    address = address.toLowerCase();

    if (this.network.blockTag === 'latest') {
      const { data } = await axios
        .get(
          `${this.apiURL}/simple/token_price/${this.network.platform}?contract_addresses=${address}&vs_currencies=usd`
        )
        .catch(errorHandler);
      if (typeof data !== 'object' || data[address] === undefined || data[address].usd === undefined) {
        throw new Error(`Price for "coingecko:${address}" not resolved`);
      }

      return data[address].usd;
    } else {
      const { data: contractInfo } = await axios
        .get(`${this.apiURL}/coins/${this.network.platform}/contract/${address}`)
        .catch(errorHandler);
      if (typeof contractInfo !== 'object' || contractInfo.id === undefined) {
        throw new Error(`Contract id for "coingecko:${address}" not resolved`);
      }

      return this.price(contractInfo.id);
    }
  }
}

/**
 * @param {{
 *   [address: string]:
 *     {
 *       platform: string;
 *       address: string;
 *     }
 *     | {
 *       id: string;
 *     }
 * }} aliases
 * @param {string | number} blockTag
 * @param {{timestamp: number}} block
 * @param {number} network
 * @returns {Promise<string>}
 */
function bridgeWrapperBuild$1(aliases, blockTag, block, network) {
  return (address) => {
    const alias = aliases[address.toLowerCase()] ?? aliases[ethers$3.utils.getAddress(address)];
    if (typeof alias === 'object') {
      return typeof alias.id === 'string'
        ? new CoingeckoProvider$1({ block, blockTag }).price(alias.id)
        : new CoingeckoProvider$1({ block, blockTag, platform: alias.platform }).contractPrice(alias.address);
    }

    return new CoingeckoProvider$1({ block, blockTag }).initPlatform(network).contractPrice(address);
  };
}

var coingecko = {
  CoingeckoProvider: CoingeckoProvider$1,
  bridgeWrapperBuild: bridgeWrapperBuild$1,
};

var require$$1$2 = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "Approval",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "Transfer",
		type: "event"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				internalType: "address",
				name: "spender",
				type: "address"
			}
		],
		name: "allowance",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "approve",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "account",
				type: "address"
			}
		],
		name: "balanceOf",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "decimals",
		outputs: [
			{
				internalType: "uint8",
				name: "",
				type: "uint8"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "name",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "symbol",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "totalSupply",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "transfer",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "transferFrom",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	}
];

var require$$2$1 = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "previousOwner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "newOwner",
				type: "address"
			}
		],
		name: "OwnershipTransferred",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "key",
				type: "bytes32"
			}
		],
		name: "Updated",
		type: "event"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "key",
				type: "bytes32"
			}
		],
		name: "deleteAddress",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "key",
				type: "bytes32"
			}
		],
		name: "deleteBool",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "key",
				type: "bytes32"
			}
		],
		name: "deleteBytes",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "key",
				type: "bytes32"
			}
		],
		name: "deleteInt",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "key",
				type: "bytes32"
			}
		],
		name: "deleteString",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "key",
				type: "bytes32"
			}
		],
		name: "deleteUint",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "key",
				type: "bytes32"
			}
		],
		name: "getAddress",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "key",
				type: "bytes32"
			}
		],
		name: "getBool",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "key",
				type: "bytes32"
			}
		],
		name: "getBytes",
		outputs: [
			{
				internalType: "bytes",
				name: "",
				type: "bytes"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "key",
				type: "bytes32"
			}
		],
		name: "getInt",
		outputs: [
			{
				internalType: "int256",
				name: "",
				type: "int256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "key",
				type: "bytes32"
			}
		],
		name: "getString",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "key",
				type: "bytes32"
			}
		],
		name: "getUint",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "owner",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "renounceOwnership",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "key",
				type: "bytes32"
			},
			{
				internalType: "address",
				name: "value",
				type: "address"
			}
		],
		name: "setAddress",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "key",
				type: "bytes32"
			},
			{
				internalType: "bool",
				name: "value",
				type: "bool"
			}
		],
		name: "setBool",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "key",
				type: "bytes32"
			},
			{
				internalType: "bytes",
				name: "value",
				type: "bytes"
			}
		],
		name: "setBytes",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "key",
				type: "bytes32"
			},
			{
				internalType: "int256",
				name: "value",
				type: "int256"
			}
		],
		name: "setInt",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "key",
				type: "bytes32"
			},
			{
				internalType: "string",
				name: "value",
				type: "string"
			}
		],
		name: "setString",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "key",
				type: "bytes32"
			},
			{
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "setUint",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "newOwner",
				type: "address"
			}
		],
		name: "transferOwnership",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	}
];

var require$$3 = [
	{
		inputs: [
		],
		payable: false,
		stateMutability: "nonpayable",
		type: "constructor"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "Approval",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount0",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount1",
				type: "uint256"
			},
			{
				indexed: true,
				internalType: "address",
				name: "to",
				type: "address"
			}
		],
		name: "Burn",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount0",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount1",
				type: "uint256"
			}
		],
		name: "Mint",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount0In",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount1In",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount0Out",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount1Out",
				type: "uint256"
			},
			{
				indexed: true,
				internalType: "address",
				name: "to",
				type: "address"
			}
		],
		name: "Swap",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint112",
				name: "reserve0",
				type: "uint112"
			},
			{
				indexed: false,
				internalType: "uint112",
				name: "reserve1",
				type: "uint112"
			}
		],
		name: "Sync",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "Transfer",
		type: "event"
	},
	{
		constant: true,
		inputs: [
		],
		name: "DOMAIN_SEPARATOR",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: true,
		inputs: [
		],
		name: "MINIMUM_LIQUIDITY",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: true,
		inputs: [
		],
		name: "PERMIT_TYPEHASH",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: true,
		inputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			},
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		name: "allowance",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: false,
		inputs: [
			{
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "approve",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		payable: false,
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		constant: true,
		inputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		name: "balanceOf",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: false,
		inputs: [
			{
				internalType: "address",
				name: "to",
				type: "address"
			}
		],
		name: "burn",
		outputs: [
			{
				internalType: "uint256",
				name: "amount0",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amount1",
				type: "uint256"
			}
		],
		payable: false,
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		constant: true,
		inputs: [
		],
		name: "decimals",
		outputs: [
			{
				internalType: "uint8",
				name: "",
				type: "uint8"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: true,
		inputs: [
		],
		name: "factory",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: true,
		inputs: [
		],
		name: "getReserves",
		outputs: [
			{
				internalType: "uint112",
				name: "_reserve0",
				type: "uint112"
			},
			{
				internalType: "uint112",
				name: "_reserve1",
				type: "uint112"
			},
			{
				internalType: "uint32",
				name: "_blockTimestampLast",
				type: "uint32"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: false,
		inputs: [
			{
				internalType: "address",
				name: "_token0",
				type: "address"
			},
			{
				internalType: "address",
				name: "_token1",
				type: "address"
			}
		],
		name: "initialize",
		outputs: [
		],
		payable: false,
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		constant: true,
		inputs: [
		],
		name: "kLast",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: false,
		inputs: [
			{
				internalType: "address",
				name: "to",
				type: "address"
			}
		],
		name: "mint",
		outputs: [
			{
				internalType: "uint256",
				name: "liquidity",
				type: "uint256"
			}
		],
		payable: false,
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		constant: true,
		inputs: [
		],
		name: "name",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: true,
		inputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		name: "nonces",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: false,
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "value",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			},
			{
				internalType: "uint8",
				name: "v",
				type: "uint8"
			},
			{
				internalType: "bytes32",
				name: "r",
				type: "bytes32"
			},
			{
				internalType: "bytes32",
				name: "s",
				type: "bytes32"
			}
		],
		name: "permit",
		outputs: [
		],
		payable: false,
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		constant: true,
		inputs: [
		],
		name: "price0CumulativeLast",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: true,
		inputs: [
		],
		name: "price1CumulativeLast",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: false,
		inputs: [
			{
				internalType: "address",
				name: "to",
				type: "address"
			}
		],
		name: "skim",
		outputs: [
		],
		payable: false,
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		constant: false,
		inputs: [
			{
				internalType: "uint256",
				name: "amount0Out",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amount1Out",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "bytes",
				name: "data",
				type: "bytes"
			}
		],
		name: "swap",
		outputs: [
		],
		payable: false,
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		constant: true,
		inputs: [
		],
		name: "symbol",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: false,
		inputs: [
		],
		name: "sync",
		outputs: [
		],
		payable: false,
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		constant: true,
		inputs: [
		],
		name: "token0",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: true,
		inputs: [
		],
		name: "token1",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: true,
		inputs: [
		],
		name: "totalSupply",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: false,
		inputs: [
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "transfer",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		payable: false,
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		constant: false,
		inputs: [
			{
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "transferFrom",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		payable: false,
		stateMutability: "nonpayable",
		type: "function"
	}
];

var require$$4 = [
	{
		inputs: [
			{
				internalType: "address",
				name: "_factory",
				type: "address"
			},
			{
				internalType: "address",
				name: "_WETH",
				type: "address"
			}
		],
		stateMutability: "nonpayable",
		type: "constructor"
	},
	{
		inputs: [
		],
		name: "WETH",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "tokenA",
				type: "address"
			},
			{
				internalType: "address",
				name: "tokenB",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amountADesired",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountBDesired",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountAMin",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountBMin",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			}
		],
		name: "addLiquidity",
		outputs: [
			{
				internalType: "uint256",
				name: "amountA",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountB",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "liquidity",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amountTokenDesired",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountTokenMin",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountETHMin",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			}
		],
		name: "addLiquidityETH",
		outputs: [
			{
				internalType: "uint256",
				name: "amountToken",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountETH",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "liquidity",
				type: "uint256"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "factory",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amountOut",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "reserveIn",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "reserveOut",
				type: "uint256"
			}
		],
		name: "getAmountIn",
		outputs: [
			{
				internalType: "uint256",
				name: "amountIn",
				type: "uint256"
			}
		],
		stateMutability: "pure",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amountIn",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "reserveIn",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "reserveOut",
				type: "uint256"
			}
		],
		name: "getAmountOut",
		outputs: [
			{
				internalType: "uint256",
				name: "amountOut",
				type: "uint256"
			}
		],
		stateMutability: "pure",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amountOut",
				type: "uint256"
			},
			{
				internalType: "address[]",
				name: "path",
				type: "address[]"
			}
		],
		name: "getAmountsIn",
		outputs: [
			{
				internalType: "uint256[]",
				name: "amounts",
				type: "uint256[]"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amountIn",
				type: "uint256"
			},
			{
				internalType: "address[]",
				name: "path",
				type: "address[]"
			}
		],
		name: "getAmountsOut",
		outputs: [
			{
				internalType: "uint256[]",
				name: "amounts",
				type: "uint256[]"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amountA",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "reserveA",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "reserveB",
				type: "uint256"
			}
		],
		name: "quote",
		outputs: [
			{
				internalType: "uint256",
				name: "amountB",
				type: "uint256"
			}
		],
		stateMutability: "pure",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "tokenA",
				type: "address"
			},
			{
				internalType: "address",
				name: "tokenB",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "liquidity",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountAMin",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountBMin",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			}
		],
		name: "removeLiquidity",
		outputs: [
			{
				internalType: "uint256",
				name: "amountA",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountB",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "liquidity",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountTokenMin",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountETHMin",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			}
		],
		name: "removeLiquidityETH",
		outputs: [
			{
				internalType: "uint256",
				name: "amountToken",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountETH",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "liquidity",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountTokenMin",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountETHMin",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			}
		],
		name: "removeLiquidityETHSupportingFeeOnTransferTokens",
		outputs: [
			{
				internalType: "uint256",
				name: "amountETH",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "liquidity",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountTokenMin",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountETHMin",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			},
			{
				internalType: "bool",
				name: "approveMax",
				type: "bool"
			},
			{
				internalType: "uint8",
				name: "v",
				type: "uint8"
			},
			{
				internalType: "bytes32",
				name: "r",
				type: "bytes32"
			},
			{
				internalType: "bytes32",
				name: "s",
				type: "bytes32"
			}
		],
		name: "removeLiquidityETHWithPermit",
		outputs: [
			{
				internalType: "uint256",
				name: "amountToken",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountETH",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "liquidity",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountTokenMin",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountETHMin",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			},
			{
				internalType: "bool",
				name: "approveMax",
				type: "bool"
			},
			{
				internalType: "uint8",
				name: "v",
				type: "uint8"
			},
			{
				internalType: "bytes32",
				name: "r",
				type: "bytes32"
			},
			{
				internalType: "bytes32",
				name: "s",
				type: "bytes32"
			}
		],
		name: "removeLiquidityETHWithPermitSupportingFeeOnTransferTokens",
		outputs: [
			{
				internalType: "uint256",
				name: "amountETH",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "tokenA",
				type: "address"
			},
			{
				internalType: "address",
				name: "tokenB",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "liquidity",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountAMin",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountBMin",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			},
			{
				internalType: "bool",
				name: "approveMax",
				type: "bool"
			},
			{
				internalType: "uint8",
				name: "v",
				type: "uint8"
			},
			{
				internalType: "bytes32",
				name: "r",
				type: "bytes32"
			},
			{
				internalType: "bytes32",
				name: "s",
				type: "bytes32"
			}
		],
		name: "removeLiquidityWithPermit",
		outputs: [
			{
				internalType: "uint256",
				name: "amountA",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountB",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amountOut",
				type: "uint256"
			},
			{
				internalType: "address[]",
				name: "path",
				type: "address[]"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			}
		],
		name: "swapETHForExactTokens",
		outputs: [
			{
				internalType: "uint256[]",
				name: "amounts",
				type: "uint256[]"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amountOutMin",
				type: "uint256"
			},
			{
				internalType: "address[]",
				name: "path",
				type: "address[]"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			}
		],
		name: "swapExactETHForTokens",
		outputs: [
			{
				internalType: "uint256[]",
				name: "amounts",
				type: "uint256[]"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amountOutMin",
				type: "uint256"
			},
			{
				internalType: "address[]",
				name: "path",
				type: "address[]"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			}
		],
		name: "swapExactETHForTokensSupportingFeeOnTransferTokens",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amountIn",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountOutMin",
				type: "uint256"
			},
			{
				internalType: "address[]",
				name: "path",
				type: "address[]"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			}
		],
		name: "swapExactTokensForETH",
		outputs: [
			{
				internalType: "uint256[]",
				name: "amounts",
				type: "uint256[]"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amountIn",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountOutMin",
				type: "uint256"
			},
			{
				internalType: "address[]",
				name: "path",
				type: "address[]"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			}
		],
		name: "swapExactTokensForETHSupportingFeeOnTransferTokens",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amountIn",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountOutMin",
				type: "uint256"
			},
			{
				internalType: "address[]",
				name: "path",
				type: "address[]"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			}
		],
		name: "swapExactTokensForTokens",
		outputs: [
			{
				internalType: "uint256[]",
				name: "amounts",
				type: "uint256[]"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amountIn",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountOutMin",
				type: "uint256"
			},
			{
				internalType: "address[]",
				name: "path",
				type: "address[]"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			}
		],
		name: "swapExactTokensForTokensSupportingFeeOnTransferTokens",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amountOut",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountInMax",
				type: "uint256"
			},
			{
				internalType: "address[]",
				name: "path",
				type: "address[]"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			}
		],
		name: "swapTokensForExactETH",
		outputs: [
			{
				internalType: "uint256[]",
				name: "amounts",
				type: "uint256[]"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amountOut",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountInMax",
				type: "uint256"
			},
			{
				internalType: "address[]",
				name: "path",
				type: "address[]"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			}
		],
		name: "swapTokensForExactTokens",
		outputs: [
			{
				internalType: "uint256[]",
				name: "amounts",
				type: "uint256[]"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	}
];

const { ethers: ethers$2, bn: bn$4, ethersMulticall } = lib;
const ERC20ABI = require$$1$2;
const DFHStorageABI = require$$2$1;
const UniswapPairABI = require$$3;
const UniswapRouterABI = require$$4;

const ethereum$3 = {
  abi: {
    ERC20ABI,
    UniswapPairABI,
    UniswapRouterABI,
  },
  defaultOptions: () => ({
    blockNumber: 'latest',
    signer: null,
  }),
  getAvgBlockTime: async (provider, blockNumber) => {
    const interval = 30000;
    const currentBlockNumber = blockNumber || (await provider.getBlockNumber());
    const [fiftyBlockEarlier, currentBlock] = await Promise.all([
      provider.getBlock(currentBlockNumber - interval),
      provider.getBlock(currentBlockNumber),
    ]);

    return (
      (1000 * (currentBlock.timestamp - fiftyBlockEarlier.timestamp)) / (currentBlock.number - fiftyBlockEarlier.number)
    );
  },
  erc20: (provider, address) => new ethers$2.Contract(address, ERC20ABI, provider),
  erc20Info: async (provider, address, options = ethereum$3.defaultOptions()) => {
    const multicall = new ethersMulticall.Provider(provider);
    await multicall.init();
    const multicallToken = new ethersMulticall.Contract(address, ERC20ABI);
    const [name, symbol, decimals, totalSupply] = await multicall.all(
      [multicallToken.name(), multicallToken.symbol(), multicallToken.decimals(), multicallToken.totalSupply()],
      { blockTag: options.blockNumber }
    );

    return {
      name,
      symbol,
      decimals: decimals.toString(),
      totalSupply: totalSupply.toString(),
    };
  },
  erc20ApproveAll: async (erc20, owner, spender, value) => {
    const allowance = await erc20.allowance(owner, spender).then((v) => v.toString());
    if (new bn$4(allowance).isGreaterThanOrEqualTo(value)) return;
    if (new bn$4(allowance).isGreaterThan(0)) {
      await erc20.approve(spender, '0').then((tx) => tx.wait());
    }
    return erc20.approve(spender, new bn$4(2).pow(256).minus(1).toFixed(0)).then((tx) => tx.wait());
  },
  dfh: {
    storageABI: DFHStorageABI,
    storage: (provider, address) => new ethers$2.Contract(address, DFHStorageABI, provider),
    storageKey: (k) => ethers$2.utils.keccak256(ethers$2.utils.toUtf8Bytes(k)),
  },
  uniswap: {
    PairInfo: class {
      constructor({
        address,
        token0,
        token0Decimals,
        reserve0,
        token1,
        token1Decimals,
        reserve1,
        totalSupply,
        blockTimestampLast,
      }) {
        this.address = address;
        this.token0 = token0;
        this.token0Decimals = token0Decimals;
        this.reserve0 = reserve0;
        this.token1 = token1;
        this.token1Decimals = token1Decimals;
        this.reserve1 = reserve1;
        this.totalSupply = totalSupply;
        this.blockTimestampLast = blockTimestampLast;
      }

      expandBalance(balance) {
        return {
          token0: new bn$4(balance).multipliedBy(this.reserve0).div(this.totalSupply),
          token1: new bn$4(balance).multipliedBy(this.reserve1).div(this.totalSupply),
        };
      }

      calcPrice(token0Price, token1Price) {
        const reserve0 = new bn$4(this.reserve0).multipliedBy(token0Price);
        const reserve1 = new bn$4(this.reserve1).multipliedBy(token1Price);
        return reserve0.plus(reserve1).div(this.totalSupply);
      }
    },
    pairDecimals: 18,
    pairABI: UniswapPairABI,
    pair: (provider, address) => new ethers$2.Contract(address, UniswapPairABI, provider),
    pairInfo: async (provider, address, options = ethereum$3.defaultOptions()) => {
      const multicall = new ethersMulticall.Provider(provider);
      await multicall.init();
      const multicallPair = new ethersMulticall.Contract(address, UniswapPairABI);
      let [token0, token1, reserves, totalSupply] = await multicall.all(
        [multicallPair.token0(), multicallPair.token1(), multicallPair.getReserves(), multicallPair.totalSupply()],
        { blockTag: options.blockNumber }
      );
      token0 = token0.toLowerCase();
      token1 = token1.toLowerCase();
      const blockTimestampLast = reserves[2];
      totalSupply = new bn$4(totalSupply.toString()).div(new bn$4(10).pow(ethereum$3.uniswap.pairDecimals)).toString();
      let [{ decimals: token0Decimals }, { decimals: token1Decimals }] = await Promise.all([
        ethereum$3.erc20Info(provider, token0, options),
        ethereum$3.erc20Info(provider, token1, options),
      ]);
      token0Decimals = token0Decimals.toString();
      token1Decimals = token1Decimals.toString();
      const reserve0 = new bn$4(reserves[0].toString()).div(new bn$4(10).pow(token0Decimals)).toString(10);
      const reserve1 = new bn$4(reserves[1].toString()).div(new bn$4(10).pow(token1Decimals)).toString(10);

      return new ethereum$3.uniswap.PairInfo({
        token0,
        token0Decimals,
        reserve0,
        token1,
        token1Decimals,
        reserve1,
        blockTimestampLast,
        totalSupply,
      });
    },
    router: (provider, address) => new ethers$2.Contract(address, UniswapRouterABI, provider),
    getPrice: async (router, amountIn, path, options = ethereum$3.defaultOptions()) => {
      try {
        const amountsOut = await router.getAmountsOut(amountIn, path, { blockTag: options.blockNumber });

        return amountsOut[amountsOut.length - 1];
      } catch (e) {
        throw new Error(`Resolver price "${JSON.stringify(path)}" by uniswap router error: ${e}`);
      }
    },
    autoRoute: async (multicall, router, amountIn, from, to, withTokens) => {
      const paths = [
        [from, to],
        ...withTokens.filter((middle) => from !== middle && middle !== to).map((middle) => [from, middle, to]),
      ];
      const amountsOut = await Promise.all(
        paths.map((path) =>
          multicall
            .all([router.getAmountsOut(amountIn, path)])
            .then(([amountsOut]) => amountsOut)
            .catch((_) => path.map((_) => '0'))
        )
      );

      return amountsOut.reduce(
        (result, amountsOut, i) => {
          const amountOut = amountsOut[amountsOut.length - 1].toString();
          if (new bn$4(result.amountOut).isGreaterThanOrEqualTo(amountOut)) return result;

          return { path: [from, withTokens[i - 1], to], amountOut };
        },
        { path: [from, to], amountOut: amountsOut[0][1].toString() }
      );
    },
  },
};

var ethereum_1 = {
  ethereum: ethereum$3,
};

const { bn: bn$3 } = lib;

var toFloat$1 = {
  toFloat: (n, decimals) => new bn$3(n.toString()).div(new bn$3(10).pow(decimals)),
};

const { bn: bn$2 } = lib;

const tokens$1 = (...tokens) =>
  tokens.reduce((prev, { token, data }) => {
    if (prev[token]) {
      return {
        ...prev,
        [token]: Object.entries(data).reduce(
          (prev, [k, v]) => ({
            ...prev,
            [k]: prev[k] ? new bn$2(prev[k]).plus(v).toString(10) : v,
          }),
          prev[token]
        ),
      };
    } else {
      return { ...prev, [token]: data };
    }
  }, {});

var tokens_1 = {
  tokens: tokens$1,
};

var require$$1$1 = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "prototype",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "proxy",
				type: "address"
			}
		],
		name: "ProxyCreated",
		type: "event"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "prototype",
				type: "address"
			},
			{
				internalType: "bytes",
				name: "args",
				type: "bytes"
			}
		],
		name: "create",
		outputs: [
			{
				internalType: "address",
				name: "proxy",
				type: "address"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	}
];

const { ethers: ethers$1 } = lib;
const ProxyFactoryABI = require$$1$1;

/**
 * @typedef {{
 *  type: 'text';
 * 	placeholder: string;
 * 	value: string;
 * }} TextInput
 */
/**
 * @typedef {{
 *  type: 'radio';
 * 	placeholder?: string;
 *  value: string;
 * 	options: Array<{
 *    value: string;
 *    label: string;
 *  }>;
 * }} RadioInput
 */
/**
 * @typedef {{
 *  type: 'select';
 * 	placeholder?: string;
 *  value: string;
 * 	options: Array<{
 *    value: string;
 *    label: string;
 *  }>;
 * }} SelectInput
 */
/**
 * @typedef {TextInput | RadioInput | SelectInput} Input
 */

/**
 * @param {{
 * 	placeholder?: string;
 * 	value?: string;
 * }} args
 * @returns {TextInput}
 */
const input = ({ placeholder = '', value = '' }) => ({ type: 'text', placeholder, value });

/**
 * @param {{
 * 	placeholder?: string;
 * 	value?: string;
 *  options?: Array<{
 *    value: string;
 *    label: string;
 *  }>;
 * }} args
 * @returns {RadioInput}
 */
const radio = ({ placeholder = '', value = '', options = [] }) => ({ type: 'radio', placeholder, value, options });

/**
 * @param {{
 * 	placeholder?: string;
 * 	value?: string;
 *  options?: Array<{
 *    value: string;
 *    label: string;
 *  }>;
 * }} args
 * @returns {SelectInput}
 */
const select = ({ placeholder = '', value = '', options = [] }) => ({ type: 'select', placeholder, value, options });

/**
 * @typedef {{
 * 	description: string;
 * 	inputs?: Input[];
 * }} TabInfo
 */
/**
 * @typedef {{
 *  name: string;
 * 	info: () => Promise<TabInfo>;
 * 	can: (...args: any) => Promise<boolean>;
 * 	send: (...args: any) => Promise<{tx: any}>;
 * }} Tab
 */
/**
 * @param {string} name
 * @param {() => Promise<TabInfo>} info
 * @param {(...args: any[]) => Promise<boolean | Error>} can
 * @param {(...args: any[]) => Promise<{tx}>} send
 */
const tab = (name, info, can, send) => ({ name, info, can, send });

/**
 * @param {string} name
 * @param {{
 *   [m: string]: (...args: any[]) => any;
 * }} methods
 */
const component = (name, methods) => ({ name, methods });

const ethereum$2 = {
  proxyDeploy: async (signer, factoryAddress, prototypeAddress, inputs) => {
    const proxyFactory = new ethers$1.Contract(factoryAddress, ProxyFactoryABI, signer);
    const tx = await proxyFactory.create(prototypeAddress, inputs);

    return {
      tx,
      wait: tx.wait.bind(tx),
      getAddress: async () => {
        const receipt = await tx.wait();
        const proxyCreatedEvent = receipt.logs[0];
        const proxyAddressBytes = proxyCreatedEvent.topics[2];
        const [proxyAddress] = ethers$1.utils.defaultAbiCoder.decode(['address'], proxyAddressBytes);

        return proxyAddress;
      },
    };
  },
};

var actions = {
  ethereum: ethereum$2,
  input,
  select,
  radio,
  tab,
  component,
};

const { bn: bn$1 } = lib;
const { ethereum: ethereum$1 } = ethereum_1;
const { CoingeckoProvider } = coingecko;

class StakingToken {
  /**
   * @param {string} balance
   * @returns {{balance: string, usd: string, token: string}[]}
   */
  reviewBalance(balance) {
    throw new Error('Unimplemented');
  }

  /**
   * @returns {string}
   */
  getUSD() {
    throw new Error('Unimplemented');
  }
}

/**
 * Class definition
 * @property provider
 * @property {string} token
 * @property {number} network
 * @property {string} blockTag
 * @property {string} block
 * @property {string} token0
 * @property {string} token1
 * @property {string} reserve0
 * @property {string} reserve1
 * @property {string} token0Usd
 * @property {string} token1Usd
 * @property {string} totalSupply
 * @property {string} usd
 */
class PairStakingToken extends StakingToken {
  constructor(provider, token, network, blockTag, block) {
    super();
    this.provider = provider;
    this.token = token;
    this.network = network;
    this.blockTag = blockTag;
    this.block = block;
  }

  async init() {
    const { token0, reserve0, token1, reserve1, totalSupply } = await ethereum$1.uniswap.pairInfo(
      this.provider,
      this.token
    );
    const priceFeed = new CoingeckoProvider({ block: this.block, blockTag: this.blockTag }).initPlatform(this.network);
    const token0Usd = await priceFeed.contractPrice(token0);
    const token1Usd = await priceFeed.contractPrice(token1);

    let stakingTokenUSD = new bn$1(reserve0)
      .multipliedBy(token0Usd)
      .plus(new bn$1(reserve1).multipliedBy(token1Usd))
      .div(totalSupply);
    if (!stakingTokenUSD.isFinite()) stakingTokenUSD = new bn$1(0);

    this.token0 = token0;
    this.token1 = token1;
    this.reserve0 = reserve0.toString();
    this.reserve1 = reserve1.toString();
    this.token0Usd = token0Usd.toString();
    this.token1Usd = token1Usd.toString();
    this.totalSupply = totalSupply.toString();
    this.usd = stakingTokenUSD.toString();
  }

  reviewBalance(balance) {
    let token0Balance = new bn$1(balance).multipliedBy(this.reserve0).div(this.totalSupply);
    if (!token0Balance.isFinite()) token0Balance = new bn$1(0);
    const token0BalanceUSD = token0Balance.multipliedBy(this.token0Usd);
    let token1Balance = new bn$1(balance).multipliedBy(this.reserve1).div(this.totalSupply);
    if (!token1Balance.isFinite()) token1Balance = new bn$1(0);
    const token1BalanceUSD = token1Balance.multipliedBy(this.token1Usd);

    return [
      {
        token: this.token0,
        balance: token0Balance.toString(10),
        usd: token0BalanceUSD.toString(10),
      },
      {
        token: this.token1,
        balance: token1Balance.toString(10),
        usd: token1BalanceUSD.toString(10),
      },
    ];
  }

  getUSD() {
    return this.usd;
  }

  static async create(provider, token, network, blockTag, block) {
    const instance = new PairStakingToken(provider, token, network, blockTag, block);
    await instance.init();
    return instance;
  }
}

class ErcStakingToken extends StakingToken {
  constructor(provider, token, network, blockTag, block) {
    super();
    this.provider = provider;
    this.token = token;
    this.network = network;
    this.blockTag = blockTag;
    this.block = block;
  }

  async init() {
    const priceFeed = new CoingeckoProvider({ block: this.block, blockTag: this.blockTag }).initPlatform(this.network);
    let tokenUSD = new bn$1(await priceFeed.contractPrice(this.token));

    if (!tokenUSD.isFinite()) tokenUSD = new bn$1(0);

    this.usd = tokenUSD;
  }

  reviewBalance() {}

  getUSD() {
    return this.usd;
  }

  static async create(provider, token, network, blockTag, block) {
    const instance = new ErcStakingToken(provider, token, network, blockTag, block);
    await instance.init();
    return instance;
  }
}

var masterChefStakingToken = {
  /**
   *
   * @param {!*} provider
   * @param {string} token
   * @param {number} network
   * @param {string} blockTag
   * @param {string} block
   * @returns {Promise<PairStakingToken>}
   */
  getUniPairToken: (provider, token, network, blockTag, block) =>
    PairStakingToken.create(provider, token, network, blockTag, block),
  /**
   *
   * @param {!*} provider
   * @param {string} token
   * @param {number} network
   * @param {string} blockTag
   * @param {string} block
   * @returns {Promise<ErcStakingToken>}
   */
  getPlainToken: (provider, token, network, blockTag, block) =>
    ErcStakingToken.create(provider, token, network, blockTag, block),
  /**
   *
   * @param {!*} provider
   * @param {string} token
   * @param {number} network
   * @param {string} blockTag
   * @param {string} block
   * @returns {Promise<StakingToken>}
   */
  getMasterChefStakingToken: async (provider, token, network, blockTag, block) => {
    try {
      return await PairStakingToken.create(provider, token, network, blockTag, block);
    } catch (e) {
      return ErcStakingToken.create(provider, token, network, blockTag, block);
    }
  },
};

const { ethers, bn } = lib;
const { bridgeWrapperBuild } = coingecko;
const { ethereum } = ethereum_1;
const { toFloat } = toFloat$1;
const { tokens } = tokens_1;
const AutomateActions = actions;
const { getMasterChefStakingToken } = masterChefStakingToken;

var masterChef$1 = {
  /**
   *
   * @param {!string} masterChefAddress
   * @param {!string} rewardTokenFunctionName
   * @param {!*} masterChefABI
   * @param {{index: number, stakingToken: string}[]} masterChefSavedPools
   * @param {number[]} bannedPoolIndexes
   */
  masterChef: (
    masterChefAddress,
    rewardTokenFunctionName,
    masterChefABI,
    masterChefSavedPools,
    bannedPoolIndexes = []
  ) => {
    return async (provider, contractAddress, initOptions = ethereum.defaultOptions()) => {
      const options = {
        ...ethereum.defaultOptions(),
        ...initOptions,
      };
      const blockTag = options.blockNumber === 'latest' ? 'latest' : parseInt(options.blockNumber, 10);
      const network = (await provider.detectNetwork()).chainId;
      const block = await provider.getBlock(blockTag);
      const blockNumber = block.number;
      const priceFeed = bridgeWrapperBuild({}, blockTag, block, network);
      const avgBlockTime = await ethereum.getAvgBlockTime(provider, blockNumber);

      const masterChiefContract = new ethers.Contract(masterChefAddress, masterChefABI, provider);

      let poolIndex = -1;

      let masterChefPools = masterChefSavedPools;
      if (!masterChefSavedPools || masterChefSavedPools.length === 0) {
        const totalPools = await masterChiefContract.poolLength();
        masterChefPools = (
          await Promise.all(new Array(totalPools.toNumber()).fill(1).map((_, i) => masterChiefContract.poolInfo(i)))
        ).map((p, i) => ({
          index: i,
          stakingToken: p.lpToken,
        }));
      }

      const foundPoolIndex = masterChefPools.find(
        (p) => p.stakingToken.toLowerCase() === contractAddress.toLowerCase()
      );

      poolIndex = foundPoolIndex !== undefined ? foundPoolIndex.index : -1;

      if (bannedPoolIndexes.includes(poolIndex) || poolIndex === -1) {
        throw new Error('Pool is not found');
      }
      const pool = await masterChiefContract.poolInfo(poolIndex);

      const stakingToken = contractAddress.toLowerCase();
      const rewardsToken = (await masterChiefContract[rewardTokenFunctionName]()).toLowerCase();

      const [stakingTokenDecimals, rewardsTokenDecimals] = await Promise.all([
        ethereum
          .erc20(provider, stakingToken)
          .decimals()
          .then((res) => Number(res.toString())),
        ethereum
          .erc20(provider, rewardsToken)
          .decimals()
          .then((res) => Number(res.toString())),
      ]);

      const [rewardTokenPerBlock, totalAllocPoint] = await Promise.all([
        (masterChiefContract[`${rewardTokenFunctionName}PerBlock`]
          ? masterChiefContract[`${rewardTokenFunctionName}PerBlock`]
          : masterChiefContract[`${rewardTokenFunctionName}PerSec`])(),
        masterChiefContract.totalAllocPoint(),
      ]);

      const rewardPerBlock = toFloat(
        new bn(pool.allocPoint.toString())
          .multipliedBy(rewardTokenPerBlock.toString())
          .dividedBy(totalAllocPoint.toString()),
        rewardsTokenDecimals
      );
      const rewardTokenUSD = await priceFeed(rewardsToken);

      const totalLocked = toFloat(
        await ethereum.erc20(provider, contractAddress).balanceOf(masterChefAddress),
        stakingTokenDecimals
      );

      const masterChiefStakingToken = await getMasterChefStakingToken(provider, stakingToken, network, blockTag, block);

      const tvl = new bn(totalLocked).multipliedBy(masterChiefStakingToken.getUSD());

      let aprBlock = rewardPerBlock.multipliedBy(rewardTokenUSD).div(tvl);
      if (!aprBlock.isFinite()) aprBlock = new bn(0);

      const blocksPerDay = new bn((1000 * 60 * 60 * 24) / avgBlockTime);
      const aprDay = aprBlock.multipliedBy(blocksPerDay);
      const aprWeek = aprBlock.multipliedBy(blocksPerDay.multipliedBy(7));
      const aprMonth = aprBlock.multipliedBy(blocksPerDay.multipliedBy(30));
      const aprYear = aprBlock.multipliedBy(blocksPerDay.multipliedBy(365));

      return {
        staking: {
          token: stakingToken,
          decimals: stakingTokenDecimals,
        },
        reward: {
          token: rewardsToken,
          decimals: rewardsTokenDecimals,
        },
        metrics: {
          tvl: tvl.toString(10),
          aprDay: aprDay.toString(10),
          aprWeek: aprWeek.toString(10),
          aprMonth: aprMonth.toString(10),
          aprYear: aprYear.toString(10),
          rewardPerDay: rewardPerBlock.multipliedBy(blocksPerDay).toString(),
        },
        wallet: async (walletAddress) => {
          let { amount, rewardDebt } = await masterChiefContract.userInfo(poolIndex, walletAddress);
          const balance = toFloat(amount, ethereum.uniswap.pairDecimals);
          const earned = toFloat(rewardDebt, rewardsTokenDecimals);
          const reviewedBalance = masterChiefStakingToken.reviewBalance(balance.toString(10));

          const earnedUSD = earned.multipliedBy(rewardTokenUSD);

          return {
            staked: reviewedBalance.reduce((res, b) => {
              res[b.token] = {
                balance: b.balance,
                usd: b.usd,
              };
              return res;
            }, {}),
            earned: {
              [rewardsToken]: {
                balance: earned.toString(10),
                usd: earnedUSD.toString(10),
              },
            },
            metrics: {
              staking: balance.toString(10),
              stakingUSD: balance.multipliedBy(masterChiefStakingToken.getUSD()).toString(10),
              earned: earned.toString(10),
              earnedUSD: earnedUSD.toString(10),
            },
            tokens: tokens(
              ...reviewedBalance.map((b) => ({
                token: b.token,
                data: {
                  balance: b.balance,
                  usd: b.usd,
                },
              })),
              {
                token: rewardsToken,
                data: {
                  balance: earned.toString(10),
                  usd: earnedUSD.toString(10),
                },
              }
            ),
          };
        },

        actions: async (walletAddress) => {
          if (options.signer === null) {
            throw new Error('Signer not found, use options.signer for use actions');
          }
          const { signer } = options;
          const stakingTokenContract = ethereum.erc20(provider, stakingToken).connect(signer);
          const stakingContract = masterChiefContract.connect(signer);

          return {
            stake: [
              AutomateActions.tab(
                'Stake',
                async () => ({
                  description: 'Stake your tokens to contract',
                  inputs: [
                    AutomateActions.input({
                      placeholder: 'amount',
                      value: new bn(await stakingTokenContract.balanceOf(walletAddress).then((v) => v.toString()))
                        .div(`1e${stakingTokenDecimals}`)
                        .toString(10),
                    }),
                  ],
                }),
                async (amount) => {
                  const amountInt = new bn(amount).multipliedBy(`1e${stakingTokenDecimals}`);
                  if (amountInt.lte(0)) return Error('Invalid amount');

                  const balance = await stakingTokenContract.balanceOf(walletAddress).then((v) => v.toString());
                  if (amountInt.gt(balance)) return Error('Insufficient funds on the balance');

                  return true;
                },
                async (amount) => {
                  const amountInt = new bn(amount).multipliedBy(`1e${stakingTokenDecimals}`);
                  await ethereum.erc20ApproveAll(
                    stakingTokenContract,
                    walletAddress,
                    masterChefAddress,
                    amountInt.toFixed(0)
                  );

                  return {
                    tx: await stakingContract.deposit(poolIndex, amountInt.toFixed(0)),
                  };
                }
              ),
            ],
            unstake: [
              AutomateActions.tab(
                'Unstake',
                async () => {
                  const userInfo = await stakingContract.userInfo(poolIndex, walletAddress);

                  return {
                    description: 'Unstake your tokens from contract',
                    inputs: [
                      AutomateActions.input({
                        placeholder: 'amount',
                        value: new bn(userInfo.amount.toString()).div(`1e${stakingTokenDecimals}`).toString(10),
                      }),
                    ],
                  };
                },
                async (amount) => {
                  const amountInt = new bn(amount).multipliedBy(`1e${stakingTokenDecimals}`);
                  if (amountInt.lte(0)) return Error('Invalid amount');

                  const userInfo = await stakingContract.userInfo(poolIndex, walletAddress);
                  if (amountInt.isGreaterThan(userInfo.amount.toString())) {
                    return Error('Amount exceeds balance');
                  }

                  return true;
                },
                async (amount) => {
                  const amountInt = new bn(amount).multipliedBy(`1e${stakingTokenDecimals}`);

                  return {
                    tx: await stakingContract.withdraw(poolIndex, amountInt.toFixed(0)),
                  };
                }
              ),
            ],
            claim: [
              AutomateActions.tab(
                'Claim',
                async () => ({
                  description: 'Claim your reward from contract',
                }),
                async () => {
                  const earned = await stakingContract
                    .pendingReward(poolIndex, walletAddress)
                    .then((v) => v.toString());
                  if (new bn(earned).isLessThanOrEqualTo(0)) {
                    return Error('No earnings');
                  }

                  return true;
                },
                async () => ({
                  tx: await stakingContract.deposit(poolIndex, 0),
                })
              ),
            ],
            exit: [
              AutomateActions.tab(
                'Exit',
                async () => ({
                  description: 'Get all tokens from contract',
                }),
                async () => {
                  const earned = await masterChiefContract
                    .pendingReward(poolIndex, walletAddress)
                    .then((v) => v.toString());
                  const userInfo = await stakingContract.userInfo(poolIndex, walletAddress);
                  if (
                    new bn(earned).isLessThanOrEqualTo(0) &&
                    new bn(userInfo.amount.toString()).isLessThanOrEqualTo(0)
                  ) {
                    return Error('No staked');
                  }

                  return true;
                },
                async () => {
                  const userInfo = await stakingContract.userInfo(poolIndex, walletAddress);
                  if (new bn(userInfo.amount.toString()).isGreaterThan(0)) {
                    await stakingContract.withdraw(poolIndex, userInfo.amount.toString()).then((tx) => tx.wait());
                  }

                  return {
                    tx: await stakingContract.deposit(poolIndex, 0),
                  };
                }
              ),
            ],
          };
        },
      };
    };
  },
};

var require$$1 = [
	{
		inputs: [
			{
				internalType: "contract SushiToken",
				name: "_sushi",
				type: "address"
			},
			{
				internalType: "address",
				name: "_devaddr",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "_sushiPerBlock",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "_startBlock",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "_bonusEndBlock",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "constructor"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "user",
				type: "address"
			},
			{
				indexed: true,
				internalType: "uint256",
				name: "pid",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "Deposit",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "user",
				type: "address"
			},
			{
				indexed: true,
				internalType: "uint256",
				name: "pid",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "EmergencyWithdraw",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "previousOwner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "newOwner",
				type: "address"
			}
		],
		name: "OwnershipTransferred",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "user",
				type: "address"
			},
			{
				indexed: true,
				internalType: "uint256",
				name: "pid",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "Withdraw",
		type: "event"
	},
	{
		inputs: [
		],
		name: "BONUS_MULTIPLIER",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_allocPoint",
				type: "uint256"
			},
			{
				internalType: "contract IERC20",
				name: "_lpToken",
				type: "address"
			},
			{
				internalType: "bool",
				name: "_withUpdate",
				type: "bool"
			}
		],
		name: "add",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "bonusEndBlock",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_pid",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "_amount",
				type: "uint256"
			}
		],
		name: "deposit",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_devaddr",
				type: "address"
			}
		],
		name: "dev",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "devaddr",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_pid",
				type: "uint256"
			}
		],
		name: "emergencyWithdraw",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_from",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "_to",
				type: "uint256"
			}
		],
		name: "getMultiplier",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "massUpdatePools",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_pid",
				type: "uint256"
			}
		],
		name: "migrate",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "migrator",
		outputs: [
			{
				internalType: "contract IMigratorChef",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "owner",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_pid",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "_user",
				type: "address"
			}
		],
		name: "pendingSushi",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		name: "poolInfo",
		outputs: [
			{
				internalType: "contract IERC20",
				name: "lpToken",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "allocPoint",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "lastRewardBlock",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "accSushiPerShare",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "poolLength",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "renounceOwnership",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_pid",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "_allocPoint",
				type: "uint256"
			},
			{
				internalType: "bool",
				name: "_withUpdate",
				type: "bool"
			}
		],
		name: "set",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "contract IMigratorChef",
				name: "_migrator",
				type: "address"
			}
		],
		name: "setMigrator",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "startBlock",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "sushi",
		outputs: [
			{
				internalType: "contract SushiToken",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "sushiPerBlock",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "totalAllocPoint",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "newOwner",
				type: "address"
			}
		],
		name: "transferOwnership",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_pid",
				type: "uint256"
			}
		],
		name: "updatePool",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		name: "userInfo",
		outputs: [
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "rewardDebt",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_pid",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "_amount",
				type: "uint256"
			}
		],
		name: "withdraw",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	}
];

var require$$2 = [
	{
		index: 0,
		stakingToken: "0x06da0fd433C1A5d7a4faa01111c044910A184553"
	},
	{
		index: 1,
		stakingToken: "0x397FF1542f962076d0BFE58eA045FfA2d347ACa0"
	},
	{
		index: 2,
		stakingToken: "0xC3D03e4F041Fd4cD388c549Ee2A29a9E5075882f"
	},
	{
		index: 3,
		stakingToken: "0xF1F85b2C54a2bD284B1cf4141D64fD171Bd85539"
	},
	{
		index: 4,
		stakingToken: "0x31503dcb60119A812feE820bb7042752019F2355"
	},
	{
		index: 5,
		stakingToken: "0x5E63360E891BD60C69445970256C260b0A6A54c6"
	},
	{
		index: 6,
		stakingToken: "0xA1d7b2d891e3A1f9ef4bBC5be20630C2FEB1c470"
	},
	{
		index: 7,
		stakingToken: "0x001b6450083E531A5a7Bf310BD2c1Af4247E23D4"
	},
	{
		index: 8,
		stakingToken: "0xC40D16476380e4037e6b1A2594cAF6a6cc8Da967"
	},
	{
		index: 9,
		stakingToken: "0xA75F7c2F025f470355515482BdE9EFA8153536A8"
	},
	{
		index: 10,
		stakingToken: "0xCb2286d9471cc185281c4f763d34A962ED212962"
	},
	{
		index: 11,
		stakingToken: "0x088ee5007C98a9677165D78dD2109AE4a3D04d0C"
	},
	{
		index: 12,
		stakingToken: "0x795065dCc9f64b5614C407a6EFDC400DA6221FB0"
	},
	{
		index: 13,
		stakingToken: "0x611CDe65deA90918c0078ac0400A72B0D25B9bb1"
	},
	{
		index: 14,
		stakingToken: "0xaAD22f5543FCDaA694B68f94Be177B561836AE57"
	},
	{
		index: 15,
		stakingToken: "0x117d4288B3635021a3D612FE05a3Cbf5C717fEf2"
	},
	{
		index: 16,
		stakingToken: "0x95b54C8Da12BB23F7A5F6E26C38D04aCC6F81820"
	},
	{
		index: 17,
		stakingToken: "0x58Dc5a51fE44589BEb22E8CE67720B5BC5378009"
	},
	{
		index: 18,
		stakingToken: "0xDafd66636E2561b0284EDdE37e42d192F2844D40"
	},
	{
		index: 19,
		stakingToken: "0x36e2FCCCc59e5747Ff63a03ea2e5C0c2C14911e7"
	},
	{
		index: 20,
		stakingToken: "0x0Cfe7968e7c34A51217a7C9b9dc1690F416E027e"
	},
	{
		index: 21,
		stakingToken: "0xCEfF51756c56CeFFCA006cD410B03FFC46dd3a58"
	},
	{
		index: 22,
		stakingToken: "0xf169CeA51EB51774cF107c88309717ddA20be167"
	},
	{
		index: 23,
		stakingToken: "0x17b3C19Bd640a59E832AB73eCcF716CB47419846"
	},
	{
		index: 24,
		stakingToken: "0xFcff3b04C499A57778ae2CF05584ab24278A7FCb"
	},
	{
		index: 25,
		stakingToken: "0x382c4a5147Fd4090F7BE3A9Ff398F95638F5D39E"
	},
	{
		index: 26,
		stakingToken: "0x2024324a99231509a3715172d4F4f4E751b38d4d"
	},
	{
		index: 27,
		stakingToken: "0x0be88ac4b5C81700acF3a606a52a31C261a24A35"
	},
	{
		index: 28,
		stakingToken: "0x518d6CE2D7A689A591Bf46433443C31615b206C5"
	},
	{
		index: 29,
		stakingToken: "0xE954c2d9Ff2a4D260Dcd32386B1F9Fc8135D2522"
	},
	{
		index: 30,
		stakingToken: "0x0c810E08fF76E2D0beB51B10b4614b8f2b4438F9"
	},
	{
		index: 31,
		stakingToken: "0x6463Bd6026A2E7bFab5851b62969A92f7cca0eB6"
	},
	{
		index: 32,
		stakingToken: "0x2Dbc7dD86C6cd87b525BD54Ea73EBeeBbc307F68"
	},
	{
		index: 33,
		stakingToken: "0xBa13afEcda9beB75De5c56BbAF696b880a5A50dD"
	},
	{
		index: 34,
		stakingToken: "0x68C6d02D44E16F1c20088731Ab032f849100D70f"
	},
	{
		index: 35,
		stakingToken: "0x269Db91Fc3c7fCC275C2E6f22e5552504512811c"
	},
	{
		index: 36,
		stakingToken: "0x742c15d71eA7444964BC39b0eD729B3729ADc361"
	},
	{
		index: 37,
		stakingToken: "0xD75EA151a61d06868E31F8988D28DFE5E9df57B4"
	},
	{
		index: 38,
		stakingToken: "0x15e86E6f65EF7EA1dbb72A5E51a07926fB1c82E3"
	},
	{
		index: 39,
		stakingToken: "0xd597924b16Cc1904d808285bC9044fd51CEEEaD7"
	},
	{
		index: 40,
		stakingToken: "0x5a2943B25ce0678Dc0b351928D2DB331A55D94eA"
	},
	{
		index: 41,
		stakingToken: "0x53aaBCcAE8C1713a6a150D9981D2ee867D0720e8"
	},
	{
		index: 42,
		stakingToken: "0x34b13F8CD184F55d0Bd4Dd1fe6C07D46f245c7eD"
	},
	{
		index: 43,
		stakingToken: "0xbcEdc25CbB0EA44E03E41dC2d00D54Fe6d4646Db"
	},
	{
		index: 44,
		stakingToken: "0x0F82E57804D0B1F6FAb2370A43dcFAd3c7cB239c"
	},
	{
		index: 45,
		stakingToken: "0xfb736dAd22b879f055C7aebF3A2E8a197F923Ea1"
	},
	{
		index: 46,
		stakingToken: "0x69b39B89f9274a16e8A19B78E5eB47a4d91dAc9E"
	},
	{
		index: 47,
		stakingToken: "0x0289B9CD5859476Ce325aCa04309D36adDCEbDAA"
	},
	{
		index: 48,
		stakingToken: "0x97f34c8E5992EB985c5F740e7EE8c7e48a1de76a"
	},
	{
		index: 49,
		stakingToken: "0x9Fc5b87b74B9BD239879491056752EB90188106D"
	},
	{
		index: 50,
		stakingToken: "0x6f58A1Aa0248A9F794d13Dc78E74Fc75140956D7"
	},
	{
		index: 51,
		stakingToken: "0xEe6d78755e06C31AE7A5EA2b29b35C073dfc00A9"
	},
	{
		index: 52,
		stakingToken: "0x4F871F310AD0E8a170db0021c0ce066859d37469"
	},
	{
		index: 53,
		stakingToken: "0x364248b2f1f57C5402d244b2D469A35B4C0e9dAB"
	},
	{
		index: 54,
		stakingToken: "0xD7c2A4aa31E1bF08dc7Ff44C9980fa8573E10C1B"
	},
	{
		index: 55,
		stakingToken: "0x033ecD066376aFec5E6383BC9F1F15bE4C62dc89"
	},
	{
		index: 56,
		stakingToken: "0xe4455FdEc181561e9Ffe909Dde46AAEaeDC55283"
	},
	{
		index: 57,
		stakingToken: "0x0bff31d8179Da718A7ee3669853cF9978c90a24a"
	},
	{
		index: 58,
		stakingToken: "0xaf988afF99d3d0cb870812C325C588D8D8CB7De8"
	},
	{
		index: 59,
		stakingToken: "0xC5Fa164247d2F8D68804139457146eFBde8370F6"
	},
	{
		index: 60,
		stakingToken: "0x35a0d9579B1E886702375364Fe9c540f97E4517B"
	},
	{
		index: 61,
		stakingToken: "0x5E94cb9C309775763EDbD4abf248a229880e68c6"
	},
	{
		index: 62,
		stakingToken: "0xdc549b8199Ec396Fd9fF7E431cfC3CF9B40f2163"
	},
	{
		index: 63,
		stakingToken: "0xDFf71165a646BE71fCfbaa6206342FAa503AeD5D"
	},
	{
		index: 64,
		stakingToken: "0x378b4c5f2a8a0796A8d4c798Ef737cF00Ae8e667"
	},
	{
		index: 65,
		stakingToken: "0xEF4F1D5007B4FF88c1A56261fec00264AF6001Fb"
	},
	{
		index: 66,
		stakingToken: "0x1C580CC549d03171B13b55074Dc1658F60641C73"
	},
	{
		index: 67,
		stakingToken: "0xf45D97F9D457661783146D63DD13DA20ce9bf847"
	},
	{
		index: 68,
		stakingToken: "0x4441eb3076f828D5176f4Fe74d7c775542daE106"
	},
	{
		index: 69,
		stakingToken: "0xFb3cD0B8A5371fe93ef92E3988D30Df7931E2820"
	},
	{
		index: 70,
		stakingToken: "0x44D34985826578e5ba24ec78c93bE968549BB918"
	},
	{
		index: 71,
		stakingToken: "0x23a9292830Fc80dB7f563eDb28D2fe6fB47f8624"
	},
	{
		index: 72,
		stakingToken: "0xb12aa722a3A4566645F079B6F10c89A3205b6c2c"
	},
	{
		index: 73,
		stakingToken: "0x110492b31c59716AC47337E616804E3E3AdC0b4a"
	},
	{
		index: 74,
		stakingToken: "0x9360b76f8f5F932AC33D46A3CE82ad6C52A713E5"
	},
	{
		index: 75,
		stakingToken: "0xA73DF646512C82550C2b3C0324c4EEdEE53b400C"
	},
	{
		index: 76,
		stakingToken: "0xadeAa96A81eBBa4e3A5525A008Ee107385d588C3"
	},
	{
		index: 77,
		stakingToken: "0xF1360C4ae1cead17B588ec1111983d2791B760d3"
	},
	{
		index: 78,
		stakingToken: "0x0040a2CEBc65894BC2cFb57565f9ACfa33Fab137"
	},
	{
		index: 79,
		stakingToken: "0x9cD028B1287803250B1e226F0180EB725428d069"
	},
	{
		index: 80,
		stakingToken: "0x67e475577B4036EE4f0F12fa2d538Ed18CEF48e3"
	},
	{
		index: 81,
		stakingToken: "0x53E9fB796b2feb4B3184AFDf601C2A2797548d88"
	},
	{
		index: 82,
		stakingToken: "0xE5f06db4F3473E7E35490F1F98017728496fe81E"
	},
	{
		index: 83,
		stakingToken: "0x26d8151e631608570F3c28bec769C3AfEE0d73a3"
	},
	{
		index: 84,
		stakingToken: "0xaB3F8E0214D862Bf7965d3CeC7431d7C1A85cb34"
	},
	{
		index: 85,
		stakingToken: "0x8B00eE8606CC70c2dce68dea0CEfe632CCA0fB7b"
	},
	{
		index: 86,
		stakingToken: "0xaa500101C73065f755Ba9b902d643705EF2523E3"
	},
	{
		index: 87,
		stakingToken: "0xeB1B57D4f7d4557B032B66c422bc94a8E4Af859e"
	},
	{
		index: 88,
		stakingToken: "0x5F30aAc9A472F6c33D5284f9D340C0d57eF33697"
	},
	{
		index: 89,
		stakingToken: "0x83E5e791F4aB29d1B0941Bc4D00f3D6027d1dae5"
	},
	{
		index: 90,
		stakingToken: "0xD8B8B575c943f3d63638c9563B464D204ED8B710"
	},
	{
		index: 91,
		stakingToken: "0xc2B0F2A7F736d3b908BdDE8608177c8Fc28C1690"
	},
	{
		index: 92,
		stakingToken: "0xB2C29e311916a346304f83AA44527092D5bd4f0F"
	},
	{
		index: 93,
		stakingToken: "0x98c2f9D752e044DC2e1F1743bF0b76A7096eCeb2"
	},
	{
		index: 94,
		stakingToken: "0x8C2e6A4af15C94cF4a86Cd3C067159F08571d780"
	},
	{
		index: 95,
		stakingToken: "0xfCEAAf9792139BF714a694f868A215493461446D"
	},
	{
		index: 96,
		stakingToken: "0xf55C33D94150d93c2cfb833bcCA30bE388b14964"
	},
	{
		index: 97,
		stakingToken: "0xcA658217CE94dFB2156a49a8fAd0Ff752CaC39C2"
	},
	{
		index: 98,
		stakingToken: "0x71817445D11f42506F2D7F54417c935be90Ca731"
	},
	{
		index: 99,
		stakingToken: "0xb1D38026062Ac10FEDA072CA0E9b7E35f1f5795a"
	},
	{
		index: 100,
		stakingToken: "0x201e6a9E75df132a8598720433Af35fe8d73e94D"
	},
	{
		index: 101,
		stakingToken: "0x66Ae32178640813F3c32a9929520BFE4Fef5D167"
	},
	{
		index: 102,
		stakingToken: "0x049A1dF43ca577c1DB44A79CF673B443beED9F89"
	},
	{
		index: 103,
		stakingToken: "0x9a13867048e01c663ce8Ce2fE0cDAE69Ff9F35E3"
	},
	{
		index: 104,
		stakingToken: "0x31d64f9403E82243e71C2af9D8F56C7DBe10C178"
	},
	{
		index: 105,
		stakingToken: "0xA8AEC03d5Cf2824fD984ee249493d6D4D6740E61"
	},
	{
		index: 106,
		stakingToken: "0x8Cd7DADc8E11c8706763E0DE7332f5Ea91E04E35"
	},
	{
		index: 107,
		stakingToken: "0x51F5953659e7d63CF0EF60B8674eF819c225169e"
	},
	{
		index: 108,
		stakingToken: "0x54bcf4948e32A8706C286416e3ced37284F17fc9"
	},
	{
		index: 109,
		stakingToken: "0xC558F600B34A5f69dD2f0D06Cb8A88d829B7420a"
	},
	{
		index: 110,
		stakingToken: "0x87bF6386f7611aFa452c642C2835a305a692607d"
	},
	{
		index: 111,
		stakingToken: "0xBE1E98685fB293144325440C16f69954Ffcb790C"
	},
	{
		index: 112,
		stakingToken: "0x760166FA4f227dA29ecAC3BeC348f5fA853a1f3C"
	},
	{
		index: 113,
		stakingToken: "0x7B98e476De2c50b6fa284DBd410Dd516f9a72b30"
	},
	{
		index: 114,
		stakingToken: "0x02C6260cE42Ea5cD055911ed0D4857eCD4583740"
	},
	{
		index: 115,
		stakingToken: "0x663242D053057f317A773D7c262B700616d0b9A0"
	},
	{
		index: 116,
		stakingToken: "0x0Eee7f7319013df1f24F5eaF83004fCf9cF49245"
	},
	{
		index: 117,
		stakingToken: "0x18A797C7C70c1Bf22fDee1c09062aBA709caCf04"
	},
	{
		index: 118,
		stakingToken: "0xA7f11E026a0Af768D285360a855F2BDEd3047530"
	},
	{
		index: 119,
		stakingToken: "0x2ee59d346e41478B9DC2762527fACF2082022A29"
	},
	{
		index: 120,
		stakingToken: "0x22DEF8cF4E481417cb014D9dc64975BA12E3a184"
	},
	{
		index: 121,
		stakingToken: "0x41328fdBA556c8C969418ccCcB077B7B8D932aA5"
	},
	{
		index: 122,
		stakingToken: "0xFa8C3F98dEBF3d0a192e2EdF9182352332Def35c"
	},
	{
		index: 123,
		stakingToken: "0xfa5bc40c3BD5aFA8bC2fe6b84562fEE16FB2Df5F"
	},
	{
		index: 124,
		stakingToken: "0xac63290A9D32CC01c7E2F5D02FC4225F843168A4"
	},
	{
		index: 125,
		stakingToken: "0x9386d6EbbbB9F8002c5238dbD72b2e61Ad7D9011"
	},
	{
		index: 126,
		stakingToken: "0xEd4290B3C49dF20319b3132f7007DCb3b0522e34"
	},
	{
		index: 127,
		stakingToken: "0x17A2194D55f52Fd0C711e0e42B41975494bb109B"
	},
	{
		index: 128,
		stakingToken: "0x46ACb1187a6d83e26c0bB46A57Ffeaf23Ad7851E"
	},
	{
		index: 129,
		stakingToken: "0xf79a07cd3488BBaFB86dF1bAd09a6168D935c017"
	},
	{
		index: 130,
		stakingToken: "0xb46736888247C68C995B156CA86426ff32e27Cc9"
	},
	{
		index: 131,
		stakingToken: "0x0C48aE092A7D35bE0e8AD0e122A02351BA51FeDd"
	},
	{
		index: 132,
		stakingToken: "0x10B47177E92Ef9D5C6059055d92DdF6290848991"
	},
	{
		index: 133,
		stakingToken: "0xb270176bA6075196dF88B855c3Ec7776871Fdb33"
	},
	{
		index: 134,
		stakingToken: "0xf5A434FbAA1C00b33Ea141122603C43dE86cc9FE"
	},
	{
		index: 135,
		stakingToken: "0x132eEb05d5CB6829Bd34F552cDe0b6b708eF5014"
	},
	{
		index: 136,
		stakingToken: "0xBbfd9B37ec6ea1cA612AB4ADef6d8c6ece1a4134"
	},
	{
		index: 137,
		stakingToken: "0x1C615074c281c5d88ACc6914D408d7E71Eb894EE"
	},
	{
		index: 138,
		stakingToken: "0x96F5b7C2bE10dC7dE02Fa8858A8f1Bd19C2fA72A"
	},
	{
		index: 139,
		stakingToken: "0x7B504a15ef05F4EED1C07208C5815c49022A0C19"
	},
	{
		index: 140,
		stakingToken: "0x0E26A21013f2F8C0362cFae608b4e69a249D5EFc"
	},
	{
		index: 141,
		stakingToken: "0xEc78bD3b23aC867FcC028f2db405A1d9A0A2f712"
	},
	{
		index: 142,
		stakingToken: "0x092493a22375DE1B17583D924aBf9e8bf884491C"
	},
	{
		index: 143,
		stakingToken: "0xfd38565Ef22299D491055F0c508F62DD9a669F0F"
	},
	{
		index: 144,
		stakingToken: "0x0267BD35789a5ce247Fff6CB1D597597e003cc43"
	},
	{
		index: 145,
		stakingToken: "0xCA2Ae9C5C491F497DC5625fEaef4572076C946C5"
	},
	{
		index: 146,
		stakingToken: "0x608f8af5fd49b5a5421f53f79920C45b96bdA83F"
	},
	{
		index: 147,
		stakingToken: "0xd54A895623552853F8D673981CC32EB8f3929dFB"
	},
	{
		index: 148,
		stakingToken: "0x0E7E8Dde18e4016ccc15F12301a47eF7B87Bdafa"
	},
	{
		index: 149,
		stakingToken: "0xF39fF863730268C9bb867b3a69d031d1C1614b31"
	},
	{
		index: 150,
		stakingToken: "0x0BC5AE46c32D99C434b7383183ACa16DD6E9BdC8"
	},
	{
		index: 151,
		stakingToken: "0x3cf1Cf47Bc87C23cD9410549BD8a75E82C1c73cF"
	},
	{
		index: 152,
		stakingToken: "0xA3DfbF2933FF3d96177bde4928D0F5840eE55600"
	},
	{
		index: 153,
		stakingToken: "0x93E2F3a8277E0360081547D711446e4a1F83546D"
	},
	{
		index: 154,
		stakingToken: "0x938625591ADb4e865b882377e2c965F9f9b85E34"
	},
	{
		index: 155,
		stakingToken: "0x38A0469520534fC70c9C0b9DE4B8649e36A2aE3E"
	},
	{
		index: 156,
		stakingToken: "0x8486c538DcBD6A707c5b3f730B6413286FE8c854"
	},
	{
		index: 157,
		stakingToken: "0x9c86BC3C72Ab97c2234CBA8c6c7069009465AE86"
	},
	{
		index: 158,
		stakingToken: "0xB0484fB3aC155AaF7d024b20f1a569ddD6332c32"
	},
	{
		index: 159,
		stakingToken: "0xFe308FE2Eb938F772807AEc2E87Fc762d47c40E0"
	},
	{
		index: 160,
		stakingToken: "0xD3c41c080a73181e108E0526475a690F3616a859"
	},
	{
		index: 161,
		stakingToken: "0x28D70B2d5ADa1d8de7f24711b812Fd7ab3C0fBc5"
	},
	{
		index: 162,
		stakingToken: "0x1803a3386d44f65746403060aB0137682F554484"
	},
	{
		index: 163,
		stakingToken: "0x05Cc2e064e0B48e46015EAd9961F1391d74E5F83"
	},
	{
		index: 164,
		stakingToken: "0x75382c52b6F90B3f8014BfcadAC2386513F1e3bC"
	},
	{
		index: 165,
		stakingToken: "0xF9440fEDC72A0B8030861DcDac39A75b544E7A3c"
	},
	{
		index: 166,
		stakingToken: "0x0a54d4b378C8dBfC7bC93BE50C85DebAFdb87439"
	},
	{
		index: 167,
		stakingToken: "0x87B6f3A2DC6E541A9ce40E58f517953782Ae614E"
	},
	{
		index: 168,
		stakingToken: "0x90825ADd1AD30d7DCeFEa12c6704A192be6eE94E"
	},
	{
		index: 169,
		stakingToken: "0x31fa985bB0C282a814E7f3f0Dce88B2A44197F60"
	},
	{
		index: 170,
		stakingToken: "0xf13eEF1C6485348B9C9FA0d5Df2d89AccC5b0147"
	},
	{
		index: 171,
		stakingToken: "0x5e496B7D72362ADd1EEA7D4903Ee2732cD00587d"
	},
	{
		index: 172,
		stakingToken: "0xBE71372995E8e920E4E72a29a51463677A302E8d"
	},
	{
		index: 173,
		stakingToken: "0x328dFd0139e26cB0FEF7B0742B49b0fe4325F821"
	},
	{
		index: 174,
		stakingToken: "0xB5c40E038c997c2946B24dC179F7CdcD279d8847"
	},
	{
		index: 175,
		stakingToken: "0xeE35E548C7457FcDd51aE95eD09108be660Ea374"
	},
	{
		index: 176,
		stakingToken: "0xf5ca27927Ffb16BD8C870Dcb49750146CCe8217c"
	},
	{
		index: 177,
		stakingToken: "0x91A48c69Ec3f3cE855FE5054F82D2bef8Fd66C43"
	},
	{
		index: 178,
		stakingToken: "0xa1f967F25AE32bD3435E45EA8657De16Ce5A4Ae6"
	},
	{
		index: 179,
		stakingToken: "0x9E48FaDf799E0513d2EF4631478ea186741fA617"
	},
	{
		index: 180,
		stakingToken: "0x7835cB043e8d53a5b361D489956d6c30808349da"
	},
	{
		index: 181,
		stakingToken: "0xc7FF546c6CbC87Ad9f6F557db5A0df5c742cA440"
	},
	{
		index: 182,
		stakingToken: "0x033f4A33823595A6dD9dF0672Fd94DE32C65c415"
	},
	{
		index: 183,
		stakingToken: "0xA872D244B8948DFD6Cb7Bd19f79E7C1bfb7DB4a0"
	},
	{
		index: 184,
		stakingToken: "0x750d711277Fd27D1EC5256F13f5110E097713a95"
	},
	{
		index: 185,
		stakingToken: "0x34d7d7Aaf50AD4944B70B320aCB24C95fa2def7c"
	},
	{
		index: 186,
		stakingToken: "0x577959C519c24eE6ADd28AD96D3531bC6878BA34"
	},
	{
		index: 187,
		stakingToken: "0x662511a91734AEa8b06EF770D6Ed51cC539772d0"
	},
	{
		index: 188,
		stakingToken: "0xa30911e072A0C88D55B5D0A0984B66b0D04569d0"
	},
	{
		index: 189,
		stakingToken: "0x08Af656295e0EA970Fc4e35A75E62e5Aade3f9aF"
	},
	{
		index: 190,
		stakingToken: "0xfF7D29c7277D8A8850c473f0b71d7e5c4Af45A50"
	},
	{
		index: 191,
		stakingToken: "0xB7b45754167d65347C93F3B28797887b4b6cd2F3"
	},
	{
		index: 192,
		stakingToken: "0x5F92e4300024c447A103c161614E6918E794c764"
	},
	{
		index: 193,
		stakingToken: "0xf678B4A096bB49309b81B2a1c8a966Ef5F9756BA"
	},
	{
		index: 194,
		stakingToken: "0x418BC3ff0Ba33AD64931160A91C92fA26b35aCB0"
	},
	{
		index: 195,
		stakingToken: "0x668edab8A38A962D30602d6Fa7CA489484eE3224"
	},
	{
		index: 196,
		stakingToken: "0xC84Fb1F76cbdd3b3491E81FE3ff811248d0407e9"
	},
	{
		index: 197,
		stakingToken: "0x561770B93D0530390eb70e17AcBbD6E5d2f52A31"
	},
	{
		index: 198,
		stakingToken: "0x4f68e70e3a5308d759961643AfcadfC6f74B30f4"
	},
	{
		index: 199,
		stakingToken: "0x0a8D9241998C91747ce1672a0c31af2b33BD87bD"
	},
	{
		index: 200,
		stakingToken: "0x0a7cC061F0CCD2A1b6f07762663a9EC10720FCC5"
	},
	{
		index: 201,
		stakingToken: "0x002469ed116E8e2764F2E0869bd95317ee634334"
	},
	{
		index: 202,
		stakingToken: "0x0Ee6f615d982cC1Ad4Bb9AE3E9bf02ed5B68858E"
	},
	{
		index: 203,
		stakingToken: "0xF71e398B5CBb473a3378Bf4335256295A8eD713d"
	},
	{
		index: 204,
		stakingToken: "0x2bb55aAd93dEE6217Bb7887fe563718E5B5976cB"
	},
	{
		index: 205,
		stakingToken: "0x45DA3a59850525aAB0ACA23f0B11f442d4b74C85"
	},
	{
		index: 206,
		stakingToken: "0xCD769f48151Ca671f8545e40EFe03Ff7fFa157fb"
	},
	{
		index: 207,
		stakingToken: "0x795fEB1c35dc07991bfd23Ab74378885EC86c233"
	},
	{
		index: 208,
		stakingToken: "0x51d24429A72fa5Be5b588a0dE83a45F12fD57E57"
	},
	{
		index: 209,
		stakingToken: "0xA62D2E74D41d3477F7726E8f6A845269799dF573"
	},
	{
		index: 210,
		stakingToken: "0xC2A0254dfe1aC6d39Fe17f11eF1Af0A3faf87448"
	},
	{
		index: 211,
		stakingToken: "0xb5a98cd1030A7bB28716217e97D18Cfa2Aac4FC7"
	},
	{
		index: 212,
		stakingToken: "0x659B4642fF3d0719F71EaE903ce9f46B20767642"
	},
	{
		index: 213,
		stakingToken: "0x81f535Db4DF20271Be8Ab5caff29ba70B3709F90"
	},
	{
		index: 214,
		stakingToken: "0x891535966bEC70d447882C3eb1AB3926DDc5f788"
	},
	{
		index: 215,
		stakingToken: "0x82E9c2c3236De403509dE0472f2F3E16077Bc42d"
	},
	{
		index: 216,
		stakingToken: "0x663045D8ce1C61B9E0Af2C3469f17D3C152a66ba"
	},
	{
		index: 217,
		stakingToken: "0xb89313816cC3b2f9eC885860274C266355f2306D"
	},
	{
		index: 218,
		stakingToken: "0x263716dEe5b74C5Baed665Cb19c6017e51296fa2"
	},
	{
		index: 219,
		stakingToken: "0xF9a4e1e117818Fc98F9808f3DF4d7b72C0Df4160"
	},
	{
		index: 220,
		stakingToken: "0x05AD6d7dB640F4382184e2d82dD76b4581F8F8f4"
	},
	{
		index: 221,
		stakingToken: "0xBe9081E742d9E24AA0584a4f77382062F033752F"
	},
	{
		index: 222,
		stakingToken: "0x65089e337109CA4caFF78b97d40453D37F9d23f8"
	},
	{
		index: 223,
		stakingToken: "0x40a12179260997c55619DE3290c5b9918588E791"
	},
	{
		index: 224,
		stakingToken: "0xa01f36655fc3Ae0f618b29943C4aC242D71F6f50"
	},
	{
		index: 225,
		stakingToken: "0xa898974410F7e7689bb626B41BC2292c6A0f5694"
	},
	{
		index: 226,
		stakingToken: "0xDf55bD0a205ec067aB1CaCfaeef708cF1d93ECfd"
	},
	{
		index: 227,
		stakingToken: "0x809F2B68f59272740508333898D4e9432A839C75"
	},
	{
		index: 228,
		stakingToken: "0x15785398CF9FB677ddcbDb1133585a4D0C65c2d9"
	},
	{
		index: 229,
		stakingToken: "0xa16C84206A6b69C01833101133CC78A47602349D"
	},
	{
		index: 230,
		stakingToken: "0x9461173740D27311b176476FA27e94C681b1Ea6b"
	},
	{
		index: 231,
		stakingToken: "0x0C365789DbBb94A29F8720dc465554c587e897dB"
	},
	{
		index: 232,
		stakingToken: "0x8d782C5806607E9AAFB2AC38c1DA3838Edf8BD03"
	},
	{
		index: 233,
		stakingToken: "0x34D25a4749867eF8b62A0CD1e2d7B4F7aF167E01"
	},
	{
		index: 234,
		stakingToken: "0x164FE0239d703379Bddde3c80e4d4800A1cd452B"
	},
	{
		index: 235,
		stakingToken: "0x18d98D452072Ac2EB7b74ce3DB723374360539f1"
	},
	{
		index: 236,
		stakingToken: "0x4Fb3CAe84a1264b8BB1911e8915F56660eC8178E"
	},
	{
		index: 237,
		stakingToken: "0x41848373dec2867ef3924E47B2eBD0EE645a54F9"
	},
	{
		index: 238,
		stakingToken: "0x37922C69b08BABcCEaE735A31235c81f1d1e8E43"
	},
	{
		index: 239,
		stakingToken: "0x69ab811953499Eb253c5a69aE06275A42b97c9aE"
	},
	{
		index: 240,
		stakingToken: "0x1bEC4db6c3Bc499F3DbF289F5499C30d541FEc97"
	},
	{
		index: 241,
		stakingToken: "0x8F9ef75CD6E610Dd8Acf8611c344573032fB9c3d"
	},
	{
		index: 242,
		stakingToken: "0xC79FAEed130816B38E5996b79B1b3b6568cc599F"
	},
	{
		index: 243,
		stakingToken: "0xd3dA6236aEcb6b55F571249c011B8EEC340a418E"
	},
	{
		index: 244,
		stakingToken: "0x6a091a3406E0073C3CD6340122143009aDac0EDa"
	},
	{
		index: 245,
		stakingToken: "0x67AdC7432ce278486CC84FBc705BF70b5AB33a95"
	},
	{
		index: 246,
		stakingToken: "0x77F3A4Fa35BaC0EA6CfaC69037Ac4d3a757240A1"
	},
	{
		index: 247,
		stakingToken: "0x6EAFe077df3AD19Ade1CE1abDf8bdf2133704f89"
	},
	{
		index: 248,
		stakingToken: "0x3485A7C8913d640245e38564DDC05Bfb40104635"
	},
	{
		index: 249,
		stakingToken: "0x17Fb5f39C55903DE60E63543067031cE2B2659EE"
	},
	{
		index: 250,
		stakingToken: "0xa5e3142b7a5D59F778483A7E0FD3Fe4e263388e9"
	},
	{
		index: 251,
		stakingToken: "0x804Be24f625C7E23eDd9Fa68e4582590c57ad2B3"
	},
	{
		index: 252,
		stakingToken: "0x3bFcA4FB8054fA42DA3E77749b21450a1290beED"
	},
	{
		index: 253,
		stakingToken: "0x9AC60b8B33092C2c0B4CA5Af0DEC2bcb84657E12"
	},
	{
		index: 254,
		stakingToken: "0x0780B42B3c4cAF41933CFC0040d2853363De20A7"
	},
	{
		index: 255,
		stakingToken: "0x82EbCD936C9E938704b65027850E42393F8BC4d4"
	},
	{
		index: 256,
		stakingToken: "0x7229d526d5fD693720B88Eb7129058dB5D497BCe"
	},
	{
		index: 257,
		stakingToken: "0x87b918e76c92818DB0c76a4E174447aeE6E6D23f"
	},
	{
		index: 258,
		stakingToken: "0xe73ad09925201F21b607ccADA9A371C12A2f49C3"
	},
	{
		index: 259,
		stakingToken: "0x2F8AC927aa94293461C75406e90Ec0cCFb2748d9"
	},
	{
		index: 260,
		stakingToken: "0xb1EECFea192907fC4bF9c4CE99aC07186075FC51"
	},
	{
		index: 261,
		stakingToken: "0x0d2606158fA76b38C5d58dB94B223C3BdCBbf57C"
	},
	{
		index: 262,
		stakingToken: "0x6D6542B07241107B16C71C20F035f190CdA75237"
	},
	{
		index: 263,
		stakingToken: "0x2bfD753982fF94f4D2503d6280A68FcA5DA114A7"
	},
	{
		index: 264,
		stakingToken: "0x94A5A6D050b030e3a6d5211a70aE502AFab98d73"
	},
	{
		index: 265,
		stakingToken: "0x51C8796563d9CF2b3D938362A9522F21dB2c690d"
	},
	{
		index: 266,
		stakingToken: "0x0EA032DEcBfbeA581d77D4A9B9c5E9dB7C102a7c"
	},
	{
		index: 267,
		stakingToken: "0x651c7E8FA0aDd8c4531440650369533105113282"
	},
	{
		index: 268,
		stakingToken: "0x57024267e8272618f9c5037D373043a8646507e5"
	},
	{
		index: 269,
		stakingToken: "0x6469B34a2a4723163C4902dbBdEa728D20693C12"
	},
	{
		index: 270,
		stakingToken: "0x2c51eaa1BCc7b013C3f1D5985cDcB3c56DC3fbc1"
	},
	{
		index: 271,
		stakingToken: "0x0589e281D35ee1Acf6D4fd32f1fbA60EFfb5281B"
	},
	{
		index: 272,
		stakingToken: "0xD45Afa3649e57a961C001b935deD1c79D81A9d23"
	},
	{
		index: 273,
		stakingToken: "0x613C836DF6695c10f0f4900528B6931441Ac5d5a"
	},
	{
		index: 274,
		stakingToken: "0x0BB6e2a9858A089437EC678dA05E559Ffe0Af5b2"
	},
	{
		index: 275,
		stakingToken: "0xA914a9b9E03b6aF84F9c6bd2e0e8d27D405695Db"
	},
	{
		index: 276,
		stakingToken: "0x8911fce375a8414B1b578BE66eE691A8D2D4DBf7"
	},
	{
		index: 277,
		stakingToken: "0xe8eB0f7B866A85DA49401D04FfFcfC1aBbF24Dfd"
	},
	{
		index: 278,
		stakingToken: "0x986627dB5E4AAE987f580feB63D475992e5aC0AE"
	},
	{
		index: 279,
		stakingToken: "0x17890DeB188F2dE6C3e966e053dA1C9a111Ed4A5"
	},
	{
		index: 280,
		stakingToken: "0xe93b1b5E1dAdCE8152A69470C1b31463aF260296"
	},
	{
		index: 281,
		stakingToken: "0x1241F4a348162d99379A23E73926Cf0bfCBf131e"
	},
	{
		index: 282,
		stakingToken: "0x0652687E87a4b8b5370b05bc298Ff00d205D9B5f"
	},
	{
		index: 283,
		stakingToken: "0xa2D81bEdf22201A77044CDF3Ab4d9dC1FfBc391B"
	}
];

const { masterChef } = masterChef$1;
const masterChefV1 = require$$1;
const masterChefV1Pools = require$$2;

const masterChiefV1Address = '0xc2EdaD668740f1aA35E4D8f227fB8E17dcA888Cd';

var sushiswap = {
  // For instance: 0x06da0fd433C1A5d7a4faa01111c044910A184553
  masterChefV1: masterChef(masterChiefV1Address, 'sushi', masterChefV1, masterChefV1Pools, []),
};

module.exports = sushiswap;

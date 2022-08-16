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

const { ethers: ethers$4, bn: bn$5, ethersMulticall: ethersMulticall$1 } = lib;
const ERC20ABI = require$$1$2;
const DFHStorageABI = require$$2$1;
const UniswapPairABI = require$$3;
const UniswapRouterABI = require$$4;

const ethereum$5 = {
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
  erc20: (provider, address) => new ethers$4.Contract(address, ERC20ABI, provider),
  erc20Info: async (provider, address, options = ethereum$5.defaultOptions()) => {
    const multicall = new ethersMulticall$1.Provider(provider);
    await multicall.init();
    const multicallToken = new ethersMulticall$1.Contract(address, ERC20ABI);
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
    if (new bn$5(allowance).isGreaterThanOrEqualTo(value)) return;
    if (new bn$5(allowance).isGreaterThan(0)) {
      await erc20.approve(spender, '0').then((tx) => tx.wait());
    }
    return erc20.approve(spender, new bn$5(2).pow(256).minus(1).toFixed(0)).then((tx) => tx.wait());
  },
  dfh: {
    storageABI: DFHStorageABI,
    storage: (provider, address) => new ethers$4.Contract(address, DFHStorageABI, provider),
    storageKey: (k) => ethers$4.utils.keccak256(ethers$4.utils.toUtf8Bytes(k)),
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
          token0: new bn$5(balance).multipliedBy(this.reserve0).div(this.totalSupply),
          token1: new bn$5(balance).multipliedBy(this.reserve1).div(this.totalSupply),
        };
      }

      calcPrice(token0Price, token1Price) {
        const reserve0 = new bn$5(this.reserve0).multipliedBy(token0Price);
        const reserve1 = new bn$5(this.reserve1).multipliedBy(token1Price);
        return reserve0.plus(reserve1).div(this.totalSupply);
      }
    },
    pairDecimals: 18,
    pairABI: UniswapPairABI,
    pair: (provider, address) => new ethers$4.Contract(address, UniswapPairABI, provider),
    pairInfo: async (provider, address, options = ethereum$5.defaultOptions()) => {
      const multicall = new ethersMulticall$1.Provider(provider);
      await multicall.init();
      const multicallPair = new ethersMulticall$1.Contract(address, UniswapPairABI);
      let [token0, token1, reserves, totalSupply] = await multicall.all(
        [multicallPair.token0(), multicallPair.token1(), multicallPair.getReserves(), multicallPair.totalSupply()],
        { blockTag: options.blockNumber }
      );
      token0 = token0.toLowerCase();
      token1 = token1.toLowerCase();
      const blockTimestampLast = reserves[2];
      totalSupply = new bn$5(totalSupply.toString()).div(new bn$5(10).pow(ethereum$5.uniswap.pairDecimals)).toString();
      let [{ decimals: token0Decimals }, { decimals: token1Decimals }] = await Promise.all([
        ethereum$5.erc20Info(provider, token0, options),
        ethereum$5.erc20Info(provider, token1, options),
      ]);
      token0Decimals = token0Decimals.toString();
      token1Decimals = token1Decimals.toString();
      const reserve0 = new bn$5(reserves[0].toString()).div(new bn$5(10).pow(token0Decimals)).toString(10);
      const reserve1 = new bn$5(reserves[1].toString()).div(new bn$5(10).pow(token1Decimals)).toString(10);

      return new ethereum$5.uniswap.PairInfo({
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
    router: (provider, address) => new ethers$4.Contract(address, UniswapRouterABI, provider),
    getPrice: async (router, amountIn, path, options = ethereum$5.defaultOptions()) => {
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
          if (new bn$5(result.amountOut).isGreaterThanOrEqualTo(amountOut)) return result;

          return { path: [from, withTokens[i - 1], to], amountOut };
        },
        { path: [from, to], amountOut: amountsOut[0][1].toString() }
      );
    },
  },
};

var ethereum_1 = {
  ethereum: ethereum$5,
};

const nodes = {
  87: 'https://nodes.wavesnodes.com',
  84: 'https://nodes-testnet.wavesnodes.com',
  83: 'https://nodes-stagenet.wavesnodes.com',
};

const waves$1 = {
  defaultOptions: () => ({
    node: 'https://nodes.wavesexplorer.com',
  }),
  nodes: {
    ...nodes,
    main: nodes[87],
    testnet: nodes[84],
    stagenet: nodes[83],
  },
};

var waves_1 = {
  waves: waves$1,
};

const { ethers: ethers$3, dayjs, axios } = lib;

const errorHandler = (e) => {
  const { method, url } = e.config;
  throw new Error(`coingecko ${method} ${url}: ${e}`);
};

class CoingeckoProvider$2 {
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
    { block, blockTag, platform = CoingeckoProvider$2.platformMap[1] },
    apiURL = CoingeckoProvider$2.defaultApiURL
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
    this.network.platform = CoingeckoProvider$2.platformMap[chainId];

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
        ? new CoingeckoProvider$2({ block, blockTag }).price(alias.id)
        : new CoingeckoProvider$2({ block, blockTag, platform: alias.platform }).contractPrice(alias.address);
    }

    return new CoingeckoProvider$2({ block, blockTag }).initPlatform(network).contractPrice(address);
  };
}

var coingecko$1 = {
  CoingeckoProvider: CoingeckoProvider$2,
  bridgeWrapperBuild: bridgeWrapperBuild$1,
};

const { bn: bn$4 } = lib;

var toFloat$3 = {
  toFloat: (n, decimals) => new bn$4(n.toString()).div(new bn$4(10).pow(decimals)),
};

const { bn: bn$3 } = lib;

const tokens$3 = (...tokens) =>
  tokens.reduce((prev, { token, data }) => {
    if (prev[token]) {
      return {
        ...prev,
        [token]: Object.entries(data).reduce(
          (prev, [k, v]) => ({
            ...prev,
            [k]: prev[k] ? new bn$3(prev[k]).plus(v).toString(10) : v,
          }),
          prev[token]
        ),
      };
    } else {
      return { ...prev, [token]: data };
    }
  }, {});

var tokens_1 = {
  tokens: tokens$3,
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

const { ethers: ethers$2 } = lib;
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

const ethereum$4 = {
  proxyDeploy: async (signer, factoryAddress, prototypeAddress, inputs) => {
    const proxyFactory = new ethers$2.Contract(factoryAddress, ProxyFactoryABI, signer);
    const tx = await proxyFactory.create(prototypeAddress, inputs);

    return {
      tx,
      wait: tx.wait.bind(tx),
      getAddress: async () => {
        const receipt = await tx.wait();
        const proxyCreatedEvent = receipt.logs[0];
        const proxyAddressBytes = proxyCreatedEvent.topics[2];
        const [proxyAddress] = ethers$2.utils.defaultAbiCoder.decode(['address'], proxyAddressBytes);

        return proxyAddress;
      },
    };
  },
};

var actions = {
  ethereum: ethereum$4,
  input,
  select,
  radio,
  tab,
  component,
};

const { bn: bn$2 } = lib;
const { ethereum: ethereum$3 } = ethereum_1;
const { CoingeckoProvider: CoingeckoProvider$1 } = coingecko$1;

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
    const { token0, reserve0, token1, reserve1, totalSupply } = await ethereum$3.uniswap.pairInfo(
      this.provider,
      this.token
    );
    const priceFeed = new CoingeckoProvider$1({ block: this.block, blockTag: this.blockTag }).initPlatform(this.network);
    const token0Usd = await priceFeed.contractPrice(token0);
    const token1Usd = await priceFeed.contractPrice(token1);

    let stakingTokenUSD = new bn$2(reserve0)
      .multipliedBy(token0Usd)
      .plus(new bn$2(reserve1).multipliedBy(token1Usd))
      .div(totalSupply);
    if (!stakingTokenUSD.isFinite()) stakingTokenUSD = new bn$2(0);

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
    let token0Balance = new bn$2(balance).multipliedBy(this.reserve0).div(this.totalSupply);
    if (!token0Balance.isFinite()) token0Balance = new bn$2(0);
    const token0BalanceUSD = token0Balance.multipliedBy(this.token0Usd);
    let token1Balance = new bn$2(balance).multipliedBy(this.reserve1).div(this.totalSupply);
    if (!token1Balance.isFinite()) token1Balance = new bn$2(0);
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
    const priceFeed = new CoingeckoProvider$1({ block: this.block, blockTag: this.blockTag }).initPlatform(this.network);
    let tokenUSD = new bn$2(await priceFeed.contractPrice(this.token));

    if (!tokenUSD.isFinite()) tokenUSD = new bn$2(0);

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

const { ethers: ethers$1, bn: bn$1 } = lib;
const { bridgeWrapperBuild } = coingecko$1;
const { ethereum: ethereum$2 } = ethereum_1;
const { toFloat: toFloat$2 } = toFloat$3;
const { tokens: tokens$2 } = tokens_1;
const AutomateActions$1 = actions;
const { getMasterChefStakingToken } = masterChefStakingToken;

var masterChef$2 = {
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
    return async (provider, contractAddress, initOptions = ethereum$2.defaultOptions()) => {
      const options = {
        ...ethereum$2.defaultOptions(),
        ...initOptions,
      };
      const blockTag = options.blockNumber === 'latest' ? 'latest' : parseInt(options.blockNumber, 10);
      const network = (await provider.detectNetwork()).chainId;
      const block = await provider.getBlock(blockTag);
      const blockNumber = block.number;
      const priceFeed = bridgeWrapperBuild({}, blockTag, block, network);
      const avgBlockTime = await ethereum$2.getAvgBlockTime(provider, blockNumber);

      const masterChiefContract = new ethers$1.Contract(masterChefAddress, masterChefABI, provider);

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
        ethereum$2
          .erc20(provider, stakingToken)
          .decimals()
          .then((res) => Number(res.toString())),
        ethereum$2
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

      const rewardPerBlock = toFloat$2(
        new bn$1(pool.allocPoint.toString())
          .multipliedBy(rewardTokenPerBlock.toString())
          .dividedBy(totalAllocPoint.toString()),
        rewardsTokenDecimals
      );
      const rewardTokenUSD = await priceFeed(rewardsToken);

      const totalLocked = toFloat$2(
        await ethereum$2.erc20(provider, contractAddress).balanceOf(masterChefAddress),
        stakingTokenDecimals
      );

      const masterChiefStakingToken = await getMasterChefStakingToken(provider, stakingToken, network, blockTag, block);

      const tvl = new bn$1(totalLocked).multipliedBy(masterChiefStakingToken.getUSD());

      let aprBlock = rewardPerBlock.multipliedBy(rewardTokenUSD).div(tvl);
      if (!aprBlock.isFinite()) aprBlock = new bn$1(0);

      const blocksPerDay = new bn$1((1000 * 60 * 60 * 24) / avgBlockTime);
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
          const balance = toFloat$2(amount, ethereum$2.uniswap.pairDecimals);
          const earned = toFloat$2(rewardDebt, rewardsTokenDecimals);
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
            tokens: tokens$2(
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
          const stakingTokenContract = ethereum$2.erc20(provider, stakingToken).connect(signer);
          const stakingContract = masterChiefContract.connect(signer);

          return {
            stake: [
              AutomateActions$1.tab(
                'Stake',
                async () => ({
                  description: 'Stake your tokens to contract',
                  inputs: [
                    AutomateActions$1.input({
                      placeholder: 'amount',
                      value: new bn$1(await stakingTokenContract.balanceOf(walletAddress).then((v) => v.toString()))
                        .div(`1e${stakingTokenDecimals}`)
                        .toString(10),
                    }),
                  ],
                }),
                async (amount) => {
                  const amountInt = new bn$1(amount).multipliedBy(`1e${stakingTokenDecimals}`);
                  if (amountInt.lte(0)) return Error('Invalid amount');

                  const balance = await stakingTokenContract.balanceOf(walletAddress).then((v) => v.toString());
                  if (amountInt.gt(balance)) return Error('Insufficient funds on the balance');

                  return true;
                },
                async (amount) => {
                  const amountInt = new bn$1(amount).multipliedBy(`1e${stakingTokenDecimals}`);
                  await ethereum$2.erc20ApproveAll(
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
              AutomateActions$1.tab(
                'Unstake',
                async () => {
                  const userInfo = await stakingContract.userInfo(poolIndex, walletAddress);

                  return {
                    description: 'Unstake your tokens from contract',
                    inputs: [
                      AutomateActions$1.input({
                        placeholder: 'amount',
                        value: new bn$1(userInfo.amount.toString()).div(`1e${stakingTokenDecimals}`).toString(10),
                      }),
                    ],
                  };
                },
                async (amount) => {
                  const amountInt = new bn$1(amount).multipliedBy(`1e${stakingTokenDecimals}`);
                  if (amountInt.lte(0)) return Error('Invalid amount');

                  const userInfo = await stakingContract.userInfo(poolIndex, walletAddress);
                  if (amountInt.isGreaterThan(userInfo.amount.toString())) {
                    return Error('Amount exceeds balance');
                  }

                  return true;
                },
                async (amount) => {
                  const amountInt = new bn$1(amount).multipliedBy(`1e${stakingTokenDecimals}`);

                  return {
                    tx: await stakingContract.withdraw(poolIndex, amountInt.toFixed(0)),
                  };
                }
              ),
            ],
            claim: [
              AutomateActions$1.tab(
                'Claim',
                async () => ({
                  description: 'Claim your reward from contract',
                }),
                async () => {
                  const earned = await stakingContract
                    .pendingReward(poolIndex, walletAddress)
                    .then((v) => v.toString());
                  if (new bn$1(earned).isLessThanOrEqualTo(0)) {
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
              AutomateActions$1.tab(
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
                    new bn$1(earned).isLessThanOrEqualTo(0) &&
                    new bn$1(userInfo.amount.toString()).isLessThanOrEqualTo(0)
                  ) {
                    return Error('No staked');
                  }

                  return true;
                },
                async () => {
                  const userInfo = await stakingContract.userInfo(poolIndex, walletAddress);
                  if (new bn$1(userInfo.amount.toString()).isGreaterThan(0)) {
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

var require$$6 = [
	{
		inputs: [
			{
				internalType: "address",
				name: "_rewardsDistribution",
				type: "address"
			},
			{
				internalType: "address",
				name: "_rewardsToken",
				type: "address"
			},
			{
				internalType: "address",
				name: "_stakingToken",
				type: "address"
			}
		],
		payable: false,
		stateMutability: "nonpayable",
		type: "constructor"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint256",
				name: "reward",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "periodFinish",
				type: "uint256"
			}
		],
		name: "RewardAdded",
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
				indexed: false,
				internalType: "uint256",
				name: "reward",
				type: "uint256"
			}
		],
		name: "RewardPaid",
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
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "Staked",
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
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "Withdrawn",
		type: "event"
	},
	{
		constant: true,
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
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: true,
		inputs: [
			{
				internalType: "address",
				name: "account",
				type: "address"
			}
		],
		name: "earned",
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
		],
		name: "exit",
		outputs: [
		],
		payable: false,
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		constant: false,
		inputs: [
		],
		name: "getReward",
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
		name: "lastTimeRewardApplicable",
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
		name: "lastUpdateTime",
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
				internalType: "uint256",
				name: "reward",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "rewardsDuration",
				type: "uint256"
			}
		],
		name: "notifyRewardAmount",
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
		name: "periodFinish",
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
		name: "rewardPerToken",
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
		name: "rewardPerTokenStored",
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
		name: "rewardRate",
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
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		name: "rewards",
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
		name: "rewardsDistribution",
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
		name: "rewardsToken",
		outputs: [
			{
				internalType: "contract IERC20",
				name: "",
				type: "address"
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
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "stake",
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
				name: "amount",
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
		name: "stakeWithPermit",
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
		name: "stakingToken",
		outputs: [
			{
				internalType: "contract IERC20",
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
		constant: true,
		inputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		name: "userRewardPerTokenPaid",
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
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "withdraw",
		outputs: [
		],
		payable: false,
		stateMutability: "nonpayable",
		type: "function"
	}
];

const { ethers, bn, ethersMulticall } = lib;
const { ethereum: ethereum$1 } = ethereum_1;
const { CoingeckoProvider } = coingecko$1;
const { toFloat: toFloat$1 } = toFloat$3;
const { tokens: tokens$1 } = tokens_1;
const AutomateActions = actions;

const stakingABI = require$$6;

const getApyPerDayFunctionDefault = (
  provider,
  stakingToken,
  contractAddress,
  rewardRate,
  rewardTokenUSD,
  tvl,
  blocksPerDay
) => {
  let aprBlock = new bn(rewardRate.toString()).multipliedBy(rewardTokenUSD).div(tvl);
  if (!aprBlock.isFinite()) aprBlock = new bn(0);
  return aprBlock.multipliedBy(blocksPerDay);
};

var staking$1 = {
  synthetixStaking:
    (getApyPerDayFunction = getApyPerDayFunctionDefault) =>
    async (provider, contractAddress, initOptions = ethereum$1.defaultOptions()) => {
      const options = {
        ...ethereum$1.defaultOptions(),
        ...initOptions,
      };
      const blockTag = options.blockNumber === 'latest' ? 'latest' : parseInt(options.blockNumber, 10);
      const contract = new ethers.Contract(contractAddress, stakingABI, provider);
      const network = (await provider.detectNetwork()).chainId;
      const block = await provider.getBlock(blockTag);
      const blockNumber = block.number;
      const priceFeed = new CoingeckoProvider({ block, blockTag }).initPlatform(network);
      const avgBlockTime = await ethereum$1.getAvgBlockTime(provider, blockNumber);
      const blocksPerDay = new bn((1000 * 60 * 60 * 24) / avgBlockTime);

      const multicall = new ethersMulticall.Provider(provider, network);
      const multicallContract = new ethersMulticall.Contract(contractAddress, stakingABI);
      let [periodFinish, rewardRate, totalSupply, stakingToken, rewardsToken] = await multicall.all(
        [
          multicallContract.periodFinish(),
          multicallContract.rewardRate(),
          multicallContract.totalSupply(),
          multicallContract.stakingToken(),
          multicallContract.rewardsToken(),
        ],
        { blockTag }
      );
      let [stakingTokenDecimals, rewardsTokenDecimals] = await multicall.all([
        new ethersMulticall.Contract(stakingToken, ethereum$1.abi.ERC20ABI).decimals(),
        new ethersMulticall.Contract(rewardsToken, ethereum$1.abi.ERC20ABI).decimals(),
      ]);
      stakingTokenDecimals = parseInt(stakingTokenDecimals, 10);
      rewardsTokenDecimals = parseInt(rewardsTokenDecimals, 10);

      periodFinish = periodFinish.toString();
      rewardRate = toFloat$1(rewardRate, rewardsTokenDecimals);
      if (new bn(periodFinish).lt(blockNumber)) rewardRate = new bn('0');
      totalSupply = toFloat$1(totalSupply, ethereum$1.uniswap.pairDecimals);
      stakingToken = stakingToken.toLowerCase();
      rewardsToken = rewardsToken.toLowerCase();
      const rewardTokenUSD = await priceFeed.contractPrice(rewardsToken);

      const stakingTokenPair = await ethereum$1.uniswap.pairInfo(provider, stakingToken, options);
      const token0PriceUSD = await priceFeed.contractPrice(stakingTokenPair.token0);
      const token1PriceUSD = await priceFeed.contractPrice(stakingTokenPair.token1);
      const stakingTokenUSD = stakingTokenPair.calcPrice(token0PriceUSD, token1PriceUSD);

      const tvl = totalSupply.multipliedBy(stakingTokenUSD);

      const aprDay = await getApyPerDayFunction(
        provider,
        stakingToken,
        contractAddress,
        rewardRate,
        rewardTokenUSD,
        tvl,
        blocksPerDay
      );
      const aprWeek = aprDay.multipliedBy(7);
      const aprMonth = aprDay.multipliedBy(30);
      const aprYear = aprDay.multipliedBy(365);

      return {
        staking: {
          token: stakingToken,
          decimals: stakingTokenDecimals,
        },
        reward: {
          token: rewardsToken,
          decimals: rewardsTokenDecimals,
        },
        stakeToken: {
          address: stakingToken,
          decimals: stakingTokenDecimals,
          priceUSD: stakingTokenUSD.toString(10),
          parts: [
            {
              address: stakingTokenPair.token0,
              decimals: stakingTokenPair.token0Decimals,
              priceUSD: token0PriceUSD.toString(10),
            },
            {
              address: stakingTokenPair.token1,
              decimals: stakingTokenPair.token1Decimals,
              priceUSD: token1PriceUSD.toString(10),
            },
          ],
        },
        rewardToken: {
          address: rewardsToken,
          decimals: rewardsTokenDecimals,
          priceUSD: rewardTokenUSD.toString(10),
        },
        metrics: {
          tvl: tvl.toString(10),
          aprDay: aprDay.toString(10),
          aprWeek: aprWeek.toString(10),
          aprMonth: aprMonth.toString(10),
          aprYear: aprYear.toString(10),
        },
        wallet: async (walletAddress) => {
          let [balance, earned] = await multicall.all(
            [multicallContract.balanceOf(walletAddress), multicallContract.earned(walletAddress)],
            { blockTag }
          );
          balance = toFloat$1(balance, ethereum$1.uniswap.pairDecimals);
          earned = toFloat$1(earned, rewardsTokenDecimals);
          let token0Balance = balance.multipliedBy(reserve0).div(lpTotalSupply);
          if (!token0Balance.isFinite()) token0Balance = new bn(0);
          const token0BalanceUSD = token0Balance.multipliedBy(token0Usd);
          let token1Balance = balance.multipliedBy(reserve1).div(lpTotalSupply);
          if (!token1Balance.isFinite()) token1Balance = new bn(0);
          const token1BalanceUSD = token1Balance.multipliedBy(token1Usd);
          const earnedUSD = earned.multipliedBy(rewardTokenUSD);

          return {
            staked: {
              [token0]: {
                balance: token0Balance.toString(10),
                usd: token0BalanceUSD.toString(10),
              },
              [token1]: {
                balance: token1Balance.toString(10),
                usd: token1BalanceUSD.toString(10),
              },
            },
            earned: {
              [rewardsToken]: {
                balance: earned.toString(10),
                usd: earnedUSD.toString(10),
              },
            },
            metrics: {
              staking: balance.toString(10),
              stakingUSD: balance.multipliedBy(stakingTokenUSD).toString(10),
              earned: earned.toString(10),
              earnedUSD: earnedUSD.toString(10),
            },
            tokens: tokens$1(
              {
                token: token0,
                data: {
                  balance: token0Balance.toString(10),
                  usd: token0BalanceUSD.toString(10),
                },
              },
              {
                token: token1,
                data: {
                  balance: token1Balance.toString(10),
                  usd: token1BalanceUSD.toString(10),
                },
              },
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
          const rewardTokenContract = ethereum$1.erc20(provider, rewardsToken).connect(signer);
          const rewardTokenSymbol = await rewardTokenContract.symbol();
          const stakingTokenContract = ethereum$1.erc20(provider, stakingToken).connect(signer);
          const stakingTokenSymbol = await stakingTokenContract.symbol();
          const stakingTokenDecimals = await stakingTokenContract.decimals().then((v) => v.toString());
          const stakingContract = contract.connect(signer);

          return {
            stake: [
              AutomateActions.tab(
                'Stake',
                async () => ({
                  description: `Stake your [${stakingTokenSymbol}](https://etherscan.io/address/${stakingToken}) tokens to contract`,
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
                  await ethereum$1.erc20ApproveAll(
                    stakingTokenContract,
                    walletAddress,
                    masterChefAddress,
                    amountInt.toFixed(0)
                  );

                  return {
                    tx: await stakingContract.stake(amountInt.toFixed(0)),
                  };
                }
              ),
            ],
            unstake: [
              AutomateActions.tab(
                'Unstake',
                async () => ({
                  description: `Unstake your [${stakingTokenSymbol}](https://etherscan.io/address/${stakingToken}) tokens from contract`,
                  inputs: [
                    AutomateActions.input({
                      placeholder: 'amount',
                      value: new bn(await stakingContract.balanceOf(walletAddress).then((v) => v.toString()))
                        .div(`1e${stakingTokenDecimals}`)
                        .toString(10),
                    }),
                  ],
                }),
                async (amount) => {
                  const amountInt = new bn(amount).multipliedBy(`1e${stakingTokenDecimals}`);
                  if (amountInt.lte(0)) return Error('Invalid amount');

                  const balance = await stakingContract.balanceOf(walletAddress).then((v) => v.toString());
                  if (amountInt.isGreaterThan(balance)) {
                    return Error('Amount exceeds balance');
                  }

                  return true;
                },
                async (amount) => {
                  const amountInt = new bn(amount).multipliedBy(`1e${stakingTokenDecimals}`);

                  return {
                    tx: await stakingContract.withdraw(amountInt.toFixed(0)),
                  };
                }
              ),
            ],
            claim: [
              AutomateActions.tab(
                'Claim',
                async () => ({
                  description: `Claim your [${rewardTokenSymbol}](https://etherscan.io/address/${rewardsToken}) reward`,
                }),
                async () => {
                  const earned = await stakingContract.earned(walletAddress).then((v) => v.toString());
                  if (new bn(earned).isLessThanOrEqualTo(0)) {
                    return Error('No earnings');
                  }

                  return true;
                },
                async () => ({
                  tx: await stakingContract.getReward(),
                })
              ),
            ],
            exit: [
              AutomateActions.tab(
                'Exit',
                async () => ({
                  description: 'Get all tokens from contract',
                }),
                () => true,
                async () => ({
                  tx: await stakingContract.exit(),
                })
              ),
            ],
          };
        },
      };
    },
};

const { ethereum } = ethereum_1;
const { waves } = waves_1;
const { coingecko } = coingecko$1;
const { masterChef: masterChef$1 } = masterChef$2;
const staking = staking$1;
const { tokens } = tokens_1;
const { toFloat } = toFloat$3;

var utils = {
  toFloat,
  tokens,
  ethereum,
  waves,
  coingecko,
  masterChef: masterChef$1,
  staking,
};

var require$$1 = [
	{
		inputs: [
			{
				internalType: "contract IMdx",
				name: "_mdx",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "_mdxPerBlock",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "_startBlock",
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
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		name: "LpOfPid",
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
			{
				internalType: "address",
				name: "_bad",
				type: "address"
			}
		],
		name: "addBadAddress",
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
				name: "_addLP",
				type: "address"
			}
		],
		name: "addMultLP",
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
				name: "_bad",
				type: "address"
			}
		],
		name: "delBadAddress",
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
				name: "_index",
				type: "uint256"
			}
		],
		name: "getBadAddress",
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
		name: "getBlackListLength",
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
				name: "_lastRewardBlock",
				type: "uint256"
			}
		],
		name: "getMdxBlockReward",
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
			}
		],
		name: "getMultLPAddress",
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
		name: "getMultLPLength",
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
		name: "halvingPeriod",
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
				name: "account",
				type: "address"
			}
		],
		name: "isBadAddress",
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
				internalType: "address",
				name: "_LP",
				type: "address"
			}
		],
		name: "isMultLP",
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
		],
		name: "massUpdatePools",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "mdx",
		outputs: [
			{
				internalType: "contract IMdx",
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
		name: "mdxPerBlock",
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
		name: "multLpChef",
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
		name: "multLpToken",
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
		name: "paused",
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
		name: "pending",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			},
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
				name: "blockNumber",
				type: "uint256"
			}
		],
		name: "phase",
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
		name: "poolCorrespond",
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
				name: "accMdxPerShare",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "accMultLpPerShare",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "totalAmount",
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
				internalType: "address",
				name: "_multLpToken",
				type: "address"
			},
			{
				internalType: "address",
				name: "_multLpChef",
				type: "address"
			}
		],
		name: "replaceMultLP",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "blockNumber",
				type: "uint256"
			}
		],
		name: "reward",
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
				internalType: "uint256",
				name: "_block",
				type: "uint256"
			}
		],
		name: "setHalvingPeriod",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "newPerBlock",
				type: "uint256"
			}
		],
		name: "setMdxPerBlock",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_multLpToken",
				type: "address"
			},
			{
				internalType: "address",
				name: "_multLpChef",
				type: "address"
			}
		],
		name: "setMultLP",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "setPause",
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
				name: "_sid",
				type: "uint256"
			}
		],
		name: "setPoolCorr",
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
			},
			{
				internalType: "uint256",
				name: "multLpRewardDebt",
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
		stakingToken: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
	},
	{
		index: 1,
		stakingToken: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56"
	},
	{
		index: 2,
		stakingToken: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c"
	},
	{
		index: 3,
		stakingToken: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8"
	},
	{
		index: 4,
		stakingToken: "0x55d398326f99059fF775485246999027B3197955"
	},
	{
		index: 5,
		stakingToken: "0x250632378E573c6Be1AC2f97Fcdf00515d0Aa91B"
	},
	{
		index: 6,
		stakingToken: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d"
	},
	{
		index: 7,
		stakingToken: "0xAEE4164c1ee46ed0bbC34790f1a3d1Fc87796668"
	},
	{
		index: 8,
		stakingToken: "0x47BEAd2563dCBf3bF2c9407fEa4dC236fAbA485A"
	},
	{
		index: 9,
		stakingToken: "0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402"
	},
	{
		index: 10,
		stakingToken: "0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47"
	},
	{
		index: 11,
		stakingToken: "0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD"
	},
	{
		index: 12,
		stakingToken: "0x4338665CBB7B2485A8855A139b75D5e34AB0DB94"
	},
	{
		index: 13,
		stakingToken: "0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE"
	},
	{
		index: 14,
		stakingToken: "0x0D8Ce2A99Bb6e3B7Db580eD848240e4a0F9aE153"
	},
	{
		index: 15,
		stakingToken: "0xBf5140A22578168FD562DCcF235E5D43A02ce9B1"
	},
	{
		index: 16,
		stakingToken: "0x947950BcC74888a40Ffa2593C5798F11Fc9124C4"
	},
	{
		index: 17,
		stakingToken: "0x8fF795a6F4D97E7887C79beA79aba5cc76444aDf"
	},
	{
		index: 18,
		stakingToken: "0x56b6fB708fC5732DEC1Afc8D8556423A2EDcCbD6"
	},
	{
		index: 19,
		stakingToken: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82"
	},
	{
		index: 20,
		stakingToken: "0xa184088a740c695E156F91f5cC086a06bb78b827"
	},
	{
		index: 21,
		stakingToken: "0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63"
	},
	{
		index: 22,
		stakingToken: "0xE0e514c71282b6f4e823703a39374Cf58dc3eA4f"
	},
	{
		index: 23,
		stakingToken: "0xA7f552078dcC247C2684336020c03648500C6d9F"
	},
	{
		index: 24,
		stakingToken: "0x8F0528cE5eF7B51152A59745bEfDD91D97091d2F"
	},
	{
		index: 25,
		stakingToken: "0x3FdA9383A84C05eC8f7630Fe10AdF1fAC13241CC"
	},
	{
		index: 26,
		stakingToken: "0xa2B726B1145A4773F68593CF171187d8EBe4d495"
	},
	{
		index: 27,
		stakingToken: "0x948d2a81086A075b3130BAc19e4c6DEe1D2E3fE8"
	},
	{
		index: 28,
		stakingToken: "0xda28Eb7ABa389C1Ea226A420bCE04Cb565Aafb85"
	},
	{
		index: 29,
		stakingToken: "0x0FB881c078434b1C0E4d0B64d8c64d12078b7Ce2"
	},
	{
		index: 30,
		stakingToken: "0x577d005912C49B1679B4c21E334FdB650E92C077"
	},
	{
		index: 31,
		stakingToken: "0x09CB618bf5eF305FadfD2C8fc0C26EeCf8c6D5fd"
	},
	{
		index: 32,
		stakingToken: "0x62c1dEC1fF328DCdC157Ae0068Bb21aF3967aCd9"
	},
	{
		index: 33,
		stakingToken: "0x9f4Da89774570E27170873BefD139a79CB1A3da2"
	},
	{
		index: 34,
		stakingToken: "0xCAABda10a3ac99Fc15f5B636Aa18E6B4Fd8db16D"
	},
	{
		index: 35,
		stakingToken: "0x86746cc10BA1422CB17483748105d1d1DF5A2876"
	},
	{
		index: 36,
		stakingToken: "0xBcD49db9AA7D3e6C7F06AcffABdc4E42b402bF82"
	},
	{
		index: 37,
		stakingToken: "0x59B76b5D39370ba2Aa7e723c639861266e85BFEc"
	},
	{
		index: 38,
		stakingToken: "0x17632dCDA12c522Ec2bC8a08c6419aB16F249d35"
	},
	{
		index: 39,
		stakingToken: "0xFf44e10662E1CD4f7AfE399144636c74B0D05D80"
	},
	{
		index: 40,
		stakingToken: "0x223740a259E461aBeE12D84A9FFF5Da69Ff071dD"
	},
	{
		index: 41,
		stakingToken: "0x5E23fADEE9d8b5689F89104f10118C956Df3a286"
	},
	{
		index: 42,
		stakingToken: "0xAf9Aa53146C5752BF6068A84B970E9fBB22a87bc"
	},
	{
		index: 43,
		stakingToken: "0xe1cBe92b5375ee6AfE1B22b555D257B4357F6C68"
	},
	{
		index: 44,
		stakingToken: "0x4fb8253432FB3e92109c91E3Ff2b85FfA0f6A1F4"
	},
	{
		index: 45,
		stakingToken: "0xc0BA2569e473974e9004CEEEae76Aeaea521525c"
	},
	{
		index: 46,
		stakingToken: "0x3fe3DeE31cC404Aa4C8de6A6a3cbBcb60358FcB0"
	},
	{
		index: 47,
		stakingToken: "0x9fee39a59F60CDCcd81163d37a63C2E0B761Ccd4"
	},
	{
		index: 48,
		stakingToken: "0x3Bb17b5BDbA4408AC23B1D63fB48E22D24134cd6"
	},
	{
		index: 49,
		stakingToken: "0x72F1d53B2E4bDE565fE54AF13697857e71193dDf"
	},
	{
		index: 50,
		stakingToken: "0x706937dC141231168Be1694d5ea9dCD04739Bb41"
	},
	{
		index: 51,
		stakingToken: "0x3720DAD44398f745067b54ea786BB66CB97f68e9"
	},
	{
		index: 52,
		stakingToken: "0xE16699481Cb5DC79CA491F8437182d73eb0dd09D"
	},
	{
		index: 53,
		stakingToken: "0x340192D37d95fB609874B1db6145ED26d1e47744"
	},
	{
		index: 54,
		stakingToken: "0x82E8F9e7624fA038DfF4a39960F5197A43fa76aa"
	},
	{
		index: 55,
		stakingToken: "0x969f2556F786a576F32AeF6c1D6618f0221Ec70e"
	},
	{
		index: 56,
		stakingToken: "0x83d8E2E030cD820dfdD94723c3bcf2BC52e1701A"
	},
	{
		index: 57,
		stakingToken: "0x8fe32329C4dbE8d29B9c8874Ef0F52CcD8c7D3F0"
	},
	{
		index: 58,
		stakingToken: "0x091331f2231Cc9b87Cac33663371A8484a0a5197"
	},
	{
		index: 59,
		stakingToken: "0xfA4f77C240EB9c1ce45344Ce4B6d4b4bACc7c09b"
	},
	{
		index: 60,
		stakingToken: "0xcf7ca5e4968CF0d1dD26645e4cf3Cf4ED86b867F"
	},
	{
		index: 61,
		stakingToken: "0x67268Bb3Aece3efE5B36F6bAbd4662f947C1A9A6"
	},
	{
		index: 62,
		stakingToken: "0xA13aFe2DF0fA0bb11F2aeAAAF98aC1D591E108d1"
	},
	{
		index: 63,
		stakingToken: "0x91bbcF7518bdf2D94b2806C4bFd6B90eb8e40B03"
	},
	{
		index: 64,
		stakingToken: "0x05Bc53aBE321Ece4330E500C1693C490E2Af1E84"
	},
	{
		index: 65,
		stakingToken: "0x6b35eb6CF670452Fa3Be8396b54678b1727aFA6b"
	},
	{
		index: 66,
		stakingToken: "0xBDaDe5C2C966EE5558d2e0BDd3d9276bEA2c6007"
	},
	{
		index: 67,
		stakingToken: "0xeF315887FD450e0B50ceA0fF7C24d4f846a5b94e"
	},
	{
		index: 68,
		stakingToken: "0xe4276043484881C19c78D0276DEE1350eB36cDB5"
	},
	{
		index: 69,
		stakingToken: "0x428daB4F52C5f76b86eD964e03E7c93D02f2E3bB"
	},
	{
		index: 70,
		stakingToken: "0x27fb3ce8c9C7cdca5deeB5E3E486913b97f9D189"
	},
	{
		index: 71,
		stakingToken: "0x014A03F7202fC31C4537147CC8060F735BF6243c"
	},
	{
		index: 72,
		stakingToken: "0x244CB20eFF76c3636C6B0d431aB748D47b326d0c"
	},
	{
		index: 73,
		stakingToken: "0x9bDa8bdE8F2F3C5a267a610CD2410cDA69d59a98"
	},
	{
		index: 74,
		stakingToken: "0x79B0DE721bCf2D6d03708D5e7f5eEca8d4df5F88"
	},
	{
		index: 75,
		stakingToken: "0x26c56ca50c3317C6c30bF94bf1E26876d405B18f"
	},
	{
		index: 76,
		stakingToken: "0x22671dfd5eda964a94D398A205346C23975D3FBA"
	},
	{
		index: 77,
		stakingToken: "0xBA68d6beE4f433630DeE22C248A236c8f6EAe246"
	},
	{
		index: 78,
		stakingToken: "0x1c0276642f2A7cbcf6624d511F34811cDC65212C"
	},
	{
		index: 79,
		stakingToken: "0xF8E9b725e0De8a9546916861c2904b0Eb8805b96"
	},
	{
		index: 80,
		stakingToken: "0x4282Cc326bB04Cd5F9503AC8cB2407C9b2aAed1d"
	},
	{
		index: 81,
		stakingToken: "0x7B2566F78250B742484611aF6aaf0cdE56788cd6"
	},
	{
		index: 82,
		stakingToken: "0x4Babdf099abd0DA59F317Ce450cff7D4D5697E86"
	},
	{
		index: 83,
		stakingToken: "0x9595AcEc209Cec24898f24B35683429c83Aaa2fD"
	},
	{
		index: 84,
		stakingToken: "0xcB5aA12DfD55B7cFc29a8d7175f6309Dd7Af9a9f"
	},
	{
		index: 85,
		stakingToken: "0xaC98337f319E92F3b0cfEf9755a7596Dd48c1b00"
	},
	{
		index: 86,
		stakingToken: "0xa21B4103e4501A5a3076bAa31bce7D184E1e79C7"
	},
	{
		index: 87,
		stakingToken: "0xDA4e9Ad1Db5546Ac5cF9BCDb6a0285b97b39f747"
	},
	{
		index: 88,
		stakingToken: "0x478d6c9FFa3609Faa1bfc4afc2770447CA327705"
	},
	{
		index: 89,
		stakingToken: "0x842240eED07443095400cD4BC77F5358AfADff94"
	},
	{
		index: 90,
		stakingToken: "0xE24cAb13128352572d68AE4da1Abe73d5AcD820E"
	},
	{
		index: 91,
		stakingToken: "0x0025D20D85788C2cAE2FEB9C298bdaFc93bF08Ce"
	},
	{
		index: 92,
		stakingToken: "0x01718BA7146645118895972eB7f4FA951A5A8fb0"
	},
	{
		index: 93,
		stakingToken: "0x67B23D19352963b22BD7FE2F5D4F5B40654aD587"
	},
	{
		index: 94,
		stakingToken: "0xF16D5142086DBF7723B0a57B8D96979810E47448"
	}
];

const { masterChef } = utils;
const masterChefABI = require$$1;
const masterChefPools = require$$2;

const masterChefAddress$1 = '0xc48fe252aa631017df253578b1405ea399728a50';

var mdex = {
  //For instance: '0xcf7ca5e4968CF0d1dD26645e4cf3Cf4ED86b867F'
  masterChef: masterChef(masterChefAddress$1, 'mdx', masterChefABI, masterChefPools, []),
};

module.exports = mdex;

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

var require$$1$1 = [
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

var require$$2 = [
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

const { ethers: ethers$3, bn: bn$4, ethersMulticall: ethersMulticall$1 } = lib;
const ERC20ABI = require$$1$1;
const DFHStorageABI = require$$2;
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
  erc20: (provider, address) => new ethers$3.Contract(address, ERC20ABI, provider),
  erc20Info: async (provider, address, options = ethereum$3.defaultOptions()) => {
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
    if (new bn$4(allowance).isGreaterThanOrEqualTo(value)) return;
    if (new bn$4(allowance).isGreaterThan(0)) {
      await erc20.approve(spender, '0').then((tx) => tx.wait());
    }
    return erc20.approve(spender, new bn$4(2).pow(256).minus(1).toFixed(0)).then((tx) => tx.wait());
  },
  dfh: {
    storageABI: DFHStorageABI,
    storage: (provider, address) => new ethers$3.Contract(address, DFHStorageABI, provider),
    storageKey: (k) => ethers$3.utils.keccak256(ethers$3.utils.toUtf8Bytes(k)),
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
    pair: (provider, address) => new ethers$3.Contract(address, UniswapPairABI, provider),
    pairInfo: async (provider, address, options = ethereum$3.defaultOptions()) => {
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
    router: (provider, address) => new ethers$3.Contract(address, UniswapRouterABI, provider),
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

const { ethers: ethers$2, dayjs: dayjs$1, axios: axios$1 } = lib;

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
      const { data } = await axios$1.get(`${this.apiURL}/simple/price?ids=${id}&vs_currencies=usd`).catch(errorHandler);
      if (typeof data[id] !== 'object' || data[id].usd === undefined) {
        throw new Error(`Price for "coingecko:${id}" not resolved`);
      }

      return data[id].usd;
    } else {
      const date = dayjs$1(this.network.block.timestamp).format('DD-MM-YYYY');
      const { data } = await axios$1.get(`${this.apiURL}/coins/${id}/history?date=${date}`).catch(errorHandler);
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
      const { data } = await axios$1
        .get(
          `${this.apiURL}/simple/token_price/${this.network.platform}?contract_addresses=${address}&vs_currencies=usd`
        )
        .catch(errorHandler);
      if (typeof data !== 'object' || data[address] === undefined || data[address].usd === undefined) {
        throw new Error(`Price for "coingecko:${address}" not resolved`);
      }

      return data[address].usd;
    } else {
      const { data: contractInfo } = await axios$1
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
function bridgeWrapperBuild(aliases, blockTag, block, network) {
  return (address) => {
    const alias = aliases[address.toLowerCase()] ?? aliases[ethers$2.utils.getAddress(address)];
    if (typeof alias === 'object') {
      return typeof alias.id === 'string'
        ? new CoingeckoProvider$2({ block, blockTag }).price(alias.id)
        : new CoingeckoProvider$2({ block, blockTag, platform: alias.platform }).contractPrice(alias.address);
    }

    return new CoingeckoProvider$2({ block, blockTag }).initPlatform(network).contractPrice(address);
  };
}

var coingecko = {
  CoingeckoProvider: CoingeckoProvider$2,
  bridgeWrapperBuild,
};

const { bn: bn$1 } = lib;
const { ethereum: ethereum$2 } = ethereum_1;
const { CoingeckoProvider: CoingeckoProvider$1 } = coingecko;

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
    const { token0, reserve0, token1, reserve1, totalSupply } = await ethereum$2.uniswap.pairInfo(
      this.provider,
      this.token
    );
    const priceFeed = new CoingeckoProvider$1({ block: this.block, blockTag: this.blockTag }).initPlatform(this.network);
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
    const priceFeed = new CoingeckoProvider$1({ block: this.block, blockTag: this.blockTag }).initPlatform(this.network);
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

const { axios, env } = lib;

async function read(protocol, key) {
  return axios
    .get(`${env.CACHE_HOST}?protocol=${protocol}&key=${key}`)
    .then(({ data }) => data)
    .catch((e) => {
      if (e.response) {
        throw new Error(`Read cache failed: ${e.response.status} ${e.response.data}`);
      }
      throw new Error(`Read cache failed: ${e.message}`);
    });
}

async function write(auth, protocol, key, data) {
  return axios
    .post(`${env.CACHE_HOST}?protocol=${protocol}&key=${key}`, data, {
      headers: { Auth: auth },
    })
    .catch((e) => {
      if (e.response) {
        throw new Error(`Write cache failed: ${e.response.status} ${e.response.data}`);
      }
      throw new Error(`Write cache failed: ${e.message}`);
    });
}

var cache$1 = {
  read,
  write,
};

var require$$1 = [
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
const ProxyFactoryABI = require$$1;

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

const ethereum$1 = {
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
  ethereum: ethereum$1,
  input,
  select,
  radio,
  tab,
  component,
};

var require$$8 = [
	{
		type: "constructor",
		stateMutability: "nonpayable",
		inputs: [
			{
				type: "address",
				name: "_smartcoin",
				internalType: "contract SmartCoin"
			},
			{
				type: "address",
				name: "_devAddr",
				internalType: "address"
			},
			{
				type: "address",
				name: "_treasuryAddr",
				internalType: "address"
			},
			{
				type: "address",
				name: "_investorAddr",
				internalType: "address"
			},
			{
				type: "uint256",
				name: "_joePerSec",
				internalType: "uint256"
			},
			{
				type: "uint256",
				name: "_startTimestamp",
				internalType: "uint256"
			},
			{
				type: "uint256",
				name: "_devPercent",
				internalType: "uint256"
			},
			{
				type: "uint256",
				name: "_treasuryPercent",
				internalType: "uint256"
			},
			{
				type: "uint256",
				name: "_investorPercent",
				internalType: "uint256"
			},
			{
				type: "uint256",
				name: "_dumbFeePercent",
				internalType: "uint256"
			},
			{
				type: "address",
				name: "_dumbTreasuryAddr",
				internalType: "address"
			}
		]
	},
	{
		type: "event",
		name: "Add",
		inputs: [
			{
				type: "uint256",
				name: "pid",
				internalType: "uint256",
				indexed: true
			},
			{
				type: "uint256",
				name: "allocPoint",
				internalType: "uint256",
				indexed: false
			},
			{
				type: "address",
				name: "lpToken",
				internalType: "contract IERC20",
				indexed: true
			},
			{
				type: "address",
				name: "rewarder",
				internalType: "contract IRewarder",
				indexed: true
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "Deposit",
		inputs: [
			{
				type: "address",
				name: "user",
				internalType: "address",
				indexed: true
			},
			{
				type: "uint256",
				name: "pid",
				internalType: "uint256",
				indexed: true
			},
			{
				type: "uint256",
				name: "amount",
				internalType: "uint256",
				indexed: false
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "EmergencyWithdraw",
		inputs: [
			{
				type: "address",
				name: "user",
				internalType: "address",
				indexed: true
			},
			{
				type: "uint256",
				name: "pid",
				internalType: "uint256",
				indexed: true
			},
			{
				type: "uint256",
				name: "amount",
				internalType: "uint256",
				indexed: false
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "Harvest",
		inputs: [
			{
				type: "address",
				name: "user",
				internalType: "address",
				indexed: true
			},
			{
				type: "uint256",
				name: "pid",
				internalType: "uint256",
				indexed: true
			},
			{
				type: "uint256",
				name: "amount",
				internalType: "uint256",
				indexed: false
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "OwnershipTransferred",
		inputs: [
			{
				type: "address",
				name: "previousOwner",
				internalType: "address",
				indexed: true
			},
			{
				type: "address",
				name: "newOwner",
				internalType: "address",
				indexed: true
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "Set",
		inputs: [
			{
				type: "uint256",
				name: "pid",
				internalType: "uint256",
				indexed: true
			},
			{
				type: "uint256",
				name: "allocPoint",
				internalType: "uint256",
				indexed: false
			},
			{
				type: "address",
				name: "rewarder",
				internalType: "contract IRewarder",
				indexed: true
			},
			{
				type: "bool",
				name: "overwrite",
				internalType: "bool",
				indexed: false
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "SetDevAddress",
		inputs: [
			{
				type: "address",
				name: "oldAddress",
				internalType: "address",
				indexed: true
			},
			{
				type: "address",
				name: "newAddress",
				internalType: "address",
				indexed: true
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "UpdateEmissionRate",
		inputs: [
			{
				type: "address",
				name: "user",
				internalType: "address",
				indexed: true
			},
			{
				type: "uint256",
				name: "_joePerSec",
				internalType: "uint256",
				indexed: false
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "UpdatePool",
		inputs: [
			{
				type: "uint256",
				name: "pid",
				internalType: "uint256",
				indexed: true
			},
			{
				type: "uint256",
				name: "lastRewardTimestamp",
				internalType: "uint256",
				indexed: false
			},
			{
				type: "uint256",
				name: "lpSupply",
				internalType: "uint256",
				indexed: false
			},
			{
				type: "uint256",
				name: "accJoePerShare",
				internalType: "uint256",
				indexed: false
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "Withdraw",
		inputs: [
			{
				type: "address",
				name: "user",
				internalType: "address",
				indexed: true
			},
			{
				type: "uint256",
				name: "pid",
				internalType: "uint256",
				indexed: true
			},
			{
				type: "uint256",
				name: "amount",
				internalType: "uint256",
				indexed: false
			}
		],
		anonymous: false
	},
	{
		type: "function",
		stateMutability: "nonpayable",
		outputs: [
		],
		name: "add",
		inputs: [
			{
				type: "uint256",
				name: "_allocPoint",
				internalType: "uint256"
			},
			{
				type: "address",
				name: "_lpToken",
				internalType: "contract IERC20"
			},
			{
				type: "address",
				name: "_rewarder",
				internalType: "contract IRewarder"
			}
		]
	},
	{
		type: "function",
		stateMutability: "nonpayable",
		outputs: [
		],
		name: "deposit",
		inputs: [
			{
				type: "uint256",
				name: "_pid",
				internalType: "uint256"
			},
			{
				type: "uint256",
				name: "_amount",
				internalType: "uint256"
			}
		]
	},
	{
		type: "function",
		stateMutability: "nonpayable",
		outputs: [
		],
		name: "dev",
		inputs: [
			{
				type: "address",
				name: "_devAddr",
				internalType: "address"
			}
		]
	},
	{
		type: "function",
		stateMutability: "view",
		outputs: [
			{
				type: "address",
				name: "",
				internalType: "address"
			}
		],
		name: "devAddr",
		inputs: [
		]
	},
	{
		type: "function",
		stateMutability: "view",
		outputs: [
			{
				type: "uint256",
				name: "",
				internalType: "uint256"
			}
		],
		name: "devPercent",
		inputs: [
		]
	},
	{
		type: "function",
		stateMutability: "view",
		outputs: [
			{
				type: "uint256",
				name: "",
				internalType: "uint256"
			}
		],
		name: "dumbFeePercent",
		inputs: [
		]
	},
	{
		type: "function",
		stateMutability: "view",
		outputs: [
			{
				type: "address",
				name: "",
				internalType: "address"
			}
		],
		name: "dumbTreasuryAddr",
		inputs: [
		]
	},
	{
		type: "function",
		stateMutability: "nonpayable",
		outputs: [
		],
		name: "emergencyWithdraw",
		inputs: [
			{
				type: "uint256",
				name: "_pid",
				internalType: "uint256"
			}
		]
	},
	{
		type: "function",
		stateMutability: "view",
		outputs: [
			{
				type: "address",
				name: "",
				internalType: "address"
			}
		],
		name: "investorAddr",
		inputs: [
		]
	},
	{
		type: "function",
		stateMutability: "view",
		outputs: [
			{
				type: "uint256",
				name: "",
				internalType: "uint256"
			}
		],
		name: "investorPercent",
		inputs: [
		]
	},
	{
		type: "function",
		stateMutability: "view",
		outputs: [
			{
				type: "address",
				name: "",
				internalType: "contract JoeToken"
			}
		],
		name: "joe",
		inputs: [
		]
	},
	{
		type: "function",
		stateMutability: "view",
		outputs: [
			{
				type: "uint256",
				name: "",
				internalType: "uint256"
			}
		],
		name: "joePerSec",
		inputs: [
		]
	},
	{
		type: "function",
		stateMutability: "nonpayable",
		outputs: [
		],
		name: "massUpdatePools",
		inputs: [
		]
	},
	{
		type: "function",
		stateMutability: "view",
		outputs: [
			{
				type: "address",
				name: "",
				internalType: "address"
			}
		],
		name: "owner",
		inputs: [
		]
	},
	{
		type: "function",
		stateMutability: "view",
		outputs: [
			{
				type: "uint256",
				name: "pendingJoe",
				internalType: "uint256"
			},
			{
				type: "address",
				name: "bonusTokenAddress",
				internalType: "address"
			},
			{
				type: "string",
				name: "bonusTokenSymbol",
				internalType: "string"
			},
			{
				type: "uint256",
				name: "pendingBonusToken",
				internalType: "uint256"
			}
		],
		name: "pendingTokens",
		inputs: [
			{
				type: "uint256",
				name: "_pid",
				internalType: "uint256"
			},
			{
				type: "address",
				name: "_user",
				internalType: "address"
			}
		]
	},
	{
		type: "function",
		stateMutability: "view",
		outputs: [
			{
				type: "address",
				name: "lpToken",
				internalType: "contract IERC20"
			},
			{
				type: "uint256",
				name: "allocPoint",
				internalType: "uint256"
			},
			{
				type: "uint256",
				name: "lastRewardTimestamp",
				internalType: "uint256"
			},
			{
				type: "uint256",
				name: "accJoePerShare",
				internalType: "uint256"
			},
			{
				type: "address",
				name: "rewarder",
				internalType: "contract IRewarder"
			}
		],
		name: "poolInfo",
		inputs: [
			{
				type: "uint256",
				name: "",
				internalType: "uint256"
			}
		]
	},
	{
		type: "function",
		stateMutability: "view",
		outputs: [
			{
				type: "uint256",
				name: "",
				internalType: "uint256"
			}
		],
		name: "poolLength",
		inputs: [
		]
	},
	{
		type: "function",
		stateMutability: "nonpayable",
		outputs: [
		],
		name: "renounceOwnership",
		inputs: [
		]
	},
	{
		type: "function",
		stateMutability: "view",
		outputs: [
			{
				type: "address",
				name: "bonusTokenAddress",
				internalType: "address"
			},
			{
				type: "string",
				name: "bonusTokenSymbol",
				internalType: "string"
			}
		],
		name: "rewarderBonusTokenInfo",
		inputs: [
			{
				type: "uint256",
				name: "_pid",
				internalType: "uint256"
			}
		]
	},
	{
		type: "function",
		stateMutability: "nonpayable",
		outputs: [
		],
		name: "set",
		inputs: [
			{
				type: "uint256",
				name: "_pid",
				internalType: "uint256"
			},
			{
				type: "uint256",
				name: "_allocPoint",
				internalType: "uint256"
			},
			{
				type: "address",
				name: "_rewarder",
				internalType: "contract IRewarder"
			},
			{
				type: "bool",
				name: "overwrite",
				internalType: "bool"
			}
		]
	},
	{
		type: "function",
		stateMutability: "nonpayable",
		outputs: [
		],
		name: "setDevPercent",
		inputs: [
			{
				type: "uint256",
				name: "_newDevPercent",
				internalType: "uint256"
			}
		]
	},
	{
		type: "function",
		stateMutability: "nonpayable",
		outputs: [
		],
		name: "setDumbFeePercent",
		inputs: [
			{
				type: "uint256",
				name: "_newDumbFeePercent",
				internalType: "uint256"
			}
		]
	},
	{
		type: "function",
		stateMutability: "nonpayable",
		outputs: [
		],
		name: "setInvestorAddr",
		inputs: [
			{
				type: "address",
				name: "_investorAddr",
				internalType: "address"
			}
		]
	},
	{
		type: "function",
		stateMutability: "nonpayable",
		outputs: [
		],
		name: "setInvestorPercent",
		inputs: [
			{
				type: "uint256",
				name: "_newInvestorPercent",
				internalType: "uint256"
			}
		]
	},
	{
		type: "function",
		stateMutability: "nonpayable",
		outputs: [
		],
		name: "setTreasuryAddr",
		inputs: [
			{
				type: "address",
				name: "_treasuryAddr",
				internalType: "address"
			}
		]
	},
	{
		type: "function",
		stateMutability: "nonpayable",
		outputs: [
		],
		name: "setTreasuryPercent",
		inputs: [
			{
				type: "uint256",
				name: "_newTreasuryPercent",
				internalType: "uint256"
			}
		]
	},
	{
		type: "function",
		stateMutability: "view",
		outputs: [
			{
				type: "uint256",
				name: "",
				internalType: "uint256"
			}
		],
		name: "startTimestamp",
		inputs: [
		]
	},
	{
		type: "function",
		stateMutability: "view",
		outputs: [
			{
				type: "uint256",
				name: "",
				internalType: "uint256"
			}
		],
		name: "totalAllocPoint",
		inputs: [
		]
	},
	{
		type: "function",
		stateMutability: "nonpayable",
		outputs: [
		],
		name: "transferOwnership",
		inputs: [
			{
				type: "address",
				name: "newOwner",
				internalType: "address"
			}
		]
	},
	{
		type: "function",
		stateMutability: "view",
		outputs: [
			{
				type: "address",
				name: "",
				internalType: "address"
			}
		],
		name: "treasuryAddr",
		inputs: [
		]
	},
	{
		type: "function",
		stateMutability: "view",
		outputs: [
			{
				type: "uint256",
				name: "",
				internalType: "uint256"
			}
		],
		name: "treasuryPercent",
		inputs: [
		]
	},
	{
		type: "function",
		stateMutability: "nonpayable",
		outputs: [
		],
		name: "updateEmissionRate",
		inputs: [
			{
				type: "uint256",
				name: "_joePerSec",
				internalType: "uint256"
			}
		]
	},
	{
		type: "function",
		stateMutability: "nonpayable",
		outputs: [
		],
		name: "updatePool",
		inputs: [
			{
				type: "uint256",
				name: "_pid",
				internalType: "uint256"
			}
		]
	},
	{
		type: "function",
		stateMutability: "view",
		outputs: [
			{
				type: "uint256",
				name: "amount",
				internalType: "uint256"
			},
			{
				type: "uint256",
				name: "rewardDebt",
				internalType: "uint256"
			}
		],
		name: "userInfo",
		inputs: [
			{
				type: "uint256",
				name: "",
				internalType: "uint256"
			},
			{
				type: "address",
				name: "",
				internalType: "address"
			}
		]
	},
	{
		type: "function",
		stateMutability: "nonpayable",
		outputs: [
		],
		name: "withdraw",
		inputs: [
			{
				type: "uint256",
				name: "_pid",
				internalType: "uint256"
			},
			{
				type: "uint256",
				name: "_amount",
				internalType: "uint256"
			}
		]
	}
];

var require$$9 = [
	{
		inputs: [
			{
				internalType: "address",
				name: "_info",
				type: "address"
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
				indexed: false,
				internalType: "int256",
				name: "protocolFee",
				type: "int256"
			}
		],
		name: "ProtocolFeeChanged",
		type: "event"
	},
	{
		inputs: [
			{
				internalType: "int256",
				name: "__protocolFee",
				type: "int256"
			}
		],
		name: "changeProtocolFee",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "deadline",
		outputs: [
			{
				internalType: "uint16",
				name: "",
				type: "uint16"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "deposit",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "emergencyWithdraw",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "info",
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
				name: "_staking",
				type: "address"
			},
			{
				internalType: "address",
				name: "_liquidityRouter",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "_pool",
				type: "uint256"
			},
			{
				internalType: "uint16",
				name: "_slippage",
				type: "uint16"
			},
			{
				internalType: "uint16",
				name: "_deadline",
				type: "uint16"
			}
		],
		name: "init",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "liquidityRouter",
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
		name: "pause",
		outputs: [
		],
		stateMutability: "nonpayable",
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
		],
		name: "pool",
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
		name: "protocolFee",
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
		name: "refund",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "rewardToken",
		outputs: [
			{
				internalType: "contract IERC20",
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
				name: "gasFee",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "_deadline",
				type: "uint256"
			},
			{
				internalType: "uint256[2]",
				name: "_outMin",
				type: "uint256[2]"
			}
		],
		name: "run",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "slippage",
		outputs: [
			{
				internalType: "uint16",
				name: "",
				type: "uint16"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "staking",
		outputs: [
			{
				internalType: "contract IMasterChefJoeV2",
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
		name: "stakingToken",
		outputs: [
			{
				internalType: "contract IERC20",
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
				name: "token",
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
		name: "transfer",
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
	},
	{
		inputs: [
		],
		name: "unpause",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	}
];

const { ethers, bn, ethersMulticall, dayjs } = lib;
const { ethereum } = ethereum_1;
const { toFloat } = toFloat$1;
const { tokens } = tokens_1;
const { CoingeckoProvider } = coingecko;
const { getUniPairToken } = masterChefStakingToken;
const cache = cache$1;
const AutomateActions = actions;
const masterChefABI = require$$8;
const MasterChefJoeLpRestakeABI = require$$9;

const masterChefAddress = '0x1495b7e8d7E9700Bd0726F1705E864265724f6e2';

var avaxSmartcoin = {
  masterChef: async (provider, contractAddress, initOptions = ethereum.defaultOptions()) => {
    const options = {
      ...ethereum.defaultOptions(),
      ...initOptions,
    };
    const masterChefSavedPools = await cache.read('avaxSmartcoin', 'masterChefPools');
    const blockTag = options.blockNumber === 'latest' ? 'latest' : parseInt(options.blockNumber, 10);
    const network = (await provider.detectNetwork()).chainId;
    const block = await provider.getBlock(blockTag);
    const priceFeed = new CoingeckoProvider({ block, blockTag }).initPlatform(network);
    const rewardTokenFunctionName = 'joe';

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

    const foundPoolIndex = masterChefPools.find((p) => p.stakingToken.toLowerCase() === contractAddress.toLowerCase());

    poolIndex = foundPoolIndex !== undefined ? foundPoolIndex.index : -1;

    if (poolIndex === -1) {
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

    const [rewardTokenPerSec, totalAllocPoint] = await Promise.all([
      masterChiefContract[`${rewardTokenFunctionName}PerSec`](),
      masterChiefContract.totalAllocPoint(),
    ]);

    const rewardPerSec = toFloat(
      new bn(pool.allocPoint.toString())
        .multipliedBy(rewardTokenPerSec.toString())
        .dividedBy(totalAllocPoint.toString()),
      rewardsTokenDecimals
    );
    const rewardTokenUSD = await priceFeed.contractPrice(rewardsToken);

    const totalLocked = toFloat(
      await ethereum.erc20(provider, contractAddress).balanceOf(masterChefAddress),
      stakingTokenDecimals
    );

    const masterChiefStakingToken = await getUniPairToken(provider, stakingToken, network, blockTag, block);

    const tvl = new bn(totalLocked).multipliedBy(masterChiefStakingToken.getUSD());

    let aprSec = rewardPerSec.multipliedBy(rewardTokenUSD).div(tvl);
    if (!aprSec.isFinite()) aprSec = new bn(0);

    const aprDay = aprSec.multipliedBy(60 * 60 * 24);
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
      metrics: {
        tvl: tvl.toString(10),
        aprDay: aprDay.toString(10),
        aprWeek: aprWeek.toString(10),
        aprMonth: aprMonth.toString(10),
        aprYear: aprYear.toString(10),
      },
      wallet: async (walletAddress) => {
        const { amount, rewardDebt } = await masterChiefContract.userInfo(poolIndex, walletAddress);
        const { accJoePerShare } = await masterChiefContract.poolInfo(poolIndex);
        const balance = toFloat(amount, ethereum.uniswap.pairDecimals);
        const earned = toFloat(
          new bn(amount.toString())
            .multipliedBy(accJoePerShare.toString())
            .div(new bn(10).pow(12))
            .minus(rewardDebt.toString())
            .toString(10),
          rewardsTokenDecimals
        );
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
        const rewardTokenContract = ethereum.erc20(provider, rewardsToken).connect(signer);
        const rewardTokenSymbol = await rewardTokenContract.symbol();
        const stakingTokenContract = ethereum.erc20(provider, stakingToken).connect(signer);
        const stakingTokenSymbol = await stakingTokenContract.symbol();
        const stakingContract = masterChiefContract.connect(signer);

        return {
          stake: [
            AutomateActions.tab(
              'Stake',
              async () => ({
                description: `Stake your [${stakingTokenSymbol}](https://snowtrace.io/address/${stakingToken}) tokens to contract`,
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
                  description: `Unstake your [${stakingTokenSymbol}](https://snowtrace.io/address/${stakingToken}) tokens from contract`,
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
                description: `Claim your [${rewardTokenSymbol}](https://snowtrace.io/address/${rewardsToken}) reward`,
              }),
              async () => {
                const earned = await stakingContract.pendingReward(poolIndex, walletAddress).then((v) => v.toString());
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
  },
  automates: {
    contractsResolver: {
      default: async (provider, initOptions = ethereum.defaultOptions()) => {
        const options = {
          ...ethereum.defaultOptions(),
          ...initOptions,
        };
        const blockTag = options.blockNumber === 'latest' ? 'latest' : parseInt(options.blockNumber, 10);
        const network = (await provider.detectNetwork()).chainId;
        const block = await provider.getBlock(blockTag);

        const masterChiefContract = new ethers.Contract(masterChefAddress, masterChefABI, provider);

        const totalPools = await masterChiefContract.poolLength();
        return (
          await Promise.all(
            (
              await Promise.all(new Array(totalPools.toNumber()).fill(1).map((_, i) => masterChiefContract.poolInfo(i)))
            ).map(async (p, i) => {
              let pair;
              try {
                pair = await getUniPairToken(provider, p.lpToken, network, blockTag, block);
              } catch {
                return null;
              }

              const [token0, token1] = await Promise.all([
                ethereum.erc20Info(provider, pair.token0),
                ethereum.erc20Info(provider, pair.token1),
              ]);

              return {
                poolIndex: i,
                name: `SmartCoin ${token0.symbol}-${token1.symbol} LP`,
                address: p.lpToken,
                deployBlockNumber: pair.block.number,
                blockchain: 'ethereum',
                network: pair.network,
                layout: 'staking',
                adapter: 'masterChef',
                description: '',
                automate: {
                  autorestakeAdapter: 'MasterChefJoeLpRestake',
                  adapters: ['masterChef'],
                  buyLiquidity: {
                    router: '0x60aE616a2155Ee3d9A68541Ba4544862310933d4',
                    pair: p.lpToken,
                  },
                },
                link: '',
              };
            })
          )
        ).filter((v) => v);
      },
    },
    deploy: {
      MasterChefJoeLpRestake: async (signer, factoryAddress, prototypeAddress, contractAddress = undefined) => {
        const masterChefSavedPools = await cache.read('avaxSmartcoin', 'masterChefPools');
        let poolIndex = masterChefSavedPools[0].index.toString();
        if (contractAddress) {
          poolIndex =
            masterChefSavedPools.find(
              ({ stakingToken }) => stakingToken.toLowerCase() === contractAddress.toLowerCase()
            )?.index ?? poolIndex;
        }

        return {
          deploy: [
            AutomateActions.tab(
              'Deploy',
              async () => ({
                description: 'Deploy your own contract',
                inputs: [
                  AutomateActions.input({
                    placeholder: 'Liquidity pool router address',
                    value: '0x60aE616a2155Ee3d9A68541Ba4544862310933d4',
                  }),
                  AutomateActions.input({
                    placeholder: 'Target pool index',
                    value: poolIndex,
                  }),
                  AutomateActions.input({
                    placeholder: 'Slippage (percent)',
                    value: '1',
                  }),
                  AutomateActions.input({
                    placeholder: 'Deadline (seconds)',
                    value: '300',
                  }),
                ],
              }),
              async (router, pool, slippage, deadline) => {
                if (!masterChefSavedPools.find(({ index }) => index === parseInt(pool, 10)))
                  return new Error('Invalid pool index');
                if (slippage < 0 || slippage > 100) return new Error('Invalid slippage percent');
                if (deadline < 0) return new Error('Deadline has already passed');

                return true;
              },
              async (router, pool, slippage, deadline) =>
                AutomateActions.ethereum.proxyDeploy(
                  signer,
                  factoryAddress,
                  prototypeAddress,
                  new ethers.utils.Interface(MasterChefJoeLpRestakeABI).encodeFunctionData('init', [
                    masterChefAddress,
                    router,
                    pool,
                    Math.floor(slippage * 100),
                    deadline,
                  ])
                )
            ),
          ],
        };
      },
    },
    MasterChefJoeLpRestake: async (signer, contractAddress) => {
      const signerAddress = await signer.getAddress();
      const automate = new ethers.Contract(contractAddress, MasterChefJoeLpRestakeABI, signer);
      const stakingAddress = await automate.staking();
      const staking = new ethers.Contract(stakingAddress, masterChefABI, signer);
      const stakingTokenAddress = await automate.stakingToken();
      const stakingToken = ethereum.erc20(signer, stakingTokenAddress);
      const stakingTokenDecimals = await stakingToken.decimals().then((v) => v.toString());
      const poolId = await automate.pool().then((v) => v.toString());

      const deposit = [
        AutomateActions.tab(
          'Transfer',
          async () => ({
            description: 'Transfer your tokens to your contract',
            inputs: [
              AutomateActions.input({
                placeholder: 'amount',
                value: new bn(await stakingToken.balanceOf(signerAddress).then((v) => v.toString()))
                  .div(`1e${stakingTokenDecimals}`)
                  .toString(10),
              }),
            ],
          }),
          async (amount) => {
            const signerBalance = await stakingToken.balanceOf(signerAddress).then((v) => v.toString());
            const amountInt = new bn(amount).multipliedBy(`1e${stakingTokenDecimals}`);
            if (amountInt.lte(0)) return Error('Invalid amount');
            if (amountInt.gt(signerBalance)) return Error('Insufficient funds on the balance');

            return true;
          },
          async (amount) => ({
            tx: await stakingToken.transfer(
              automate.address,
              new bn(amount).multipliedBy(`1e${stakingTokenDecimals}`).toFixed(0)
            ),
          })
        ),
        AutomateActions.tab(
          'Deposit',
          async () => ({
            description: 'Stake your tokens to the contract',
          }),
          async () => {
            const automateBalance = new bn(await stakingToken.balanceOf(automate.address).then((v) => v.toString()));
            const automateOwner = await automate.owner();
            if (automateBalance.lte(0)) return new Error('Insufficient funds on the automate contract balance');
            if (signerAddress.toLowerCase() !== automateOwner.toLowerCase()) return new Error('Someone else contract');

            return true;
          },
          async () => ({
            tx: await automate.deposit(),
          })
        ),
      ];
      const refund = [
        AutomateActions.tab(
          'Refund',
          async () => ({
            description: 'Transfer your tokens from automate',
          }),
          async () => {
            const automateOwner = await automate.owner();
            if (signerAddress.toLowerCase() !== automateOwner.toLowerCase()) return new Error('Someone else contract');

            return true;
          },
          async () => ({
            tx: await automate.refund(),
          })
        ),
      ];
      const migrate = [
        AutomateActions.tab(
          'Withdraw',
          async () => ({
            description: 'Withdraw your tokens from staking',
          }),
          async () => {
            const userInfo = await staking.userInfo(poolId, signerAddress);
            if (new bn(userInfo.amount.toString()).lte(0))
              return new Error('Insufficient funds on the staking contract balance');

            return true;
          },
          async () => {
            const userInfo = await staking.userInfo(poolId, signerAddress);
            return {
              tx: await staking.withdraw(poolId, userInfo.amount.toString()),
            };
          }
        ),
        ...deposit,
      ];
      const runParams = async () => {
        const provider = signer.provider || signer;
        const chainId = await provider.getNetwork().then(({ chainId }) => chainId);
        const multicall = new ethersMulticall.Provider(signer, chainId);
        const automateMulticall = new ethersMulticall.Contract(contractAddress, MasterChefJoeLpRestakeABI);
        const stakingMulticall = new ethersMulticall.Contract(stakingAddress, masterChefABI);
        const stakingTokenMulticall = new ethersMulticall.Contract(stakingTokenAddress, ethereum.uniswap.pairABI);
        const [
          routerAddress,
          slippagePercent,
          deadlineSeconds,
          token0Address,
          token1Address,
          rewardTokenAddress,
          { amount, rewardDebt },
          { accJoePerShare },
        ] = await multicall.all([
          automateMulticall.liquidityRouter(),
          automateMulticall.slippage(),
          automateMulticall.deadline(),
          stakingTokenMulticall.token0(),
          stakingTokenMulticall.token1(),
          automateMulticall.rewardToken(),
          stakingMulticall.userInfo(poolId, contractAddress),
          stakingMulticall.poolInfo(poolId),
        ]);
        const earned = new bn(amount.toString())
          .multipliedBy(accJoePerShare.toString())
          .div(new bn(10).pow(12))
          .minus(rewardDebt.toString());
        if (earned.toString(10) === '0') return new Error('No earned');
        const router = ethereum.uniswap.router(signer, routerAddress);

        const slippage = 1 - slippagePercent / 10000;
        const token0AmountIn = new bn(earned.toString(10)).div(2).toFixed(0);
        let token0Min = new bn(token0AmountIn).multipliedBy(slippage).toFixed(0);
        if (token0Address.toLowerCase() !== rewardTokenAddress.toLowerCase()) {
          const [, amountOut] = await router.getAmountsOut(token0AmountIn, [rewardTokenAddress, token0Address]);
          token0Min = new bn(amountOut.toString()).multipliedBy(slippage).toFixed(0);
        }
        const token1AmountIn = new bn(earned.toString(10)).minus(token0AmountIn).toFixed(0);
        let token1Min = new bn(token1AmountIn).multipliedBy(slippage).toFixed(0);
        if (token1Address.toLowerCase() !== rewardTokenAddress.toLowerCase()) {
          const [, amountOut] = await router.getAmountsOut(token1AmountIn, [rewardTokenAddress, token1Address]);
          token1Min = new bn(amountOut.toString()).multipliedBy(slippage).toFixed(0);
        }
        const deadline = dayjs().add(deadlineSeconds, 'seconds').unix();

        const gasLimit = new bn(
          await automate.estimateGas.run(0, deadline, [token0Min, token1Min]).then((v) => v.toString())
        )
          .multipliedBy(1.1)
          .toFixed(0);
        const gasPrice = await signer.getGasPrice().then((v) => v.toString());
        const gasFee = new bn(gasLimit).multipliedBy(gasPrice).toFixed(0);

        await automate.estimateGas.run(gasFee, deadline, [token0Min, token1Min]);
        return {
          gasPrice,
          gasLimit,
          calldata: [gasFee, deadline, [token0Min, token1Min]],
        };
      };
      const run = async () => {
        const { gasPrice, gasLimit, calldata } = await runParams();
        return automate.run.apply(automate, [
          ...calldata,
          {
            gasPrice,
            gasLimit,
          },
        ]);
      };

      return {
        contract: stakingTokenAddress,
        deposit,
        refund,
        migrate,
        runParams,
        run,
      };
    },
  },
};

module.exports = avaxSmartcoin;

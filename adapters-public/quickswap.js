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

const { ethers: ethers$4, bn: bn$6, ethersMulticall: ethersMulticall$1 } = lib;
const ERC20ABI = require$$1$1;
const DFHStorageABI = require$$2;
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
    if (new bn$6(allowance).isGreaterThanOrEqualTo(value)) return;
    if (new bn$6(allowance).isGreaterThan(0)) {
      await erc20.approve(spender, '0').then((tx) => tx.wait());
    }
    return erc20.approve(spender, new bn$6(2).pow(256).minus(1).toFixed(0)).then((tx) => tx.wait());
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
          token0: new bn$6(balance).multipliedBy(this.reserve0).div(this.totalSupply),
          token1: new bn$6(balance).multipliedBy(this.reserve1).div(this.totalSupply),
        };
      }

      calcPrice(token0Price, token1Price) {
        const reserve0 = new bn$6(this.reserve0).multipliedBy(token0Price);
        const reserve1 = new bn$6(this.reserve1).multipliedBy(token1Price);
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
      totalSupply = new bn$6(totalSupply.toString()).div(new bn$6(10).pow(ethereum$5.uniswap.pairDecimals)).toString();
      let [{ decimals: token0Decimals }, { decimals: token1Decimals }] = await Promise.all([
        ethereum$5.erc20Info(provider, token0, options),
        ethereum$5.erc20Info(provider, token1, options),
      ]);
      token0Decimals = token0Decimals.toString();
      token1Decimals = token1Decimals.toString();
      const reserve0 = new bn$6(reserves[0].toString()).div(new bn$6(10).pow(token0Decimals)).toString(10);
      const reserve1 = new bn$6(reserves[1].toString()).div(new bn$6(10).pow(token1Decimals)).toString(10);

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
          if (new bn$6(result.amountOut).isGreaterThanOrEqualTo(amountOut)) return result;

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

const { ethers: ethers$3, dayjs: dayjs$1, axios: axios$1 } = lib;

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

const { bn: bn$5 } = lib;

var toFloat$3 = {
  toFloat: (n, decimals) => new bn$5(n.toString()).div(new bn$5(10).pow(decimals)),
};

const { bn: bn$4 } = lib;

const tokens$3 = (...tokens) =>
  tokens.reduce((prev, { token, data }) => {
    if (prev[token]) {
      return {
        ...prev,
        [token]: Object.entries(data).reduce(
          (prev, [k, v]) => ({
            ...prev,
            [k]: prev[k] ? new bn$4(prev[k]).plus(v).toString(10) : v,
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

const { ethers: ethers$2 } = lib;
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

const { bn: bn$3 } = lib;
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

    let stakingTokenUSD = new bn$3(reserve0)
      .multipliedBy(token0Usd)
      .plus(new bn$3(reserve1).multipliedBy(token1Usd))
      .div(totalSupply);
    if (!stakingTokenUSD.isFinite()) stakingTokenUSD = new bn$3(0);

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
    let token0Balance = new bn$3(balance).multipliedBy(this.reserve0).div(this.totalSupply);
    if (!token0Balance.isFinite()) token0Balance = new bn$3(0);
    const token0BalanceUSD = token0Balance.multipliedBy(this.token0Usd);
    let token1Balance = new bn$3(balance).multipliedBy(this.reserve1).div(this.totalSupply);
    if (!token1Balance.isFinite()) token1Balance = new bn$3(0);
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
    let tokenUSD = new bn$3(await priceFeed.contractPrice(this.token));

    if (!tokenUSD.isFinite()) tokenUSD = new bn$3(0);

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

const { ethers: ethers$1, bn: bn$2 } = lib;
const { bridgeWrapperBuild } = coingecko$1;
const { ethereum: ethereum$2 } = ethereum_1;
const { toFloat: toFloat$2 } = toFloat$3;
const { tokens: tokens$2 } = tokens_1;
const AutomateActions$1 = actions;
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
        new bn$2(pool.allocPoint.toString())
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

      const tvl = new bn$2(totalLocked).multipliedBy(masterChiefStakingToken.getUSD());

      let aprBlock = rewardPerBlock.multipliedBy(rewardTokenUSD).div(tvl);
      if (!aprBlock.isFinite()) aprBlock = new bn$2(0);

      const blocksPerDay = new bn$2((1000 * 60 * 60 * 24) / avgBlockTime);
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
                      value: new bn$2(await stakingTokenContract.balanceOf(walletAddress).then((v) => v.toString()))
                        .div(`1e${stakingTokenDecimals}`)
                        .toString(10),
                    }),
                  ],
                }),
                async (amount) => {
                  const amountInt = new bn$2(amount).multipliedBy(`1e${stakingTokenDecimals}`);
                  if (amountInt.lte(0)) return Error('Invalid amount');

                  const balance = await stakingTokenContract.balanceOf(walletAddress).then((v) => v.toString());
                  if (amountInt.gt(balance)) return Error('Insufficient funds on the balance');

                  return true;
                },
                async (amount) => {
                  const amountInt = new bn$2(amount).multipliedBy(`1e${stakingTokenDecimals}`);
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
                        value: new bn$2(userInfo.amount.toString()).div(`1e${stakingTokenDecimals}`).toString(10),
                      }),
                    ],
                  };
                },
                async (amount) => {
                  const amountInt = new bn$2(amount).multipliedBy(`1e${stakingTokenDecimals}`);
                  if (amountInt.lte(0)) return Error('Invalid amount');

                  const userInfo = await stakingContract.userInfo(poolIndex, walletAddress);
                  if (amountInt.isGreaterThan(userInfo.amount.toString())) {
                    return Error('Amount exceeds balance');
                  }

                  return true;
                },
                async (amount) => {
                  const amountInt = new bn$2(amount).multipliedBy(`1e${stakingTokenDecimals}`);

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
                  if (new bn$2(earned).isLessThanOrEqualTo(0)) {
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
                    new bn$2(earned).isLessThanOrEqualTo(0) &&
                    new bn$2(userInfo.amount.toString()).isLessThanOrEqualTo(0)
                  ) {
                    return Error('No staked');
                  }

                  return true;
                },
                async () => {
                  const userInfo = await stakingContract.userInfo(poolIndex, walletAddress);
                  if (new bn$2(userInfo.amount.toString()).isGreaterThan(0)) {
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

const { ethers, bn: bn$1, ethersMulticall } = lib;
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
  let aprBlock = new bn$1(rewardRate.toString()).multipliedBy(rewardTokenUSD).div(tvl);
  if (!aprBlock.isFinite()) aprBlock = new bn$1(0);
  return aprBlock.multipliedBy(blocksPerDay);
};

var staking$2 = {
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
      const blocksPerDay = new bn$1((1000 * 60 * 60 * 24) / avgBlockTime);

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
      if (new bn$1(periodFinish).lt(blockNumber)) rewardRate = new bn$1('0');
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
          if (!token0Balance.isFinite()) token0Balance = new bn$1(0);
          const token0BalanceUSD = token0Balance.multipliedBy(token0Usd);
          let token1Balance = balance.multipliedBy(reserve1).div(lpTotalSupply);
          if (!token1Balance.isFinite()) token1Balance = new bn$1(0);
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
                      value: new bn$1(await stakingContract.balanceOf(walletAddress).then((v) => v.toString()))
                        .div(`1e${stakingTokenDecimals}`)
                        .toString(10),
                    }),
                  ],
                }),
                async (amount) => {
                  const amountInt = new bn$1(amount).multipliedBy(`1e${stakingTokenDecimals}`);
                  if (amountInt.lte(0)) return Error('Invalid amount');

                  const balance = await stakingContract.balanceOf(walletAddress).then((v) => v.toString());
                  if (amountInt.isGreaterThan(balance)) {
                    return Error('Amount exceeds balance');
                  }

                  return true;
                },
                async (amount) => {
                  const amountInt = new bn$1(amount).multipliedBy(`1e${stakingTokenDecimals}`);

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
                  if (new bn$1(earned).isLessThanOrEqualTo(0)) {
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
const { masterChef } = masterChef$1;
const staking$1 = staking$2;
const { tokens } = tokens_1;
const { toFloat } = toFloat$3;

var utils = {
  toFloat,
  tokens,
  ethereum,
  waves,
  coingecko,
  masterChef,
  staking: staking$1,
};

const { axios, bn, dayjs } = lib;
const { staking } = utils;

const getTimestampsBlocks = async (timestamps) => {
  const res = (await axios.post('https://api.thegraph.com/subgraphs/name/sameepsi/maticblocks', {
    query: `
      query blocks {
        ${timestamps.map(timestamp => `
         t${timestamp}:blocks(
            first: 1
            orderBy: timestamp
            orderDirection: asc
            where: { timestamp_gt: ${timestamp}, timestamp_lt: ${timestamp + 600} }
         ) {
           number
         }
        `)}
      }
    `,
    variables: {},
  }));
  return Object.values(res.data.data).map(blocks => Number(blocks[0].number));
};


const getPairVolume = async (id, block) => {
  const res = (await axios.post('https://api.thegraph.com/subgraphs/name/sameepsi/quickswap06', {
    query: `
     {
      pair(${block ? `block: {number: ${block}}` : ``} id: "${id}")
          {
            id
            volumeUSD
            __typename
           }
      }
    `,
    variables: {},
  }));

  return Number(res.data.data.pair.volumeUSD);
};

const getApyPerDay = async (provider, stakingToken, contractAddress, rewardRate, rewardTokenUSD, tvl) => {
  const ago24h = dayjs.unix(Math.round(Date.now() / 1000)).subtract(1, 'day').startOf('minute').unix();
  const [block24hAgo] = await getTimestampsBlocks([ago24h]);
  const [currentVolume, volume24hAgo] = await Promise.all([
    getPairVolume(stakingToken),
    getPairVolume(stakingToken, block24hAgo),
  ]);

  const volume24h = currentVolume - volume24hAgo;
  const fee24h = volume24h * 0.003;

  const rewardUSDPerDay = new bn(rewardRate).multipliedBy(60 * 60 * 24).multipliedBy(rewardTokenUSD);

  return (rewardUSDPerDay.plus(fee24h)).div(tvl);
};

var quickswap = {
  // For instance: 0x4A73218eF2e820987c59F838906A82455F42D98b
  polygonStakingRewards: staking.synthetixStaking(getApyPerDay),
};

module.exports = quickswap;

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var lib = {
  env: {},
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

const { ethers: ethers$2, bn: bn$3, ethersMulticall: ethersMulticall$1 } = lib;
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
  erc20: (provider, address) => new ethers$2.Contract(address, ERC20ABI, provider),
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
    if (new bn$3(allowance).isGreaterThanOrEqualTo(value)) return;
    if (new bn$3(allowance).isGreaterThan(0)) {
      await erc20.approve(spender, '0').then((tx) => tx.wait());
    }
    return erc20.approve(spender, new bn$3(2).pow(256).minus(1).toFixed(0)).then((tx) => tx.wait());
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
          token0: new bn$3(balance).multipliedBy(this.reserve0).div(this.totalSupply),
          token1: new bn$3(balance).multipliedBy(this.reserve1).div(this.totalSupply),
        };
      }

      calcPrice(token0Price, token1Price) {
        const reserve0 = new bn$3(this.reserve0).multipliedBy(token0Price);
        const reserve1 = new bn$3(this.reserve1).multipliedBy(token1Price);
        return reserve0.plus(reserve1).div(this.totalSupply);
      }
    },
    pairDecimals: 18,
    pairABI: UniswapPairABI,
    pair: (provider, address) => new ethers$2.Contract(address, UniswapPairABI, provider),
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
      totalSupply = new bn$3(totalSupply.toString()).div(new bn$3(10).pow(ethereum$3.uniswap.pairDecimals)).toString();
      let [{ decimals: token0Decimals }, { decimals: token1Decimals }] = await Promise.all([
        ethereum$3.erc20Info(provider, token0, options),
        ethereum$3.erc20Info(provider, token1, options),
      ]);
      token0Decimals = token0Decimals.toString();
      token1Decimals = token1Decimals.toString();
      const reserve0 = new bn$3(reserves[0].toString()).div(new bn$3(10).pow(token0Decimals)).toString(10);
      const reserve1 = new bn$3(reserves[1].toString()).div(new bn$3(10).pow(token1Decimals)).toString(10);

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
          if (new bn$3(result.amountOut).isGreaterThanOrEqualTo(amountOut)) return result;

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

const { dayjs: dayjs$1, axios: axios$1 } = lib;

const errorHandler = (e) => {
  const { method, url } = e.config;
  throw new Error(`coingecko ${method} ${url}: ${e}`);
};

class CoingeckoProvider {
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
    { block, blockTag, platform = CoingeckoProvider.platformMap[1] },
    apiURL = CoingeckoProvider.defaultApiURL
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
    this.network.platform = CoingeckoProvider.platformMap[chainId];

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
    const alias = aliases[address.toLowerCase()];
    if (typeof alias === 'object') {
      return typeof alias.id === 'string'
        ? new CoingeckoProvider({ block, blockTag }).price(alias.id)
        : new CoingeckoProvider({ block, blockTag, platform: alias.platform }).contractPrice(alias.address);
    }

    return new CoingeckoProvider({ block, blockTag }).initPlatform(network).contractPrice(address);
  };
}

var coingecko = {
  CoingeckoProvider,
  bridgeWrapperBuild: bridgeWrapperBuild$1,
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
const AutomateActions$1 = actions;

/**
 * @typedef {{ blockTag: string | number }} Options
 */
/**
 * @typedef {{
 * 	lpToken: string;
 * 	allocPoint: BigNumber;
 * 	accRewardPerShare: BigNumber;
 * }} PoolInfo
 */
/**
 * @typedef {{
 * 	amount: BigNumber;
 * 	rewardDebt: BigNumber;
 * }} UserInfo
 */
/**
 * @typedef {{
 * 	contract: ethers.Contract;
 * 	options: Options;
 * }} MasterChefContext
 */
/**
 * @typedef {{
 *  connect(signer: ethers.Wallet): MasterChefProvider;
 * 	stakingToken(this: MasterChefProvider, pool: PoolInfo): Promise<string>;
 * 	rewardToken(this: MasterChefProvider): Promise<string>;
 * 	rewardPerSecond(this: MasterChefProvider): Promise<BigNumber>;
 * 	totalAllocPoint(this: MasterChefProvider): Promise<BigNumber>;
 * 	totalLocked(this: MasterChefProvider, pool: PoolInfo): Promise<BigNumber>;
 * 	poolInfo(this: MasterChefProvider, poolIndex: string | number): Promise<PoolInfo>;
 *  userInfo(this: MasterChefProvider, poolIndex: string | number, wallet: string): Promise<UserInfo>;
 *  pendingReward(this: MasterChefProvider, poolIndex: string | number, wallet: string): Promise<BigNumber>;
 *  deposit(this: MasterChefProvider, poolIndex: string | number, amount: string | number): Promise<ethers.Transaction>;
 *  withdraw(this: MasterChefProvider, poolIndex: string | number, amount: string | number): Promise<ethers.Transaction>;
 * }} MasterChefImplementation
 */
/**
 * @typedef {MasterChefContext & MasterChefImplementation} MasterChefProvider
 */

function toBN$1(v) {
  return new bn$1(v.toString());
}

const defaultProviderImplementation = {
  /**
   * @type {MasterChefImplementation['stakingToken']}
   */
  stakingToken({ lpToken }) {
    return lpToken;
  },
  /**
   * @type {MasterChefImplementation['totalAllocPoint']}
   */
  totalAllocPoint() {
    return this.contract.totalAllocPoint({ blockTag: this.options.blockTag }).then(toBN$1);
  },
  /**
   * @type {MasterChefImplementation['totalLocked']}
   */
  async totalLocked(pool) {
    const stakingToken = await this.stakingToken(pool);
    return ethereum$1
      .erc20(this.contract.provider, stakingToken)
      .balanceOf(this.contract.address, { blockTag: this.options.blockTag })
      .then(toBN$1);
  },
  /**
   * @type {MasterChefImplementation['userInfo']}
   */
  userInfo(poolIndex, wallet) {
    return this.contract
      .userInfo(poolIndex, wallet, { blockTag: this.options.blockTag })
      .then(({ amount, rewardDebt }) => ({
        amount: toBN$1(amount),
        rewardDebt: toBN$1(rewardDebt),
      }));
  },
  /**
   * @type {MasterChefImplementation['pendingReward']}
   */
  pendingReward(poolIndex, wallet) {
    return this.contract.pendingRewards(poolIndex, wallet).then(toBN$1);
  },
  /**
   * @type {MasterChefImplementation['deposit']}
   */
  deposit(poolIndex, amount) {
    return this.contract.deposit(poolIndex, amount);
  },
  /**
   * @type {MasterChefImplementation['withdraw']}
   */
  withdraw(poolIndex, amount) {
    return this.contract.withdraw(poolIndex, amount);
  },
};

/**
 *
 * @param {ethers.Contract} contract
 * @param {Options} options
 * @param {MasterChefImplementation} implementation
 * @returns {MasterChefProvider}
 */
function buildMasterChefProvider$1(
  contract,
  { blockTag },
  {
    stakingToken = defaultProviderImplementation.stakingToken,
    rewardToken,
    rewardPerSecond,
    totalAllocPoint = defaultProviderImplementation.totalAllocPoint,
    totalLocked = defaultProviderImplementation.totalLocked,
    poolInfo,
    userInfo = defaultProviderImplementation.userInfo,
    pendingReward = defaultProviderImplementation.pendingReward,
    deposit = defaultProviderImplementation.deposit,
    withdraw = defaultProviderImplementation.withdraw,
  }
) {
  const options = { blockTag };
  return {
    contract,
    options,
    connect(signer) {
      this.contract = contract.connect(signer);
      return this;
    },
    stakingToken(pool) {
      return stakingToken.call(this, pool);
    },
    rewardToken() {
      return rewardToken.call(this);
    },
    poolInfo(poolIndex) {
      return poolInfo.call(this, poolIndex);
    },
    rewardPerSecond() {
      return rewardPerSecond.call(this);
    },
    totalAllocPoint() {
      return totalAllocPoint.call(this);
    },
    totalLocked(pool) {
      return totalLocked.call(this, pool);
    },
    userInfo(poolIndex, wallet) {
      return userInfo.call(this, poolIndex, wallet);
    },
    pendingReward(poolIndex, wallet) {
      return pendingReward.call(this, poolIndex, wallet);
    },
    deposit(poolIndex, amount) {
      return deposit.call(this, poolIndex, amount);
    },
    withdraw(poolIndex, amount) {
      return withdraw.call(this, poolIndex, amount);
    },
  };
}

/**
 *
 * @param {MasterChefProvider} masterChefProvider
 * @param {{
 *  poolIndex: number | string,
 *  poolInfo: PoolInfo,
 *  signer: ehters.Wallet,
 *  etherscanAddressURL: string,
 * }} options
 *
 * @returns {Promise<any>}
 */
async function buildMasterChefActions$1(masterChefProvider, { poolIndex, poolInfo, signer, etherscanAddressURL }) {
  masterChefProvider.connect(signer);
  const rewardTokenContract = ethereum$1
    .erc20(masterChefProvider.contract.provider, await masterChefProvider.rewardToken())
    .connect(signer);
  const stakingTokenContract = ethereum$1
    .erc20(masterChefProvider.contract.provider, await masterChefProvider.stakingToken(poolInfo))
    .connect(signer);
  const [rewardTokenSymbol, stakingTokenSymbol, stakingTokenDecimals] = await Promise.all([
    rewardTokenContract.symbol(),
    stakingTokenContract.symbol(),
    stakingTokenContract.decimals().then(toBN$1),
  ]);

  return async (walletAddress) => ({
    stake: [
      AutomateActions$1.tab(
        'Stake',
        async () => ({
          description: `Stake your [${stakingTokenSymbol}](${etherscanAddressURL}/${stakingTokenContract.address}) tokens to contract`,
          inputs: [
            AutomateActions$1.input({
              placeholder: 'amount',
              value: await stakingTokenContract
                .balanceOf(walletAddress)
                .then(toBN$1)
                .then((v) => v.div(`1e${stakingTokenDecimals}`).toString(10)),
            }),
          ],
        }),
        async (amount) => {
          const amountInt = new bn$1(amount).multipliedBy(`1e${stakingTokenDecimals}`);
          if (amountInt.lte(0)) return Error('Invalid amount');

          const balance = await stakingTokenContract.balanceOf(walletAddress).then(toBN$1);
          if (amountInt.gt(balance)) return Error('Insufficient funds on the balance');

          return true;
        },
        async (amount) => {
          const amountInt = new bn$1(amount).multipliedBy(`1e${stakingTokenDecimals}`);
          await ethereum$1.erc20ApproveAll(
            stakingTokenContract,
            walletAddress,
            masterChefProvider.contract.address,
            amountInt.toFixed(0)
          );

          return { tx: await masterChefProvider.deposit(poolIndex, amountInt.toFixed(0)) };
        }
      ),
    ],
    unstake: [
      AutomateActions$1.tab(
        'Unstake',
        async () => {
          const { amount } = await masterChefProvider.userInfo(poolIndex, walletAddress);

          return {
            description: `Unstake your [${stakingTokenSymbol}](${etherscanAddressURL}/${stakingTokenContract.address}) tokens from contract`,
            inputs: [
              AutomateActions$1.input({
                placeholder: 'amount',
                value: amount.div(`1e${stakingTokenDecimals}`).toString(10),
              }),
            ],
          };
        },
        async (amount) => {
          const amountInt = new bn$1(amount).multipliedBy(`1e${stakingTokenDecimals}`);
          if (amountInt.lte(0)) return Error('Invalid amount');

          const userInfo = await masterChefProvider.userInfo(poolIndex, walletAddress);
          if (amountInt.isGreaterThan(userInfo.amount)) {
            return Error('Amount exceeds balance');
          }

          return true;
        },
        async (amount) => {
          const amountInt = new bn$1(amount).multipliedBy(`1e${stakingTokenDecimals}`);

          return { tx: await masterChefProvider.withdraw(poolIndex, amountInt.toFixed(0)) };
        }
      ),
    ],
    claim: [
      AutomateActions$1.tab(
        'Claim',
        async () => ({
          description: `Claim your [${rewardTokenSymbol}](${etherscanAddressURL}/${rewardTokenContract.address}) reward`,
        }),
        async () => {
          const earned = await masterChefProvider.pendingReward(poolIndex, walletAddress);
          if (earned.isLessThanOrEqualTo(0)) {
            return Error('No earnings');
          }

          return true;
        },
        async () => {
          return { tx: await masterChefProvider.deposit(poolIndex, 0) };
        }
      ),
    ],
    exit: [
      AutomateActions$1.tab(
        'Exit',
        async () => ({
          description: 'Get all tokens from contract',
        }),
        async () => {
          const earned = await masterChefProvider.pendingReward(poolIndex, walletAddress);
          const { amount } = await masterChefProvider.userInfo(poolIndex, walletAddress);
          if (earned.isLessThanOrEqualTo(0) && amount.isLessThanOrEqualTo(0)) {
            return Error('No staked');
          }

          return true;
        },
        async () => {
          const { amount } = await masterChefProvider.userInfo(poolIndex, walletAddress);
          if (amount.isGreaterThan(0)) {
            await masterChefProvider.withdraw(poolIndex, amount.toFixed(0));
          }

          return { tx: await masterChefProvider.deposit(poolIndex, 0) };
        }
      ),
    ],
  });
}

var provider = {
  toBN: toBN$1,
  defaultProviderImplementation,
  buildMasterChefProvider: buildMasterChefProvider$1,
  buildMasterChefActions: buildMasterChefActions$1,
};

const { axios, env } = lib;

async function read(protocol, key) {
  return axios
    .get(`${env.CACHE_HOST}/${protocol}/${key}.json`)
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
    .post(`${env.CACHE_HOST}/${protocol}/${key}.json`, data, {
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

var require$$7 = [
	{
		inputs: [
			{
				internalType: "contract JoeToken",
				name: "_joe",
				type: "address"
			},
			{
				internalType: "address",
				name: "_devAddr",
				type: "address"
			},
			{
				internalType: "address",
				name: "_treasuryAddr",
				type: "address"
			},
			{
				internalType: "address",
				name: "_investorAddr",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "_joePerSec",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "_startTimestamp",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "_devPercent",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "_treasuryPercent",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "_investorPercent",
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
				internalType: "uint256",
				name: "pid",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "allocPoint",
				type: "uint256"
			},
			{
				indexed: true,
				internalType: "contract IERC20",
				name: "lpToken",
				type: "address"
			},
			{
				indexed: true,
				internalType: "contract IRewarder",
				name: "rewarder",
				type: "address"
			}
		],
		name: "Add",
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
		name: "Harvest",
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
				internalType: "uint256",
				name: "pid",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "allocPoint",
				type: "uint256"
			},
			{
				indexed: true,
				internalType: "contract IRewarder",
				name: "rewarder",
				type: "address"
			},
			{
				indexed: false,
				internalType: "bool",
				name: "overwrite",
				type: "bool"
			}
		],
		name: "Set",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "oldAddress",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "newAddress",
				type: "address"
			}
		],
		name: "SetDevAddress",
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
				name: "_joePerSec",
				type: "uint256"
			}
		],
		name: "UpdateEmissionRate",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "pid",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "lastRewardTimestamp",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "lpSupply",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "accJoePerShare",
				type: "uint256"
			}
		],
		name: "UpdatePool",
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
				internalType: "contract IRewarder",
				name: "_rewarder",
				type: "address"
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
				name: "_devAddr",
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
		name: "devAddr",
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
		name: "devPercent",
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
		name: "emergencyWithdraw",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "investorAddr",
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
		name: "investorPercent",
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
		name: "joe",
		outputs: [
			{
				internalType: "contract JoeToken",
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
		name: "joePerSec",
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
		name: "pendingTokens",
		outputs: [
			{
				internalType: "uint256",
				name: "pendingJoe",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "bonusTokenAddress",
				type: "address"
			},
			{
				internalType: "string",
				name: "bonusTokenSymbol",
				type: "string"
			},
			{
				internalType: "uint256",
				name: "pendingBonusToken",
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
				name: "lastRewardTimestamp",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "accJoePerShare",
				type: "uint256"
			},
			{
				internalType: "contract IRewarder",
				name: "rewarder",
				type: "address"
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
			}
		],
		name: "rewarderBonusTokenInfo",
		outputs: [
			{
				internalType: "address",
				name: "bonusTokenAddress",
				type: "address"
			},
			{
				internalType: "string",
				name: "bonusTokenSymbol",
				type: "string"
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
				internalType: "contract IRewarder",
				name: "_rewarder",
				type: "address"
			},
			{
				internalType: "bool",
				name: "overwrite",
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
				name: "_newDevPercent",
				type: "uint256"
			}
		],
		name: "setDevPercent",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_investorAddr",
				type: "address"
			}
		],
		name: "setInvestorAddr",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_newInvestorPercent",
				type: "uint256"
			}
		],
		name: "setInvestorPercent",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_treasuryAddr",
				type: "address"
			}
		],
		name: "setTreasuryAddr",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_newTreasuryPercent",
				type: "uint256"
			}
		],
		name: "setTreasuryPercent",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "startTimestamp",
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
		],
		name: "treasuryAddr",
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
		name: "treasuryPercent",
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
				name: "_joePerSec",
				type: "uint256"
			}
		],
		name: "updateEmissionRate",
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

var require$$8 = [
	{
		inputs: [
			{
				internalType: "contract IMasterChef",
				name: "_MASTER_CHEF_V2",
				type: "address"
			},
			{
				internalType: "contract IERC20",
				name: "_joe",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "_MASTER_PID",
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
				internalType: "uint256",
				name: "pid",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "allocPoint",
				type: "uint256"
			},
			{
				indexed: true,
				internalType: "contract IERC20",
				name: "lpToken",
				type: "address"
			},
			{
				indexed: true,
				internalType: "contract IRewarder",
				name: "rewarder",
				type: "address"
			}
		],
		name: "Add",
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
		name: "Harvest",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
		],
		name: "Init",
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
				internalType: "uint256",
				name: "pid",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "allocPoint",
				type: "uint256"
			},
			{
				indexed: true,
				internalType: "contract IRewarder",
				name: "rewarder",
				type: "address"
			},
			{
				indexed: false,
				internalType: "bool",
				name: "overwrite",
				type: "bool"
			}
		],
		name: "Set",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "pid",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "lastRewardTimestamp",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "lpSupply",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "accJoePerShare",
				type: "uint256"
			}
		],
		name: "UpdatePool",
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
		name: "JOE",
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
		],
		name: "MASTER_CHEF_V2",
		outputs: [
			{
				internalType: "contract IMasterChef",
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
		name: "MASTER_PID",
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
				name: "allocPoint",
				type: "uint256"
			},
			{
				internalType: "contract IERC20",
				name: "_lpToken",
				type: "address"
			},
			{
				internalType: "contract IRewarder",
				name: "_rewarder",
				type: "address"
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
				internalType: "uint256",
				name: "pid",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amount",
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
				name: "pid",
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
		],
		name: "harvestFromMasterChef",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "contract IERC20",
				name: "dummyToken",
				type: "address"
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
		name: "joePerSec",
		outputs: [
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256[]",
				name: "pids",
				type: "uint256[]"
			}
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
		name: "pendingTokens",
		outputs: [
			{
				internalType: "uint256",
				name: "pendingJoe",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "bonusTokenAddress",
				type: "address"
			},
			{
				internalType: "string",
				name: "bonusTokenSymbol",
				type: "string"
			},
			{
				internalType: "uint256",
				name: "pendingBonusToken",
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
				name: "accJoePerShare",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "lastRewardTimestamp",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "allocPoint",
				type: "uint256"
			},
			{
				internalType: "contract IRewarder",
				name: "rewarder",
				type: "address"
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
				name: "pools",
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
				internalType: "contract IRewarder",
				name: "_rewarder",
				type: "address"
			},
			{
				internalType: "bool",
				name: "overwrite",
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
				name: "pid",
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
				name: "pid",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amount",
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

var require$$9 = [
	{
		inputs: [
			{
				internalType: "contract IERC20",
				name: "_joe",
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
			{
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "subtractedValue",
				type: "uint256"
			}
		],
		name: "decreaseAllowance",
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
				name: "_amount",
				type: "uint256"
			}
		],
		name: "enter",
		outputs: [
		],
		stateMutability: "nonpayable",
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
				name: "addedValue",
				type: "uint256"
			}
		],
		name: "increaseAllowance",
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
		],
		name: "joe",
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
				name: "_share",
				type: "uint256"
			}
		],
		name: "leave",
		outputs: [
		],
		stateMutability: "nonpayable",
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

var require$$10 = {
	"0xf20d962a6c8f70c731bd838a3a388d7d48fa6e15": {
	platform: "ethereum",
	address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
},
	"0x260bbf5698121eb85e7a74f2e45e16ce762ebe11": {
	platform: "binance-smart-chain",
	address: "0x23396cf899ca06c4472205fc903bdb4de249d6fc"
}
};

var require$$11 = [
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
				components: [
					{
						internalType: "address[]",
						name: "path",
						type: "address[]"
					},
					{
						internalType: "uint256",
						name: "outMin",
						type: "uint256"
					}
				],
				internalType: "struct MasterChefV2LpRestake.Swap",
				name: "swap0",
				type: "tuple"
			},
			{
				components: [
					{
						internalType: "address[]",
						name: "path",
						type: "address[]"
					},
					{
						internalType: "uint256",
						name: "outMin",
						type: "uint256"
					}
				],
				internalType: "struct MasterChefV2LpRestake.Swap",
				name: "swap1",
				type: "tuple"
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
				internalType: "contract IMasterChefV2",
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

var require$$12 = [
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
				components: [
					{
						internalType: "address[]",
						name: "path",
						type: "address[]"
					},
					{
						internalType: "uint256",
						name: "outMin",
						type: "uint256"
					}
				],
				internalType: "struct MasterChefV2SingleRestake.Swap",
				name: "swap",
				type: "tuple"
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
				internalType: "contract IMasterChefV2",
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

var require$$13 = [
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
				components: [
					{
						internalType: "address[]",
						name: "path",
						type: "address[]"
					},
					{
						internalType: "uint256",
						name: "outMin",
						type: "uint256"
					}
				],
				internalType: "struct MasterChefV3LpRestake.Swap",
				name: "swap0",
				type: "tuple"
			},
			{
				components: [
					{
						internalType: "address[]",
						name: "path",
						type: "address[]"
					},
					{
						internalType: "uint256",
						name: "outMin",
						type: "uint256"
					}
				],
				internalType: "struct MasterChefV3LpRestake.Swap",
				name: "swap1",
				type: "tuple"
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
				internalType: "contract IMasterChefV3",
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
const { tokens } = tokens_1;
const { bridgeWrapperBuild } = coingecko;
const { buildMasterChefProvider, toBN, buildMasterChefActions } = provider;
const cache = cache$1;
const AutomateActions = actions;
const masterChefV2ABI = require$$7;
const masterChefV3ABI = require$$8;
const xJoeTokenABI = require$$9;
const bridgeTokens = require$$10;
const MasterChefV2LpRestakeABI = require$$11;
const MasterChefV2SingleRestakeABI = require$$12;
const MasterChefV3LpRestakeABI = require$$13;

const masterChefV2Address = '0xd6a4F121CA35509aF06A0Be99093d08462f53052';
const masterChefV3Address = '0x188bED1968b795d5c9022F6a0bb5931Ac4c18F00';
const routeTokens = ['0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7'];

var avaxTraderjoe = {
  masterChefV2Pair: async (provider, contractAddress, initOptions = ethereum.defaultOptions()) => {
    const options = {
      ...ethereum.defaultOptions(),
      ...initOptions,
    };
    const masterChefSavedPools = await cache.read('avaxTraderjoe', 'masterChefV2Pools');
    const blockTag = options.blockNumber === 'latest' ? 'latest' : parseInt(options.blockNumber, 10);
    const network = (await provider.detectNetwork()).chainId;
    const block = await provider.getBlock(blockTag);
    const priceFeed = bridgeWrapperBuild(bridgeTokens, blockTag, block, network);

    const pool = masterChefSavedPools.find((p) => p.stakingToken.toLowerCase() === contractAddress.toLowerCase());
    if (!pool) {
      throw new Error('Pool is not found');
    }

    const masterChefProvider = buildMasterChefProvider(
      new ethers.Contract(masterChefV2Address, masterChefV2ABI, provider),
      { blockTag },
      {
        rewardToken() {
          return '0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd';
        },
        poolInfo(poolIndex) {
          return this.contract
            .poolInfo(poolIndex, { blockTag: this.options.blockTag })
            .then(({ lpToken, allocPoint, accJoePerShare }) => ({
              lpToken,
              allocPoint: toBN(allocPoint),
              accRewardPerShare: toBN(accJoePerShare),
            }));
        },
        rewardPerSecond() {
          return this.contract.joePerSec({ blockTag: this.options.blockTag }).then(toBN);
        },
        pendingReward(poolIndex, wallet) {
          return this.contract.pendingTokens(poolIndex, wallet).then(({ pendingJoe }) => toBN(pendingJoe));
        },
      }
    );
    const poolInfo = await masterChefProvider.poolInfo(pool.index);

    const rewardToken = await masterChefProvider.rewardToken();
    const rewardTokenDecimals = 18;
    const rewardTokenPriceUSD = await priceFeed(rewardToken);

    const stakingToken = await masterChefProvider.stakingToken(poolInfo);
    const stakingTokenDecimals = 18;
    const stakingTokenPair = await ethereum.uniswap.pairInfo(provider, stakingToken, options);
    const token0PriceUSD = await priceFeed(stakingTokenPair.token0);
    const token1PriceUSD = await priceFeed(stakingTokenPair.token1);
    const stakingTokenPriceUSD = stakingTokenPair.calcPrice(token0PriceUSD, token1PriceUSD);

    const totalLocked = await masterChefProvider.totalLocked(poolInfo).then((v) => v.div(`1e${stakingTokenDecimals}`));
    const tvl = new bn(totalLocked).multipliedBy(stakingTokenPriceUSD);

    const [rewardPerSecond, totalAllocPoint, devPercent, treasuryPercent, investorPercent] = await Promise.all([
      masterChefProvider.rewardPerSecond({ blockTag }),
      masterChefProvider.totalAllocPoint({ blockTag }),
      masterChefProvider.contract.devPercent({ blockTag }).then(toBN),
      masterChefProvider.contract.treasuryPercent({ blockTag }).then(toBN),
      masterChefProvider.contract.investorPercent({ blockTag }).then(toBN),
    ]);
    const lpPercent = new bn(1000).minus(devPercent).minus(treasuryPercent).minus(investorPercent).div(1000);
    const rewardPerSec = poolInfo.allocPoint
      .multipliedBy(rewardPerSecond)
      .div(totalAllocPoint)
      .multipliedBy(lpPercent)
      .div(`1e${rewardTokenDecimals}`);
    const aprSecond = rewardPerSec.multipliedBy(rewardTokenPriceUSD).div(tvl);
    const aprDay = aprSecond.multipliedBy(86400);
    const aprWeek = aprDay.multipliedBy(7);
    const aprMonth = aprDay.multipliedBy(30);
    const aprYear = aprDay.multipliedBy(365);

    return {
      staking: {
        token: stakingToken,
        decimals: stakingTokenDecimals,
      },
      reward: {
        token: rewardToken,
        decimals: rewardTokenDecimals,
      },
      stakeToken: {
        address: stakingToken,
        decimals: stakingTokenDecimals,
        priceUSD: stakingTokenPriceUSD.toString(10),
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
        address: rewardToken,
        decimals: rewardTokenDecimals,
        priceUSD: rewardTokenPriceUSD.toString(10),
      },
      metrics: {
        tvl: tvl.toString(10),
        aprDay: aprDay.toString(10),
        aprWeek: aprWeek.toString(10),
        aprMonth: aprMonth.toString(10),
        aprYear: aprYear.toString(10),
      },
      wallet: async (walletAddress) => {
        const balance = await masterChefProvider
          .userInfo(pool.index, walletAddress)
          .then(({ amount }) => amount.div(`1e${stakingTokenDecimals}`));
        const earned = await masterChefProvider
          .pendingReward(pool.index, walletAddress)
          .then((v) => v.div(`1e${rewardTokenDecimals}`));
        const expandedBalance = stakingTokenPair.expandBalance(balance);
        const reviewedBalance = [
          {
            token: stakingTokenPair.token0,
            balance: expandedBalance.token0.toString(10),
            usd: expandedBalance.token0.multipliedBy(token0PriceUSD).toString(10),
          },
          {
            token: stakingTokenPair.token1,
            balance: expandedBalance.token1.toString(10),
            usd: expandedBalance.token1.multipliedBy(token1PriceUSD).toString(10),
          },
        ];
        const earnedUSD = earned.multipliedBy(rewardTokenPriceUSD);

        return {
          staked: reviewedBalance.reduce((res, b) => {
            res[b.token] = {
              balance: b.balance,
              usd: b.usd,
            };
            return res;
          }, {}),
          earned: {
            [rewardToken]: {
              balance: earned.toString(10),
              usd: earnedUSD.toString(10),
            },
          },
          metrics: {
            staking: balance.toString(10),
            stakingUSD: balance.multipliedBy(stakingTokenPriceUSD).toString(10),
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
              token: rewardToken,
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

        return buildMasterChefActions(masterChefProvider, {
          poolIndex: pool.index,
          poolInfo,
          signer,
          etherscanAddressURL: 'https://snowtrace.io/address',
        }).then((actions) => actions(walletAddress));
      },
    };
  },
  masterChefV2Single: async (provider, contractAddress, initOptions = ethereum.defaultOptions()) => {
    const options = {
      ...ethereum.defaultOptions(),
      ...initOptions,
    };
    const masterChefSavedPools = await cache.read('avaxTraderjoe', 'masterChefV2Pools');
    const blockTag = options.blockNumber === 'latest' ? 'latest' : parseInt(options.blockNumber, 10);
    const network = (await provider.detectNetwork()).chainId;
    const block = await provider.getBlock(blockTag);
    const priceFeed = bridgeWrapperBuild(bridgeTokens, blockTag, block, network);

    const pool = masterChefSavedPools.find((p) => p.stakingToken.toLowerCase() === contractAddress.toLowerCase());
    if (!pool) {
      throw new Error('Pool is not found');
    }

    const masterChefProvider = buildMasterChefProvider(
      new ethers.Contract(masterChefV2Address, masterChefV2ABI, provider),
      { blockTag },
      {
        rewardToken() {
          return '0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd';
        },
        poolInfo(poolIndex) {
          return this.contract
            .poolInfo(poolIndex, { blockTag: this.options.blockTag })
            .then(({ lpToken, allocPoint, accJoePerShare }) => ({
              lpToken,
              allocPoint: toBN(allocPoint),
              accRewardPerShare: toBN(accJoePerShare),
            }));
        },
        rewardPerSecond() {
          return this.contract.joePerSec({ blockTag: this.options.blockTag }).then(toBN);
        },
        pendingReward(poolIndex, wallet) {
          return this.contract.pendingTokens(poolIndex, wallet).then(({ pendingJoe }) => toBN(pendingJoe));
        },
      }
    );
    const poolInfo = await masterChefProvider.poolInfo(pool.index);

    const rewardToken = await masterChefProvider.rewardToken();
    const rewardTokenDecimals = 18;
    const rewardTokenPriceUSD = await priceFeed(rewardToken);

    const stakingToken = await masterChefProvider.stakingToken(poolInfo);
    const stakingTokenDecimals = await ethereum
      .erc20(provider, stakingToken)
      .decimals()
      .then((v) => Number(v.toString()));
    let stakingTokenPriceUSD = '0';
    // xJoe price feed
    if (stakingToken.toLowerCase() === '0x57319d41f71e81f3c65f2a47ca4e001ebafd4f33') {
      const [xJoeTotalSupply, joeBalance, joePriceUSD] = await Promise.all([
        ethereum
          .erc20(provider, stakingToken)
          .totalSupply({ blockTag })
          .then((v) => new bn(v.toString())),
        ethereum
          .erc20(provider, rewardToken)
          .balanceOf(stakingToken, { blockTag })
          .then((v) => new bn(v.toString())),
        priceFeed(rewardToken),
      ]);
      stakingTokenPriceUSD = joeBalance.div(xJoeTotalSupply).multipliedBy(joePriceUSD).toString(10);
    } else {
      stakingTokenPriceUSD = await priceFeed(stakingToken);
    }

    const totalLocked = await masterChefProvider.totalLocked(poolInfo).then((v) => v.div(`1e${stakingTokenDecimals}`));
    const tvl = new bn(totalLocked).multipliedBy(stakingTokenPriceUSD);

    const [rewardPerSecond, totalAllocPoint, devPercent, treasuryPercent, investorPercent] = await Promise.all([
      masterChefProvider.rewardPerSecond({ blockTag }),
      masterChefProvider.totalAllocPoint({ blockTag }),
      masterChefProvider.contract.devPercent({ blockTag }).then(toBN),
      masterChefProvider.contract.treasuryPercent({ blockTag }).then(toBN),
      masterChefProvider.contract.investorPercent({ blockTag }).then(toBN),
    ]);
    const lpPercent = new bn(1000).minus(devPercent).minus(treasuryPercent).minus(investorPercent).div(1000);
    const rewardPerSec = poolInfo.allocPoint
      .multipliedBy(rewardPerSecond)
      .div(totalAllocPoint)
      .multipliedBy(lpPercent)
      .div(`1e${rewardTokenDecimals}`);
    const aprSecond = rewardPerSec.multipliedBy(rewardTokenPriceUSD).div(tvl);
    const aprDay = aprSecond.multipliedBy(86400);
    const aprWeek = aprDay.multipliedBy(7);
    const aprMonth = aprDay.multipliedBy(30);
    const aprYear = aprDay.multipliedBy(365);

    return {
      staking: {
        token: stakingToken,
        decimals: stakingTokenDecimals,
      },
      reward: {
        token: rewardToken,
        decimals: rewardTokenDecimals,
      },
      stakeToken: {
        address: stakingToken,
        decimals: stakingTokenDecimals,
        priceUSD: stakingTokenPriceUSD.toString(10),
      },
      rewardToken: {
        address: rewardToken,
        decimals: rewardTokenDecimals,
        priceUSD: rewardTokenPriceUSD.toString(10),
      },
      metrics: {
        tvl: tvl.toString(10),
        aprDay: aprDay.toString(10),
        aprWeek: aprWeek.toString(10),
        aprMonth: aprMonth.toString(10),
        aprYear: aprYear.toString(10),
      },
      wallet: async (walletAddress) => {
        const balance = await masterChefProvider
          .userInfo(pool.index, walletAddress)
          .then(({ amount }) => amount.div(`1e${stakingTokenDecimals}`));
        const earned = await masterChefProvider
          .pendingReward(pool.index, walletAddress)
          .then((v) => v.div(`1e${rewardTokenDecimals}`));
        const balanceUSD = balance.multipliedBy(stakingTokenPriceUSD);
        const earnedUSD = earned.multipliedBy(rewardTokenPriceUSD);

        return {
          staked: {
            [stakingToken]: {
              balance: balance.toString(10),
              usd: balanceUSD.toString(10),
            },
          },
          earned: {
            [rewardToken]: {
              balance: earned.toString(10),
              usd: earnedUSD.toString(10),
            },
          },
          metrics: {
            staking: balance.toString(10),
            stakingUSD: balanceUSD.toString(10),
            earned: earned.toString(10),
            earnedUSD: earnedUSD.toString(10),
          },
          tokens: tokens(
            {
              token: stakingToken,
              data: {
                balance: balance.toString(10),
                usd: balanceUSD.toString(10),
              },
            },
            {
              token: rewardToken,
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

        return buildMasterChefActions(masterChefProvider, {
          poolIndex: pool.index,
          poolInfo,
          signer,
          etherscanAddressURL: 'https://snowtrace.io/address',
        }).then((actions) => actions(walletAddress));
      },
    };
  },
  masterChefV3Pair: async (provider, contractAddress, initOptions = ethereum.defaultOptions()) => {
    const options = {
      ...ethereum.defaultOptions(),
      ...initOptions,
    };
    const masterChefSavedPools = await cache.read('avaxTraderjoe', 'masterChefV3Pools');
    const blockTag = options.blockNumber === 'latest' ? 'latest' : parseInt(options.blockNumber, 10);
    const network = (await provider.detectNetwork()).chainId;
    const block = await provider.getBlock(blockTag);
    const priceFeed = bridgeWrapperBuild(bridgeTokens, blockTag, block, network);

    const pool = masterChefSavedPools.find((p) => p.stakingToken.toLowerCase() === contractAddress.toLowerCase());
    if (!pool) {
      throw new Error('Pool is not found');
    }

    const masterChefProvider = buildMasterChefProvider(
      new ethers.Contract(masterChefV3Address, masterChefV3ABI, provider),
      { blockTag },
      {
        rewardToken() {
          return '0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd';
        },
        poolInfo(poolIndex) {
          return this.contract
            .poolInfo(poolIndex, { blockTag: this.options.blockTag })
            .then(({ lpToken, allocPoint, accJoePerShare }) => ({
              lpToken,
              allocPoint: toBN(allocPoint),
              accRewardPerShare: toBN(accJoePerShare),
            }));
        },
        rewardPerSecond() {
          return this.contract.joePerSec({ blockTag: this.options.blockTag }).then(toBN);
        },
        pendingReward(poolIndex, wallet) {
          return this.contract.pendingTokens(poolIndex, wallet).then(({ pendingJoe }) => toBN(pendingJoe));
        },
      }
    );
    const poolInfo = await masterChefProvider.poolInfo(pool.index);

    const rewardToken = await masterChefProvider.rewardToken();
    const rewardTokenDecimals = 18;
    const rewardTokenPriceUSD = await priceFeed(rewardToken);

    const stakingToken = await masterChefProvider.stakingToken(poolInfo);
    const stakingTokenDecimals = 18;
    const stakingTokenPair = await ethereum.uniswap.pairInfo(provider, stakingToken, options);
    const token0PriceUSD = await priceFeed(stakingTokenPair.token0);
    const token1PriceUSD = await priceFeed(stakingTokenPair.token1);
    const stakingTokenPriceUSD = stakingTokenPair.calcPrice(token0PriceUSD, token1PriceUSD);

    const totalLocked = await masterChefProvider.totalLocked(poolInfo).then((v) => v.div(`1e${stakingTokenDecimals}`));
    const tvl = new bn(totalLocked).multipliedBy(stakingTokenPriceUSD);

    const [rewardPerSecond, totalAllocPoint] = await Promise.all([
      masterChefProvider.rewardPerSecond({ blockTag }),
      masterChefProvider.totalAllocPoint({ blockTag }),
    ]);
    const rewardPerSec = poolInfo.allocPoint
      .multipliedBy(rewardPerSecond)
      .div(totalAllocPoint)
      .div(`1e${rewardTokenDecimals}`);
    const aprSecond = rewardPerSec.multipliedBy(rewardTokenPriceUSD).div(tvl);
    const aprDay = aprSecond.multipliedBy(86400);
    const aprWeek = aprDay.multipliedBy(7);
    const aprMonth = aprDay.multipliedBy(30);
    const aprYear = aprDay.multipliedBy(365);

    return {
      staking: {
        token: stakingToken,
        decimals: stakingTokenDecimals,
      },
      reward: {
        token: rewardToken,
        decimals: rewardTokenDecimals,
      },
      stakeToken: {
        address: stakingToken,
        decimals: stakingTokenDecimals,
        priceUSD: stakingTokenPriceUSD.toString(10),
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
        address: rewardToken,
        decimals: rewardTokenDecimals,
        priceUSD: rewardTokenPriceUSD.toString(10),
      },
      metrics: {
        tvl: tvl.toString(10),
        aprDay: aprDay.toString(10),
        aprWeek: aprWeek.toString(10),
        aprMonth: aprMonth.toString(10),
        aprYear: aprYear.toString(10),
      },
      wallet: async (walletAddress) => {
        const balance = await masterChefProvider
          .userInfo(pool.index, walletAddress)
          .then(({ amount }) => amount.div(`1e${stakingTokenDecimals}`));
        const earned = await masterChefProvider
          .pendingReward(pool.index, walletAddress)
          .then((v) => v.div(`1e${rewardTokenDecimals}`));
        const expandedBalance = stakingTokenPair.expandBalance(balance);
        const reviewedBalance = [
          {
            token: stakingTokenPair.token0,
            balance: expandedBalance.token0.toString(10),
            usd: expandedBalance.token0.multipliedBy(token0PriceUSD).toString(10),
          },
          {
            token: stakingTokenPair.token1,
            balance: expandedBalance.token1.toString(10),
            usd: expandedBalance.token1.multipliedBy(token1PriceUSD).toString(10),
          },
        ];
        const earnedUSD = earned.multipliedBy(rewardTokenPriceUSD);

        return {
          staked: reviewedBalance.reduce((res, b) => {
            res[b.token] = {
              balance: b.balance,
              usd: b.usd,
            };
            return res;
          }, {}),
          earned: {
            [rewardToken]: {
              balance: earned.toString(10),
              usd: earnedUSD.toString(10),
            },
          },
          metrics: {
            staking: balance.toString(10),
            stakingUSD: balance.multipliedBy(stakingTokenPriceUSD).toString(10),
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
              token: rewardToken,
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

        return buildMasterChefActions(masterChefProvider, {
          poolIndex: pool.index,
          poolInfo,
          signer,
          etherscanAddressURL: 'https://snowtrace.io/address',
        }).then((actions) => actions(walletAddress));
      },
    };
  },
  xJoe: async (provider, xJoeAddress, initOptions = ethereum.defaultOptions()) => {
    const options = {
      ...ethereum.defaultOptions(),
      ...initOptions,
    };
    const blockTag = options.blockNumber === 'latest' ? 'latest' : parseInt(options.blockNumber, 10);
    const network = (await provider.detectNetwork()).chainId;
    const block = await provider.getBlock(blockTag);
    const priceFeed = bridgeWrapperBuild(bridgeTokens, blockTag, block, network);

    const joeAddress = '0x6e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd';
    const joeContract = ethereum.erc20(provider, joeAddress);
    const joeDecimals = 18;
    const xJoeContract = new ethers.Contract(xJoeAddress, xJoeTokenABI, provider);
    const xJoeDecimals = 18;

    const [joeBalance, joePriceUSD] = await Promise.all([
      joeContract.balanceOf(xJoeAddress, { blockTag }).then((v) => new bn(v.toString()).div(`1e${joeDecimals}`)),
      priceFeed(joeAddress),
    ]);
    const tvl = joeBalance.multipliedBy(joePriceUSD);

    return {
      staking: {
        token: joeAddress,
        decimals: joeDecimals,
      },
      stakeToken: {
        address: joeAddress,
        decimals: joeDecimals,
        priceUSD: joePriceUSD.toString(10),
      },
      rewardToken: {
        address: xJoeAddress,
        decimals: xJoeDecimals,
        priceUSD: joePriceUSD.toString(10),
      },
      metrics: {
        tvl: tvl.toString(10),
        aprDay: '0',
        aprWeek: '0',
        aprMonth: '0',
        aprYear: '0',
      },
      wallet: async (walletAddress) => {
        const [xJoeBalance, joeBalance, xJoeTotalSupply, joePriceUSD] = await Promise.all([
          xJoeContract
            .balanceOf(walletAddress, { blockTag })
            .then((v) => new bn(v.toString()).div(`1e${xJoeDecimals}`)),
          joeContract.balanceOf(xJoeAddress, { blockTag }).then((v) => new bn(v.toString()).div(`1e${joeDecimals}`)),
          xJoeContract.totalSupply({ blockTag }).then((v) => new bn(v.toString()).div(`1e${xJoeDecimals}`)),
          priceFeed(joeAddress),
        ]);
        const k = joeBalance.div(xJoeTotalSupply);
        const balance = xJoeBalance.multipliedBy(k);
        const balanceUSD = balance.multipliedBy(joePriceUSD);
        const earned = xJoeBalance;
        const earnedUSD = balanceUSD;

        return {
          staked: {
            [joeAddress]: {
              balance: balance.toString(10),
              usd: balanceUSD.toString(10),
            },
          },
          earned: {
            [xJoeAddress]: {
              balance: earned.toString(10),
              usd: earnedUSD.toString(10),
            },
          },
          metrics: {
            staking: balance.toString(10),
            stakingUSD: balanceUSD.toString(10),
            earned: earned.toString(10),
            earnedUSD: earnedUSD.toString(10),
          },
          tokens: tokens(
            {
              token: joeAddress,
              data: {
                balance: balance.toString(10),
                usd: balanceUSD.toString(10),
              },
            },
            {
              token: xJoeAddress,
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

        return {
          stake: [
            AutomateActions.tab(
              'Stake',
              async () => ({
                description: `Swap your [JOE](https://snowtrace.io/address/${joeAddress}) tokens to [xJoe](https://snowtrace.io/address/${xJoeAddress}) tokens`,
                inputs: [
                  AutomateActions.input({
                    placeholder: 'amount',
                    value: new bn(await joeContract.balanceOf(walletAddress).then((v) => v.toString()))
                      .div(`1e${joeDecimals}`)
                      .toString(10),
                  }),
                ],
              }),
              async (amount) => {
                const amountInt = new bn(amount).multipliedBy(`1e${joeDecimals}`);
                if (amountInt.lte(0)) return Error('Invalid amount');

                const balance = await joeContract.balanceOf(walletAddress).then((v) => v.toString());
                if (amountInt.gt(balance)) return Error('Insufficient funds on the balance');

                return true;
              },
              async (amount) => {
                const amountInt = new bn(amount).multipliedBy(`1e${joeDecimals}`);
                await ethereum.erc20ApproveAll(
                  joeContract.connect(signer),
                  walletAddress,
                  xJoeAddress,
                  amountInt.toFixed(0)
                );

                return { tx: await xJoeContract.connect(signer).deposit(amountInt.toFixed(0)) };
              }
            ),
          ],
          unstake: [
            AutomateActions.tab(
              'Unstake',
              async () => ({
                description: `Swap your [xJoe](https://snowtrace.io/address/${xJoeAddress}) tokens to [JOE](https://snowtrace.io/address/${joeAddress}) tokens`,
                inputs: [
                  AutomateActions.input({
                    placeholder: 'amount',
                    value: new bn(await xJoeContract.balanceOf(walletAddress).then((v) => v.toString()))
                      .div(`1e${xJoeDecimals}`)
                      .toString(10),
                  }),
                ],
              }),
              async (amount) => {
                const amountInt = new bn(amount).multipliedBy(`1e${xJoeDecimals}`);
                if (amountInt.lte(0)) return Error('Invalid amount');

                const balance = await xJoeContract.balanceOf(walletAddress).then((v) => v.toString());
                if (amountInt.isGreaterThan(balance)) {
                  return Error('Amount exceeds balance');
                }

                return true;
              },
              async (amount) => {
                const amountInt = new bn(amount).multipliedBy(`1e${xJoeDecimals}`);
                await ethereum.erc20ApproveAll(
                  xJoeContract.connect(signer),
                  walletAddress,
                  xJoeAddress,
                  amountInt.toFixed(0)
                );

                return { tx: await xJoeContract.connect(signer).withdraw(amountInt.toFixed(0)) };
              }
            ),
          ],
        };
      },
    };
  },
  automates: {
    contractsResolver: {
      default: async (provider, options = {}) => {
        const multicall = new ethersMulticall.Provider(provider);
        await multicall.init();

        const masterChiefV2Contract = new ethersMulticall.Contract(masterChefV2Address, masterChefV2ABI);
        const masterChiefV3Contract = new ethersMulticall.Contract(masterChefV3Address, masterChefV3ABI);
        const [totalPoolsV2, totalPoolsV3] = await multicall.all([
          masterChiefV2Contract.poolLength(),
          masterChiefV3Contract.poolLength(),
        ]);
        const poolsV2Index = Array.from(new Array(totalPoolsV2.toNumber()).keys());
        const poolsV3Index = Array.from(new Array(totalPoolsV3.toNumber()).keys());
        const poolsV2Info = await multicall.all(
          poolsV2Index.map((poolIndex) => masterChiefV2Contract.poolInfo(poolIndex))
        );
        const poolsV3Info = await multicall.all(
          poolsV3Index.map((poolIndex) => masterChiefV3Contract.poolInfo(poolIndex))
        );
        const poolsV2StakingTokensSymbol = await multicall.all(
          poolsV2Info.map(({ lpToken }) => new ethersMulticall.Contract(lpToken, ethereum.abi.ERC20ABI).symbol())
        );
        const poolsV3StakingTokensSymbol = await multicall.all(
          poolsV3Info.map(({ lpToken }) => new ethersMulticall.Contract(lpToken, ethereum.abi.ERC20ABI).symbol())
        );

        const poolsV2 = await Promise.all(
          poolsV2Info.map(async (info, index) => {
            const stakingTokenSymbol = poolsV2StakingTokensSymbol[index];
            const isPair = stakingTokenSymbol === 'JLP';

            let token0Symbol, token1Symbol;
            if (isPair) {
              const [token0, token1] = await multicall.all([
                new ethersMulticall.Contract(info.lpToken, ethereum.uniswap.pairABI).token0(),
                new ethersMulticall.Contract(info.lpToken, ethereum.uniswap.pairABI).token1(),
              ]);
              const pairSymbols = await multicall.all([
                new ethersMulticall.Contract(token0, ethereum.abi.ERC20ABI).symbol(),
                new ethersMulticall.Contract(token1, ethereum.abi.ERC20ABI).symbol(),
              ]);
              token0Symbol = pairSymbols[0];
              token1Symbol = pairSymbols[1];
            }

            let autorestakeAdapter = undefined;
            if (isPair) {
              autorestakeAdapter = 'MasterChefV2LpRestake';
            }
            // Skip xJoe autorestake
            else if (info.lpToken.toLowerCase() !== '0x57319d41f71e81f3c65f2a47ca4e001ebafd4f33') {
              autorestakeAdapter = 'MasterChefV2SingleRestake';
            }
            const automate = {
              autorestakeAdapter,
              adapters: isPair ? ['masterChefV2Pair'] : ['masterChefV2Single'],
            };
            if (isPair) {
              automate.buyLiquidity = {
                router: '0x60aE616a2155Ee3d9A68541Ba4544862310933d4',
                pair: info.lpToken,
              };
            }

            return {
              poolIndex: index,
              stakingToken: info.lpToken,
              name: isPair ? `${token0Symbol}-${token1Symbol}` : stakingTokenSymbol,
              address: info.lpToken,
              blockchain: 'ethereum',
              network: '43114',
              layout: 'staking',
              adapter: isPair ? 'masterChefV2Pair' : 'masterChefV2Single',
              description: '',
              automate,
              link: `https://traderjoexyz.com/farm/${info.lpToken}-${masterChefV2Address}`,
            };
          })
        );
        const poolsV3 = await Promise.all(
          poolsV3Info.map(async (info, index) => {
            const stakingTokenSymbol = poolsV3StakingTokensSymbol[index];
            const isPair = stakingTokenSymbol === 'JLP';
            if (!isPair) return null;

            let token0Symbol, token1Symbol;
            if (isPair) {
              const [token0, token1] = await multicall.all([
                new ethersMulticall.Contract(info.lpToken, ethereum.uniswap.pairABI).token0(),
                new ethersMulticall.Contract(info.lpToken, ethereum.uniswap.pairABI).token1(),
              ]);
              const pairSymbols = await multicall.all([
                new ethersMulticall.Contract(token0, ethereum.abi.ERC20ABI).symbol(),
                new ethersMulticall.Contract(token1, ethereum.abi.ERC20ABI).symbol(),
              ]);
              token0Symbol = pairSymbols[0];
              token1Symbol = pairSymbols[1];
            }
            const automate = {
              autorestakeAdapter: isPair ? 'MasterChefV3LpRestake' : 'MasterChefV3SingleRestake',
              adapters: isPair ? ['masterChefV3Pair'] : ['masterChefV3Single'],
            };
            if (isPair) {
              automate.buyLiquidity = {
                router: '0x60aE616a2155Ee3d9A68541Ba4544862310933d4',
                pair: info.lpToken,
              };
            }

            return {
              poolIndex: index,
              stakingToken: info.lpToken,
              name: isPair ? `${token0Symbol}-${token1Symbol}` : stakingTokenSymbol,
              address: info.lpToken,
              blockchain: 'ethereum',
              network: '43114',
              layout: 'staking',
              adapter: isPair ? 'masterChefV3Pair' : 'masterChefV3Single',
              description: '',
              automate,
              link: `https://traderjoexyz.com/farm/${info.lpToken}-${masterChefV3Address}`,
            };
          })
        ).then((pools) => pools.filter((pool) => pool));
        if (options.cacheAuth) {
          cache.write(
            options.cacheAuth,
            'avaxTraderjoe',
            'masterChefV2Pools',
            poolsV2.map(({ poolIndex, stakingToken, adapter }) => ({
              index: poolIndex,
              stakingToken,
              type: adapter === 'masterChefV2Pair' ? 'lp' : 'single',
            }))
          );
          cache.write(
            options.cacheAuth,
            'avaxTraderjoe',
            'masterChefV3Pools',
            poolsV3.map(({ poolIndex, stakingToken, adapter }) => ({
              index: poolIndex,
              stakingToken,
              type: adapter === 'masterChefV3Pair' ? 'lp' : 'single',
            }))
          );
        }

        return [...poolsV2, ...poolsV3];
      },
    },
    deploy: {
      MasterChefV2LpRestake: async (signer, factoryAddress, prototypeAddress, contractAddress = undefined) => {
        const masterChefSavedPools = await cache.read('avaxTraderjoe', 'masterChefV2Pools');
        const firstPoolCandidate = masterChefSavedPools.find(({ type }) => type === 'lp');
        let poolIndex = firstPoolCandidate ? firstPoolCandidate.index.toString() : '';
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
                  new ethers.utils.Interface(MasterChefV2LpRestakeABI).encodeFunctionData('init', [
                    masterChefV2Address,
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
      MasterChefV2SingleRestake: async (signer, factoryAddress, prototypeAddress, contractAddress = undefined) => {
        const masterChefSavedPools = await cache.read('avaxTraderjoe', 'masterChefV2Pools');
        const firstPoolCandidate = masterChefSavedPools.find(({ type }) => type === 'single');
        let poolIndex = firstPoolCandidate ? firstPoolCandidate.index.toString() : '';
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
                  new ethers.utils.Interface(MasterChefV2SingleRestakeABI).encodeFunctionData('init', [
                    masterChefV2Address,
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
      MasterChefV3LpRestake: async (signer, factoryAddress, prototypeAddress, contractAddress = undefined) => {
        const masterChefSavedPools = await cache.read('avaxTraderjoe', 'masterChefV3Pools');
        const firstPoolCandidate = masterChefSavedPools.find(({ type }) => type === 'lp');
        let poolIndex = firstPoolCandidate ? firstPoolCandidate.index.toString() : '';
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
                  new ethers.utils.Interface(MasterChefV3LpRestakeABI).encodeFunctionData('init', [
                    masterChefV3Address,
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
    MasterChefV2LpRestake: async (signer, contractAddress) => {
      const signerAddress = await signer.getAddress();
      const automate = new ethers.Contract(contractAddress, MasterChefV2LpRestakeABI, signer);
      const stakingAddress = await automate.staking();
      const staking = new ethers.Contract(stakingAddress, masterChefV2ABI, signer);
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
        const automateMulticall = new ethersMulticall.Contract(contractAddress, MasterChefV2LpRestakeABI);
        const stakingTokenMulticall = new ethersMulticall.Contract(stakingTokenAddress, ethereum.uniswap.pairABI);

        const [routerAddress, slippagePercent, deadlineSeconds, token0Address, token1Address, rewardTokenAddress] =
          await multicall.all([
            automateMulticall.liquidityRouter(),
            automateMulticall.slippage(),
            automateMulticall.deadline(),
            stakingTokenMulticall.token0(),
            stakingTokenMulticall.token1(),
            automateMulticall.rewardToken(),
          ]);
        const rewardToken = new ethers.Contract(rewardTokenAddress, ethereum.abi.ERC20ABI, provider);
        const rewardTokenBalance = await rewardToken.balanceOf(contractAddress).then((v) => v.toString());
        const pendingReward = await staking
          .pendingTokens(poolId, contractAddress)
          .then(({ pendingJoe }) => pendingJoe.toString());

        const earned = new bn(pendingReward).plus(rewardTokenBalance);
        if (earned.toString(10) === '0') return new Error('No earned');
        const router = new ethersMulticall.Contract(routerAddress, ethereum.abi.UniswapRouterABI);

        const slippage = 1 - slippagePercent / 10000;
        const token0AmountIn = new bn(earned.toString(10)).div(2).toFixed(0);
        const swap0 = [[rewardTokenAddress, token0Address], '0'];
        if (token0Address.toLowerCase() !== rewardTokenAddress.toLowerCase()) {
          const { path, amountOut } = await ethereum.uniswap.autoRoute(
            multicall,
            router,
            token0AmountIn,
            rewardTokenAddress,
            token0Address,
            routeTokens
          );
          swap0[0] = path;
          swap0[1] = new bn(amountOut.toString()).multipliedBy(slippage).toFixed(0);
        }
        const token1AmountIn = new bn(earned.toString(10)).minus(token0AmountIn).toFixed(0);
        const swap1 = [[rewardTokenAddress, token1Address], '0'];
        if (token1Address.toLowerCase() !== rewardTokenAddress.toLowerCase()) {
          const { path, amountOut } = await ethereum.uniswap.autoRoute(
            multicall,
            router,
            token1AmountIn,
            rewardTokenAddress,
            token1Address,
            routeTokens
          );
          swap1[0] = path;
          swap1[1] = new bn(amountOut.toString()).multipliedBy(slippage).toFixed(0);
        }

        const deadline = dayjs().add(deadlineSeconds, 'seconds').unix();

        const gasLimit = new bn(await automate.estimateGas.run(0, deadline, swap0, swap1).then((v) => v.toString()))
          .multipliedBy(1.1)
          .toFixed(0);
        const gasPrice = await signer.getGasPrice().then((v) => v.toString());
        const gasFee = new bn(gasLimit).multipliedBy(gasPrice).toFixed(0);

        await automate.estimateGas.run(gasFee, deadline, swap0, swap1);
        return {
          gasPrice,
          gasLimit,
          calldata: [gasFee, deadline, swap0, swap1],
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
    MasterChefV2SingleRestake: async (signer, contractAddress) => {
      const signerAddress = await signer.getAddress();
      const automate = new ethers.Contract(contractAddress, MasterChefV2SingleRestakeABI, signer);
      const stakingAddress = await automate.staking();
      const staking = new ethers.Contract(stakingAddress, masterChefV2ABI, signer);
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
        const automateMulticall = new ethersMulticall.Contract(contractAddress, MasterChefV2SingleRestakeABI);

        const [routerAddress, slippagePercent, deadlineSeconds, rewardTokenAddress] = await multicall.all([
          automateMulticall.liquidityRouter(),
          automateMulticall.slippage(),
          automateMulticall.deadline(),
          automateMulticall.rewardToken(),
        ]);

        const rewardToken = new ethers.Contract(rewardTokenAddress, ethereum.abi.ERC20ABI, provider);
        const rewardTokenBalance = await rewardToken.balanceOf(contractAddress).then((v) => v.toString());
        const pendingReward = await staking
          .pendingTokens(poolId, contractAddress)
          .then(({ pendingJoe }) => pendingJoe.toString());
        const earned = new bn(pendingReward).plus(rewardTokenBalance);
        if (earned.toString(10) === '0') return new Error('No earned');

        const router = new ethersMulticall.Contract(routerAddress, ethereum.abi.UniswapRouterABI);
        const slippage = 1 - slippagePercent / 10000;
        const tokenAmountIn = earned.toFixed(0);
        const swap = [[rewardTokenAddress, stakingTokenAddress], '0'];
        if (stakingTokenAddress.toLowerCase() !== rewardTokenAddress.toLowerCase()) {
          const { path, amountOut } = await ethereum.uniswap.autoRoute(
            multicall,
            router,
            tokenAmountIn,
            rewardTokenAddress,
            stakingTokenAddress,
            routeTokens
          );
          swap[0] = path;
          swap[1] = new bn(amountOut.toString()).multipliedBy(slippage).toFixed(0);
        }

        const deadline = dayjs().add(deadlineSeconds, 'seconds').unix();

        const gasLimit = new bn(await automate.estimateGas.run(0, deadline, swap).then((v) => v.toString()))
          .multipliedBy(1.1)
          .toFixed(0);
        const gasPrice = await signer.getGasPrice().then((v) => v.toString());
        const gasFee = new bn(gasLimit).multipliedBy(gasPrice).toFixed(0);

        await automate.estimateGas.run(gasFee, deadline, swap);
        return {
          gasPrice,
          gasLimit,
          calldata: [gasFee, deadline, swap],
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
    MasterChefV3LpRestake: async (signer, contractAddress) => {
      const signerAddress = await signer.getAddress();
      const automate = new ethers.Contract(contractAddress, MasterChefV3LpRestakeABI, signer);
      const stakingAddress = await automate.staking();
      const staking = new ethers.Contract(stakingAddress, masterChefV3ABI, signer);
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
        const automateMulticall = new ethersMulticall.Contract(contractAddress, MasterChefV2LpRestakeABI);
        const stakingTokenMulticall = new ethersMulticall.Contract(stakingTokenAddress, ethereum.uniswap.pairABI);

        const [routerAddress, slippagePercent, deadlineSeconds, token0Address, token1Address, rewardTokenAddress] =
          await multicall.all([
            automateMulticall.liquidityRouter(),
            automateMulticall.slippage(),
            automateMulticall.deadline(),
            stakingTokenMulticall.token0(),
            stakingTokenMulticall.token1(),
            automateMulticall.rewardToken(),
          ]);
        const rewardToken = new ethers.Contract(rewardTokenAddress, ethereum.abi.ERC20ABI, provider);
        const rewardTokenBalance = await rewardToken.balanceOf(contractAddress).then((v) => v.toString());
        const pendingReward = await staking
          .pendingTokens(poolId, contractAddress)
          .then(({ pendingJoe }) => pendingJoe.toString());

        const earned = new bn(pendingReward).plus(rewardTokenBalance);
        if (earned.toString(10) === '0') return new Error('No earned');
        const router = new ethersMulticall.Contract(routerAddress, ethereum.abi.UniswapRouterABI);

        const slippage = 1 - slippagePercent / 10000;
        const token0AmountIn = new bn(earned.toString(10)).div(2).toFixed(0);
        const swap0 = [[rewardTokenAddress, token0Address], '0'];
        if (token0Address.toLowerCase() !== rewardTokenAddress.toLowerCase()) {
          const { path, amountOut } = await ethereum.uniswap.autoRoute(
            multicall,
            router,
            token0AmountIn,
            rewardTokenAddress,
            token0Address,
            routeTokens
          );
          swap0[0] = path;
          swap0[1] = new bn(amountOut.toString()).multipliedBy(slippage).toFixed(0);
        }
        const token1AmountIn = new bn(earned.toString(10)).minus(token0AmountIn).toFixed(0);
        const swap1 = [[rewardTokenAddress, token1Address], '0'];
        if (token1Address.toLowerCase() !== rewardTokenAddress.toLowerCase()) {
          const { path, amountOut } = await ethereum.uniswap.autoRoute(
            multicall,
            router,
            token1AmountIn,
            rewardTokenAddress,
            token1Address,
            routeTokens
          );
          swap1[0] = path;
          swap1[1] = new bn(amountOut.toString()).multipliedBy(slippage).toFixed(0);
        }

        const deadline = dayjs().add(deadlineSeconds, 'seconds').unix();

        const gasLimit = new bn(await automate.estimateGas.run(0, deadline, swap0, swap1).then((v) => v.toString()))
          .multipliedBy(1.1)
          .toFixed(0);
        const gasPrice = await signer.getGasPrice().then((v) => v.toString());
        const gasFee = new bn(gasLimit).multipliedBy(gasPrice).toFixed(0);

        await automate.estimateGas.run(gasFee, deadline, swap0, swap1);
        return {
          gasPrice,
          gasLimit,
          calldata: [gasFee, deadline, swap0, swap1],
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

module.exports = avaxTraderjoe;

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

var require$$3$1 = [
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

var require$$4$1 = [
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

const { ethers: ethers$4, bn: bn$6, ethersMulticall: ethersMulticall$2 } = lib;
const ERC20ABI = require$$1$1;
const DFHStorageABI = require$$2;
const UniswapPairABI = require$$3$1;
const UniswapRouterABI = require$$4$1;

const ethereum$6 = {
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
  erc20Info: async (provider, address, options = ethereum$6.defaultOptions()) => {
    const multicall = new ethersMulticall$2.Provider(provider);
    await multicall.init();
    const multicallToken = new ethersMulticall$2.Contract(address, ERC20ABI);
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
    pairInfo: async (provider, address, options = ethereum$6.defaultOptions()) => {
      const multicall = new ethersMulticall$2.Provider(provider);
      await multicall.init();
      const multicallPair = new ethersMulticall$2.Contract(address, UniswapPairABI);
      let [token0, token1, reserves, totalSupply] = await multicall.all(
        [multicallPair.token0(), multicallPair.token1(), multicallPair.getReserves(), multicallPair.totalSupply()],
        { blockTag: options.blockNumber }
      );
      token0 = token0.toLowerCase();
      token1 = token1.toLowerCase();
      const blockTimestampLast = reserves[2];
      totalSupply = new bn$6(totalSupply.toString()).div(new bn$6(10).pow(ethereum$6.uniswap.pairDecimals)).toString();
      let [{ decimals: token0Decimals }, { decimals: token1Decimals }] = await Promise.all([
        ethereum$6.erc20Info(provider, token0, options),
        ethereum$6.erc20Info(provider, token1, options),
      ]);
      token0Decimals = token0Decimals.toString();
      token1Decimals = token1Decimals.toString();
      const reserve0 = new bn$6(reserves[0].toString()).div(new bn$6(10).pow(token0Decimals)).toString(10);
      const reserve1 = new bn$6(reserves[1].toString()).div(new bn$6(10).pow(token1Decimals)).toString(10);

      return new ethereum$6.uniswap.PairInfo({
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
    getPrice: async (router, amountIn, path, options = ethereum$6.defaultOptions()) => {
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
  ethereum: ethereum$6,
};

const { dayjs: dayjs$1, axios } = lib;

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
      const date = dayjs$1(this.network.block.timestamp).format('DD-MM-YYYY');
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
function bridgeWrapperBuild$2(aliases, blockTag, block, network) {
  return (address) => {
    const alias = aliases[address.toLowerCase()];
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
  bridgeWrapperBuild: bridgeWrapperBuild$2,
};

var require$$3 = [
	{
		name: "PoolAdded",
		inputs: [
			{
				name: "pool",
				type: "address",
				indexed: true
			},
			{
				name: "rate_method_id",
				type: "bytes",
				indexed: false
			}
		],
		anonymous: false,
		type: "event"
	},
	{
		name: "PoolRemoved",
		inputs: [
			{
				name: "pool",
				type: "address",
				indexed: true
			}
		],
		anonymous: false,
		type: "event"
	},
	{
		stateMutability: "nonpayable",
		type: "constructor",
		inputs: [
			{
				name: "_address_provider",
				type: "address"
			},
			{
				name: "_gauge_controller",
				type: "address"
			}
		],
		outputs: [
		]
	},
	{
		stateMutability: "view",
		type: "function",
		name: "find_pool_for_coins",
		inputs: [
			{
				name: "_from",
				type: "address"
			},
			{
				name: "_to",
				type: "address"
			}
		],
		outputs: [
			{
				name: "",
				type: "address"
			}
		]
	},
	{
		stateMutability: "view",
		type: "function",
		name: "find_pool_for_coins",
		inputs: [
			{
				name: "_from",
				type: "address"
			},
			{
				name: "_to",
				type: "address"
			},
			{
				name: "i",
				type: "uint256"
			}
		],
		outputs: [
			{
				name: "",
				type: "address"
			}
		]
	},
	{
		stateMutability: "view",
		type: "function",
		name: "get_n_coins",
		inputs: [
			{
				name: "_pool",
				type: "address"
			}
		],
		outputs: [
			{
				name: "",
				type: "uint256[2]"
			}
		]
	},
	{
		stateMutability: "view",
		type: "function",
		name: "get_coins",
		inputs: [
			{
				name: "_pool",
				type: "address"
			}
		],
		outputs: [
			{
				name: "",
				type: "address[8]"
			}
		]
	},
	{
		stateMutability: "view",
		type: "function",
		name: "get_underlying_coins",
		inputs: [
			{
				name: "_pool",
				type: "address"
			}
		],
		outputs: [
			{
				name: "",
				type: "address[8]"
			}
		]
	},
	{
		stateMutability: "view",
		type: "function",
		name: "get_decimals",
		inputs: [
			{
				name: "_pool",
				type: "address"
			}
		],
		outputs: [
			{
				name: "",
				type: "uint256[8]"
			}
		]
	},
	{
		stateMutability: "view",
		type: "function",
		name: "get_underlying_decimals",
		inputs: [
			{
				name: "_pool",
				type: "address"
			}
		],
		outputs: [
			{
				name: "",
				type: "uint256[8]"
			}
		]
	},
	{
		stateMutability: "view",
		type: "function",
		name: "get_rates",
		inputs: [
			{
				name: "_pool",
				type: "address"
			}
		],
		outputs: [
			{
				name: "",
				type: "uint256[8]"
			}
		]
	},
	{
		stateMutability: "view",
		type: "function",
		name: "get_gauges",
		inputs: [
			{
				name: "_pool",
				type: "address"
			}
		],
		outputs: [
			{
				name: "",
				type: "address[10]"
			},
			{
				name: "",
				type: "int128[10]"
			}
		]
	},
	{
		stateMutability: "view",
		type: "function",
		name: "get_balances",
		inputs: [
			{
				name: "_pool",
				type: "address"
			}
		],
		outputs: [
			{
				name: "",
				type: "uint256[8]"
			}
		]
	},
	{
		stateMutability: "view",
		type: "function",
		name: "get_underlying_balances",
		inputs: [
			{
				name: "_pool",
				type: "address"
			}
		],
		outputs: [
			{
				name: "",
				type: "uint256[8]"
			}
		]
	},
	{
		stateMutability: "view",
		type: "function",
		name: "get_virtual_price_from_lp_token",
		inputs: [
			{
				name: "_token",
				type: "address"
			}
		],
		outputs: [
			{
				name: "",
				type: "uint256"
			}
		]
	},
	{
		stateMutability: "view",
		type: "function",
		name: "get_A",
		inputs: [
			{
				name: "_pool",
				type: "address"
			}
		],
		outputs: [
			{
				name: "",
				type: "uint256"
			}
		]
	},
	{
		stateMutability: "view",
		type: "function",
		name: "get_parameters",
		inputs: [
			{
				name: "_pool",
				type: "address"
			}
		],
		outputs: [
			{
				name: "A",
				type: "uint256"
			},
			{
				name: "future_A",
				type: "uint256"
			},
			{
				name: "fee",
				type: "uint256"
			},
			{
				name: "admin_fee",
				type: "uint256"
			},
			{
				name: "future_fee",
				type: "uint256"
			},
			{
				name: "future_admin_fee",
				type: "uint256"
			},
			{
				name: "future_owner",
				type: "address"
			},
			{
				name: "initial_A",
				type: "uint256"
			},
			{
				name: "initial_A_time",
				type: "uint256"
			},
			{
				name: "future_A_time",
				type: "uint256"
			}
		]
	},
	{
		stateMutability: "view",
		type: "function",
		name: "get_fees",
		inputs: [
			{
				name: "_pool",
				type: "address"
			}
		],
		outputs: [
			{
				name: "",
				type: "uint256[2]"
			}
		]
	},
	{
		stateMutability: "view",
		type: "function",
		name: "get_admin_balances",
		inputs: [
			{
				name: "_pool",
				type: "address"
			}
		],
		outputs: [
			{
				name: "",
				type: "uint256[8]"
			}
		]
	},
	{
		stateMutability: "view",
		type: "function",
		name: "get_coin_indices",
		inputs: [
			{
				name: "_pool",
				type: "address"
			},
			{
				name: "_from",
				type: "address"
			},
			{
				name: "_to",
				type: "address"
			}
		],
		outputs: [
			{
				name: "",
				type: "int128"
			},
			{
				name: "",
				type: "int128"
			},
			{
				name: "",
				type: "bool"
			}
		]
	},
	{
		stateMutability: "view",
		type: "function",
		name: "estimate_gas_used",
		inputs: [
			{
				name: "_pool",
				type: "address"
			},
			{
				name: "_from",
				type: "address"
			},
			{
				name: "_to",
				type: "address"
			}
		],
		outputs: [
			{
				name: "",
				type: "uint256"
			}
		]
	},
	{
		stateMutability: "view",
		type: "function",
		name: "is_meta",
		inputs: [
			{
				name: "_pool",
				type: "address"
			}
		],
		outputs: [
			{
				name: "",
				type: "bool"
			}
		]
	},
	{
		stateMutability: "view",
		type: "function",
		name: "get_pool_name",
		inputs: [
			{
				name: "_pool",
				type: "address"
			}
		],
		outputs: [
			{
				name: "",
				type: "string"
			}
		]
	},
	{
		stateMutability: "view",
		type: "function",
		name: "get_coin_swap_count",
		inputs: [
			{
				name: "_coin",
				type: "address"
			}
		],
		outputs: [
			{
				name: "",
				type: "uint256"
			}
		]
	},
	{
		stateMutability: "view",
		type: "function",
		name: "get_coin_swap_complement",
		inputs: [
			{
				name: "_coin",
				type: "address"
			},
			{
				name: "_index",
				type: "uint256"
			}
		],
		outputs: [
			{
				name: "",
				type: "address"
			}
		]
	},
	{
		stateMutability: "view",
		type: "function",
		name: "get_pool_asset_type",
		inputs: [
			{
				name: "_pool",
				type: "address"
			}
		],
		outputs: [
			{
				name: "",
				type: "uint256"
			}
		]
	},
	{
		stateMutability: "nonpayable",
		type: "function",
		name: "add_pool",
		inputs: [
			{
				name: "_pool",
				type: "address"
			},
			{
				name: "_n_coins",
				type: "uint256"
			},
			{
				name: "_lp_token",
				type: "address"
			},
			{
				name: "_rate_info",
				type: "bytes32"
			},
			{
				name: "_decimals",
				type: "uint256"
			},
			{
				name: "_underlying_decimals",
				type: "uint256"
			},
			{
				name: "_has_initial_A",
				type: "bool"
			},
			{
				name: "_is_v1",
				type: "bool"
			},
			{
				name: "_name",
				type: "string"
			}
		],
		outputs: [
		],
		gas: 61485845
	},
	{
		stateMutability: "nonpayable",
		type: "function",
		name: "add_pool_without_underlying",
		inputs: [
			{
				name: "_pool",
				type: "address"
			},
			{
				name: "_n_coins",
				type: "uint256"
			},
			{
				name: "_lp_token",
				type: "address"
			},
			{
				name: "_rate_info",
				type: "bytes32"
			},
			{
				name: "_decimals",
				type: "uint256"
			},
			{
				name: "_use_rates",
				type: "uint256"
			},
			{
				name: "_has_initial_A",
				type: "bool"
			},
			{
				name: "_is_v1",
				type: "bool"
			},
			{
				name: "_name",
				type: "string"
			}
		],
		outputs: [
		],
		gas: 31306062
	},
	{
		stateMutability: "nonpayable",
		type: "function",
		name: "add_metapool",
		inputs: [
			{
				name: "_pool",
				type: "address"
			},
			{
				name: "_n_coins",
				type: "uint256"
			},
			{
				name: "_lp_token",
				type: "address"
			},
			{
				name: "_decimals",
				type: "uint256"
			},
			{
				name: "_name",
				type: "string"
			}
		],
		outputs: [
		]
	},
	{
		stateMutability: "nonpayable",
		type: "function",
		name: "add_metapool",
		inputs: [
			{
				name: "_pool",
				type: "address"
			},
			{
				name: "_n_coins",
				type: "uint256"
			},
			{
				name: "_lp_token",
				type: "address"
			},
			{
				name: "_decimals",
				type: "uint256"
			},
			{
				name: "_name",
				type: "string"
			},
			{
				name: "_base_pool",
				type: "address"
			}
		],
		outputs: [
		]
	},
	{
		stateMutability: "nonpayable",
		type: "function",
		name: "remove_pool",
		inputs: [
			{
				name: "_pool",
				type: "address"
			}
		],
		outputs: [
		],
		gas: 779731418758
	},
	{
		stateMutability: "nonpayable",
		type: "function",
		name: "set_pool_gas_estimates",
		inputs: [
			{
				name: "_addr",
				type: "address[5]"
			},
			{
				name: "_amount",
				type: "uint256[2][5]"
			}
		],
		outputs: [
		],
		gas: 390460
	},
	{
		stateMutability: "nonpayable",
		type: "function",
		name: "set_coin_gas_estimates",
		inputs: [
			{
				name: "_addr",
				type: "address[10]"
			},
			{
				name: "_amount",
				type: "uint256[10]"
			}
		],
		outputs: [
		],
		gas: 392047
	},
	{
		stateMutability: "nonpayable",
		type: "function",
		name: "set_gas_estimate_contract",
		inputs: [
			{
				name: "_pool",
				type: "address"
			},
			{
				name: "_estimator",
				type: "address"
			}
		],
		outputs: [
		],
		gas: 72629
	},
	{
		stateMutability: "nonpayable",
		type: "function",
		name: "set_liquidity_gauges",
		inputs: [
			{
				name: "_pool",
				type: "address"
			},
			{
				name: "_liquidity_gauges",
				type: "address[10]"
			}
		],
		outputs: [
		],
		gas: 400675
	},
	{
		stateMutability: "nonpayable",
		type: "function",
		name: "set_pool_asset_type",
		inputs: [
			{
				name: "_pool",
				type: "address"
			},
			{
				name: "_asset_type",
				type: "uint256"
			}
		],
		outputs: [
		],
		gas: 72667
	},
	{
		stateMutability: "nonpayable",
		type: "function",
		name: "batch_set_pool_asset_type",
		inputs: [
			{
				name: "_pools",
				type: "address[32]"
			},
			{
				name: "_asset_types",
				type: "uint256[32]"
			}
		],
		outputs: [
		],
		gas: 1173447
	},
	{
		stateMutability: "view",
		type: "function",
		name: "address_provider",
		inputs: [
		],
		outputs: [
			{
				name: "",
				type: "address"
			}
		]
	},
	{
		stateMutability: "view",
		type: "function",
		name: "gauge_controller",
		inputs: [
		],
		outputs: [
			{
				name: "",
				type: "address"
			}
		]
	},
	{
		stateMutability: "view",
		type: "function",
		name: "pool_list",
		inputs: [
			{
				name: "arg0",
				type: "uint256"
			}
		],
		outputs: [
			{
				name: "",
				type: "address"
			}
		]
	},
	{
		stateMutability: "view",
		type: "function",
		name: "pool_count",
		inputs: [
		],
		outputs: [
			{
				name: "",
				type: "uint256"
			}
		]
	},
	{
		stateMutability: "view",
		type: "function",
		name: "coin_count",
		inputs: [
		],
		outputs: [
			{
				name: "",
				type: "uint256"
			}
		]
	},
	{
		stateMutability: "view",
		type: "function",
		name: "get_coin",
		inputs: [
			{
				name: "arg0",
				type: "uint256"
			}
		],
		outputs: [
			{
				name: "",
				type: "address"
			}
		]
	},
	{
		stateMutability: "view",
		type: "function",
		name: "get_pool_from_lp_token",
		inputs: [
			{
				name: "arg0",
				type: "address"
			}
		],
		outputs: [
			{
				name: "",
				type: "address"
			}
		]
	},
	{
		stateMutability: "view",
		type: "function",
		name: "get_lp_token",
		inputs: [
			{
				name: "arg0",
				type: "address"
			}
		],
		outputs: [
			{
				name: "",
				type: "address"
			}
		]
	},
	{
		stateMutability: "view",
		type: "function",
		name: "last_updated",
		inputs: [
		],
		outputs: [
			{
				name: "",
				type: "uint256"
			}
		]
	}
];

var require$$4 = [
	{
		name: "Deposit",
		inputs: [
			{
				type: "address",
				name: "provider",
				indexed: true
			},
			{
				type: "uint256",
				name: "value",
				indexed: false
			}
		],
		anonymous: false,
		type: "event"
	},
	{
		name: "Withdraw",
		inputs: [
			{
				type: "address",
				name: "provider",
				indexed: true
			},
			{
				type: "uint256",
				name: "value",
				indexed: false
			}
		],
		anonymous: false,
		type: "event"
	},
	{
		name: "UpdateLiquidityLimit",
		inputs: [
			{
				type: "address",
				name: "user",
				indexed: false
			},
			{
				type: "uint256",
				name: "original_balance",
				indexed: false
			},
			{
				type: "uint256",
				name: "original_supply",
				indexed: false
			},
			{
				type: "uint256",
				name: "working_balance",
				indexed: false
			},
			{
				type: "uint256",
				name: "working_supply",
				indexed: false
			}
		],
		anonymous: false,
		type: "event"
	},
	{
		outputs: [
		],
		inputs: [
			{
				type: "address",
				name: "lp_addr"
			},
			{
				type: "address",
				name: "_minter"
			}
		],
		stateMutability: "nonpayable",
		type: "constructor"
	},
	{
		name: "user_checkpoint",
		outputs: [
			{
				type: "bool",
				name: ""
			}
		],
		inputs: [
			{
				type: "address",
				name: "addr"
			}
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 2079152
	},
	{
		name: "claimable_tokens",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
			{
				type: "address",
				name: "addr"
			}
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 1998318
	},
	{
		name: "kick",
		outputs: [
		],
		inputs: [
			{
				type: "address",
				name: "addr"
			}
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 2084532
	},
	{
		name: "set_approve_deposit",
		outputs: [
		],
		inputs: [
			{
				type: "address",
				name: "addr"
			},
			{
				type: "bool",
				name: "can_deposit"
			}
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 35766
	},
	{
		name: "deposit",
		outputs: [
		],
		inputs: [
			{
				type: "uint256",
				name: "_value"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		name: "deposit",
		outputs: [
		],
		inputs: [
			{
				type: "uint256",
				name: "_value"
			},
			{
				type: "address",
				name: "addr"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		name: "withdraw",
		outputs: [
		],
		inputs: [
			{
				type: "uint256",
				name: "_value"
			}
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 2208318
	},
	{
		name: "integrate_checkpoint",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "minter",
		outputs: [
			{
				type: "address",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "crv_token",
		outputs: [
			{
				type: "address",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "lp_token",
		outputs: [
			{
				type: "address",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "controller",
		outputs: [
			{
				type: "address",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "voting_escrow",
		outputs: [
			{
				type: "address",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "balanceOf",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
			{
				type: "address",
				name: "arg0"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "totalSupply",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "future_epoch_time",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "approved_to_deposit",
		outputs: [
			{
				type: "bool",
				name: ""
			}
		],
		inputs: [
			{
				type: "address",
				name: "arg0"
			},
			{
				type: "address",
				name: "arg1"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "working_balances",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
			{
				type: "address",
				name: "arg0"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "working_supply",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "period",
		outputs: [
			{
				type: "int128",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "period_timestamp",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
			{
				type: "uint256",
				name: "arg0"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "integrate_inv_supply",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
			{
				type: "uint256",
				name: "arg0"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "integrate_inv_supply_of",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
			{
				type: "address",
				name: "arg0"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "integrate_checkpoint_of",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
			{
				type: "address",
				name: "arg0"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "integrate_fraction",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
			{
				type: "address",
				name: "arg0"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "inflation_rate",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	}
];

var require$$5 = [
	{
		name: "TokenExchange",
		inputs: [
			{
				type: "address",
				name: "buyer",
				indexed: true
			},
			{
				type: "int128",
				name: "sold_id",
				indexed: false
			},
			{
				type: "uint256",
				name: "tokens_sold",
				indexed: false
			},
			{
				type: "int128",
				name: "bought_id",
				indexed: false
			},
			{
				type: "uint256",
				name: "tokens_bought",
				indexed: false
			}
		],
		anonymous: false,
		type: "event"
	},
	{
		name: "AddLiquidity",
		inputs: [
			{
				type: "address",
				name: "provider",
				indexed: true
			},
			{
				type: "uint256[3]",
				name: "token_amounts",
				indexed: false
			},
			{
				type: "uint256[3]",
				name: "fees",
				indexed: false
			},
			{
				type: "uint256",
				name: "invariant",
				indexed: false
			},
			{
				type: "uint256",
				name: "token_supply",
				indexed: false
			}
		],
		anonymous: false,
		type: "event"
	},
	{
		name: "RemoveLiquidity",
		inputs: [
			{
				type: "address",
				name: "provider",
				indexed: true
			},
			{
				type: "uint256[3]",
				name: "token_amounts",
				indexed: false
			},
			{
				type: "uint256[3]",
				name: "fees",
				indexed: false
			},
			{
				type: "uint256",
				name: "token_supply",
				indexed: false
			}
		],
		anonymous: false,
		type: "event"
	},
	{
		name: "RemoveLiquidityOne",
		inputs: [
			{
				type: "address",
				name: "provider",
				indexed: true
			},
			{
				type: "uint256",
				name: "token_amount",
				indexed: false
			},
			{
				type: "uint256",
				name: "coin_amount",
				indexed: false
			}
		],
		anonymous: false,
		type: "event"
	},
	{
		name: "RemoveLiquidityImbalance",
		inputs: [
			{
				type: "address",
				name: "provider",
				indexed: true
			},
			{
				type: "uint256[3]",
				name: "token_amounts",
				indexed: false
			},
			{
				type: "uint256[3]",
				name: "fees",
				indexed: false
			},
			{
				type: "uint256",
				name: "invariant",
				indexed: false
			},
			{
				type: "uint256",
				name: "token_supply",
				indexed: false
			}
		],
		anonymous: false,
		type: "event"
	},
	{
		name: "CommitNewAdmin",
		inputs: [
			{
				type: "uint256",
				name: "deadline",
				indexed: true
			},
			{
				type: "address",
				name: "admin",
				indexed: true
			}
		],
		anonymous: false,
		type: "event"
	},
	{
		name: "NewAdmin",
		inputs: [
			{
				type: "address",
				name: "admin",
				indexed: true
			}
		],
		anonymous: false,
		type: "event"
	},
	{
		name: "CommitNewFee",
		inputs: [
			{
				type: "uint256",
				name: "deadline",
				indexed: true
			},
			{
				type: "uint256",
				name: "fee",
				indexed: false
			},
			{
				type: "uint256",
				name: "admin_fee",
				indexed: false
			}
		],
		anonymous: false,
		type: "event"
	},
	{
		name: "NewFee",
		inputs: [
			{
				type: "uint256",
				name: "fee",
				indexed: false
			},
			{
				type: "uint256",
				name: "admin_fee",
				indexed: false
			}
		],
		anonymous: false,
		type: "event"
	},
	{
		name: "RampA",
		inputs: [
			{
				type: "uint256",
				name: "old_A",
				indexed: false
			},
			{
				type: "uint256",
				name: "new_A",
				indexed: false
			},
			{
				type: "uint256",
				name: "initial_time",
				indexed: false
			},
			{
				type: "uint256",
				name: "future_time",
				indexed: false
			}
		],
		anonymous: false,
		type: "event"
	},
	{
		name: "StopRampA",
		inputs: [
			{
				type: "uint256",
				name: "A",
				indexed: false
			},
			{
				type: "uint256",
				name: "t",
				indexed: false
			}
		],
		anonymous: false,
		type: "event"
	},
	{
		outputs: [
		],
		inputs: [
			{
				type: "address",
				name: "_owner"
			},
			{
				type: "address[3]",
				name: "_coins"
			},
			{
				type: "address",
				name: "_pool_token"
			},
			{
				type: "uint256",
				name: "_A"
			},
			{
				type: "uint256",
				name: "_fee"
			},
			{
				type: "uint256",
				name: "_admin_fee"
			}
		],
		stateMutability: "nonpayable",
		type: "constructor"
	},
	{
		name: "A",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "get_virtual_price",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "calc_token_amount",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
			{
				type: "uint256[3]",
				name: "amounts"
			},
			{
				type: "bool",
				name: "deposit"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "add_liquidity",
		outputs: [
		],
		inputs: [
			{
				type: "uint256[3]",
				name: "amounts"
			},
			{
				type: "uint256",
				name: "min_mint_amount"
			}
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 6954858
	},
	{
		name: "get_dy",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
			{
				type: "int128",
				name: "i"
			},
			{
				type: "int128",
				name: "j"
			},
			{
				type: "uint256",
				name: "dx"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "get_dy_underlying",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
			{
				type: "int128",
				name: "i"
			},
			{
				type: "int128",
				name: "j"
			},
			{
				type: "uint256",
				name: "dx"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "exchange",
		outputs: [
		],
		inputs: [
			{
				type: "int128",
				name: "i"
			},
			{
				type: "int128",
				name: "j"
			},
			{
				type: "uint256",
				name: "dx"
			},
			{
				type: "uint256",
				name: "min_dy"
			}
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 2818066
	},
	{
		name: "remove_liquidity",
		outputs: [
		],
		inputs: [
			{
				type: "uint256",
				name: "_amount"
			},
			{
				type: "uint256[3]",
				name: "min_amounts"
			}
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 192846
	},
	{
		name: "remove_liquidity_imbalance",
		outputs: [
		],
		inputs: [
			{
				type: "uint256[3]",
				name: "amounts"
			},
			{
				type: "uint256",
				name: "max_burn_amount"
			}
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 6951851
	},
	{
		name: "calc_withdraw_one_coin",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
			{
				type: "uint256",
				name: "_token_amount"
			},
			{
				type: "int128",
				name: "i"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "remove_liquidity_one_coin",
		outputs: [
		],
		inputs: [
			{
				type: "uint256",
				name: "_token_amount"
			},
			{
				type: "int128",
				name: "i"
			},
			{
				type: "uint256",
				name: "min_amount"
			}
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 4025523
	},
	{
		name: "ramp_A",
		outputs: [
		],
		inputs: [
			{
				type: "uint256",
				name: "_future_A"
			},
			{
				type: "uint256",
				name: "_future_time"
			}
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 151919
	},
	{
		name: "stop_ramp_A",
		outputs: [
		],
		inputs: [
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 148637
	},
	{
		name: "commit_new_fee",
		outputs: [
		],
		inputs: [
			{
				type: "uint256",
				name: "new_fee"
			},
			{
				type: "uint256",
				name: "new_admin_fee"
			}
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 110461
	},
	{
		name: "apply_new_fee",
		outputs: [
		],
		inputs: [
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 97242
	},
	{
		name: "revert_new_parameters",
		outputs: [
		],
		inputs: [
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 21895
	},
	{
		name: "commit_transfer_ownership",
		outputs: [
		],
		inputs: [
			{
				type: "address",
				name: "_owner"
			}
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 74572
	},
	{
		name: "apply_transfer_ownership",
		outputs: [
		],
		inputs: [
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 60710
	},
	{
		name: "revert_transfer_ownership",
		outputs: [
		],
		inputs: [
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 21985
	},
	{
		name: "admin_balances",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
			{
				type: "uint256",
				name: "i"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "withdraw_admin_fees",
		outputs: [
		],
		inputs: [
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 21502
	},
	{
		name: "donate_admin_fees",
		outputs: [
		],
		inputs: [
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 111389
	},
	{
		name: "kill_me",
		outputs: [
		],
		inputs: [
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 37998
	},
	{
		name: "unkill_me",
		outputs: [
		],
		inputs: [
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 22135
	},
	{
		name: "coins",
		outputs: [
			{
				type: "address",
				name: ""
			}
		],
		inputs: [
			{
				type: "uint256",
				name: "arg0"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "balances",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
			{
				type: "uint256",
				name: "arg0"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "fee",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "admin_fee",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "owner",
		outputs: [
			{
				type: "address",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "initial_A",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "future_A",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "initial_A_time",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "future_A_time",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "admin_actions_deadline",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "transfer_ownership_deadline",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "future_fee",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "future_admin_fee",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "future_owner",
		outputs: [
			{
				type: "address",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	}
];

var require$$6$1 = [
	{
		name: "TokenExchange",
		inputs: [
			{
				type: "address",
				name: "buyer",
				indexed: true
			},
			{
				type: "int128",
				name: "sold_id",
				indexed: false
			},
			{
				type: "uint256",
				name: "tokens_sold",
				indexed: false
			},
			{
				type: "int128",
				name: "bought_id",
				indexed: false
			},
			{
				type: "uint256",
				name: "tokens_bought",
				indexed: false
			}
		],
		anonymous: false,
		type: "event"
	},
	{
		name: "TokenExchangeUnderlying",
		inputs: [
			{
				type: "address",
				name: "buyer",
				indexed: true
			},
			{
				type: "int128",
				name: "sold_id",
				indexed: false
			},
			{
				type: "uint256",
				name: "tokens_sold",
				indexed: false
			},
			{
				type: "int128",
				name: "bought_id",
				indexed: false
			},
			{
				type: "uint256",
				name: "tokens_bought",
				indexed: false
			}
		],
		anonymous: false,
		type: "event"
	},
	{
		name: "AddLiquidity",
		inputs: [
			{
				type: "address",
				name: "provider",
				indexed: true
			},
			{
				type: "uint256[2]",
				name: "token_amounts",
				indexed: false
			},
			{
				type: "uint256[2]",
				name: "fees",
				indexed: false
			},
			{
				type: "uint256",
				name: "invariant",
				indexed: false
			},
			{
				type: "uint256",
				name: "token_supply",
				indexed: false
			}
		],
		anonymous: false,
		type: "event"
	},
	{
		name: "RemoveLiquidity",
		inputs: [
			{
				type: "address",
				name: "provider",
				indexed: true
			},
			{
				type: "uint256[2]",
				name: "token_amounts",
				indexed: false
			},
			{
				type: "uint256[2]",
				name: "fees",
				indexed: false
			},
			{
				type: "uint256",
				name: "token_supply",
				indexed: false
			}
		],
		anonymous: false,
		type: "event"
	},
	{
		name: "RemoveLiquidityImbalance",
		inputs: [
			{
				type: "address",
				name: "provider",
				indexed: true
			},
			{
				type: "uint256[2]",
				name: "token_amounts",
				indexed: false
			},
			{
				type: "uint256[2]",
				name: "fees",
				indexed: false
			},
			{
				type: "uint256",
				name: "invariant",
				indexed: false
			},
			{
				type: "uint256",
				name: "token_supply",
				indexed: false
			}
		],
		anonymous: false,
		type: "event"
	},
	{
		name: "CommitNewAdmin",
		inputs: [
			{
				type: "uint256",
				name: "deadline",
				indexed: true,
				unit: "sec"
			},
			{
				type: "address",
				name: "admin",
				indexed: true
			}
		],
		anonymous: false,
		type: "event"
	},
	{
		name: "NewAdmin",
		inputs: [
			{
				type: "address",
				name: "admin",
				indexed: true
			}
		],
		anonymous: false,
		type: "event"
	},
	{
		name: "CommitNewParameters",
		inputs: [
			{
				type: "uint256",
				name: "deadline",
				indexed: true,
				unit: "sec"
			},
			{
				type: "uint256",
				name: "A",
				indexed: false
			},
			{
				type: "uint256",
				name: "fee",
				indexed: false
			},
			{
				type: "uint256",
				name: "admin_fee",
				indexed: false
			}
		],
		anonymous: false,
		type: "event"
	},
	{
		name: "NewParameters",
		inputs: [
			{
				type: "uint256",
				name: "A",
				indexed: false
			},
			{
				type: "uint256",
				name: "fee",
				indexed: false
			},
			{
				type: "uint256",
				name: "admin_fee",
				indexed: false
			}
		],
		anonymous: false,
		type: "event"
	},
	{
		outputs: [
		],
		inputs: [
			{
				type: "address[2]",
				name: "_coins"
			},
			{
				type: "address[2]",
				name: "_underlying_coins"
			},
			{
				type: "address",
				name: "_pool_token"
			},
			{
				type: "uint256",
				name: "_A"
			},
			{
				type: "uint256",
				name: "_fee"
			}
		],
		constant: false,
		payable: false,
		type: "constructor"
	},
	{
		name: "get_virtual_price",
		outputs: [
			{
				type: "uint256",
				name: "out"
			}
		],
		inputs: [
		],
		constant: true,
		payable: false,
		type: "function",
		gas: 1084167
	},
	{
		name: "calc_token_amount",
		outputs: [
			{
				type: "uint256",
				name: "out"
			}
		],
		inputs: [
			{
				type: "uint256[2]",
				name: "amounts"
			},
			{
				type: "bool",
				name: "deposit"
			}
		],
		constant: true,
		payable: false,
		type: "function",
		gas: 4239939
	},
	{
		name: "add_liquidity",
		outputs: [
		],
		inputs: [
			{
				type: "uint256[2]",
				name: "amounts"
			},
			{
				type: "uint256",
				name: "min_mint_amount"
			}
		],
		constant: false,
		payable: false,
		type: "function",
		gas: 6479997
	},
	{
		name: "get_dy",
		outputs: [
			{
				type: "uint256",
				name: "out"
			}
		],
		inputs: [
			{
				type: "int128",
				name: "i"
			},
			{
				type: "int128",
				name: "j"
			},
			{
				type: "uint256",
				name: "dx"
			}
		],
		constant: true,
		payable: false,
		type: "function",
		gas: 2543681
	},
	{
		name: "get_dx",
		outputs: [
			{
				type: "uint256",
				name: "out"
			}
		],
		inputs: [
			{
				type: "int128",
				name: "i"
			},
			{
				type: "int128",
				name: "j"
			},
			{
				type: "uint256",
				name: "dy"
			}
		],
		constant: true,
		payable: false,
		type: "function",
		gas: 2543687
	},
	{
		name: "get_dy_underlying",
		outputs: [
			{
				type: "uint256",
				name: "out"
			}
		],
		inputs: [
			{
				type: "int128",
				name: "i"
			},
			{
				type: "int128",
				name: "j"
			},
			{
				type: "uint256",
				name: "dx"
			}
		],
		constant: true,
		payable: false,
		type: "function",
		gas: 2543506
	},
	{
		name: "get_dx_underlying",
		outputs: [
			{
				type: "uint256",
				name: "out"
			}
		],
		inputs: [
			{
				type: "int128",
				name: "i"
			},
			{
				type: "int128",
				name: "j"
			},
			{
				type: "uint256",
				name: "dy"
			}
		],
		constant: true,
		payable: false,
		type: "function",
		gas: 2543512
	},
	{
		name: "exchange",
		outputs: [
		],
		inputs: [
			{
				type: "int128",
				name: "i"
			},
			{
				type: "int128",
				name: "j"
			},
			{
				type: "uint256",
				name: "dx"
			},
			{
				type: "uint256",
				name: "min_dy"
			}
		],
		constant: false,
		payable: false,
		type: "function",
		gas: 5184573
	},
	{
		name: "exchange_underlying",
		outputs: [
		],
		inputs: [
			{
				type: "int128",
				name: "i"
			},
			{
				type: "int128",
				name: "j"
			},
			{
				type: "uint256",
				name: "dx"
			},
			{
				type: "uint256",
				name: "min_dy"
			}
		],
		constant: false,
		payable: false,
		type: "function",
		gas: 5200817
	},
	{
		name: "remove_liquidity",
		outputs: [
		],
		inputs: [
			{
				type: "uint256",
				name: "_amount"
			},
			{
				type: "uint256[2]",
				name: "min_amounts"
			}
		],
		constant: false,
		payable: false,
		type: "function",
		gas: 153898
	},
	{
		name: "remove_liquidity_imbalance",
		outputs: [
		],
		inputs: [
			{
				type: "uint256[2]",
				name: "amounts"
			},
			{
				type: "uint256",
				name: "max_burn_amount"
			}
		],
		constant: false,
		payable: false,
		type: "function",
		gas: 6479708
	},
	{
		name: "commit_new_parameters",
		outputs: [
		],
		inputs: [
			{
				type: "uint256",
				name: "amplification"
			},
			{
				type: "uint256",
				name: "new_fee"
			},
			{
				type: "uint256",
				name: "new_admin_fee"
			}
		],
		constant: false,
		payable: false,
		type: "function",
		gas: 146105
	},
	{
		name: "apply_new_parameters",
		outputs: [
		],
		inputs: [
		],
		constant: false,
		payable: false,
		type: "function",
		gas: 133512
	},
	{
		name: "revert_new_parameters",
		outputs: [
		],
		inputs: [
		],
		constant: false,
		payable: false,
		type: "function",
		gas: 21835
	},
	{
		name: "commit_transfer_ownership",
		outputs: [
		],
		inputs: [
			{
				type: "address",
				name: "_owner"
			}
		],
		constant: false,
		payable: false,
		type: "function",
		gas: 74512
	},
	{
		name: "apply_transfer_ownership",
		outputs: [
		],
		inputs: [
		],
		constant: false,
		payable: false,
		type: "function",
		gas: 60568
	},
	{
		name: "revert_transfer_ownership",
		outputs: [
		],
		inputs: [
		],
		constant: false,
		payable: false,
		type: "function",
		gas: 21925
	},
	{
		name: "withdraw_admin_fees",
		outputs: [
		],
		inputs: [
		],
		constant: false,
		payable: false,
		type: "function",
		gas: 12831
	},
	{
		name: "kill_me",
		outputs: [
		],
		inputs: [
		],
		constant: false,
		payable: false,
		type: "function",
		gas: 37878
	},
	{
		name: "unkill_me",
		outputs: [
		],
		inputs: [
		],
		constant: false,
		payable: false,
		type: "function",
		gas: 22015
	},
	{
		name: "coins",
		outputs: [
			{
				type: "address",
				name: "out"
			}
		],
		inputs: [
			{
				type: "int128",
				name: "arg0"
			}
		],
		constant: true,
		payable: false,
		type: "function",
		gas: 2190
	},
	{
		name: "underlying_coins",
		outputs: [
			{
				type: "address",
				name: "out"
			}
		],
		inputs: [
			{
				type: "int128",
				name: "arg0"
			}
		],
		constant: true,
		payable: false,
		type: "function",
		gas: 2220
	},
	{
		name: "balances",
		outputs: [
			{
				type: "uint256",
				name: "out"
			}
		],
		inputs: [
			{
				type: "int128",
				name: "arg0"
			}
		],
		constant: true,
		payable: false,
		type: "function",
		gas: 2250
	},
	{
		name: "A",
		outputs: [
			{
				type: "uint256",
				name: "out"
			}
		],
		inputs: [
		],
		constant: true,
		payable: false,
		type: "function",
		gas: 2081
	},
	{
		name: "fee",
		outputs: [
			{
				type: "uint256",
				name: "out"
			}
		],
		inputs: [
		],
		constant: true,
		payable: false,
		type: "function",
		gas: 2111
	},
	{
		name: "admin_fee",
		outputs: [
			{
				type: "uint256",
				name: "out"
			}
		],
		inputs: [
		],
		constant: true,
		payable: false,
		type: "function",
		gas: 2141
	},
	{
		name: "owner",
		outputs: [
			{
				type: "address",
				name: "out"
			}
		],
		inputs: [
		],
		constant: true,
		payable: false,
		type: "function",
		gas: 2171
	},
	{
		name: "admin_actions_deadline",
		outputs: [
			{
				type: "uint256",
				unit: "sec",
				name: "out"
			}
		],
		inputs: [
		],
		constant: true,
		payable: false,
		type: "function",
		gas: 2201
	},
	{
		name: "transfer_ownership_deadline",
		outputs: [
			{
				type: "uint256",
				unit: "sec",
				name: "out"
			}
		],
		inputs: [
		],
		constant: true,
		payable: false,
		type: "function",
		gas: 2231
	},
	{
		name: "future_A",
		outputs: [
			{
				type: "uint256",
				name: "out"
			}
		],
		inputs: [
		],
		constant: true,
		payable: false,
		type: "function",
		gas: 2261
	},
	{
		name: "future_fee",
		outputs: [
			{
				type: "uint256",
				name: "out"
			}
		],
		inputs: [
		],
		constant: true,
		payable: false,
		type: "function",
		gas: 2291
	},
	{
		name: "future_admin_fee",
		outputs: [
			{
				type: "uint256",
				name: "out"
			}
		],
		inputs: [
		],
		constant: true,
		payable: false,
		type: "function",
		gas: 2321
	},
	{
		name: "future_owner",
		outputs: [
			{
				type: "address",
				name: "out"
			}
		],
		inputs: [
		],
		constant: true,
		payable: false,
		type: "function",
		gas: 2351
	}
];

var require$$7 = [
	{
		name: "Minted",
		inputs: [
			{
				type: "address",
				name: "recipient",
				indexed: true
			},
			{
				type: "address",
				name: "gauge",
				indexed: false
			},
			{
				type: "uint256",
				name: "minted",
				indexed: false
			}
		],
		anonymous: false,
		type: "event"
	},
	{
		outputs: [
		],
		inputs: [
			{
				type: "address",
				name: "_token"
			},
			{
				type: "address",
				name: "_controller"
			}
		],
		stateMutability: "nonpayable",
		type: "constructor"
	},
	{
		name: "mint",
		outputs: [
		],
		inputs: [
			{
				type: "address",
				name: "gauge_addr"
			}
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 100038
	},
	{
		name: "mint_many",
		outputs: [
		],
		inputs: [
			{
				type: "address[8]",
				name: "gauge_addrs"
			}
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 408502
	},
	{
		name: "mint_for",
		outputs: [
		],
		inputs: [
			{
				type: "address",
				name: "gauge_addr"
			},
			{
				type: "address",
				name: "_for"
			}
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 101219
	},
	{
		name: "toggle_approve_mint",
		outputs: [
		],
		inputs: [
			{
				type: "address",
				name: "minting_user"
			}
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 36726
	},
	{
		name: "token",
		outputs: [
			{
				type: "address",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "controller",
		outputs: [
			{
				type: "address",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "minted",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
			{
				type: "address",
				name: "arg0"
			},
			{
				type: "address",
				name: "arg1"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "allowed_to_mint_for",
		outputs: [
			{
				type: "bool",
				name: ""
			}
		],
		inputs: [
			{
				type: "address",
				name: "arg0"
			},
			{
				type: "address",
				name: "arg1"
			}
		],
		stateMutability: "view",
		type: "function"
	}
];

var require$$8 = [
	{
		name: "CommitOwnership",
		inputs: [
			{
				type: "address",
				name: "admin",
				indexed: false
			}
		],
		anonymous: false,
		type: "event"
	},
	{
		name: "ApplyOwnership",
		inputs: [
			{
				type: "address",
				name: "admin",
				indexed: false
			}
		],
		anonymous: false,
		type: "event"
	},
	{
		name: "Deposit",
		inputs: [
			{
				type: "address",
				name: "provider",
				indexed: true
			},
			{
				type: "uint256",
				name: "value",
				indexed: false
			},
			{
				type: "uint256",
				name: "locktime",
				indexed: true
			},
			{
				type: "int128",
				name: "type",
				indexed: false
			},
			{
				type: "uint256",
				name: "ts",
				indexed: false
			}
		],
		anonymous: false,
		type: "event"
	},
	{
		name: "Withdraw",
		inputs: [
			{
				type: "address",
				name: "provider",
				indexed: true
			},
			{
				type: "uint256",
				name: "value",
				indexed: false
			},
			{
				type: "uint256",
				name: "ts",
				indexed: false
			}
		],
		anonymous: false,
		type: "event"
	},
	{
		name: "Supply",
		inputs: [
			{
				type: "uint256",
				name: "prevSupply",
				indexed: false
			},
			{
				type: "uint256",
				name: "supply",
				indexed: false
			}
		],
		anonymous: false,
		type: "event"
	},
	{
		outputs: [
		],
		inputs: [
			{
				type: "address",
				name: "token_addr"
			},
			{
				type: "string",
				name: "_name"
			},
			{
				type: "string",
				name: "_symbol"
			},
			{
				type: "string",
				name: "_version"
			}
		],
		stateMutability: "nonpayable",
		type: "constructor"
	},
	{
		name: "commit_transfer_ownership",
		outputs: [
		],
		inputs: [
			{
				type: "address",
				name: "addr"
			}
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 37597
	},
	{
		name: "apply_transfer_ownership",
		outputs: [
		],
		inputs: [
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 38497
	},
	{
		name: "commit_smart_wallet_checker",
		outputs: [
		],
		inputs: [
			{
				type: "address",
				name: "addr"
			}
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 36307
	},
	{
		name: "apply_smart_wallet_checker",
		outputs: [
		],
		inputs: [
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 37095
	},
	{
		name: "get_last_user_slope",
		outputs: [
			{
				type: "int128",
				name: ""
			}
		],
		inputs: [
			{
				type: "address",
				name: "addr"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "user_point_history__ts",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
			{
				type: "address",
				name: "_addr"
			},
			{
				type: "uint256",
				name: "_idx"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "locked__end",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
			{
				type: "address",
				name: "_addr"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "checkpoint",
		outputs: [
		],
		inputs: [
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 37052342
	},
	{
		name: "deposit_for",
		outputs: [
		],
		inputs: [
			{
				type: "address",
				name: "_addr"
			},
			{
				type: "uint256",
				name: "_value"
			}
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 74279891
	},
	{
		name: "create_lock",
		outputs: [
		],
		inputs: [
			{
				type: "uint256",
				name: "_value"
			},
			{
				type: "uint256",
				name: "_unlock_time"
			}
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 74281465
	},
	{
		name: "increase_amount",
		outputs: [
		],
		inputs: [
			{
				type: "uint256",
				name: "_value"
			}
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 74280830
	},
	{
		name: "increase_unlock_time",
		outputs: [
		],
		inputs: [
			{
				type: "uint256",
				name: "_unlock_time"
			}
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 74281578
	},
	{
		name: "withdraw",
		outputs: [
		],
		inputs: [
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 37223566
	},
	{
		name: "balanceOf",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
			{
				type: "address",
				name: "addr"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "balanceOf",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
			{
				type: "address",
				name: "addr"
			},
			{
				type: "uint256",
				name: "_t"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "balanceOfAt",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
			{
				type: "address",
				name: "addr"
			},
			{
				type: "uint256",
				name: "_block"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "totalSupply",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "totalSupply",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
			{
				type: "uint256",
				name: "t"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "totalSupplyAt",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
			{
				type: "uint256",
				name: "_block"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "changeController",
		outputs: [
		],
		inputs: [
			{
				type: "address",
				name: "_newController"
			}
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 36907
	},
	{
		name: "token",
		outputs: [
			{
				type: "address",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "supply",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "locked",
		outputs: [
			{
				type: "int128",
				name: "amount"
			},
			{
				type: "uint256",
				name: "end"
			}
		],
		inputs: [
			{
				type: "address",
				name: "arg0"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "epoch",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "point_history",
		outputs: [
			{
				type: "int128",
				name: "bias"
			},
			{
				type: "int128",
				name: "slope"
			},
			{
				type: "uint256",
				name: "ts"
			},
			{
				type: "uint256",
				name: "blk"
			}
		],
		inputs: [
			{
				type: "uint256",
				name: "arg0"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "user_point_history",
		outputs: [
			{
				type: "int128",
				name: "bias"
			},
			{
				type: "int128",
				name: "slope"
			},
			{
				type: "uint256",
				name: "ts"
			},
			{
				type: "uint256",
				name: "blk"
			}
		],
		inputs: [
			{
				type: "address",
				name: "arg0"
			},
			{
				type: "uint256",
				name: "arg1"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "user_point_epoch",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
			{
				type: "address",
				name: "arg0"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "slope_changes",
		outputs: [
			{
				type: "int128",
				name: ""
			}
		],
		inputs: [
			{
				type: "uint256",
				name: "arg0"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "controller",
		outputs: [
			{
				type: "address",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "transfersEnabled",
		outputs: [
			{
				type: "bool",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "name",
		outputs: [
			{
				type: "string",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "symbol",
		outputs: [
			{
				type: "string",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "version",
		outputs: [
			{
				type: "string",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "decimals",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "future_smart_wallet_checker",
		outputs: [
			{
				type: "address",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "smart_wallet_checker",
		outputs: [
			{
				type: "address",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "admin",
		outputs: [
			{
				type: "address",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "future_admin",
		outputs: [
			{
				type: "address",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	}
];

var require$$9 = [
	{
		name: "CommitAdmin",
		inputs: [
			{
				type: "address",
				name: "admin",
				indexed: false
			}
		],
		anonymous: false,
		type: "event"
	},
	{
		name: "ApplyAdmin",
		inputs: [
			{
				type: "address",
				name: "admin",
				indexed: false
			}
		],
		anonymous: false,
		type: "event"
	},
	{
		name: "ToggleAllowCheckpointToken",
		inputs: [
			{
				type: "bool",
				name: "toggle_flag",
				indexed: false
			}
		],
		anonymous: false,
		type: "event"
	},
	{
		name: "CheckpointToken",
		inputs: [
			{
				type: "uint256",
				name: "time",
				indexed: false
			},
			{
				type: "uint256",
				name: "tokens",
				indexed: false
			}
		],
		anonymous: false,
		type: "event"
	},
	{
		name: "Claimed",
		inputs: [
			{
				type: "address",
				name: "recipient",
				indexed: true
			},
			{
				type: "uint256",
				name: "amount",
				indexed: false
			},
			{
				type: "uint256",
				name: "claim_epoch",
				indexed: false
			},
			{
				type: "uint256",
				name: "max_epoch",
				indexed: false
			}
		],
		anonymous: false,
		type: "event"
	},
	{
		outputs: [
		],
		inputs: [
			{
				type: "address",
				name: "_voting_escrow"
			},
			{
				type: "uint256",
				name: "_start_time"
			},
			{
				type: "address",
				name: "_token"
			},
			{
				type: "address",
				name: "_admin"
			},
			{
				type: "address",
				name: "_emergency_return"
			}
		],
		stateMutability: "nonpayable",
		type: "constructor"
	},
	{
		name: "checkpoint_token",
		outputs: [
		],
		inputs: [
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 820723
	},
	{
		name: "ve_for_at",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
			{
				type: "address",
				name: "_user"
			},
			{
				type: "uint256",
				name: "_timestamp"
			}
		],
		stateMutability: "view",
		type: "function",
		gas: 249417
	},
	{
		name: "checkpoint_total_supply",
		outputs: [
		],
		inputs: [
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 10592405
	},
	{
		name: "claim",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		name: "claim",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
			{
				type: "address",
				name: "_addr"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		name: "claim_many",
		outputs: [
			{
				type: "bool",
				name: ""
			}
		],
		inputs: [
			{
				type: "address[20]",
				name: "_receivers"
			}
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 26281905
	},
	{
		name: "burn",
		outputs: [
			{
				type: "bool",
				name: ""
			}
		],
		inputs: [
			{
				type: "address",
				name: "_coin"
			}
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 823450
	},
	{
		name: "commit_admin",
		outputs: [
		],
		inputs: [
			{
				type: "address",
				name: "_addr"
			}
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 37898
	},
	{
		name: "apply_admin",
		outputs: [
		],
		inputs: [
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 39534
	},
	{
		name: "toggle_allow_checkpoint_token",
		outputs: [
		],
		inputs: [
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 38673
	},
	{
		name: "kill_me",
		outputs: [
		],
		inputs: [
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 39587
	},
	{
		name: "recover_balance",
		outputs: [
			{
				type: "bool",
				name: ""
			}
		],
		inputs: [
			{
				type: "address",
				name: "_coin"
			}
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 7778
	},
	{
		name: "start_time",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function",
		gas: 1541
	},
	{
		name: "time_cursor",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function",
		gas: 1571
	},
	{
		name: "time_cursor_of",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
			{
				type: "address",
				name: "arg0"
			}
		],
		stateMutability: "view",
		type: "function",
		gas: 1816
	},
	{
		name: "user_epoch_of",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
			{
				type: "address",
				name: "arg0"
			}
		],
		stateMutability: "view",
		type: "function",
		gas: 1846
	},
	{
		name: "last_token_time",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function",
		gas: 1661
	},
	{
		name: "tokens_per_week",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
			{
				type: "uint256",
				name: "arg0"
			}
		],
		stateMutability: "view",
		type: "function",
		gas: 1800
	},
	{
		name: "voting_escrow",
		outputs: [
			{
				type: "address",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function",
		gas: 1721
	},
	{
		name: "token",
		outputs: [
			{
				type: "address",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "total_received",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function",
		gas: 1781
	},
	{
		name: "token_last_balance",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function",
		gas: 1811
	},
	{
		name: "ve_supply",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
			{
				type: "uint256",
				name: "arg0"
			}
		],
		stateMutability: "view",
		type: "function",
		gas: 1950
	},
	{
		name: "admin",
		outputs: [
			{
				type: "address",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function",
		gas: 1871
	},
	{
		name: "future_admin",
		outputs: [
			{
				type: "address",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function",
		gas: 1901
	},
	{
		name: "can_checkpoint_token",
		outputs: [
			{
				type: "bool",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function",
		gas: 1931
	},
	{
		name: "emergency_return",
		outputs: [
			{
				type: "address",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function",
		gas: 1961
	},
	{
		name: "is_killed",
		outputs: [
			{
				type: "bool",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function",
		gas: 1991
	}
];

var require$$10 = [
	{
		name: "CommitOwnership",
		inputs: [
			{
				type: "address",
				name: "admin",
				indexed: false
			}
		],
		anonymous: false,
		type: "event"
	},
	{
		name: "ApplyOwnership",
		inputs: [
			{
				type: "address",
				name: "admin",
				indexed: false
			}
		],
		anonymous: false,
		type: "event"
	},
	{
		name: "AddType",
		inputs: [
			{
				type: "string",
				name: "name",
				indexed: false
			},
			{
				type: "int128",
				name: "type_id",
				indexed: false
			}
		],
		anonymous: false,
		type: "event"
	},
	{
		name: "NewTypeWeight",
		inputs: [
			{
				type: "int128",
				name: "type_id",
				indexed: false
			},
			{
				type: "uint256",
				name: "time",
				indexed: false
			},
			{
				type: "uint256",
				name: "weight",
				indexed: false
			},
			{
				type: "uint256",
				name: "total_weight",
				indexed: false
			}
		],
		anonymous: false,
		type: "event"
	},
	{
		name: "NewGaugeWeight",
		inputs: [
			{
				type: "address",
				name: "gauge_address",
				indexed: false
			},
			{
				type: "uint256",
				name: "time",
				indexed: false
			},
			{
				type: "uint256",
				name: "weight",
				indexed: false
			},
			{
				type: "uint256",
				name: "total_weight",
				indexed: false
			}
		],
		anonymous: false,
		type: "event"
	},
	{
		name: "VoteForGauge",
		inputs: [
			{
				type: "uint256",
				name: "time",
				indexed: false
			},
			{
				type: "address",
				name: "user",
				indexed: false
			},
			{
				type: "address",
				name: "gauge_addr",
				indexed: false
			},
			{
				type: "uint256",
				name: "weight",
				indexed: false
			}
		],
		anonymous: false,
		type: "event"
	},
	{
		name: "NewGauge",
		inputs: [
			{
				type: "address",
				name: "addr",
				indexed: false
			},
			{
				type: "int128",
				name: "gauge_type",
				indexed: false
			},
			{
				type: "uint256",
				name: "weight",
				indexed: false
			}
		],
		anonymous: false,
		type: "event"
	},
	{
		outputs: [
		],
		inputs: [
			{
				type: "address",
				name: "_token"
			},
			{
				type: "address",
				name: "_voting_escrow"
			}
		],
		stateMutability: "nonpayable",
		type: "constructor"
	},
	{
		name: "commit_transfer_ownership",
		outputs: [
		],
		inputs: [
			{
				type: "address",
				name: "addr"
			}
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 37597
	},
	{
		name: "apply_transfer_ownership",
		outputs: [
		],
		inputs: [
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 38497
	},
	{
		name: "gauge_types",
		outputs: [
			{
				type: "int128",
				name: ""
			}
		],
		inputs: [
			{
				type: "address",
				name: "_addr"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "add_gauge",
		outputs: [
		],
		inputs: [
			{
				type: "address",
				name: "addr"
			},
			{
				type: "int128",
				name: "gauge_type"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		name: "add_gauge",
		outputs: [
		],
		inputs: [
			{
				type: "address",
				name: "addr"
			},
			{
				type: "int128",
				name: "gauge_type"
			},
			{
				type: "uint256",
				name: "weight"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		name: "checkpoint",
		outputs: [
		],
		inputs: [
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 18033784416
	},
	{
		name: "checkpoint_gauge",
		outputs: [
		],
		inputs: [
			{
				type: "address",
				name: "addr"
			}
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 18087678795
	},
	{
		name: "gauge_relative_weight",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
			{
				type: "address",
				name: "addr"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "gauge_relative_weight",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
			{
				type: "address",
				name: "addr"
			},
			{
				type: "uint256",
				name: "time"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "gauge_relative_weight_write",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
			{
				type: "address",
				name: "addr"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		name: "gauge_relative_weight_write",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
			{
				type: "address",
				name: "addr"
			},
			{
				type: "uint256",
				name: "time"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		name: "add_type",
		outputs: [
		],
		inputs: [
			{
				type: "string",
				name: "_name"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		name: "add_type",
		outputs: [
		],
		inputs: [
			{
				type: "string",
				name: "_name"
			},
			{
				type: "uint256",
				name: "weight"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		name: "change_type_weight",
		outputs: [
		],
		inputs: [
			{
				type: "int128",
				name: "type_id"
			},
			{
				type: "uint256",
				name: "weight"
			}
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 36246310050
	},
	{
		name: "change_gauge_weight",
		outputs: [
		],
		inputs: [
			{
				type: "address",
				name: "addr"
			},
			{
				type: "uint256",
				name: "weight"
			}
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 36354170809
	},
	{
		name: "vote_for_gauge_weights",
		outputs: [
		],
		inputs: [
			{
				type: "address",
				name: "_gauge_addr"
			},
			{
				type: "uint256",
				name: "_user_weight"
			}
		],
		stateMutability: "nonpayable",
		type: "function",
		gas: 18142052127
	},
	{
		name: "get_gauge_weight",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
			{
				type: "address",
				name: "addr"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "get_type_weight",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
			{
				type: "int128",
				name: "type_id"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "get_total_weight",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "get_weights_sum_per_type",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
			{
				type: "int128",
				name: "type_id"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "admin",
		outputs: [
			{
				type: "address",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "future_admin",
		outputs: [
			{
				type: "address",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "token",
		outputs: [
			{
				type: "address",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "voting_escrow",
		outputs: [
			{
				type: "address",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "n_gauge_types",
		outputs: [
			{
				type: "int128",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "n_gauges",
		outputs: [
			{
				type: "int128",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "gauge_type_names",
		outputs: [
			{
				type: "string",
				name: ""
			}
		],
		inputs: [
			{
				type: "int128",
				name: "arg0"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "gauges",
		outputs: [
			{
				type: "address",
				name: ""
			}
		],
		inputs: [
			{
				type: "uint256",
				name: "arg0"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "vote_user_slopes",
		outputs: [
			{
				type: "uint256",
				name: "slope"
			},
			{
				type: "uint256",
				name: "power"
			},
			{
				type: "uint256",
				name: "end"
			}
		],
		inputs: [
			{
				type: "address",
				name: "arg0"
			},
			{
				type: "address",
				name: "arg1"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "vote_user_power",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
			{
				type: "address",
				name: "arg0"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "last_user_vote",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
			{
				type: "address",
				name: "arg0"
			},
			{
				type: "address",
				name: "arg1"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "points_weight",
		outputs: [
			{
				type: "uint256",
				name: "bias"
			},
			{
				type: "uint256",
				name: "slope"
			}
		],
		inputs: [
			{
				type: "address",
				name: "arg0"
			},
			{
				type: "uint256",
				name: "arg1"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "time_weight",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
			{
				type: "address",
				name: "arg0"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "points_sum",
		outputs: [
			{
				type: "uint256",
				name: "bias"
			},
			{
				type: "uint256",
				name: "slope"
			}
		],
		inputs: [
			{
				type: "int128",
				name: "arg0"
			},
			{
				type: "uint256",
				name: "arg1"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "time_sum",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
			{
				type: "uint256",
				name: "arg0"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "points_total",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
			{
				type: "uint256",
				name: "arg0"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "time_total",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "points_type_weight",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
			{
				type: "int128",
				name: "arg0"
			},
			{
				type: "uint256",
				name: "arg1"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		name: "time_type_weight",
		outputs: [
			{
				type: "uint256",
				name: ""
			}
		],
		inputs: [
			{
				type: "uint256",
				name: "arg0"
			}
		],
		stateMutability: "view",
		type: "function"
	}
];

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
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "calcTokenAmount",
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
				internalType: "address",
				name: "_swapToken",
				type: "address"
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
				internalType: "uint256",
				name: "swapOutMin",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "lpOutMin",
				type: "uint256"
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
				internalType: "contract IGauge",
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
		name: "swapToken",
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

const { bn: bn$5 } = lib;

var toFloat$3 = {
  toFloat: (n, decimals) => new bn$5(n.toString()).div(new bn$5(10).pow(decimals)),
};

const { bn: bn$4 } = lib;

const tokens$4 = (...tokens) =>
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
  tokens: tokens$4,
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

const { ethers: ethers$3 } = lib;
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

const ethereum$5 = {
  proxyDeploy: async (signer, factoryAddress, prototypeAddress, inputs) => {
    const proxyFactory = new ethers$3.Contract(factoryAddress, ProxyFactoryABI, signer);
    const tx = await proxyFactory.create(prototypeAddress, inputs);

    return {
      tx,
      wait: tx.wait.bind(tx),
      getAddress: async () => {
        const receipt = await tx.wait();
        const proxyCreatedEvent = receipt.logs[0];
        const proxyAddressBytes = proxyCreatedEvent.topics[2];
        const [proxyAddress] = ethers$3.utils.defaultAbiCoder.decode(['address'], proxyAddressBytes);

        return proxyAddress;
      },
    };
  },
};

var actions = {
  ethereum: ethereum$5,
  input,
  select,
  radio,
  tab,
  component,
};

const { bn: bn$3 } = lib;
const { ethereum: ethereum$4 } = ethereum_1;
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
    const { token0, reserve0, token1, reserve1, totalSupply } = await ethereum$4.uniswap.pairInfo(
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

const { ethers: ethers$2, bn: bn$2 } = lib;
const { bridgeWrapperBuild: bridgeWrapperBuild$1 } = coingecko$1;
const { ethereum: ethereum$3 } = ethereum_1;
const { toFloat: toFloat$2 } = toFloat$3;
const { tokens: tokens$3 } = tokens_1;
const AutomateActions$2 = actions;
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
    return async (provider, contractAddress, initOptions = ethereum$3.defaultOptions()) => {
      const options = {
        ...ethereum$3.defaultOptions(),
        ...initOptions,
      };
      const blockTag = options.blockNumber === 'latest' ? 'latest' : parseInt(options.blockNumber, 10);
      const network = (await provider.detectNetwork()).chainId;
      const block = await provider.getBlock(blockTag);
      const blockNumber = block.number;
      const priceFeed = bridgeWrapperBuild$1({}, blockTag, block, network);
      const avgBlockTime = await ethereum$3.getAvgBlockTime(provider, blockNumber);

      const masterChiefContract = new ethers$2.Contract(masterChefAddress, masterChefABI, provider);

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
        ethereum$3
          .erc20(provider, stakingToken)
          .decimals()
          .then((res) => Number(res.toString())),
        ethereum$3
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
        await ethereum$3.erc20(provider, contractAddress).balanceOf(masterChefAddress),
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
          const balance = toFloat$2(amount, ethereum$3.uniswap.pairDecimals);
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
            tokens: tokens$3(
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
          const stakingTokenContract = ethereum$3.erc20(provider, stakingToken).connect(signer);
          const stakingContract = masterChiefContract.connect(signer);

          return {
            stake: [
              AutomateActions$2.tab(
                'Stake',
                async () => ({
                  description: 'Stake your tokens to contract',
                  inputs: [
                    AutomateActions$2.input({
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
                  await ethereum$3.erc20ApproveAll(
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
              AutomateActions$2.tab(
                'Unstake',
                async () => {
                  const userInfo = await stakingContract.userInfo(poolIndex, walletAddress);

                  return {
                    description: 'Unstake your tokens from contract',
                    inputs: [
                      AutomateActions$2.input({
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
              AutomateActions$2.tab(
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
              AutomateActions$2.tab(
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

const { ethers: ethers$1, bn: bn$1, ethersMulticall: ethersMulticall$1 } = lib;
const { ethereum: ethereum$2 } = ethereum_1;
const { CoingeckoProvider } = coingecko$1;
const { toFloat: toFloat$1 } = toFloat$3;
const { tokens: tokens$2 } = tokens_1;
const AutomateActions$1 = actions;

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

var staking$1 = {
  synthetixStaking:
    (getApyPerDayFunction = getApyPerDayFunctionDefault) =>
    async (provider, contractAddress, initOptions = ethereum$2.defaultOptions()) => {
      const options = {
        ...ethereum$2.defaultOptions(),
        ...initOptions,
      };
      const blockTag = options.blockNumber === 'latest' ? 'latest' : parseInt(options.blockNumber, 10);
      const contract = new ethers$1.Contract(contractAddress, stakingABI, provider);
      const network = (await provider.detectNetwork()).chainId;
      const block = await provider.getBlock(blockTag);
      const blockNumber = block.number;
      const priceFeed = new CoingeckoProvider({ block, blockTag }).initPlatform(network);
      const avgBlockTime = await ethereum$2.getAvgBlockTime(provider, blockNumber);
      const blocksPerDay = new bn$1((1000 * 60 * 60 * 24) / avgBlockTime);

      const multicall = new ethersMulticall$1.Provider(provider, network);
      const multicallContract = new ethersMulticall$1.Contract(contractAddress, stakingABI);
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
        new ethersMulticall$1.Contract(stakingToken, ethereum$2.abi.ERC20ABI).decimals(),
        new ethersMulticall$1.Contract(rewardsToken, ethereum$2.abi.ERC20ABI).decimals(),
      ]);
      stakingTokenDecimals = parseInt(stakingTokenDecimals, 10);
      rewardsTokenDecimals = parseInt(rewardsTokenDecimals, 10);

      periodFinish = periodFinish.toString();
      rewardRate = toFloat$1(rewardRate, rewardsTokenDecimals);
      if (new bn$1(periodFinish).lt(blockNumber)) rewardRate = new bn$1('0');
      totalSupply = toFloat$1(totalSupply, ethereum$2.uniswap.pairDecimals);
      stakingToken = stakingToken.toLowerCase();
      rewardsToken = rewardsToken.toLowerCase();
      const rewardTokenUSD = await priceFeed.contractPrice(rewardsToken);

      const stakingTokenPair = await ethereum$2.uniswap.pairInfo(provider, stakingToken, options);
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
          balance = toFloat$1(balance, ethereum$2.uniswap.pairDecimals);
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
            tokens: tokens$2(
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
          const rewardTokenContract = ethereum$2.erc20(provider, rewardsToken).connect(signer);
          const rewardTokenSymbol = await rewardTokenContract.symbol();
          const stakingTokenContract = ethereum$2.erc20(provider, stakingToken).connect(signer);
          const stakingTokenSymbol = await stakingTokenContract.symbol();
          const stakingTokenDecimals = await stakingTokenContract.decimals().then((v) => v.toString());
          const stakingContract = contract.connect(signer);

          return {
            stake: [
              AutomateActions$1.tab(
                'Stake',
                async () => ({
                  description: `Stake your [${stakingTokenSymbol}](https://etherscan.io/address/${stakingToken}) tokens to contract`,
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
                    tx: await stakingContract.stake(amountInt.toFixed(0)),
                  };
                }
              ),
            ],
            unstake: [
              AutomateActions$1.tab(
                'Unstake',
                async () => ({
                  description: `Unstake your [${stakingTokenSymbol}](https://etherscan.io/address/${stakingToken}) tokens from contract`,
                  inputs: [
                    AutomateActions$1.input({
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
              AutomateActions$1.tab(
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
              AutomateActions$1.tab(
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

const { ethereum: ethereum$1 } = ethereum_1;
const { waves } = waves_1;
const { coingecko } = coingecko$1;
const { masterChef } = masterChef$1;
const staking = staking$1;
const { tokens: tokens$1 } = tokens_1;
const { toFloat } = toFloat$3;

var utils = {
  toFloat,
  tokens: tokens$1,
  ethereum: ethereum$1,
  waves,
  coingecko,
  masterChef,
  staking,
};

var require$$14 = {
	"0xc2cb1040220768554cf699b0d863a3cd4324ce32": {
	platform: "ethereum",
	address: "0x6b175474e89094c44da98b954eedeac495271d0f"
},
	"0x26ea744e5b887e5205727f55dfbe8685e3b21951": {
	platform: "ethereum",
	address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
},
	"0xe6354ed5bc4b393a5aad09f21c46e101e692d447": {
	platform: "ethereum",
	address: "0xdac17f958d2ee523a2206206994597c13d831ec7"
},
	"0x04bc0ab673d88ae9dbc9da2380cb6b79c4bca9ae": {
	platform: "ethereum",
	address: "0x4fabb145d64652a948d72533023f6e7a623c7c53"
},
	"0x5f3b5dfeb7b28cdbd7faba78963ee202a494e2a2": {
	platform: "ethereum",
	address: "0xd533a949740bb3306d119cc777fa900ba034cd52"
}
};

const { bn, ethers, ethersMulticall } = lib;
const { ethereum } = ethereum_1;
const { bridgeWrapperBuild } = coingecko$1;
const registryABI = require$$3;
const gaugeABI = require$$4;
const poolABI = require$$5;
const landingPoolABI = require$$6$1;
const minterABI = require$$7;
const veCRVABI = require$$8;
const feeDistributorABI = require$$9;
const gaugeControllerABI = require$$10;
const gaugeUniswapRestakeABI = require$$11;
const { tokens } = utils;
const AutomateActions = actions;
const bridgeTokens = require$$14;

class Pool {
  constructor(connect, info) {
    this.connect = connect;
    this.info = info;
    this.pool = new ethersMulticall.Contract(info.address, info.abi);
    this.lpToken = new ethersMulticall.Contract(info.lpToken, ethereum.abi.ERC20ABI);
    this.gauge = new ethersMulticall.Contract(info.gauge, gaugeABI);
  }

  async balances() {
    const { multicall, blockTag } = this.connect;
    const balances = await multicall.all(
      this.info.coins.map((coin, i) => {
        return this.pool.balances(i);
      }),
      { blockTag }
    );

    return balances.map((balance) => balance.toString());
  }

  async underlyingBalance(amount) {
    const { multicall, blockTag } = this.connect;
    const [totalSupply] = await multicall.all([this.lpToken.totalSupply()], { blockTag });
    const balances = await this.balances();

    return balances.map((balance) => new bn(balance).multipliedBy(amount).div(totalSupply.toString()).toFixed(0));
  }
}

class PoolRegistry {
  constructor(connect) {
    this.connect = connect;
    this.registry = new ethersMulticall.Contract('0x90E00ACe148ca3b23Ac1bC8C240C2a7Dd9c2d7f5', registryABI);
  }

  async getInfoForPool(poolAddress) {
    const { multicall, blockTag } = this.connect;
    let [coinsAddresses, lpToken] = await multicall.all(
      [this.registry.get_coins(poolAddress), this.registry.get_lp_token(poolAddress)],
      { blockTag }
    );
    coinsAddresses = coinsAddresses.filter((address) => address !== '0x0000000000000000000000000000000000000000');
    if (lpToken === '0x0000000000000000000000000000000000000000') {
      throw new Error(`LP token for pool with address "${poolAddress}" not found`);
    }
    let [[gauges]] = await multicall.all([this.registry.get_gauges(poolAddress)], { blockTag });
    gauges = gauges.filter((address) => address !== '0x0000000000000000000000000000000000000000');
    const gauge = gauges[gauges.length - 1];
    if (!gauge || gauge === '0x0000000000000000000000000000000000000000') {
      throw new Error(`Gauge for pool with address "${poolAddress}" not found`);
    }
    const coinsDecimals = await multicall.all(
      coinsAddresses.map((address) => new ethersMulticall.Contract(address, ethereum.abi.ERC20ABI).decimals())
    );

    return {
      address: poolAddress,
      lpToken,
      gauge,
      coins: coinsAddresses.map((address, i) => ({ address, decimals: coinsDecimals[i].toString() })),
    };
  }

  async findByLp(lpToken) {
    const { multicall, blockTag } = this.connect;
    const [poolAddress] = await multicall.all([this.registry.get_pool_from_lp_token(lpToken)], { blockTag });
    if (poolAddress === '0x0000000000000000000000000000000000000000') {
      return poolAddress;
    }

    return this.getInfoForPool(poolAddress);
  }

  async findByGauge(gaugeAddress) {
    const { multicall, blockTag } = this.connect;
    const [lpToken] = await multicall.all([new ethersMulticall.Contract(gaugeAddress, gaugeABI).lp_token()], {
      blockTag,
    });

    return this.findByLp(lpToken);
  }
}

async function getUnderlyingBalance(pools, priceFeed, pool, amount) {
  const balances = await pool.underlyingBalance(amount);

  return pool.info.coins.reduce(async (resultPromise, { address, decimals }, i) => {
    const result = await resultPromise;

    const subpoolInfo = await pools.findByLp(address);
    if (subpoolInfo !== '0x0000000000000000000000000000000000000000') {
      return [
        ...result,
        await getUnderlyingBalance(
          pools,
          priceFeed,
          new Pool(pool.connect, { ...subpoolInfo, abi: pool.info.abi }),
          balances[i]
        ),
      ];
    }
    const balance = new bn(balances[i]).div(Number(`1e${decimals}`)).toString(10);
    const priceUSD = await priceFeed(address);

    return [
      ...result,
      {
        address,
        decimals,
        balance,
        balanceUSD: new bn(balance).multipliedBy(priceUSD).toString(10),
      },
    ];
  }, Promise.resolve([]));
}

function e18(v) {
  return new bn(v.toString()).div(1e18);
}

function stakingAdapterFactory(poolABI) {
  return async (provider, contractAddress, initOptions = ethereum.defaultOptions()) => {
    const options = {
      ...ethereum.defaultOptions(),
      ...initOptions,
    };

    const blockTag = options.blockNumber === 'latest' ? 'latest' : parseInt(options.blockNumber, 10);
    const network = (await provider.detectNetwork()).chainId;
    const block = await provider.getBlock(blockTag);
    const multicall = new ethersMulticall.Provider(provider, network);
    const priceFeed = bridgeWrapperBuild(bridgeTokens, blockTag, block, network);
    const gaugeController = new ethersMulticall.Contract(
      '0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB',
      gaugeControllerABI
    );
    const crvToken = '0xD533a949740bb3306d119CC777fa900bA034cd52';
    const crvPriceUSD = await priceFeed(crvToken);
    const minter = new ethersMulticall.Contract('0xd061D61a4d941c39E5453435B6345Dc261C2fcE0', minterABI);
    const pools = new PoolRegistry({ multicall, blockTag });

    const poolInfo = await pools.findByGauge(contractAddress);
    const pool = new Pool({ multicall, blockTag }, { ...poolInfo, abi: poolABI });
    const [stakedTotalSupply, inflationRate, workingSupply, virtualPrice, relativeWeight] = await multicall.all([
      pool.gauge.totalSupply(),
      pool.gauge.inflation_rate(),
      pool.gauge.working_supply(),
      pool.pool.get_virtual_price(),
      gaugeController.gauge_relative_weight(pool.gauge.address),
    ]);
    const stakingTokenDecimals = 18;

    const totalSupplyTokens = await getUnderlyingBalance(pools, priceFeed, pool, stakedTotalSupply.toString());
    const stakedTokens = totalSupplyTokens.flat(Infinity);
    const tvl = stakedTokens.reduce((sum, { balanceUSD }) => sum.plus(balanceUSD), new bn(0));

    const aprDay = new bn(e18(inflationRate))
      .multipliedBy(e18(relativeWeight))
      .multipliedBy(86400)
      .div(e18(workingSupply))
      .multipliedBy(0.4)
      .div(e18(virtualPrice))
      .multipliedBy(crvPriceUSD);

    return {
      stakeToken: {
        address: poolInfo.lpToken,
        decimals: 18,
        parts: stakedTokens.map(({ address, decimals, balance, balanceUSD }) => ({
          address,
          decimals,
          priceUSD: new bn(balanceUSD).div(balance).toString(10),
        })),
      },
      rewardToken: {
        address: crvToken,
        decimals: 18,
        priceUSD: crvPriceUSD.toString(10),
      },
      metrics: {
        tvl: tvl.toString(10),
        aprDay: aprDay.toString(10),
        aprWeek: aprDay.multipliedBy(7).toString(10),
        aprMonth: aprDay.multipliedBy(30).toString(10),
        aprYear: aprDay.multipliedBy(365).toString(10),
      },
      wallet: async (walletAddress) => {
        const [staked] = await multicall.all([pool.gauge.balanceOf(walletAddress)]);
        const gauge = new ethers.Contract(pool.info.gauge, gaugeABI, provider);
        const earned = await gauge.callStatic.claimable_tokens(walletAddress).then((v) => v.toString());
        const stakedTokens = (await getUnderlyingBalance(pools, priceFeed, pool, staked.toString())).flat(Infinity);
        const earnedNormalize = new bn(earned.toString()).div(1e18).toString(10);
        const earnedUSD = new bn(earnedNormalize).multipliedBy(crvPriceUSD).toString(10);

        return {
          staked: stakedTokens.reduce(
            (result, { address, balance, balanceUSD }) => ({
              ...result,
              [address]: {
                balance,
                usd: balanceUSD,
              },
            }),
            {}
          ),
          earned: {
            [crvToken]: {
              balance: earnedNormalize,
              usd: earnedUSD,
            },
          },
          metrics: {
            staking: stakedTokens.reduce((sum, { balance }) => sum.plus(balance), new bn(0)).toString(10),
            stakingUSD: stakedTokens.reduce((sum, { balanceUSD }) => sum.plus(balanceUSD), new bn(0)).toString(10),
            earned: earnedNormalize,
            earnedUSD,
          },
          tokens: tokens(
            ...stakedTokens.concat([{ address: crvToken, balance: earnedNormalize, balanceUSD: earnedUSD }]).reduce(
              (result, { address, balance, balanceUSD }) => [
                ...result,
                {
                  token: address,
                  data: {
                    balance,
                    usd: balanceUSD,
                  },
                },
              ],
              []
            )
          ),
        };
      },
      actions: async (walletAddress) => {
        if (options.signer === null) {
          throw new Error('Signer not found, use options.signer for use actions');
        }
        const { signer } = options;
        const rewardTokenContract = ethereum.erc20(provider, crvToken).connect(signer);
        const rewardTokenSymbol = await rewardTokenContract.symbol();
        const stakingTokenContract = ethereum.erc20(signer, pool.lpToken.address);
        const stakingTokenSymbol = await stakingTokenContract.symbol();
        const stakingContract = new ethers.Contract(pool.gauge.address, gaugeABI, signer);
        const minterContract = new ethers.Contract(minter.address, minterABI, signer);

        return {
          stake: [
            AutomateActions.tab(
              'Stake',
              async () => ({
                description: `Stake your [${stakingTokenSymbol}](etherscan.io/address/${pool.lpToken.address}) tokens to contract`,
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
                  pool.gauge.address,
                  amountInt.toFixed(0)
                );

                return {
                  tx: await stakingContract.deposit(amountInt.toFixed(0)),
                };
              }
            ),
          ],
          unstake: [
            AutomateActions.tab(
              'Unstake',
              async () => ({
                description: `Unstake your [${stakingTokenSymbol}](etherscan.io/address/${pool.lpToken.address}) tokens from contract`,
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
                if (amountInt.gt(balance)) return Error('Amount exceeds balance');

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
                description: `Claim your [${rewardTokenSymbol}](etherscan.io/address/${rewardToken}) reward`,
              }),
              async () => {
                const earned = await minterContract.minted(walletAddress, pool.gauge.address).then((v) => v.toString());
                if (new bn(earned).isLessThanOrEqualTo(0)) {
                  return Error('No earnings');
                }

                return true;
              },
              async () => ({
                tx: await minterContract.mint(pool.gauge.address),
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
                return true;
              },
              async () => {
                const earned = await minterContract.minted(walletAddress, pool.gauge.address).then((v) => v.toString());
                if (new bn(earned).isGreaterThan(0)) {
                  await minterContract.mint(pool.gauge.address);
                }

                const balance = await stakingContract.balanceOf(walletAddress).then((v) => v.toString());
                return {
                  tx: await stakingContract.withdraw(balance),
                };
              }
            ),
          ],
        };
      },
    };
  };
}

var curve = {
  staking: stakingAdapterFactory(poolABI),
  stakingLanding: stakingAdapterFactory(landingPoolABI),
  veCRV: async (provider, contractAddress, initOptions = ethereum.defaultOptions()) => {
    const options = {
      ...ethereum.defaultOptions(),
      ...initOptions,
    };

    const blockTag = options.blockNumber === 'latest' ? 'latest' : parseInt(options.blockNumber, 10);
    const network = (await provider.detectNetwork()).chainId;
    const block = await provider.getBlock(blockTag);
    const multicall = new ethersMulticall.Provider(provider, network);
    const priceFeed = bridgeWrapperBuild(bridgeTokens, blockTag, block, network);

    return {
      metrics: {
        tvl: '0',
        aprDay: '0',
        aprWeek: '0',
        aprMonth: '0',
        aprYear: '0',
      },
      wallet: async (walletAddress) => {
        const veCRVAddress = '0x5f3b5DfEb7B28CDbD7FAba78963EE202a494e2A2';
        const feeDistributorAddress = '0xA464e6DCda8AC41e03616F95f4BC98a13b8922Dc';
        const veCRVContract = new ethers.Contract(veCRVAddress, veCRVABI, provider);
        const feeDistributorContract = new ethers.Contract(feeDistributorAddress, feeDistributorABI, provider);
        const staked = await veCRVContract.callStatic['locked(address)'](walletAddress).then(({ amount }) =>
          new bn(amount.toString()).div('1e18')
        );
        const stakedUSD = staked.multipliedBy(await priceFeed(veCRVAddress));
        const rewardTokenAddress = await feeDistributorContract.token();
        const pools = new PoolRegistry({ multicall, blockTag });
        const poolInfo = await pools.findByLp(rewardTokenAddress);
        const pool = new Pool({ multicall, blockTag }, { ...poolInfo, abi: poolABI });
        const earned = await feeDistributorContract.callStatic['claim(address)'](walletAddress).then(
          (v) => new bn(v.toString())
        );
        const rewardTokens = (await getUnderlyingBalance(pools, priceFeed, pool, earned.toString(10))).flat(Infinity);

        return {
          staked: {
            [veCRVAddress]: {
              balance: staked.toString(10),
              usd: stakedUSD.toString(10),
            },
          },
          earned: rewardTokens.reduce(
            (result, { address, balance, balanceUSD }) => ({
              ...result,
              [address]: {
                balance,
                usd: balanceUSD,
              },
            }),
            {}
          ),
          metrics: {
            staking: staked.toString(10),
            stakingUSD: stakedUSD.toString(10),
            earned: earned.div('1e18').toString(10),
            earnedUSD: rewardTokens.reduce((sum, { balanceUSD }) => sum.plus(balanceUSD), new bn(0)).toString(10),
          },
          tokens: tokens(
            ...rewardTokens
              .concat([{ address: veCRVAddress, balance: staked.toString(10), balanceUSD: stakedUSD.toString(10) }])
              .reduce(
                (result, { address, balance, balanceUSD }) => [
                  ...result,
                  {
                    token: address,
                    data: {
                      balance,
                      usd: balanceUSD,
                    },
                  },
                ],
                []
              )
          ),
        };
      },
      actions: async (walletAddress) => {
        return {
          stake: [],
          unstake: [],
          claim: [],
          exit: [],
        };
      },
    };
  },
  automates: {
    deploy: {
      GaugeUniswapRestake: async (signer, factoryAddress, prototypeAddress, contractAddress = undefined) => {
        const network = await signer.getChainId();
        const multicall = new ethersMulticall.Provider(signer, network);
        const pools = new PoolRegistry({ multicall, blockTag: 'latest' });
        let gaugeInfo = await pools.findByGauge('0xbFcF63294aD7105dEa65aA58F8AE5BE2D9d0952A'); // 3pool default
        let gauge = gaugeInfo.gauge;
        let swapToken = gaugeInfo.coins[0].address;
        if (contractAddress) {
          gaugeInfo = await pools.findByGauge(contractAddress);
          gauge = gaugeInfo.gauge;
          swapToken = gaugeInfo.coins[0].address;
        }

        return {
          deploy: [
            AutomateActions.tab(
              'Deploy',
              async () => ({
                description: 'Deploy your own contract',
                inputs: [
                  AutomateActions.input({
                    placeholder: 'Target gauge',
                    value: gauge,
                  }),
                  AutomateActions.input({
                    placeholder: 'Liquidity pool router address',
                    value: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
                  }),
                  AutomateActions.input({
                    placeholder: 'Swap token address',
                    value: swapToken,
                  }),
                  AutomateActions.input({
                    placeholder: 'Slippage percent',
                    value: '1',
                  }),
                  AutomateActions.input({
                    placeholder: 'Deadline (seconds)',
                    value: '300',
                  }),
                ],
              }),
              async (gauge, router, swapToken, slippage, deadline) => {
                if (slippage < 0 || slippage > 100) return new Error('Invalid slippage percent');
                if (deadline < 0) return new Error('Deadline has already passed');

                return true;
              },
              async (gauge, router, swapToken, slippage, deadline) =>
                AutomateActions.ethereum.proxyDeploy(
                  signer,
                  factoryAddress,
                  prototypeAddress,
                  new ethers.utils.Interface(gaugeUniswapRestakeABI).encodeFunctionData('init', [
                    gauge,
                    router,
                    swapToken,
                    Math.floor(slippage * 100),
                    deadline,
                  ])
                )
            ),
          ],
        };
      },
      GaugeUniswapClaim: async (signer, factoryAddress, prototypeAddress, contractAddress = undefined) => {
        const signerAddress = await signer.getAddress();
        const network = await signer.getChainId();
        const multicall = new ethersMulticall.Provider(signer, network);
        const pools = new PoolRegistry({ multicall, blockTag: 'latest' });
        let gaugeInfo = await pools.findByGauge('0xbFcF63294aD7105dEa65aA58F8AE5BE2D9d0952A'); // 3pool default
        let gauge = gaugeInfo.gauge;
        let swapToken = gaugeInfo.coins[0].address;
        if (contractAddress) {
          gaugeInfo = await pools.findByGauge(contractAddress);
          gauge = gaugeInfo.gauge;
          swapToken = gaugeInfo.coins[0].address;
        }

        return {
          deploy: [
            AutomateActions.tab(
              'Deploy',
              async () => ({
                description: 'Deploy your own contract',
                inputs: [
                  AutomateActions.input({
                    placeholder: 'Target gauge',
                    value: gauge,
                  }),
                  AutomateActions.input({
                    placeholder: 'Liquidity pool router address',
                    value: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
                  }),
                  AutomateActions.input({
                    placeholder: 'Swap token address',
                    value: swapToken,
                  }),
                  AutomateActions.input({
                    placeholder: 'Slippage percent',
                    value: '1',
                  }),
                  AutomateActions.input({
                    placeholder: 'Deadline (seconds)',
                    value: '300',
                  }),
                  AutomateActions.input({
                    placeholder: 'Recipient wallet address',
                    value: signerAddress,
                  }),
                ],
              }),
              async (gauge, router, swapToken, slippage, deadlinem, recipient) => {
                if (slippage < 0 || slippage > 100) return new Error('Invalid slippage percent');
                if (deadline < 0) return new Error('Deadline has already passed');

                return true;
              },
              async (gauge, router, swapToken, slippage, deadline, recipient) =>
                AutomateActions.ethereum.proxyDeploy(
                  signer,
                  factoryAddress,
                  prototypeAddress,
                  new ethers.utils.Interface(gaugeUniswapRestakeABI).encodeFunctionData('init', [
                    gauge,
                    router,
                    swapToken,
                    Math.floor(slippage * 100),
                    deadline,
                    recipient,
                  ])
                )
            ),
          ],
        };
      },
    },
    GaugeUniswapRestake: async (signer, contractAddress) => {
      const signerAddress = await signer.getAddress();
      const automate = new ethers.Contract(contractAddress, gaugeUniswapRestakeABI, signer);
      const stakingAddress = await automate.staking();
      const staking = new ethers.Contract(stakingAddress, gaugeABI, signer);
      const stakingTokenAddress = await staking.lp_token();
      const stakingToken = ethereum.erc20(signer, stakingTokenAddress);
      const stakingTokenDecimals = await stakingToken.decimals().then((v) => v.toString());

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
            const stakingBalance = new bn(await staking.balanceOf(signerAddress).then((v) => v.toString()));
            if (stakingBalance.lte(0)) return new Error('Insufficient funds on the staking contract balance');

            return true;
          },
          async () => {
            const stakingBalance = await staking.balanceOf(signerAddress).then((v) => v.toString());
            return {
              tx: await staking.withdraw(stakingBalance),
            };
          }
        ),
        ...deposit,
      ];
      const runParams = async () => {
        const multicall = new ethersMulticall.Provider(signer, await signer.getChainId());
        const automateMulticall = new ethersMulticall.Contract(contractAddress, gaugeUniswapRestakeABI);
        const stakingMulticall = new ethersMulticall.Contract(stakingAddress, gaugeABI);
        const [routerAddress, slippagePercent, deadlineSeconds, swapTokenAddress, rewardTokenAddress] =
          await multicall.all([
            automateMulticall.liquidityRouter(),
            automateMulticall.slippage(),
            automateMulticall.deadline(),
            automateMulticall.swapToken(),
            stakingMulticall.crv_token(),
          ]);
        const earned = await staking.callStatic.claimable_tokens(contractAddress).then((v) => v.toString());
        if (earned.toString() === '0') return new Error('No earned');
        const router = ethereum.uniswap.router(signer, routerAddress);

        const slippage = 1 - slippagePercent / 10000;
        const [, swapAmountOut] = await router.getAmountsOut(earned.toString(), [rewardTokenAddress, swapTokenAddress]);
        const swapOutMin = new bn(swapAmountOut.toString()).multipliedBy(slippage).toFixed(0);
        const lpAmountOut = await automate.calcTokenAmount(swapOutMin);
        const lpOutMin = new bn(lpAmountOut.toString()).multipliedBy(slippage).toFixed(0);
        const deadline = dayjs().add(deadlineSeconds, 'seconds').unix();

        const gasLimit = new bn(
          await automate.estimateGas.run(0, deadline, swapOutMin, lpOutMin).then((v) => v.toString())
        )
          .multipliedBy(1.1)
          .toFixed(0);
        const gasPrice = await signer.getGasPrice();
        const gasFee = new bn(gasLimit.toString()).multipliedBy(gasPrice.toString()).toFixed(0);

        await automate.estimateGas.run(gasFee, deadline, swapOutMin, lpOutMin);
        return {
          gasPrice,
          gasLimit,
          calldata: [gasFee, deadline, swapOutMin, lpOutMin],
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
        contract: stakingAddress,
        deposit,
        refund,
        migrate,
        runParams,
        run,
      };
    },
    GaugeUniswapClaim: async (signer, contractAddress) => {
      const signerAddress = await signer.getAddress();
      const automate = new ethers.Contract(contractAddress, gaugeUniswapRestakeABI, signer);
      const stakingAddress = await automate.staking();
      const staking = new ethers.Contract(stakingAddress, gaugeABI, signer);
      const stakingTokenAddress = await staking.lp_token();
      const stakingToken = ethereum.erc20(signer, stakingTokenAddress);
      const stakingTokenDecimals = await stakingToken.decimals().then((v) => v.toString());

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
            const stakingBalance = new bn(await staking.balanceOf(signerAddress).then((v) => v.toString()));
            if (stakingBalance.lte(0)) return new Error('Insufficient funds on the staking contract balance');

            return true;
          },
          async () => {
            const stakingBalance = await staking.balanceOf(signerAddress).then((v) => v.toString());
            return {
              tx: await staking.withdraw(stakingBalance),
            };
          }
        ),
        ...deposit,
      ];
      const runParams = async () => {
        const multicall = new ethersMulticall.Provider(signer, await signer.getChainId());
        const automateMulticall = new ethersMulticall.Contract(contractAddress, gaugeUniswapRestakeABI);
        const stakingMulticall = new ethersMulticall.Contract(stakingAddress, gaugeABI);
        const [routerAddress, slippagePercent, deadlineSeconds, swapTokenAddress, rewardTokenAddress] =
          await multicall.all([
            automateMulticall.liquidityRouter(),
            automateMulticall.slippage(),
            automateMulticall.deadline(),
            automateMulticall.swapToken(),
            stakingMulticall.crv_token(),
          ]);
        const earned = await staking.callStatic.claimable_tokens(contractAddress).then((v) => v.toString());
        if (earned.toString() === '0') return new Error('No earned');
        const router = ethereum.uniswap.router(signer, routerAddress);

        const slippage = 1 - slippagePercent / 10000;
        const [, swapAmountOut] = await router.getAmountsOut(earned.toString(), [rewardTokenAddress, swapTokenAddress]);
        const swapOutMin = new bn(swapAmountOut.toString()).multipliedBy(slippage).toFixed(0);
        const deadline = dayjs().add(deadlineSeconds, 'seconds').unix();

        const gasLimit = new bn(await automate.estimateGas.run(0, deadline, swapOutMin).then((v) => v.toString()))
          .multipliedBy(1.1)
          .toFixed(0);
        const gasPrice = await signer.getGasPrice();
        const gasFee = new bn(gasLimit.toString()).multipliedBy(gasPrice.toString()).toFixed(0);

        await automate.estimateGas.run(gasFee, deadline, swapOutMin);
        return {
          gasPrice,
          gasLimit,
          calldata: [gasFee, deadline, swapOutMin],
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
        contract: stakingAddress,
        deposit,
        refund,
        migrate,
        runParams,
        run,
      };
    },
  },
};

module.exports = curve;

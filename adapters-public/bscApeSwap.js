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

const { ethers: ethers$2, bn: bn$4, ethersMulticall: ethersMulticall$1 } = lib;
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

const { dayjs: dayjs$1, axios: axios$2 } = lib;

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
      const { data } = await axios$2.get(`${this.apiURL}/simple/price?ids=${id}&vs_currencies=usd`).catch(errorHandler);
      if (typeof data[id] !== 'object' || data[id].usd === undefined) {
        throw new Error(`Price for "coingecko:${id}" not resolved`);
      }

      return data[id].usd;
    } else {
      const date = dayjs$1(this.network.block.timestamp).format('DD-MM-YYYY');
      const { data } = await axios$2.get(`${this.apiURL}/coins/${id}/history?date=${date}`).catch(errorHandler);
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
      const { data } = await axios$2
        .get(
          `${this.apiURL}/simple/token_price/${this.network.platform}?contract_addresses=${address}&vs_currencies=usd`
        )
        .catch(errorHandler);
      if (typeof data !== 'object' || data[address] === undefined || data[address].usd === undefined) {
        throw new Error(`Price for "coingecko:${address}" not resolved`);
      }

      return data[address].usd;
    } else {
      const { data: contractInfo } = await axios$2
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

const { axios: axios$1, env } = lib;

async function read(protocol, key) {
  return axios$1
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
  return axios$1
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

var require$$7 = [
	{
		inputs: [
			{
				internalType: "contract BananaToken",
				name: "_banana",
				type: "address"
			},
			{
				internalType: "contract BananaSplitBar",
				name: "_bananaSplit",
				type: "address"
			},
			{
				internalType: "address",
				name: "_devaddr",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "_bananaPerBlock",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "_startBlock",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "_multiplier",
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
				internalType: "contract IBEP20",
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
		name: "cake",
		outputs: [
			{
				internalType: "contract BananaToken",
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
		name: "cakePerBlock",
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
				internalType: "contract IBEP20",
				name: "_lpToken",
				type: "address"
			}
		],
		name: "checkPoolDuplicate",
		outputs: [
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
				name: "_amount",
				type: "uint256"
			}
		],
		name: "enterStaking",
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
			{
				internalType: "uint256",
				name: "_pid",
				type: "uint256"
			}
		],
		name: "getPoolInfo",
		outputs: [
			{
				internalType: "address",
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
				name: "accCakePerShare",
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
				name: "_amount",
				type: "uint256"
			}
		],
		name: "leaveStaking",
		outputs: [
		],
		stateMutability: "nonpayable",
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
		name: "pendingCake",
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
				internalType: "contract IBEP20",
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
				name: "accCakePerShare",
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
		name: "syrup",
		outputs: [
			{
				internalType: "contract BananaSplitBar",
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
				name: "multiplierNumber",
				type: "uint256"
			}
		],
		name: "updateMultiplier",
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
		name: "Deposit",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "DepositRewards",
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
		name: "EmergencyRewardWithdraw",
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
				internalType: "contract IERC20",
				name: "token",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "EmergencySweepWithdraw",
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
		name: "EmergencyWithdraw",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint256",
				name: "bonusEndBlock",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "rewardPerBlock",
				type: "uint256"
			}
		],
		name: "LogUpdatePool",
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
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "SkimStakeTokenFees",
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
		name: "Withdraw",
		type: "event"
	},
	{
		inputs: [
		],
		name: "REWARD_TOKEN",
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
		name: "STAKE_TOKEN",
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
				name: "_amount",
				type: "uint256"
			}
		],
		name: "depositRewards",
		outputs: [
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
		name: "emergencyRewardWithdraw",
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
		name: "getStakeTokenFeeBalance",
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
		name: "getUnharvestedRewards",
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
				internalType: "contract IERC20",
				name: "_stakeToken",
				type: "address"
			},
			{
				internalType: "contract IERC20",
				name: "_rewardToken",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "_rewardPerBlock",
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
		name: "initialize",
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
				internalType: "address",
				name: "_user",
				type: "address"
			}
		],
		name: "pendingReward",
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
				name: "accRewardTokenPerShare",
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
		],
		name: "rewardBalance",
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
		name: "rewardPerBlock",
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
				name: "_bonusEndBlock",
				type: "uint256"
			}
		],
		name: "setBonusEndBlock",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_rewardPerBlock",
				type: "uint256"
			}
		],
		name: "setRewardPerBlock",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_to",
				type: "address"
			}
		],
		name: "skimStakeTokenFees",
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
			{
				internalType: "contract IERC20",
				name: "token",
				type: "address"
			}
		],
		name: "sweepToken",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "totalRewardsAllocated",
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
		name: "totalRewardsPaid",
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
		name: "totalStakeTokenBalance",
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
		name: "totalStaked",
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
		name: "updatePool",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
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
				internalType: "struct MasterChefSingleRestake.Swap",
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

var require$$10 = [
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
				internalType: "struct MasterChefLpRestake.Swap",
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
				internalType: "struct MasterChefLpRestake.Swap",
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
				internalType: "struct ApeRewardV4Restake.Swap",
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
				internalType: "contract IApeRewardV4",
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

var require$$12 = {
	"0x101d82428437127bf1608f699cd651e6abf9766e": {
	platform: "ethereum",
	address: "0x0d8775f648430679a709e98d2b0cb6250d2887ef"
},
	"0x2859e4544c4bb03966803b044a93563bd2d0dd4d": {
	platform: "ethereum",
	address: "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce"
},
	"0x94babbe728d9411612ee41b20241a6fa251b26ce": {
	platform: "binance-smart-chain",
	address: "0x5f136383e230f972739fae2e81e7e774afe64c66"
},
	"0x1f9f6a696c6fd109cd3956f45dc709d2b3902163": {
	platform: "ethereum",
	address: "0x4f9254c83eb525f9fcf346490bbb3ed28a81c667"
},
	"0xadbaf88b39d37dc68775ed1541f1bf83a5a45feb": {
	platform: "ethereum",
	address: "0xddb3422497e61e13543bea06989c0789117555c5"
},
	"0x0856978f7ffff0a2471b4520e3521c4b3343e36f": {
	platform: "ethereum",
	address: "0xb705268213d593b8fd88d3fdeff93aff5cbdcfae"
},
	"0x308bfaeaac8bdab6e9fc5ead8edcb5f95b0599d9": {
	platform: "ethereum",
	address: "0xd341d1680eeee3255b8c4c75bcce7eb57f144dae"
},
	"0x6b1c8765c7eff0b60706b0ae489eb9bb9667465a": {
	platform: "ethereum",
	address: "0x3ebb4a4e91ad83be51f8d596533818b246f4bee1"
},
	"0x9ac983826058b8a9c7aa1c9171441191232e8404": {
	platform: "ethereum",
	address: "0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f"
},
	"0xfb6115445bff7b52feb98650c87f44907e58f802": {
	platform: "ethereum",
	address: "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9"
},
	"0x88f1a5ae2a3bf98aeaf342d26b30a79438c9142e": {
	platform: "ethereum",
	address: "0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e"
},
	"0x1ba42e5193dfa8b03d15dd1b86a3113bbbef8eeb": {
	platform: "ethereum",
	address: "0x4a64515e5e1d1073e83f30cb97bed20400b66e10"
}
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

const { ethers, bn, ethersMulticall, dayjs } = lib;
const { ethereum } = ethereum_1;
const { toFloat } = toFloat$1;
const { tokens } = tokens_1;
const { bridgeWrapperBuild } = coingecko;
const cache = cache$1;
const AutomateActions = actions;
const masterChefABI = require$$7;
const apeRewardV4ABI = require$$8;
const MasterChefSingleRestakeABI = require$$9;
const MasterChefLpRestakeABI = require$$10;
const ApeRewardV4RestakeABI = require$$11;
const bridgeTokens = require$$12;
const { buildMasterChefProvider, toBN, buildMasterChefActions } = provider;

const masterChefAddress = '0x5c8D727b265DBAfaba67E050f2f739cAeEB4A6F9';
const routeTokens = ['0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'];

var bscApeSwap = {
  masterChefPair: async (provider, contractAddress, initOptions = ethereum.defaultOptions()) => {
    const options = {
      ...ethereum.defaultOptions(),
      ...initOptions,
    };
    const masterChefSavedPools = await cache.read('bscApeSwap', 'masterChefPools');
    const blockTag = options.blockNumber === 'latest' ? 'latest' : parseInt(options.blockNumber, 10);
    const network = (await provider.detectNetwork()).chainId;
    const block = await provider.getBlock(blockTag);
    const blockNumber = block.number;
    const priceFeed = bridgeWrapperBuild(bridgeTokens, blockTag, block, network);
    const avgBlockTime = await ethereum.getAvgBlockTime(provider, blockNumber);

    const pool = masterChefSavedPools.find((p) => p.stakingToken.toLowerCase() === contractAddress.toLowerCase());
    if (!pool) {
      throw new Error('Pool is not found');
    }

    const masterChefProvider = buildMasterChefProvider(
      new ethers.Contract(masterChefAddress, masterChefABI, provider),
      { blockTag },
      {
        rewardToken() {
          return '0x603c7f932ED1fc6575303D8Fb018fDCBb0f39a95';
        },
        poolInfo(poolIndex) {
          return this.contract
            .poolInfo(poolIndex, { blockTag: this.options.blockTag })
            .then(({ lpToken, allocPoint, accCakePerShare }) => ({
              lpToken,
              allocPoint: toBN(allocPoint),
              accRewardPerShare: toBN(accCakePerShare),
            }));
        },
        rewardPerSecond() {
          return this.contract
            .cakePerBlock({ blockTag: this.options.blockTag })
            .then((v) => toBN(v).multipliedBy(1000).div(avgBlockTime));
        },
        pendingReward(poolIndex, wallet) {
          return this.contract.pendingCake(poolIndex, wallet).then(toBN);
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
          etherscanAddressURL: 'https://bscscan.com/address',
        }).then((actions) => actions(walletAddress));
      },
    };
  },
  masterChefSingle: async (provider, contractAddress, initOptions = ethereum.defaultOptions()) => {
    const options = {
      ...ethereum.defaultOptions(),
      ...initOptions,
    };
    const masterChefSavedPools = await cache.read('bscApeSwap', 'masterChefPools');
    const blockTag = options.blockNumber === 'latest' ? 'latest' : parseInt(options.blockNumber, 10);
    const network = (await provider.detectNetwork()).chainId;
    const block = await provider.getBlock(blockTag);
    const blockNumber = block.number;
    const priceFeed = bridgeWrapperBuild(bridgeTokens, blockTag, block, network);
    const avgBlockTime = await ethereum.getAvgBlockTime(provider, blockNumber);

    const pool = masterChefSavedPools.find((p) => p.stakingToken.toLowerCase() === contractAddress.toLowerCase());
    if (!pool) {
      throw new Error('Pool is not found');
    }

    const masterChefProvider = buildMasterChefProvider(
      new ethers.Contract(masterChefAddress, masterChefABI, provider),
      { blockTag },
      {
        rewardToken() {
          return '0x603c7f932ED1fc6575303D8Fb018fDCBb0f39a95';
        },
        poolInfo(poolIndex) {
          return this.contract
            .poolInfo(poolIndex, { blockTag: this.options.blockTag })
            .then(({ lpToken, allocPoint, accCakePerShare }) => ({
              lpToken,
              allocPoint: toBN(allocPoint),
              accRewardPerShare: toBN(accCakePerShare),
            }));
        },
        rewardPerSecond() {
          return this.contract
            .cakePerBlock({ blockTag: this.options.blockTag })
            .then((v) => toBN(v).multipliedBy(1000).div(avgBlockTime));
        },
        pendingReward(poolIndex, wallet) {
          return this.contract.pendingCake(poolIndex, wallet).then(toBN);
        },
      }
    );
    const poolInfo = await masterChefProvider.poolInfo(pool.index);

    const rewardToken = await masterChefProvider.rewardToken();
    const rewardTokenDecimals = 18;
    const rewardTokenPriceUSD = await priceFeed(rewardToken);

    const stakingToken = contractAddress.toLowerCase();
    const stakingTokenDecimals = await ethereum
      .erc20(provider, stakingToken)
      .decimals()
      .then((v) => Number(v.toString()));
    const stakingTokenPriceUSD = await priceFeed(stakingToken);

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
          etherscanAddressURL: 'https://bscscan.com/address',
        }).then((actions) => actions(walletAddress));
      },
    };
  },
  apeRewardV4: async (provider, contractAddress, initOptions = ethereum.defaultOptions()) => {
    const options = {
      ...ethereum.defaultOptions(),
      ...initOptions,
    };
    const blockTag = options.blockNumber === 'latest' ? 'latest' : parseInt(options.blockNumber, 10);
    const network = (await provider.detectNetwork()).chainId;
    const block = await provider.getBlock(blockTag);
    const blockNumber = block.number;
    const priceFeed = bridgeWrapperBuild(bridgeTokens, blockTag, block, network);
    const avgBlockTime = await ethereum.getAvgBlockTime(provider, blockNumber);

    const apeRewardContract = new ethers.Contract(contractAddress, apeRewardV4ABI, provider);
    const rewardToken = await apeRewardContract.REWARD_TOKEN().then((v) => v.toLowerCase());
    const rewardTokenDecimals = await ethereum
      .erc20(provider, rewardToken)
      .decimals()
      .then((v) => Number(v.toString()));
    const rewardTokenPriceUSD = await priceFeed(rewardToken);
    const rewardTokenPerBlock = await apeRewardContract
      .rewardPerBlock({ blockTag })
      .then((v) => toFloat(new bn(v.toString()), rewardTokenDecimals));

    const stakingToken = await apeRewardContract.STAKE_TOKEN().then((v) => v.toLowerCase());
    const stakingTokenDecimals = await ethereum
      .erc20(provider, stakingToken)
      .decimals()
      .then((v) => Number(v.toString()));
    const stakingTokenPriceUSD = await priceFeed(stakingToken);

    const totalLocked = toFloat(
      await apeRewardContract.totalStaked({ blockTag }).then((v) => v.toString()),
      stakingTokenDecimals
    );
    const tvl = new bn(totalLocked).multipliedBy(stakingTokenPriceUSD);

    let aprBlock = rewardTokenPerBlock.multipliedBy(rewardTokenPriceUSD).div(tvl);
    if (!aprBlock.isFinite()) aprBlock = new bn(0);

    const blocksPerDay = new bn((1000 * 60 * 60 * 24) / avgBlockTime);
    const aprDay = aprBlock.multipliedBy(blocksPerDay);
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
        const { amount } = await apeRewardContract.userInfo(walletAddress, { blockTag });
        const balance = toFloat(amount, stakingTokenDecimals);
        const earned = toFloat(await apeRewardContract.pendingReward(walletAddress, { blockTag }), rewardTokenDecimals);
        const earnedUSD = earned.multipliedBy(rewardTokenPriceUSD);

        return {
          staked: {
            [stakingToken]: {
              balance: balance.toString(10),
              usd: balance.multipliedBy(stakingTokenPriceUSD).toString(10),
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
            stakingUSD: balance.multipliedBy(stakingTokenPriceUSD).toString(10),
            earned: earned.toString(10),
            earnedUSD: earnedUSD.toString(10),
          },
          tokens: tokens(
            {
              token: stakingToken,
              data: {
                balance: balance.toString(10),
                usd: balance.multipliedBy(stakingTokenPriceUSD).toString(10),
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
        const rewardTokenContract = ethereum.erc20(provider, rewardToken).connect(signer);
        const rewardTokenSymbol = await rewardTokenContract.symbol();
        const stakingTokenContract = ethereum.erc20(provider, stakingToken).connect(signer);
        const stakingTokenSymbol = await stakingTokenContract.symbol();
        const stakingContract = apeRewardContract.connect(signer);

        return {
          stake: [
            AutomateActions.tab(
              'Stake',
              async () => ({
                description: `Stake your [${stakingTokenSymbol}](https://bscscan.com/address/${stakingTokenContract.address}) tokens to contract`,
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
                  stakingContract.address,
                  amountInt.toFixed(0)
                );

                return { tx: await stakingContract.deposit(amountInt.toFixed(0)) };
              }
            ),
          ],
          unstake: [
            AutomateActions.tab(
              'Unstake',
              async () => {
                const userInfo = await stakingContract.userInfo(walletAddress);

                return {
                  description: `Unstake your [${stakingTokenSymbol}](https://bscscan.com/address/${stakingTokenContract.address}) tokens from contract`,
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

                const userInfo = await stakingContract.userInfo(walletAddress);
                if (amountInt.isGreaterThan(userInfo.amount.toString())) {
                  return Error('Amount exceeds balance');
                }

                return true;
              },
              async (amount) => {
                const amountInt = new bn(amount).multipliedBy(`1e${stakingTokenDecimals}`);

                return { tx: await stakingContract.withdraw(amountInt.toFixed(0)) };
              }
            ),
          ],
          claim: [
            AutomateActions.tab(
              'Claim',
              async () => ({
                description: `Claim your [${rewardTokenSymbol}](https://bscscan.com/address/${rewardTokenContract.address}) reward`,
              }),
              async () => {
                const earned = await stakingContract.pendingReward(walletAddress).then((v) => v.toString());
                if (new bn(earned).isLessThanOrEqualTo(0)) {
                  return Error('No earnings');
                }

                return true;
              },
              async () => {
                return { tx: await stakingContract.deposit(0) };
              }
            ),
          ],
          exit: [
            AutomateActions.tab(
              'Exit',
              async () => ({
                description: 'Get all tokens from contract',
              }),
              async () => {
                const earned = await stakingContract.pendingReward(walletAddress).then((v) => v.toString());
                const userInfo = await stakingContract.userInfo(walletAddress);
                if (
                  new bn(earned).isLessThanOrEqualTo(0) &&
                  new bn(userInfo.amount.toString()).isLessThanOrEqualTo(0)
                ) {
                  return Error('No staked');
                }

                return true;
              },
              async () => {
                const userInfo = await stakingContract.userInfo(walletAddress);
                if (new bn(userInfo.amount.toString()).isGreaterThan(0)) {
                  await stakingContract.withdraw(userInfo.amount.toString());
                }

                return { tx: await stakingContract.deposit(0) };
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

        const masterChiefContract = new ethersMulticall.Contract(masterChefAddress, masterChefABI);
        const [totalPools] = await multicall.all([masterChiefContract.poolLength()]);
        const poolsIndex = Array.from(new Array(totalPools.toNumber()).keys());
        const poolsInfo = await multicall.all(poolsIndex.map((poolIndex) => masterChiefContract.poolInfo(poolIndex)));
        const poolsStakingTokensSymbol = await multicall.all(
          poolsInfo.map(({ lpToken }) => new ethersMulticall.Contract(lpToken, ethereum.abi.ERC20ABI).symbol())
        );

        const uniswapLiquidityPools = await Promise.all(
          poolsInfo.map(async (info, index) => {
            const stakingTokenSymbol = poolsStakingTokensSymbol[index];
            const isPair = stakingTokenSymbol === 'APE-LP';

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
              autorestakeAdapter: isPair ? 'MasterChefLpRestake' : 'MasterChefSingleRestake',
              adapters: isPair ? ['masterChefPair'] : ['masterChefSingle'],
            };
            if (isPair) {
              automate.buyLiquidity = {
                router: '0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7',
                pair: info.lpToken,
              };
            }

            return {
              poolIndex: index,
              stakingToken: info.lpToken,
              name: isPair ? `${token0Symbol}-${token1Symbol}` : stakingTokenSymbol,
              address: info.lpToken,
              blockchain: 'ethereum',
              network: '56',
              layout: 'staking',
              adapter: isPair ? 'masterChefPair' : 'masterChefSingle',
              description: '',
              automate,
              link: 'https://apeswap.finance/farms',
            };
          })
        );
        if (options.cacheAuth) {
          cache.write(
            options.cacheAuth,
            'bscApeSwap',
            'masterChefPools',
            uniswapLiquidityPools.map(({ poolIndex, stakingToken, adapter }) => ({
              index: poolIndex,
              stakingToken,
              type: adapter === 'masterChefPair' ? 'lp' : 'single',
            }))
          );
        }

        const poolsJsonRaw = (await axios.get('http://api.apeswap.finance/stats')).data.incentivizedPools.filter(
          (v) => {
            return !uniswapLiquidityPools.some((pool) => v.address === pool.address) && v.active;
          }
        );

        const poolsApeReward = poolsJsonRaw.map(({ address, name, rewardTokenSymbol, stakedTokenAddress }) => ({
          poolIndex: 0,
          stakingToken: stakedTokenAddress,
          name: `${name}-${rewardTokenSymbol}`,
          address,
          blockchain: 'ethereum',
          network: '56',
          layout: 'staking',
          adapter: 'apeRewardV4',
          description: '',
          automate: {
            autorestakeAdapter: 'ApeRewardV4Restake',
            adapters: ['apeRewardV4'],
          },
          link: 'https://apeswap.finance/pools',
        }));

        return [...uniswapLiquidityPools, ...poolsApeReward];
      },
    },
    deploy: {
      MasterChefLpRestake: async (signer, factoryAddress, prototypeAddress, contractAddress = undefined) => {
        const masterChefSavedPools = await cache.read('bscApeSwap', 'masterChefPools');
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
                    value: '0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7',
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
                  new ethers.utils.Interface(MasterChefLpRestakeABI).encodeFunctionData('init', [
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
      MasterChefSingleRestake: async (signer, factoryAddress, prototypeAddress, contractAddress = undefined) => {
        const masterChefSavedPools = await cache.read('bscApeSwap', 'masterChefPools');
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
                    value: '0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7',
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
                  new ethers.utils.Interface(MasterChefSingleRestakeABI).encodeFunctionData('init', [
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
      ApeRewardV4Restake: async (signer, factoryAddress, prototypeAddress, contractAddress = undefined) => {
        const stakingContracts = await cache.read('bscApeSwap', 'apeRewardContracts');
        const stakingContract = contractAddress ?? stakingContracts[0].stakingContract;

        return {
          deploy: [
            AutomateActions.tab(
              'Deploy',
              async () => ({
                description: 'Deploy your own contract',
                inputs: [
                  AutomateActions.input({
                    placeholder: 'Liquidity pool router address',
                    value: '0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7',
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
              async (router, slippage, deadline) => {
                if (slippage < 0 || slippage > 100) return new Error('Invalid slippage percent');
                if (deadline < 0) return new Error('Deadline has already passed');

                return true;
              },
              async (router, slippage, deadline) =>
                AutomateActions.ethereum.proxyDeploy(
                  signer,
                  factoryAddress,
                  prototypeAddress,
                  new ethers.utils.Interface(ApeRewardV4RestakeABI).encodeFunctionData('init', [
                    stakingContract,
                    router,
                    Math.floor(slippage * 100),
                    deadline,
                  ])
                )
            ),
          ],
        };
      },
    },
    MasterChefLpRestake: async (signer, contractAddress) => {
      const signerAddress = await signer.getAddress();
      const automate = new ethers.Contract(contractAddress, MasterChefLpRestakeABI, signer);
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
            if (poolId === '0') {
              return {
                tx: await staking.leaveStaking(userInfo.amount.toString()),
              };
            } else {
              return {
                tx: await staking.withdraw(poolId, userInfo.amount.toString()),
              };
            }
          }
        ),
        ...deposit,
      ];
      const runParams = async () => {
        const provider = signer.provider || signer;
        const chainId = await provider.getNetwork().then(({ chainId }) => chainId);
        const multicall = new ethersMulticall.Provider(signer, chainId);
        const automateMulticall = new ethersMulticall.Contract(contractAddress, MasterChefLpRestakeABI);
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
        const pendingReward = await staking.pendingCake(poolId, contractAddress).then((v) => v.toString());

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
    MasterChefSingleRestake: async (signer, contractAddress) => {
      const signerAddress = await signer.getAddress();
      const automate = new ethers.Contract(contractAddress, MasterChefSingleRestakeABI, signer);
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
            if (poolId === '0') {
              return {
                tx: await staking.leaveStaking(userInfo.amount.toString()),
              };
            } else {
              return {
                tx: await staking.withdraw(poolId, userInfo.amount.toString()),
              };
            }
          }
        ),
        ...deposit,
      ];
      const runParams = async () => {
        const provider = signer.provider || signer;
        const chainId = await provider.getNetwork().then(({ chainId }) => chainId);
        const multicall = new ethersMulticall.Provider(signer, chainId);
        const automateMulticall = new ethersMulticall.Contract(contractAddress, MasterChefSingleRestakeABI);

        const [routerAddress, slippagePercent, deadlineSeconds, rewardTokenAddress] = await multicall.all([
          automateMulticall.liquidityRouter(),
          automateMulticall.slippage(),
          automateMulticall.deadline(),
          automateMulticall.rewardToken(),
        ]);

        const rewardToken = new ethers.Contract(rewardTokenAddress, ethereum.abi.ERC20ABI, provider);
        const rewardTokenBalance = await rewardToken.balanceOf(contractAddress).then((v) => v.toString());
        const pendingReward = await staking.pendingCake(poolId, contractAddress).then((v) => v.toString());
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
    ApeRewardV4Restake: async (signer, contractAddress) => {
      const signerAddress = await signer.getAddress();
      const automate = new ethers.Contract(contractAddress, ApeRewardV4RestakeABI, signer);
      const stakingAddress = await automate.staking();
      const staking = new ethers.Contract(stakingAddress, apeRewardV4ABI, signer);
      const stakingTokenAddress = await automate.stakingToken();
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
            const userInfo = await staking.userInfo(signerAddress);
            if (new bn(userInfo.amount.toString()).lte(0))
              return new Error('Insufficient funds on the staking contract balance');

            return true;
          },
          async () => {
            const userInfo = await staking.userInfo(signerAddress);
            return {
              tx: await staking.withdraw(userInfo.amount.toString()),
            };
          }
        ),
        ...deposit,
      ];
      const runParams = async () => {
        const provider = signer.provider || signer;
        const chainId = await provider.getNetwork().then(({ chainId }) => chainId);
        const multicall = new ethersMulticall.Provider(signer, chainId);
        const automateMulticall = new ethersMulticall.Contract(contractAddress, ApeRewardV4RestakeABI);

        const [routerAddress, slippagePercent, deadlineSeconds, rewardTokenAddress] = await multicall.all([
          automateMulticall.liquidityRouter(),
          automateMulticall.slippage(),
          automateMulticall.deadline(),
          automateMulticall.rewardToken(),
        ]);

        const rewardToken = new ethers.Contract(rewardTokenAddress, ethereum.abi.ERC20ABI, provider);
        const rewardTokenBalance = await rewardToken.balanceOf(contractAddress).then((v) => v.toString());
        const pendingReward = await staking.pendingReward(contractAddress).then((v) => v.toString());
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
        contract: contractAddress,
        deposit,
        refund,
        migrate,
        runParams,
        run,
      };
    },
  },
};

module.exports = bscApeSwap;

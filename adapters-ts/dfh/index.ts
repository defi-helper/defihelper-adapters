import type {
  Signer,
  ContractTransaction,
  BigNumber as EthersBigNumber,
} from "ethers";
import { bignumber as bn, ethers, dayjs, ethersMulticall } from "../lib";
import { debug, debugo } from "../utils/base";
import * as ethereum from "../utils/ethereum/base";
import * as erc20 from "../utils/ethereum/erc20";
import * as uniswap from "../utils/ethereum/uniswap";
import { abi as BalanceABI } from "@defihelper/networks/abi/Balance.json";
import { abi as StoreABI } from "@defihelper/networks/abi/StoreV2.json";
import { abi as StorageABI } from "@defihelper/networks/abi/Storage.json";
import { abi as LPTokensManagerABI } from "@defihelper/networks/abi/LPTokensManager.json";
import { abi as SmartTradeRouterABI } from "@defihelper/networks/abi/SmartTradeRouter.json";
import { abi as SmartTradeSwapHandlerABI } from "@defihelper/networks/abi/SmartTradeSwapHandler.json";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const routeTokens: Record<number, string[] | undefined> = {
  1: ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"],
  56: ["0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"],
  137: ["0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"],
  1285: ["0x98878b06940ae243284ca214f92bb71a2b032b8a"],
  43114: ["0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7"],
};

module.exports = {
  store: async (signer: Signer, contractAddress: string) => {
    debugo({
      _prefix: "Adapter store",
      contractAddress,
    });
    if (!signer.provider) throw new Error("Provider not found");
    const provider = signer.provider;
    const signerAddress = await signer.getAddress();
    debug(`Signer address "${signerAddress}"`);
    const store = new ethers.Contract(contractAddress, StoreABI).connect(
      signer
    );

    return {
      name: "DFHStore",
      canBuy: async (product: number | string) => {
        debugo({ _prefix: "canBuy", product });
        const [price, balance] = await Promise.all([
          store.price(product).then(ethereum.toBN),
          provider.getBalance(signerAddress).then(ethereum.toBN),
        ]);
        debugo({
          _prefix: "canBuy",
          price,
          balance,
        });
        if (price.lte(0)) return new Error("Undefined product");
        if (price.multipliedBy(1.05).gt(balance)) {
          return new Error("Insufficient funds on the balance");
        }

        return true;
      },
      buy: async (product: number | string) => {
        debugo({ _prefix: "buy", product });
        const price = await store.price(product).then(ethereum.toBN);

        const buyTx = await store.buy(product, signerAddress, {
          value: price.multipliedBy(1.05).toFixed(0),
        });
        debugo({
          _prefix: "buy",
          buyTx: JSON.stringify(buyTx),
        });
        return {
          tx: buyTx,
        };
      },
    };
  },
  balance: async (signer: Signer, contractAddress: string) => {
    debugo({
      _prefix: "Adapter balance",
      contractAddress,
    });
    if (!signer.provider) throw new Error("Provider not found");
    const provider = signer.provider;
    const signerAddress = await signer.getAddress();
    debug(`Signer address "${signerAddress}"`);
    const balance = new ethers.Contract(contractAddress, BalanceABI).connect(
      signer
    );

    return {
      name: "DFHBalance",
      balance: async () => {
        const signerBalance = await balance
          .balanceOf(signerAddress)
          .then(ethereum.toBN);
        debugo({ _prefix: "balance", signerBalance });

        return signerBalance.div("1e18").toString(10);
      },
      netBalance: async () => {
        const signerNetBalance = await balance
          .netBalanceOf(signerAddress)
          .then(ethereum.toBN);
        debugo({ _prefix: "netBalance", signerNetBalance });

        return signerNetBalance.div("1e18").toString(10);
      },
      canDeposit: async (amount: string) => {
        debugo({ _prefix: "canDeposit", amount });
        const signerBalance = await provider
          .getBalance(signerAddress)
          .then(ethereum.toBN);
        debugo({
          _prefix: "canDeposit",
          signerBalance,
        });
        if (Number(amount) <= 0) {
          return new Error("Invalid amount");
        }
        if (
          signerBalance.lt(
            ethereum.toBN(amount).multipliedBy("1e18").toFixed(0)
          )
        ) {
          return new Error("Insufficient funds on wallet");
        }

        return true;
      },
      deposit: async (amount: string) => {
        debugo({ _prefix: "deposit", amount });
        const depositTx = await balance.deposit(signerAddress, {
          value: ethereum.toBN(amount).multipliedBy("1e18").toFixed(0),
        });
        debugo({
          _prefix: "deposit",
          depositTx: JSON.stringify(depositTx),
        });
        return {
          tx: depositTx,
        };
      },
      canRefund: async (amount: string) => {
        debugo({ _prefix: "canRefund", amount });
        const signerNetBalance = await balance
          .netBalanceOf(signerAddress)
          .then(ethereum.toBN);
        debugo({
          _prefix: "canRefund",
          signerNetBalance,
        });
        if (Number(amount) <= 0) {
          return new Error("Invalid amount");
        }
        if (
          signerNetBalance.lt(
            ethereum.toBN(amount).multipliedBy("1e18").toFixed(0)
          )
        ) {
          return new Error("Insufficient funds on balance");
        }

        return true;
      },
      refund: async (amount: string) => {
        debugo({ _prefix: "refund", amount });
        const refundTx = await balance.refund(
          ethereum.toBN(amount).multipliedBy("1e18").toFixed(0)
        );
        debugo({
          _prefix: "refund",
          depositTx: JSON.stringify(refundTx),
        });
        return {
          tx: refundTx,
        };
      },
    };
  },
  automates: {
    buyLiquidity: async (
      ethSigner: Signer,
      contractAddress: string,
      { router, pair }: { router: string; pair: string }
    ) => {
      debugo({
        _prefix: "Adapter buyLiquidity",
        contractAddress,
        router,
        pair,
      });
      const signer = new ethereum.Signer(ethSigner);
      const signerAddress = await signer.address;
      debug(`Signer address "${signerAddress}"`);
      const network = await signer.chainId;
      const multicall = await signer.multicall;
      const automate = signer.contract(LPTokensManagerABI, contractAddress);
      const storage = signer.contract(
        StorageABI,
        await automate.contract.info()
      );

      return {
        name: "DFHBuyLiquidity",
        methods: {
          fee: async () => {
            const fee = await automate.contract.fee().then(ethereum.toBN);
            debugo({ _prefix: "fee", fee });

            return {
              native: fee.div("1e18").toString(10),
              usd: "1",
            };
          },
          balanceOf: erc20.useBalanceOf({
            node: signer,
            account: signerAddress,
          }),
          isApproved: erc20.useIsApproved({
            node: signer,
            spender: signerAddress,
            recipient: automate.contract.address,
          }),
          approve: erc20.useApprove({
            signer,
            spender: signerAddress,
            recipient: automate.contract.address,
          }),
          canBuy: async (tokenAddress: string, amount: string) => {
            debugo({ _prefix: "canBuy", tokenAddress, amount });
            const token = erc20.multicallContract(tokenAddress);
            const [signerBalance, allowance, tokenDecimals, fee] =
              await multicall.all([
                token.balanceOf(signerAddress),
                token.allowance(signerAddress, contractAddress),
                token.decimals(),
                automate.multicall.fee(),
              ]);
            const feeBalance = await signer.provider
              .getBalance(signerAddress)
              .then(ethereum.toBN);
            debugo({
              _prefix: "canBuy",
              signerBalance,
              allowance,
              tokenDecimals,
              fee,
              feeBalance,
            });
            const amountInt = new bn(amount).multipliedBy(
              `1e${tokenDecimals.toString()}`
            );
            if (amountInt.lte(0)) return new Error("Invalid amount");
            if (amountInt.gt(signerBalance.toString()))
              return new Error("Insufficient funds on the balance");
            if (amountInt.gt(allowance.toString()))
              return new Error("Not approved");
            if (ethereum.toBN(fee).multipliedBy(1.05).gt(feeBalance)) {
              return new Error("Insufficient fee funds on the balance");
            }

            return true;
          },
          buy: async (
            tokenAddress: string,
            amount: string,
            slippage: number | string,
            deadlineSeconds: number = 300
          ) => {
            debugo({
              _prefix: "buy",
              tokenAddress,
              amount,
              slippage,
              deadlineSeconds,
            });
            const fee = await automate.contract.fee();
            const [inToken, pairInfo] = await Promise.all([
              erc20.SignedToken.fromAddress(signer, tokenAddress),
              uniswap.V2.pair.ConnectedPair.fromAddress(signer, pair),
            ]);
            const { token0, token1 } = await pairInfo.info;
            debugo({
              _prefix: "buy",
              token0: token0.address,
              token1: token1.address,
              fee,
            });

            const amountInt = inToken.amountFloat(amount);
            const outMinPercent = new bn(1).minus(new bn(slippage).div(100));
            let swap0 = { path: [tokenAddress, token0.address], outMin: "0" };
            if (tokenAddress.toLowerCase() !== token0.address.toLowerCase()) {
              const { path, amountOut } = await uniswap.V2.router.autoRoute(
                uniswap.V2.router.contract(signer.provider, router),
                amountInt.int.div(2).toFixed(0),
                tokenAddress,
                token0.address,
                routeTokens[network] ?? []
              );
              swap0 = {
                path,
                outMin: new bn(amountOut)
                  .multipliedBy(outMinPercent)
                  .toFixed(0),
              };
            }
            debugo({
              _prefix: "buy",
              swap0: JSON.stringify(swap0),
            });
            let swap1 = { path: [tokenAddress, token1.address], outMin: "0" };
            if (tokenAddress.toLowerCase() !== token1.address.toLowerCase()) {
              const { path, amountOut } = await uniswap.V2.router.autoRoute(
                uniswap.V2.router.contract(signer.provider, router),
                amountInt.int.minus(amountInt.int.div(2).toFixed(0)).toFixed(0),
                tokenAddress,
                token1.address,
                routeTokens[network] ?? []
              );
              swap1 = {
                path,
                outMin: new bn(amountOut)
                  .multipliedBy(outMinPercent)
                  .toFixed(0),
              };
            }
            debugo({
              _prefix: "buy",
              swap1: JSON.stringify(swap1),
            });

            const estimateGas =
              await automate.contract.estimateGas.buyLiquidity(
                amountInt.toFixed(),
                router,
                swap0,
                swap1,
                pair,
                dayjs().add(deadlineSeconds, "seconds").unix(),
                {
                  value: ethereum.toBN(fee).multipliedBy(1.05).toFixed(0),
                }
              );
            const gasLimit = ethereum
              .toBN(estimateGas)
              .multipliedBy(1.1)
              .toFixed(0);
            debugo({
              _prefix: "buy",
              estimateGas,
              gasLimit,
            });

            const buyTx = await automate.contract.buyLiquidity(
              amountInt.toFixed(),
              router,
              swap0,
              swap1,
              pair,
              dayjs().add(deadlineSeconds, "seconds").unix(),
              {
                value: ethereum.toBN(fee).multipliedBy(1.05).toFixed(0),
                gasLimit,
              }
            );
            debugo({
              _prefix: "buy",
              buyTx: JSON.stringify(buyTx),
            });
            return {
              tx: buyTx,
            };
          },
          balanceETHOf: ethereum.useBalanceOf({
            node: signer,
            account: signerAddress,
          }),
          canBuyETH: async (amount: string) => {
            debugo({ _prefix: "canBuyETH", amount });
            const fee = await automate.contract.fee().then(ethereum.toBN);
            const feeMultiplicator = 1.05;
            const gasLimit = 700000;
            const gasPrice = await signer.provider
              .getGasPrice()
              .then(ethereum.toBN);
            const signerBalance = await signer.provider
              .getBalance(signerAddress)
              .then(ethereum.toBN);
            const inToken = new erc20.Token("", "", 18); // Native token
            const amountInt = inToken.amountFloat(amount);
            const amountIntWithoutFees = amountInt
              .minus(inToken.amountInt(fee.multipliedBy(feeMultiplicator)))
              .minus(inToken.amountInt(gasPrice.multipliedBy(gasLimit)));
            debugo({
              _prefix: "canBuyETH",
              signerBalance,
              fee,
              gasLimit,
              gasPrice,
              amountInt,
              amountIntWithoutFees,
            });

            if (amountIntWithoutFees.int.lte(0)) {
              return new Error("Too little amount for pay fees");
            }
            if (amountInt.int.gt(signerBalance)) {
              return new Error("Insufficient funds on the balance");
            }

            return true;
          },
          buyETH: async (
            amount: string,
            slippage: number | string,
            deadlineSeconds: number = 300
          ) => {
            debugo({
              _prefix: "buyETH",
              amount,
              slippage,
              deadlineSeconds,
            });
            const fee = await automate.contract.fee().then(ethereum.toBN);
            const feeMultiplicator = 1.05;
            const gasLimit = 700000;
            const gasPrice = await signer.provider
              .getGasPrice()
              .then(ethereum.toBN);
            const inToken = new erc20.Token("", "", 18); // Native token
            const pairInfo = await uniswap.V2.pair.ConnectedPair.fromAddress(
              signer,
              pair
            );
            const wrapperAddress = await storage.contract.getAddress(
              ethers.utils.keccak256(
                ethers.utils.toUtf8Bytes("NativeWrapper:Contract")
              )
            );
            const { token0, token1 } = await pairInfo.info;
            const amountInt = inToken
              .amountFloat(amount)
              .minus(inToken.amountInt(fee.multipliedBy(feeMultiplicator)))
              .minus(inToken.amountInt(gasPrice.multipliedBy(gasLimit)));
            if (amountInt.int.lt(0)) {
              throw new Error("Too little amount for pay fees");
            }
            debugo({
              _prefix: "buyETH",
              wrapperAddress,
              token0: token0.address,
              token1: token1.address,
              fee,
              gasLimit,
              gasPrice,
              amountInt,
            });

            const outMinPercent = new bn(1).minus(new bn(slippage).div(100));
            let swap0 = { path: [wrapperAddress, token0.address], outMin: "0" };
            if (wrapperAddress.toLowerCase() !== token0.address.toLowerCase()) {
              const { path, amountOut } = await uniswap.V2.router.autoRoute(
                uniswap.V2.router.contract(signer.provider, router),
                amountInt.int.div(2).toFixed(0),
                wrapperAddress,
                token0.address,
                routeTokens[network] ?? []
              );
              swap0 = {
                path,
                outMin: new bn(amountOut)
                  .multipliedBy(outMinPercent)
                  .toFixed(0),
              };
            }
            debugo({
              _prefix: "buyETH",
              swap0: JSON.stringify(swap0),
            });
            let swap1 = { path: [wrapperAddress, token1.address], outMin: "0" };
            if (wrapperAddress.toLowerCase() !== token1.address.toLowerCase()) {
              const { path, amountOut } = await uniswap.V2.router.autoRoute(
                uniswap.V2.router.contract(signer.provider, router),
                amountInt.int.minus(amountInt.int.div(2).toFixed(0)).toFixed(0),
                wrapperAddress,
                token1.address,
                routeTokens[network] ?? []
              );
              swap1 = {
                path,
                outMin: new bn(amountOut)
                  .multipliedBy(outMinPercent)
                  .toFixed(0),
              };
            }
            debugo({
              _prefix: "buyETH",
              swap1: JSON.stringify(swap1),
            });

            const buyTx = await automate.contract.buyLiquidityETH(
              router,
              swap0,
              swap1,
              pair,
              dayjs().add(deadlineSeconds, "seconds").unix(),
              {
                value: amountInt.value
                  .plus(fee.multipliedBy(feeMultiplicator))
                  .toFixed(0),
                gasLimit,
                gasPrice: gasPrice.toFixed(0),
              }
            );
            debugo({
              _prefix: "buyETH",
              buyTx: JSON.stringify(buyTx),
            });
            return {
              tx: buyTx,
            };
          },
        },
      };
    },
    sellLiquidity: async (
      ethSigner: Signer,
      contractAddress: string,
      { router, pair }: { router: string; pair: string }
    ) => {
      debugo({
        _prefix: "Adapter sellLiquidity",
        contractAddress,
        router,
        pair,
      });
      const signer = new ethereum.Signer(ethSigner);
      const signerAddress = await signer.address;
      debug(`Signer address "${signerAddress}"`);
      const network = await signer.chainId;
      const multicall = await signer.multicall;
      const automate = signer.contract(LPTokensManagerABI, contractAddress);
      const storage = signer.contract(
        StorageABI,
        await automate.contract.info()
      );

      return {
        name: "DFHSellLiquidity",
        methods: {
          fee: async () => {
            const fee = await automate.contract.fee().then(ethereum.toBN);
            debugo({ _prefix: "fee", fee });

            return {
              native: fee.div("1e18").toString(10),
              usd: "1",
            };
          },
          balanceOf: erc20
            .useBalanceOf({ node: signer, account: signerAddress })
            .bind(null, pair),
          amountOut: async (tokenAddress: string, amount: string) => {
            if (tokenAddress === ZERO_ADDRESS) {
              tokenAddress = await storage.contract.getAddress(
                ethers.utils.keccak256(
                  ethers.utils.toUtf8Bytes("NativeWrapper:Contract")
                )
              );
            }
            debugo({
              _prefix: "amountOut",
              tokenAddress,
              amount,
            });
            const token = await erc20.ConnectedToken.fromAddress(
              signer,
              tokenAddress
            );
            const pairInfo = await uniswap.V2.pair.ConnectedPair.fromAddress(
              signer,
              pair
            );
            const { token0, token1 } = await pairInfo.info;
            const balance = await pairInfo.expandBalance(
              pairInfo.amountFloat(amount)
            );
            debugo({
              _prefix: "amountOut",
              token0: token0.address,
              token1: token1.address,
              token0Balance: balance.token0,
              token1Balance: balance.token1,
            });

            let token0AmountOut = token.amountInt(balance.token0.int);
            if (tokenAddress.toLowerCase() !== token0.address.toLowerCase()) {
              const { amountOut } = await uniswap.V2.router.autoRoute(
                uniswap.V2.router.contract(signer.provider, router),
                balance.token0.toFixed(),
                token0.address,
                tokenAddress,
                routeTokens[network] ?? []
              );
              token0AmountOut = token.amountInt(amountOut);
            }
            debugo({
              _prefix: "amountOut",
              token0AmountOut,
            });
            let token1AmountOut = token.amountInt(balance.token1.int);
            if (tokenAddress.toLowerCase() !== token1.address.toLowerCase()) {
              const { amountOut } = await uniswap.V2.router.autoRoute(
                uniswap.V2.router.contract(signer.provider, router),
                balance.token1.toFixed(),
                token1.address,
                tokenAddress,
                routeTokens[network] ?? []
              );
              token1AmountOut = token.amountInt(amountOut);
            }
            debugo({
              _prefix: "amountOut",
              token1AmountOut,
            });

            return token0AmountOut.plus(token1AmountOut).toString();
          },
          isApproved: erc20
            .useIsApproved({
              node: signer,
              spender: signerAddress,
              recipient: automate.contract.address,
            })
            .bind(null, pair),
          approve: erc20
            .useApprove({
              signer,
              spender: signerAddress,
              recipient: automate.contract.address,
            })
            .bind(null, pair),
          canSell: async (amount: string) => {
            debugo({ _prefix: "canSell", amount });
            const token = erc20.multicallContract(pair);
            const [signerBalance, allowance, tokenDecimals, fee] =
              await multicall.all([
                token.balanceOf(signerAddress),
                token.allowance(signerAddress, automate.contract.address),
                token.decimals(),
                automate.multicall.fee(),
              ]);
            const feeBalance = await signer.provider
              .getBalance(signerAddress)
              .then(ethereum.toBN);
            debugo({
              _prefix: "canSell",
              signerBalance,
              allowance,
              tokenDecimals,
              fee,
              feeBalance,
            });
            const amountInt = new bn(amount).multipliedBy(
              `1e${tokenDecimals.toString()}`
            );
            if (amountInt.lte(0)) return new Error("Invalid amount");
            if (amountInt.gt(signerBalance.toString()))
              return new Error("Insufficient funds on the balance");
            if (amountInt.gt(allowance.toString()))
              return new Error("Not approved");
            if (ethereum.toBN(fee).multipliedBy(1.05).gt(feeBalance)) {
              return new Error("Insufficient fee funds on the balance");
            }

            return true;
          },
          sell: async (
            tokenAddress: string,
            amount: string,
            slippage: number | string,
            deadlineSeconds: number = 300
          ) => {
            debugo({
              _prefix: "sell",
              tokenAddress,
              amount,
              slippage,
              deadlineSeconds,
            });
            const fee = await automate.contract.fee();
            const pairInfo = await uniswap.V2.pair.ConnectedPair.fromAddress(
              signer,
              pair
            );
            const { token0, token1 } = await pairInfo.info;
            debugo({
              _prefix: "sell",
              fee,
              token0: token0.address,
              token1: token1.address,
            });

            const balance = await pairInfo.expandBalance(
              pairInfo.amountFloat(amount)
            );
            debugo({
              _prefix: "sell",
              token0Balance: balance.token0,
              token1Balance: balance.token1,
            });
            const outMinPercent = new bn(1).minus(new bn(slippage).div(100));
            let swap0 = { path: [token0.address, tokenAddress], outMin: "0" };
            if (tokenAddress.toLowerCase() !== token0.address.toLowerCase()) {
              const { path, amountOut } = await uniswap.V2.router.autoRoute(
                uniswap.V2.router.contract(signer.provider, router),
                balance.token0.toFixed(),
                token0.address,
                tokenAddress,
                routeTokens[network] ?? []
              );
              swap0 = {
                path,
                outMin: new bn(amountOut)
                  .multipliedBy(outMinPercent)
                  .toFixed(0),
              };
            }
            debugo({
              _prefix: "sell",
              swap0: JSON.stringify(swap0),
            });
            let swap1 = { path: [token1.address, tokenAddress], outMin: "0" };
            if (tokenAddress.toLowerCase() !== token1.address.toLowerCase()) {
              const { path, amountOut } = await uniswap.V2.router.autoRoute(
                uniswap.V2.router.contract(signer.provider, router),
                balance.token1.toFixed(),
                token1.address,
                tokenAddress,
                routeTokens[network] ?? []
              );
              swap1 = {
                path,
                outMin: new bn(amountOut)
                  .multipliedBy(outMinPercent)
                  .toFixed(0),
              };
            }
            debugo({
              _prefix: "sell",
              swap1: JSON.stringify(swap1),
            });

            const estimateGas =
              await automate.contract.estimateGas.sellLiquidity(
                pairInfo.amountFloat(amount).toFixed(),
                router,
                swap0,
                swap1,
                pair,
                dayjs().add(deadlineSeconds, "seconds").unix(),
                {
                  value: ethereum.toBN(fee).multipliedBy(1.05).toFixed(0),
                }
              );
            const gasLimit = ethereum
              .toBN(estimateGas)
              .multipliedBy(1.1)
              .toFixed(0);
            debugo({
              _prefix: "sell",
              estimateGas,
              gasLimit,
            });

            const sellTx = await automate.contract.sellLiquidity(
              pairInfo.amountFloat(amount).toFixed(),
              router,
              swap0,
              swap1,
              pair,
              dayjs().add(deadlineSeconds, "seconds").unix(),
              {
                value: ethereum.toBN(fee).multipliedBy(1.05).toFixed(0),
                gasLimit,
              }
            );
            debugo({
              _prefix: "sell",
              sellTx: JSON.stringify(sellTx),
            });
            return {
              tx: sellTx,
            };
          },
          sellETH: async (
            amount: string,
            slippage: number | string,
            deadlineSeconds: number = 300
          ) => {
            debugo({
              _prefix: "sellETH",
              amount,
              slippage,
              deadlineSeconds,
            });
            const fee = await automate.contract.fee();
            const pairInfo = await uniswap.V2.pair.ConnectedPair.fromAddress(
              signer,
              pair
            );
            const wrapperAddress = await storage.contract.getAddress(
              ethers.utils.keccak256(
                ethers.utils.toUtf8Bytes("NativeWrapper:Contract")
              )
            );
            const { token0, token1 } = await pairInfo.info;
            debugo({
              _prefix: "sell",
              fee,
              wrapperAddress,
              token0: token0.address,
              token1: token1.address,
            });

            const balance = await pairInfo.expandBalance(
              pairInfo.amountFloat(amount)
            );
            debugo({
              _prefix: "sell",
              token0Balance: balance.token0,
              token1Balance: balance.token1,
            });
            const outMinPercent = new bn(1).minus(new bn(slippage).div(100));
            let swap0 = { path: [token0.address, wrapperAddress], outMin: "0" };
            if (wrapperAddress.toLowerCase() !== token0.address.toLowerCase()) {
              const { path, amountOut } = await uniswap.V2.router.autoRoute(
                uniswap.V2.router.contract(signer.provider, router),
                balance.token0.toFixed(),
                token0.address,
                wrapperAddress,
                routeTokens[network] ?? []
              );
              swap0 = {
                path,
                outMin: new bn(amountOut)
                  .multipliedBy(outMinPercent)
                  .toFixed(0),
              };
            }
            debugo({
              _prefix: "sell",
              swap0: JSON.stringify(swap0),
            });
            let swap1 = { path: [token1.address, wrapperAddress], outMin: "0" };
            if (wrapperAddress.toLowerCase() !== token1.address.toLowerCase()) {
              const { path, amountOut } = await uniswap.V2.router.autoRoute(
                uniswap.V2.router.contract(signer.provider, router),
                balance.token1.toFixed(),
                token1.address,
                wrapperAddress,
                routeTokens[network] ?? []
              );
              swap1 = {
                path,
                outMin: new bn(amountOut)
                  .multipliedBy(outMinPercent)
                  .toFixed(0),
              };
            }
            debugo({
              _prefix: "sellETH",
              swap1: JSON.stringify(swap1),
            });

            const estimateGas =
              await automate.contract.estimateGas.sellLiquidityETH(
                pairInfo.amountFloat(amount).toFixed(),
                router,
                swap0,
                swap1,
                pair,
                dayjs().add(deadlineSeconds, "seconds").unix(),
                {
                  value: ethereum.toBN(fee).multipliedBy(1.05).toFixed(0),
                }
              );
            const gasLimit = ethereum
              .toBN(estimateGas)
              .multipliedBy(1.1)
              .toFixed(0);
            debugo({
              _prefix: "sellETH",
              estimateGas,
              gasLimit,
            });

            const sellTx = await automate.contract.sellLiquidityETH(
              pairInfo.amountFloat(amount).toFixed(),
              router,
              swap0,
              swap1,
              pair,
              dayjs().add(deadlineSeconds, "seconds").unix(),
              {
                value: ethereum.toBN(fee).multipliedBy(1.05).toFixed(0),
                gasLimit,
              }
            );
            debugo({
              _prefix: "sellETH",
              sellTx: JSON.stringify(sellTx),
            });
            return {
              tx: sellTx,
            };
          },
        },
      };
    },
    smartTrade: {
      router: async (ethSigner: Signer, contractAddress: string) => {
        debugo({
          _prefix: "Adapter smartTradeRouter",
          contractAddress,
        });
        const signer = new ethereum.Signer(ethSigner);
        const signerAddress = await signer.address;
        debug(`Signer address "${signerAddress}"`);
        const multicall = await signer.multicall;
        const router = signer.contract(SmartTradeRouterABI, contractAddress);

        return {
          name: "DFHSmartTradeRouter",
          methods: {
            fee: async () => {
              const fee = await router.contract.fee().then(ethereum.toBN);
              debugo({ _prefix: "fee", fee });

              return fee.div("1e18").toString(10);
            },
            order: async (id: number | string) => {
              const order = await router.contract.order(id);
              debugo({ _prefix: "order", id, order });

              return {
                id: order.id.toString(),
                owner: order.owner,
                status: order.status.toString(),
                handler: order.handler,
                callData: order.callData,
              };
            },
            balanceOf: erc20.useBalanceOf({
              node: signer,
              account: signerAddress,
            }),
            depositBalanceOf: async (tokenAddress: string) => {
              debugo({ _prefix: "depositBalanceOf", tokenAddress });
              const token = erc20.multicallContract(tokenAddress);
              const [balance, tokenDecimals] = await multicall.all([
                router.multicall.balanceOf(signerAddress, tokenAddress),
                token.decimals(),
              ]);
              debugo({ _prefix: "depositBalanceOf", balance, tokenDecimals });

              return ethereum
                .toBN(balance)
                .div(`1e${tokenDecimals.toString()}`)
                .toString(10);
            },
            isApproved: erc20.useIsApproved({
              node: signer,
              spender: signerAddress,
              recipient: router.contract.address,
            }),
            approve: erc20.useApprove({
              signer,
              spender: signerAddress,
              recipient: router.contract.address,
            }),
            canDeposit: async (
              orderId: string,
              deposit: Array<{ token: string; amount: string }>
            ) => {
              debugo({
                _prefix: "canDeposit",
                deposit: JSON.stringify(deposit),
              });
              return deposit.reduce<Promise<true | Error>>(
                async (prev, { token: tokenAddress, amount }) => {
                  const res = await prev;
                  if (res instanceof Error) return res;

                  const token = erc20.multicallContract(tokenAddress);
                  const [signerBalance, allowance, tokenDecimals, order] =
                    await multicall.all([
                      token.balanceOf(signerAddress),
                      token.allowance(signerAddress, router.contract.address),
                      token.decimals(),
                      router.multicall.order(orderId),
                    ]);
                  debugo({
                    _prefix: "canDeposit",
                    signerBalance,
                    allowance,
                    tokenDecimals,
                    order: JSON.stringify(order),
                  });
                  if (order.owner === ZERO_ADDRESS) {
                    return new Error("Order not found");
                  }
                  const amountInt = new bn(amount).multipliedBy(
                    `1e${tokenDecimals.toString()}`
                  );
                  if (amountInt.lte(0)) return new Error("Invalid amount");
                  if (amountInt.gt(signerBalance.toString()))
                    return new Error("Insufficient funds on the balance");
                  if (amountInt.gt(allowance.toString()))
                    return new Error("Not approved");

                  return true;
                },
                Promise.resolve(true)
              );
            },
            deposit: async (
              orderId: string,
              deposit: Array<{ token: string; amount: string }>
            ) => {
              debugo({
                _prefix: "deposit",
                orderId,
                deposit: JSON.stringify(deposit),
              });
              const tokens = deposit.map(({ token }) => token);
              const amounts = await Promise.all(
                deposit.map(async ({ token: tokenAddress, amount }) => {
                  const token = await erc20.ConnectedToken.fromAddress(
                    signer,
                    tokenAddress
                  );
                  return token.amountFloat(amount).toFixed();
                })
              );
              debugo({
                _prefix: "deposit",
                tokens,
                amounts,
              });
              const depositTx = await router.contract.deposit(
                orderId,
                tokens,
                amounts
              );
              debugo({
                _prefix: "deposit",
                depositTx: JSON.stringify(depositTx),
              });
              return {
                tx: depositTx,
              };
            },
            canRefund: async (
              orderId: string,
              refund: Array<{ token: string; amount: string }>
            ) => {
              debugo({ _prefix: "canRefund", refund: JSON.stringify(refund) });
              return refund.reduce<Promise<true | Error>>(
                async (prev, { token: tokenAddress, amount }) => {
                  const res = await prev;
                  if (res instanceof Error) return res;

                  const token = erc20.multicallContract(tokenAddress);
                  const [depositBalance, tokenDecimals, order] =
                    await multicall.all([
                      router.multicall.balanceOf(signerAddress, tokenAddress),
                      token.decimals(),
                      router.multicall.order(orderId),
                    ]);
                  debugo({
                    _prefix: "canRefund",
                    depositBalance,
                    tokenDecimals,
                    order: JSON.stringify(order),
                  });
                  if (order.owner === ZERO_ADDRESS) {
                    return new Error("Order not found");
                  }
                  if (
                    ethereum
                      .toBN(depositBalance)
                      .lt(
                        ethereum
                          .toBN(amount)
                          .multipliedBy(`1e${tokenDecimals.toString()}`)
                          .toFixed(0)
                      )
                  ) {
                    return new Error("Insufficient funds on balance");
                  }

                  return true;
                },
                Promise.resolve(true)
              );
            },
            refund: async (
              orderId: string,
              refund: Array<{ token: string; amount: string }>
            ) => {
              debugo({
                _prefix: "refund",
                orderId,
                refund: JSON.stringify(refund),
              });
              const tokens = refund.map(({ token }) => token);
              const amounts = await Promise.all(
                refund.map(async ({ token: tokenAddress, amount }) => {
                  const token = await erc20.ConnectedToken.fromAddress(
                    signer,
                    tokenAddress
                  );
                  return amount === ""
                    ? await router.contract
                        .balanceOf(orderId, tokenAddress)
                        .then((v: EthersBigNumber) => v.toString())
                    : token.amountFloat(amount).toFixed();
                })
              );
              debugo({
                _prefix: "refund",
                tokens,
                amounts,
              });
              const refundTx = await router.contract.refund(
                orderId,
                tokens,
                amounts,
                signerAddress
              );
              debugo({
                _prefix: "refund",
                depositTx: JSON.stringify(refundTx),
              });
              return {
                tx: refundTx,
              };
            },
          },
        };
      },
      swapHandler: async (ethSigner: Signer, contractAddress: string) => {
        debugo({
          _prefix: "Adapter smartTradeSwapHandler",
          contractAddress,
        });
        const signer = new ethereum.Signer(ethSigner);
        const signerAddress = await signer.address;
        debug(`Signer address "${signerAddress}"`);
        const handler = signer.contract(
          SmartTradeSwapHandlerABI,
          contractAddress
        );
        const router = signer.contract(
          SmartTradeRouterABI,
          await handler.contract.router()
        );
        const useCreateRoute =
          (outToken: erc20.ConnectedToken) =>
          (
            amountOut: string,
            slippage: string | number,
            moving: boolean,
            direction: "gt" | "lt"
          ) => ({
            get amountOut() {
              return outToken.amountFloat(amountOut).toFixed();
            },
            get slippage() {
              return new bn(slippage).div(100).toString(10);
            },
            get amountOutMin() {
              return new bn(this.amountOut)
                .multipliedBy(new bn(1).minus(this.slippage))
                .toFixed(0);
            },
            moving,
            direction,
          });

        return {
          name: "DFHSmartTradeSwapHandler",
          methods: {
            amountOut: uniswap.V2.router.useAmountOut({ node: signer }),
            createOrder: async (
              exchangeAddress: string,
              path: string[],
              amountIn: string,
              stopLoss: {
                amountOut: string;
                slippage: string | number;
                moving: boolean;
              } | null,
              stopLoss2: {
                amountOut: string;
                slippage: string | number;
                moving: boolean;
              } | null,
              takeProfit: {
                amountOut: string;
                slippage: string | number;
              } | null,
              activate: {
                amountOut: string;
                direction: "gt" | "lt";
              } | null,
              deposit: {
                native?: string;
              } = {}
            ) => {
              debugo({
                _prefix: "createOrder",
                exchangeAddress,
                path,
                amountIn,
                stopLoss,
                stopLoss2,
                takeProfit,
                activate,
              });
              const [inToken, outToken] = await Promise.all([
                erc20.ConnectedToken.fromAddress(signer, path[0]),
                erc20.ConnectedToken.fromAddress(signer, path[path.length - 1]),
              ]);
              const pairAddress = await uniswap.V2.factory
                .contract(
                  signer.provider,
                  await uniswap.V2.router
                    .contract(signer.provider, exchangeAddress)
                    .factory()
                )
                .getPair(inToken.address, outToken.address);
              debugo({
                _prefix: "createOrder",
                inTokenDecimals: inToken.decimals,
                outTokenDecimals: outToken.decimals,
                pairAddress,
              });

              const createRoute = useCreateRoute(outToken);
              const routes = [
                stopLoss
                  ? createRoute(
                      stopLoss.amountOut,
                      stopLoss.slippage,
                      stopLoss.moving,
                      "lt"
                    )
                  : null,
                takeProfit
                  ? createRoute(
                      takeProfit.amountOut,
                      takeProfit.slippage,
                      false,
                      "gt"
                    )
                  : null,
                stopLoss2
                  ? createRoute(
                      stopLoss2.amountOut,
                      stopLoss2.slippage,
                      stopLoss2.moving,
                      "lt"
                    )
                  : null,
              ];
              debugo({
                _prefix: "createOrder",
                routes: JSON.stringify(routes),
              });

              const callData = await handler.contract.callDataEncode({
                exchange: exchangeAddress,
                amountIn: inToken.amountFloat(amountIn).toFixed(),
                path,
                amountOutMin: routes.map((route) => route?.amountOutMin ?? "0"),
              });
              debugo({
                _prefix: "createOrder",
                callData,
              });

              const depositToken: { tokens: string[]; amounts: string[] } = {
                tokens: [],
                amounts: [],
              };
              depositToken.tokens.push(path[0]);
              depositToken.amounts.push(
                inToken.amountFloat(amountIn).toFixed()
              );
              let nativeTokenValue = "0";
              if (deposit.native !== undefined) {
                nativeTokenValue = new bn(deposit.native)
                  .multipliedBy("1e18")
                  .toFixed(0);
              }
              debugo({
                _prefix: "createOrder",
                depositToken: JSON.stringify(depositToken),
                nativeTokenValue,
              });

              const createOrderTx: ContractTransaction =
                await router.contract.createOrder(
                  handler.contract.address,
                  callData,
                  depositToken.tokens,
                  depositToken.amounts,
                  { value: nativeTokenValue }
                );
              const orderParam = {
                exchange: exchangeAddress,
                pair: pairAddress,
                path,
                tokenInDecimals: inToken.decimals,
                tokenOutDecimals: outToken.decimals,
                amountIn: inToken.amountFloat(amountIn).toFixed(),
                amountOut: await uniswap.V2.router.getPrice(
                  uniswap.V2.router.contract(signer.provider, exchangeAddress),
                  inToken.amountFloat(amountIn).toFixed(),
                  path
                ),
                stopLoss: routes[0],
                takeProfit: routes[1],
                stopLoss2: routes[2],
                activate: activate
                  ? {
                      amountOut: outToken
                        .amountFloat(activate.amountOut)
                        .toFixed(),
                      direction: activate.direction,
                    }
                  : null,
              };
              debugo({
                _prefix: "createOrder",
                createOrderTx: JSON.stringify(createOrderTx),
                orderParam: JSON.stringify(orderParam),
              });
              return {
                tx: createOrderTx,
                handler: handler.contract.address,
                callDataRaw: callData,
                callData: orderParam,
                getOrderNumber: async () => {
                  const receipt = await createOrderTx.wait();
                  if (!receipt.events) return null;
                  const event = receipt.events.find(
                    (e) => e.event === "OrderCreated"
                  );
                  return event?.args?.id.toString() ?? null;
                },
              };
            },
            updateOrder: async (
              orderId: string,
              stopLoss: {
                amountOut: string;
                slippage: string | number;
                moving: boolean;
              } | null,
              stopLoss2: {
                amountOut: string;
                slippage: string | number;
                moving: boolean;
              } | null,
              takeProfit: {
                amountOut: string;
                slippage: string | number;
              } | null,
              activate: {
                amountOut: string;
                direction: "gt" | "lt";
              } | null
            ) => {
              debugo({
                _prefix: "updateOrder",
                orderId,
                stopLoss: JSON.stringify(stopLoss),
                takeProfit: JSON.stringify(takeProfit),
                activate: JSON.stringify(activate),
              });

              const callDataInterface = new ethers.utils.Interface(
                SmartTradeSwapHandlerABI
              ).functions[
                "callDataEncode((address,uint256,address[],uint256[]))"
              ];
              const params = callDataInterface.inputs[0].components
                .map(({ name, type }) => `${type} ${name}`)
                .join(", ");
              const orderState = await router.contract.order(orderId);
              const [state] = ethers.utils.defaultAbiCoder.decode(
                [`tuple(${params})`],
                orderState.callData
              );
              const { exchange, amountIn, path, amountOutMin } = state;
              debugo({
                _prefix: "updateOrder",
                exchange,
                amountIn: amountIn.toString(),
                path,
                amountOutMin: amountOutMin.map((v: EthersBigNumber) =>
                  v.toString()
                ),
              });

              const outToken = await erc20.ConnectedToken.fromAddress(
                signer,
                path[path.length - 1]
              );
              debugo({
                _prefix: "updateOrder",
                outTokenDecimals: outToken.decimals,
              });

              const createRoute = useCreateRoute(outToken);
              const routes = [
                stopLoss
                  ? createRoute(
                      stopLoss.amountOut,
                      stopLoss.slippage,
                      stopLoss.moving,
                      "lt"
                    )
                  : null,
                takeProfit
                  ? createRoute(
                      takeProfit.amountOut,
                      takeProfit.slippage,
                      false,
                      "gt"
                    )
                  : null,
                stopLoss2
                  ? createRoute(
                      stopLoss2.amountOut,
                      stopLoss2.slippage,
                      stopLoss2.moving,
                      "lt"
                    )
                  : null,
              ];
              debugo({
                _prefix: "updateOrder",
                routes: JSON.stringify(routes),
              });

              const callData = await handler.contract.callDataEncode({
                exchange,
                amountIn: amountIn.toString(),
                path,
                amountOutMin: routes.map((route) => route?.amountOutMin ?? "0"),
              });
              debugo({
                _prefix: "updateOrder",
                callData,
              });
              const updateOrderTx: ContractTransaction =
                await router.contract.updateOrder(orderId, callData);

              const orderParam = {
                amountOut: await uniswap.V2.router.getPrice(
                  uniswap.V2.router.contract(signer.provider, exchange),
                  amountIn,
                  path
                ),
                stopLoss: routes[0],
                takeProfit: routes[1],
                stopLoss2: routes[2],
                activate: activate
                  ? {
                      amountOut: outToken
                        .amountFloat(activate.amountOut)
                        .toFixed(),
                      direction: activate.direction,
                    }
                  : null,
              };
              debugo({
                _prefix: "createOrder",
                updateOrderTx: JSON.stringify(updateOrderTx),
                orderParam: JSON.stringify(orderParam),
              });
              return {
                tx: updateOrderTx,
                callDataRaw: callData,
                callData: orderParam,
              };
            },
            canCancelOrder: async (id: number | string) => {
              debugo({ _prefix: "canCancelOrder", id });
              const order = await router.contract.order(id);
              debugo({
                _prefix: "canCancelOrder",
                id: order.id.toString(),
                owner: order.owner,
                status: order.status.toString(),
                handler: order.handler,
                callData: order.callData,
              });
              if (order.owner.toLowerCase() === ZERO_ADDRESS) {
                return new Error("Order not found");
              }
              if (order.owner.toLowerCase() !== signerAddress.toLowerCase()) {
                return new Error("Forbidden");
              }
              if (order.status.toString() !== "0") {
                return new Error("Order already processed");
              }

              return true;
            },
            cancelOrder: async (id: number | string) => {
              debugo({ _prefix: "cancelOrder", id });
              const order = await router.contract.order(id);
              const callDataEncodeInterface =
                handler.contract.interface.functions[
                  "callDataEncode((address,uint256,address[],uint256[]))"
                ].inputs[0].components.map(
                  ({ name, type }) => `${type} ${name}`
                );
              const [{ path }] = ethers.utils.defaultAbiCoder.decode(
                [`tuple(${callDataEncodeInterface.join(", ")})`],
                order.callData
              );
              debugo({
                _prefix: "cancelOrder",
                path,
              });

              const cancelOrderTx = await router.contract.cancelOrder(id, path);
              debugo({
                _prefix: "cancelOrder",
                cancelOrderTx: JSON.stringify(cancelOrderTx),
              });
              return {
                tx: cancelOrderTx,
              };
            },
            emergencyHandleOrder: async (
              id: number | string,
              deadline: Date
            ) => {
              debugo({
                _prefix: "emergencyHandleOrder",
                id,
                deadline,
              });

              const callOptions = await handler.contract.callOptionsEncode({
                route: 0,
                amountOutMin: 0,
                deadline: dayjs(deadline).unix(),
                emergency: true,
              });
              debugo({
                _prefix: "emergencyHandleOrder",
                callOptions,
              });

              const handleTx = await router.contract.handleOrder(
                id,
                callOptions,
                0
              );
              debugo({
                _prefix: "emergencyHandleOrder",
                handleTx: JSON.stringify(handleTx),
              });

              return {
                tx: handleTx,
              };
            },
          },
        };
      },
    },
  },
};

import type { Signer } from "ethers";
import { bignumber as bn, ethers, dayjs, ethersMulticall } from "../lib";
import { debug, debugo } from "../utils/base";
import * as ethereum from "../utils/ethereum/base";
import * as erc20 from "../utils/ethereum/erc20";
import * as uniswap from "../utils/ethereum/uniswap";
import LPTokensManagerABI from "./data/LPTokensManagerABI.json";
import StoreABI from "./data/StoreV2ABI.json";
import BalanceABI from "./data/BalanceABI.json";

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
        const signerBalance = balance
          .balanceOf(signerAddress)
          .then(ethereum.toBN);
        debugo({ _prefix: "balance", signerBalance });

        return signerBalance.div("1e18").toString(10);
      },
      netBalance: async () => {
        const signerNetBalance = balance
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
      signer: Signer,
      contractAddress: string,
      { router, pair }: { router: string; pair: string }
    ) => {
      debugo({
        _prefix: "Adapter buyLiquidity",
        contractAddress,
        router,
        pair,
      });
      if (!signer.provider) throw new Error("Provider not found");
      const provider = signer.provider;
      const signerAddress = await signer.getAddress();
      debug(`Signer address "${signerAddress}"`);
      const network = await signer
        .getChainId()
        .then((v) => Number(v.toString()));
      const automate = new ethers.Contract(
        contractAddress,
        LPTokensManagerABI
      ).connect(signer);
      const automateMulticall =
        ethereum.multicallContract(LPTokensManagerABI)(contractAddress);
      const multicall = new ethersMulticall.Provider(provider);
      await multicall.init();

      return {
        name: "DFHBuyLiquidity",
        methods: {
          fee: async () => {
            const fee = await automate.fee().then(ethereum.toBN);
            debugo({ _prefix: "fee", fee });

            return {
              native: fee.div("1e18").toString(10),
              usd: "1",
            };
          },
          balanceOf: async (tokenAddress: string) => {
            debugo({ _prefix: "balanceOf", tokenAddress });
            const token = erc20.multicallContract(tokenAddress);
            const [balance, tokenDecimals] = await multicall.all([
              token.balanceOf(signerAddress),
              token.decimals(),
            ]);
            debugo({ _prefix: "balanceOf", balance, tokenDecimals });

            return ethereum
              .toBN(balance)
              .div(`1e${tokenDecimals.toString()}`)
              .toString(10);
          },
          isApproved: async (tokenAddress: string, amount: string) => {
            debugo({ _prefix: "isApproved", tokenAddress, amount });
            if (new bn(amount).lte(0)) return new Error("Invalid amount");

            const token = erc20.multicallContract(tokenAddress);
            const [allowance, tokenDecimals] = await multicall.all([
              token.allowance(signerAddress, contractAddress),
              token.decimals(),
            ]);
            debugo({ _prefix: "isApproved", allowance, tokenDecimals });

            return new bn(amount)
              .multipliedBy(`1e${tokenDecimals.toString()}`)
              .lte(ethereum.toBN(allowance));
          },
          approve: async (tokenAddress: string, amount: string) => {
            debugo({ _prefix: "approve", tokenAddress, amount });
            const tokenMulticall = erc20.multicallContract(tokenAddress);
            const token = erc20.contract(signer, tokenAddress);
            const [allowance, tokenDecimals] = await multicall.all([
              tokenMulticall.allowance(signerAddress, contractAddress),
              tokenMulticall.decimals(),
            ]);
            debugo({ _prefix: "approve", allowance, tokenDecimals });

            const amountInt = new bn(amount).multipliedBy(
              `1e${tokenDecimals.toString()}`
            );
            if (amountInt.gt(allowance.toString())) {
              if (ethereum.toBN(allowance).gt(0)) {
                debug("approve: reset allowance value");
                const resetApproveTx = await token.approve(contractAddress, 0);
                await resetApproveTx.wait();
                debugo({
                  _prefix: "approve",
                  resetApproveTx: JSON.stringify(resetApproveTx),
                });
              }

              debug("approve: approve max allowance value");
              const approveTx = await token.approve(
                contractAddress,
                new bn(2).pow(256).minus(1).toFixed(0)
              );
              debugo({
                _prefix: "approve",
                approveTx: JSON.stringify(approveTx),
              });
              return {
                tx: approveTx,
              };
            }

            debug("approve: skip approve");
            return {};
          },
          canBuy: async (tokenAddress: string, amount: string) => {
            debugo({ _prefix: "canBuy", tokenAddress, amount });
            const token = erc20.multicallContract(tokenAddress);
            const [signerBalance, allowance, tokenDecimals, fee] =
              await multicall.all([
                token.balanceOf(signerAddress),
                token.allowance(signerAddress, contractAddress),
                token.decimals(),
                automateMulticall.fee(),
              ]);
            const feeBalance = await provider
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
            const pairMulticall = uniswap.V2.pair.multicallContract(pair);
            const [tokenDecimals, token0, token1, fee] = await multicall.all([
              erc20.multicallContract(tokenAddress).decimals(),
              pairMulticall.token0(),
              pairMulticall.token1(),
              automateMulticall.fee(),
            ]);
            debugo({
              _prefix: "buy",
              tokenDecimals,
              token0,
              token1,
              fee,
            });

            const amountInt = new bn(amount).multipliedBy(
              `1e${tokenDecimals.toString()}`
            );
            const outMinPercent = new bn(1).minus(new bn(slippage).div(100));
            let swap0 = { path: [tokenAddress, token0], outMin: "0" };
            if (tokenAddress.toLowerCase() !== token0.toLowerCase()) {
              const { path, amountOut } = await uniswap.V2.router.autoRoute(
                uniswap.V2.router.contract(provider, router),
                amountInt.div(2).toFixed(0),
                tokenAddress,
                token0,
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
            let swap1 = { path: [tokenAddress, token1], outMin: "0" };
            if (tokenAddress.toLowerCase() !== token1.toLowerCase()) {
              const { path, amountOut } = await uniswap.V2.router.autoRoute(
                uniswap.V2.router.contract(provider, router),
                amountInt.minus(amountInt.div(2).toFixed(0)).toFixed(0),
                tokenAddress,
                token1,
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

            const buyTx = await automate.buyLiquidity(
              amountInt.toFixed(0),
              router,
              swap0,
              swap1,
              pair,
              dayjs().add(deadlineSeconds, "seconds").unix(),
              {
                value: ethereum.toBN(fee).multipliedBy(1.05).toFixed(0),
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
        },
      };
    },
    sellLiquidity: async (
      signer: Signer,
      contractAddress: string,
      { router, pair }: { router: string; pair: string }
    ) => {
      debugo({
        _prefix: "Adapter sellLiquidity",
        contractAddress,
        router,
        pair,
      });
      if (!signer.provider) throw new Error("Provider not found");
      const provider = signer.provider;
      const signerAddress = await signer.getAddress();
      debug(`Signer address "${signerAddress}"`);
      const network = await signer
        .getChainId()
        .then((v) => Number(v.toString()));
      const automate = new ethers.Contract(
        contractAddress,
        LPTokensManagerABI
      ).connect(signer);
      const automateMulticall =
        ethereum.multicallContract(LPTokensManagerABI)(contractAddress);
      const multicall = new ethersMulticall.Provider(provider);
      await multicall.init();

      return {
        name: "DFHSellLiquidity",
        methods: {
          fee: async () => {
            const fee = await automate.fee().then(ethereum.toBN);
            debugo({ _prefix: "fee", fee });

            return {
              native: fee.div("1e18").toString(10),
              usd: "1",
            };
          },
          balanceOf: async () => {
            const token = erc20.multicallContract(pair);
            const [balance, tokenDecimals] = await multicall.all([
              token.balanceOf(signerAddress),
              token.decimals(),
            ]);
            debugo({ _prefix: "balanceOf", balance, tokenDecimals });

            return ethereum
              .toBN(balance)
              .div(`1e${tokenDecimals.toString()}`)
              .toString(10);
          },
          isApproved: async (amount: string) => {
            debugo({ _prefix: "isApproved", amount });
            if (new bn(amount).lte(0)) return new Error("Invalid amount");

            const token = erc20.multicallContract(pair);
            const [allowance, tokenDecimals] = await multicall.all([
              token.allowance(signerAddress, contractAddress),
              token.decimals(),
            ]);
            debugo({ _prefix: "isApproved", allowance, tokenDecimals });

            return new bn(amount)
              .multipliedBy(`1e${tokenDecimals.toString()}`)
              .lte(ethereum.toBN(allowance));
          },
          approve: async (amount: string) => {
            debugo({ _prefix: "approve", amount });
            const tokenMulticall = erc20.multicallContract(pair);
            const token = erc20.contract(signer, pair);
            const [allowance, tokenDecimals] = await multicall.all([
              tokenMulticall.allowance(signerAddress, contractAddress),
              tokenMulticall.decimals(),
            ]);
            debugo({ _prefix: "approve", allowance, tokenDecimals });

            const amountInt = new bn(amount).multipliedBy(
              `1e${tokenDecimals.toString()}`
            );
            if (amountInt.gt(allowance.toString())) {
              if (ethereum.toBN(allowance).gt(0)) {
                debug(`approve: reset allowance value`);
                const resetApproveTx = await token.approve(contractAddress, 0);
                await resetApproveTx.wait();
                debugo({
                  _prefix: "approve",
                  resetApproveTx: JSON.stringify(resetApproveTx),
                });
              }

              debug(`approve: approve max allowance value`);
              const approveTx = await token.approve(
                contractAddress,
                new bn(2).pow(256).minus(1).toFixed(0)
              );
              debugo({
                _prefix: "approve",
                approveTx: JSON.stringify(approveTx),
              });
              return {
                tx: approveTx,
              };
            }

            debug("approve: skip approve");
            return {};
          },
          amountOut: async (tokenAddress: string, amount: string) => {
            debugo({
              _prefix: "amountOut",
              tokenAddress,
              amount,
            });
            const pairInfo = await uniswap.V2.pair.PairInfo.create(
              multicall,
              pair,
              {
                signer,
                blockNumber: "latest",
              }
            );
            const { token0, token1 } = pairInfo;
            const balance = pairInfo.expandBalance(amount);
            debugo({
              _prefix: "amountOut",
              token0,
              token1,
              token0Balance: balance.token0,
              token1Balance: balance.token1,
            });

            let token0AmountOut = new bn(balance.token0);
            if (tokenAddress.toLowerCase() !== token0.toLowerCase()) {
              const { amountOut } = await uniswap.V2.router.autoRoute(
                uniswap.V2.router.contract(provider, router),
                new bn(balance.token0)
                  .multipliedBy(`1e${pairInfo.token0Decimals}`)
                  .toFixed(0),
                token0,
                tokenAddress,
                routeTokens[network] ?? []
              );
              token0AmountOut = new bn(amountOut);
            }
            debugo({
              _prefix: "amountOut",
              token0AmountOut,
            });
            let token1AmountOut = new bn(balance.token1);
            if (tokenAddress.toLowerCase() !== token1.toLowerCase()) {
              const { amountOut } = await uniswap.V2.router.autoRoute(
                uniswap.V2.router.contract(provider, router),
                new bn(balance.token1)
                  .multipliedBy(`1e${pairInfo.token1Decimals}`)
                  .toFixed(0),
                token1,
                tokenAddress,
                routeTokens[network] ?? []
              );
              token1AmountOut = new bn(amountOut);
            }
            debugo({
              _prefix: "amountOut",
              token1AmountOut,
            });

            const tokenDecimals = uniswap.V2.pair
              .contract(provider, pair)
              .decimals();

            return token0AmountOut
              .plus(token1AmountOut)
              .div(`1e${tokenDecimals}`)
              .toString(10);
          },
          canSell: async (amount: string) => {
            debugo({ _prefix: "canSell", amount });
            const token = erc20.multicallContract(pair);
            const [signerBalance, allowance, tokenDecimals, fee] =
              await multicall.all([
                token.balanceOf(signerAddress),
                token.allowance(signerAddress, contractAddress),
                token.decimals(),
                automateMulticall.fee(),
              ]);
            const feeBalance = await provider
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
            const [pairDecimals, fee] = await multicall.all([
              uniswap.V2.pair.multicallContract(pair).decimals(),
              automateMulticall.fee(),
            ]);
            const pairInfo = await uniswap.V2.pair.PairInfo.create(
              multicall,
              pair,
              {
                signer,
                blockNumber: "latest",
              }
            );
            const { token0, token1 } = pairInfo;
            debugo({
              _prefix: "sell",
              pairDecimals,
              fee,
              token0,
              token1,
            });

            const balance = pairInfo.expandBalance(amount);
            debugo({
              _prefix: "sell",
              token0Balance: balance.token0,
              token1Balance: balance.token1,
            });
            const outMinPercent = new bn(1).minus(new bn(slippage).div(100));
            let swap0 = { path: [token0, tokenAddress], outMin: "0" };
            if (tokenAddress.toLowerCase() !== token0.toLowerCase()) {
              const { path, amountOut } = await uniswap.V2.router.autoRoute(
                uniswap.V2.router.contract(provider, router),
                new bn(balance.token0)
                  .multipliedBy(`1e${pairInfo.token0Decimals}`)
                  .toFixed(0),
                token0,
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
              _prefix: "buy",
              swap0: JSON.stringify(swap0),
            });
            let swap1 = { path: [token1, tokenAddress], outMin: "0" };
            if (tokenAddress.toLowerCase() !== token1.toLowerCase()) {
              const { path, amountOut } = await uniswap.V2.router.autoRoute(
                uniswap.V2.router.contract(provider, router),
                new bn(balance.token1)
                  .multipliedBy(`1e${pairInfo.token1Decimals}`)
                  .toFixed(0),
                token1,
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
              _prefix: "buy",
              swap1: JSON.stringify(swap1),
            });

            const sellTx = await automate.sellLiquidity(
              new bn(amount)
                .multipliedBy(`1e${pairDecimals.toString()}`)
                .toFixed(0),
              router,
              swap0,
              swap1,
              pair,
              dayjs().add(deadlineSeconds, "seconds").unix(),
              {
                value: ethereum.toBN(fee).multipliedBy(1.05).toFixed(0),
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
        },
      };
    },
  },
};

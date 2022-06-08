import type { Signer } from "ethers";
import { bignumber as bn, ethers, dayjs, ethersMulticall } from "../lib";
import * as ethereum from "../utils/ethereum/base";
import * as erc20 from "../utils/ethereum/erc20";
import * as uniswap from "../utils/ethereum/uniswap";
import BuyLiquidityABI from "./data/BuyLiquidityABI.json";

const routeTokens: Record<number, string[] | undefined> = {
  1: ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"],
  56: ["0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"],
  137: ["0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"],
  1285: ["0x98878b06940ae243284ca214f92bb71a2b032b8a"],
  43114: ["0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7"],
};

module.exports = {
  automates: {
    buyLiquidity: async (
      signer: Signer,
      contractAddress: string,
      { router, pair }: { router: string; pair: string }
    ) => {
      if (!signer.provider) throw new Error("Provider not found");
      const provider = signer.provider;
      const signerAddress = await signer.getAddress();
      const network = await signer
        .getChainId()
        .then((v) => Number(v.toString()));
      const automate = new ethers.Contract(
        contractAddress,
        BuyLiquidityABI
      ).connect(signer);
      const automateMulticall =
        ethereum.multicallContract(BuyLiquidityABI)(contractAddress);
      const multicall = new ethersMulticall.Provider(provider);
      await multicall.init();

      return {
        name: "DFHBuyLiquidity",
        methods: {
          balanceOf: async (tokenAddress: string) => {
            const token = erc20.multicallContract(tokenAddress);
            const [balance, tokenDecimals] = await multicall.all([
              token.balanceOf(signerAddress),
              token.decimals(),
            ]);

            return ethereum
              .toBN(balance)
              .div(`1e${tokenDecimals.toString()}`)
              .toString(10);
          },
          isApproved: async (tokenAddress: string, amount: string) => {
            if (new bn(amount).lte(0)) return new Error("Invalid amount");

            const token = erc20.multicallContract(tokenAddress);
            const [allowance, tokenDecimals] = await multicall.all([
              token.allowance(signerAddress, contractAddress),
              token.decimals(),
            ]);

            return new bn(amount)
              .multipliedBy(`1e${tokenDecimals.toString()}`)
              .lte(ethereum.toBN(allowance));
          },
          approve: async (tokenAddress: string, amount: string) => {
            const tokenMulticall = erc20.multicallContract(tokenAddress);
            const token = erc20.contract(signer, tokenAddress);
            const [allowance, tokenDecimals] = await multicall.all([
              tokenMulticall.allowance(signerAddress, contractAddress),
              tokenMulticall.decimals(),
            ]);

            const amountInt = new bn(amount).multipliedBy(
              `1e${tokenDecimals.toString()}`
            );
            if (amountInt.gt(allowance.toString())) {
              if (ethereum.toBN(allowance).gt(0)) {
                await token.approve(contractAddress, 0);
              }

              return {
                tx: await token.approve(
                  contractAddress,
                  new bn(2).pow(256).minus(1).toFixed(0)
                ),
              };
            }

            return {};
          },
          canBuy: async (tokenAddress: string, amount: string) => {
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
            const pairMulticall = uniswap.V2.pair.multicallContract(pair);
            const [tokenDecimals, token0, token1, fee] = await multicall.all([
              erc20.multicallContract(tokenAddress).decimals(),
              pairMulticall.token0(),
              pairMulticall.token1(),
              automateMulticall.fee(),
            ]);

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

            return {
              tx: await automate.buyLiquidity(
                amountInt.toFixed(0),
                router,
                swap0,
                swap1,
                pair,
                dayjs().add(deadlineSeconds, "seconds").unix(),
                {
                  value: ethereum.toBN(fee).multipliedBy(1.05).toFixed(0),
                }
              ),
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
      if (!signer.provider) throw new Error("Provider not found");
      const provider = signer.provider;
      const signerAddress = await signer.getAddress();
      const network = await signer
        .getChainId()
        .then((v) => Number(v.toString()));
      const automate = new ethers.Contract(
        contractAddress,
        BuyLiquidityABI
      ).connect(signer);
      const automateMulticall =
        ethereum.multicallContract(BuyLiquidityABI)(contractAddress);
      const multicall = new ethersMulticall.Provider(provider);
      await multicall.init();

      return {
        name: "DFHSellLiquidity",
        methods: {
          balanceOf: async () => {
            const token = erc20.multicallContract(pair);
            const [balance, tokenDecimals] = await multicall.all([
              token.balanceOf(signerAddress),
              token.decimals(),
            ]);

            return ethereum
              .toBN(balance)
              .div(`1e${tokenDecimals.toString()}`)
              .toString(10);
          },
          isApproved: async (amount: string) => {
            if (new bn(amount).lte(0)) return new Error("Invalid amount");

            const token = erc20.multicallContract(pair);
            const [allowance, tokenDecimals] = await multicall.all([
              token.allowance(signerAddress, contractAddress),
              token.decimals(),
            ]);

            return new bn(amount)
              .multipliedBy(`1e${tokenDecimals.toString()}`)
              .lte(ethereum.toBN(allowance));
          },
          approve: async (amount: string) => {
            const tokenMulticall = erc20.multicallContract(pair);
            const token = erc20.contract(signer, pair);
            const [allowance, tokenDecimals] = await multicall.all([
              tokenMulticall.allowance(signerAddress, contractAddress),
              tokenMulticall.decimals(),
            ]);

            const amountInt = new bn(amount).multipliedBy(
              `1e${tokenDecimals.toString()}`
            );
            if (amountInt.gt(allowance.toString())) {
              if (ethereum.toBN(allowance).gt(0)) {
                await token.approve(contractAddress, 0);
              }

              return {
                tx: await token.approve(
                  contractAddress,
                  new bn(2).pow(256).minus(1).toFixed(0)
                ),
              };
            }

            return {};
          },
          canSell: async (amount: string) => {
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

            const amountInt = new bn(amount).multipliedBy(
              `1e${pairDecimals.toString()}`
            );
            const balance = pairInfo.expandBalance(amountInt);
            const outMinPercent = new bn(1).minus(new bn(slippage).div(100));
            let swap0 = { path: [token0, tokenAddress], outMin: "0" };
            if (tokenAddress.toLowerCase() !== token0.toLowerCase()) {
              const { path, amountOut } = await uniswap.V2.router.autoRoute(
                uniswap.V2.router.contract(provider, router),
                balance.token0,
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
            let swap1 = { path: [token1, tokenAddress], outMin: "0" };
            if (tokenAddress.toLowerCase() !== token1.toLowerCase()) {
              const { path, amountOut } = await uniswap.V2.router.autoRoute(
                uniswap.V2.router.contract(provider, router),
                balance.token1,
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

            return {
              tx: await automate.buyLiquidity(
                amountInt.toFixed(0),
                router,
                swap0,
                swap1,
                pair,
                dayjs().add(deadlineSeconds, "seconds").unix(),
                {
                  value: ethereum.toBN(fee).multipliedBy(1.05).toFixed(0),
                }
              ),
            };
          },
        },
      };
    },
  },
};

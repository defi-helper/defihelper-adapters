import type { Signer } from "ethers";
import { bignumber as bn, ethers, dayjs, uniswap3, axios } from "../../lib";
import * as dfh from "../../utils/dfh";
import { debug, debugo } from "../../utils/base";
import * as ethereum from "../../utils/ethereum/base";
import * as erc20 from "../../utils/ethereum/erc20";
import * as uniswap from "../../utils/ethereum/uniswap";
import { abi as StorageABI } from "@defihelper/networks/abi/Storage.json";
import { abi as Uni3LPTokensManagerABI } from "@defihelper/networks/abi/Uni3LPTokensManager.json";
import { positionView } from "../../utils/ethereum/uniswap/v3/positionManager";
import { bridgeWrapperBuild } from "../../utils/coingecko";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export default {
  buyLiquidity: async (
    ethSigner: Signer,
    contractAddress: string,
    options: {
      positionManager: string;
      router: string;
      autorouteURL: string;
      quoter: string;
      pool: string;
    }
  ) => {
    debugo({
      _prefix: "Adapter uni3 buyLiquidity",
      contractAddress,
      positionManager: options.positionManager,
      router: options.router,
      autorouteURL: options.autorouteURL,
      quoter: options.quoter,
      pool: options.pool,
    });
    const signer = new ethereum.Signer(ethSigner);
    const signerAddress = await signer.address;
    debug(`Signer address "${signerAddress}"`);
    const network = await signer.chainId;
    const multicall = await signer.multicall;
    const automate = signer.contract(Uni3LPTokensManagerABI, contractAddress);
    const router = uniswap.V3.swapRouter.SwapRouter.fromAddress(
      signer,
      options.router,
      options.quoter
    );
    const autoroute = new uniswap.V3.swapRouter.AutoRoute(
      options.autorouteURL,
      network
    );
    const pool = await uniswap.V3.pool.getPool(
      network,
      multicall,
      options.pool
    );
    const storage = signer.contract(StorageABI, await automate.contract.info());

    return {
      name: "DFHUni3BuyLiquidity",
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
        interval: async (width: number | string) => {
          debugo({
            _prefix: "interval",
            width,
          });
          if (Number.isNaN(Number(width))) {
            return new Error("Invalid width");
          }

          const { tickSpacing, tickCurrent, token0, token1 } = pool;
          const tickLower = uniswap3.sdk.nearestUsableTick(
            tickCurrent - tickSpacing * Number(width),
            tickSpacing
          );
          const tickUpper = uniswap3.sdk.nearestUsableTick(
            tickCurrent + tickSpacing * Number(width),
            tickSpacing
          );
          const token0PriceLower = new bn(1.0001)
            .pow(tickLower)
            .multipliedBy(`1e${token0.decimals - token1.decimals}`);
          const token0PriceUpper = new bn(1.0001)
            .pow(tickUpper)
            .multipliedBy(`1e${token0.decimals - token1.decimals}`);

          return {
            tickCurrent,
            tickLower,
            tickUpper,
            token0: {
              address: token0.address,
              name: token0.name,
              decimals: token0.decimals,
              priceLower: token0PriceLower.toString(10),
              priceUpper: token0PriceUpper.toString(10),
            },
            token1: {
              address: token1.address,
              name: token1.name,
              decimals: token1.decimals,
              priceLower: new bn(1).div(token0PriceLower).toString(10),
              priceUpper: new bn(1).div(token0PriceUpper).toString(10),
            },
          };
        },
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
          intervalWidth: number | string,
          slippage: number | string,
          deadlineSeconds: number = 300
        ) => {
          debugo({
            _prefix: "buy",
            tokenAddress,
            amount,
            intervalWidth,
            slippage,
            deadlineSeconds,
          });

          const [fee, inToken, token0, token1] = await Promise.all([
            automate.contract.fee(),
            erc20.SignedToken.fromAddress(signer, tokenAddress),
            erc20.SignedToken.fromAddress(signer, pool.token0.address),
            erc20.SignedToken.fromAddress(signer, pool.token1.address),
          ]);
          debugo({
            _prefix: "buy",
            token0: token0.address,
            token1: token1.address,
            fee,
          });

          const amountIn = inToken.amountFloat(amount);
          const { tickSpacing, tickCurrent } = pool;
          const tickLower = uniswap3.sdk.nearestUsableTick(
            tickCurrent - tickSpacing * Number(intervalWidth),
            tickSpacing
          );
          const tickUpper = uniswap3.sdk.nearestUsableTick(
            tickCurrent + tickSpacing * Number(intervalWidth),
            tickSpacing
          );
          let path: Array<string | number> = [];
          if (![token0.address, token1.address].includes(inToken.address)) {
            const [autoroutePath0, autoroutePath1] = await Promise.all([
              autoroute.route(inToken, token0, amountIn),
              autoroute.route(inToken, token1, amountIn),
            ]);
            if (autoroutePath0 instanceof Error) {
              debugo({
                _prefix: "buy",
                autoroute0Error: autoroutePath0.message,
              });
            } else if (autoroutePath0.length > 0) {
              path = autoroutePath0;
            }
            if (autoroutePath1 instanceof Error) {
              debugo({
                _prefix: "buy",
                autoroute1Error: autoroutePath1.message,
              });
            } else if (autoroutePath1.length > 0) {
              path = autoroutePath1;
            }
            if (path.length === 0) {
              throw new Error("Swap path not found");
            }
          }

          const outMinPercent = new bn(1).minus(new bn(slippage).div(100));
          const calldata = {
            positionManager: options.positionManager,
            router: options.router,
            from: tokenAddress,
            amount: amountIn.toFixed(),
            swap:
              path.length > 0
                ? {
                    path: uniswap.V3.swapRouter.packPath(path),
                    outMin: await router
                      .amountOut(path, amountIn.int)
                      .then((v) => v.multipliedBy(outMinPercent).toFixed(0)),
                  }
                : {
                    path: "0x",
                    outMin: 0,
                  },
            to: options.pool,
            tickLower,
            tickUpper,
            deadline: dayjs().add(deadlineSeconds, "seconds").unix(),
          };
          const calloptions = {
            value: ethereum.toBN(fee).multipliedBy(1.05).toFixed(0),
          };
          debugo({
            _prefix: "buy",
            ...calldata,
            ...calloptions,
          });

          const buyTx = await automate.contract.buyLiquidity(
            calldata,
            calloptions
          );
          debugo({
            _prefix: "buy",
            buyTx: JSON.stringify(buyTx),
          });
          return { tx: buyTx };
        },
        buyETH: async (
          amount: string,
          intervalWidth: number | string,
          slippage: number | string,
          deadlineSeconds: number = 300
        ) => {
          debugo({
            _prefix: "buyETH",
            amount,
            intervalWidth,
            slippage,
            deadlineSeconds,
          });

          const tokenAddress = await storage.contract.getAddress(
            ethers.utils.keccak256(
              ethers.utils.toUtf8Bytes("NativeWrapper:Contract")
            )
          );
          const [fee, inToken, token0, token1] = await Promise.all([
            automate.contract.fee(),
            erc20.SignedToken.fromAddress(signer, tokenAddress),
            erc20.SignedToken.fromAddress(signer, pool.token0.address),
            erc20.SignedToken.fromAddress(signer, pool.token1.address),
          ]);
          debugo({
            _prefix: "buyETH",
            inToken: inToken.address,
            token0: token0.address,
            token1: token1.address,
            fee,
          });

          const amountIn = inToken.amountFloat(amount);
          const { tickSpacing, tickCurrent } = pool;
          const tickLower = uniswap3.sdk.nearestUsableTick(
            tickCurrent - tickSpacing * Number(intervalWidth),
            tickSpacing
          );
          const tickUpper = uniswap3.sdk.nearestUsableTick(
            tickCurrent + tickSpacing * Number(intervalWidth),
            tickSpacing
          );
          let path: Array<string | number> = [];
          if (![token0.address, token1.address].includes(inToken.address)) {
            const [autoroutePath0, autoroutePath1] = await Promise.all([
              autoroute.route(inToken, token0, amountIn),
              autoroute.route(inToken, token1, amountIn),
            ]);
            debugo({
              _prefix: "buyETH",
              autoroutePath0,
              autoroutePath1,
            });
            if (autoroutePath0 instanceof Error) {
              debugo({
                _prefix: "buyETH",
                autoroute0Error: autoroutePath0.message,
              });
            } else if (autoroutePath0.length > 0) {
              path = autoroutePath0;
            }
            if (autoroutePath1 instanceof Error) {
              debugo({
                _prefix: "buyETH",
                autoroute1Error: autoroutePath1.message,
              });
            } else if (autoroutePath1.length > 0) {
              path = autoroutePath1;
            }
            if (path.length === 0) {
              throw new Error("Swap path not found");
            }
          }

          const outMinPercent = new bn(1).minus(new bn(slippage).div(100));
          const calldata = {
            positionManager: options.positionManager,
            router: options.router,
            from: tokenAddress,
            amount: amountIn.toFixed(),
            swap:
              path.length > 0
                ? {
                    path: uniswap.V3.swapRouter.packPath(path),
                    outMin: await router
                      .amountOut(path, amountIn.int)
                      .then((v) => v.multipliedBy(outMinPercent).toFixed(0)),
                  }
                : {
                    path: "0x",
                    outMin: 0,
                  },
            to: options.pool,
            tickLower,
            tickUpper,
            deadline: dayjs().add(deadlineSeconds, "seconds").unix(),
          };
          const calloptions = {
            value: amountIn.int
              .plus(ethereum.toBN(fee).multipliedBy(1.05))
              .toFixed(0),
          };
          debugo({
            _prefix: "buyETH",
            ...calldata,
            ...calloptions,
          });

          const buyTx = await automate.contract.buyLiquidityETH(
            calldata,
            calloptions
          );
          debugo({
            _prefix: "buyETH",
            buyTx: JSON.stringify(buyTx),
          });
          return { tx: buyTx };
        },
      },
    };
  },
  sellLiquidity: async (
    ethSigner: Signer,
    contractAddress: string,
    options: {
      positionManager: string;
      router: string;
      autorouteURL: string;
      quoter: string;
      pool: string;
    }
  ) => {
    debugo({
      _prefix: "Adapter uni3 buyLiquidity",
      contractAddress,
      positinoManager: options.positionManager,
      router: options.router,
      autorouteURL: options.autorouteURL,
      quoter: options.quoter,
      pool: options.pool,
    });
    const signer = new ethereum.Signer(ethSigner);
    const signerAddress = await signer.address;
    debug(`Signer address "${signerAddress}"`);
    const network = await signer.chainId;
    const multicall = await signer.multicall;
    const automate = signer.contract(Uni3LPTokensManagerABI, contractAddress);
    const positionManager =
      await uniswap.V3.positionManager.PositionManager.fromAddress(
        signer,
        options.positionManager
      );
    const router = uniswap.V3.swapRouter.SwapRouter.fromAddress(
      signer,
      options.router,
      options.quoter
    );
    const autoroute = new uniswap.V3.swapRouter.AutoRoute(
      options.autorouteURL,
      network
    );
    const pool = await uniswap.V3.pool.getPool(
      network,
      multicall,
      options.pool
    );
    const storage = signer.contract(StorageABI, await automate.contract.info());

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
        positions: async () => {
          const priceFeed = bridgeWrapperBuild(
            await dfh.getPriceFeeds(network),
            "latest",
            await signer.provider.getBlock("latest"),
            network,
            signer.provider
          );

          const [token0, token1, token0PriceUSD, token1PriceUSD] =
            await Promise.all([
              erc20.ConnectedToken.fromAddress(signer, pool.token0.address),
              erc20.ConnectedToken.fromAddress(signer, pool.token1.address),
              priceFeed(pool.token0.address),
              priceFeed(pool.token1.address),
            ]);
          const token0Price = await router
            .amountOut(
              uniswap.V3.swapRouter.pathWithFees(
                [token0.address, token1.address],
                pool.fee
              ),
              token0.amountFloat(1).toFixed()
            )
            .then((value) => token1.amountInt(value));

          const positions = await positionManager
            .positions(signerAddress)
            .then((positions) =>
              positions.filter(
                (position) =>
                  position.inPool(pool) &&
                  new bn(position.liquidity).isGreaterThan(0)
              )
            );
          return Promise.all(
            positions.map((position) =>
              positionView(
                position,
                token0Price,
                token0PriceUSD.toString(),
                token1PriceUSD.toString()
              )
            )
          );
        },
        isApproved: async (tokenId: string) => {
          const approved = await positionManager.contract.contract.getApproved(
            tokenId
          );
          return (
            approved.toLowerCase() === automate.contract.address.toLowerCase()
          );
        },
        approve: async (tokenId: string) => {
          const approveTx = await positionManager.contract.contract.approve(
            automate.contract.address,
            tokenId
          );

          return { tx: approveTx };
        },
        amountOut: async (tokenId: number, tokenOutAddress: string) => {
          if (tokenOutAddress === ZERO_ADDRESS) {
            tokenOutAddress = await storage.contract.getAddress(
              ethers.utils.keccak256(
                ethers.utils.toUtf8Bytes("NativeWrapper:Contract")
              )
            );
          }
          debugo({
            _prefix: "amountOut",
            tokenId,
            tokenOut: tokenOutAddress,
          });

          const position = await positionManager.position(
            signerAddress,
            tokenId
          );
          const [tokenOut, token0, token1, staked, earned] = await Promise.all([
            erc20.ConnectedToken.fromAddress(signer, tokenOutAddress),
            position.token0,
            position.token1,
            position.staked(),
            position.earned(),
          ]);
          const token0Balance = staked.amount0.plus(earned.amount0);
          const token1Balance = staked.amount1.plus(earned.amount1);
          const tokenIn = token0Balance.int.gt(token1Balance.int)
            ? token1
            : token0;
          const tokenMiddle = token0Balance.int.gt(token1Balance.int)
            ? token0
            : token1;
          const amountIn = await router.amountOut(
            [tokenIn.address, pool.fee, tokenMiddle.address],
            token0Balance.int.gt(token1Balance.int)
              ? token1Balance.int
              : token0Balance.int
          );

          let path: Array<string | number> = [];
          if (![token0.address, token1.address].includes(tokenOutAddress)) {
            const autoroutePath = await autoroute.route(
              tokenMiddle,
              await erc20.SignedToken.fromAddress(signer, tokenOutAddress),
              tokenMiddle.amountInt(amountIn.toFixed(0))
            );
            if (autoroutePath instanceof Error) {
              debugo({
                _prefix: "buy",
                autorouteError: autoroutePath.message,
              });
            } else {
              path = autoroutePath;
            }
            if (path.length === 0) {
              throw new Error("Swap path not found");
            }
          }
          debugo({
            _prefix: "amountOut",
            path,
          });

          const middleAmountOut = await router.amountOut(
            [tokenIn.address, pool.fee, tokenMiddle.address],
            amountIn
          );
          debugo({
            _prefix: "amountOut",
            middleAmountOut: middleAmountOut.toString(10),
          });

          return path.length > 0
            ? router
                .amountOut(path, middleAmountOut)
                .then((v) => tokenOut.amountInt(v.toFixed(0)).toString())
            : tokenMiddle.amountInt(middleAmountOut.toFixed(0)).toString();
        },
        canSell: async (tokenId: string) => {
          debugo({ _prefix: "canSell", tokenId });
          const [tokenOwner, allowance, fee] = await multicall.all([
            positionManager.contract.multicall.ownerOf(tokenId),
            positionManager.contract.multicall.getApproved(tokenId),
            automate.multicall.fee(),
          ]);
          const feeBalance = await signer.provider
            .getBalance(signerAddress)
            .then(ethereum.toBN);
          debugo({
            _prefix: "canSell",
            tokenOwner,
            allowance,
            fee,
            feeBalance,
          });
          if (tokenOwner.toLowerCase() !== signerAddress.toLowerCase())
            return new Error("Someone else's token");
          if (
            allowance.toLowerCase() !== automate.contract.address.toLowerCase()
          )
            return new Error("Not approved");
          if (ethereum.toBN(fee).multipliedBy(1.05).gt(feeBalance)) {
            return new Error("Insufficient fee funds on the balance");
          }

          return true;
        },
        sell: async (
          tokenId: number,
          tokenOut: string,
          slippage: number | string,
          deadlineSeconds: number = 300
        ) => {
          debugo({
            _prefix: "sell",
            tokenId,
            tokenOut,
            slippage,
            deadlineSeconds,
          });
          const fee = await automate.contract.fee();
          const position = await positionManager.position(
            signerAddress,
            tokenId
          );
          const [token0, token1, staked, earned] = await Promise.all([
            position.token0,
            position.token1,
            position.staked(),
            position.earned(),
          ]);
          const token0Balance = staked.amount0.plus(earned.amount0);
          const token1Balance = staked.amount1.plus(earned.amount1);
          const tokenIn = token0Balance.int.gt(token1Balance.int)
            ? token1
            : token0;
          const tokenMiddle = token0Balance.int.gt(token1Balance.int)
            ? token0
            : token1;
          const amountIn = await router.amountOut(
            [tokenIn.address, pool.fee, tokenMiddle.address],
            token0Balance.int.gt(token1Balance.int)
              ? token1Balance.int
              : token0Balance.int
          );

          let path: Array<string | number> = [];
          if (![token0.address, token1.address].includes(tokenOut)) {
            const autoroutePath = await autoroute.route(
              tokenMiddle,
              await erc20.SignedToken.fromAddress(signer, tokenOut),
              tokenMiddle.amountInt(amountIn.toFixed(0))
            );
            if (autoroutePath instanceof Error) {
              debugo({
                _prefix: "sellETH",
                autorouteError: autoroutePath.message,
              });
            } else {
              path = autoroutePath;
            }
            if (path.length === 0) {
              throw new Error("Swap path not found");
            }
          }

          const outMinPercent = new bn(1).minus(new bn(slippage).div(100));
          const calldata = {
            positionManager: options.positionManager,
            router: options.router,
            from: tokenId,
            swap:
              path.length > 0
                ? {
                    path: uniswap.V3.swapRouter.packPath(path),
                    outMin: await router
                      .amountOut(path, amountIn)
                      .then((v) => v.multipliedBy(outMinPercent).toFixed(0)),
                  }
                : {
                    path: "0x",
                    outMin: 0,
                  },
            to: tokenOut,
            deadline: dayjs().add(deadlineSeconds, "seconds").unix(),
          };
          const calloptions = {
            value: ethereum.toBN(fee).multipliedBy(1.05).toFixed(0),
          };
          debugo({
            _prefix: "sell",
            ...calldata,
            ...calloptions,
          });

          const sellTx = await automate.contract.sellLiquidity(
            calldata,
            calloptions
          );
          debugo({
            _prefix: "sell",
            sellTx: JSON.stringify(sellTx),
          });
          return { tx: sellTx };
        },
        sellETH: async (
          tokenId: number,
          slippage: number | string,
          deadlineSeconds: number = 300
        ) => {
          debugo({
            _prefix: "sellETH",
            tokenId,
            slippage,
            deadlineSeconds,
          });
          const tokenOut = await storage.contract.getAddress(
            ethers.utils.keccak256(
              ethers.utils.toUtf8Bytes("NativeWrapper:Contract")
            )
          );
          const fee = await automate.contract.fee();
          const position = await positionManager.position(
            signerAddress,
            tokenId
          );
          const [token0, token1, staked, earned] = await Promise.all([
            position.token0,
            position.token1,
            position.staked(),
            position.earned(),
          ]);
          const token0Balance = staked.amount0.plus(earned.amount0);
          const token1Balance = staked.amount1.plus(earned.amount1);
          const tokenIn = token0Balance.int.gt(token1Balance.int)
            ? token1
            : token0;
          const tokenMiddle = token0Balance.int.gt(token1Balance.int)
            ? token0
            : token1;
          const amountIn = await router.amountOut(
            [tokenIn.address, pool.fee, tokenMiddle.address],
            token0Balance.int.gt(token1Balance.int)
              ? token1Balance.int
              : token0Balance.int
          );

          let path: Array<string | number> = [];
          if (![token0.address, token1.address].includes(tokenOut)) {
            const autoroutePath = await autoroute.route(
              tokenMiddle,
              await erc20.SignedToken.fromAddress(signer, tokenOut),
              tokenMiddle.amountInt(amountIn.toFixed(0))
            );
            if (autoroutePath instanceof Error) {
              debugo({
                _prefix: "sellETH",
                autorouteError: autoroutePath.message,
              });
            } else {
              path = autoroutePath;
            }
            if (path.length === 0) {
              throw new Error("Swap path not found");
            }
          }

          const outMinPercent = new bn(1).minus(new bn(slippage).div(100));
          const calldata = {
            positionManager: options.positionManager,
            router: options.router,
            from: tokenId,
            swap:
              path.length > 0
                ? {
                    path: uniswap.V3.swapRouter.packPath(path),
                    outMin: await router
                      .amountOut(path, amountIn)
                      .then((v) => v.multipliedBy(outMinPercent).toFixed(0)),
                  }
                : {
                    path: "0x",
                    outMin: 0,
                  },
            to: tokenOut,
            deadline: dayjs().add(deadlineSeconds, "seconds").unix(),
          };
          const calloptions = {
            value: ethereum.toBN(fee).multipliedBy(1.05).toFixed(0),
          };
          debugo({
            _prefix: "sellETH",
            ...calldata,
            ...calloptions,
          });

          const sellTx = await automate.contract.sellLiquidityETH(
            calldata,
            calloptions
          );
          debugo({
            _prefix: "sell",
            sellETHTx: JSON.stringify(sellTx),
          });
          return { tx: sellTx };
        },
      },
    };
  },
};

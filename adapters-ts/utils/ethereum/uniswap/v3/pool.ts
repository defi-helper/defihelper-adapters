import type {
  Provider as MulticallProvider,
  Contract as MulticallContract,
} from "@defihelper/ethers-multicall";
import BN from "bignumber.js";
import { ethers, uniswap3 } from "../../../../lib";
import * as ethereum from "../../../ethereum/base";
import * as erc20 from "../../../ethereum/erc20";
import { toBN } from "../../base";
import poolABI from "./abi/pool.json";

export async function getPoolInfo(
  multicall: MulticallProvider,
  pool: MulticallContract | string
) {
  if (typeof pool === "string") {
    pool = ethereum.multicallContract(poolABI)(pool);
  }

  const [
    factory,
    token0,
    token1,
    fee,
    tickSpacing,
    maxLiquidityPerTick,
    liquidity,
    slot,
  ] = await multicall.all([
    pool.factory(),
    pool.token0(),
    pool.token1(),
    pool.fee(),
    pool.tickSpacing(),
    pool.maxLiquidityPerTick(),
    pool.liquidity(),
    pool.slot0(),
  ]);

  return {
    factory,
    token0,
    token1,
    fee,
    tickSpacing,
    maxLiquidityPerTick,
    liquidity,
    sqrtPriceX96: slot[0],
    tick: slot[1],
    observationIndex: slot[2],
    observationCardinality: slot[3],
    observationCardinalityNext: slot[4],
    feeProtocol: slot[5],
    unlocked: slot[6],
  };
}

export async function getPool(
  chainId: number,
  multicall: MulticallProvider,
  pool: MulticallContract | string
) {
  const [info] = await Promise.all([getPoolInfo(multicall, pool)]);
  const token0 = erc20.multicallContract(info.token0);
  const token1 = erc20.multicallContract(info.token1);
  const [
    token0Name,
    token0Symbol,
    token0Decimals,
    token1Name,
    token1Symbol,
    token1Decimals,
  ] = await multicall.all([
    token0.name(),
    token0.symbol(),
    token0.decimals(),
    token1.name(),
    token1.symbol(),
    token1.decimals(),
  ]);

  return new uniswap3.sdk.Pool(
    new uniswap3.core.Token(
      chainId,
      info.token0,
      token0Decimals,
      token0Symbol,
      token0Name
    ),
    new uniswap3.core.Token(
      chainId,
      info.token1,
      token1Decimals,
      token1Symbol,
      token1Name
    ),
    info.fee,
    info.sqrtPriceX96.toString(),
    info.liquidity.toString(),
    info.tick
  );
}

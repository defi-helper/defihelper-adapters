import type { Contract } from "ethers";
import type BN from "bignumber.js";
import { bignumber as bn } from "../../../lib";
import * as base from "../base";
import abi from "./abi/router.json";

export { abi };

export const contract = base.contract(abi);

export const multicallContract = base.multicallContract(abi);

export async function getPrice(
  router: Contract,
  amountIn: BN | string | number,
  path: string[],
  options = base.defaultOptions()
) {
  try {
    const amountsOut = await router.getAmountsOut(amountIn, path, {
      blockTag: options.blockNumber,
    });

    return amountsOut[amountsOut.length - 1];
  } catch (e) {
    throw new Error(
      `Resolver price "${JSON.stringify(path)}" by uniswap router error: ${e}`
    );
  }
}

export async function autoRoute(
  router: Contract,
  amountIn: BN | string | number,
  from: string,
  to: string,
  withTokens: string[]
) {
  const paths = [
    [from, to],
    ...withTokens
      .filter((middle) => from !== middle && middle !== to)
      .map((middle) => [from, middle, to]),
  ];
  const amountsOut = await Promise.all(
    paths.map((path) =>
      router
        .getAmountsOut(amountIn, path)
        .catch(() => path.map(() => new bn("0")))
    )
  );

  return amountsOut.reduce(
    (result, amountsOut, i) => {
      const amountOut = amountsOut[amountsOut.length - 1].toString();
      if (new bn(result.amountOut).isGreaterThanOrEqualTo(amountOut)) {
        return result;
      }

      return { path: [from, withTokens[i - 1], to], amountOut };
    },
    { path: [from, to], amountOut: amountsOut[0][1].toString() }
  );
}

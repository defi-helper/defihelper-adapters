import type { Contract, ethers } from "ethers";
import type BN from "bignumber.js";
import { bignumber as bn } from "../../../../lib";
import * as base from "../../base";
import * as ethereum from "../../base";
import * as erc20 from "../../erc20";
import { debugo } from "../../../base";
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
    const amountsOut: ethers.BigNumber[] = await router.getAmountsOut(
      amountIn,
      path,
      {
        blockTag: options.blockNumber,
      }
    );

    return amountsOut[amountsOut.length - 1].toString();
  } catch (e) {
    throw new Error(
      `Resolver price "${JSON.stringify(path)}" by uniswap router error: ${e}`
    );
  }
}

export async function autoRoute(
  router: Contract,
  amountIn: string | number,
  from: string,
  to: string,
  withTokens: string[]
): Promise<{ path: string[]; amountOut: string }> {
  const paths = [
    [from, to],
    ...withTokens
      .filter(
        (middle) =>
          from.toLowerCase() !== middle.toLowerCase() &&
          middle.toLowerCase() !== to.toLowerCase()
      )
      .map((middle) => [from, middle, to]),
  ];
  const amountsOut = await Promise.all(
    paths.map((path) =>
      router
        .getAmountsOut(new bn(amountIn).toFixed(0), path)
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

export const useAmountOut =
  ({ node }: { node: ethereum.Node }) =>
  async (exchangeAddress: string, path: string[], amountIn: string) => {
    debugo({ _prefix: "amountOut", exchangeAddress, path, amountIn });
    const [inToken, outToken] = await Promise.all([
      erc20.ConnectedToken.fromAddress(node, path[0]),
      erc20.ConnectedToken.fromAddress(node, path[path.length - 1]),
    ]);

    return getPrice(
        contract(node.provider, exchangeAddress),
        inToken.amountFloat(amountIn).toFixed(),
        path,
        { blockNumber: "latest", signer: null }
      )
      .then((amountOut) => outToken.amountInt(amountOut).toString());
  };

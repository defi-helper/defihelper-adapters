import type ethersType from "ethers";
import { bignumber as bn, dayjs, ethers, ethersMulticall } from "../lib";
import { bridgeWrapperBuild } from "../utils/coingecko";
import * as ethereum from "../utils/ethereum/base";
import * as erc20 from "../utils/ethereum/erc20";
import * as uniswap from "../utils/ethereum/uniswap";
import * as dfh from "../utils/dfh";
import { getPool } from "../utils/ethereum/uniswap/v3/pool";

const POSITION_MANAGER = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";

module.exports = {
  pool: async (
    provider: ethersType.ethers.providers.Provider,
    contractAddress: string,
    initOptions = ethereum.defaultOptions()
  ) => {
    const options = {
      ...ethereum.defaultOptions(),
      ...initOptions,
    };
    const blockTag = options.blockNumber;
    const network = await provider.getNetwork().then(({ chainId }) => chainId);
    const block = await provider.getBlock(blockTag);
    const multicall = new ethersMulticall.Provider(provider, network);
    const node = new ethereum.Node(provider);
    const priceFeed = bridgeWrapperBuild(
      await dfh.getPriceFeeds(network),
      blockTag,
      block,
      network,
      provider
    );

    const pool = await getPool(network, multicall, contractAddress);
    const pm = await uniswap.V3.positionManager.PositionManager.fromAddress(
      node,
      POSITION_MANAGER
    );

    const [token0, token1] = await Promise.all([
      erc20.ConnectedToken.fromAddress(node, pool.token0.address),
      erc20.ConnectedToken.fromAddress(node, pool.token1.address),
    ]);
    const [token0Locked, token1Locked] = await multicall.all([
      token0.contract.multicall.balanceOf(contractAddress),
      token1.contract.multicall.balanceOf(contractAddress),
    ]);
    const token0PriceUSD = await priceFeed(pool.token0.address);
    const token1PriceUSD = await priceFeed(pool.token1.address);
    const token0LockedUSD = token0
      .amountInt(token0Locked.toString())
      .float.multipliedBy(token0PriceUSD);
    const token1LockedUSD = token1
      .amountInt(token1Locked.toString())
      .float.multipliedBy(token1PriceUSD);
    const tvl = token0LockedUSD.plus(token1LockedUSD);

    return {
      stakeToken: {
        address: contractAddress,
        decimals: 0,
        priceUSD: 0,
        parts: [
          {
            address: pool.token0.address,
            decimals: pool.token0.decimals,
            priceUSD: token0PriceUSD.toString(10),
          },
          {
            address: pool.token1.address,
            decimals: pool.token1.decimals,
            priceUSD: token1PriceUSD.toString(10),
          },
        ],
      },
      rewardToken: {
        address: contractAddress,
        decimals: 0,
        priceUSD: 0,
        parts: [
          {
            address: pool.token0.address,
            decimals: pool.token0.decimals,
            priceUSD: token0PriceUSD.toString(10),
          },
          {
            address: pool.token1.address,
            decimals: pool.token1.decimals,
            priceUSD: token1PriceUSD.toString(10),
          },
        ],
      },
      metrics: {
        tvl: tvl.toString(10),
        //aprDay: aprDay.toString(10),
        //aprWeek: aprWeek.toString(10),
        //aprMonth: aprMonth.toString(10),
        //aprYear: aprYear.toString(10),
      },
      wallet: async (walletAddress: string) => {
        const positions = await pm.positions(walletAddress, { pool });
        const cumulativePosition = positions.reduce(
          ([pos0, pos1], position) => {
            const balance0 = token0.amountFloat(position.amount0.toFixed());
            const balance1 = token1.amountFloat(position.amount1.toFixed());

            return [
              {
                balance: balance0.float.plus(pos0.balance),
                usd: balance0.float.multipliedBy(token0PriceUSD).plus(pos0.usd),
              },
              {
                balance: balance1.float.plus(pos1.balance),
                usd: balance1.float.multipliedBy(token1PriceUSD).plus(pos1.usd),
              },
            ];
          },
          [
            { usd: new bn(0), balance: new bn(0) },
            { usd: new bn(0), balance: new bn(0) },
          ]
        );

        return {
          staked: {
            [token0.address]: {
              balance: cumulativePosition[0].balance.toString(10),
              usd: cumulativePosition[0].usd.toString(10),
            },
            [token1.address]: {
              balance: cumulativePosition[1].balance.toString(10),
              usd: cumulativePosition[1].usd.toString(10),
            },
          },
          /*
            earned: {
              [rewardToken]: {
                balance: earned.toString(10),
                usd: earnedUSD.toString(10),
              },
            },
            */
          metrics: {
            staking: positions.length,
            stakingUSD: cumulativePosition[0].usd
              .plus(cumulativePosition[1].usd)
              .toString(10),
            //earned: earned.toString(10),
            //earnedUSD: earnedUSD.toString(10),
          },
          tokens: {
            [token0.address]: {
              balance: cumulativePosition[0].balance.toString(10),
              usd: cumulativePosition[0].usd.toString(10),
            },
            [token1.address]: {
              balance: cumulativePosition[1].balance.toString(10),
              usd: cumulativePosition[1].usd.toString(10),
            },
          },
        };
      },
      actions: () => {},
    };
  },
};

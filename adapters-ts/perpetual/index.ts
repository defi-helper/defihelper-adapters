import type { Contract, Signer, providers } from "ethers";
import { bignumber as bn, uniswap3, ethersMulticall } from "../lib";
import {
  stakingAdapter,
  contractsResolver,
  deployAdapter,
  automateAdapter,
  Deploy,
  Automate,
} from "../utils/ethereum/adapter/base";
import { bridgeWrapperBuild } from "../utils/coingecko";
import * as ethereum from "../utils/ethereum/base";
import * as erc20 from "../utils/ethereum/erc20";
import * as uniswap from "../utils/ethereum/uniswap";
import * as dfh from "../utils/dfh";
import accountBalanceABI from "./data/accountBalance.json";
import clearingHouseABI from "./data/clearingHouseABI.json";
import orderBookABI from "./data/orderBook.json";
import marketRegistryABI from "./data/marketRegistry.json";
import { Staking } from "../utils/adapter/base";

/**
 * vBNB - 0xb6599Bd362120Dc70D48409B8a08888807050700
 * vETH - 0x8C835DFaA34e2AE61775e80EE29E2c724c6AE2BB
 */

namespace AccountBalance {
  export const address = {
    optimism: "0xA7f3FC32043757039d5e13d790EE43edBcBa8b7c",
  };

  export const contract = ethereum.contract(accountBalanceABI);

  export const multicallContract =
    ethereum.multicallContract(accountBalanceABI);

  export class Provider {
    static create(
      provider: Signer | providers.Provider,
      network: keyof typeof address
    ) {
      return new Provider(contract(provider, address[network]));
    }

    constructor(public readonly contract: Contract) {}
  }
}

namespace ClearingHouse {
  export const address = {
    optimism: "0x82ac2CE43e33683c58BE4cDc40975E73aA50f459",
  };

  export const contract = ethereum.contract(clearingHouseABI);

  export const multicallContract = ethereum.multicallContract(clearingHouseABI);

  export class Provider {
    static create(
      provider: Signer | providers.Provider,
      network: keyof typeof address
    ) {
      return new Provider(contract(provider, address[network]));
    }

    constructor(public readonly contract: Contract) {}
  }
}

namespace OrderBook {
  export const address = {
    optimism: "0xDfcaEBe8f6ea5E022BeFAFaE8c6Cdae8D4E1094b",
  };

  export const contract = ethereum.contract(orderBookABI);

  export const multicallContract = ethereum.multicallContract(orderBookABI);

  export class Provider {
    static create(
      provider: Signer | providers.Provider,
      network: keyof typeof address
    ) {
      return new Provider(contract(provider, address[network]));
    }

    constructor(public readonly contract: Contract) {}

    // getOpenOrderIds(user, vETH) - список пулов в которых user заливал ликвидность
    // getOpenOrderById(id) - по данным из getOpenOrderIds возвращается инфа по залитой ликвидности юзера
  }
}

namespace MarketRegistry {
  export const address = {
    optimism: "0xd5820eE0F55205f6cdE8BB0647072143b3060067",
  };

  export const contract = ethereum.contract(marketRegistryABI);

  export const multicallContract =
    ethereum.multicallContract(marketRegistryABI);

  export class Provider {
    static create(
      provider: Signer | providers.Provider,
      network: keyof typeof address
    ) {
      return new Provider(contract(provider, address[network]));
    }

    constructor(public readonly contract: Contract) {}
  }
}

module.exports = {
  pool: stakingAdapter(
    async (
      provider,
      contractAddress,
      initOptions = ethereum.defaultOptions()
    ) => {
      const options = {
        ...ethereum.defaultOptions(),
        ...initOptions,
      };
      const blockTag = options.blockNumber;
      const network = await provider
        .getNetwork()
        .then(({ chainId }) => chainId);
      const block = await provider.getBlock(blockTag);
      const priceFeed = bridgeWrapperBuild(
        await dfh.getPriceFeeds(network),
        blockTag,
        block,
        network
      );
      const multicall = new ethersMulticall.Provider(provider);
      await multicall.init();
      const marketRegistry = MarketRegistry.Provider.create(
        provider,
        "optimism"
      );

      const poolAddress: string = await marketRegistry.contract.getPool(
        contractAddress
      );
      const pool = await uniswap.V3.pool.getPool(
        network,
        multicall,
        poolAddress
      );
      const token0PriceUSD = await priceFeed(pool.token0.address);
      const token1PriceUSD = await priceFeed(pool.token1.address);
      const [token0TotalLocked, token1TotalLocked] = await multicall.all([
        erc20.multicallContract(pool.token0.address).balanceOf(poolAddress),
        erc20.multicallContract(pool.token1.address).balanceOf(poolAddress),
      ]);
      const token0TotalLockedUSD = ethereum
        .toBN(token0TotalLocked)
        .div(`1e${pool.token0.decimals}`)
        .multipliedBy(token0PriceUSD);
      const token1TotalLockedUSD = ethereum
        .toBN(token1TotalLocked)
        .div(`1e${pool.token1.decimals}`)
        .multipliedBy(token1PriceUSD);
      const tvl = token0TotalLockedUSD.plus(token1TotalLockedUSD);

      return {
        stakeToken: {
          address: poolAddress,
          decimals: 18,
          priceUSD: "0",
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
          address: "",
          decimals: 0,
          priceUSD: "0",
        },
        metrics: {
          tvl: tvl.toString(10),
          aprDay: "0",
          aprWeek: "0",
          aprMonth: "0",
          aprYear: "0",
        },
        wallet: async (walletAddress) => {
          const orderBook = OrderBook.Provider.create(provider, "optimism");
          const positionIds = await orderBook.contract.getOpenOrderIds(
            walletAddress,
            contractAddress
          );
          if (positionIds.length === 0) throw new Error("Positions not found");
          const { liquidity, lowerTick, upperTick } =
            await orderBook.contract.getOpenOrderById(positionIds[0]);

          const position = new uniswap3.sdk.Position({
            pool,
            liquidity: liquidity.toString(),
            tickLower: lowerTick,
            tickUpper: upperTick,
          });
          const token0Balance = position.amount0.toSignificant();
          const token0USD = token0PriceUSD.multipliedBy(token0Balance);
          const token1Balance = position.amount1.toSignificant();
          const token1USD = token1PriceUSD.multipliedBy(token1Balance);

          return {
            staked: {
              [pool.token0.address]: {
                balance: token0Balance,
                usd: token0USD.toString(10),
              },
              [pool.token1.address]: {
                balance: token1Balance,
                usd: token1USD.toString(10),
              },
            },
            earned: {},
            metrics: {
              staking: "0",
              stakingUSD: token0USD.plus(token1USD).toString(10),
              earned: "0",
              earnedUSD: "0",
            },
            tokens: Staking.tokens(
              {
                token: pool.token0.address,
                data: {
                  balance: token0Balance,
                  usd: token0USD.toString(10),
                },
              },
              {
                token: pool.token1.address,
                data: {
                  balance: token1Balance,
                  usd: token1USD.toString(10),
                },
              }
            ),
          };
        },
        actions: () => {
          return {} as any;
        },
      };
    }
  ),
};

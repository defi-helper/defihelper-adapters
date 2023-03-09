import type ethersType from "ethers";
import type BigNumber from "bignumber.js";
import { bignumber as bn, dayjs, ethers, axios, uniswap3 } from "../lib";
import { bridgeWrapperBuild } from "../utils/coingecko";
import * as ethereum from "../utils/ethereum/base";
import * as erc20 from "../utils/ethereum/erc20";
import * as uniswap from "../utils/ethereum/uniswap";
import * as dfh from "../utils/dfh";
import { Position } from "../utils/ethereum/uniswap/v3/positionManager";
import {
  stakingAdapter,
  contractsResolver,
  Deploy,
} from "../utils/ethereum/adapter/base";
import { debugo } from "../utils/base";
import { Action } from "../utils/adapter/base";
import RestakeABI from "./data/RestakeABI.json";

const envs: Record<
  number,
  { pm: string; router: string; quoter: string; graphs: string } | undefined
> = {
  1: {
    // ethereum
    pm: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
    router: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
    quoter: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6",
    graphs: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3",
  },
  5: {
    // goerli
    pm: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
    router: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
    quoter: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6",
    graphs: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3",
  },
  10: {
    // optimism
    pm: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
    router: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
    quoter: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6",
    graphs:
      "https://api.thegraph.com/subgraphs/name/ianlapham/optimism-post-regenesis",
  },
  42161: {
    // arbitrum
    pm: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
    router: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
    quoter: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6",
    graphs: "https://api.thegraph.com/subgraphs/name/ianlapham/arbitrum-dev",
  },
  137: {
    // polygon
    pm: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
    router: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
    quoter: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6",
    graphs:
      "https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon",
  },
  42220: {
    // celo
    pm: "0x3d79EdAaBC0EaB6F08ED885C05Fc0B014290D95A",
    router: "0x5615CDAb10dc425a742d643d949a7F474C01abc4",
    quoter: "0x82825d0554fA07f7FC52Ab63c961F330fdEFa8E8",
    graphs: "https://api.thegraph.com/subgraphs/name/jesse-sawa/uniswap-celo",
  },
};

const getENV = (network: number) => {
  const env = envs[network];
  if (!env) {
    throw new Error(`Network "${network}" not supported`);
  }
  return env;
};

const positionView = async (
  position: Position,
  token0Price: erc20.TokenAmount,
  token0PriceUSD: BigNumber,
  token1PriceUSD: BigNumber
) => {
  const [positionsSDK, staked, token0, token1] = await Promise.all([
    position.positionSDK,
    position.staked(),
    position.token0,
    position.token1,
  ]);
  return {
    id: position.id,
    fee: position.fee / 1000000,
    token0: {
      address: token0.address,
      name: token0.name,
      symbol: token0.symbol,
      amount: staked.amount0.toString(),
      amountUSD: staked.amount0.float.multipliedBy(token0PriceUSD).toString(10),
      price: {
        value: token0Price.toString(),
        USD: token0PriceUSD.toString(10),
        lower: positionsSDK.token0PriceLower.toSignificant(),
        upper: positionsSDK.token0PriceUpper.toSignificant(),
      },
    },
    token1: {
      address: token1.address,
      name: token1.name,
      symbol: token1.symbol,
      amount: staked.amount1.toString(),
      amountUSD: staked.amount1.float.multipliedBy(token1PriceUSD).toString(10),
      price: {
        value: token1
          .amountFloat(new bn(1).div(token0Price.toString()))
          .toString(),
        USD: token1PriceUSD.toString(),
        lower: token1
          .amountFloat(new bn(1).div(positionsSDK.token0PriceUpper.toSignificant()))
          .toString(),
        upper: token1
          .amountFloat(new bn(1).div(positionsSDK.token0PriceLower.toSignificant()))
          .toString(),
      },
    },
  };
};

interface PoolInfo {
  id: string;
  feeTier: string;
  token0: { id: string; name: string; symbol: string };
  token1: { id: string; name: string; symbol: string };
}

function getPools(graphURL: string, limit: number = 100, offset: number = 0) {
  return axios
    .post(
      graphURL,
      {
        query: `
          query Pools($limit: Int!, $offset: Int!) {
            pools(first: $limit, skip: $offset, orderBy: volumeUSD, orderDirection: desc) {
              id
              feeTier
              token0 {
                id
                symbol
              }
              token1 {
                id
                symbol
              }
            }
          }
        `,
        variables: { limit, offset },
      },
      { headers: { "Content-Type": "application/json" } }
    )
    .then(
      (res: { data: { data: { pools: PoolInfo[] } } }) => res.data.data.pools
    );
}

function getPoolDayData(graphURL: string, poolId: string) {
  return axios
    .post(
      graphURL,
      {
        query: `
          query Pool($id: ID!){
            pool(id: $id) {
              poolDayData(orderBy: date, orderDirection: desc, first: 7, skip: 1) {
                feesUSD
              }
            }
          }
        `,
        variables: { id: poolId },
      },
      { headers: { "Content-Type": "application/json" } }
    )
    .then(
      (res: {
        data: { data: { pool: { poolDayData?: Array<{ feesUSD: string }> } } };
      }) => res.data.data.pool?.poolDayData
    );
}

module.exports = {
  pool: stakingAdapter(
    async (
      provider: ethersType.ethers.providers.Provider,
      contractAddress: string,
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
      const env = getENV(network);
      const block = await provider.getBlock(blockTag);
      const node = new ethereum.Node(provider);
      const multicall = await node.multicall;
      const priceFeed = bridgeWrapperBuild(
        await dfh.getPriceFeeds(network),
        blockTag,
        block,
        network,
        provider
      );

      const pool = await uniswap.V3.pool.getPool(
        network,
        multicall,
        contractAddress
      );
      const [token0, token1, token0PriceUSD, token1PriceUSD] =
        await Promise.all([
          erc20.ConnectedToken.fromAddress(node, pool.token0.address),
          erc20.ConnectedToken.fromAddress(node, pool.token1.address),
          priceFeed(pool.token0.address),
          priceFeed(pool.token1.address),
        ]);
      const [token0Locked, token1Locked] = await multicall.all([
        token0.contract.multicall.balanceOf(contractAddress),
        token1.contract.multicall.balanceOf(contractAddress),
      ]);
      const token0LockedUSD = token0
        .amountInt(token0Locked.toString())
        .float.multipliedBy(token0PriceUSD);
      const token1LockedUSD = token1
        .amountInt(token1Locked.toString())
        .float.multipliedBy(token1PriceUSD);
      const tvl = token0LockedUSD.plus(token1LockedUSD);

      const poolDayData = await getPoolDayData(
        env.graphs,
        contractAddress.toLowerCase()
      );
      const avgFeesUSD = poolDayData
        ? poolDayData
            .reduce((sum, { feesUSD }) => sum.plus(feesUSD), new bn(0))
            .div(7) // average fees by last 7 days
        : new bn(0);
      const aprDay = avgFeesUSD.div(tvl);
      const aprWeek = aprDay.multipliedBy(7);
      const aprMonth = aprDay.multipliedBy(30);
      const aprYear = aprDay.multipliedBy(365);

      return {
        stakeToken: {
          address: contractAddress,
          decimals: 18,
          priceUSD: new bn(tvl)
            .div(new bn(pool.liquidity.toString()).div("1e18"))
            .toString(10),
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
        metrics: {
          tvl: tvl.toString(10),
          aprDay: aprDay.toString(10),
          aprWeek: aprWeek.toString(10),
          aprMonth: aprMonth.toString(10),
          aprYear: aprYear.toString(10),
        },
        wallet: async (walletAddress: string) => {
          const pm =
            await uniswap.V3.positionManager.PositionManager.fromAddress(
              node,
              env.pm
            );
          const router = uniswap.V3.swapRouter.SwapRouter.fromAddress(
            node,
            env.router,
            env.quoter
          );
          const positions = await pm
            .positions(walletAddress)
            .then((positions) =>
              positions.filter(
                (position) =>
                  position.inPool(pool) &&
                  new bn(position.liquidity).isGreaterThan(0)
              )
            );
          const [token0Position, token1Position] = await positions.reduce(
            async (prev, position) => {
              const [pos0, pos1] = await prev;
              const [staked, earned] = await Promise.all([
                position.staked(),
                position.earned(),
              ]);

              return [
                {
                  staked: staked.amount0.float.plus(pos0.staked),
                  stakedUSD: staked.amount0.float
                    .multipliedBy(token0PriceUSD)
                    .plus(pos0.stakedUSD),
                  earned: earned.amount0.float.plus(pos0.earned),
                  earnedUSD: earned.amount0.float
                    .multipliedBy(token0PriceUSD)
                    .plus(pos0.earnedUSD),
                },
                {
                  staked: staked.amount1.float.plus(pos1.staked),
                  stakedUSD: staked.amount1.float
                    .multipliedBy(token1PriceUSD)
                    .plus(pos1.stakedUSD),
                  earned: earned.amount1.float.plus(pos1.earned),
                  earnedUSD: earned.amount1.float
                    .multipliedBy(token1PriceUSD)
                    .plus(pos1.earnedUSD),
                },
              ];
            },
            Promise.resolve([
              {
                staked: new bn(0),
                stakedUSD: new bn(0),
                earned: new bn(0),
                earnedUSD: new bn(0),
              },
              {
                staked: new bn(0),
                stakedUSD: new bn(0),
                earned: new bn(0),
                earnedUSD: new bn(0),
              },
            ])
          );
          const token0Price = await router
            .amountOut(
              uniswap.V3.swapRouter.pathWithFees(
                [token0.address, token1.address],
                pool.fee
              ),
              token0.amountFloat(1).toFixed()
            )
            .then((value) => token1.amountInt(value));

          return {
            staked: {
              [token0.address]: {
                balance: token0Position.staked.toString(10),
                usd: token0Position.stakedUSD.toString(10),
              },
              [token1.address]: {
                balance: token1Position.staked.toString(10),
                usd: token1Position.staked.toString(10),
              },
            },
            earned: {
              [token0.address]: {
                balance: token0Position.earned.toString(10),
                usd: token0Position.earnedUSD.toString(10),
              },
              [token1.address]: {
                balance: token1Position.earned.toString(10),
                usd: token1Position.earnedUSD.toString(10),
              },
            },
            metrics: {
              staking: String(positions.length),
              stakingUSD: token0Position.stakedUSD
                .plus(token1Position.stakedUSD)
                .toString(10),
              earned: String(positions.length),
              earnedUSD: token0Position.earnedUSD
                .plus(token1Position.earnedUSD)
                .toString(10),
            },
            tokens: {
              [token0.address]: {
                balance: token0Position.staked
                  .plus(token0Position.earned)
                  .toString(10),
                usd: token0Position.stakedUSD
                  .plus(token0Position.earnedUSD)
                  .toString(10),
              },
              [token1.address]: {
                balance: token1Position.staked
                  .plus(token1Position.earned)
                  .toString(10),
                usd: token1Position.stakedUSD
                  .plus(token1Position.earnedUSD)
                  .toString(10),
              },
            },
            positions: await Promise.all(
              positions.map((position) =>
                positionView(
                  position,
                  token0Price,
                  token0PriceUSD,
                  token1PriceUSD
                )
              )
            ),
          };
        },
      };
    }
  ),
  automates: {
    contractsResolver: {
      default: contractsResolver(async (provider, options = {}) => {
        const network = await provider
          .getNetwork()
          .then(({ chainId }) => chainId);
        const env = getENV(network);
        const limit = 100;
        const pagesCount = 1;
        const pages = Array.from(new Array(pagesCount).keys()).map(
          (i) => i * limit
        );
        const pools = await pages.reduce<Promise<PoolInfo[]>>(
          async (prev, offset) => {
            const res = await prev;
            const p = await getPools(env.graphs, limit, offset);

            return [...res, ...p];
          },
          Promise.resolve([])
        );

        return pools.map(({ id, feeTier, token0, token1 }) => ({
          name: `${token0.symbol}-${token1.symbol} ${Number(feeTier) / 10000}%`,
          address: id,
          blockchain: "ethereum",
          network: String(network),
          layout: "staking",
          adapter: "pool",
          description: "",
          automate: {
            adapters: ["pool"],
            autorestakeAdapter: "Restake",
          },
          link: `https://app.uniswap.org/#/add/${token0.id}/${token1.id}/${feeTier}`,
        }));
      }),
    },
    deploy: Deploy.adapters({
      Restake: async (
        signer: ethersType.Signer,
        factoryAddress: string,
        prototypeAddress: string,
        contractAddress?: string
      ) => {
        const network = await signer.getChainId();
        const env = getENV(network);

        return {
          deploy: [
            {
              name: "Deploy",
              info: async () => ({
                description: "Deploy your own contract",
                inputs: [
                  Action.input({
                    placeholder: "Position manager address",
                    value: env.pm,
                  }),
                  Action.input({
                    placeholder: "Liquidity pool router address",
                    value: env.router,
                  }),
                  Action.input({
                    placeholder: "Pool address",
                    value: contractAddress ?? "",
                  }),
                  Action.input({
                    placeholder: "Deadline (seconds)",
                    value: "300",
                  }),
                ],
              }),
              can: async (
                positionManager: string,
                liquidityRouter: string,
                pool: string,
                deadline: string
              ) => {
                if (positionManager.toLowerCase() !== env.pm.toLowerCase()) {
                  return new Error("Invalid position manager contract address");
                }
                if (
                  liquidityRouter.toLowerCase() !== env.router.toLowerCase()
                ) {
                  return new Error("Invalid liquidity router contract address");
                }
                if (Number(deadline) < 0) {
                  return new Error("Deadline has already passed");
                }

                return true;
              },
              send: async (
                positionManager: string,
                liquidityRouter: string,
                pool: string,
                deadline: string
              ) =>
                Deploy.deploy(
                  signer,
                  factoryAddress,
                  prototypeAddress,
                  new ethers.utils.Interface(RestakeABI).encodeFunctionData(
                    "init",
                    [positionManager, liquidityRouter, pool, deadline]
                  )
                ),
            },
          ],
        };
      },
    }),
    Restake: async (ethSigner: ethersType.Signer, contractAddress: string) => {
      const signer = new ethereum.Signer(ethSigner);
      const multicall = await signer.multicall;
      const network = await signer.chainId;
      const env = getENV(network);
      const pm = await uniswap.V3.positionManager.PositionManager.fromAddress(
        signer,
        env.pm
      );
      const router = uniswap.V3.swapRouter.SwapRouter.fromAddress(
        signer,
        env.router,
        env.quoter
      );
      const automate = signer.contract(RestakeABI, contractAddress);
      const poolAddress = await automate.contract.pool();
      const pool = await uniswap.V3.pool.getPool(
        network,
        multicall,
        poolAddress
      );
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

      const runParams = async () => {
        const deadline = dayjs()
          .add(await automate.contract.deadline(), "seconds")
          .unix();

        const gasLimit = new bn(
          await automate.contract.estimateGas
            .run(0, deadline)
            .then((v) => v.toString())
        )
          .multipliedBy(1.1)
          .toFixed(0);
        const gasPrice = await signer.provider
          .getGasPrice()
          .then((v) => v.toString());
        const gasFee = new bn(gasLimit).multipliedBy(gasPrice).toFixed(0);

        await automate.contract.estimateGas.run(gasFee, deadline);
        return {
          gasPrice,
          gasLimit,
          calldata: [gasFee, deadline],
        };
      };

      return {
        deposit: {
          name: "automateRestake-deposit",
          methods: {
            positions: async () => {
              const token0Price = await router
                .amountOut(
                  uniswap.V3.swapRouter.pathWithFees(
                    [token0.address, token1.address],
                    pool.fee
                  ),
                  token0.amountFloat(1).toFixed()
                )
                .then((value) => token1.amountInt(value));

              return pm
                .positions(await signer.address)
                .then((positions) =>
                  positions.filter(
                    (position) =>
                      position.inPool(pool) &&
                      new bn(position.liquidity).isGreaterThan(0)
                  )
                )
                .then((positions) =>
                  Promise.all(
                    positions.map((position) =>
                      positionView(
                        position,
                        token0Price,
                        token0PriceUSD,
                        token1PriceUSD
                      )
                    )
                  )
                );
            },
            isApproved: async (tokenId: string) => {
              const approved: string = await pm.contract.contract.getApproved(
                tokenId
              );
              return (
                approved.toLowerCase() ===
                automate.contract.address.toLowerCase()
              );
            },
            approve: async (tokenId: string) => {
              return {
                tx: await pm.contract.contract.approve(
                  automate.contract.address,
                  tokenId
                ),
              };
            },
            canDeposit: async (tokenId: string) => {
              const signerAddress = await signer.address.then((address) =>
                address.toLowerCase()
              );
              const [approved, owner] = await multicall.all([
                pm.contract.multicall.getApproved(tokenId),
                pm.contract.multicall.ownerOf(tokenId),
              ]);
              if (owner.toLowerCase() !== signerAddress) {
                return new Error("Someone else token");
              }
              if (
                approved.toLowerCase() !==
                automate.contract.address.toLowerCase()
              ) {
                return new Error("Token not approved");
              }

              return true;
            },
            deposit: async (tokenId: string) => {
              return {
                tx: await automate.contract.deposit(tokenId),
              };
            },
          },
        },
        refund: {
          name: "automateRestake-refund",
          methods: {
            position: async () => {
              const tokenId = await automate.contract.tokenId();
              if (tokenId.toString() === "0") {
                return null;
              }
              const token0Price = await router
                .amountOut(
                  uniswap.V3.swapRouter.pathWithFees(
                    [token0.address, token1.address],
                    pool.fee
                  ),
                  token0.amountFloat(1).toFixed()
                )
                .then((value) => token1.amountInt(value));

              return positionView(
                Position.fromResponse(
                  pm.contract,
                  tokenId.toNumber(),
                  poolAddress,
                  automate.contract.address,
                  await pm.contract.contract.positions(tokenId.toString())
                ),
                token0Price,
                token0PriceUSD,
                token1PriceUSD
              );
            },
            can: async () => {
              const tokenId = await automate.contract
                .tokenId()
                .then((tokenId: ethersType.BigNumber) => tokenId.toString());
              if (tokenId === "0") {
                return new Error("Token not deposited");
              }

              const ownerAddress = await pm.contract.contract.ownerOf(tokenId);
              if (
                ownerAddress.toLowerCase() !==
                automate.contract.address.toLowerCase()
              ) {
                return new Error("Token already refunded");
              }

              return true;
            },
            refund: async () => ({
              tx: await automate.contract.refund(),
            }),
          },
        },
        run: {
          name: "automateRestake-run",
          methods: {
            runParams,
            run: async () => {
              const params = await runParams();
              if (params instanceof Error) return params;

              const { gasPrice, gasLimit, calldata } = params;
              return {
                tx: await automate.contract.run.apply(automate, [
                  ...calldata,
                  {
                    gasPrice,
                    gasLimit,
                  },
                ]),
              };
            },
          },
        },
        stopLoss: {
          name: "automateRestake-stopLoss",
          methods: {
            startTokens: async () => [pool.token0.address, pool.token1.address],
            autoPath: async (from: string, to: string) => [from, to],
            amountOut: async (path: string[]) => {
              debugo({
                _prefix: "restakeStopLossAmountOut",
                automate: automate.contract.address,
              });
              const exitToken = await erc20.ConnectedToken.fromAddress(
                signer,
                path[path.length - 1]
              );
              const tokenId = await automate.contract
                .tokenId()
                .then((tokenId: ethersType.BigNumber) => tokenId.toString());
              const position = Position.fromResponse(
                pm.contract,
                Number(tokenId),
                poolAddress,
                automate.contract.address,
                await pm.contract.contract.positions(tokenId)
              );
              const { amount0, amount1 } = await position.staked();
              debugo({
                _prefix: "restakeStopLossAmountOut",
                exitToken: exitToken.address,
                tokenId,
                token0: position.token0Address,
                token1: position.token1Address,
                amount0: amount0.toString(),
                amount1: amount1.toString(),
              });

              let amountIn;
              if (
                position.token0Address.toLowerCase() === path[0].toLowerCase()
              ) {
                amountIn = amount1.int.gt(0)
                  ? await router
                      .amountOut(
                        uniswap.V3.swapRouter.pathWithFees(
                          [position.token1Address, position.token0Address],
                          position.fee
                        ),
                        amount1.toFixed()
                      )
                      .then((amountPlus) =>
                        amount0.plus(amount1.token.amountInt(amountPlus))
                      )
                  : amount0;
              } else {
                amountIn = amount0.int.gt(0)
                  ? await router
                      .amountOut(
                        uniswap.V3.swapRouter.pathWithFees(
                          [position.token0Address, position.token1Address],
                          position.fee
                        ),
                        amount0.toFixed()
                      )
                      .then((amountPlus) =>
                        amount1.plus(amount1.token.amountInt(amountPlus))
                      )
                  : amount1;
              }
              debugo({
                _prefix: "restakeStopLossAmountOut",
                amountIn: amountIn ? amountIn.toString() : "0",
              });
              if (!amountIn) {
                return "0";
              }

              const amountOut =
                path[0] === path[path.length - 1]
                  ? amountIn
                  : await router.amountOut(
                      uniswap.V3.swapRouter.pathWithFees(path, position.fee),
                      amountIn.value
                    );
              debugo({
                _prefix: "restakeStopLossAmountOut",
                amountOut: exitToken.amountInt(amountOut.toFixed()).toString(),
              });

              return exitToken.amountInt(amountOut.toFixed()).toString();
            },
            canSetStopLoss: async (
              path: string[],
              amountOut: string,
              amountOutMin: string
            ) => {
              if (path.length <= 1) {
                return new Error("Path too short");
              }
              if (
                ![
                  pool.token0.address.toLowerCase(),
                  pool.token1.address.toLowerCase(),
                ].includes(path[0].toLowerCase())
              ) {
                return new Error("Invalid firt token on the path");
              }
              const exitToken = await erc20.ConnectedToken.fromAddress(
                signer,
                path[path.length - 1]
              );
              if (exitToken.amountFloat(amountOut).int.lte(0)) {
                return new Error("Invalid amount out value");
              }

              return true;
            },
            setStopLoss: async (
              path: string[],
              amountOut: string,
              amountOutMin: string
            ) => {
              const exitToken = await erc20.ConnectedToken.fromAddress(
                signer,
                path[path.length - 1]
              );
              const setStopLossTx = await automate.contract.setStopLoss(
                path,
                pool.fee.toFixed(),
                exitToken.amountFloat(amountOut).toFixed(),
                exitToken.amountFloat(amountOutMin).toFixed()
              );

              return {
                tx: setStopLossTx,
              };
            },
            removeStopLoss: async () => {
              const removeStopLossTx = await automate.contract.setStopLoss(
                [],
                "0",
                "0",
                "0"
              );

              return {
                tx: removeStopLossTx,
              };
            },
            runStopLoss: async () => {
              const runStopLossTx = await automate.contract.runStopLoss(
                0,
                dayjs().add(5, "minutes").unix()
              );

              return {
                tx: runStopLossTx,
              };
            },
          },
        },
        rebalance: {
          name: "automateRestake-rebalance",
          methods: {
            canRebalance: async () => {
              const tokenId = await automate.contract
                .tokenId()
                .then((v: ethersType.BigNumber) => v.toString());
              if (tokenId === "0") {
                return new Error("Token already refunded");
              }

              return true;
            },
            rebalance: async () => {
              const tokenId = await automate.contract
                .tokenId()
                .then((v: ethersType.BigNumber) => v.toString());
              const tickSpacing = uniswap3.sdk.TICK_SPACINGS[pool.fee];
              const position = await pm.contract.contract.positions(tokenId);
              const tickInterval = uniswap3.sdk.nearestUsableTick(
                Math.floor((position.tickUpper - position.tickLower) / 2),
                tickSpacing
              );
              const middleTick = new bn(
                uniswap3.sdk.nearestUsableTick(pool.tickCurrent, tickSpacing)
              );
              const lowerTick = uniswap3.sdk.nearestUsableTick(
                middleTick.minus(tickInterval).toNumber(),
                tickSpacing
              );
              const upperTick = uniswap3.sdk.nearestUsableTick(
                middleTick.plus(tickInterval).toNumber(),
                tickSpacing
              );

              const deadline = dayjs()
                .add(
                  await automate.contract
                    .deadline()
                    .then((v: ethersType.BigNumber) => v.toString()),
                  "seconds"
                )
                .unix();
              const gasLimit = await automate.contract.estimateGas
                .rebalance(1, lowerTick, upperTick, deadline)
                .then((v) => new bn(v.toString()).multipliedBy(1.1).toFixed(0));
              const gasPrice = await signer.provider
                .getGasPrice()
                .then((v) => new bn(v.toString()).multipliedBy(1.1).toFixed(0));
              const gasFee = new bn(gasLimit).multipliedBy(gasPrice).toFixed(0);

              await automate.contract.estimateGas.rebalance(
                gasFee,
                lowerTick,
                upperTick,
                deadline,
                { gasLimit, gasPrice }
              );
              return {
                tx: await automate.contract.rebalance(
                  gasFee,
                  lowerTick,
                  upperTick,
                  deadline,
                  { gasPrice, gasLimit }
                ),
              };
            },
          },
        },
      };
    },
  },
};

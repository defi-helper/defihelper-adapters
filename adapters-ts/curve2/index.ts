import type ethersType from "ethers";
import type BigNumber from "bignumber.js";
import type {
  Provider as MulticallProvider,
  Contract as MulticallContract,
} from "@defihelper/ethers-multicall";
import { bignumber as bn, dayjs, ethers, ethersMulticall, axios } from "../lib";
import { Staking, Action } from "../utils/adapter/base";
import {
  stakingAdapter,
  contractsResolver,
  deployAdapter,
  automateAdapter,
  Deploy,
} from "../utils/ethereum/adapter/base";
import { bridgeWrapperBuild, PriceFeed } from "../utils/coingecko";
import * as cache from "../utils/cache";
import * as ethereum from "../utils/ethereum/base";
import * as erc20 from "../utils/ethereum/erc20";
import * as uniswap from "../utils/ethereum/uniswap";
import * as masterChef from "../utils/ethereum/adapter/masterChef";
import registryABI from "./data/registryABI.json";
import gaugeABI from "./data/gaugeABI.json";
import poolABI from "./data/poolABI.json";
import landingPoolABI from "./data/landingPoolABI.json";
import minterABI from "./data/minterABI.json";
import veCRVABI from "./data/veCRVABI.json";
import feeDistributorABI from "./data/feeDistributorABI.json";
import gaugeControllerABI from "./data/gaugeControllerABI.json";
import gaugeUniswapRestakeABI from "./data/gaugeUniswapRestakeABI.json";
import bridgeTokens from "./data/bridgeTokens.json";

class Pool {
  public readonly pool: MulticallContract;
  public readonly lpToken: MulticallContract;
  public readonly gauge: MulticallContract;

  constructor(
    public readonly connect: {
      multicall: MulticallProvider;
      blockTag: ethereum.BlockNumber;
    },
    public readonly info: {
      lpToken: string;
      gauge: string;
      address: string;
      abi: any;
      coins: Array<{ address: string; decimals: number }>;
    }
  ) {
    this.pool = new ethersMulticall.Contract(info.address, info.abi);
    this.lpToken = erc20.multicallContract(info.lpToken);
    this.gauge = new ethersMulticall.Contract(info.gauge, gaugeABI);
  }

  async balances() {
    const { multicall, blockTag } = this.connect;
    const balances = await multicall.all(
      this.info.coins.map((_, i) => {
        return this.pool.balances(i);
      }),
      { blockTag }
    );

    return balances.map((balance) => balance.toString());
  }

  async underlyingBalance(amount: string) {
    const { multicall, blockTag } = this.connect;
    const [totalSupply] = await multicall.all([this.lpToken.totalSupply()], {
      blockTag,
    });
    const balances = await this.balances();

    return balances.map((balance) =>
      new bn(balance)
        .multipliedBy(amount)
        .div(totalSupply.toString())
        .toFixed(0)
    );
  }
}

class PoolRegistry {
  public readonly registry: MulticallContract;

  constructor(
    public readonly connect: {
      multicall: MulticallProvider;
      blockTag: ethereum.BlockNumber;
    }
  ) {
    this.registry = new ethersMulticall.Contract(
      "0x90E00ACe148ca3b23Ac1bC8C240C2a7Dd9c2d7f5",
      registryABI
    );
  }

  async getInfoForPool(poolAddress: string) {
    const { multicall, blockTag } = this.connect;
    let [coinsAddresses, lpToken] = await multicall.all(
      [
        this.registry.get_coins(poolAddress),
        this.registry.get_lp_token(poolAddress),
      ],
      { blockTag }
    );
    coinsAddresses = coinsAddresses.filter(
      (address: string) =>
        address !== "0x0000000000000000000000000000000000000000"
    );
    if (lpToken === "0x0000000000000000000000000000000000000000") {
      throw new Error(
        `LP token for pool with address "${poolAddress}" not found`
      );
    }
    let [[gauges]] = await multicall.all(
      [this.registry.get_gauges(poolAddress)],
      { blockTag }
    );
    gauges = gauges.filter(
      (address: string) =>
        address !== "0x0000000000000000000000000000000000000000"
    );
    const gauge = gauges[gauges.length - 1];
    if (!gauge || gauge === "0x0000000000000000000000000000000000000000") {
      throw new Error(`Gauge for pool with address "${poolAddress}" not found`);
    }
    const coinsDecimals = await multicall.all(
      coinsAddresses.map((address: string) =>
        erc20.multicallContract(address).decimals()
      )
    );

    return {
      address: poolAddress,
      lpToken,
      gauge,
      coins: coinsAddresses.map((address: string, i: number) => ({
        address,
        decimals: coinsDecimals[i].toString(),
      })),
    };
  }

  async findByLp(lpToken: string) {
    const { multicall, blockTag } = this.connect;
    const [poolAddress] = await multicall.all(
      [this.registry.get_pool_from_lp_token(lpToken)],
      { blockTag }
    );
    if (poolAddress === "0x0000000000000000000000000000000000000000") {
      return poolAddress;
    }

    return this.getInfoForPool(poolAddress);
  }

  async findByGauge(gaugeAddress: string) {
    const { multicall, blockTag } = this.connect;
    const [lpToken] = await multicall.all(
      [new ethersMulticall.Contract(gaugeAddress, gaugeABI).lp_token()],
      {
        blockTag,
      }
    );

    return this.findByLp(lpToken);
  }
}

function e18(v: ethersType.BigNumber) {
  return ethereum.toBN(v).div(1e18);
}

interface UnderlyingBalance {
  address: string;
  decimals: number;
  balance: string;
  balanceUSD: string;
}

type RecursiveUnderlyingBalance = Array<
  RecursiveUnderlyingBalance | UnderlyingBalance
>;

async function getUnderlyingBalance(
  pools: PoolRegistry,
  priceFeed: PriceFeed,
  pool: Pool,
  amount: string
): Promise<RecursiveUnderlyingBalance> {
  const balances = await pool.underlyingBalance(amount);

  return pool.info.coins.reduce<Promise<RecursiveUnderlyingBalance>>(
    async (resultPromise, { address, decimals }, i) => {
      const result = await resultPromise;

      const subpoolInfo = await pools.findByLp(address);
      if (subpoolInfo !== "0x0000000000000000000000000000000000000000") {
        return [
          ...result,
          await getUnderlyingBalance(
            pools,
            priceFeed,
            new Pool(pool.connect, { ...subpoolInfo, abi: pool.info.abi }),
            balances[i]
          ),
        ];
      }
      const balance = new bn(balances[i])
        .div(Number(`1e${decimals}`))
        .toString(10);
      const priceUSD = await priceFeed(address);

      return [
        ...result,
        {
          address,
          decimals,
          balance,
          balanceUSD: new bn(balance).multipliedBy(priceUSD).toString(10),
        },
      ];
    },
    Promise.resolve([])
  );
}

function stakingAdapterFactory(poolABI: any) {
  return stakingAdapter(
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
      const multicall = new ethersMulticall.Provider(provider, network);
      const priceFeed = bridgeWrapperBuild(
        bridgeTokens,
        blockTag,
        block,
        network
      );
      const gaugeController = new ethersMulticall.Contract(
        "0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB",
        gaugeControllerABI
      );
      const crvToken = "0xD533a949740bb3306d119CC777fa900bA034cd52";
      const crvTokenDecimals = 18;
      const crvPriceUSD = await priceFeed(crvToken);
      const minter = new ethersMulticall.Contract(
        "0xd061D61a4d941c39E5453435B6345Dc261C2fcE0",
        minterABI
      );
      const pools = new PoolRegistry({ multicall, blockTag });

      const poolInfo = await pools.findByGauge(contractAddress);
      const pool = new Pool(
        { multicall, blockTag },
        { ...poolInfo, abi: poolABI }
      );
      const [
        stakedTotalSupply,
        inflationRate,
        workingSupply,
        virtualPrice,
        relativeWeight,
      ] = await multicall.all([
        pool.gauge.totalSupply(),
        pool.gauge.inflation_rate(),
        pool.gauge.working_supply(),
        pool.pool.get_virtual_price(),
        gaugeController.gauge_relative_weight(pool.gauge.address),
      ]);
      const stakingTokenDecimals = 18;

      const totalSupplyTokens = await getUnderlyingBalance(
        pools,
        priceFeed,
        pool,
        stakedTotalSupply.toString()
      );
      const stakedTokens = totalSupplyTokens.flat(Infinity);
      const tvl = stakedTokens.reduce(
        (sum: BigNumber, { balanceUSD }) => sum.plus(balanceUSD),
        new bn(0)
      );
      const stakingTokenUSD = tvl.div(
        stakedTokens.reduce(
          (sum: BigNumber, { balance }) => sum.plus(balance),
          new bn(0)
        )
      );

      const aprDay = new bn(e18(inflationRate))
        .multipliedBy(e18(relativeWeight))
        .multipliedBy(86400)
        .div(e18(workingSupply))
        .multipliedBy(0.4)
        .div(e18(virtualPrice))
        .multipliedBy(crvPriceUSD);

      return {
        stakeToken: {
          address: poolInfo.lpToken,
          decimals: stakingTokenDecimals,
          priceUSD: stakingTokenUSD.toString(10),
          parts: stakedTokens.map(
            ({ address, decimals, balance, balanceUSD }) => ({
              address,
              decimals,
              priceUSD: new bn(balanceUSD).div(balance).toString(10),
            })
          ),
        },
        rewardToken: {
          address: crvToken,
          decimals: crvTokenDecimals,
          priceUSD: crvPriceUSD.toString(10),
        },
        metrics: {
          tvl: tvl.toString(10),
          aprDay: aprDay.toString(10),
          aprWeek: aprDay.multipliedBy(7).toString(10),
          aprMonth: aprDay.multipliedBy(30).toString(10),
          aprYear: aprDay.multipliedBy(365).toString(10),
        },
        wallet: async (walletAddress) => {
          const [staked] = await multicall.all([
            pool.gauge.balanceOf(walletAddress),
          ]);
          const gauge = new ethers.Contract(
            pool.info.gauge,
            gaugeABI,
            provider
          );
          const earned = await gauge.callStatic
            .claimable_tokens(walletAddress)
            .then((v) => v.toString());
          const stakedTokens = (
            await getUnderlyingBalance(
              pools,
              priceFeed,
              pool,
              staked.toString()
            )
          ).flat(Infinity);
          const earnedNormalize = new bn(earned.toString())
            .div(1e18)
            .toString(10);
          const earnedUSD = new bn(earnedNormalize)
            .multipliedBy(crvPriceUSD)
            .toString(10);

          return {
            staked: stakedTokens.reduce(
              (result, { address, balance, balanceUSD }) => ({
                ...result,
                [address]: {
                  balance,
                  usd: balanceUSD,
                },
              }),
              {}
            ),
            earned: {
              [crvToken]: {
                balance: earnedNormalize,
                usd: earnedUSD,
              },
            },
            metrics: {
              staking: stakedTokens
                .reduce((sum, { balance }) => sum.plus(balance), new bn(0))
                .toString(10),
              stakingUSD: stakedTokens
                .reduce(
                  (sum, { balanceUSD }) => sum.plus(balanceUSD),
                  new bn(0)
                )
                .toString(10),
              earned: earnedNormalize,
              earnedUSD,
            },
            tokens: Staking.tokens(
              ...stakedTokens
                .concat([
                  {
                    address: crvToken,
                    balance: earnedNormalize,
                    balanceUSD: earnedUSD,
                  },
                ])
                .reduce(
                  (result, { address, balance, balanceUSD }) => [
                    ...result,
                    {
                      token: address,
                      data: {
                        balance,
                        usd: balanceUSD,
                      },
                    },
                  ],
                  []
                )
            ),
          };
        },
        actions: async (walletAddress) => {
          if (options.signer === null) {
            throw new Error(
              "Signer not found, use options.signer for use actions"
            );
          }
          const { signer } = options;
          const rewardTokenContract = erc20
            .contract(provider, crvToken)
            .connect(signer);
          const rewardTokenSymbol = await rewardTokenContract.symbol();
          const stakingTokenContract = erc20.contract(
            signer,
            pool.lpToken.address
          );
          const stakingTokenSymbol = await stakingTokenContract.symbol();
          const stakingContract = new ethers.Contract(
            pool.gauge.address,
            gaugeABI,
            signer
          );
          const minterContract = new ethers.Contract(
            minter.address,
            minterABI,
            signer
          );
          const etherscanAddressURL = "https://etherscan.io/address";

          return {
            stake: {
              name: "staking-stake",
              methods: {
                symbol: () => stakingTokenSymbol,
                link: () =>
                  `${etherscanAddressURL}/${stakingTokenContract.address}`,
                balanceOf: () =>
                  stakingTokenContract
                    .balanceOf(walletAddress)
                    .then((v: ethersType.BigNumber) =>
                      ethereum
                        .toBN(v)
                        .div(`1e${stakingTokenDecimals}`)
                        .toString(10)
                    ),
                isApproved: async (amount: string) => {
                  const allowance = await stakingTokenContract
                    .allowance(walletAddress, stakingContract.address)
                    .then(ethereum.toBN);

                  return allowance.isGreaterThanOrEqualTo(
                    new bn(amount).multipliedBy(`1e${stakingTokenDecimals}`)
                  );
                },
                approve: async (amount: string) => ({
                  tx: await erc20.approveAll(
                    stakingTokenContract,
                    walletAddress,
                    pool.gauge.address,
                    new bn(amount)
                      .multipliedBy(`1e${stakingTokenDecimals}`)
                      .toFixed(0)
                  ),
                }),
                can: async (amount: string) => {
                  const amountInt = new bn(amount).multipliedBy(
                    `1e${stakingTokenDecimals}`
                  );
                  if (amountInt.lte(0)) return Error("Invalid amount");

                  const balance = await stakingTokenContract
                    .balanceOf(walletAddress)
                    .then((v: ethersType.BigNumber) => v.toString());
                  if (amountInt.gt(balance))
                    return Error("Insufficient funds on the balance");

                  return true;
                },
                stake: async (amount: string) => ({
                  tx: await stakingContract.deposit(
                    new bn(amount)
                      .multipliedBy(`1e${stakingTokenDecimals}`)
                      .toFixed(0)
                  ),
                }),
              },
            },
            unstake: {
              name: "staking-unstake",
              methods: {
                symbol: () => stakingTokenSymbol,
                link: () =>
                  `${etherscanAddressURL}/${stakingTokenContract.address}`,
                balanceOf: () =>
                  stakingContract
                    .balanceOf(walletAddress)
                    .then((v: ethersType.BigNumber) =>
                      ethereum
                        .toBN(v)
                        .div(`1e${stakingTokenDecimals}`)
                        .toString(10)
                    ),
                can: async (amount: string) => {
                  const amountInt = new bn(amount).multipliedBy(
                    `1e${stakingTokenDecimals}`
                  );
                  if (amountInt.lte(0)) return Error("Invalid amount");

                  const balance = await stakingContract
                    .balanceOf(walletAddress)
                    .then(ethereum.toBN);
                  if (amountInt.gt(balance))
                    return Error("Amount exceeds balance");

                  return true;
                },
                unstake: async (amount: string) => ({
                  tx: await stakingContract.withdraw(
                    new bn(amount)
                      .multipliedBy(`1e${stakingTokenDecimals}`)
                      .toFixed(0)
                  ),
                }),
              },
            },
            claim: {
              name: "staking-claim",
              methods: {
                symbol: () => rewardTokenSymbol,
                link: () =>
                  `${etherscanAddressURL}/${rewardTokenContract.address}`,
                balanceOf: () =>
                  minterContract
                    .minted(walletAddress, pool.gauge.address)
                    .then((v: ethersType.BigNumber) =>
                      ethereum.toBN(v).div(`1e${crvTokenDecimals}`).toString(10)
                    ),
                can: async () => {
                  const earned = await minterContract
                    .minted(walletAddress, pool.gauge.address)
                    .then(ethereum.toBN);
                  if (new bn(earned).isLessThanOrEqualTo(0)) {
                    return Error("No earnings");
                  }

                  return true;
                },
                claim: async () => ({
                  tx: await minterContract.mint(pool.gauge.address),
                }),
              },
            },
            exit: {
              name: "staking-exit",
              methods: {
                can: async () => {
                  const earned = await minterContract
                    .minted(walletAddress, pool.gauge.address)
                    .then(ethereum.toBN);
                  const balance = await stakingContract
                    .balanceOf(walletAddress)
                    .then(ethereum.toBN);
                  if (
                    earned.isLessThanOrEqualTo(0) &&
                    balance.isLessThanOrEqualTo(0)
                  ) {
                    return Error("No staked");
                  }

                  return true;
                },
                exit: async () => {
                  const earned = await minterContract
                    .minted(walletAddress, pool.gauge.address)
                    .then(ethereum.toBN);
                  if (new bn(earned).isGreaterThan(0)) {
                    await minterContract
                      .mint(pool.gauge.address)
                      .then((tx: ethersType.ContractTransaction) => tx.wait());
                  }

                  const balance = await stakingContract
                    .balanceOf(walletAddress)
                    .then(ethereum.toBN);
                  return {
                    tx: await stakingContract.withdraw(balance.toFixed(0)),
                  };
                },
              },
            },
          };
        },
      };
    }
  );
}

module.exports = {
  staking: stakingAdapterFactory(poolABI),
  stakingLanding: stakingAdapterFactory(landingPoolABI),
};

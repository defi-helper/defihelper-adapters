import type BigNumber from "bignumber.js";
import type ethersType from "ethers";
import { bignumber as bn, ethers, ethersMulticall, dayjs } from "../../../lib";
import { toBN, BlockNumber } from "../base";
import * as erc20 from "../erc20";
import { V2 as uniswap } from "../uniswap";
import { Action } from "../../adapter/base";
import { Staking, Deploy, Automate } from "./base";

export interface Options {
  blockTag: BlockNumber;
}

export interface PoolInfo {
  lpToken: string;
  allocPoint: BigNumber;
  accRewardPerShare: BigNumber;
}

export interface UserInfo {
  amount: BigNumber;
  rewardDebt: BigNumber;
}

export interface MasterChefContext {
  contract: ethersType.Contract;
  options: Options;
}

export interface MasterChefImplementation {
  connect(signer: ethersType.Signer): MasterChefProvider;
  stakingToken(
    this: MasterChefProvider,
    pool: PoolInfo
  ): Promise<string> | string;
  rewardToken(this: MasterChefProvider): Promise<string> | string;
  rewardPerSecond(this: MasterChefProvider): Promise<BigNumber>;
  totalAllocPoint(this: MasterChefProvider): Promise<BigNumber>;
  totalLocked(this: MasterChefProvider, pool: PoolInfo): Promise<BigNumber>;
  poolInfo(
    this: MasterChefProvider,
    poolIndex: string | number
  ): Promise<PoolInfo>;
  userInfo(
    this: MasterChefProvider,
    poolIndex: string | number,
    wallet: string
  ): Promise<UserInfo>;
  pendingReward(
    this: MasterChefProvider,
    poolIndex: string | number,
    wallet: string
  ): Promise<BigNumber>;
  deposit(
    this: MasterChefProvider,
    poolIndex: string | number,
    amount: string | number
  ): Promise<ethersType.ContractTransaction>;
  withdraw(
    this: MasterChefProvider,
    poolIndex: string | number,
    amount: string | number
  ): Promise<ethersType.ContractTransaction>;
}

export type MasterChefProvider = MasterChefContext & MasterChefImplementation;

export const defaultProviderImplementation: Pick<
  MasterChefImplementation,
  | "stakingToken"
  | "totalAllocPoint"
  | "totalLocked"
  | "userInfo"
  | "pendingReward"
  | "deposit"
  | "withdraw"
> = {
  stakingToken({ lpToken }) {
    return lpToken;
  },
  totalAllocPoint() {
    return this.contract
      .totalAllocPoint({ blockTag: this.options.blockTag })
      .then(toBN);
  },
  async totalLocked(pool) {
    const stakingToken = await this.stakingToken(pool);
    return erc20
      .contract(this.contract.provider, stakingToken)
      .balanceOf(this.contract.address, { blockTag: this.options.blockTag })
      .then(toBN);
  },
  userInfo(poolIndex, wallet) {
    return this.contract
      .userInfo(poolIndex, wallet, { blockTag: this.options.blockTag })
      .then(
        ({
          amount,
          rewardDebt,
        }: {
          amount: ethersType.BigNumber;
          rewardDebt: ethersType.BigNumber;
        }) => ({
          amount: toBN(amount),
          rewardDebt: toBN(rewardDebt),
        })
      );
  },
  pendingReward(poolIndex, wallet) {
    return this.contract.pendingRewards(poolIndex, wallet).then(toBN);
  },
  deposit(poolIndex, amount) {
    return this.contract.deposit(poolIndex, amount);
  },
  withdraw(poolIndex, amount) {
    return this.contract.withdraw(poolIndex, amount);
  },
};

type RequiredMethods = Pick<
  MasterChefImplementation,
  "rewardToken" | "rewardPerSecond" | "poolInfo"
>;

export function buildMasterChefProvider(
  contract: ethersType.Contract,
  { blockTag }: Options,
  {
    stakingToken = defaultProviderImplementation.stakingToken,
    rewardToken,
    rewardPerSecond,
    totalAllocPoint = defaultProviderImplementation.totalAllocPoint,
    totalLocked = defaultProviderImplementation.totalLocked,
    poolInfo,
    userInfo = defaultProviderImplementation.userInfo,
    pendingReward = defaultProviderImplementation.pendingReward,
    deposit = defaultProviderImplementation.deposit,
    withdraw = defaultProviderImplementation.withdraw,
  }: RequiredMethods &
    Partial<Extract<MasterChefImplementation, RequiredMethods>>
): MasterChefProvider {
  const options = { blockTag };
  return {
    contract,
    options,
    connect(signer) {
      this.contract = contract.connect(signer);
      return this;
    },
    stakingToken(pool) {
      return stakingToken.call(this, pool);
    },
    rewardToken() {
      return rewardToken.call(this);
    },
    poolInfo(poolIndex) {
      return poolInfo.call(this, poolIndex);
    },
    rewardPerSecond() {
      return rewardPerSecond.call(this);
    },
    totalAllocPoint() {
      return totalAllocPoint.call(this);
    },
    totalLocked(pool) {
      return totalLocked.call(this, pool);
    },
    userInfo(poolIndex, wallet) {
      return userInfo.call(this, poolIndex, wallet);
    },
    pendingReward(poolIndex, wallet) {
      return pendingReward.call(this, poolIndex, wallet);
    },
    deposit(poolIndex, amount) {
      return deposit.call(this, poolIndex, amount);
    },
    withdraw(poolIndex, amount) {
      return withdraw.call(this, poolIndex, amount);
    },
  };
}

export function stakingActionComponents({
  masterChefProvider,
  poolIndex,
  poolInfo,
  signer,
  etherscanAddressURL,
}: {
  masterChefProvider: MasterChefProvider;
  poolIndex: number;
  poolInfo: PoolInfo;
  signer: ethersType.Signer | null;
  etherscanAddressURL: string;
}): Staking.Actions {
  return async (walletAddress) => {
    if (!signer) {
      throw new Error("Signer not found, use options.signer for use actions");
    }
    masterChefProvider.connect(signer);
    const rewardTokenContract = erc20
      .contract(
        masterChefProvider.contract.provider,
        await masterChefProvider.rewardToken()
      )
      .connect(signer);
    const stakingTokenContract = erc20
      .contract(
        masterChefProvider.contract.provider,
        await masterChefProvider.stakingToken(poolInfo)
      )
      .connect(signer);
    const [
      rewardTokenSymbol,
      rewardTokenDecimals,
      stakingTokenSymbol,
      stakingTokenDecimals,
    ] = await Promise.all([
      rewardTokenContract.symbol(),
      rewardTokenContract.decimals().then(toBN),
      stakingTokenContract.symbol(),
      stakingTokenContract.decimals().then(toBN),
    ]);

    return {
      stake: {
        name: "staking-stake",
        methods: {
          symbol: () => stakingTokenSymbol,
          link: () => `${etherscanAddressURL}/${stakingTokenContract.address}`,
          balanceOf: () =>
            stakingTokenContract
              .balanceOf(walletAddress)
              .then((v: ethersType.BigNumber) =>
                toBN(v).div(`1e${stakingTokenDecimals}`).toString(10)
              ),
          isApproved: async (amount: string) => {
            const allowance = await stakingTokenContract
              .allowance(walletAddress, masterChefProvider.contract.address)
              .then(toBN);

            return allowance.isGreaterThanOrEqualTo(
              new bn(amount).multipliedBy(`1e${stakingTokenDecimals}`)
            );
          },
          approve: async (amount: string) => ({
            tx: await erc20.approveAll(
              stakingTokenContract,
              walletAddress,
              masterChefProvider.contract.address,
              new bn(amount)
                .multipliedBy(`1e${stakingTokenDecimals}`)
                .toFixed(0)
            ),
          }),
          can: async (amount: string) => {
            if (amount === "") return Error("Invalid amount");

            const amountInt = new bn(amount).multipliedBy(
              `1e${stakingTokenDecimals}`
            );
            if (amountInt.isNaN() || amountInt.lte(0))
              return Error("Invalid amount");

            const balance = await stakingTokenContract
              .balanceOf(walletAddress)
              .then(toBN);
            if (amountInt.gt(balance))
              return Error("Insufficient funds on the balance");

            return true;
          },
          stake: async (amount: string) => ({
            tx: await masterChefProvider.deposit(
              poolIndex,
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
          link: () => `${etherscanAddressURL}/${stakingTokenContract.address}`,
          balanceOf: () =>
            masterChefProvider
              .userInfo(poolIndex, walletAddress)
              .then(({ amount }) =>
                amount.div(`1e${stakingTokenDecimals}`).toString(10)
              ),
          can: async (amount) => {
            if (amount === "") return Error("Invalid amount");

            const amountInt = new bn(amount).multipliedBy(
              `1e${stakingTokenDecimals}`
            );
            if (amountInt.isNaN() || amountInt.lte(0))
              return Error("Invalid amount");

            const userInfo = await masterChefProvider.userInfo(
              poolIndex,
              walletAddress
            );
            if (amountInt.isGreaterThan(userInfo.amount)) {
              return Error("Amount exceeds balance");
            }

            return true;
          },
          unstake: async (amount) => ({
            tx: await masterChefProvider.withdraw(
              poolIndex,
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
          link: () => `${etherscanAddressURL}/${rewardTokenContract.address}`,
          balanceOf: () =>
            masterChefProvider
              .pendingReward(poolIndex, walletAddress)
              .then((earned) =>
                earned.div(`1e${rewardTokenDecimals}`).toString(10)
              ),
          can: async () => {
            const earned = await masterChefProvider.pendingReward(
              poolIndex,
              walletAddress
            );
            if (earned.isLessThanOrEqualTo(0)) {
              return Error("No earnings");
            }

            return true;
          },
          claim: async () => ({
            tx: await masterChefProvider.deposit(poolIndex, 0),
          }),
        },
      },
      exit: {
        name: "staking-exit",
        methods: {
          can: async () => {
            const earned = await masterChefProvider.pendingReward(
              poolIndex,
              walletAddress
            );
            const { amount } = await masterChefProvider.userInfo(
              poolIndex,
              walletAddress
            );
            if (
              earned.isLessThanOrEqualTo(0) &&
              amount.isLessThanOrEqualTo(0)
            ) {
              return Error("No staked");
            }

            return true;
          },
          exit: async () => {
            const { amount } = await masterChefProvider.userInfo(
              poolIndex,
              walletAddress
            );
            if (amount.isGreaterThan(0)) {
              await masterChefProvider
                .withdraw(poolIndex, amount.toFixed(0))
                .then((tx: ethersType.ContractTransaction) => tx.wait());
            }

            return { tx: await masterChefProvider.deposit(poolIndex, 0) };
          },
        },
      },
    };
  };
}

export function stakingAutomateDeployTabs({
  liquidityRouter: router,
  stakingAddress,
  poolsLoader,
  automateABI,
}: {
  liquidityRouter: string;
  stakingAddress: string;
  poolsLoader: () => Promise<Array<{ stakingToken: string; index: number }>>;
  automateABI?: any;
}): Deploy.Adapter {
  return async (
    signer,
    factoryAddress,
    prototypeAddress,
    contractAddress = undefined
  ) => {
    const pools = await poolsLoader();
    let poolIndex = pools[0]?.index ?? 0;
    if (contractAddress) {
      poolIndex =
        pools.find(
          ({ stakingToken }) =>
            stakingToken.toLowerCase() === contractAddress.toLowerCase()
        )?.index ?? poolIndex;
    }

    return {
      deploy: [
        {
          name: "Deploy",
          info: async () => ({
            description: "Deploy your own contract",
            inputs: [
              Action.input({
                placeholder: "Liquidity pool router address",
                value: router,
              }),
              Action.input({
                placeholder: "Target pool index",
                value: poolIndex.toString(),
              }),
              Action.input({
                placeholder: "Slippage (percent)",
                value: "1",
              }),
              Action.input({
                placeholder: "Deadline (seconds)",
                value: "300",
              }),
            ],
          }),
          can: async (_, pool, slippage, deadline) => {
            if (!pools.find(({ index }) => index === parseInt(pool, 10)))
              return new Error("Invalid pool index");
            if (slippage < 0 || slippage > 100)
              return new Error("Invalid slippage percent");
            if (deadline < 0) return new Error("Deadline has already passed");

            return true;
          },
          send: async (router, pool, slippage, deadline) =>
            Deploy.deploy(
              signer,
              factoryAddress,
              prototypeAddress,
              new ethers.utils.Interface(
                automateABI ?? [
                  {
                    inputs: [
                      {
                        internalType: "address",
                        name: "_staking",
                        type: "address",
                      },
                      {
                        internalType: "address",
                        name: "_liquidityRouter",
                        type: "address",
                      },
                      {
                        internalType: "uint256",
                        name: "_pool",
                        type: "uint256",
                      },
                      {
                        internalType: "uint16",
                        name: "_slippage",
                        type: "uint16",
                      },
                      {
                        internalType: "uint16",
                        name: "_deadline",
                        type: "uint16",
                      },
                    ],
                    name: "init",
                    outputs: [],
                    stateMutability: "nonpayable",
                    type: "function",
                  },
                ]
              ).encodeFunctionData("init", [
                stakingAddress,
                router,
                pool,
                Math.floor(slippage * 100),
                deadline,
              ])
            ),
        },
      ],
    };
  };
}

export function stakingPairAutomateAdapter({
  masterChefProvider,
  automateABI,
  stakingABI,
  routeTokens,
}: {
  masterChefProvider: MasterChefProvider;
  automateABI: any;
  stakingABI: any;
  routeTokens: string[];
}): Automate.Adapter {
  return async (signer, contractAddress) => {
    if (!signer.provider) throw new Error("Provider not found");
    const provider = signer.provider;
    const signerAddress = await signer.getAddress();
    const automate = new ethers.Contract(contractAddress, automateABI, signer);
    const stakingTokenAddress = await automate.stakingToken();
    const stakingToken = erc20.contract(signer, stakingTokenAddress);
    const stakingTokenDecimals = await stakingToken
      .decimals()
      .then((v: ethersType.BigNumber) => v.toString());
    const poolId = await automate
      .pool()
      .then((v: ethersType.BigNumber) => v.toString());

    const deposit: Automate.AdapterActions["deposit"] = {
      name: "automateRestake-deposit",
      methods: {
        balanceOf: () =>
          stakingToken
            .balanceOf(signerAddress)
            .then((v: ethersType.BigNumber) =>
              toBN(v).div(`1e${stakingTokenDecimals}`).toString(10)
            ),
        canTransfer: async (amount: string) => {
          const signerBalance = await stakingToken
            .balanceOf(signerAddress)
            .then(toBN);
          const amountInt = new bn(amount).multipliedBy(
            `1e${stakingTokenDecimals}`
          );
          if (amountInt.lte(0)) {
            return Error("Invalid amount");
          }
          if (amountInt.gt(signerBalance)) {
            return Error("Insufficient funds on the balance");
          }

          return true;
        },
        transfer: async (amount: string) => ({
          tx: await stakingToken.transfer(
            automate.address,
            new bn(amount).multipliedBy(`1e${stakingTokenDecimals}`).toFixed(0)
          ),
        }),
        transferred: () =>
          stakingToken
            .balanceOf(automate.address)
            .then((v: ethersType.BigNumber) =>
              toBN(v).div(`1e${stakingTokenDecimals}`).toString(10)
            ),
        canDeposit: async () => {
          const automateBalance = await stakingToken
            .balanceOf(automate.address)
            .then(toBN);
          if (automateBalance.lte(0)) {
            return new Error(
              "Insufficient funds on the automate contract balance"
            );
          }
          const automateOwner = await automate.owner();
          if (signerAddress.toLowerCase() !== automateOwner.toLowerCase()) {
            return new Error("Someone else contract");
          }

          return true;
        },
        deposit: async () => ({
          tx: await automate.deposit(),
        }),
      },
    };
    const refund: Automate.AdapterActions["refund"] = {
      name: "automateRestake-refund",
      methods: {
        staked: () =>
          masterChefProvider
            .userInfo(poolId, automate.address)
            .then(({ amount }) =>
              amount.div(`1e${stakingTokenDecimals}`).toString(10)
            ),
        can: async () => {
          const automateStaked = await masterChefProvider
            .userInfo(poolId, automate.address)
            .then(({ amount }) => amount);
          if (automateStaked.lte(0)) {
            return new Error(
              "Insufficient funds on the automate contract balance"
            );
          }
          const automateOwner = await automate.owner();
          if (signerAddress.toLowerCase() !== automateOwner.toLowerCase()) {
            return new Error("Someone else contract");
          }

          return true;
        },
        refund: async () => ({
          tx: await automate.refund(),
        }),
      },
    };
    const migrate: Automate.AdapterActions["migrate"] = {
      name: "automateRestake-migrate",
      methods: {
        staked: () =>
          masterChefProvider
            .userInfo(poolId, signerAddress)
            .then(({ amount }) =>
              amount.div(`1e${stakingTokenDecimals}`).toString(10)
            ),
        canWithdraw: async () => {
          const ownerStaked = await masterChefProvider
            .userInfo(poolId, signerAddress)
            .then(({ amount }) => amount);
          if (ownerStaked.lte(0)) {
            return new Error("Insufficient funds on the staking");
          }

          return true;
        },
        withdraw: async () => {
          const amount = await masterChefProvider
            .userInfo(poolId, signerAddress)
            .then(({ amount }) => amount);

          return {
            tx: await masterChefProvider.withdraw(poolId, amount.toFixed(0)),
          };
        },
        ...deposit.methods,
      },
    };
    const runParams = async () => {
      const multicall = new ethersMulticall.Provider(provider);
      await multicall.init();
      const automateMulticall = new ethersMulticall.Contract(
        contractAddress,
        automateABI
      );
      const stakingTokenMulticall =
        uniswap.pair.multicallContract(stakingTokenAddress);

      const [
        routerAddress,
        slippagePercent,
        deadlineSeconds,
        token0Address,
        token1Address,
        rewardTokenAddress,
      ] = await multicall.all([
        automateMulticall.liquidityRouter(),
        automateMulticall.slippage(),
        automateMulticall.deadline(),
        stakingTokenMulticall.token0(),
        stakingTokenMulticall.token1(),
        automateMulticall.rewardToken(),
      ]);
      const rewardToken = erc20.contract(provider, rewardTokenAddress);
      const rewardTokenBalance = await rewardToken
        .balanceOf(contractAddress)
        .then(toBN);
      const pendingReward = await masterChefProvider.pendingReward(
        poolId,
        contractAddress
      );

      const earned = pendingReward.plus(rewardTokenBalance);
      if (earned.toString(10) === "0") return new Error("No earned");
      const router = uniswap.router.contract(provider, routerAddress);

      const slippage = 1 - slippagePercent / 10000;
      const token0AmountIn = new bn(earned.toString(10)).div(2).toFixed(0);
      const swap0 = [[rewardTokenAddress, token0Address], "0"];
      if (token0Address.toLowerCase() !== rewardTokenAddress.toLowerCase()) {
        const { path, amountOut } = await uniswap.router.autoRoute(
          router,
          token0AmountIn,
          rewardTokenAddress,
          token0Address,
          routeTokens
        );
        swap0[0] = path;
        swap0[1] = new bn(amountOut.toString())
          .multipliedBy(slippage)
          .toFixed(0);
      }
      const token1AmountIn = new bn(earned.toString(10))
        .minus(token0AmountIn)
        .toFixed(0);
      const swap1 = [[rewardTokenAddress, token1Address], "0"];
      if (token1Address.toLowerCase() !== rewardTokenAddress.toLowerCase()) {
        const { path, amountOut } = await uniswap.router.autoRoute(
          router,
          token1AmountIn,
          rewardTokenAddress,
          token1Address,
          routeTokens
        );
        swap1[0] = path;
        swap1[1] = new bn(amountOut.toString())
          .multipliedBy(slippage)
          .toFixed(0);
      }

      const deadline = dayjs().add(deadlineSeconds, "seconds").unix();

      const gasLimit = new bn(
        await automate.estimateGas
          .run(0, deadline, swap0, swap1)
          .then((v) => v.toString())
      )
        .multipliedBy(1.1)
        .toFixed(0);
      const gasPrice = await signer.getGasPrice().then((v) => v.toString());
      const gasFee = new bn(gasLimit).multipliedBy(gasPrice).toFixed(0);

      await automate.estimateGas.run(gasFee, deadline, swap0, swap1);
      return {
        gasPrice,
        gasLimit,
        calldata: [gasFee, deadline, swap0, swap1],
      };
    };
    const run = async () => {
      const params = await runParams();
      if (params instanceof Error) return params;

      const { gasPrice, gasLimit, calldata } = params;
      return automate.run.apply(automate, [
        ...calldata,
        {
          gasPrice,
          gasLimit,
        },
      ]);
    };

    return {
      contract: stakingTokenAddress,
      deposit,
      refund,
      migrate,
      runParams,
      run,
    };
  };
}

export function stakingSingleAutomateAdapter({
  masterChefProvider,
  automateABI,
  stakingABI,
  routeTokens,
}: {
  masterChefProvider: MasterChefProvider;
  automateABI: any;
  stakingABI: any;
  routeTokens: string[];
}): Automate.Adapter {
  return async (signer, contractAddress) => {
    if (!signer.provider) throw new Error("Provider not found");
    const provider = signer.provider;
    const signerAddress = await signer.getAddress();
    const automate = new ethers.Contract(contractAddress, automateABI, signer);
    const stakingAddress = await automate.staking();
    const staking = new ethers.Contract(stakingAddress, stakingABI, signer);
    const stakingTokenAddress = await automate.stakingToken();
    const stakingToken = erc20.contract(signer, stakingTokenAddress);
    const stakingTokenDecimals = await stakingToken
      .decimals()
      .then((v: ethersType.BigNumber) => v.toString());
    const poolId = await automate
      .pool()
      .then((v: ethersType.BigNumber) => v.toString());

    const deposit: Automate.AdapterActions["deposit"] = {
      name: "automateRestake-deposit",
      methods: {
        balanceOf: () =>
          stakingToken
            .balanceOf(signerAddress)
            .then((v: ethersType.BigNumber) =>
              toBN(v).div(`1e${stakingTokenDecimals}`).toString(10)
            ),
        canTransfer: async (amount: string) => {
          const signerBalance = await stakingToken
            .balanceOf(signerAddress)
            .then(toBN);
          const amountInt = new bn(amount).multipliedBy(
            `1e${stakingTokenDecimals}`
          );
          if (amountInt.lte(0)) {
            return Error("Invalid amount");
          }
          if (amountInt.gt(signerBalance)) {
            return Error("Insufficient funds on the balance");
          }

          return true;
        },
        transfer: async (amount: string) => ({
          tx: await stakingToken.transfer(
            automate.address,
            new bn(amount).multipliedBy(`1e${stakingTokenDecimals}`).toFixed(0)
          ),
        }),
        transferred: () =>
          stakingToken
            .balanceOf(automate.address)
            .then((v: ethersType.BigNumber) =>
              toBN(v).div(`1e${stakingTokenDecimals}`).toString(10)
            ),
        canDeposit: async () => {
          const automateBalance = await stakingToken
            .balanceOf(automate.address)
            .then(toBN);
          if (automateBalance.lte(0)) {
            return new Error(
              "Insufficient funds on the automate contract balance"
            );
          }
          const automateOwner = await automate.owner();
          if (signerAddress.toLowerCase() !== automateOwner.toLowerCase()) {
            return new Error("Someone else contract");
          }

          return true;
        },
        deposit: async () => ({
          tx: await automate.deposit(),
        }),
      },
    };
    const refund: Automate.AdapterActions["refund"] = {
      name: "automateRestake-refund",
      methods: {
        staked: () =>
          masterChefProvider
            .userInfo(poolId, automate.address)
            .then(({ amount }) =>
              amount.div(`1e${stakingTokenDecimals}`).toString(10)
            ),
        can: async () => {
          const automateStaked = await masterChefProvider
            .userInfo(poolId, automate.address)
            .then(({ amount }) => amount);
          if (automateStaked.lte(0)) {
            return new Error(
              "Insufficient funds on the automate contract balance"
            );
          }
          const automateOwner = await automate.owner();
          if (signerAddress.toLowerCase() !== automateOwner.toLowerCase()) {
            return new Error("Someone else contract");
          }

          return true;
        },
        refund: async () => ({
          tx: await automate.refund(),
        }),
      },
    };
    const migrate: Automate.AdapterActions["migrate"] = {
      name: "automateRestake-migrate",
      methods: {
        staked: () =>
          masterChefProvider
            .userInfo(poolId, signerAddress)
            .then(({ amount }) =>
              amount.div(`1e${stakingTokenDecimals}`).toString(10)
            ),
        canWithdraw: async () => {
          const ownerStaked = await masterChefProvider
            .userInfo(poolId, signerAddress)
            .then(({ amount }) => amount);
          if (ownerStaked.lte(0)) {
            return new Error("Insufficient funds on the balance");
          }

          return true;
        },
        withdraw: async () => {
          const amount = await masterChefProvider
            .userInfo(poolId, signerAddress)
            .then(({ amount }) => amount);

          return {
            tx: await masterChefProvider.withdraw(poolId, amount.toFixed(0)),
          };
        },
        ...deposit.methods,
      },
    };
    const runParams = async () => {
      const multicall = new ethersMulticall.Provider(provider);
      await multicall.init();
      const automateMulticall = new ethersMulticall.Contract(
        contractAddress,
        automateABI
      );

      const [
        routerAddress,
        slippagePercent,
        deadlineSeconds,
        rewardTokenAddress,
      ] = await multicall.all([
        automateMulticall.liquidityRouter(),
        automateMulticall.slippage(),
        automateMulticall.deadline(),
        automateMulticall.rewardToken(),
      ]);

      const rewardToken = erc20.contract(provider, rewardTokenAddress);
      const rewardTokenBalance = await rewardToken
        .balanceOf(contractAddress)
        .then(toBN);
      const pendingReward = await masterChefProvider.pendingReward(
        poolId,
        contractAddress
      );

      const earned = pendingReward.plus(rewardTokenBalance);
      if (earned.toString(10) === "0") return new Error("No earned");

      const router = uniswap.router.contract(provider, routerAddress);
      const slippage = 1 - slippagePercent / 10000;
      const tokenAmountIn = earned.toFixed(0);
      const swap = [[rewardTokenAddress, stakingTokenAddress], "0"];
      if (
        stakingTokenAddress.toLowerCase() !== rewardTokenAddress.toLowerCase()
      ) {
        const { path, amountOut } = await uniswap.router.autoRoute(
          router,
          tokenAmountIn,
          rewardTokenAddress,
          stakingTokenAddress,
          routeTokens
        );
        swap[0] = path;
        swap[1] = new bn(amountOut.toString())
          .multipliedBy(slippage)
          .toFixed(0);
      }

      const deadline = dayjs().add(deadlineSeconds, "seconds").unix();

      const gasLimit = new bn(
        await automate.estimateGas
          .run(0, deadline, swap)
          .then((v) => v.toString())
      )
        .multipliedBy(1.1)
        .toFixed(0);
      const gasPrice = await signer.getGasPrice().then((v) => v.toString());
      const gasFee = new bn(gasLimit).multipliedBy(gasPrice).toFixed(0);

      await automate.estimateGas.run(gasFee, deadline, swap);
      return {
        gasPrice,
        gasLimit,
        calldata: [gasFee, deadline, swap],
      };
    };
    const run = async () => {
      const params = await runParams();
      if (params instanceof Error) return params;

      const { gasPrice, gasLimit, calldata } = params;
      return automate.run.apply(automate, [
        ...calldata,
        {
          gasPrice,
          gasLimit,
        },
      ]);
    };

    return {
      contract: stakingTokenAddress,
      deposit,
      refund,
      migrate,
      runParams,
      run,
    };
  };
}

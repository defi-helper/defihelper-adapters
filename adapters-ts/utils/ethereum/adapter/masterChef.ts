import type BigNumber from "bignumber.js";
import type ethers from "ethers";
import { bignumber as bn } from "../../../lib";
import { toBN, BlockNumber } from "../base";
import * as erc20 from "../erc20";
import { Action, Staking } from "./base";

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
  contract: ethers.Contract;
  options: Options;
}

export interface MasterChefImplementation {
  connect(signer: ethers.Signer): MasterChefProvider;
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
  ): Promise<ethers.ContractTransaction>;
  withdraw(
    this: MasterChefProvider,
    poolIndex: string | number,
    amount: string | number
  ): Promise<ethers.ContractTransaction>;
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
          amount: ethers.BigNumber;
          rewardDebt: ethers.BigNumber;
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
  contract: ethers.Contract,
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

export async function buildMasterChefActionTabs(
  masterChefProvider: MasterChefProvider,
  {
    poolIndex,
    poolInfo,
    signer,
    etherscanAddressURL,
  }: {
    poolIndex: number;
    poolInfo: PoolInfo;
    signer: ethers.Signer;
    etherscanAddressURL: string;
  }
): Promise<Staking.Actions> {
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
  const [rewardTokenSymbol, stakingTokenSymbol, stakingTokenDecimals] =
    await Promise.all([
      rewardTokenContract.symbol(),
      stakingTokenContract.symbol(),
      stakingTokenContract.decimals().then(toBN),
    ]);

  return async (walletAddress) => ({
    stake: [
      Action.tab(
        "Stake",
        async () => ({
          description: `Stake your [${stakingTokenSymbol}](${etherscanAddressURL}/${stakingTokenContract.address}) tokens to contract`,
          inputs: [
            Action.input({
              placeholder: "amount",
              value: await stakingTokenContract
                .balanceOf(walletAddress)
                .then((v: ethers.BigNumber) =>
                  toBN(v).div(`1e${stakingTokenDecimals}`).toString(10)
                ),
            }),
          ],
        }),
        async (amount) => {
          const amountInt = new bn(amount).multipliedBy(
            `1e${stakingTokenDecimals}`
          );
          if (amountInt.lte(0)) return Error("Invalid amount");

          const balance = await stakingTokenContract
            .balanceOf(walletAddress)
            .then(toBN);
          if (amountInt.gt(balance))
            return Error("Insufficient funds on the balance");

          return true;
        },
        async (amount) => {
          const amountInt = new bn(amount).multipliedBy(
            `1e${stakingTokenDecimals}`
          );
          await erc20.approveAll(
            stakingTokenContract,
            walletAddress,
            masterChefProvider.contract.address,
            amountInt.toFixed(0)
          );

          return {
            tx: await masterChefProvider.deposit(
              poolIndex,
              amountInt.toFixed(0)
            ),
          };
        }
      ),
    ],
    unstake: [
      Action.tab(
        "Unstake",
        async () => {
          const { amount } = await masterChefProvider.userInfo(
            poolIndex,
            walletAddress
          );

          return {
            description: `Unstake your [${stakingTokenSymbol}](${etherscanAddressURL}/${stakingTokenContract.address}) tokens from contract`,
            inputs: [
              Action.input({
                placeholder: "amount",
                value: amount.div(`1e${stakingTokenDecimals}`).toString(10),
              }),
            ],
          };
        },
        async (amount) => {
          const amountInt = new bn(amount).multipliedBy(
            `1e${stakingTokenDecimals}`
          );
          if (amountInt.lte(0)) return Error("Invalid amount");

          const userInfo = await masterChefProvider.userInfo(
            poolIndex,
            walletAddress
          );
          if (amountInt.isGreaterThan(userInfo.amount)) {
            return Error("Amount exceeds balance");
          }

          return true;
        },
        async (amount) => {
          const amountInt = new bn(amount).multipliedBy(
            `1e${stakingTokenDecimals}`
          );

          return {
            tx: await masterChefProvider.withdraw(
              poolIndex,
              amountInt.toFixed(0)
            ),
          };
        }
      ),
    ],
    claim: [
      Action.tab(
        "Claim",
        async () => ({
          description: `Claim your [${rewardTokenSymbol}](${etherscanAddressURL}/${rewardTokenContract.address}) reward`,
        }),
        async () => {
          const earned = await masterChefProvider.pendingReward(
            poolIndex,
            walletAddress
          );
          if (earned.isLessThanOrEqualTo(0)) {
            return Error("No earnings");
          }

          return true;
        },
        async () => {
          return { tx: await masterChefProvider.deposit(poolIndex, 0) };
        }
      ),
    ],
    exit: [
      Action.tab(
        "Exit",
        async () => ({
          description: "Get all tokens from contract",
        }),
        async () => {
          const earned = await masterChefProvider.pendingReward(
            poolIndex,
            walletAddress
          );
          const { amount } = await masterChefProvider.userInfo(
            poolIndex,
            walletAddress
          );
          if (earned.isLessThanOrEqualTo(0) && amount.isLessThanOrEqualTo(0)) {
            return Error("No staked");
          }

          return true;
        },
        async () => {
          const { amount } = await masterChefProvider.userInfo(
            poolIndex,
            walletAddress
          );
          if (amount.isGreaterThan(0)) {
            await masterChefProvider.withdraw(poolIndex, amount.toFixed(0));
          }

          return { tx: await masterChefProvider.deposit(poolIndex, 0) };
        }
      ),
    ],
  });
}

export async function buildMasterChefActions(
  masterChefProvider: MasterChefProvider,
  {
    poolIndex,
    poolInfo,
    signer,
    etherscanAddressURL,
  }: {
    poolIndex: number;
    poolInfo: PoolInfo;
    signer: ethers.Signer;
    etherscanAddressURL: string;
  }
): Promise<Staking.Actions> {
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

  return async (walletAddress) => ({
    stake: Action.component("staking-stake", {
      symbol: () => stakingTokenSymbol,
      link: () => `${etherscanAddressURL}/${stakingTokenContract.address}`,
      balanceOf: () =>
        stakingTokenContract
          .balanceOf(walletAddress)
          .then((v: ethers.BigNumber) =>
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
      approve: (amount: string) => ({
        tx: erc20.approveAll(
          stakingTokenContract,
          walletAddress,
          masterChefProvider.contract.address,
          new bn(amount).multipliedBy(`1e${stakingTokenDecimals}`).toFixed(0)
        ),
      }),
      can: async (amount: string) => {
        const amountInt = new bn(amount).multipliedBy(
          `1e${stakingTokenDecimals}`
        );
        if (amountInt.lte(0)) return Error("Invalid amount");

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
          new bn(amount).multipliedBy(`1e${stakingTokenDecimals}`).toFixed(0)
        ),
      }),
    }),
    unstake: Action.component("staking-unstake", {
      symbol: () => stakingTokenSymbol,
      link: () => `${etherscanAddressURL}/${stakingTokenContract.address}`,
      balanceOf: () =>
        masterChefProvider
          .userInfo(poolIndex, walletAddress)
          .then(({ amount }) =>
            amount.div(`1e${stakingTokenDecimals}`).toString(10)
          ),
      can: async (amount) => {
        const amountInt = new bn(amount).multipliedBy(
          `1e${stakingTokenDecimals}`
        );
        if (amountInt.lte(0)) return Error("Invalid amount");

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
          new bn(amount).multipliedBy(`1e${stakingTokenDecimals}`).toFixed(0)
        ),
      }),
    }),
    claim: Action.component("staking-claim", {
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
    }),
    exit: Action.component("staking-exit", {
      can: async () => {
        const earned = await masterChefProvider.pendingReward(
          poolIndex,
          walletAddress
        );
        const { amount } = await masterChefProvider.userInfo(
          poolIndex,
          walletAddress
        );
        if (earned.isLessThanOrEqualTo(0) && amount.isLessThanOrEqualTo(0)) {
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
          await masterChefProvider.withdraw(poolIndex, amount.toFixed(0));
        }

        return { tx: await masterChefProvider.deposit(poolIndex, 0) };
      },
    }),
  });
}
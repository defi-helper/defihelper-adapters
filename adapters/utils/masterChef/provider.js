const { bn } = require('../../lib');
const { ethereum } = require('../ethereum');
const AutomateActions = require('../automate/actions');

/**
 * @typedef {{ blockTag: string | number }} Options
 */
/**
 * @typedef {{
 * 	lpToken: string;
 * 	allocPoint: BigNumber;
 * 	accRewardPerShare: BigNumber;
 * }} PoolInfo
 */
/**
 * @typedef {{
 * 	amount: BigNumber;
 * 	rewardDebt: BigNumber;
 * }} UserInfo
 */
/**
 * @typedef {{
 * 	contract: ethers.Contract;
 * 	options: Options;
 * }} MasterChefContext
 */
/**
 * @typedef {{
 *  connect(signer: ethers.Wallet): MasterChefProvider;
 * 	stakingToken(this: MasterChefProvider, pool: PoolInfo): Promise<string>;
 * 	rewardToken(this: MasterChefProvider): Promise<string>;
 * 	rewardPerSecond(this: MasterChefProvider): Promise<BigNumber>;
 * 	totalAllocPoint(this: MasterChefProvider): Promise<BigNumber>;
 * 	totalLocked(this: MasterChefProvider, pool: PoolInfo): Promise<BigNumber>;
 * 	poolInfo(this: MasterChefProvider, poolIndex: string | number): Promise<PoolInfo>;
 *  userInfo(this: MasterChefProvider, poolIndex: string | number, wallet: string): Promise<UserInfo>;
 *  pendingReward(this: MasterChefProvider, poolIndex: string | number, wallet: string): Promise<BigNumber>;
 *  deposit(this: MasterChefProvider, poolIndex: string | number, amount: string | number): Promise<ethers.Transaction>;
 *  withdraw(this: MasterChefProvider, poolIndex: string | number, amount: string | number): Promise<ethers.Transaction>;
 * }} MasterChefImplementation
 */
/**
 * @typedef {MasterChefContext & MasterChefImplementation} MasterChefProvider
 */

function toBN(v) {
  return new bn(v.toString());
}

const defaultProviderImplementation = {
  /**
   * @type {MasterChefImplementation['stakingToken']}
   */
  stakingToken({ lpToken }) {
    return lpToken;
  },
  /**
   * @type {MasterChefImplementation['totalAllocPoint']}
   */
  totalAllocPoint() {
    return this.contract.totalAllocPoint({ blockTag: this.options.blockTag }).then(toBN);
  },
  /**
   * @type {MasterChefImplementation['totalLocked']}
   */
  async totalLocked(pool) {
    const stakingToken = await this.stakingToken(pool);
    return ethereum
      .erc20(this.contract.provider, stakingToken)
      .balanceOf(this.contract.address, { blockTag: this.options.blockTag })
      .then(toBN);
  },
  /**
   * @type {MasterChefImplementation['userInfo']}
   */
  userInfo(poolIndex, wallet) {
    return this.contract
      .userInfo(poolIndex, wallet, { blockTag: this.options.blockTag })
      .then(({ amount, rewardDebt }) => ({
        amount: toBN(amount),
        rewardDebt: toBN(rewardDebt),
      }));
  },
  /**
   * @type {MasterChefImplementation['pendingReward']}
   */
  pendingReward(poolIndex, wallet) {
    return this.contract.pendingRewards(poolIndex, wallet).then(toBN);
  },
  /**
   * @type {MasterChefImplementation['deposit']}
   */
  deposit(poolIndex, amount) {
    return this.contract.deposit(poolIndex, amount);
  },
  /**
   * @type {MasterChefImplementation['withdraw']}
   */
  withdraw(poolIndex, amount) {
    return this.contract.withdraw(poolIndex, amount);
  },
};

/**
 *
 * @param {ethers.Contract} contract
 * @param {Options} options
 * @param {MasterChefImplementation} implementation
 * @returns {MasterChefProvider}
 */
function buildMasterChefProvider(
  contract,
  { blockTag },
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
  }
) {
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
      return deposit.call(this, poolIndex, wallet);
    },
    withdraw(poolIndex, amount) {
      return withdraw.call(this, poolIndex, wallet);
    },
  };
}

/**
 *
 * @param {MasterChefProvider} masterChefProvider
 * @param {{
 *  poolIndex: number | string,
 *  poolInfo: PoolInfo,
 *  signer: ehters.Wallet,
 *  etherscanAddressURL: string,
 * }} options
 *
 * @returns {Promise<any>}
 */
async function buildMasterChefActions(masterChefProvider, { poolIndex, poolInfo, signer, etherscanAddressURL }) {
  masterChefProvider.connect(signer);
  const rewardTokenContract = ethereum
    .erc20(masterChefProvider.contract.provider, await masterChefProvider.rewardToken())
    .connect(signer);
  const stakingTokenContract = ethereum
    .erc20(masterChefProvider.contract.provider, await masterChefProvider.stakingToken(poolInfo))
    .connect(signer);
  const [rewardTokenSymbol, stakingTokenSymbol, stakingTokenDecimals] = await Promise.all([
    rewardTokenContract.symbol(),
    stakingTokenContract.symbol(),
    stakingTokenContract.decimals().then(toBN),
  ]);

  return async (walletAddress) => ({
    stake: [
      AutomateActions.tab(
        'Stake',
        async () => ({
          description: `Stake your [${stakingTokenSymbol}](${etherscanAddressURL}/${stakingTokenContract.address}) tokens to contract`,
          inputs: [
            AutomateActions.input({
              placeholder: 'amount',
              value: await stakingTokenContract
                .balanceOf(walletAddress)
                .then(toBN)
                .then((v) => v.div(`1e${stakingTokenDecimals}`).toString(10)),
            }),
          ],
        }),
        async (amount) => {
          const amountInt = new bn(amount).multipliedBy(`1e${stakingTokenDecimals}`);
          if (amountInt.lte(0)) return Error('Invalid amount');

          const balance = await stakingTokenContract.balanceOf(walletAddress).then(toBN);
          if (amountInt.gt(balance)) return Error('Insufficient funds on the balance');

          return true;
        },
        async (amount) => {
          const amountInt = new bn(amount).multipliedBy(`1e${stakingTokenDecimals}`);
          await ethereum.erc20ApproveAll(
            stakingTokenContract,
            walletAddress,
            masterChefProvider.contract.address,
            amountInt.toFixed(0)
          );

          return { tx: await masterChefProvider.deposit(poolIndex, amountInt.toFixed(0)) };
        }
      ),
    ],
    unstake: [
      AutomateActions.tab(
        'Unstake',
        async () => {
          const { amount } = await masterChefProvider.userInfo(poolIndex, walletAddress);

          return {
            description: `Unstake your [${stakingTokenSymbol}](${etherscanAddressURL}/${stakingTokenContract.address}) tokens from contract`,
            inputs: [
              AutomateActions.input({
                placeholder: 'amount',
                value: amount.div(`1e${stakingTokenDecimals}`).toString(10),
              }),
            ],
          };
        },
        async (amount) => {
          const amountInt = new bn(amount).multipliedBy(`1e${stakingTokenDecimals}`);
          if (amountInt.lte(0)) return Error('Invalid amount');

          const userInfo = await stakingContract.userInfo(poolIndex, walletAddress);
          if (amountInt.isGreaterThan(userInfo.amount)) {
            return Error('Amount exceeds balance');
          }

          return true;
        },
        async (amount) => {
          const amountInt = new bn(amount).multipliedBy(`1e${stakingTokenDecimals}`);

          return { tx: await masterChefProvider.withdraw(poolIndex, amountInt.toFixed(0)) };
        }
      ),
    ],
    claim: [
      AutomateActions.tab(
        'Claim',
        async () => ({
          description: `Claim your [${rewardTokenSymbol}](${etherscanAddressURL}/${rewardTokenContract.address}) reward from contract`,
        }),
        async () => {
          const earned = await masterChefProvider.pendingReward(poolIndex, walletAddress);
          if (earned.isLessThanOrEqualTo(0)) {
            return Error('No earnings');
          }

          return true;
        },
        async () => {
          return { tx: await masterChefProvider.deposit(poolIndex, 0) };
        }
      ),
    ],
    exit: [
      AutomateActions.tab(
        'Exit',
        async () => ({
          description: 'Get all tokens from contract',
        }),
        async () => {
          const earned = await masterChefProvider.pendingReward(poolIndex, walletAddress);
          const { amount } = await masterChefProvider.userInfo(poolIndex, walletAddress);
          if (earned.isLessThanOrEqualTo(0) && amount.isLessThanOrEqualTo(0)) {
            return Error('No staked');
          }

          return true;
        },
        async () => {
          const { amount } = await masterChefProvider.userInfo(poolIndex, walletAddress);
          if (amount.isGreaterThan(0)) {
            await masterChefProvider.withdraw(poolIndex, amount.toFixed(0));
          }

          return { tx: await masterChefProvider.deposit(poolIndex, 0) };
        }
      ),
    ],
  });
}

module.exports = {
  toBN,
  defaultProviderImplementation,
  buildMasterChefProvider,
  buildMasterChefActions,
};

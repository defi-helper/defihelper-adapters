const { ethers, bn, ethersMulticall, dayjs } = require('../lib');
const { ethereum, toFloat, tokens, coingecko } = require('../utils');
const EthStakingABI = require('./abi/EthStaking.json');
const EthAutomateABI = require('./abi/EthAutomate.json');
const AutomateActions = require('../utils/automate/actions');

module.exports = {
  staking: async (provider, contractAddress, initOptions = ethereum.defaultOptions()) => {
    const options = {
      ...ethereum.defaultOptions(),
      ...initOptions,
    };
    const blockTag = options.blockNumber === 'latest' ? 'latest' : parseInt(options.blockNumber, 10);
    const network = (await provider.detectNetwork()).chainId;
    const block = await provider.getBlock(blockTag);
    const multicall = new ethersMulticall.Provider(provider, network);

    const stakingContractMulticall = new ethersMulticall.Contract(contractAddress, EthStakingABI);
    const [totalSupply, stakingTokenAddress] = await multicall.all(
      [stakingContractMulticall.totalSupply(), stakingContractMulticall.stakingToken()],
      { blockTag }
    );
    const [stakingTokenDecimals] = await multicall.all(
      [new ethersMulticall.Contract(stakingTokenAddress, ethereum.abi.ERC20ABI).decimals()],
      { blockTag }
    );

    return {
      staking: {
        token: stakingTokenAddress,
        decimals: stakingTokenDecimals.toString(),
      },
      metrics: {
        tvl: new bn(totalSupply.toString()).div(new bn(10).pow(stakingTokenDecimals)).toString(10),
        aprDay: '0',
        aprWeek: '0',
        aprMonth: '0',
        aprYear: '0',
      },
      wallet: async (walletAddress) => {
        let [balance] = await multicall.all([stakingContractMulticall.balanceOf(walletAddress)], { blockTag });
        balance = new bn(balance.toString()).div(new bn(10).pow(stakingTokenDecimals)).toString(10);

        return {
          staked: {
            balance,
            usd: balance,
          },
          earned: {
            balance: '0',
            usd: '0',
          },
          metrics: {
            staking: balance,
            stakingUSD: balance,
            earned: '0',
            earnedUSD: '0',
          },
          tokens: tokens({
            token: stakingTokenAddress,
            data: {
              balance,
              usd: balance,
            },
          }),
        };
      },
      actions: async (walletAddress) => {
        if (options.signer === null) {
          throw new Error('Signer not found, use options.signer for use actions');
        }
        const { signer } = options;
        const stakingTokenContract = ethereum.erc20(provider, stakingTokenAddress).connect(signer);
        const stakingContract = new ethers.Contract(contractAddress, EthStakingABI, signer);

        return {
          stake: {
            can: async (amount) => {
              const balance = await stakingTokenContract.balanceOf(walletAddress);
              if (new bn(amount).isGreaterThan(balance.toString())) {
                return Error('Amount exceeds balance');
              }

              return true;
            },
            send: async (amount) => {
              await stakingTokenContract.approve(contractAddress, amount).then((tx) => tx.wait());
              await stakingContract.deposit(amount).then((tx) => tx.wait());
            },
          },
          unstake: {
            can: async (amount) => {
              const balance = await stakingContract.balanceOf(walletAddress);
              if (new bn(amount).isGreaterThan(balance.toString())) {
                return Error('Amount exceeds balance');
              }

              return true;
            },
            send: async (amount) => {
              await stakingContract.withdraw(amount).then((tx) => tx.wait());
            },
          },
        };
      },
    };
  },
  automates: {
    EthAutomate: async (signer, contractAddress) => {
      const signerAddress = await signer.getAddress();
      const automate = new ethers.Contract(contractAddress, EthAutomateABI, signer);
      const stakingAddress = await automate.staking();
      const staking = new ethers.Contract(stakingAddress, EthStakingABI, signer);
      const stakingTokenAddress = await staking.stakingToken();
      const stakingToken = ethereum.erc20(signer, stakingTokenAddress);
      const stakingTokenDecimals = await stakingToken.decimals().then((v) => v.toString());

      const deposit = [
        AutomateActions.tab(
          'Transfer',
          async () => ({
            description: 'Transfer your tokens to automate',
            inputs: [
              AutomateActions.input({
                placeholder: 'amount',
                value: new bn(await stakingToken.balanceOf(signerAddress).then((v) => v.toString()))
                  .div(`1e${stakingTokenDecimals}`)
                  .toString(10),
              }),
            ],
          }),
          async (amount) => {
            const signerBalance = await stakingToken.balanceOf(signerAddress).then((v) => v.toString());
            const amountInt = new bn(amount).multipliedBy(`1e${stakingTokenDecimals}`);

            return new bn(amountInt).gt(0) && new bn(signerBalance).gte(amountInt);
          },
          async (amount) => ({
            tx: await stakingToken.transfer(
              automate.address,
              new bn(amount).multipliedBy(`1e${stakingTokenDecimals}`).toFixed(0)
            ),
          })
        ),
        AutomateActions.tab(
          'Deposit',
          async () => ({
            description: 'Deposit tokens to staking',
          }),
          async () => {
            const automateBalance = await stakingToken.balanceOf(automate.address).then((v) => v.toString());

            return (
              new bn(automateBalance).gt(0) &&
              signerAddress.toLowerCase() === (await automate.owner().then((v) => v.toLowerCase()))
            );
          },
          async () => ({
            tx: await automate.deposit(),
          })
        ),
      ];
      const refund = [
        AutomateActions.tab(
          'Refund',
          async () => ({
            description: 'Transfer your tokens from automate',
          }),
          async () => signerAddress.toLowerCase() === (await automate.owner().then((v) => v.toLowerCase())),
          async () => ({
            tx: await automate.refund(),
          })
        ),
      ];
      const migrate = [
        AutomateActions.tab(
          'Withdraw',
          async () => ({
            description: 'Withdraw your tokens from staking',
          }),
          async () => {
            const stakingBalance = await staking.balanceOf(signerAddress).then((v) => v.toString());
            return new bn(stakingBalance).gt(0);
          },
          async () => {
            const stakingBalance = await staking.balanceOf(signerAddress).then((v) => v.toString());
            return {
              tx: await staking.withdraw(stakingBalance),
            };
          }
        ),
        ...deposit,
      ];
      const runParams = async () => {
        const gasLimit = new bn(await automate.estimateGas.run(0).then((v) => v.toString()))
          .multipliedBy(1.1)
          .toFixed(0);
        const gasPrice = await signer.getGasPrice().then((v) => v.toString());
        const gasFee = new bn(gasLimit).multipliedBy(gasPrice).toFixed(0);

        await automate.estimateGas.run(gasFee);
        return {
          gasPrice,
          gasLimit,
          calldata: [gasFee],
        };
      };
      const run = async () => {
        const { gasPrice, gasLimit, calldata } = await runParams();
        return automate.run.apply(automate, [
          ...calldata,
          {
            gasPrice,
            gasLimit,
          },
        ]);
      };

      return {
        contract: stakingAddress,
        deposit,
        refund,
        migrate,
        runParams,
        run,
      };
    },
  },
};

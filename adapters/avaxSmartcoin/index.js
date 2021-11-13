const { ethers, bn, ethersMulticall, dayjs } = require('../lib');
const { ethereum, masterChef } = require('../utils');
const masterChefABI = require('./abi/masterChefABI.json');
const masterChefPools = require('./abi/masterChefPools.json');
const MasterChefJoeLpRestakeABI = require('./abi/MasterChefJoeLpRestakeABI.json');

const masterChefAddress = '0x1495b7e8d7E9700Bd0726F1705E864265724f6e2';

module.exports = {
  masterChef: masterChef(masterChefAddress, 'joe', masterChefABI, masterChefPools, []),
  automates: {
    MasterChefJoeLpRestake: async (signer, contractAddress) => {
      const automate = new ethers.Contract(contractAddress, MasterChefJoeLpRestakeABI, signer);
      const stakingAddress = await automate.staking();
      const staking = new ethers.Contract(stakingAddress, masterChefABI, signer);
      const stakingTokenAddress = await automate.stakingToken();
      const stakingToken = ethereum.erc20(signer, stakingTokenAddress);
      const poolId = await automate.pool().then((v) => v.toString());

      const deposit = async () => {
        const signerAddress = await signer.getAddress();
        const signerBalance = await stakingToken.balanceOf(signerAddress);
        if (signerBalance.toString() !== '0') {
          await (await stakingToken.transfer(automate.address, signerBalance)).wait();
        }
        const automateBalance = await stakingToken.balanceOf(automate.address);
        if (automateBalance.toString() !== '0') {
          await (await automate.deposit()).wait();
        }
      };
      const refund = async () => {
        return automate.refund();
      };
      const migrate = async () => {
        const signerAddress = await signer.getAddress();
        const userInfo = await staking.userInfo(poolId, signerAddress);
        await (await staking.withdraw(poolId, userInfo.amount.toString())).wait();
        return deposit();
      };
      const runParams = async () => {
        const multicall = new ethersMulticall.Provider(signer, await signer.getChainId());
        const automateMulticall = new ethersMulticall.Contract(contractAddress, MasterChefJoeLpRestakeABI);
        const stakingMulticall = new ethersMulticall.Contract(stakingAddress, masterChefABI);
        const stakingTokenMulticall = new ethersMulticall.Contract(stakingTokenAddress, ethereum.uniswap.pairABI);
        const [
          infoAddress,
          slippagePercent,
          deadlineSeconds,
          token0Address,
          token1Address,
          rewardTokenAddress,
          { amount: earned },
        ] = await multicall.all([
          automateMulticall.info(),
          automateMulticall.slippage(),
          automateMulticall.deadline(),
          stakingTokenMulticall.token0(),
          stakingTokenMulticall.token1(),
          automateMulticall.rewardToken(),
          stakingMulticall.userInfo(contractAddress),
        ]);
        if (earned.toString() === '0') return new Error('No earned');
        const routerAddress = await ethereum.dfh
          .storage(signer, infoAddress)
          .getAddress(ethereum.dfh.storageKey('Joe:Contract:Router2'));
        const router = ethereum.uniswap.router(signer, routerAddress);

        const slippage = 1 - slippagePercent / 10000;
        const token0AmountIn = new bn(earned.toString()).div(2).toFixed(0);
        let token0Min = new bn(token0AmountIn).multipliedBy(slippage).toFixed(0);
        if (token0Address.toLowerCase() !== rewardTokenAddress.toLowerCase()) {
          const [, amountOut] = await router.getAmountsOut(token0AmountIn, [rewardTokenAddress, token0Address]);
          token0Min = new bn(amountOut.toString()).multipliedBy(slippage).toFixed(0);
        }
        const token1AmountIn = new bn(earned.toString()).minus(token0AmountIn).toFixed(0);
        let token1Min = new bn(token1AmountIn).multipliedBy(slippage).toFixed(0);
        if (token1Address.toLowerCase() !== rewardTokenAddress.toLowerCase()) {
          const [, amountOut] = await router.getAmountsOut(token1AmountIn, [rewardTokenAddress, token1Address]);
          token1Min = new bn(amountOut.toString()).multipliedBy(slippage).toFixed(0);
        }
        const deadline = dayjs().add(deadlineSeconds, 'seconds').unix();

        const gasLimit = await automate.estimateGas.run(0, deadline, [token0Min, token1Min]);
        const gasPrice = await signer.getGasPrice();
        const gasFee = new bn(gasLimit.toString()).multipliedBy(gasPrice.toString()).toFixed(0);

        return [gasFee, deadline, [token0Min, token1Min]];
      };
      const run = async () => {
        return automate.run.apply(automate, await runParams());
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

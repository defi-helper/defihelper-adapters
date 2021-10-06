const { ethers, axios, bn, ethersMulticall, dayjs } = require('../lib');
const { ethereum, waves, toFloat, staking } = require('../utils');
const StakingABI = require('./abi/Staking.json');
const SynthetixUniswapLpRestakeABI = require('./abi/SynthetixUniswapLpRestake.json');

const swopTokenId = 'Ehie5xYpeN8op1Cctc6aGUrqx8jq3jtf1DSjXDbfm7aT';

module.exports = {
  // For instance: 0x969c70f75aecb0decbde0554fb570276c9a85751
  staking: staking.synthetixStaking(),
  swopfiStaking: async (provider, contractAddress, initOptions = waves.defaultOptions()) => {
    const options = {
      ...waves.defaultOptions(),
      ...initOptions,
    };
    const lpRes = await axios.get(`https://backend.swop.fi/exchangers/${contractAddress}`);
    const { stakingIncome, lpFees24, totalLiquidity } = lpRes.data.data;

    const farmingRes = await axios.get('https://backend.swop.fi/farming/info');
    let { shareToken, totalShareTokensLoked } = farmingRes.data.data.find(({ pool }) => pool === contractAddress) || {
      pool: contractAddress,
      shareToken: '',
      totalShareTokensLoked: '0',
    };
    totalShareTokensLoked = toFloat(totalShareTokensLoked, 6);

    const shareTokenInfoRes = await axios.get(`https://nodes.wavesnodes.com/assets/details/${shareToken}`);
    const { decimals: shareTokenDecimals } = shareTokenInfoRes.data || {
      decimals: 6,
    };

    const ratesRes = await axios.get('https://backend.swop.fi/assets/rates');
    let { rate: swopRate } = ratesRes.data.data[swopTokenId] || { rate: '0' };
    swopRate = toFloat(swopRate, 6);
    let { rate: shareRate } = ratesRes.data.data[shareToken] || { rate: '' };
    shareRate = toFloat(shareRate, shareTokenDecimals);

    const governanceRes = await axios.get('https://backend.swop.fi/governance');
    let { value: poolWeight } = governanceRes.data.data.find(
      ({ key }) => key === `${contractAddress}_current_pool_fraction_reward`
    ) || {
      key: `${contractAddress}_current_pool_fraction_reward`,
      type: 'int',
      value: '0',
    };
    poolWeight = toFloat(poolWeight, 10);

    const swopAPY =
      totalShareTokensLoked !== '0' && shareRate !== '0'
        ? new bn(1000000).multipliedBy(poolWeight).multipliedBy(swopRate).div(totalShareTokensLoked).div(shareRate)
        : new bn('0');
    const aprDay = new bn(stakingIncome).plus(lpFees24).div(totalLiquidity);
    const aprWeek = aprDay.multipliedBy(7);
    const aprMonth = aprDay.multipliedBy(30);
    const aprYear = aprDay.multipliedBy(365);

    return {
      metrics: {
        tvl: toFloat(totalLiquidity, 6).toString(10),
        aprDay: aprDay.plus(swopAPY).toString(10),
        aprWeek: aprWeek.plus(swopAPY).toString(10),
        aprMonth: aprMonth.plus(swopAPY).toString(10),
        aprYear: aprYear.plus(swopAPY).toString(10),
      },
      wallet: async (walletAddress) => {
        return {
          tokens: {},
        };
      },
    };
  },
  automates: {
    SynthetixUniswapLpRestake: async (signer, contractAddress) => {
      const automate = new ethers.Contract(contractAddress, SynthetixUniswapLpRestakeABI, signer);
      const stakingAddress = await automate.staking();
      const staking = new ethers.Contract(stakingAddress, StakingABI, signer);
      const stakingTokenAddress = await staking.stakingToken();
      const stakingToken = ethereum.erc20(signer, stakingTokenAddress);

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
        await staking.exit();
        return deposit();
      };
      const runParams = async () => {
        const multicall = new ethersMulticall.Provider(signer, await signer.getChainId());
        const automateMulticall = new ethersMulticall.Contract(contractAddress, SynthetixUniswapLpRestakeABI);
        const stakingMulticall = new ethersMulticall.Contract(stakingAddress, StakingABI);
        const stakingTokenMulticall = new ethersMulticall.Contract(stakingTokenAddress, ethereum.uniswap.pairABI);
        const [
          infoAddress,
          slippagePercent,
          deadlineSeconds,
          token0Address,
          token1Address,
          rewardTokenAddress,
          earned,
        ] = await multicall.all([
          automateMulticall.info(),
          automateMulticall.slippage(),
          automateMulticall.deadline(),
          stakingTokenMulticall.token0(),
          stakingTokenMulticall.token1(),
          stakingMulticall.rewardsToken(),
          stakingMulticall.earned(contractAddress),
        ]);
        if (earned.toString() === '0') return new Error('No earned');
        const routerAddress = await ethereum.dfh
          .storage(signer, infoAddress)
          .getAddress(ethereum.dfh.storageKey('UniswapV2:Contract:Router2'));
        const router = ethereum.uniswap.router(signer, routerAddress);

        const deadline = dayjs().add(deadlineSeconds, 'seconds').unix();
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

        const gasFee = await automate.estimateGas.run(0, deadline, [token0Min, token1Min]);

        return [gasFee.toString(), deadline, [token0Min, token1Min]];
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

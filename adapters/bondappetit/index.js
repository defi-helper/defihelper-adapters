const { ethers, axios, bn, ethersMulticall, dayjs } = require('../lib');
const { ethereum, waves, toFloat, staking } = require('../utils');
const StakingABI = require('./abi/Staking.json');
const SynthetixUniswapLpRestakeABI = require('./abi/SynthetixUniswapLpRestake.json');
const AutomateActions = require('../utils/automate/actions');
const stakingContracts = require('./abi/stakingContracts.json');

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
    deploy: {
      SynthetixUniswapLpRestake: async (signer, factoryAddress, prototypeAddress, contractAddress = undefined) => {
        const stakingContract = contractAddress ?? stakingContracts[0].stakingContract;

        return {
          deploy: [
            AutomateActions.tab(
              'Deploy',
              async () => ({
                description: 'Deploy your automate contract',
                inputs: [
                  AutomateActions.input({
                    placeholder: 'Staking contract',
                    value: stakingContract,
                  }),
                  AutomateActions.input({
                    placeholder: 'Slippage percent',
                    value: '1',
                  }),
                  AutomateActions.input({
                    placeholder: 'Deadline (seconds)',
                    value: '300',
                  }),
                ],
              }),
              async (staking, slippage, deadline) => {
                if (
                  stakingContracts.find(
                    ({ stakingContract }) => staking.toLowerCase() === stakingContract.toLowerCase()
                  ) === undefined
                )
                  return new Error('Invalid staking contract');
                if (slippage < 0 || slippage > 100) return new Error('Invalid slippage percent');
                if (deadline < 0) return new Error('Deadline has already passed');

                return true;
              },
              async (staking, slippage, deadline) =>
                AutomateActions.ethereum.proxyDeploy(
                  signer,
                  factoryAddress,
                  prototypeAddress,
                  new ethers.utils.Interface(SynthetixUniswapLpRestakeABI).encodeFunctionData('init', [
                    staking,
                    Math.floor(slippage * 10),
                    deadline,
                  ])
                )
            ),
          ],
        };
      },
    },
    SynthetixUniswapLpRestake: async (signer, contractAddress) => {
      const signerAddress = await signer.getAddress();
      const automate = new ethers.Contract(contractAddress, SynthetixUniswapLpRestakeABI, signer);
      const stakingAddress = await automate.staking();
      const staking = new ethers.Contract(stakingAddress, StakingABI, signer);
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
            if (amountInt.lte(0)) return Error('Invalid amount');
            if (amountInt.gt(signerBalance)) return Error('Insufficient funds on the balance');

            return true;
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
            const automateBalance = new bn(await stakingToken.balanceOf(automate.address).then((v) => v.toString()));
            const automateOwner = await automate.owner();
            if (automateBalance.lte(0)) return new Error('Insufficient funds on the automate contract balance');
            if (signerAddress.toLowerCase() !== automateOwner.toLowerCase()) return new Error('Someone else contract');

            return true;
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
          async () => {
            const automateOwner = await automate.owner();
            if (signerAddress.toLowerCase() !== automateOwner.toLowerCase()) return new Error('Someone else contract');

            return true;
          },
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
            const stakingBalance = new bn(await staking.balanceOf(signerAddress).then((v) => v.toString()));
            if (stakingBalance.lte(0)) return new Error('Insufficient funds on the staking contract balance');

            return true;
          },
          async () => {
            return {
              tx: await staking.exit(),
            };
          }
        ),
        ...deposit,
      ];
      const runParams = async () => {
        const provider = signer.provider || signer;
        const chainId = await provider.getNetwork().then(({ chainId }) => chainId);
        const multicall = new ethersMulticall.Provider(signer, chainId);
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

        const gasLimit = new bn(
          await automate.estimateGas.run(0, deadline, [token0Min, token1Min]).then((v) => v.toString())
        )
          .multipliedBy(1.1)
          .toFixed(0);
        const gasPrice = await signer.getGasPrice().then((v) => v.toString());
        const gasFee = new bn(gasLimit).multipliedBy(gasPrice).toFixed(0);

        await automate.estimateGas.run(gasFee, deadline, [token0Min, token1Min]);
        return {
          gasPrice,
          gasLimit,
          calldata: [gasFee, deadline, [token0Min, token1Min]],
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

const { bn, ethers, dayjs, ethersMulticall } = require('../lib');
const { ethereum } = require('../utils/ethereum');
const AutomateActions = require('../utils/automate/actions');
const BuyLiquidityABI = require('./abi/BuyLiquidityABI.json');

module.exports = {
  automates: {
    buyLiquidity: async (signer, contractAddress, { tokens, router, pair }) => {
      const signerAddress = await signer.getAddress();
      const automate = new ethers.Contract(contractAddress, BuyLiquidityABI).connect(signer);

      const buyStep1 = { inToken: null, amount: null, slippage: null };
      return {
        buy: [
          AutomateActions.tab(
            'Approve',
            async () => ({
              description: 'Approve your tokens to contract',
              inputs: [
                AutomateActions.select({
                  placeholder: 'Token',
                  value: tokens[0].address,
                  options: tokens.map(({ address, symbol }) => ({ value: address, label: symbol })),
                }),
                AutomateActions.input({
                  placeholder: 'amount',
                  value: '0',
                }),
                AutomateActions.radio({
                  placeholder: 'Slippage',
                  value: '0.5',
                  options: [
                    { value: '0.1', label: '0.1%' },
                    { value: '0.5', label: '0.5%' },
                    { value: '1', label: '1.0%' },
                  ],
                }),
              ],
            }),
            async (inToken, amount) => {
              const [signerBalance, inTokenDecimals] = await Promise.all([
                ethereum
                  .erc20(signer, inToken)
                  .balanceOf(signerAddress)
                  .then((v) => v.toString()),
                ethereum
                  .erc20(signer, inToken)
                  .decimals()
                  .then((v) => v.toString()),
              ]);
              const amountInt = new bn(amount).multipliedBy(`1e${inTokenDecimals}`);
              if (amountInt.lte(0)) return new Error('Invalid amount');
              if (amountInt.gt(signerBalance)) return new Error('Insufficient funds on the balance');

              return true;
            },
            async (inToken, amount, slippage) => {
              const inTokenContract = ethereum.erc20(signer, inToken);
              const [allowance, inTokenDecimals] = await Promise.all([
                inTokenContract.allowance(signerAddress, contractAddress).then((v) => new bn(v.toString())),
                inTokenContract.decimals().then((v) => v.toString()),
              ]);
              buyStep1.inToken = inToken;
              buyStep1.amount = amount;
              buyStep1.slippage = slippage;

              const amountInt = new bn(amount).multipliedBy(`1e${inTokenDecimals}`);
              if (amountInt.gt(allowance)) {
                if (allowance.gt(0)) {
                  await inTokenContract.approve(contractAddress, 0);
                }

                return {
                  tx: await inTokenContract.approve(contractAddress, new bn(2).pow(256).minus(1).toFixed(0)),
                };
              }

              return {};
            }
          ),
          AutomateActions.tab(
            'Buy',
            async () => ({
              description: 'Swap your token to pair tokens and add liquidity',
            }),
            async () => {
              if (buyStep1.inToken === null || buyStep1.amount === null || buyStep1.slippage === null) {
                return new Error('First step not completed');
              }

              const { inToken, amount } = buyStep1;
              const inTokenContract = ethereum.erc20(signer, inToken);
              const [signerBalance, allowance, inTokenDecimals, feeBalance, fee] = await Promise.all([
                inTokenContract.balanceOf(signerAddress).then((v) => v.toString()),
                inTokenContract.allowance(signerAddress, contractAddress).then((v) => new bn(v.toString())),
                inTokenContract.decimals().then((v) => v.toString()),
                signer.provider.getBalance(signerAddress).then((v) => v.toString()),
                automate.fee().then((v) => new bn(v.toString())),
              ]);
              const amountInt = new bn(amount).multipliedBy(`1e${inTokenDecimals}`);
              if (amountInt.lte(0)) return new Error('Invalid amount');
              if (amountInt.gt(signerBalance)) return new Error('Insufficient funds on the balance');
              if (amountInt.gt(allowance)) return new Error('Not approved');
              if (fee.multipliedBy(1.05).gt(feeBalance)) {
                return new Error('Insufficient fee funds on the balance');
              }

              return true;
            },
            async () => {
              const { inToken, amount, slippage } = buyStep1;
              const multicall = new ethersMulticall.Provider(signer.provider);
              await multicall.init();
              const [inTokenDecimals, token0, token1, fee] = await Promise.all([
                ethereum
                  .erc20(signer, inToken)
                  .decimals()
                  .then((v) => v.toString()),
                ethereum.uniswap.pair(signer, pair).token0(),
                ethereum.uniswap.pair(signer, pair).token1(),
                automate.fee().then((v) => new bn(v.toString())),
              ]);

              const amountInt = new bn(amount).multipliedBy(`1e${inTokenDecimals}`);
              const swap0 = { path: [inToken, token0], outMin: 0 };
              if (inToken.toLowerCase() !== token0.toLowerCase()) {
                const { path, amountOut } = await ethereum.uniswap.autoRoute(
                  multicall,
                  new ethersMulticall.Contract(router, ethereum.abi.UniswapRouterABI),
                  amountInt.div(2).toFixed(0),
                  inToken,
                  token0,
                  []
                );
                swap0.path = path;
                swap0.outMin = new bn(amountOut.toString()).multipliedBy(1 - slippage / 100).toFixed(0);
              }
              const swap1 = { path: [inToken, token1], outMin: 0 };
              if (inToken.toLowerCase() !== token1.toLowerCase()) {
                const { path, amountOut } = await ethereum.uniswap.autoRoute(
                  multicall,
                  new ethersMulticall.Contract(router, ethereum.abi.UniswapRouterABI),
                  amountInt.minus(amountInt.div(2).toFixed(0)).toFixed(0),
                  inToken,
                  token1,
                  []
                );
                swap1.path = path;
                swap1.outMin = new bn(amountOut.toString()).multipliedBy(1 - slippage / 100).toFixed(0);
              }

              return {
                tx: automate.buyLiquidity(
                  new bn(amount).multipliedBy(`1e${inTokenDecimals}`).toFixed(0),
                  router,
                  swap0,
                  swap1,
                  pair,
                  dayjs().add(300, 'seconds').unix(),
                  {
                    value: fee.multipliedBy(1.05).toFixed(0),
                  }
                ),
              };
            }
          ),
        ],
      };
    },
  },
};

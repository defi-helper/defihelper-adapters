const { bn, ethers, dayjs, ethersMulticall } = require('../lib');
const { ethereum } = require('../utils/ethereum');
const AutomateActions = require('../utils/automate/actions');
const BuyLiquidityABI = require('./abi/BuyLiquidityABI.json');

const routeTokens = {
  1: ['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'],
  56: ['0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
  137: ['0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'],
  1285: ['0x98878b06940ae243284ca214f92bb71a2b032b8a'],
  43114: ['0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7'],
};

module.exports = {
  automates: {
    buyLiquidity: async (signer, contractAddress, { router, pair }) => {
      const signerAddress = await signer.getAddress();
      const network = await signer.getChainId().then((v) => v.toString());
      const automate = new ethers.Contract(contractAddress, BuyLiquidityABI).connect(signer);

      return AutomateActions.component('DHFBuyLiquidity', {
        isApproved: async (tokenAddress, amount) => {
          if (new bn(amount).lte(0)) return new Error('Invalid amount');

          const [allowance, tokenDecimals] = await Promise.all([
            ethereum
              .erc20(signer, tokenAddress)
              .allowance(signerAddress)
              .then((v) => v.toString()),
            ethereum
              .erc20(signer, tokenAddress)
              .decimals()
              .then((v) => v.toString()),
          ]);

          return new bn(amount).multipliedBy(`1e${tokenDecimals}`).lte(allowance);
        },
        approve: async (tokenAddress, amount) => {
          const token = ethereum.erc20(signer, tokenAddress);
          const [allowance, tokenDecimals] = await Promise.all([
            token.allowance(signerAddress, contractAddress).then((v) => new bn(v.toString())),
            token.decimals().then((v) => v.toString()),
          ]);

          const amountInt = new bn(amount).multipliedBy(`1e${tokenDecimals}`);
          if (amountInt.gt(allowance)) {
            if (allowance.gt(0)) {
              await token.approve(contractAddress, 0);
            }

            return {
              tx: await token.approve(contractAddress, new bn(2).pow(256).minus(1).toFixed(0)),
            };
          }

          return {};
        },
        canBuy: async (tokenAddress, amount) => {
          const token = ethereum.erc20(signer, tokenAddress);
          const [signerBalance, allowance, tokenDecimals, feeBalance, fee] = await Promise.all([
            token.balanceOf(signerAddress).then((v) => v.toString()),
            token.allowance(signerAddress, contractAddress).then((v) => new bn(v.toString())),
            token.decimals().then((v) => v.toString()),
            signer.provider.getBalance(signerAddress).then((v) => v.toString()),
            automate.fee().then((v) => new bn(v.toString())),
          ]);
          const amountInt = new bn(amount).multipliedBy(`1e${tokenDecimals}`);
          if (amountInt.lte(0)) return new Error('Invalid amount');
          if (amountInt.gt(signerBalance)) return new Error('Insufficient funds on the balance');
          if (amountInt.gt(allowance)) return new Error('Not approved');
          if (fee.multipliedBy(1.05).gt(feeBalance)) {
            return new Error('Insufficient fee funds on the balance');
          }

          return true;
        },
        buy: async (tokenAddress, amount, slippage) => {
          const multicall = new ethersMulticall.Provider(signer.provider);
          await multicall.init();

          const [tokenDecimals, token0, token1, fee] = await Promise.all([
            ethereum
              .erc20(signer, tokenAddress)
              .decimals()
              .then((v) => v.toString()),
            ethereum.uniswap.pair(signer, pair).token0(),
            ethereum.uniswap.pair(signer, pair).token1(),
            automate.fee().then((v) => new bn(v.toString())),
          ]);

          const amountInt = new bn(amount).multipliedBy(`1e${tokenDecimals}`);
          const swap0 = { path: [tokenAddress, token0], outMin: 0 };
          if (tokenAddress.toLowerCase() !== token0.toLowerCase()) {
            const { path, amountOut } = await ethereum.uniswap.autoRoute(
              multicall,
              new ethersMulticall.Contract(router, ethereum.abi.UniswapRouterABI),
              amountInt.div(2).toFixed(0),
              tokenAddress,
              token0,
              routeTokens[network] ?? []
            );
            swap0.path = path;
            swap0.outMin = new bn(amountOut.toString()).multipliedBy(1 - slippage / 100).toFixed(0);
          }
          const swap1 = { path: [tokenAddress, token1], outMin: 0 };
          if (tokenAddress.toLowerCase() !== token1.toLowerCase()) {
            const { path, amountOut } = await ethereum.uniswap.autoRoute(
              multicall,
              new ethersMulticall.Contract(router, ethereum.abi.UniswapRouterABI),
              amountInt.minus(amountInt.div(2).toFixed(0)).toFixed(0),
              tokenAddress,
              token1,
              routeTokens[network] ?? []
            );
            swap1.path = path;
            swap1.outMin = new bn(amountOut.toString()).multipliedBy(1 - slippage / 100).toFixed(0);
          }

          return {
            tx: await automate.buyLiquidity(
              amountInt.toFixed(0),
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
        },
      });
    },
  },
};

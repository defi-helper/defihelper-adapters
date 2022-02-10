const { bn, ethers, dayjs } = require('../lib');
const { ethereum } = require('../utils/ethereum');
const AutomateActions = require('../utils/automate/actions');
const BuyLiquidityABI = require('./abi/BuyLiquidityABI.json');

module.exports = {
  automates: {
    buyLiquidity: async (signer, contractAddress, { tokens }) => {
      const signerAddress = await signer.getAddress();

      const buyStep1 = { inToken: null, amount: null };
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
              if (amountInt.lte(0)) return Error('Invalid amount');
              if (amountInt.gt(signerBalance)) return Error('Insufficient funds on the balance');

              return true;
            },
            async (inToken, amount) => {
              const inTokenDecimals = await ethereum
                .erc20(signer, inToken)
                .decimals()
                .then((v) => v.toString());
              buyStep1.inToken = inToken;
              buyStep1.amount = amount;

              return {
                tx: await ethereum
                  .erc20(signer, inToken)
                  .approve(contractAddress, new bn(amount).multipliedBy(`1e${inTokenDecimals}`).toFixed(0)),
              };
            }
          ),
          AutomateActions.tab(
            'Buy',
            async () => ({
              description: 'Swap your token to pair tokens and add liquidity',
            }),
            async () => {
              if (buyStep1.inToken === null || buyStep1.amount === null) return new Error('First step not completed');

              const { inToken, amount } = buyStep1;
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
              if (amountInt.lte(0)) return Error('Invalid amount');
              if (amountInt.gt(signerBalance)) return Error('Insufficient funds on the balance');

              return true;
            },
            async () => {
              const { inToken, amount } = buyStep1;
              console.log('inToken', inToken);
              console.log('amount', amount);
              const router = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
              const pair = '0xffdeca9081a5627a95249a19bd5ff5eba94228cf';
              const [inTokenDecimals, token0, token1] = await Promise.all([
                ethereum
                  .erc20(signer, inToken)
                  .decimals()
                  .then((v) => v.toString()),
                ethereum.uniswap.pair(signer, pair).token0(),
                ethereum.uniswap.pair(signer, pair).token1(),
              ]);

              return {
                tx: new ethers.Contract(contractAddress, BuyLiquidityABI)
                  .connect(signer)
                  .buyLiquidity(
                    new bn(amount).multipliedBy(`1e${inTokenDecimals}`).toFixed(0),
                    router,
                    { path: [inToken, token0], outMin: 0 },
                    { path: [inToken, token1], outMin: 0 },
                    pair,
                    dayjs().add(300, 'seconds').unix()
                  ),
              };
            }
          ),
        ],
      };
    },
  },
};

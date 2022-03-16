const { axios, bn, wavesSigner, wavesSeedProvider, wavesTransaction } = require('../lib');
const { waves } = require('../utils/waves');
const { toFloat } = require('../utils/toFloat');
const { tokens } = require('../utils/tokens');
const { CoingeckoProvider } = require('../utils/coingecko');
const AutomateActions = require('../utils/automate/actions');

const swopTokenId = 'Ehie5xYpeN8op1Cctc6aGUrqx8jq3jtf1DSjXDbfm7aT';
const farmingContract = '3P73HDkPqG15nLXevjCbmXtazHYTZbpPoPw';
const stakingContract = '3PLHVWCqA9DJPDbadUofTohnCULLauiDWhS';

const mainTokensToCoingeckoId = {
  DG2xFkPdDwKUoBkzGAhQtLpSGzfXLiCYPEzeKH2Ad24p: 'neutrino-usd',
  '8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS': 'btc',
  WAVES: 'waves',
  Ehie5xYpeN8op1Cctc6aGUrqx8jq3jtf1DSjXDbfm7aT: 'swop',
  DUk2YTxhRoAqMJLus4G2b3fR8hMHVh6eiyFx5r29VR6t: 'EURT',
};

const convertFromTokenToUsd = async (tokenId, amount) => {
  const usdPrice = await new CoingeckoProvider({ block: { timestamp: 0 }, blockTag: 'latest' }).price(tokenId);
  return amount.multipliedBy(usdPrice);
};

const getUsdPriceOfToken = async (assetAddress) => {
  if (mainTokensToCoingeckoId[assetAddress]) {
    return convertFromTokenToUsd(mainTokensToCoingeckoId[assetAddress], new bn(1));
  }

  const exchangers = (await axios.get('https://backend.swop.fi/exchangers/data')).data.data;
  const mainTokens = Object.keys(mainTokensToCoingeckoId);

  for (const token of mainTokens) {
    const exchanger = exchangers.find((e) => e.A_asset_id === assetAddress && e.B_asset_id === token);
    if (exchanger) {
      const assetPriceInToken = new bn(exchanger.A_asset_balance).div(exchanger.B_asset_balance);
      return convertFromTokenToUsd(mainTokensToCoingeckoId[token], assetPriceInToken);
    }
  }

  throw new Error(`Unable to find USD price for ${assetAddress}`);
};

const getBalance = (assetId, walletAddress) => {
  return axios
    .get(`https://nodes.swop.fi/assets/balance/${walletAddress}`)
    .then(({ data: { balances } }) => new bn(balances.find((asset) => asset.assetId === assetId)?.balance || 0));
};

const getStaked = (contractAddress, walletAddress) => {
  return axios
    .get(`https://backend.swop.fi/farming/${walletAddress}`)
    .then(
      ({ data: { data } }) =>
        new bn(data.find(({ key }) => key === `${contractAddress}_${walletAddress}_share_tokens_locked`)?.value || 0)
    );
};

const getGovStaked = (walletAddress) => {
  return axios
    .get(`https://backend.swop.fi/governance/${walletAddress}`)
    .then(({ data: { data } }) => new bn(data.find(({ key }) => key === `${walletAddress}_SWOP_amount`)?.value || 0));
};

const getWavesBalance = (node, walletAddress) => {
  return axios.get(`${node}/addresses/balance/${walletAddress}`).then(({ data: { balance } }) => new bn(balance));
};

/*
  contractAddress = '3PH8Np6jwuoikvkHL2qmdpFEHBR4UV5vwSq';
  walletAddress = '3P9s27vtTw9Sux3T2qLSQ6ccx4PuQTYffiu';
 */
module.exports = {
  governanceStaking: async (provider, contractAddress, initOptions = waves.defaultOptions()) => {
    const options = {
      ...waves.defaultOptions(),
      ...initOptions,
    };
    const assets = (await axios.get('https://backend.swop.fi/assets')).data.data;
    const apr = new bn((await axios.get('https://backend.swop.fi/governance/apy/week')).data.data.apy).div(100);

    const swopToken = assets[swopTokenId];

    const totalLiquidity = toFloat(
      (await axios.get('https://backend.swop.fi/governance/')).data.data.find(
        (record) => record.key === 'total_SWOP_amount'
      )?.value || '0',
      swopToken.precision
    );

    const totalLiquidityUSD = totalLiquidity.multipliedBy(await getUsdPriceOfToken(swopToken.id));

    return {
      staking: {
        token: swopTokenId,
      },
      reward: {
        token: swopTokenId,
      },
      metrics: {
        tvl: totalLiquidityUSD.toString(10),
        tvlTokens: totalLiquidity.toString(10),
        aprDay: apr.div(365).toString(10),
        aprWeek: apr.multipliedBy(7).div(365).toString(10),
        aprMonth: apr.div(12).toString(10),
        aprYear: apr.toString(10),
      },
      wallet: async (walletAddress) => {
        const governance = (await axios.get(`https://backend.swop.fi/governance/${walletAddress}`)).data.data;

        const staked = toFloat(
          governance.find((g) => g.key === `${walletAddress}_SWOP_amount`)?.value || '0',
          swopToken.precision
        );
        const stakedUSD = staked.multipliedBy(await getUsdPriceOfToken(swopToken.id));

        const lastInterest = toFloat(governance.find((g) => g.key === 'last_interest').value, swopToken.precision);
        const lastUserInterest = toFloat(
          governance.find((g) => g.key === `${walletAddress}_last_interest`).value,
          swopToken.precision
        );

        const earned = staked.multipliedBy(lastInterest.minus(lastUserInterest));
        const earnedUSD = earned.multipliedBy(await getUsdPriceOfToken(swopToken.id));

        return {
          staked: {
            [swopToken.id]: {
              balance: staked,
              usd: stakedUSD,
            },
          },
          earned: {
            [swopToken.id]: {
              balance: earned.toString(10),
              usd: earnedUSD.toString(10),
            },
          },
          metrics: {
            staking: staked.toString(10),
            stakingUSD: stakedUSD.toString(10),
            earned: earned.toString(10),
            earnedUSD: earnedUSD.toString(10),
          },
          tokens: tokens({
            token: swopTokenId,
            data: {
              balance: earned.toString(10),
              usd: earnedUSD.toString(10),
            },
          }),
        };
      },
      actions: async (walletAddress) => {
        if (options.signer === null) {
          throw new Error('Signer not found, use options.signer for use actions');
        }
        const { signer } = options;
        const stakingToken = swopToken;

        return {
          stake: [
            AutomateActions.tab(
              'Stake',
              async () => {
                const balance = await getBalance(stakingToken.id, walletAddress);

                return {
                  description: `Stake your [${stakingToken.name}](https://wavesexplorer.com/assets/${stakingToken.id}) tokens to contract`,
                  inputs: [
                    AutomateActions.input({
                      placeholder: 'amount',
                      value: balance.div(`1e${stakingToken.precision}`).toString(10),
                    }),
                  ],
                };
              },
              async (amount) => {
                const amountInt = new bn(amount).multipliedBy(`1e${stakingToken.precision}`);
                if (amountInt.lte(0)) return Error('Invalid amount');

                const balance = await getBalance(stakingToken.id, walletAddress);
                if (amountInt.gt(balance.toString())) {
                  return Error('Amount exceeds balance');
                }

                return true;
              },
              async (amount) => {
                const amountInt = new bn(amount).multipliedBy(`1e${stakingToken.precision}`);
                const tx = await signer
                  .invoke({
                    dApp: stakingContract,
                    fee: 5e6,
                    payment: [
                      {
                        assetId: stakingToken.id,
                        amount: amountInt.toFixed(0),
                      },
                    ],
                    call: {
                      function: 'lockSWOP',
                      args: [],
                    },
                  })
                  .broadcast();

                return {
                  tx,
                  wait: () => signer.waitTxConfirm(tx, 1),
                };
              }
            ),
          ],
          unstake: [
            AutomateActions.tab(
              'Unstake',
              async () => {
                const staked = await getGovStaked(walletAddress);

                return {
                  description: `Unstake your [${stakingToken.name}](https://wavesexplorer.com/assets/${stakingToken.id}) tokens from contract`,
                  inputs: [
                    AutomateActions.input({
                      placeholder: 'amount',
                      value: staked.div(`1e${stakingToken.precision}`).toString(10),
                    }),
                  ],
                };
              },
              async (amount) => {
                const amountInt = new bn(amount).multipliedBy(`1e${stakingToken.precision}`);
                if (amountInt.lte(0)) return Error('Invalid amount');

                const staked = await getGovStaked(walletAddress);
                if (amountInt.isGreaterThan(staked)) {
                  return Error('Amount exceeds balance');
                }

                return true;
              },
              async (amount) => {
                const amountInt = new bn(amount).multipliedBy(`1e${stakingToken.precision}`);
                const tx = await signer
                  .invoke({
                    dApp: stakingContract,
                    fee: 5e6,
                    payment: [],
                    call: {
                      function: 'withdrawSWOP',
                      args: [{ type: 'integer', value: amountInt.toFixed(0) }],
                    },
                  })
                  .broadcast();

                return {
                  tx,
                  wait: () => signer.waitTxConfirm(tx, 1),
                };
              }
            ),
          ],
          claim: [
            AutomateActions.tab(
              'Claim',
              async () => ({
                description: `Claim and restake your [SWOP](https://wavesexplorer.com/assets/Ehie5xYpeN8op1Cctc6aGUrqx8jq3jtf1DSjXDbfm7aT) reward from contract`,
              }),
              async () => true,
              async () => {
                const tx = await signer
                  .invoke({
                    dApp: stakingContract,
                    fee: 5e6,
                    payment: [],
                    call: {
                      function: 'claimAndStakeSWOP',
                      args: [],
                    },
                  })
                  .broadcast();

                return {
                  tx,
                  wait: () => signer.waitTxConfirm(tx, 1),
                };
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
                const staked = await getGovStaked(walletAddress);
                if (amountInt.isGreaterThan(staked)) {
                  return Error('Amount exceeds balance');
                }

                return true;
              },
              async () => {
                const staked = await getGovStaked(walletAddress);
                const tx = await signer
                  .invoke({
                    dApp: stakingContract,
                    fee: 5e6,
                    payment: [],
                    call: {
                      function: 'withdrawSWOP',
                      args: [{ type: 'integer', value: staked.toFixed(0) }],
                    },
                  })
                  .broadcast();

                return {
                  tx,
                  wait: () => signer.waitTxConfirm(tx, 1),
                };
              }
            ),
          ],
        };
      },
    };
  },
  farming: async (provider, contractAddress, initOptions = waves.defaultOptions()) => {
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
      staking: {
        token: shareToken,
      },
      reward: {
        token: swopTokenId,
      },
      metrics: {
        tvl: toFloat(totalLiquidity, 6).toString(10),
        aprDay: aprDay.plus(swopAPY).toString(10),
        aprWeek: aprWeek.plus(swopAPY).toString(10),
        aprMonth: aprMonth.plus(swopAPY).toString(10),
        aprYear: aprYear.plus(swopAPY).toString(10),
      },
      wallet: async (walletAddress) => {
        const assets = (await axios.get('https://backend.swop.fi/assets')).data.data;
        const exchanger = (await axios.get('https://backend.swop.fi/exchangers/data')).data.data;
        const walletFarmingData = (await axios.get(`https://backend.swop.fi/farming/${walletAddress}`)).data.data;

        if (!walletFarmingData.find((w) => w.key === `${contractAddress}_${walletAddress}_share_tokens_locked`)) {
          return {
            staked: {},
            earned: {},
            metrics: {
              staking: '0',
              stakingUSD: '0',
              earned: '0',
              earnedUSD: '0',
              withdrawn: '0',
            },
            tokens: tokens(),
          };
        }

        const sharedExchangerData = exchanger[contractAddress];
        const totalSharedLocked = toFloat(
          walletFarmingData.find((w) => w.key === `${contractAddress}_${walletAddress}_share_tokens_locked`)?.value ||
            0,
          8
        );

        const tokenA = assets[sharedExchangerData.A_asset_id];
        const tokenB = assets[sharedExchangerData.B_asset_id];
        const swopToken = assets[swopTokenId];

        const tokenAAmountInShared = toFloat(sharedExchangerData.A_asset_balance, tokenA.precision);
        const tokenBAmountInShared = toFloat(sharedExchangerData.B_asset_balance, tokenB.precision);

        const tokenAAmountInLocked = tokenAAmountInShared.multipliedBy(
          totalSharedLocked.div(toFloat(sharedExchangerData.share_asset_supply, 8))
        );
        const tokenBAmountInLocked = tokenBAmountInShared.multipliedBy(
          totalSharedLocked.div(toFloat(sharedExchangerData.share_asset_supply, 8))
        );

        const tokenAAmountInLockedUsd = tokenAAmountInLocked.multipliedBy(await getUsdPriceOfToken(tokenA.id));
        const tokenBAmountInLockedUsd = tokenBAmountInLocked.multipliedBy(await getUsdPriceOfToken(tokenB.id));

        const lastInterest = toFloat(
          walletFarmingData.find((w) => w.key === `${contractAddress}_last_interest`).value,
          swopToken.precision
        );
        const lastUserInterest = toFloat(
          walletFarmingData.find((w) => w.key === `${contractAddress}_${walletAddress}_last_interest`).value,
          swopToken.precision
        );

        const earned = totalSharedLocked.multipliedBy(lastInterest.minus(lastUserInterest));
        const earnedUSD = earned.multipliedBy(await getUsdPriceOfToken(swopToken.id));

        return {
          staked: {
            [tokenA.id]: {
              balance: tokenAAmountInLocked.toString(10),
              usd: tokenAAmountInLockedUsd.toString(10),
            },
            [tokenB.id]: {
              balance: tokenBAmountInLocked.toString(10),
              usd: tokenBAmountInLockedUsd.toString(10),
            },
          },
          earned: {
            [swopTokenId]: {
              balance: earned.toString(10),
              usd: earnedUSD.toString(10),
            },
          },
          metrics: {
            staking: totalSharedLocked.toString(10),
            stakingUSD: tokenAAmountInLockedUsd.plus(tokenBAmountInLockedUsd).toString(10),
            earned: earned.toString(10),
            earnedUSD: earnedUSD.toString(10),
          },
          tokens: tokens(
            {
              token: tokenA.id,
              data: {
                balance: tokenAAmountInLocked.toString(10),
                usd: tokenAAmountInLockedUsd.toString(10),
              },
            },
            {
              token: tokenB.id,
              data: {
                balance: tokenBAmountInLocked.toString(10),
                usd: tokenBAmountInLockedUsd.toString(10),
              },
            },
            {
              token: swopTokenId,
              data: {
                balance: earned.toString(10),
                usd: earnedUSD.toString(10),
              },
            }
          ),
        };
      },
      actions: async (walletAddress) => {
        if (options.signer === null) {
          throw new Error('Signer not found, use options.signer for use actions');
        }
        const { signer } = options;

        const assets = await axios.get('https://backend.swop.fi/assets').then((res) => res.data.data);
        const exchanger = await axios.get('https://backend.swop.fi/exchangers/data').then((res) => res.data.data);
        const stakingToken = assets[exchanger[contractAddress].share_asset_id];

        return {
          stake: [
            AutomateActions.tab(
              'Stake',
              async () => {
                const balance = await getBalance(stakingToken.id, walletAddress);

                return {
                  description: `Stake your [${stakingToken.name}](https://wavesexplorer.com/assets/${stakingToken.id}) tokens to contract`,
                  inputs: [
                    AutomateActions.input({
                      placeholder: 'amount',
                      value: balance.div(`1e${stakingToken.precision}`).toString(10),
                    }),
                  ],
                };
              },
              async (amount) => {
                const amountInt = new bn(amount).multipliedBy(`1e${stakingToken.precision}`);
                if (amountInt.lte(0)) return Error('Invalid amount');

                const balance = await getBalance(stakingToken.id, walletAddress);
                if (amountInt.gt(balance.toString())) {
                  return Error('Amount exceeds balance');
                }

                return true;
              },
              async (amount) => {
                const amountInt = new bn(amount).multipliedBy(`1e${stakingToken.precision}`);
                const tx = await signer
                  .invoke({
                    dApp: farmingContract,
                    fee: 5e6,
                    payment: [
                      {
                        assetId: stakingToken.id,
                        amount: amountInt.toFixed(0),
                      },
                    ],
                    call: {
                      function: 'lockShareTokens',
                      args: [{ type: 'string', value: contractAddress }],
                    },
                  })
                  .broadcast();

                return {
                  tx,
                  wait: () => signer.waitTxConfirm(tx, 1),
                };
              }
            ),
          ],
          unstake: [
            AutomateActions.tab(
              'Unstake',
              async () => {
                const staked = await getStaked(contractAddress, walletAddress);

                return {
                  description: `Unstake your [${stakingToken.name}](https://wavesexplorer.com/assets/${stakingToken.id}) tokens from contract`,
                  inputs: [
                    AutomateActions.input({
                      placeholder: 'amount',
                      value: staked.div(`1e${stakingToken.precision}`).toString(10),
                    }),
                  ],
                };
              },
              async (amount) => {
                const amountInt = new bn(amount).multipliedBy(`1e${stakingToken.precision}`);
                if (amountInt.lte(0)) return Error('Invalid amount');

                const staked = await getStaked(contractAddress, walletAddress);
                if (amountInt.isGreaterThan(staked)) {
                  return Error('Amount exceeds balance');
                }

                return true;
              },
              async (amount) => {
                const amountInt = new bn(amount).multipliedBy(`1e${stakingToken.precision}`);
                const tx = await signer
                  .invoke({
                    dApp: farmingContract,
                    fee: 5e6,
                    payment: [],
                    call: {
                      function: 'withdrawShareTokens',
                      args: [
                        { type: 'string', value: contractAddress },
                        { type: 'integer', value: amountInt.toFixed(0) },
                      ],
                    },
                  })
                  .broadcast();

                return {
                  tx,
                  wait: () => signer.waitTxConfirm(tx, 1),
                };
              }
            ),
          ],
          claim: [
            AutomateActions.tab(
              'Claim',
              async () => ({
                description: `Claim your [SWOP](https://wavesexplorer.com/assets/Ehie5xYpeN8op1Cctc6aGUrqx8jq3jtf1DSjXDbfm7aT) reward from contract`,
              }),
              async () => true,
              async () => {
                const tx = await signer
                  .invoke({
                    dApp: farmingContract,
                    fee: 5e6,
                    payment: [],
                    call: {
                      function: 'claim',
                      args: [{ type: 'string', value: contractAddress }],
                    },
                  })
                  .broadcast();

                return {
                  tx,
                  wait: () => signer.waitTxConfirm(tx, 1),
                };
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
                const staked = await getStaked(contractAddress, walletAddress);
                if (amountInt.isGreaterThan(staked)) {
                  return Error('Amount exceeds balance');
                }

                return true;
              },
              async () => {
                const staked = await getStaked(contractAddress, walletAddress);
                const tx = await signer
                  .invoke({
                    dApp: farmingContract,
                    fee: 5e6,
                    payment: [],
                    call: {
                      function: 'withdrawShareTokens',
                      args: [
                        { type: 'string', value: contractAddress },
                        { type: 'integer', value: staked.toFixed(0) },
                      ],
                    },
                  })
                  .broadcast();

                return {
                  tx,
                  wait: () => signer.waitTxConfirm(tx, 1),
                };
              }
            ),
          ],
        };
      },
    };
  },
  automates: {
    deploy: {
      autorestake: async (signer, dAppBase64) => {
        const netByte = await signer.getNetworkByte();
        const node = waves.nodes[netByte] ?? waves.nodes.main;
        const deploySeed = wavesTransaction.libs.crypto.randomSeed();
        const deployAddress = wavesTransaction.libs.crypto.address(deploySeed, netByte);

        return {
          deploy: [
            AutomateActions.tab(
              'Transfer',
              async () => ({
                description: `Transfer 0.01 Waves tokens to contract wallet ${deployAddress}`,
              }),
              async () => {
                const wavesBalance = await getWavesBalance(node, signer.currentProvider.user.address);
                if (wavesBalance.lt(1e6)) {
                  return Error('Exceeds balance');
                }

                return true;
              },
              async () => {
                const tx = await signer
                  .transfer({
                    amount: 1e6, // 0.01 WAVES
                    recipient: deployAddress,
                  })
                  .broadcast();

                return {
                  tx,
                  wait: () => signer.waitTxConfirm(tx, 1),
                };
              }
            ),
            AutomateActions.tab(
              'Deploy',
              async () => ({
                description: 'Deploy your own contract',
              }),
              async () => {
                return true;
              },
              async () => {
                const contractSigner = new wavesSigner({ NODE_URL: node });
                await contractSigner.setProvider(new wavesSeedProvider(deploySeed));
                const tx = await contractSigner.setScript({ script: `base64:${dAppBase64}` }).broadcast();

                return {
                  tx,
                  wait: () => contractSigner.waitTxConfirm(tx, 1),
                  getAddress: () => deployAddress,
                };
              }
            ),
            AutomateActions.tab(
              'Init',
              async () => ({
                description: 'Init your own contract',
              }),
              async () => {
                const wavesBalance = await getWavesBalance(node, signer.currentProvider.user.address);
                if (wavesBalance.lt(5e5)) {
                  return Error('Exceeds balance');
                }

                return true;
              },
              async () => {
                const tx = await signer.invokeScript({
                  dApp: deployAddress,
                  fee: 500000,
                  call: {
                    function: 'init',
                    args: [],
                  }
                 }).broadcast();

                return {
                  tx,
                  wait: () => signer.waitTxConfirm(tx, 1),
                  getAddress: () => deployAddress,
                };
              }
            ),
          ],
        };
      },
    },
    autorestake: async (signer, contractAddress) => {
      const netByte = await signer.getNetworkByte();
      const node = waves.nodes[netByte] ?? waves.nodes.main;

      const deposit = [
        AutomateActions.tab(
          'Transfer',
          async () => ({
            description: 'Transfer your tokens to your contract',
            inputs: [
              AutomateActions.input({
                placeholder: 'amount',
                value: '0',
              }),
            ],
          }),
          async (amount) => {
            return true;
          },
          async (amount) => {
            const tx = await signer.invokeScript({}).broadcast();

            /*
            const tx = invokeScript(
              {
                dApp: contractAddress,
                fee: 500000,
                payment: [
                  {
                    amount: 10000,
                    assetId: swopFeeAssetId,
                  },
                ],
                call: {
                  function: 'governanceLockSWOP',
                },
              },
              'wallet seed'
            );
            */

            return {
              tx,
            };
          }
        ),
        AutomateActions.tab(
          'Deposit',
          async () => ({
            description: 'Stake your tokens to the contract',
          }),
          async () => {
            return true;
          },
          async () => ({
            tx: null,
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
            return true;
          },
          async () => ({
            tx: null,
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
            return true;
          },
          async () => {
            return {
              tx: null,
            };
          }
        ),
        ...deposit,
      ];
      const runParams = async () => {
        return {
          calldata: [],
        };
      };
      const run = async () => {
        const { calldata } = await runParams();
        return null;
      };

      return {
        contract: contractAddress,
        deposit,
        refund,
        migrate,
        runParams,
        run,
      };
    },
  },
};

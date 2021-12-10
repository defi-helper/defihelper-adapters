const { axios, bn, wavesTransaction, wavesSigner, wavesSeedProvider } = require('../lib');
const { waves, toFloat, coingecko, tokens } = require('../utils');
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
  const usdPrice = await coingecko.getPriceUSD(true, undefined, tokenId);
  return amount.multipliedBy(usdPrice);
};

const prepareContractCall = (dApp, fnName, args = [], payment = []) => {
  return {
    type: 16,
    data: {
      dApp,
      call: {
        function: fnName,
        args,
      },
      fee: {
        tokens: '0.005',
        assetId: 'WAVES',
      },
      payment,
    },
  };
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

/*
  contractAddress = '3PH8Np6jwuoikvkHL2qmdpFEHBR4UV5vwSq';
  walletAddress = '3P9s27vtTw9Sux3T2qLSQ6ccx4PuQTYffiu';
 */
module.exports = {
  governanceStaking: async (provider, contractAddress, initOptions = waves.defaultOptions()) => {
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
        const governance = (await axios.get(`https://backend.swop.fi/governance/${walletAddress}`)).data.data;
        const balances = (await axios.get(`https://nodes.swop.fi/assets/balance/${walletAddress}`)).data.balances;

        const staked = new bn(governance.find((g) => g.key === `${walletAddress}_SWOP_amount`)?.value || '0');
        const swopBalance = new bn(balances.find((a) => a.assetId === swopToken.id)?.balance || 0);

        const lockedInVoting = new bn(0); // TODO: Support locked SWOP

        return {
          stake: {
            can: async (amount) => {
              if (new bn(amount).isGreaterThan(swopBalance.toString())) {
                return Error('Amount exceeds balance');
              }

              return true;
            },
            send: async (amount) => {
              await provider.signAndPublishTransaction(
                prepareContractCall(
                  stakingContract,
                  'lockSWOP',
                  [],
                  [{ assetId: swopToken.id, tokens: toFloat(amount, swopToken.precision).toNumber() }]
                )
              );
            },
          },
          unstake: {
            can: async (amount) => {
              if (new bn(amount).isGreaterThan(staked.minus(lockedInVoting).toString())) {
                return Error('Amount exceeds balance');
              }

              return true;
            },
            send: async (amount) => {
              await provider.signAndPublishTransaction(
                prepareContractCall(stakingContract, 'withdrawSWOP', [
                  { type: 'integer', value: Math.round(new bn(amount).toNumber()) },
                ])
              );
            },
          },
          claim: {
            can: async () => {
              return true;
            },
            send: async () => {
              await provider.signAndPublishTransaction(prepareContractCall(stakingContract, 'claimAndStakeSWOP', []));
            },
          },
          exit: {
            can: async () => {
              if (new bn(staked).isLessThanOrEqualTo(0)) {
                return Error('No SWOP locked in contract');
              }

              return true;
            },
            send: async () => {
              await provider.signAndPublishTransaction(
                prepareContractCall(stakingContract, 'withdrawSWOP', [
                  { type: 'integer', value: Math.round(new bn(staked).toNumber()) },
                ])
              );
            },
          },
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
        const assets = (await axios.get('https://backend.swop.fi/assets')).data.data;
        const exchanger = (await axios.get('https://backend.swop.fi/exchangers/data')).data.data;
        const balances = (await axios.get(`https://nodes.swop.fi/assets/balance/${walletAddress}`)).data.balances;
        const walletFarmingData = (await axios.get(`https://backend.swop.fi/farming/${walletAddress}`)).data.data;

        const stakingToken = assets[exchanger[contractAddress].share_asset_id];
        const stakingBalance = new bn(balances.find((a) => a.assetId === contractAddress)?.balance || 0);
        const totalStakingLocked = new bn(
          walletFarmingData.find((w) => w.key === `${contractAddress}_${walletAddress}_share_tokens_locked`)?.value || 0
        );

        return {
          stake: {
            can: async (amount) => {
              if (new bn(amount).isGreaterThan(stakingBalance.toString())) {
                return Error('Amount exceeds balance');
              }

              return true;
            },
            send: async (amount) => {
              await provider.signAndPublishTransaction(
                prepareContractCall(
                  farmingContract,
                  'lockShareTokens',
                  [{ type: 'string', value: contractAddress }],
                  [{ assetId: stakingToken.id, tokens: toFloat(amount, stakingToken.precision).toNumber() }]
                )
              );
            },
          },
          unstake: {
            can: async (amount) => {
              if (new bn(amount).isGreaterThan(totalStakingLocked.toString())) {
                return Error('Amount exceeds balance');
              }

              return true;
            },
            send: async (amount) => {
              await provider.signAndPublishTransaction(
                prepareContractCall(farmingContract, 'withdrawShareTokens', [
                  { type: 'string', value: contractAddress },
                  { type: 'integer', value: Math.round(new bn(amount).toNumber()) },
                ])
              );
            },
          },
          claim: {
            can: async () => {
              return true;
            },
            send: async () => {
              await provider.signAndPublishTransaction(
                prepareContractCall(farmingContract, 'claim', [{ type: 'string', value: contractAddress }])
              );
            },
          },
          exit: {
            can: async () => {
              if (new bn(totalStakingLocked).isLessThanOrEqualTo(0)) {
                return Error('No LP in contract');
              }

              return true;
            },
            send: async () => {
              await provider.signAndPublishTransaction(
                prepareContractCall(farmingContract, 'withdrawShareTokens', [
                  { type: 'string', value: contractAddress },
                  { type: 'integer', value: Math.round(new bn(totalStakingLocked).toNumber()) },
                ])
              );
            },
          },
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
                description: `Transfer 0.04 Waves tokens to contract wallet ${deployAddress}`,
              }),
              async () => {
                return true;
              },
              async () => {
                const tx = await signer
                  .transfer({
                    amount: 4e6, // 0.04 WAVES
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
                description: 'Deploy your automate contract',
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
            description: 'Transfer your tokens to automate',
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
            const tx = await signer.invokeScript({

            }).broadcast();

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
            description: 'Deposit tokens to staking',
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

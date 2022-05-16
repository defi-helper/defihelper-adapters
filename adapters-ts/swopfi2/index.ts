import type { BigNumber } from "bignumber.js";
import {
  bignumber as bn,
  axios,
  wavesSigner,
  wavesSeedProvider,
  wavesTransaction,
} from "../lib";
import { nodes, defaultOptions } from "../utils/waves/base";
import * as waves from "../utils/waves/adapter/base";
import { Staking } from "../utils/adapter/base";
import { CoingeckoProvider } from "../utils/coingecko";

const swopTokenId = "Ehie5xYpeN8op1Cctc6aGUrqx8jq3jtf1DSjXDbfm7aT";
const farmingContract = "3P73HDkPqG15nLXevjCbmXtazHYTZbpPoPw";
const stakingContract = "3PLHVWCqA9DJPDbadUofTohnCULLauiDWhS";

const mainTokensToCoingeckoId: Record<string, string> = {
  DG2xFkPdDwKUoBkzGAhQtLpSGzfXLiCYPEzeKH2Ad24p: "neutrino-usd",
  "8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS": "btc",
  WAVES: "waves",
  Ehie5xYpeN8op1Cctc6aGUrqx8jq3jtf1DSjXDbfm7aT: "swop",
  DUk2YTxhRoAqMJLus4G2b3fR8hMHVh6eiyFx5r29VR6t: "EURT",
};

const convertFromTokenToUsd = async (tokenId: string, amount: BigNumber) => {
  const usdPrice = await new CoingeckoProvider({
    block: { timestamp: 0 },
    blockTag: "latest",
  }).price(tokenId);
  return amount.multipliedBy(usdPrice);
};

const getUsdPriceOfToken = async (assetAddress: string) => {
  if (mainTokensToCoingeckoId[assetAddress]) {
    return convertFromTokenToUsd(
      mainTokensToCoingeckoId[assetAddress],
      new bn(1)
    );
  }

  const exchangers = await axios
    .get<{
      data: Array<{
        A_asset_id: string;
        A_asset_balance: string;
        B_asset_id: string;
        B_asset_balance: string;
      }>;
    }>("https://backend.swop.fi/exchangers/data")
    .then(({ data }) => data.data);
  const mainTokens = Object.keys(mainTokensToCoingeckoId);

  for (const token of mainTokens) {
    const exchanger = exchangers.find(
      (e) => e.A_asset_id === assetAddress && e.B_asset_id === token
    );
    if (exchanger) {
      const assetPriceInToken = new bn(exchanger.A_asset_balance).div(
        exchanger.B_asset_balance
      );
      return convertFromTokenToUsd(
        mainTokensToCoingeckoId[token],
        assetPriceInToken
      );
    }
  }

  throw new Error(`Unable to find USD price for ${assetAddress}`);
};

const getBalance = (assetId: string, walletAddress: string) => {
  return axios
    .get<{ balances: Array<{ assetId: string; balance: string }> }>(
      `https://nodes.swop.fi/assets/balance/${walletAddress}`
    )
    .then(
      ({ data: { balances } }) =>
        new bn(
          balances.find((asset) => asset.assetId === assetId)?.balance ?? "0"
        )
    );
};

const getStaked = (contractAddress: string, walletAddress: string) => {
  return axios
    .get<{ data: Array<{ key: string; value: string }> }>(
      `https://backend.swop.fi/farming/${walletAddress}`
    )
    .then(
      ({ data: { data } }) =>
        new bn(
          data.find(
            ({ key }) =>
              key === `${contractAddress}_${walletAddress}_share_tokens_locked`
          )?.value ?? "0"
        )
    );
};

const getGovStaked = (walletAddress: string) => {
  return axios
    .get<{ data: Array<{ key: string; value: string }> }>(
      `https://backend.swop.fi/governance/${walletAddress}`
    )
    .then(
      ({ data: { data } }) =>
        new bn(
          data.find(({ key }) => key === `${walletAddress}_SWOP_amount`)
            ?.value ?? "0"
        )
    );
};

const getWavesBalance = (node: string, walletAddress: string) => {
  return axios
    .get(`${node}/addresses/balance/${walletAddress}`)
    .then(({ data: { balance } }) => new bn(balance));
};

module.exports = {
  governanceStaking: waves.stakingAdapter(
    async (provider, contractAddress, initOptions = defaultOptions()) => {
      const options = {
        ...defaultOptions(),
        ...initOptions,
      };
      const assets = await axios
        .get("https://backend.swop.fi/assets")
        .then(({ data }) => data.data);
      const swopToken = assets[swopTokenId];

      const totalLiquidity = await axios
        .get<{ data: Array<{ key: string; value: string }> }>(
          "https://backend.swop.fi/governance/"
        )
        .then(({ data: { data } }) =>
          new bn(
            data.find(({ key }) => key === "total_SWOP_amount")?.value ?? "0"
          ).div(`1e${swopToken.precision}`)
        );
      const stakingTokenPriceUSD = await getUsdPriceOfToken(swopToken.id);
      const totalLiquidityUSD =
        totalLiquidity.multipliedBy(stakingTokenPriceUSD);
      const apr = await axios
        .get<{ data: { apy: string } }>(
          "https://backend.swop.fi/governance/apy/week"
        )
        .then(
          ({
            data: {
              data: { apy },
            },
          }) => new bn(apy).div(100)
        );

      return {
        stakeToken: {
          address: swopTokenId,
          decimals: swopToken.precision,
          priceUSD: stakingTokenPriceUSD.toString(10),
        },
        rewardToken: {
          address: swopTokenId,
          decimals: swopToken.precision,
          priceUSD: stakingTokenPriceUSD.toString(10),
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
          const governance = await axios
            .get<{ data: Array<{ key: string; value: string }> }>(
              `https://backend.swop.fi/governance/${walletAddress}`
            )
            .then(({ data }) => data.data);

          const staked = new bn(
            governance.find(({ key }) => key === `${walletAddress}_SWOP_amount`)
              ?.value ?? "0"
          ).div(`1e${swopToken.precision}`);
          const stakingTokenPriceUSD = await getUsdPriceOfToken(swopToken.id);
          const stakedUSD = staked.multipliedBy(stakingTokenPriceUSD);

          const lastInterest = new bn(
            governance.find(({ key }) => key === "last_interest")?.value ?? "0"
          ).div(`1e${swopToken.precision}`);
          const lastUserInterest = new bn(
            governance.find((g) => g.key === `${walletAddress}_last_interest`)
              ?.value ?? "0"
          ).div(`1e${swopToken.precision}`);

          const earned = staked.multipliedBy(
            lastInterest.minus(lastUserInterest)
          );
          const earnedUSD = earned.multipliedBy(stakingTokenPriceUSD);

          return {
            staked: {
              [swopToken.id]: {
                balance: staked.toString(10),
                usd: stakedUSD.toString(10),
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
            tokens: Staking.tokens({
              token: swopTokenId,
              data: {
                balance: earned.toString(10),
                usd: earnedUSD.toString(10),
              },
            }),
          };
        },
        actions: async (walletAddress) => {
          const { signer } = options;
          if (!signer) {
            throw new Error(
              "Signer not found, use options.signer for use actions"
            );
          }
          const stakingToken = swopToken;

          return {
            stake: {
              name: "staking-stake",
              methods: {
                symbol: () => stakingToken.name,
                link: () =>
                  `https://wavesexplorer.com/assets/${stakingToken.id}`,
                balanceOf: () =>
                  getBalance(stakingToken.id, walletAddress).then((v) =>
                    v.div(`1e${stakingToken.precision}`).toString(10)
                  ),
                can: async (amount) => {
                  const amountInt = new bn(amount).multipliedBy(
                    `1e${stakingToken.precision}`
                  );
                  if (amountInt.lte(0)) return Error("Invalid amount");

                  const balance = await getBalance(
                    stakingToken.id,
                    walletAddress
                  );
                  if (amountInt.gt(balance.toString())) {
                    return Error("Amount exceeds balance");
                  }

                  return true;
                },
                stake: async (amount) => {
                  const tx = await signer
                    .invoke({
                      dApp: stakingContract,
                      fee: 5e6,
                      payment: [
                        {
                          assetId: stakingToken.id,
                          amount: new bn(amount)
                            .multipliedBy(`1e${stakingToken.precision}`)
                            .toFixed(0),
                        },
                      ],
                      call: {
                        function: "lockSWOP",
                        args: [],
                      },
                    })
                    .broadcast();

                  return {
                    tx: { ...tx, wait: () => signer.waitTxConfirm(tx, 1) },
                  };
                },
              },
            },
            unstake: {
              name: "staking-unstake",
              methods: {
                symbol: () => stakingToken.name,
                link: () =>
                  `https://wavesexplorer.com/assets/${stakingToken.id}`,
                balanceOf: () =>
                  getGovStaked(walletAddress).then((v) =>
                    v.div(`1e${stakingToken.precision}`).toString(10)
                  ),
                can: async (amount) => {
                  const amountInt = new bn(amount).multipliedBy(
                    `1e${stakingToken.precision}`
                  );
                  if (amountInt.lte(0)) return Error("Invalid amount");

                  const staked = await getGovStaked(walletAddress);
                  if (amountInt.isGreaterThan(staked)) {
                    return Error("Amount exceeds balance");
                  }

                  return true;
                },
                unstake: async (amount) => {
                  const tx = await signer
                    .invoke({
                      dApp: stakingContract,
                      fee: 5e6,
                      payment: [],
                      call: {
                        function: "withdrawSWOP",
                        args: [
                          {
                            type: "integer",
                            value: new bn(amount)
                              .multipliedBy(`1e${stakingToken.precision}`)
                              .toFixed(0),
                          },
                        ],
                      },
                    })
                    .broadcast();

                  return {
                    tx: { ...tx, wait: () => signer.waitTxConfirm(tx, 1) },
                  };
                },
              },
            },
            claim: {
              name: "staking-claim",
              methods: {
                symbol: () => "SWOP",
                link: () => `https://wavesexplorer.com/assets/${swopTokenId}`,
                can: async () => true,
                claim: async () => {
                  const tx = await signer
                    .invoke({
                      dApp: stakingContract,
                      fee: 5e6,
                      payment: [],
                      call: {
                        function: "claimAndWithdrawSWOP",
                        args: [],
                      },
                    })
                    .broadcast();

                  return {
                    tx: { ...tx, wait: () => signer.waitTxConfirm(tx, 1) },
                  };
                },
              },
            },
            exit: {
              name: "staking-exit",
              methods: {
                can: async () => true,
                exit: async () => {
                  const tx = await signer
                    .invoke({
                      dApp: stakingContract,
                      fee: 5e6,
                      payment: [],
                      call: {
                        function: "withdrawSWOP",
                        args: [
                          {
                            type: "integer",
                            value: await getGovStaked(walletAddress).then((v) =>
                              v.toFixed(0)
                            ),
                          },
                        ],
                      },
                    })
                    .broadcast();

                  return {
                    tx: { ...tx, wait: () => signer.waitTxConfirm(tx, 1) },
                  };
                },
              },
            },
          };
        },
      };
    }
  ),
  automates: {
    deploy: {
      autorestake: waves.deployAdapter(async (signer, dAppBase64) => {
        const netByte = await signer.getNetworkByte();
        const node = nodes[netByte] ?? nodes[87];
        const signerAddress = signer.currentProvider?.user?.address;
        if (!signerAddress) throw new Error("Invalid signer");
        const deploySeed = wavesTransaction.libs.crypto.randomSeed();
        const deployAddress = wavesTransaction.libs.crypto.address(
          deploySeed,
          netByte
        );
        const contractSigner = new wavesSigner({ NODE_URL: node });
        await contractSigner.setProvider(new wavesSeedProvider(deploySeed));

        return {
          contract: deployAddress,
          deploy: [
            {
              name: "Transfer",
              info: () => ({
                description: `Transfer 0.011 Waves tokens to contract wallet ${deployAddress}`,
              }),
              can: async () => {
                const wavesBalance = await getWavesBalance(node, signerAddress);
                if (wavesBalance.lt(11e5)) {
                  return Error("Exceeds balance");
                }

                return true;
              },
              send: async () => ({
                tx: await signer
                  .transfer({
                    amount: 11e5, // 0.011 WAVES
                    recipient: deployAddress,
                  })
                  .broadcast(),
              }),
            },
            {
              name: "Init",
              info: () => ({
                description: "Init your own contract",
              }),
              can: async () => {
                const wavesBalance = await getWavesBalance(node, signerAddress);
                if (wavesBalance.lt(5e5)) {
                  return Error("Exceeds balance");
                }

                return true;
              },
              send: async () => ({
                tx: await contractSigner
                  .data({
                    data: [
                      {
                        type: "string",
                        key: "owner",
                        value: signerAddress,
                      },
                      {
                        type: "boolean",
                        key: "is_dapp_active",
                        value: true,
                      },
                    ],
                  })
                  .broadcast(),
              }),
            },
            {
              name: "Deploy",
              info: () => ({
                description: "Deploy your own contract",
              }),
              can: () => true,
              send: async () => ({
                tx: await contractSigner
                  .setScript({ script: `base64:${dAppBase64}` })
                  .broadcast(),
              }),
            },
          ],
        };
      }),
    },
    autorestake: waves.automateAdapter(async (signer, contractAddress) => {
      const netByte = await signer.getNetworkByte();
      const node = nodes[netByte] ?? nodes[87];
      const signerAddress = signer.currentProvider?.user?.address;
      if (!signerAddress) throw new Error("Invalid signer");
      const assets = await axios
        .get("https://backend.swop.fi/assets")
        .then(({ data }) => data.data);
      const stakingToken = assets[swopTokenId];

      const runParams: waves.Automate.AdapterRun["runParams"] = async () => ({
        calldata: [{ type: "integer", value: "0" }],
      });
      const run: waves.Automate.AdapterRun["run"] = async () => {
        const params = await runParams();
        if (params instanceof Error) return params;

        return await signer
          .invoke({
            dApp: contractAddress,
            fee: 5e6,
            payment: [],
            call: {
              function: "governanceLockSWOP",
              args: params.calldata,
            },
          })
          .broadcast();
      };

      return {
        contract: contractAddress,
        deposit: {
          name: "automateRestake-deposit",
          methods: {
            balanceOf: () =>
              getBalance(stakingToken.id, signerAddress).then((v) =>
                v.div(`1e${stakingToken.precision}`).toString(10)
              ),
            can: async (amount) => {
              const amountInt = new bn(amount).multipliedBy(
                `1e${stakingToken.precision}`
              );
              if (amountInt.lte(0)) return Error("Invalid amount");

              const balance = await getBalance(stakingToken.id, signerAddress);
              if (amountInt.gt(balance.toString())) {
                return Error("Amount exceeds balance");
              }

              return true;
            },
            deposit: async (amount) => {
              const tx = await signer
                .invoke({
                  dApp: contractAddress,
                  fee: 5e6,
                  payment: [
                    {
                      amount: new bn(amount)
                        .multipliedBy(`1e${stakingToken.precision}`)
                        .toFixed(0),
                      assetId: swopTokenId,
                    },
                  ],
                  call: {
                    function: "governanceLockSWOP",
                    args: [],
                  },
                })
                .broadcast();

              return { tx: { ...tx, wait: () => signer.waitTxConfirm(tx, 1) } };
            },
          },
        },
        refund: {
          name: "automateRestake-refund",
          methods: {
            staked: () =>
              getGovStaked(contractAddress).then((v) =>
                v.div(`1e${stakingToken.precision}`).toString(10)
              ),
            can: async (amount) => {
              const amountInt = new bn(amount).multipliedBy(
                `1e${stakingToken.precision}`
              );
              if (amountInt.lte(0)) return Error("Invalid amount");

              const staked = await getGovStaked(contractAddress);
              if (amountInt.isGreaterThan(staked)) {
                return Error("Amount exceeds balance");
              }

              return true;
            },
            refund: async (amount) => {
              const tx = await signer
                .invoke({
                  dApp: contractAddress,
                  fee: 5e6,
                  payment: [],
                  call: {
                    function: "governanceWithdraw",
                    args: [
                      {
                        type: "integer",
                        value: new bn(amount)
                          .multipliedBy(`1e${stakingToken.precision}`)
                          .toFixed(0),
                      },
                    ],
                  },
                })
                .broadcast();

              return { tx: { ...tx, wait: () => signer.waitTxConfirm(tx, 1) } };
            },
          },
        },
        runParams,
        run,
      };
    }),
  },
};

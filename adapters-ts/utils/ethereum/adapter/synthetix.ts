import type ethersType from "ethers";
import { bignumber as bn, ethers, ethersMulticall, dayjs } from "../../../lib";
import { toBN, BlockNumber } from "../base";
import * as erc20 from "../erc20";
import * as uniswap from "../uniswap";
import { Action, Automate, Deploy } from "./base";

export function stakingAutomateDeployTabs({
  liquidityRouter: router,
  defaultContractAddress,
  automateABI,
}: {
  liquidityRouter: string;
  defaultContractAddress?: string;
  automateABI?: any;
}): Deploy.Adapter {
  return async (
    signer,
    factoryAddress,
    prototypeAddress,
    contractAddress = undefined
  ) => ({
    deploy: [
      Action.tab(
        "Deploy",
        async () => ({
          description: "Deploy your own contract",
          inputs: [
            Action.input({
              placeholder: "Staking contract",
              value: contractAddress ?? defaultContractAddress ?? "",
            }),
            Action.input({
              placeholder: "Liquidity pool router address",
              value: router,
            }),
            Action.input({
              placeholder: "Slippage percent",
              value: "1",
            }),
            Action.input({
              placeholder: "Deadline (seconds)",
              value: "300",
            }),
          ],
        }),
        async (staking, router, slippage, deadline) => {
          if (slippage < 0 || slippage > 100)
            return new Error("Invalid slippage percent");
          if (deadline < 0) return new Error("Deadline has already passed");

          return true;
        },
        async (staking, router, slippage, deadline) =>
          Deploy.deploy(
            signer,
            factoryAddress,
            prototypeAddress,
            new ethers.utils.Interface(
              automateABI ?? [
                {
                  inputs: [
                    {
                      internalType: "address",
                      name: "_staking",
                      type: "address",
                    },
                    {
                      internalType: "address",
                      name: "_liquidityRouter",
                      type: "address",
                    },
                    {
                      internalType: "uint16",
                      name: "_slippage",
                      type: "uint16",
                    },
                    {
                      internalType: "uint16",
                      name: "_deadline",
                      type: "uint16",
                    },
                  ],
                  name: "init",
                  outputs: [],
                  stateMutability: "nonpayable",
                  type: "function",
                },
              ]
            ).encodeFunctionData("init", [
              staking,
              router,
              Math.floor(slippage * 100),
              deadline,
            ])
          )
      ),
    ],
  });
}

export function stakingPairAutomateAdapter({
  automateABI,
  stakingABI,
}: {
  automateABI: any;
  stakingABI: any;
}): Automate.Adapter {
  return async (signer, contractAddress) => {
    if (!signer.provider) throw new Error("Provider not found");
    const provider = signer.provider;
    const signerAddress = await signer.getAddress();
    const automate = new ethers.Contract(contractAddress, automateABI, signer);
    const stakingAddress = await automate.staking();
    const staking = new ethers.Contract(stakingAddress, stakingABI, signer);
    const stakingTokenAddress = await staking.stakingToken();
    const stakingToken = erc20.contract(signer, stakingTokenAddress);
    const stakingTokenDecimals = await stakingToken
      .decimals()
      .then((v: ethersType.BigNumber) => Number(v.toString()));

    const deposit = [
      Action.tab(
        "Transfer",
        async () => ({
          description: "Transfer your tokens to your contract",
          inputs: [
            Action.input({
              placeholder: "amount",
              value: await stakingToken
                .balanceOf(signerAddress)
                .then((v: ethersType.BigNumber) =>
                  toBN(v).div(`1e${stakingTokenDecimals}`).toString(10)
                ),
            }),
          ],
        }),
        async (amount) => {
          const signerBalance = await stakingToken
            .balanceOf(signerAddress)
            .then(toBN);
          const amountInt = new bn(amount).multipliedBy(
            `1e${stakingTokenDecimals}`
          );
          if (amountInt.lte(0)) return Error("Invalid amount");
          if (amountInt.gt(signerBalance))
            return Error("Insufficient funds on the balance");

          return true;
        },
        async (amount) => ({
          tx: await stakingToken.transfer(
            automate.address,
            new bn(amount).multipliedBy(`1e${stakingTokenDecimals}`).toFixed(0)
          ),
        })
      ),
      Action.tab(
        "Deposit",
        async () => ({
          description: "Stake your tokens to the contract",
        }),
        async () => {
          const automateBalance = await stakingToken
            .balanceOf(automate.address)
            .then(toBN);
          const automateOwner = await automate.owner();
          if (automateBalance.lte(0))
            return new Error(
              "Insufficient funds on the automate contract balance"
            );
          if (signerAddress.toLowerCase() !== automateOwner.toLowerCase())
            return new Error("Someone else contract");

          return true;
        },
        async () => ({
          tx: await automate.deposit(),
        })
      ),
    ];
    const refund = [
      Action.tab(
        "Refund",
        async () => ({
          description: "Transfer your tokens from automate",
        }),
        async () => {
          const automateOwner = await automate.owner();
          if (signerAddress.toLowerCase() !== automateOwner.toLowerCase())
            return new Error("Someone else contract");

          return true;
        },
        async () => ({
          tx: await automate.refund(),
        })
      ),
    ];
    const migrate = [
      Action.tab(
        "Withdraw",
        async () => ({
          description: "Withdraw your tokens from staking",
        }),
        async () => {
          const stakingBalance = await staking
            .balanceOf(signerAddress)
            .then(toBN);
          if (stakingBalance.lte(0))
            return new Error(
              "Insufficient funds on the staking contract balance"
            );

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
      const multicall = new ethersMulticall.Provider(provider);
      await multicall.init();
      const automateMulticall = new ethersMulticall.Contract(
        contractAddress,
        automateABI
      );
      const stakingMulticall = new ethersMulticall.Contract(
        stakingAddress,
        stakingABI
      );
      const stakingTokenMulticall = uniswap.pair.multicallContract(stakingTokenAddress);
      const [
        routerAddress,
        slippagePercent,
        deadlineSeconds,
        token0Address,
        token1Address,
        rewardTokenAddress,
        earned,
      ] = await multicall.all([
        automateMulticall.liquidityRouter(),
        automateMulticall.slippage(),
        automateMulticall.deadline(),
        stakingTokenMulticall.token0(),
        stakingTokenMulticall.token1(),
        stakingMulticall.rewardsToken(),
        stakingMulticall.earned(contractAddress),
      ]);
      if (earned.toString() === "0") return new Error("No earned");
      const router = uniswap.router.contract(provider, routerAddress);

      const slippage = 1 - slippagePercent / 10000;
      const token0AmountIn = new bn(earned.toString()).div(2).toFixed(0);
      let token0Min = new bn(token0AmountIn).multipliedBy(slippage).toFixed(0);
      if (token0Address.toLowerCase() !== rewardTokenAddress.toLowerCase()) {
        const [, amountOut] = await router.getAmountsOut(token0AmountIn, [
          rewardTokenAddress,
          token0Address,
        ]);
        token0Min = new bn(amountOut.toString())
          .multipliedBy(slippage)
          .toFixed(0);
      }
      const token1AmountIn = new bn(earned.toString())
        .minus(token0AmountIn)
        .toFixed(0);
      let token1Min = new bn(token1AmountIn).multipliedBy(slippage).toFixed(0);
      if (token1Address.toLowerCase() !== rewardTokenAddress.toLowerCase()) {
        const [, amountOut] = await router.getAmountsOut(token1AmountIn, [
          rewardTokenAddress,
          token1Address,
        ]);
        token1Min = new bn(amountOut.toString())
          .multipliedBy(slippage)
          .toFixed(0);
      }
      const deadline = dayjs().add(deadlineSeconds, "seconds").unix();

      const gasLimit = new bn(
        await automate.estimateGas
          .run(0, deadline, [token0Min, token1Min])
          .then((v) => v.toString())
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
      const params = await runParams();
      if (params instanceof Error) return params;

      const { gasPrice, gasLimit, calldata } = params;
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
  };
}

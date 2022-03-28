import type ethersType from "ethers";
import { bignumber as bn } from "../../../lib";
import { GovernanceSwap } from "./base";
import * as ethereum from "../base";
import * as erc20 from "../erc20";

export function actionComponents({
  tokenContract,
  govContract,
  signer,
  etherscanAddressURL,
  getTokenSymbol,
  getTokenDecimals,
  getGovSymbol,
  getGovDecimals,
}: {
  tokenContract: ethersType.Contract;
  govContract: ethersType.Contract;
  signer: ethersType.Signer | null;
  etherscanAddressURL: string;
  getTokenSymbol?: () => Promise<string> | string;
  getTokenDecimals?: () => Promise<number> | number;
  getGovSymbol?: () => Promise<string> | string;
  getGovDecimals?: () => Promise<number> | number;
}): GovernanceSwap.Actions {
  return async (walletAddress) => {
    if (!signer) {
      throw new Error("Signer not found, use options.signer for use actions");
    }
    tokenContract.connect(signer);
    govContract.connect(signer);
    const [tokenSymbol, govSymbol, tokenDecimals, govDecimals] =
      await Promise.all([
        (getTokenSymbol ?? tokenContract.symbol)(),
        (getGovSymbol ?? govContract.symbol)(),
        getTokenDecimals
          ? getTokenDecimals()
          : tokenContract
              .decimals()
              .then((v: ethersType.BigNumber) => Number(v.toString())),
        getGovDecimals
          ? getGovDecimals()
          : govContract
              .decimals()
              .then((v: ethersType.BigNumber) => Number(v.toString())),
      ]);

    return {
      stake: {
        name: "governanceSwap-stake",
        methods: {
          fromSymbol: () => tokenSymbol,
          fromLink: () => `${etherscanAddressURL}/${tokenContract.address}`,
          toSymbol: () => govSymbol,
          toLink: () => `${etherscanAddressURL}/${govContract.address}`,
          balanceOf: () =>
            tokenContract
              .balanceOf(walletAddress)
              .then((v: ethersType.BigNumber) =>
                ethereum.toBN(v).div(`1e${tokenDecimals}`).toString(10)
              ),
          isApproved: async (amount: string) => {
            const allowance = await tokenContract
              .allowance(walletAddress, govContract.address)
              .then(ethereum.toBN);

            return allowance.isGreaterThanOrEqualTo(
              new bn(amount).multipliedBy(`1e${tokenDecimals}`)
            );
          },
          approve: async (amount: string) => ({
            tx: await erc20.approveAll(
              tokenContract,
              walletAddress,
              govContract.address,
              new bn(amount).multipliedBy(`1e${tokenDecimals}`).toFixed(0)
            ),
          }),
          can: async (amount: string) => {
            if (amount === "") return Error("Invalid amount");

            const amountInt = new bn(amount).multipliedBy(`1e${tokenDecimals}`);
            if (amountInt.lte(0)) return Error("Invalid amount");

            const balance = await tokenContract
              .balanceOf(walletAddress)
              .then(ethereum.toBN);
            if (amountInt.gt(balance))
              return Error("Insufficient funds on the balance");

            return true;
          },
          stake: async (amount: string) => ({
            tx: await govContract.deposit(
              new bn(amount).multipliedBy(`1e${tokenDecimals}`).toFixed(0)
            ),
          }),
        },
      },
      unstake: {
        name: "governanceSwap-unstake",
        methods: {
          fromSymbol: () => govSymbol,
          fromLink: () => `${etherscanAddressURL}/${govContract.address}`,
          toSymbol: () => tokenSymbol,
          toLink: () => `${etherscanAddressURL}/${tokenContract.address}`,
          balanceOf: () =>
            govContract
              .balanceOf(walletAddress)
              .then((v: ethersType.BigNumber) =>
                ethereum.toBN(v).div(`1e${govDecimals}`).toString(10)
              ),
          can: async (amount: string) => {
            if (amount === "") return Error("Invalid amount");

            const amountInt = new bn(amount).multipliedBy(`1e${govDecimals}`);
            if (amountInt.lte(0)) return Error("Invalid amount");

            const balance = await govContract
              .balanceOf(walletAddress)
              .then(ethereum.toBN);
            if (amountInt.isGreaterThan(balance)) {
              return Error("Amount exceeds balance");
            }

            return true;
          },
          unstake: async (amount: string) => ({
            tx: await govContract.withdraw(
              new bn(amount).multipliedBy(`1e${govDecimals}`).toFixed(0)
            ),
          }),
        },
      },
    };
  };
}

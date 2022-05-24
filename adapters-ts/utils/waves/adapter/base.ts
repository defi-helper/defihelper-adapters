import type {
  BroadcastedTx,
  SignedTx,
  Signer,
  SignerDataTx,
  SignerInvokeTx,
  SignerSetScriptTx,
  SignerTransferTx,
} from "@waves/signer";
import type { InvokeScriptCallArgument, Long } from "@waves/ts-types";
import * as base from "../base";
import * as adapter from "../../adapter/base";

export type WaitingTx = { wait: () => Promise<any> };

export namespace Staking {
  export interface Actions {
    (walletAddress: string): Promise<{
      stake: {
        name: "staking-stake";
        methods: {
          symbol: () => string;
          link: () => string;
          balanceOf: () => Promise<string> | string;
          can: (amount: string) => Promise<boolean | Error> | boolean | Error;
          stake: (amount: string) => Promise<{
            tx: BroadcastedTx<SignedTx<[SignerInvokeTx]>> & WaitingTx;
          }>;
        };
      };
      unstake: {
        name: "staking-unstake";
        methods: {
          symbol: () => string;
          link: () => string;
          balanceOf: () => Promise<string> | string;
          can: (amount: string) => Promise<boolean | Error> | boolean | Error;
          unstake: (amount: string) => Promise<{
            tx: BroadcastedTx<SignedTx<[SignerInvokeTx]>> & WaitingTx;
          }>;
        };
      };
      claim: {
        name: "staking-claim";
        methods: {
          symbol: () => string;
          link: () => string;
          can: () => Promise<boolean | Error> | boolean | Error;
          claim: () => Promise<{
            tx: BroadcastedTx<SignedTx<[SignerInvokeTx]>> & WaitingTx;
          }>;
        };
      };
      exit: {
        name: "staking-exit";
        methods: {
          can: (amount: string) => Promise<boolean | Error> | boolean | Error;
          exit: (amount: string) => Promise<{
            tx: BroadcastedTx<SignedTx<[SignerInvokeTx]>> & WaitingTx;
          }>;
        };
      };
    }>;
  }

  export interface ContractAdapter {
    (
      provider: Signer,
      contractAddress: string,
      initOptions: base.Options
    ): Promise<{
      stakeToken: adapter.Staking.ContractTokenInfo;
      rewardToken: adapter.Staking.ContractTokenInfo;
      metrics: adapter.Staking.ContractMetrics;
      wallet: adapter.Staking.WalletAdapter;
      actions: Actions;
    }>;
  }
}

export namespace Deploy {
  export interface Adapter {
    (signer: Signer, dAppBase64: string): Promise<{
      contract: string;
      deploy: [
        adapter.Action.Tab<BroadcastedTx<SignedTx<[SignerTransferTx]>>>,
        adapter.Action.Tab<BroadcastedTx<SignedTx<[SignerDataTx]>>>,
        adapter.Action.Tab<BroadcastedTx<SignedTx<[SignerSetScriptTx]>>>
      ];
    }>;
  }
}

export namespace Automate {
  export interface AdapterActions {
    deposit: {
      name: "automateRestake-deposit";
      methods: {
        balanceOf: () => Promise<string>;
        can: (amount: string) => Promise<true | Error>;
        deposit: (amount: string) => Promise<{
          tx: BroadcastedTx<SignedTx<[SignerInvokeTx]>> & WaitingTx;
        }>;
      };
    };
    refund: {
      name: "automateRestake-refund";
      methods: {
        staked: () => Promise<string>;
        can: (amount: string) => Promise<true | Error>;
        refund: (amount: string) => Promise<{
          tx: BroadcastedTx<SignedTx<[SignerInvokeTx]>> & WaitingTx;
        }>;
      };
    };
  }

  export interface AdapterRun {
    runParams: () => Promise<
      { calldata: Array<InvokeScriptCallArgument<Long>> } | Error
    >;
    run: () => Promise<BroadcastedTx<SignedTx<[SignerInvokeTx]>> | Error>;
  }

  export interface Adapter {
    (signer: Signer, contractAddress: string): Promise<
      AdapterActions & AdapterRun & { contract: string }
    >;
  }
}

export interface ContractsResolver {
  (provider: Signer, options?: { cacheAuth?: string }): Promise<
    adapter.ResolvedContract[]
  >;
}

export const stakingAdapter = (v: Staking.ContractAdapter) => v;

export const contractsResolver = (v: ContractsResolver) => v;

export const automateAdapter = (v: Automate.Adapter) => v;

export const deployAdapter = (v: Deploy.Adapter) => v;

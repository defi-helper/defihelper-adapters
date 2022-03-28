import type { Signer } from "@waves/signer";
import * as base from "../base";
import * as adapter from "../../adapter/base";

export namespace Staking {
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
    }>;
  }
}

export interface ContractsResolver {
  (provider: Signer, options?: { cacheAuth?: string }): Promise<
    adapter.ResolvedContract[]
  >;
}

export const stakingAdapter = (v: Staking.ContractAdapter) => v;

export const contractsResolver = (v: ContractsResolver) => v;
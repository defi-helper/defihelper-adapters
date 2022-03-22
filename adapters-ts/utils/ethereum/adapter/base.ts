import { Signer, providers, ContractTransaction } from "ethers";
import * as base from "../base";
import { bignumber as bn, ethers } from "../../../lib";
import proxyFactoryABI from "../dfh/abi/proxyFactory.json";

export namespace Action {
  export const input = ({ placeholder = "", value = "" }) => ({
    type: "text",
    placeholder,
    value,
  });

  export const radio = ({ placeholder = "", value = "", options = [] }) => ({
    type: "radio",
    placeholder,
    value,
    options,
  });

  export const select = ({ placeholder = "", value = "", options = [] }) => ({
    type: "select",
    placeholder,
    value,
    options,
  });

  export type Input =
    | ReturnType<typeof input>
    | ReturnType<typeof radio>
    | ReturnType<typeof select>;

  export interface TabInfo {
    description: string;
    inputs?: Input[];
  }

  export const tab = (
    name: string,
    info: () => Promise<TabInfo> | TabInfo,
    can: (...args: any[]) => Promise<boolean | Error> | boolean | Error,
    send: (...args: any[]) => Promise<{ tx: ContractTransaction }>
  ) => ({ name, info, can, send });

  export type Tab = ReturnType<typeof tab>;

  export const component = (
    name: string,
    methods: { [method: string]: (...args: any[]) => any }
  ) => ({ name, methods });

  export type Component = ReturnType<typeof component>;
}

export namespace Staking {
  export interface TokenBalance {
    balance: string;
    usd: string;
  }

  export interface WalletAdapter {
    (walletAddress: string): Promise<{
      staked: {
        [token: string]: TokenBalance;
      };
      earned: {
        [token: string]: TokenBalance;
      };
      metrics: {
        staking: string;
        stakingUSD: string;
        earned: string;
        earnedUSD: string;
      };
      tokens: {
        [token: string]: TokenBalance;
      };
    }>;
  }

  export function tokens(
    ...tokens: Array<{ token: string; data: { usd: string; balance: string } }>
  ): { [token: string]: TokenBalance } {
    return tokens.reduce<any>((prev, { token, data }) => {
      if (prev[token]) {
        return {
          ...prev,
          [token]: Object.entries(data).reduce<any>(
            (prev, [k, v]) => ({
              ...prev,
              [k]: prev[k] ? new bn(prev[k]).plus(v).toString(10) : v,
            }),
            prev[token]
          ),
        };
      } else {
        return { ...prev, [token]: data };
      }
    }, {});
  }

  export interface Actions {
    (walletAddress: string): Promise<{
      stake: Action.Tab[] | Action.Component;
      unstake: Action.Tab[] | Action.Component;
      claim: Action.Tab[] | Action.Component;
      exit: Action.Tab[] | Action.Component;
    }>;
  }

  export interface ContractTokenInfo {
    address: string;
    decimals: number;
    priceUSD: string;
    parts?: ContractTokenInfo[];
  }

  export interface ContractMetrics {
    tvl: string;
    aprDay: string;
    aprWeek: string;
    aprMonth: string;
    aprYear: string;
  }

  export interface ContractAdapter {
    (
      provider: providers.Provider,
      contractAddress: string,
      initOptions: base.Options
    ): Promise<{
      stakeToken: ContractTokenInfo;
      rewardToken: ContractTokenInfo;
      metrics: ContractMetrics;
      wallet: WalletAdapter;
      actions: Actions;
    }>;
  }
}

export namespace Deploy {
  export async function deploy(
    signer: Signer,
    factoryAddress: string,
    prototypeAddress: string,
    inputs: string
  ) {
    const proxyFactory = new ethers.Contract(
      factoryAddress,
      proxyFactoryABI,
      signer
    );
    const tx = await proxyFactory.create(prototypeAddress, inputs);

    return {
      tx,
      wait: tx.wait.bind(tx),
      getAddress: async () => {
        const receipt = await tx.wait();
        const proxyCreatedEvent = receipt.logs[0];
        const proxyAddressBytes = proxyCreatedEvent.topics[2];
        const [proxyAddress] = ethers.utils.defaultAbiCoder.decode(
          ["address"],
          proxyAddressBytes
        );

        return proxyAddress;
      },
    };
  }

  export interface Adapter {
    (
      signer: Signer,
      factoryAddress: string,
      prototypeAddress: string,
      contractAddress?: string
    ): Promise<{
      deploy: Action.Tab[];
    }>;
  }
}

export namespace Automate {
  export interface Adapter {
    (signer: Signer, contractAddress: string): Promise<{
      contract: string;
      deposit: Action.Tab[];
      refund: Action.Tab[];
      migrate: Action.Tab[];
      runParams: () => Promise<
        | {
            gasPrice: string;
            gasLimit: string;
            calldata: any[];
          }
        | Error
      >;
      run: () => Promise<ContractTransaction | Error>;
    }>;
  }
}

export interface ContractsResolver {
  (provider: providers.Provider, options?: { cacheAuth?: string }): Promise<
    Array<{
      name: string;
      address: string;
      blockchain: "ethereum" | "waves";
      network: string;
      layout: string;
      adapter: string;
      description: string;
      link: string;
      automate: {
        adapters?: string[];
        autorestakeAdapter?: string;
        buyLiquidity?: {
          router: string;
          pair: string;
        };
      };
    }>
  >;
}

export const stakingAdapter = (v: Staking.ContractAdapter) => v;

export const contractsResolver = (v: ContractsResolver) => v;

export const automateAdapter = (v: Automate.Adapter) => v;

export const deployAdapter = (v: Deploy.Adapter) => v;

import { Signer, providers, ContractTransaction } from "ethers";
import * as adapter from "../../adapter/base";
import * as base from "../base";
import { ethers } from "../../../lib";
import proxyFactoryABI from "../dfh/abi/proxyFactory.json";

export namespace Staking {
  export interface Actions {
    (walletAddress: string): Promise<{
      stake: {
        name: "staking-stake";
        methods: {
          symbol: () => string;
          link: () => string;
          balanceOf: () => Promise<string>;
          isApproved: (amount: string) => Promise<boolean>;
          approve: (
            amount: string
          ) => Promise<{ tx: ContractTransaction | null }>;
          can: (amount: string) => Promise<true | Error>;
          stake: (amount: string) => Promise<{ tx: ContractTransaction }>;
        };
      };
      unstake: {
        name: "staking-unstake";
        methods: {
          symbol: () => string;
          link: () => string;
          balanceOf: () => Promise<string>;
          can: (amount: string) => Promise<true | Error>;
          unstake: (amount: string) => Promise<{ tx: ContractTransaction }>;
        };
      };
      claim: {
        name: "staking-claim";
        methods: {
          symbol: () => string;
          link: () => string;
          balanceOf: () => Promise<string>;
          can: (amount: string) => Promise<true | Error>;
          claim: (amount: string) => Promise<{ tx: ContractTransaction }>;
        };
      };
      exit: {
        name: "staking-exit";
        methods: {
          can: (amount: string) => Promise<true | Error>;
          exit: (amount: string) => Promise<{ tx: ContractTransaction }>;
        };
      };
    }>;
  }

  export interface ContractAdapter {
    (
      provider: providers.Provider,
      contractAddress: string,
      initOptions: base.Options
    ): Promise<{
      stakeToken: adapter.Staking.ContractTokenInfo;
      rewardToken: adapter.Staking.ContractTokenInfo;
      metrics: adapter.Staking.ContractMetrics;
      wallet: adapter.Staking.WalletAdapter;
      actions?: Actions;
    }>;
  }
}

export namespace GovernanceSwap {
  export interface Actions {
    (walletAddress: string): Promise<{
      stake: {
        name: "governanceSwap-stake";
        methods: {
          fromSymbol: () => string;
          fromLink: () => string;
          toSymbol: () => string;
          toLink: () => string;
          balanceOf: () => Promise<string>;
          isApproved: (amount: string) => Promise<boolean>;
          approve: (
            amount: string
          ) => Promise<{ tx: ContractTransaction | null }>;
          can: (amount: string) => Promise<true | Error>;
          stake: (amount: string) => Promise<{ tx: ContractTransaction }>;
        };
      };
      unstake: {
        name: "governanceSwap-unstake";
        methods: {
          fromSymbol: () => string;
          fromLink: () => string;
          toSymbol: () => string;
          toLink: () => string;
          balanceOf: () => Promise<string>;
          can: (amount: string) => Promise<true | Error>;
          unstake: (amount: string) => Promise<{ tx: ContractTransaction }>;
        };
      };
    }>;
  }

  export interface ContractAdapter {
    (
      provider: providers.Provider,
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
      deploy: adapter.Action.Tab<ContractTransaction>[];
    }>;
  }

  export const adapter = (adapter: Adapter) => adapter;

  export const adapters = (adapters: Record<string, Adapter>) => adapters;
}

export namespace Automate {
  export interface AdapterActions {
    deposit: {
      name: "automateRestake-deposit";
      methods: {
        tokenAddress: () => string;
        symbol: () => string;
        tokenPriceUSD: () => Promise<string>;
        balanceOf: () => Promise<string>;
        canTransfer: (amount: string) => Promise<true | Error>;
        transfer: (amount: string) => Promise<{ tx: ContractTransaction }>;
        transferred: () => Promise<string>;
        canDeposit: () => Promise<true | Error>;
        deposit: () => Promise<{ tx: ContractTransaction }>;
      };
    };
    refund: {
      name: "automateRestake-refund";
      methods: {
        tokenAddress: () => string;
        symbol: () => string;
        staked: () => Promise<string>;
        can: () => Promise<true | Error>;
        refund: () => Promise<{ tx: ContractTransaction }>;
      };
    };
    migrate: {
      name: "automateRestake-migrate";
      methods: {
        staked: () => Promise<string>;
        canWithdraw: () => Promise<true | Error>;
        withdraw: () => Promise<{ tx: ContractTransaction }>;
      } & AdapterActions["deposit"]["methods"];
    };
    run: {
      name: "automateRestake-run";
      methods: {
        runParams: () => Promise<
          | {
              gasPrice: string;
              gasLimit: string;
              calldata: any[];
            }
          | Error
        >;
        run: () => Promise<{ tx: ContractTransaction } | Error>;
      };
    };
  }

  export interface Adapter {
    (signer: Signer, contractAddress: string): Promise<AdapterActions>;
  }

  export namespace AutoRestake {
    export interface DepositComponent {
      name: "automateRestake-deposit";
      methods: {
        tokenAddress: () => string;
        symbol: () => string;
        tokenPriceUSD: () => Promise<string>;
        balanceOf: () => Promise<string>;
        isApproved: (amount: string) => Promise<boolean | Error>;
        approve: (
          amount: string
        ) => Promise<{ tx?: ContractTransaction } | Error>;
        canDeposit: (amount: string) => Promise<true | Error>;
        deposit: (amount: string) => Promise<{ tx: ContractTransaction }>;
      };
    }

    export interface RefundComponent {
      name: "automateRestake-refund";
      methods: {
        tokenAddress: () => string;
        symbol: () => string;
        staked: () => Promise<string>;
        can: () => Promise<true | Error>;
        refund: () => Promise<{ tx: ContractTransaction }>;
      };
    }

    export interface MigrateComponent {
      name: "automateRestake-migrate";
      methods: {
        staked: () => Promise<string>;
        canWithdraw: () => Promise<true | Error>;
        withdraw: () => Promise<{ tx: ContractTransaction }>;
      } & DepositComponent["methods"];
    }

    export interface RunComponent {
      name: "automateRestake-run";
      methods: {
        runParams: () => Promise<
          | {
              gasPrice: string;
              gasLimit: string;
              calldata: any[];
            }
          | Error
        >;
        run: () => Promise<{ tx: ContractTransaction } | Error>;
      };
    }

    export interface StopLossComponent {
      name: "automateRestake-stopLoss";
      methods: {
        startTokens: () => Promise<string[]>;
        autoPath: (from: string, to: string) => Promise<string[]>;
        amountOut: (path: string[]) => Promise<string>;
        canSetStopLoss: (
          path: string[],
          amountOut: string,
          amountOutMin: string
        ) => Promise<true | Error>;
        setStopLoss: (
          path: string[],
          amountOut: string,
          amountOutMin: string
        ) => Promise<{ tx: ContractTransaction }>;
        removeStopLoss: () => Promise<{ tx: ContractTransaction }>;
        runStopLoss: () => Promise<{ tx: ContractTransaction }>;
      };
    }

    export interface Adapter {
      (signer: Signer, contractAddress: string): Promise<{
        deposit: DepositComponent;
        refund: RefundComponent;
        migrate: MigrateComponent;
        run: RunComponent;
      }>;
    }
  }
}

export interface Component<M> {
  name: string;
  methods: M;
}

export const mixComponent = <T extends Component<any>>(
  component: T,
  mixin: Partial<T["methods"]>
) => ({
  name: component.name,
  methods: {
    ...component.methods,
    ...mixin,
  },
});

export interface ContractsResolver {
  (provider: providers.Provider, options?: { cacheAuth?: string }): Promise<
    adapter.ResolvedContract[]
  >;
}

export const stakingAdapter = (v: Staking.ContractAdapter) => v;

export const governanceSwapAdapter = (v: GovernanceSwap.ContractAdapter) => v;

export const contractsResolver = (v: ContractsResolver) => v;

export const automateAdapter = (v: Automate.Adapter) => v;

export const deployAdapter = (v: Deploy.Adapter) => v;

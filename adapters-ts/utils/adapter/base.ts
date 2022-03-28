import { bignumber as bn } from "../../lib";

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

  export interface Tab<T> {
    name: string;
    info: () => Promise<TabInfo> | TabInfo;
    can: (...args: any[]) => Promise<boolean | Error> | boolean | Error;
    send: (...args: any[]) => Promise<{ tx: T }>;
  }
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
}

export interface ResolvedContract {
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
}
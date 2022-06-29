# defihelper-adapters

### Interfaces

```typescript
interface AdapterInfo {
  staking: {
    token: string;
    decimals: string;
  };
  reward: {
    token: string;
    decimals: string;
  };
  metrics: {
    tvl: string;
    aprDay: string;
    aprWeek: string;
    aprMonth: string;
    aprYear: string;
  };
}

enum ProtocolTokens {
  token1 = 'token1',
  token2 = 'token2',
}

enum RewardTokens {
  rewardToken = 'rewardToken',
}

interface Wallet {
  staked: {
    [key in ProtocolTokens]: {
      balance: string;
      usd: string;
    };
  };
  earned: {
    [key in RewardTokens]: {
      balance: string;
      usd: string;
    };
  };
  metrics: {
    staking: string;
    stakingUSD: string;
    earned: string;
    earnedUSD: string;
  };
  tokens: {
    [address: string]: {
      balance: string;
      usd: string;
    };
  };
}

interface InitWallet {
  (walletAddress: string): Promise<Wallet>;
}

interface Actions {
  stake: {
    can: (amount: string) => Promise<boolean>;
    send: (amount: string) => Promise<void>;
  };
  unstake: {
    can: (amount: string) => Promise<boolean>;
    send: (amount: string) => Promise<void>;
  };
  claim: {
    can: () => Promise<boolean>;
    send: () => Promise<void>;
  };
  exit: {
    can: () => Promise<boolean>;
    send: () => Promise<void>;
  };
}

interface InitActions {
  (walletAddress: string): Promise<Actions>;
}

interface Adapter extends AdapterInfo {
  wallet: InitWallet;
  actions: InitActions;
}

interface InitAdapter {
  (provider: any, contractAddress: string, initOptions: any): Promise<Adapter>;
}

interface ProtocolAdapter {
  [key: string]: InitAdapter;
}
```

### Structure:

- `adapters` - directory with directories with protocol's adapters
  - `index.js` - protocol's adapter entrypoint

### Guide

You can use `bondappetit` adapter as example.
For adding new adapter you have to:

1. Create new directory in `adapters` folder with `index.js` (only if you want to create
   new protocol's adapter)
2. Implement `ProtocolAdapter` interface:

```
module.exports: ProtocolAdapter
```

3. Test your implementation with frontend (on localhost:8080): `npm run dev`

### Deploy automate

```
npx hardhat deploy --config ./automates/pancakeswap/hardhat.config.js --tags Protocol,Governance,GovernanceOwner --network bsc
```

### Verify automate

```
npx hardhat etherscan-verify --config ./automates/pancakeswap/hardhat.config.js --network ${NETWORK} --api-key ${KEY}
```

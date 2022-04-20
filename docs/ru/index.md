# Адаптер стейкинг-контракта

Адаптер стейкинг-контракта представляется функцией со следующей сигнатурой:

```ts
interface ContractAdapter {
  (
    provider: ethers.providers.Provider,
    contractAddress: string,
    initOptions: {
      blockNumber: "latest" | number;
      signer: ethers.Signer | undefined;
    }
  ): Promise<{
    stakeToken: ContractTokenInfo;
    rewardToken: ContractTokenInfo;
    metrics: ContractMetrics;
    wallet: WalletAdapter;
    actions: Actions;
  }>;
}
```

Этот адаптер должен располагаться в корне объекта адаптеров, на пример:

````ts
// Файл adapters-ts/testProtocol/index.ts
module.exports = {
    myAdapter: async (provider, contractAddress, initOptions) => {
        ...
    }
}

## Аргументы адаптера контракта

Адаптер принимает в качестве аргументов:

1. `provider` - ethers провайдер для целевой сети
2. `contractAddress` - идентификационный адрес целевого контракта-стейкинга, по которому необходимо получить метрики
3. `initOptions` - опции адаптера, такие как: `blockNumber` - метка блока для которого необходимо предоставить метрики ("latest" если необходимы метрики для последнего доступного блока); `signer` - экземпляр `ethers.Signer`, используемый для взаимодействия с контрактом-стейкингом (не требуется, если адаптер используется только для чтения данных)

## Метрики адаптера контракта

Адаптер должен возвращать promise со следующими данными:

1. `stakeToken` - информация о токенах, необходимых для стейкинга в контракт
2. `rewardToken` - информация о токенах, получаемых из контракта в качестве вознаграждения
3. `metrics` - метрики контракта

Объекты `stakeToken` и `rewardToken` имеют идентичную сигнатуру:

```ts
interface ContractTokenInfo {
    address: string;
    decimals: number;
    priceUSD: string;
    parts?: ContractTokenInfo[];
}
````

Поле `parts` указывается, если целевой токен является составным (на пример, как токены ликвидности). Это поле должно содержать массив с информацией обо всех токенах, входящих с этот составной токен. На пример:

```json
"stakeToken": {
    "address": "0x...",
    "decimals": 18,
    "priceUSD": "1.8",
    "parts": [
        {
            "address": "0x...",
            "decimals": 6,
            "priceUSD": "1.0"
        },
        {
            "address": "0x...",
            "decimals": 18,
            "priceUSD": "0.8"
        }
    ]
}
```

Объект `metrics` должен содержать следующие поля:

1. `tvl` - стоимость всех застейканных в контракте токенов
2. `aprDay` - дневной APR контракта
3. `aprWeek` - недельный APR контракта
4. `aprMonth` - месячный APR контракта
5. `aprYear` - годовой APR контракта

# Адаптер кошелька стейкинг-контакта

Поле `wallet` результирующего объекта адаптера стейкинг-контракта должно содержать функцию адаптера, позволяющую получить метрики по конкретному кошельку. Эта функция должна иметь следующую сигнатуру:

```ts
interface WalletAdapter {
  (walletAddress: string): Promise<{
    staked: WalletTokenInfo;
    earned: WalletTokenInfo;
    metrics: WalletMetric;
    tokens: WalletTokenInfo;
  }>;
}
```

## Аргументы адаптера кошелька

Адаптер принимает в качестве аргумента адрес целевого кошелька `walletAddress`, по которому необходимо получить метрики для исходного стейкинг-контракта.

## Метрики адаптера кошелька

Адаптер кошелька должен возвращать promise со следующими данными:

1. `staked` - информация о токенах, застейканных кошельком в исходном контракте
2. `earned` - информация о токенах, заработанных кошельком в исходном контракте
3. `tokens` - общая информация о токенах кошелька, используемых в исходном контракте
4. `metrics` - метрики кошелька

Объекты `staked`, `earned` и `tokens` имеют идентичную сигнатуру:

```ts
interface WalletTokenInfo {
  [tokenAddress: string]: {
    balance: string;
    usd: string;
  };
}
```

Поле `balance` должно содержать количество токенов, а `usd` общую стоимость этих токенов, на пример:

```json
{
  "staked": {
    "0x...": {
      "balance": "12.5",
      "usd": "8.1"
    },
    "0x...": {
      "balance": "2.12",
      "usd": "1.89"
    }
  },
  "earned": {
    "0x...": {
      "balance": "9",
      "usd": "0.812"
    }
  },
  "tokens": {
    "0x...": {
      "balance": "12.5",
      "usd": "8.1"
    },
    "0x...": {
      "balance": "2.12",
      "usd": "1.89"
    },
    "0x...": {
      "balance": "9",
      "usd": "0.812"
    }
  }
}
```

Объект `metrics` должен содержать следующие поля:

1. `staking` - количество застейканных токенов
2. `stakingUSD` - долларовая стоимость застейканных токенов
3. `earned` - количество заработанных токенов
4. `earnedUSD` - долларовая стоимость заработанных токенов

# Адаптер взаимодействия со стейкинг-контрактом

Поле `actions` результирующего объекта адаптера стейкинг-контракта должно содержать функцию адаптера, позволяющую взаимодействовать с целевым стейкинг-контрактом. Этот адапетр должен иметь сигнатуру:

```ts
interface Actions {
  (walletAddress: string): Promise<{}>;
}
```

Перед вызовом этого адапетра необходимо убедиться, что аргумент `initOptions` адаптера стейкинг-контракта содержит поле `signer`, иначе этот адаптер должен выбросить исключение.

## Аргументы адаптера взаимодействия со стейкинг-контрактом

Адаптер принимает в качестве аргумента адрес кошелька `walletAddress`, используемого для взаимодействия со стейкинг-контрактом.

## Предоставляемые адаптером действия

При вызове адаптера, он должен возвращать объект со следующей сигнатурой:

```ts
interface StakingActions {
  stake: {
    name: "staking-stake";
    methods: {
      symbol: () => string;
      link: () => string;
      balanceOf: () => Promise<string>;
      isApproved: (amount: string) => Promise<boolean>;
      approve: (amount: string) => Promise<{ tx: ethers.ContractTransaction | null }>;
      can: (amount: string) => Promise<true | Error>;
      stake: (amount: string) => Promise<{ tx: ethers.ContractTransaction }>;
    };
  };
  unstake: {
    name: "staking-unstake";
    methods: {
      symbol: () => string;
      link: () => string;
      balanceOf: () => Promise<string>;
      can: (amount: string) => Promise<true | Error>;
      unstake: (amount: string) => Promise<{ tx: ethers.ContractTransaction }>;
    };
  };
  claim: {
    name: "staking-claim";
    methods: {
      symbol: () => string;
      link: () => string;
      balanceOf: () => Promise<string>;
      can: (amount: string) => Promise<true | Error>;
      claim: (amount: string) => Promise<{ tx: ethers.ContractTransaction }>;
    };
  };
  exit: {
    name: "staking-exit";
    methods: {
      can: (amount: string) => Promise<true | Error>;
      exit: (amount: string) => Promise<{ tx: ethers.ContractTransaction }>;
    };
  };
}
```

1. `stake` - объект должен предоставлять методы для стейкинга в контракт
    1. `symbol` - символ токена, который должен быть застейкан в контракт
    2. `link` - web-ссылка на токен, который должен быть застейкан в контракт
    3. `balanceOf` - текущее количество токенов на кошельке
    4. `isApproved` - разрешено ли контракту получить указанное количество токенов с кошелька
    5. `approve` - дать разрешение на получение указанного количества токенов с кошелька
    6. `can` - может ли быть вызван метод `stake`
    7. `stake` - стейкинг указанного количества токенов в контракт
2. `unstake` - объект должен предоставлять методы для возврата средств из контракта
    1. `symbol` - символ токена, который должен быть возвращен из контракта
    2. `link` - web-ссылка на токен, который должен быть возвращен из контракта
    3. `balanceOf` - текущее количество токенов, застейканных в контракте
    4. `can` - может ли быть вызван метод `unstake`
    5. `unstake` - возврат указанного количества токенов из контракта
3. `claim` - объект должен предоставлять методы для возврата токенов вознаграждения из контракта
    1. `symbol` - символ токена, который должен быть возвращен из контракта
    2. `link` - web-ссылка на токен, который должен быть возвращен из контракта
    3. `balanceOf` - текущее количество заработанных токенов
    4. `can` - может ли быть вызван метод `claim`
    5. `claim` - возврат всех заработанных токенов
4. `exit` - объект должен предоставлять методы для возврата всех токенов из контракта
    1. `can` - может ли быть вызван метод `exit`
    2. `exit` - возврат всех токенов из контракта
import React from "react";

export function EthereumStakingStake({ methods }) {
  const [amount, setAmount] = React.useState("0");
  const [isApproved, setIsApproved] = React.useState(false);
  const [can, setCan] = React.useState(null);

  React.useEffect(() => {
    methods.balanceOf().then(setAmount);
  }, []);

  React.useEffect(() => {
    methods.isApproved(amount).then(setIsApproved);
    methods.can(amount).then(setCan);
  }, [amount]);

  const onApprove = async () => {
    await methods.approve(amount).then(({ tx }) => tx?.wait());
    methods.isApproved(amount).then(setIsApproved);
  };

  const onStake = async () => {
    await methods.stake(amount).then(({ tx }) => tx.wait());
    methods.balanceOf().then(setAmount);
  };

  return (
    <div>
      <div>
        Stake your <a href={methods.link()}>{methods.symbol()}</a> tokens to
        contract
      </div>
      <div>
        <div>
          <label>Amount:</label>
        </div>
        <div>
          <input
            type="text"
            value={amount}
            placeholder="amount"
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        {can === null || can.message}
      </div>
      <div>
        {isApproved || <button onClick={onApprove}>Approve</button>}
        {isApproved && <button onClick={onStake}>Stake</button>}
      </div>
    </div>
  );
}

export function EthereumStakingUnstake({ methods }) {
  const [amount, setAmount] = React.useState("0");
  const [can, setCan] = React.useState(null);

  React.useEffect(() => {
    methods.balanceOf().then(setAmount);
  }, []);

  React.useEffect(() => {
    methods.can(amount).then(setCan);
  }, [amount]);

  const onUnstake = async () => {
    await methods.unstake(amount).then(({ tx }) => tx.wait());
    methods.balanceOf().then(setAmount);
  };

  return (
    <div>
      <div>
        Unstake your <a href={methods.link()}>{methods.symbol()}</a> tokens from
        contract
      </div>
      <div>
        <div>
          <label>Amount:</label>
        </div>
        <div>
          <input
            type="text"
            value={amount}
            placeholder="amount"
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        {can === null || can.message}
      </div>
      <div>
        <button onClick={onUnstake}>Unstake</button>
      </div>
    </div>
  );
}

export function EthereumStakingClaim({ methods }) {
  const [amount, setAmount] = React.useState("0");
  const [can, setCan] = React.useState(null);

  React.useEffect(() => {
    methods.balanceOf().then(setAmount);
    methods.can().then(setCan);
  }, []);

  const onClaim = async () => {
    await methods.claim().then(({ tx }) => tx.wait());
    methods.balanceOf().then(setAmount);
  };

  return (
    <div>
      <div>
        Claim your{" "}
        <a href={methods.link()}>
          {amount} {methods.symbol()}
        </a>{" "}
        reward
      </div>
      <div>{can === null || can.message}</div>
      <div>
        <button onClick={onClaim}>Claim</button>
      </div>
    </div>
  );
}

export function EthereumStakingExit({ methods }) {
  const [can, setCan] = React.useState(null);

  React.useEffect(() => {
    methods.can().then(setCan);
  }, []);

  const onExit = async () => {
    await methods.exit().then(({ tx }) => tx.wait());
  };

  return (
    <div>
      <div>Get all tokens from contract</div>
      <div>{can === null || can.message}</div>
      <div>
        <button onClick={onExit}>Exit</button>
      </div>
    </div>
  );
}

export function WavesStakingStake({ methods }) {
  const [amount, setAmount] = React.useState("0");
  const [can, setCan] = React.useState(null);

  React.useEffect(() => {
    methods.balanceOf().then(setAmount);
  }, []);

  React.useEffect(() => {
    methods.can(amount).then(setCan);
  }, [amount]);

  const onStake = async () => {
    await methods.stake(amount).then(({ tx }) => tx.wait());
    methods.balanceOf().then(setAmount);
  };

  return (
    <div>
      <div>
        Stake your <a href={methods.link()}>{methods.symbol()}</a> tokens to
        contract
      </div>
      <div>
        <div>
          <label>Amount:</label>
        </div>
        <div>
          <input
            type="text"
            value={amount}
            placeholder="amount"
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        {can === null || can.message}
      </div>
      <div>
        <button onClick={onStake}>Stake</button>
      </div>
    </div>
  );
}

export function WavesStakingUnstake({ methods }) {
  const [amount, setAmount] = React.useState("0");
  const [can, setCan] = React.useState(null);

  React.useEffect(() => {
    methods.balanceOf().then(setAmount);
  }, []);

  React.useEffect(() => {
    methods.can(amount).then(setCan);
  }, [amount]);

  const onUnstake = async () => {
    await methods.unstake(amount).then(({ tx }) => tx.wait());
    methods.balanceOf().then(setAmount);
  };

  return (
    <div>
      <div>
        Unstake your <a href={methods.link()}>{methods.symbol()}</a> tokens from
        contract
      </div>
      <div>
        <div>
          <label>Amount:</label>
        </div>
        <div>
          <input
            type="text"
            value={amount}
            placeholder="amount"
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        {can === null || can.message}
      </div>
      <div>
        <button onClick={onUnstake}>Unstake</button>
      </div>
    </div>
  );
}

export function WavesStakingClaim({ methods }) {
  const [can, setCan] = React.useState(null);

  React.useEffect(() => {
    methods.can().then(setCan);
  }, []);

  const onClaim = async () => {
    await methods.claim().then(({ tx }) => tx.wait());
  };

  return (
    <div>
      <div>
        Claim your <a href={methods.link()}>reward</a>
      </div>
      <div>{can === null || can.message}</div>
      <div>
        <button onClick={onClaim}>Claim</button>
      </div>
    </div>
  );
}

export function WavesStakingExit({ methods }) {
  const [can, setCan] = React.useState(null);

  React.useEffect(() => {
    methods.can().then(setCan);
  }, []);

  const onExit = async () => {
    await methods.exit().then(({ tx }) => tx.wait());
  };

  return (
    <div>
      <div>Get all tokens from contract</div>
      <div>{can === null || can.message}</div>
      <div>
        <button onClick={onExit}>Exit</button>
      </div>
    </div>
  );
}

export function GovernanceSwapStake({ methods }) {
  const [amount, setAmount] = React.useState("0");
  const [isApproved, setIsApproved] = React.useState(false);
  const [can, setCan] = React.useState(null);

  React.useEffect(() => {
    methods.balanceOf().then(setAmount);
  }, []);

  React.useEffect(() => {
    methods.isApproved(amount).then(setIsApproved);
    methods.can(amount).then(setCan);
  }, [amount]);

  const onApprove = async () => {
    await methods.approve(amount).then(({ tx }) => tx?.wait());
    methods.isApproved(amount).then(setIsApproved);
  };

  const onStake = async () => {
    await methods.stake(amount).then(({ tx }) => tx.wait());
    methods.balanceOf().then(setAmount);
  };

  return (
    <div>
      <div>
        Swap your <a href={methods.fromLink()}>{methods.fromSymbol()}</a> tokens
        to <a href={methods.toLink()}>{methods.toSymbol()}</a>
      </div>
      <div>
        <div>
          <label>Amount:</label>
        </div>
        <div>
          <input
            type="text"
            value={amount}
            placeholder="amount"
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        {can === null || can.message}
      </div>
      <div>
        {isApproved || <button onClick={onApprove}>Approve</button>}
        {isApproved && <button onClick={onStake}>Stake</button>}
      </div>
    </div>
  );
}

export function GovernanceSwapUnstake({ methods }) {
  const [amount, setAmount] = React.useState("0");
  const [can, setCan] = React.useState(null);

  React.useEffect(() => {
    methods.balanceOf().then(setAmount);
  }, []);

  React.useEffect(() => {
    methods.can(amount).then(setCan);
  }, [amount]);

  const onUnstake = async () => {
    await methods.unstake(amount).then(({ tx }) => tx.wait());
    methods.balanceOf().then(setAmount);
  };

  return (
    <div>
      <div>
        Swap your <a href={methods.fromLink()}>{methods.fromSymbol()}</a> tokens
        to <a href={methods.toLink()}>{methods.toSymbol()}</a>
      </div>
      <div>
        <div>
          <label>Amount:</label>
        </div>
        <div>
          <input
            type="text"
            value={amount}
            placeholder="amount"
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        {can === null || can.message}
      </div>
      <div>
        <button onClick={onUnstake}>Unstake</button>
      </div>
    </div>
  );
}

export function EthereumAutomateDeposit({ methods }) {
  const [balance, setBalance] = React.useState("0");
  const [canTransfer, setCanTransfer] = React.useState(null);
  const [transferred, setTransferred] = React.useState("0");
  const [canDeposit, setCanDeposit] = React.useState(null);

  const fetchBalance = () => methods.balanceOf().then(setBalance);
  const fetchTransferred = () => methods.transferred().then(setTransferred);

  React.useEffect(() => {
    fetchBalance();
    fetchTransferred();
  }, []);

  React.useEffect(() => {
    methods.canTransfer(balance).then(setCanTransfer);
  }, [balance]);

  React.useEffect(() => {
    methods.canDeposit().then(setCanDeposit);
  }, [transferred]);

  const onTransfer = async () => {
    await methods.transfer(balance).then(({ tx }) => tx.wait());
    fetchBalance();
    fetchTransferred();
  };

  const onDeposit = async () => {
    await methods.deposit().then(({ tx }) => tx.wait());
    fetchTransferred();
  };

  return (
    <div>
      <div>
        <div>Balance: {balance}</div>
        <div>Transferred: {transferred}</div>
      </div>
      <div>
        <div>
          <label>Transfer amount:</label>
        </div>
        <div>
          <input
            type="text"
            value={balance}
            placeholder="amount"
            onChange={(e) => setBalance(e.target.value)}
          />
        </div>
        <div>{canTransfer === null || canTransfer.message}</div>
        <div>{canDeposit === null || canDeposit.message}</div>
      </div>
      <div>
        <button onClick={onTransfer} disabled={canTransfer instanceof Error}>
          Transfer
        </button>
        <button onClick={onDeposit} disabled={canDeposit instanceof Error}>
          Deposit
        </button>
      </div>
    </div>
  );
}

export function EthereumAutomateRefund({ methods }) {
  const [staked, setStaked] = React.useState("0");
  const [can, setCan] = React.useState(null);

  const fetchStaked = () => methods.staked().then(setStaked);

  React.useEffect(() => {
    fetchStaked();
  }, []);

  React.useEffect(() => {
    methods.can().then(setCan);
  }, [staked]);

  const onRefund = async () => {
    await methods.refund().then(({ tx }) => tx.wait());
    fetchStaked();
  };

  return (
    <div>
      <div>
        <div>Staked: {staked}</div>
      </div>
      <div>
        <div>{can === null || can.message}</div>
      </div>
      <div>
        <button onClick={onRefund} disabled={can instanceof Error}>
          Refund
        </button>
      </div>
    </div>
  );
}

export function EthereumAutomateMigrate({ methods }) {
  const [staked, setStaked] = React.useState("0");
  const [canWithdraw, setCanWithdraw] = React.useState(null);
  const [balance, setBalance] = React.useState("0");
  const [canTransfer, setCanTransfer] = React.useState(null);
  const [transferred, setTransferred] = React.useState("0");
  const [canDeposit, setCanDeposit] = React.useState(null);

  const fetchStaked = () => methods.staked().then(setStaked);
  const fetchBalance = () => methods.balanceOf().then(setBalance);
  const fetchTransferred = () => methods.transferred().then(setTransferred);

  React.useEffect(() => {
    fetchStaked();
    fetchBalance();
    fetchTransferred();
  }, []);

  React.useEffect(() => {
    methods.canWithdraw().then(setCanWithdraw);
  }, [staked]);

  React.useEffect(() => {
    methods.canTransfer(balance).then(setCanTransfer);
  }, [balance]);

  React.useEffect(() => {
    methods.canDeposit().then(setCanDeposit);
  }, [transferred]);

  const onWithdraw = async () => {
    await methods.withdraw().then(({ tx }) => tx.wait());
    fetchStaked();
    fetchBalance();
  };

  const onTransfer = async () => {
    await methods.transfer(balance).then(({ tx }) => tx.wait());
    fetchBalance();
    fetchTransferred();
  };

  const onDeposit = async () => {
    await methods.deposit().then(({ tx }) => tx.wait());
    fetchTransferred();
  };

  return (
    <div>
      <div>
        <div>Staked: {staked}</div>
        <div>Balance: {balance}</div>
        <div>Transferred: {transferred}</div>
      </div>
      <div>
        <div>
          <label>Transfer amount:</label>
        </div>
        <div>
          <input
            type="text"
            value={balance}
            placeholder="amount"
            onChange={(e) => setBalance(e.target.value)}
          />
        </div>
        <div>{canWithdraw === null || canWithdraw.message}</div>
        <div>{canTransfer === null || canTransfer.message}</div>
        <div>{canDeposit === null || canDeposit.message}</div>
      </div>
      <div>
        <button onClick={onWithdraw} disabled={canWithdraw instanceof Error}>
          Withdraw
        </button>
        <button onClick={onTransfer} disabled={canTransfer instanceof Error}>
          Transfer
        </button>
        <button onClick={onDeposit} disabled={canDeposit instanceof Error}>
          Deposit
        </button>
      </div>
    </div>
  );
}

export function WavesAutomateDeposit({ methods }) {
  const [balance, setBalance] = React.useState("0");
  const [canDeposit, setCanDeposit] = React.useState(null);

  const fetchBalance = () => methods.balanceOf().then(setBalance);

  React.useEffect(() => {
    fetchBalance();
  }, []);

  React.useEffect(() => {
    methods.can(balance).then(setCanDeposit);
  }, [balance]);

  const onDeposit = async () => {
    await methods.deposit(balance).then(({ tx }) => tx.wait());
    fetchBalance();
  };

  return (
    <div>
      <div>
        <div>
          <label>Deposit:</label>
        </div>
        <div>
          <input
            type="text"
            value={balance}
            placeholder="amount"
            onChange={(e) => setBalance(e.target.value)}
          />
        </div>
        <div>{canDeposit === null || canDeposit.message}</div>
      </div>
      <div>
        <button onClick={onDeposit} disabled={canDeposit instanceof Error}>
          Deposit
        </button>
      </div>
    </div>
  );
}

export function WavesAutomateRefund({ methods }) {
  const [balance, setBalance] = React.useState("0");
  const [can, setCan] = React.useState(null);

  const fetchBalance = () => methods.staked().then(setBalance);

  React.useEffect(() => {
    fetchBalance();
  }, []);

  React.useEffect(() => {
    methods.can(balance).then(setCan);
  }, [balance]);

  const onRefund = async () => {
    await methods.refund(balance).then(({ tx }) => tx.wait());
    fetchBalance();
  };

  return (
    <div>
      <div>
        <div>
          <label>Withdraw:</label>
        </div>
        <div>
          <input
            type="text"
            value={balance}
            placeholder="amount"
            onChange={(e) => setBalance(e.target.value)}
          />
        </div>
        <div>{can === null || can.message}</div>
      </div>
      <div>
        <button onClick={onRefund} disabled={can instanceof Error}>
          Refund
        </button>
      </div>
    </div>
  );
}

const components = {
  ethereum: {
    "staking-stake": EthereumStakingStake,
    "staking-unstake": EthereumStakingUnstake,
    "staking-claim": EthereumStakingClaim,
    "staking-exit": EthereumStakingExit,
    "automateRestake-deposit": EthereumAutomateDeposit,
    "automateRestake-refund": EthereumAutomateRefund,
    "automateRestake-migrate": EthereumAutomateMigrate,
  },
  waves: {
    "staking-stake": WavesStakingStake,
    "staking-unstake": WavesStakingUnstake,
    "staking-claim": WavesStakingClaim,
    "staking-exit": WavesStakingExit,
    "automateRestake-deposit": WavesAutomateDeposit,
    "automateRestake-refund": WavesAutomateRefund,
  },
  "governanceSwap-stake": GovernanceSwapStake,
  "governanceSwap-unstake": GovernanceSwapUnstake,
};

export function AdapterModalComponent({ blockchain, component, onAction }) {
  const { name, methods } = component;
  const Component = blockchain
    ? components[blockchain][name]
    : components[name];
  if (Component === undefined) throw new Error(`Undefined component "${name}"`);

  return (
    <div>
      <Component methods={methods} />
    </div>
  );
}

import React from "react";

export function StakingStake({ methods }) {
  const [amount, setAmount] = React.useState("0");
  const [isApproved, setIsApproved] = React.useState(false);
  const [can, setCan] = React.useState(null);

  React.useEffect(() => {
    methods.balanceOf().then(setAmount);
  }, []);

  React.useEffect(() => {
    methods.isApproved().then(setIsApproved);
    methods.can(amount).then(setCan);
  }, [amount]);

  const onApprove = async () => {
    await methods.approve(amount).then(({ tx }) => tx.wait());
    methods.isApproved().then(setIsApproved);
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

export function StakingUnstake({ methods }) {
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

export function StakingClaim({ methods }) {
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

export function StakingExit({ methods }) {
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

const components = {
  "staking-stake": StakingStake,
  "staking-unstake": StakingUnstake,
  "staking-claim": StakingClaim,
  "staking-exit": StakingExit,
};

export function AdapterModalComponent({ component, onAction }) {
  const { name, methods } = component;
  const Component = components[name];
  if (Component === undefined) throw new Error(`Undefined component "${name}"`);

  return (
    <div>
      <Component methods={methods} />
    </div>
  );
}

import React, { useEffect } from "react";
import { BigNumber as BN } from "bignumber.js";
import { useDebounce } from "react-use";
import ReactJson from "react-json-view";
import { ReactJsonWrap } from "../components/ReactJsonWrap";
import { ethers } from "ethers";

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

export function EthereumAutomateRestakeDeposit({ methods }) {
  const [process, setProcess] = React.useState(false);
  const [balance, setBalance] = React.useState("0");
  const [amount, setAmount] = React.useState("0");
  const [isApproved, setApproved] = React.useState(false);
  const [canDeposit, setCanDeposit] = React.useState(null);

  const fetchBalance = () => methods.balanceOf().then(setBalance);

  React.useEffect(() => {
    fetchBalance();
  }, []);

  useDebounce(
    () => {
      methods.isApproved(amount).then(setApproved);
    },
    500,
    [amount]
  );

  useDebounce(
    () => {
      if (isApproved !== true) {
        return setCanDeposit(false);
      }
      methods.canDeposit(amount).then(setCanDeposit);
    },
    500,
    [isApproved, amount]
  );

  const onApprove = async () => {
    setProcess(true);
    const res = await methods.approve(amount);
    if (res instanceof Error) {
      console.error(res.message);
    }
    const { tx } = res;
    if (tx) await tx.wait();
    setProcess(false);
    setApproved(true);
  };

  const onDeposit = async () => {
    setProcess(true);
    await methods.deposit(amount).then(({ tx }) => tx.wait());
    setProcess(false);
  };

  return (
    <div>
      <div>
        <div>Balance: {balance}</div>
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
        <div>{canDeposit === null || canDeposit.message}</div>
      </div>
      <div>
        {process ? (
          <span>Loading...</span>
        ) : isApproved === false ? (
          <button onClick={onApprove}>Approve</button>
        ) : (
          <button onClick={onDeposit} disabled={canDeposit instanceof Error}>
            Deposit
          </button>
        )}
      </div>
    </div>
  );
}

export function EthereumAutomateRestakeRefund({ methods }) {
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

export function EthereumAutomateRestakeMigrate({ methods }) {
  const [staked, setStaked] = React.useState("0");
  const [process, setProcess] = React.useState(false);

  const fetchStaked = async () => {
    const stake = await methods.staked();
    setStaked(stake);
  };

  React.useEffect(() => {
    fetchStaked();
  }, []);

  const onMigrate = async () => {
    if (new BN(staked).lte(0)) return;

    setProcess(true);
    await methods.withdraw().then(({ tx }) => tx.wait());
    await methods.approve(staked).then(({ tx }) => tx?.wait());
    await methods.deposit(staked).then(({ tx }) => tx.wait());
    setProcess(false);
    fetchStaked();
  };

  return (
    <div>
      <div>
        <div>Staked: {staked}</div>
      </div>
      {process ? (
        <span>Loading...</span>
      ) : (
        <button onClick={onMigrate}>Migrate</button>
      )}
    </div>
  );
}

export function EthereumAutomateRestakeRun({ methods }) {
  const [params, setParams] = React.useState(null);
  const [process, setProcess] = React.useState(false);

  const onRunParams = async () => {
    setProcess(true);
    setParams(await methods.runParams());
    setProcess(false);
  };

  const onRun = async () => {
    setProcess(true);
    await methods
      .run()
      .then(({ tx }) => tx.wait())
      .catch((e) => console.error(e));
    setProcess(false);
  };

  return (
    <div>
      {params !== null && (
        <div>
          {params instanceof Error ? (
            <div className="error">Error: {params.message}</div>
          ) : (
            <div>
              <ReactJsonWrap>
                <ReactJson
                  src={JSON.parse(JSON.stringify(params))}
                  collapsed={1}
                />
              </ReactJsonWrap>
            </div>
          )}
        </div>
      )}
      {process ? (
        <span>Loading...</span>
      ) : (
        <div>
          <button onClick={onRunParams}>Run params</button>
          <button onClick={onRun}>Run</button>
        </div>
      )}
    </div>
  );
}

export function EthereumAutomateRestakeStopLoss({ methods }) {
  const [process, setProcess] = React.useState(false);
  const [startTokens, setStartTokens] = React.useState([]);
  const [startToken, setStartToken] = React.useState("");
  const [endToken, setEndToken] = React.useState("");
  const [amountOut, setAmountOut] = React.useState("0");
  const [currentAmountOut, setCurrentAmountOut] = React.useState("0");
  const [slippage, setSlippage] = React.useState("1");
  const [amountOutMin, setAmountOutMin] = React.useState("0");

  useEffect(() => {
    methods.startTokens().then(setStartTokens);
  }, []);

  useEffect(() => {
    setStartToken(startTokens[0]);
  }, [startTokens]);

  useEffect(() => {
    if (Number.isNaN(Number(amountOut))) {
      return setAmountOutMin("0");
    }

    setAmountOutMin(amountOut * (1 - Number(slippage) / 100));
  }, [amountOut, slippage]);

  useDebounce(
    () => {
      if (
        !ethers.utils.isAddress(startToken) ||
        !ethers.utils.isAddress(endToken)
      ) {
        return setCurrentAmountOut("0");
      }

      methods.amountOut([startToken, endToken]).then(setCurrentAmountOut);
    },
    1000,
    [startToken, endToken]
  );

  const onSetStopLoss = async () => {
    if (
      !ethers.utils.isAddress(startToken) ||
      !ethers.utils.isAddress(endToken)
    ) {
      return;
    }

    setProcess(true);
    await methods
      .setStopLoss([startToken, endToken], amountOut, amountOutMin)
      .then(({ tx }) => tx.wait())
      .catch((e) => console.error(e));
    setProcess(false);
  };

  const onRemoveStopLoss = async () => {
    setProcess(true);
    await methods
      .removeStopLoss()
      .then(({ tx }) => tx.wait())
      .catch((e) => console.error(e));
    setProcess(false);
  };

  const onRunStopLoss = async () => {
    setProcess(true);
    await methods
      .runStopLoss()
      .then(({ tx }) => tx.wait())
      .catch((e) => console.error(e));
    setProcess(false);
  };

  return (
    <div>
      <div>
        <label>Start token:</label>
        <select
          value={startToken}
          onChange={(e) => setStartToken(e.target.value)}
        >
          {startTokens.map((address) => (
            <option key={address} value={address}>
              {address}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Exit token:</label>
        <input
          type="text"
          value={endToken}
          onChange={(e) => setEndToken(e.target.value)}
        />
      </div>
      <div>
        <label>Amount out ({currentAmountOut}):</label>
        <input
          type="text"
          value={amountOut}
          onChange={(e) => setAmountOut(e.target.value)}
        />
      </div>
      <div>
        <label>Slippage ({amountOutMin}):</label>
        <select value={slippage} onChange={(e) => setSlippage(e.target.value)}>
          <option value="0.5">0.5%</option>
          <option value="1">1%</option>
          <option value="5">5%</option>
          <option value="10">10%</option>
          <option value="25">25%</option>
          <option value="100">100%</option>
        </select>
      </div>
      {process ? (
        <span>Loading...</span>
      ) : (
        <div>
          <div>
            <button
              disabled={
                !ethers.utils.isAddress(startToken) ||
                !ethers.utils.isAddress(endToken) ||
                Number.isNaN(Number(amountOut)) ||
                Number.isNaN(Number(amountOutMin))
              }
              onClick={onSetStopLoss}
            >
              Set stop-loss
            </button>
          </div>
          <div>
            <button onClick={onRemoveStopLoss}>Remove stop-loss</button>
          </div>
          <div>
            <button onClick={onRunStopLoss}>Run stop-loss</button>
          </div>
        </div>
      )}
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
    "automateRestake-deposit": EthereumAutomateRestakeDeposit,
    "automateRestake-refund": EthereumAutomateRestakeRefund,
    "automateRestake-migrate": EthereumAutomateRestakeMigrate,
    "automateRestake-run": EthereumAutomateRestakeRun,
    "automateRestake-stopLoss": EthereumAutomateRestakeStopLoss,
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

export function AdapterModalComponent({ blockchain, component }) {
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

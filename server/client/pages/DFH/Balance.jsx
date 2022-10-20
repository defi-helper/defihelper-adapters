import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { useProvider } from "../../common/ether";
import * as adaptersGateway from "../../common/adapter";
import contracts from "@defihelper/networks/contracts.json";

export function BalancePage() {
  const [, signer] = useProvider();
  const [error, setError] = useState("");
  const [balanceAddress, setBalanceAddress] = useState("");
  const [balanceAdapter, setBalanceAdapter] = useState(null);
  const [balance, setBalance] = useState("0");
  const [netBalance, setNetBalance] = useState("0");
  const [depositAmount, setDepositAmount] = useState("0");
  const [depositProcess, setDepositProcess] = useState(false);
  const [refundAmount, setRefundAmount] = useState("0");
  const [refundProcess, setRefundProcess] = useState(false);

  const fetchAdapter = async () => {
    if (!ethers.utils.isAddress(balanceAddress)) return;

    const adapter = await adaptersGateway.load("dfh");
    setBalanceAdapter(await adapter.balance(signer, balanceAddress));
  };

  const fetchBalance = async () => {
    if (!balanceAdapter) return;

    setBalance("...");
    balanceAdapter.balance().then(setBalance);
  };

  const fetchNetBalance = async () => {
    if (!balanceAdapter) return;

    setNetBalance("...");
    balanceAdapter.netBalance().then(setNetBalance);
  };

  const deposit = async () => {
    if (Number.isNaN(Number(depositAmount))) return;

    setDepositProcess(true);
    try {
      const canDeposit = await balanceAdapter.canDeposit(depositAmount);
      if (canDeposit instanceof Error) return setError(`${canDeposit}`);

      await balanceAdapter.deposit(depositAmount);
    } catch (e) {
      setError(`${e}`);
    } finally {
      setDepositProcess(false);
    }
  };

  const refund = async () => {
    if (Number.isNaN(Number(refundAmount))) return;

    setRefundProcess(true);
    try {
      const canRefund = await balanceAdapter.canRefund(refundAmount);
      if (canRefund instanceof Error) return setError(`${canRefund}`);

      await balanceAdapter.refund(refundAmount);
    } catch (e) {
      setError(`${e}`);
    } finally {
      setRefundProcess(false);
    }
  };

  useEffect(() => {
    if (!signer || !ethers.utils.isAddress(balanceAddress)) {
      return;
    }

    setBalanceAdapter(null);
    fetchAdapter();
  }, [signer, balanceAddress]);

  useEffect(() => {
    if (!signer || balanceAddress !== "") return;

    signer
      .getChainId()
      .then((chainId) =>
        setBalanceAddress(contracts[chainId]?.BalanceUpgradable?.address ?? "")
      );
  }, [signer]);

  return (
    <div className="container">
      <h2>DeFiHelper Balance</h2>
      {error === "" || <div style={{ color: "red" }}>{error}</div>}
      <div>
        <div>
          <label>Balance:</label>
          <input
            type="text"
            placeholder="0x..."
            value={balanceAddress}
            onChange={(e) => setBalanceAddress(e.target.value)}
          />
        </div>
      </div>
      {balanceAdapter ? (
        <div>
          <div>
            <button onClick={fetchBalance}>Balance {balance}</button>
          </div>
          <div>
            <button onClick={fetchNetBalance}>Net balance {netBalance}</button>
          </div>
          <div className="line">
            <div>
              <input
                type="text"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
            </div>
            <div>
              {depositProcess ? (
                <div>Process...</div>
              ) : (
                <button onClick={deposit}>Deposit</button>
              )}
            </div>
          </div>
          <div className="line">
            <div>
              <input
                type="text"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
              />
            </div>
            <div>
              {refundProcess ? (
                <div>Process...</div>
              ) : (
                <button onClick={refund}>Refund</button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

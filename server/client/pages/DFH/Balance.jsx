import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { useQueryParams } from "../../common/useQueryParams";
import { useDebounce } from "react-use";
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
        setBalanceAddress(contracts[chainId]?.Balance?.address ?? "")
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
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

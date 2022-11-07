import React, { useEffect, useState } from "react";
import ReactJson from "react-json-view";
import { ethers } from "ethers";
import { useProvider } from "../../../common/ether";
import * as adaptersGateway from "../../../common/adapter";
import { useQueryParams } from "../../../common/useQueryParams";
import { ReactJsonWrap } from "../../../components/ReactJsonWrap";
import { Handler } from "./Handler";

function TabButton({ id, label, activeId, onClick }) {
  return (
    <button
      onClick={() => {
        location.hash = id;
        onClick(id);
      }}
      className={`button ${
        activeId === id ? "button-outline" : "button-clear"
      }`}
    >
      {label}
    </button>
  );
}

export function SmartTradePage() {
  const searchParams = useQueryParams();
  const [error, setError] = useState("");
  const [, signer] = useProvider();
  const [adapters, setAdapters] = useState(null);
  const [routerAdapter, setRouterAdapter] = useState(null);
  const [routerAddress, setRouterAddress] = useState(
    searchParams.get("router") ?? ""
  );
  const [currentHandlerName, setCurrentHandlerName] = useState(
    (location.hash !== "" ? location.hash : "#mock-handler").slice(1)
  );
  const [approveTokenAddress, setApproveTokenAddress] = useState("");
  const [approveAmount, setApproveAmount] = useState("");
  const [approveTx, setApproveTx] = useState(null);
  const [depositOrderId, setDepositOrderId] = useState("");
  const [depositTokenAddress, setDepositTokenAddress] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [depositTx, setDepositTx] = useState(null);
  const [refundOrderId, setRefundOrderId] = useState("");
  const [refundTokenAddress, setRefundTokenAddress] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [refundTx, setRefundTx] = useState(null);
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);

  const onAdaptersReload = async () => {
    setAdapters(null);
    setAdapters(await adaptersGateway.load("dfh"));
  };

  const onRouterAdapterReload = async () => {
    setError("");
    if (!signer || !adapters) return;
    if (!ethers.utils.isAddress(routerAddress)) {
      return setError(`Invalid SmartTrade router address: "${routerAddress}"`);
    }

    setRouterAdapter(
      await adapters.automates.smartTrade.router(signer, routerAddress)
    );
  };

  const onApprove = async () => {
    setError("");
    setApproveTx(null);
    if (!routerAdapter) return;

    if (Number.isNaN(Number(approveAmount))) {
      return setError(`Invalid approve amount: "${approveAmount}"`);
    }
    if (!ethers.utils.isAddress(approveTokenAddress)) {
      return setError(
        `Invalid approve token address: "${approveTokenAddress}"`
      );
    }

    const isApproved = await routerAdapter.methods.isApproved(
      approveTokenAddress,
      approveAmount
    );
    if (isApproved instanceof Error) {
      return setError(isApproved.message);
    }

    const { tx } = await routerAdapter.methods.approve(
      approveTokenAddress,
      approveAmount
    );
    setApproveTx(tx);
  };

  const onDeposit = async () => {
    setError("");
    setDepositTx(null);
    if (!routerAdapter) return;

    if (Number.isNaN(Number(depositOrderId))) {
      return setError(`Invalid deposit order id: "${depositOrderId}"`);
    }
    if (Number.isNaN(Number(depositAmount))) {
      return setError(`Invalid deposit amount: "${depositAmount}"`);
    }
    if (!ethers.utils.isAddress(depositTokenAddress)) {
      return setError(
        `Invalid deposit token address: "${depositTokenAddress}"`
      );
    }

    const canDeposit = await routerAdapter.methods.canDeposit(depositOrderId, [
      { token: depositTokenAddress, amount: depositAmount },
    ]);
    if (canDeposit instanceof Error) {
      return setError(canDeposit.message);
    }

    const { tx } = await routerAdapter.methods.deposit(depositOrderId, [
      { token: depositTokenAddress, amount: depositAmount },
    ]);
    setDepositTx(tx);
  };

  const onRefund = async () => {
    setError("");
    setRefundTx(null);
    if (!routerAdapter) return;

    if (Number.isNaN(Number(refundOrderId))) {
      return setError(`Invalid refund order id: "${refundOrderid}"`);
    }
    if (Number.isNaN(Number(refundAmount))) {
      return setError(`Invalid refund amount: "${refundAmount}"`);
    }
    if (!ethers.utils.isAddress(refundTokenAddress)) {
      return setError(`Invalid refund token address: "${refundTokenAddress}"`);
    }

    const canRefund = await routerAdapter.methods.canRefund(refundOrderId, [
      { token: refundTokenAddress, amount: refundAmount },
    ]);
    if (canRefund instanceof Error) {
      return setError(canRefund.message);
    }

    const { tx } = await routerAdapter.methods.refund(refundOrderId, [
      { token: refundTokenAddress, amount: refundAmount },
    ]);
    setRefundTx(tx);
  };

  const onGetOrder = async () => {
    setError("");
    setOrder(null);
    if (!routerAdapter) return;

    const id = Number(orderId);
    if (Number.isNaN(id)) {
      return setError(`Invalid order id: "${id}"`);
    }

    setOrder(await routerAdapter.methods.order(id));
  };

  useEffect(onAdaptersReload, []);

  return (
    <div className="container">
      <h2>DeFiHelper SmartTrade</h2>
      {error === "" || <div style={{ color: "red" }}>{error}</div>}
      <div>
        <div>
          <label>SmartTrade Router:</label>
        </div>
        <div className="row">
          <div className="column column-80">
            <input
              type="text"
              placeholder="0x..."
              value={routerAddress}
              onChange={(e) => setRouterAddress(e.target.value)}
            />
          </div>
          <div className="column column-20">
            <button onClick={onRouterAdapterReload}>Reload</button>
          </div>
        </div>
      </div>
      {routerAdapter && (
        <div>
          <div>
            <div>
              <label>Approve:</label>
            </div>
            <div className="row">
              <div className="column column-80">
                <input
                  type="text"
                  placeholder="token"
                  value={approveTokenAddress}
                  onChange={(e) => setApproveTokenAddress(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="amount"
                  value={approveAmount}
                  onChange={(e) => setApproveAmount(e.target.value)}
                />
              </div>
              <div className="column column-20">
                <button onClick={onApprove}>Send</button>
              </div>
            </div>
            {approveTx !== null && (
              <ReactJsonWrap>
                <ReactJson
                  src={JSON.parse(JSON.stringify(approveTx))}
                  collapsed={1}
                />
              </ReactJsonWrap>
            )}
          </div>
          <div>
            <div>
              <label>Deposit:</label>
            </div>
            <div className="row">
              <div className="column column-80">
                <input
                  type="text"
                  placeholder="order"
                  value={depositOrderId}
                  onChange={(e) => setDepositOrderId(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="token"
                  value={depositTokenAddress}
                  onChange={(e) => setDepositTokenAddress(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="amount"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
              </div>
              <div className="column column-20">
                <button onClick={onDeposit}>Send</button>
              </div>
            </div>
            {depositTx !== null && (
              <ReactJsonWrap>
                <ReactJson
                  src={JSON.parse(JSON.stringify(depositTx))}
                  collapsed={1}
                />
              </ReactJsonWrap>
            )}
          </div>
          <div>
            <div>
              <label>Refund:</label>
            </div>
            <div className="row">
              <div className="column column-80">
                <input
                  type="text"
                  placeholder="order"
                  value={refundOrderId}
                  onChange={(e) => setRefundOrderId(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="token"
                  value={refundTokenAddress}
                  onChange={(e) => setRefundTokenAddress(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="amount"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                />
              </div>
              <div className="column column-20">
                <button onClick={onRefund}>Send</button>
              </div>
            </div>
            {refundTx !== null && (
              <ReactJsonWrap>
                <ReactJson
                  src={JSON.parse(JSON.stringify(refundTx))}
                  collapsed={1}
                />
              </ReactJsonWrap>
            )}
          </div>
          <div>
            <div>
              <label>Get order:</label>
            </div>
            <div className="row">
              <div className="column column-80">
                <input
                  type="text"
                  placeholder="id"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                />
              </div>
              <div className="column column-20">
                <button onClick={onGetOrder}>Send</button>
              </div>
            </div>
            {order !== null && (
              <ReactJsonWrap>
                <ReactJson
                  src={JSON.parse(JSON.stringify(order))}
                  collapsed={1}
                />
              </ReactJsonWrap>
            )}
          </div>
          <div>
            <div className="row">
              <div className="column">
                <TabButton
                  id="mock-handler"
                  label="Mock Handler"
                  activeId={currentHandlerName}
                  onClick={setCurrentHandlerName}
                />
              </div>
              <div className="column">
                <TabButton
                  id="swap-handler"
                  label="Swap Handler"
                  activeId={currentHandlerName}
                  onClick={setCurrentHandlerName}
                />
              </div>
            </div>
            <div>
              <Handler
                name={currentHandlerName}
                signer={signer}
                routerAdapter={routerAdapter}
                adapters={adapters}
                searchParams={searchParams}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import ReactJson from "react-json-view";
import { useDebounce } from "react-use";
import { ethers } from "ethers";
import { BigNumber as BN } from "bignumber.js";
import { useProvider } from "../../common/ether";
import * as adaptersGateway from "../../common/adapter";
import { useQueryParams } from "../../common/useQueryParams";
import { ReactJsonWrap } from "../../components/ReactJsonWrap";

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

function MockHandler({ signer, adapters, searchParams }) {
  return <div>Mock handler</div>;
}

function SwapHandler({ signer, adapters, searchParams }) {
  const [error, setError] = useState("");
  const [handlerAddress, setHandlerAddress] = useState(
    searchParams.get("handler") ?? ""
  );
  const [handlerAdapter, setHandlerAdapter] = useState(null);
  const [exchangeAddress, setExchangeAddress] = useState("");
  const [path, setPath] = useState([]);
  const [amountIn, setAmountIn] = useState("100");
  const [amountOut, setAmountOut] = useState("100");
  const [slippage, setSlippage] = useState("1");
  const [direction, setDirection] = useState("lt");
  const [depositTokenAmount, setDepositTokenAmount] = useState("");
  const [depositBalanceAmount, setDepositBalanceAmount] = useState("");
  const [createOrderTx, setCreateOrderTx] = useState(null);
  const [createOrderCallData, setCreateOrderCallData] = useState(null);

  const onHandlerReload = async () => {
    if (!ethers.utils.isAddress(handlerAddress)) {
      return setError(
        `Invalid SmartTrade handler address: "${handlerAddress}"`
      );
    }

    setHandlerAdapter(
      await adapters.automates.smartTrade.swapHandler(signer, handlerAddress)
    );
  };

  const onAmountInChanged = async (value) => {
    setAmountIn(value);
    if (
      handlerAdapter &&
      ethers.utils.isAddress(exchangeAddress) &&
      path.length > 1 &&
      !Number.isNaN(Number(value))
    ) {
    }
  };

  useDebounce(
    () => {
      if (
        !handlerAdapter ||
        !ethers.utils.isAddress(exchangeAddress) ||
        path.length < 2 ||
        Number.isNaN(Number(amountIn))
      ) {
        return;
      }

      handlerAdapter.methods
        .amountOut(exchangeAddress, path, amountIn)
        .then((amountOut) => setAmountOut(new BN(amountOut).toFixed(6)));
    },
    500,
    [amountIn]
  );

  const onCreateOrder = async () => {
    setError("");
    if (!ethers.utils.isAddress(exchangeAddress)) {
      return setError(`Invalid exchange address: "${exchangeAddress}"`);
    }
    if (path.length <= 1 || path.some((v) => !ethers.utils.isAddress(v))) {
      return setError(`Invalid swap path: "${path.join(", ")}"`);
    }
    if (Number.isNaN(Number(amountIn))) {
      return setError(`Invalid amount: "${amountIn}"`);
    }
    if (Number.isNaN(Number(slippage))) {
      return setError(`Invalid slippage: "${slippage}"`);
    }
    if (depositTokenAmount !== "" && Number.isNaN(Number(depositTokenAmount))) {
      return setError(`Invalid deposit token amount: "${depositAmount}"`);
    }
    if (
      depositBalanceAmount !== "" &&
      Number.isNaN(Number(depositBalanceAmount))
    ) {
      return setError(
        `Invalid deposit balance amount: "${depositBalanceAmount}"`
      );
    }

    const { tx, callData } = await handlerAdapter.methods.createOrder(
      exchangeAddress,
      path,
      amountIn,
      amountOut,
      slippage,
      direction,
      {
        token: depositTokenAmount !== "" ? depositTokenAmount : undefined,
        native: depositBalanceAmount !== "" ? depositBalanceAmount : undefined,
      }
    );
    setCreateOrderTx(tx);
    setCreateOrderCallData(callData);
  };

  return (
    <div>
      {error === "" || <div style={{ color: "red" }}>{error}</div>}
      <div>
        <div>
          <label>SwapHandler address:</label>
        </div>
        <div className="row">
          <div className="column column-80">
            <input
              type="text"
              placeholder="0x..."
              value={handlerAddress}
              onChange={(e) => setHandlerAddress(e.target.value)}
            />
          </div>
          <div className="column column-20">
            <button onClick={onHandlerReload}>Reload</button>
          </div>
        </div>
      </div>
      {handlerAdapter && (
        <div>
          <div>
            <label>Create order</label>
            <div>
              <div>
                <label>Exchange address:</label>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="0x..."
                  value={exchangeAddress}
                  onChange={(e) => setExchangeAddress(e.target.value)}
                />
              </div>
            </div>
            <div>
              <div>
                <label>Swap path:</label>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="0x..., 0x..."
                  value={path.join(", ")}
                  onChange={(e) =>
                    setPath(e.target.value.split(",").map((v) => v.trim()))
                  }
                />
              </div>
            </div>
            <div>
              <div>
                <label>Direction:</label>
              </div>
              <div>
                <div>
                  <label>Take profit:</label>
                  <input
                    type="radio"
                    name="direction"
                    value="gt"
                    checked={direction === "gt"}
                    onChange={() => setDirection("gt")}
                  />
                </div>
                <div>
                  <label>Stop loss:</label>
                  <input
                    type="radio"
                    name="direction"
                    value="lt"
                    checked={direction === "lt"}
                    onChange={() => setDirection("lt")}
                  />
                </div>
              </div>
            </div>
            <div>
              <div>
                <label>Amount in:</label>
              </div>
              <div>
                <input
                  type="text"
                  value={amountIn}
                  onChange={(e) => setAmountIn(e.target.value)}
                />
              </div>
            </div>
            <div>
              <div>
                <label>Amount out:</label>
              </div>
              <div>
                <input
                  type="text"
                  value={amountOut}
                  onChange={(e) => setAmountOut(e.target.value)}
                />
              </div>
            </div>
            <div>
              <div>
                <label>Slippage (%):</label>
              </div>
              <div>
                <input
                  type="text"
                  value={slippage}
                  onChange={(e) => setSlippage(e.target.value)}
                />
              </div>
            </div>
            <div>
              <div>
                <label>Deposit token:</label>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="amount"
                  value={depositTokenAmount}
                  onChange={(e) => setDepositTokenAmount(e.target.value)}
                />
              </div>
            </div>
            <div>
              <div>
                <label>Deposit balance:</label>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="amount"
                  value={depositBalanceAmount}
                  onChange={(e) => setDepositBalanceAmount(e.target.value)}
                />
              </div>
            </div>
            <div>
              <button onClick={onCreateOrder}>Send</button>
            </div>
            {createOrderTx !== null && (
              <ReactJsonWrap>
                <ReactJson
                  src={JSON.parse(JSON.stringify(createOrderTx))}
                  collapsed={1}
                />
              </ReactJsonWrap>
            )}
            {createOrderCallData !== null && (
              <ReactJsonWrap>
                <ReactJson src={createOrderCallData} collapsed={1} />
              </ReactJsonWrap>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Handler({ name, signer, adapters, searchParams }) {
  const Component = {
    "mock-handler": MockHandler,
    "swap-handler": SwapHandler,
  }[name];
  if (Component === undefined) throw new Error(`Undefined component "${name}"`);

  return (
    <div>
      <Component
        signer={signer}
        adapters={adapters}
        searchParams={searchParams}
      />
    </div>
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
    (location.hash ?? "#mock-handler").slice(1)
  );
  const [depositTokenAddress, setDepositTokenAddress] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [depositTx, setDepositTx] = useState(null);
  const [refundTokenAddress, setRefundTokenAddress] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [refundTx, setRefundTx] = useState(null);
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [cancelOrderId, setCancelOrderId] = useState("");
  const [cancelOrderTx, setCancelOrderTx] = useState(null);
  const [handleOrderId, setHandleOrderId] = useState("");
  const [handleOrderTx, setHandleOrderTx] = useState(null);

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

  const onDeposit = async () => {
    setError("");
    setDepositTx(null);
    if (!routerAdapter) return;

    if (Number.isNaN(Number(depositAmount))) {
      return setError(`Invalid deposit amount: "${depositAmount}"`);
    }
    if (!ethers.utils.isAddress(depositTokenAddress)) {
      return setError(
        `Invalid deposit token address: "${depositTokenAddress}"`
      );
    }

    const canDeposit = await routerAdapter.methods.canDeposit(
      depositTokenAddress,
      depositAmount
    );
    if (canDeposit instanceof Error) {
      return setError(canDeposit.message);
    }

    const { tx } = await routerAdapter.methods.deposit(
      depositTokenAddress,
      depositAmount
    );
    setDepositTx(tx);
  };

  const onRefund = async () => {
    setError("");
    setRefundTx(null);
    if (!routerAdapter) return;

    if (Number.isNaN(Number(refundAmount))) {
      return setError(`Invalid refund amount: "${refundAmount}"`);
    }
    if (!ethers.utils.isAddress(refundTokenAddress)) {
      return setError(`Invalid refund token address: "${refundTokenAddress}"`);
    }

    const canRefund = await routerAdapter.methods.canRefund(
      refundTokenAddress,
      refundAmount
    );
    if (canRefund instanceof Error) {
      return setError(canRefund.message);
    }

    const { tx } = await routerAdapter.methods.refund(
      refundTokenAddress,
      refundAmount
    );
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

  const onCancelOrder = async () => {
    setError("");
    setCancelOrderTx(null);
    if (!routerAdapter) return;

    const orderId = Number(cancelOrderId);
    if (Number.isNaN(orderId)) {
      return setError(`Invalid order id: "${orderId}"`);
    }

    const canCancelOrder = await routerAdapter.methods.canCancelOrder(orderId);
    if (canCancelOrder instanceof Error) {
      return setError(canCancelOrder.message);
    }

    const { tx } = await routerAdapter.methods.cancelOrder(orderId);
    setCancelOrderTx(tx);
  };

  const onHandleOrder = async () => {
    setError("");
    setHandleOrderTx(null);
    if (!routerAdapter) return;

    const orderId = Number(handleOrderId);
    if (Number.isNaN(orderId)) {
      return setError(`Invalid order id: "${orderId}"`);
    }

    const { tx } = await routerAdapter.methods.handleOrder(orderId);
    setHandleOrderTx(tx);
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
              <label>Deposit:</label>
            </div>
            <div className="row">
              <div className="column column-80">
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
            <div>
              <label>Cancel order:</label>
            </div>
            <div className="row">
              <div className="column column-80">
                <input
                  type="text"
                  placeholder="id"
                  value={cancelOrderId}
                  onChange={(e) => setCancelOrderId(e.target.value)}
                />
              </div>
              <div className="column column-20">
                <button onClick={onCancelOrder}>Send</button>
              </div>
            </div>
            {cancelOrderTx !== null && (
              <ReactJsonWrap>
                <ReactJson
                  src={JSON.parse(JSON.stringify(cancelOrderTx))}
                  collapsed={1}
                />
              </ReactJsonWrap>
            )}
          </div>
          <div>
            <div>
              <label>Handle order:</label>
            </div>
            <div className="row">
              <div className="column column-80">
                <input
                  type="text"
                  placeholder="id"
                  value={handleOrderId}
                  onChange={(e) => setHandleOrderId(e.target.value)}
                />
              </div>
              <div className="column column-20">
                <button onClick={onHandleOrder}>Send</button>
              </div>
            </div>
            {handleOrderTx !== null && (
              <ReactJsonWrap>
                <ReactJson
                  src={JSON.parse(JSON.stringify(handleOrderTx))}
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

import React, { useEffect, useState } from "react";
import ReactJson from "react-json-view";
import { useDebounce } from "react-use";
import { ethers } from "ethers";
import { BigNumber as BN } from "bignumber.js";
import { useProvider } from "../../common/ether";
import * as adaptersGateway from "../../common/adapter";
import { useQueryParams } from "../../common/useQueryParams";
import { ReactJsonWrap } from "../../components/ReactJsonWrap";

function isNaN(value) {
  return Number.isNaN(Number(value));
}

function percent(value) {
  if (Number(value) < 0) return 0;
  if (Number(value) > 100) return 100;
  return value;
}

function calcSlippage(value, slippage) {
  if (isNaN(value) || isNaN(slippage)) {
    return new BN(0);
  }
  return new BN(Number(value)).multipliedBy(
    new BN(1).minus(new BN(Number(slippage)).div(100))
  );
}

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
  const [takeProfit, setTakeProfit] = useState(false);
  const [takeProfitAmountOut, setTakeProfitAmountOut] = useState("0");
  const [takeProfitSlippage, setTakeProfitSlippage] = useState("1");
  const [takeProfitAmountOutMin, setTakeProfitAmountOutMin] = useState("0");
  const [takeProfitPrice, setTakeProfitPrice] = useState("0");
  const [stopLoss, setStopLoss] = useState(false);
  const [stopLossAmountOut, setStopLossAmountOut] = useState("0");
  const [stopLossSlippage, setStopLossSlippage] = useState("1");
  const [stopLossAmountOutMin, setStopLossAmountOutMin] = useState("0");
  const [stopLossPrice, setStopLossPrice] = useState("0");
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
    if (stopLoss && Number.isNaN(Number(stopLossAmountOut))) {
      return setError(`Invalid stop loss amount out: "${stopLossAmountOut}"`);
    }
    if (takeProfit && Number.isNaN(Number(takeProfitAmountOut))) {
      return setError(
        `Invalid take profit amount out: "${takeProfitAmountOut}"`
      );
    }
    if (stopLoss && Number.isNaN(Number(stopLossSlippage))) {
      return setError(`Invalid stop loss slippage: "${stopLossSlippage}"`);
    }
    if (takeProfit && Number.isNaN(Number(takeProfitSlippage))) {
      return setError(`Invalid take profit slippage: "${takeProfitSlippage}"`);
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

    if (depositTokenAmount !== "") {
      const isApproved = await handlerAdapter.methods.isApproved(
        path[0],
        depositTokenAmount
      );
      if (!isApproved) {
        await handlerAdapter.methods
          .approve(path[0], depositTokenAmount)
          .then(({ tx }) => tx?.wait());
      }
    }

    const data = await handlerAdapter.methods.createOrder(
      exchangeAddress,
      path,
      amountIn,
      stopLoss
        ? { amountOut: stopLossAmountOut, slippage: stopLossSlippage }
        : null,
      takeProfit
        ? { amountOut: takeProfitAmountOut, slippage: takeProfitSlippage }
        : null,
      {
        token: depositTokenAmount !== "" ? depositTokenAmount : undefined,
        native: depositBalanceAmount !== "" ? depositBalanceAmount : undefined,
      }
    );
    setCreateOrderTx(data.tx);
    setCreateOrderCallData({
      handler: data.handler,
      callDataRaw: data.callDataRaw,
      callData: data.callData,
      number: await data.getOrderNumber(),
    });
  };

  useEffect(
    () =>
      setTakeProfitAmountOutMin(
        calcSlippage(takeProfitAmountOut, takeProfitSlippage).toString(10)
      ),
    [takeProfitAmountOut, takeProfitSlippage]
  );

  useEffect(
    () =>
      setStopLossAmountOutMin(
        calcSlippage(stopLossAmountOut, stopLossSlippage).toString(10)
      ),
    [stopLossAmountOut, stopLossSlippage]
  );

  useEffect(
    () =>
      setTakeProfitPrice(
        new BN(takeProfitAmountOut).div(amountIn).toString(10)
      ),
    [amountIn, takeProfitAmountOut]
  );

  useEffect(
    () =>
      setStopLossPrice(new BN(stopLossAmountOut).div(amountIn).toString(10)),
    [amountIn, stopLossAmountOut]
  );

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
                <label htmlFor="takeProfit">Take profit:</label>
                <input
                  id="takeProfit"
                  type="checkbox"
                  checked={takeProfit}
                  onChange={(e) => setTakeProfit(e.target.checked)}
                />
              </div>
              {takeProfit && (
                <>
                  <div>
                    <div>
                      <label>Amount out:</label>
                    </div>
                    <div>
                      <input
                        type="text"
                        value={takeProfitAmountOut}
                        onChange={(e) => setTakeProfitAmountOut(e.target.value)}
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
                        value={takeProfitSlippage}
                        onChange={(e) =>
                          setTakeProfitSlippage(percent(e.target.value))
                        }
                      />
                    </div>
                    <div>Amount out min: {takeProfitAmountOutMin}</div>
                    <div>Price: {takeProfitPrice}</div>
                  </div>
                </>
              )}
            </div>
            <div>
              <div>
                <label htmlFor="stopLoss">Stop loss:</label>
                <input
                  id="stopLoss"
                  type="checkbox"
                  checked={stopLoss}
                  onChange={(e) => setStopLoss(e.target.checked)}
                />
              </div>
              {stopLoss && (
                <>
                  <div>
                    <div>
                      <label>Amount out:</label>
                    </div>
                    <div>
                      <input
                        type="text"
                        value={stopLossAmountOut}
                        onChange={(e) => setStopLossAmountOut(e.target.value)}
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
                        value={stopLossSlippage}
                        onChange={(e) =>
                          setStopLossSlippage(percent(e.target.value))
                        }
                      />
                    </div>
                    <div>Amount out min: {stopLossAmountOutMin}</div>
                    <div>Price: {stopLossPrice}</div>
                  </div>
                </>
              )}
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
              <button
                onClick={onCreateOrder}
                disabled={!stopLoss && !takeProfit}
              >
                Send
              </button>
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
    (location.hash !== "" ? location.hash : "#mock-handler").slice(1)
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

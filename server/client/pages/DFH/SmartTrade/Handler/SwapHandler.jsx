import React, { useEffect, useState } from "react";
import ReactJson from "react-json-view";
import { useDebounce } from "react-use";
import { ethers } from "ethers";
import { BigNumber as BN } from "bignumber.js";
import { ReactJsonWrap } from "../../../../components/ReactJsonWrap";

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

export function SwapHandler({ signer, routerAdapter, adapters, searchParams }) {
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
  const [stopLossMoving, setStopLossMoving] = useState(false);
  const [stopLossSlippage, setStopLossSlippage] = useState("1");
  const [stopLossAmountOutMin, setStopLossAmountOutMin] = useState("0");
  const [stopLossPrice, setStopLossPrice] = useState("0");
  const [depositTokenAmount, setDepositTokenAmount] = useState("");
  const [depositBalanceAmount, setDepositBalanceAmount] = useState("");
  const [createOrderTx, setCreateOrderTx] = useState(null);
  const [createOrderCallData, setCreateOrderCallData] = useState(null);
  const [cancelOrderId, setCancelOrderId] = useState("");
  const [cancelOrderTx, setCancelOrderTx] = useState(null);

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
        .then((amountOut) =>
          console.log("Amount out:", new BN(amountOut).toFixed(6))
        );
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
    if (
      depositBalanceAmount !== "" &&
      Number.isNaN(Number(depositBalanceAmount))
    ) {
      return setError(
        `Invalid deposit balance amount: "${depositBalanceAmount}"`
      );
    }

    const isApproved = await routerAdapter.methods.isApproved(
      path[0],
      amountIn
    );
    if (!isApproved) {
      await routerAdapter.methods
        .approve(path[0], amountIn)
        .then(({ tx }) => tx?.wait());
    }

    const data = await handlerAdapter.methods.createOrder(
      exchangeAddress,
      path,
      amountIn,
      stopLoss
        ? {
            amountOut: stopLossAmountOut,
            moving: stopLossMoving,
            slippage: stopLossSlippage,
          }
        : null,
      takeProfit
        ? {
            amountOut: takeProfitAmountOut,
            slippage: takeProfitSlippage,
          }
        : null,
      {
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

  const onCancelOrder = async () => {
    if (Number.isNaN(Number(cancelOrderId))) return;

    setError("");
    setCancelOrderTx(null);
    if (!handlerAdapter) return;

    const orderId = Number(cancelOrderId);
    if (Number.isNaN(orderId)) {
      return setError(`Invalid order id: "${orderId}"`);
    }

    const canCancelOrder = await handlerAdapter.methods.canCancelOrder(orderId);
    if (canCancelOrder instanceof Error) {
      return setError(canCancelOrder.message);
    }

    const { tx } = await handlerAdapter.methods.cancelOrder(orderId);
    setCancelOrderTx(tx);
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
            <h3>Create order</h3>
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
                <label htmlFor="stopLoss">Stop-loss:</label>
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
                      <label htmlFor="stopLossMoving">Moving:</label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="stopLossMoving"
                        value={stopLossMoving}
                        onChange={(e) => setStopLossMoving(e.target.checked)}
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
          <div>
            <h3>Cancel order</h3>
            <div>
              <div>
                <label>Order id:</label>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="..."
                  value={cancelOrderId}
                  onChange={(e) => setCancelOrderId(e.target.value)}
                />
              </div>
            </div>
            <div>
              <button onClick={onCancelOrder} disabled={cancelOrderId === ""}>
                Send
              </button>
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
        </div>
      )}
    </div>
  );
}

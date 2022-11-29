import React, { useEffect, useState } from "react";
import ReactJson from "react-json-view";
import { useDebounce } from "react-use";
import { ethers } from "ethers";
import { BigNumber as BN } from "bignumber.js";
import { ReactJsonWrap } from "../../../../components/ReactJsonWrap";
import dayjs from "dayjs";

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

export function CreateOrder({ routerAdapter, handlerAdapter }) {
  const [error, setError] = useState("");
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
  const [stopLoss2, setStopLoss2] = useState(false);
  const [stopLoss2AmountOut, setStopLoss2AmountOut] = useState("0");
  const [stopLoss2Moving, setStopLoss2Moving] = useState(false);
  const [stopLoss2Slippage, setStopLoss2Slippage] = useState("1");
  const [stopLoss2AmountOutMin, setStopLoss2AmountOutMin] = useState("0");
  const [stopLoss2Price, setStopLoss2Price] = useState("0");
  const [activate, setActivate] = useState(false);
  const [activateAmountOut, setActivateAmountOut] = useState("0");
  const [activateDirection, setActivateDirection] = useState("gt");
  const [depositBalanceAmount, setDepositBalanceAmount] = useState("");
  const [createOrderTx, setCreateOrderTx] = useState(null);
  const [createOrderCallData, setCreateOrderCallData] = useState(null);

  const onCreate = async () => {
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
    if (stopLoss2 && Number.isNaN(Number(stopLoss2AmountOut))) {
      return setError(
        `Invalid stop loss 2 amount out: "${stopLoss2AmountOut}"`
      );
    }
    if (takeProfit && Number.isNaN(Number(takeProfitAmountOut))) {
      return setError(
        `Invalid take profit amount out: "${takeProfitAmountOut}"`
      );
    }
    if (stopLoss && Number.isNaN(Number(stopLossSlippage))) {
      return setError(`Invalid stop loss slippage: "${stopLossSlippage}"`);
    }
    if (stopLoss2 && Number.isNaN(Number(stopLoss2Slippage))) {
      return setError(`Invalid stop loss 2 slippage: "${stopLoss2Slippage}"`);
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
      stopLoss2
        ? {
            amountOut: stopLoss2AmountOut,
            moving: stopLoss2Moving,
            slippage: stopLoss2Slippage,
          }
        : null,
      takeProfit
        ? {
            amountOut: takeProfitAmountOut,
            slippage: takeProfitSlippage,
          }
        : null,
      activate
        ? {
            amountOut: activateAmountOut,
            direction: activateDirection,
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
      setStopLoss2AmountOutMin(
        calcSlippage(stopLoss2AmountOut, stopLoss2Slippage).toString(10)
      ),
    [stopLoss2AmountOut, stopLoss2Slippage]
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

  useEffect(
    () =>
      setStopLoss2Price(new BN(stopLoss2AmountOut).div(amountIn).toString(10)),
    [amountIn, stopLoss2AmountOut]
  );

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

  return (
    <div>
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
                  onChange={(e) => setStopLossSlippage(percent(e.target.value))}
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
          <label htmlFor="stopLoss2">Stop-loss 2:</label>
          <input
            id="stopLoss2"
            type="checkbox"
            checked={stopLoss2}
            onChange={(e) => setStopLoss2(e.target.checked)}
          />
        </div>
        {stopLoss2 && (
          <>
            <div>
              <div>
                <label>Amount out:</label>
              </div>
              <div>
                <input
                  type="text"
                  value={stopLoss2AmountOut}
                  onChange={(e) => setStopLoss2AmountOut(e.target.value)}
                />
              </div>
            </div>
            <div>
              <div>
                <label htmlFor="stopLoss2Moving">Moving:</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="stopLoss2Moving"
                  value={stopLoss2Moving}
                  onChange={(e) => setStopLoss2Moving(e.target.checked)}
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
                  value={stopLoss2Slippage}
                  onChange={(e) =>
                    setStopLoss2Slippage(percent(e.target.value))
                  }
                />
              </div>
              <div>Amount out min: {stopLoss2AmountOutMin}</div>
              <div>Price: {stopLoss2Price}</div>
            </div>
          </>
        )}
      </div>
      <div>
        <div>
          <label htmlFor="activate">Activate:</label>
          <input
            id="activate"
            type="checkbox"
            checked={activate}
            onChange={(e) => setActivate(e.target.checked)}
          />
        </div>
        {activate && (
          <>
            <div>
              <div>
                <label>Amount out:</label>
              </div>
              <div>
                <input
                  type="text"
                  value={activateAmountOut}
                  onChange={(e) => setActivateAmountOut(e.target.value)}
                />
              </div>
            </div>
            <div>
              <div>
                <label>Direction:</label>
              </div>
              <div>
                <div>
                  <label htmlFor="directionGt" style={{ display: "inline" }}>
                    Great
                  </label>{" "}
                  <input
                    type="radio"
                    name="direction"
                    id="directionGt"
                    checked={activateDirection === "gt"}
                    onChange={(e) => setActivateDirection("gt")}
                  />
                </div>
                <div>
                  <label htmlFor="directionLt" style={{ display: "inline" }}>
                    Less
                  </label>{" "}
                  <input
                    type="radio"
                    name="direction"
                    id="directionLt"
                    checked={activateDirection === "lt"}
                    onChange={(e) => setActivateDirection("lt")}
                  />
                </div>
              </div>
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
        <button onClick={onCreate} disabled={!stopLoss && !takeProfit}>
          Send
        </button>
      </div>
      {error === "" || <div style={{ color: "red" }}>{error}</div>}
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
  );
}

export function UpdateOrder({ handlerAdapter }) {
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState("");
  const [takeProfit, setTakeProfit] = useState(false);
  const [takeProfitAmountOut, setTakeProfitAmountOut] = useState("0");
  const [takeProfitSlippage, setTakeProfitSlippage] = useState("1");
  const [takeProfitAmountOutMin, setTakeProfitAmountOutMin] = useState("0");
  const [stopLoss, setStopLoss] = useState(false);
  const [stopLossAmountOut, setStopLossAmountOut] = useState("0");
  const [stopLossMoving, setStopLossMoving] = useState(false);
  const [stopLossSlippage, setStopLossSlippage] = useState("1");
  const [stopLossAmountOutMin, setStopLossAmountOutMin] = useState("0");
  const [stopLoss2, setStopLoss2] = useState(false);
  const [stopLoss2AmountOut, setStopLoss2AmountOut] = useState("0");
  const [stopLoss2Moving, setStopLoss2Moving] = useState(false);
  const [stopLoss2Slippage, setStopLoss2Slippage] = useState("1");
  const [stopLoss2AmountOutMin, setStopLoss2AmountOutMin] = useState("0");
  const [activate, setActivate] = useState(false);
  const [activateAmountOut, setActivateAmountOut] = useState("0");
  const [activateDirection, setActivateDirection] = useState("gt");
  const [updateOrderTx, setUpdateOrderTx] = useState(null);
  const [updateOrderCallData, setUpdateOrderCallData] = useState(null);

  const onUpdate = async () => {
    if (Number.isNaN(orderId)) {
      return setError(`Invalid order id: "${orderId}"`);
    }

    setError("");
    if (stopLoss && Number.isNaN(Number(stopLossAmountOut))) {
      return setError(`Invalid stop loss amount out: "${stopLossAmountOut}"`);
    }
    if (stopLoss2 && Number.isNaN(Number(stopLoss2AmountOut))) {
      return setError(
        `Invalid stop loss 2 amount out: "${stopLoss2AmountOut}"`
      );
    }
    if (takeProfit && Number.isNaN(Number(takeProfitAmountOut))) {
      return setError(
        `Invalid take profit amount out: "${takeProfitAmountOut}"`
      );
    }
    if (stopLoss && Number.isNaN(Number(stopLossSlippage))) {
      return setError(`Invalid stop loss slippage: "${stopLossSlippage}"`);
    }
    if (stopLoss2 && Number.isNaN(Number(stopLoss2Slippage))) {
      return setError(`Invalid stop loss 2 slippage: "${stopLoss2Slippage}"`);
    }
    if (takeProfit && Number.isNaN(Number(takeProfitSlippage))) {
      return setError(`Invalid take profit slippage: "${takeProfitSlippage}"`);
    }

    const data = await handlerAdapter.methods.updateOrder(
      orderId,
      stopLoss
        ? {
            amountOut: stopLossAmountOut,
            moving: stopLossMoving,
            slippage: stopLossSlippage,
          }
        : null,
      stopLoss2
        ? {
            amountOut: stopLoss2AmountOut,
            moving: stopLoss2Moving,
            slippage: stopLoss2Slippage,
          }
        : null,
      takeProfit
        ? {
            amountOut: takeProfitAmountOut,
            slippage: takeProfitSlippage,
          }
        : null,
      activate
        ? {
            amountOut: activateAmountOut,
            direction: activateDirection,
          }
        : null
    );
    setUpdateOrderTx(data.tx);
    setUpdateOrderCallData({
      callDataRaw: data.callDataRaw,
      callData: data.callData,
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
      setStopLoss2AmountOutMin(
        calcSlippage(stopLoss2AmountOut, stopLoss2Slippage).toString(10)
      ),
    [stopLoss2AmountOut, stopLoss2Slippage]
  );

  return (
    <div>
      <div>
        <div>
          <label>Order id:</label>
        </div>
        <div>
          <input
            type="text"
            placeholder="..."
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
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
                  onChange={(e) => setStopLossSlippage(percent(e.target.value))}
                />
              </div>
              <div>Amount out min: {stopLossAmountOutMin}</div>
            </div>
          </>
        )}
      </div>
      <div>
        <div>
          <label htmlFor="stopLoss2">Stop-loss 2:</label>
          <input
            id="stopLoss2"
            type="checkbox"
            checked={stopLoss2}
            onChange={(e) => setStopLoss2(e.target.checked)}
          />
        </div>
        {stopLoss2 && (
          <>
            <div>
              <div>
                <label>Amount out:</label>
              </div>
              <div>
                <input
                  type="text"
                  value={stopLoss2AmountOut}
                  onChange={(e) => setStopLoss2AmountOut(e.target.value)}
                />
              </div>
            </div>
            <div>
              <div>
                <label htmlFor="stopLoss2Moving">Moving:</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="stopLoss2Moving"
                  value={stopLoss2Moving}
                  onChange={(e) => setStopLoss2Moving(e.target.checked)}
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
                  value={stopLoss2Slippage}
                  onChange={(e) =>
                    setStopLoss2Slippage(percent(e.target.value))
                  }
                />
              </div>
              <div>Amount out min: {stopLoss2AmountOutMin}</div>
            </div>
          </>
        )}
      </div>
      <div>
        <div>
          <label htmlFor="activate">Activate:</label>
          <input
            id="activate"
            type="checkbox"
            checked={activate}
            onChange={(e) => setActivate(e.target.checked)}
          />
        </div>
        {activate && (
          <>
            <div>
              <div>
                <label>Amount out:</label>
              </div>
              <div>
                <input
                  type="text"
                  value={activateAmountOut}
                  onChange={(e) => setActivateAmountOut(e.target.value)}
                />
              </div>
            </div>
            <div>
              <div>
                <label>Direction:</label>
              </div>
              <div>
                <div>
                  <label htmlFor="directionGt" style={{ display: "inline" }}>
                    Great
                  </label>{" "}
                  <input
                    type="radio"
                    name="direction"
                    id="directionGt"
                    checked={activateDirection === "gt"}
                    onChange={(e) => setActivateDirection("gt")}
                  />
                </div>
                <div>
                  <label htmlFor="directionLt" style={{ display: "inline" }}>
                    Less
                  </label>{" "}
                  <input
                    type="radio"
                    name="direction"
                    id="directionLt"
                    checked={activateDirection === "lt"}
                    onChange={(e) => setActivateDirection("lt")}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <div>
        <button
          onClick={onUpdate}
          disabled={!orderId || (!stopLoss && !takeProfit)}
        >
          Send
        </button>
      </div>
      {error === "" || <div style={{ color: "red" }}>{error}</div>}
      {updateOrderTx !== null && (
        <ReactJsonWrap>
          <ReactJson
            src={JSON.parse(JSON.stringify(updateOrderTx))}
            collapsed={1}
          />
        </ReactJsonWrap>
      )}
      {updateOrderCallData !== null && (
        <ReactJsonWrap>
          <ReactJson src={updateOrderCallData} collapsed={1} />
        </ReactJsonWrap>
      )}
    </div>
  );
}

export function CancelOrder({ handlerAdapter }) {
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState("");
  const [tx, setTx] = useState(null);

  const onCancel = async () => {
    if (Number.isNaN(orderId)) {
      return setError(`Invalid order id: "${orderId}"`);
    }

    setError("");
    setTx(null);
    if (!handlerAdapter) return;

    const canCancelOrder = await handlerAdapter.methods.canCancelOrder(orderId);
    if (canCancelOrder instanceof Error) {
      return setError(canCancelOrder.message);
    }

    const { tx } = await handlerAdapter.methods.cancelOrder(orderId);
    setTx(tx);
  };

  return (
    <div>
      <div>
        <div>
          <label>Order id:</label>
        </div>
        <div>
          <input
            type="text"
            placeholder="..."
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />
        </div>
      </div>
      <div>
        <button onClick={onCancel} disabled={orderId === ""}>
          Send
        </button>
      </div>
      {error === "" || <div style={{ color: "red" }}>{error}</div>}
      {tx !== null && (
        <ReactJsonWrap>
          <ReactJson src={JSON.parse(JSON.stringify(tx))} collapsed={1} />
        </ReactJsonWrap>
      )}
    </div>
  );
}

export function CloseOrder({ handlerAdapter }) {
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState("");
  const [tx, setTx] = useState(null);

  const onClose = async () => {
    if (Number.isNaN(orderId)) {
      return setError(`Invalid order id: "${orderId}"`);
    }

    setError("");
    setTx(null);
    if (!handlerAdapter) return;

    const { tx } = await handlerAdapter.methods.emergencyHandleOrder(
      orderId,
      dayjs().add(300, "seconds").toDate()
    );
    setTx(tx);
  };

  return (
    <div>
      <div>
        <div>
          <label>Order id:</label>
        </div>
        <div>
          <input
            type="text"
            placeholder="..."
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />
        </div>
      </div>
      <div>
        <button onClick={onClose} disabled={orderId === ""}>
          Send
        </button>
      </div>
      {error === "" || <div style={{ color: "red" }}>{error}</div>}
      {tx !== null && (
        <ReactJsonWrap>
          <ReactJson src={JSON.parse(JSON.stringify(tx))} collapsed={1} />
        </ReactJsonWrap>
      )}
    </div>
  );
}

export function SwapHandler({ signer, routerAdapter, adapters, searchParams }) {
  const [error, setError] = useState("");
  const [handlerAddress, setHandlerAddress] = useState(
    searchParams.get("handler") ?? ""
  );
  const [handlerAdapter, setHandlerAdapter] = useState(null);
  const [actionPanel, setActionPanel] = useState("");

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

  const useOnActivePanel = (panel) => (e) => {
    if (panel === actionPanel) setActionPanel("");
    else setActionPanel(panel);
    e.preventDefault();
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
            <h3>
              <a href="" onClick={useOnActivePanel("createOrder")}>
                Create order
              </a>
            </h3>
          </div>
          {actionPanel === "createOrder" && (
            <CreateOrder
              routerAdapter={routerAdapter}
              handlerAdapter={handlerAdapter}
            />
          )}
          <div>
            <h3>
              <a href="" onClick={useOnActivePanel("updateOrder")}>
                Update order
              </a>
            </h3>
          </div>
          {actionPanel === "updateOrder" && (
            <UpdateOrder handlerAdapter={handlerAdapter} />
          )}
          <div>
            <h3>
              <a href="" onClick={useOnActivePanel("cancelOrder")}>
                Cancel order
              </a>
            </h3>
          </div>
          {actionPanel === "cancelOrder" && (
            <CancelOrder handlerAdapter={handlerAdapter} />
          )}
          <div>
            <h3>
              <a href="" onClick={useOnActivePanel("closeOrder")}>
                Close order
              </a>
            </h3>
          </div>
          {actionPanel === "closeOrder" && (
            <CloseOrder handlerAdapter={handlerAdapter} />
          )}
        </div>
      )}
    </div>
  );
}

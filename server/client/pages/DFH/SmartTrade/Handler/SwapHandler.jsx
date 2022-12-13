import React, { useEffect, useReducer, useState } from "react";
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

function routeReducer(state, action) {
  switch (action.type) {
    case "changeAmountOut":
      return {
        ...state,
        amountOut: action.value,
        amountOutMin: calcSlippage(action.value, state.slippage).toString(10),
        price: new BN(action.value).div(action.amountIn).toString(10),
      };
    case "changeMoving":
      return { ...state, moving: action.value };
    case "changeSlippage":
      return {
        ...state,
        slippage: action.value,
        amountOutMin: calcSlippage(state.amountOut, action.value).toString(10),
      };
    case "changeActivationEnabled":
      return { ...state, activationEnabled: action.value };
    case "changeActivationAmountOut":
      return { ...state, activationAmountOut: action.value };
    case "changeActivationDirection":
      return { ...state, activationDirection: action.value };
  }
}

const routeInitState = {
  amountOut: "0",
  moving: "",
  slippage: "1",
  amountOutMin: "0",
  price: "0",
  activationEnabled: false,
  activationAmountOut: "0",
  activationDirection: "gt",
};

const routeToAdapterInput = ({
  amountOut,
  moving,
  slippage,
  activationEnabled,
  activationAmountOut,
  activationDirection,
}) => ({
  amountOut,
  moving,
  slippage,
  activation: activationEnabled
    ? {
        amountOut: activationAmountOut,
        direction: activationDirection,
      }
    : null,
});

function ActivationInput({ id, state: [state, dispatch] }) {
  return (
    <div className="block">
      <div>
        <div>
          <label
            htmlFor={`${id}-activation-directionGt`}
            style={{ display: "inline" }}
          >
            Great
          </label>{" "}
          <input
            type="radio"
            name={`${id}-activation-directionGt`}
            id={`${id}-activation-directionGt`}
            checked={state.activationDirection === "gt"}
            onChange={() =>
              dispatch({
                type: "changeActivationDirection",
                value: "gt",
              })
            }
          />
        </div>
        <div>
          <label
            htmlFor={`${id}-activation-directionLt`}
            style={{ display: "inline" }}
          >
            Less
          </label>{" "}
          <input
            type="radio"
            name={`${id}-activation-directionLt`}
            id={`${id}-activation-directionLt`}
            checked={state.activationDirection === "lt"}
            onChange={() =>
              dispatch({
                type: "changeActivationDirection",
                value: "lt",
              })
            }
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
            value={state.activationAmountOut}
            onChange={(e) =>
              dispatch({
                type: "changeActivationAmountOut",
                value: e.target.value,
              })
            }
          />
        </div>
      </div>
    </div>
  );
}

function RouteInput({ id, amountIn, state: [state, dispatch] }) {
  return (
    <div className="block">
      <div>
        <div>
          <label>Amount out:</label>
        </div>
        <div>
          <input
            type="text"
            value={state.amountOut}
            onChange={(e) =>
              dispatch({
                type: "changeAmountOut",
                value: e.target.value,
                amountIn,
              })
            }
          />
        </div>
      </div>
      <div>
        <div>
          <label>Moving:</label>
        </div>
        <div>
          <input
            type="text"
            value={state.moving}
            onChange={(e) =>
              dispatch({
                type: "changeMoving",
                value: e.target.value,
                amountIn,
              })
            }
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
            value={state.slippage}
            onChange={(e) =>
              dispatch({
                type: "changeSlippage",
                value: percent(e.target.value),
              })
            }
          />
        </div>
        <div>Amount out min: {state.amountOutMin}</div>
        {amountIn !== "0" && <div>Price: {state.price}</div>}
      </div>
      <div className="checkbox">
        <label htmlFor={`${id}-activationEnable`}>Activation:</label>{" "}
        <input
          id={`${id}-activationEnable`}
          type="checkbox"
          checked={state.activationEnabled}
          onChange={(e) =>
            dispatch({
              type: "changeActivationEnabled",
              value: e.target.checked,
            })
          }
        />
      </div>
      {state.activationEnabled && (
        <ActivationInput id={id} state={[state, dispatch]} />
      )}
    </div>
  );
}

export function CreateOrder({ routerAdapter, handlerAdapter }) {
  const [error, setError] = useState("");
  const [exchangeAddress, setExchangeAddress] = useState("");
  const [path, setPath] = useState([]);
  const [amountIn, setAmountIn] = useState("100");
  const [isTakeProfitEnabled, setTakeProfitEnabled] = useState(false);
  const [takeProfit, takeProfitDispatch] = useReducer(
    routeReducer,
    routeInitState
  );
  const [isStopLossEnabled, setStopLossEnable] = useState(false);
  const [stopLoss, stopLossDispatch] = useReducer(routeReducer, routeInitState);
  const [isStopLoss2Enabled, setStopLoss2Enable] = useState(false);
  const [stopLoss2, stopLoss2Dispatch] = useReducer(
    routeReducer,
    routeInitState
  );
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
    if (isStopLossEnabled) {
      if (Number.isNaN(Number(stopLoss.amountOut))) {
        return setError(
          `Invalid stop loss amount out: "${stopLoss.amountOut}"`
        );
      }
      if (Number.isNaN(Number(stopLoss.slippage))) {
        return setError(`Invalid stop loss slippage: "${stopLoss.slippage}"`);
      }
    }
    if (isStopLoss2Enabled) {
      if (Number.isNaN(Number(stopLoss2.amountOut))) {
        return setError(
          `Invalid stop loss 2 amount out: "${stopLoss2.amountOut}"`
        );
      }
      if (Number.isNaN(Number(stopLoss2.slippage))) {
        return setError(
          `Invalid stop loss 2 slippage: "${stopLoss2.slippage}"`
        );
      }
    }
    if (isTakeProfitEnabled) {
      if (Number.isNaN(Number(takeProfit.amountOut))) {
        return setError(
          `Invalid take profit amount out: "${takeProfit.amountOut}"`
        );
      }
      if (Number.isNaN(Number(takeProfit.slippage))) {
        return setError(
          `Invalid take profit slippage: "${takeProfit.slippage}"`
        );
      }
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
      isStopLossEnabled ? routeToAdapterInput(stopLoss) : null,
      isStopLoss2Enabled ? routeToAdapterInput(stopLoss2) : null,
      isTakeProfitEnabled ? routeToAdapterInput(takeProfit) : null,
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
        <div className="checkbox">
          <label htmlFor="takeProfit">Take profit:</label>{" "}
          <input
            id="takeProfit"
            type="checkbox"
            checked={isTakeProfitEnabled}
            onChange={(e) => setTakeProfitEnabled(e.target.checked)}
          />
        </div>
        {isTakeProfitEnabled && (
          <RouteInput
            id="takeProfit"
            amountIn={amountIn}
            state={[takeProfit, takeProfitDispatch]}
          />
        )}
      </div>
      <div>
        <div className="checkbox">
          <label htmlFor="stopLoss">Stop-loss:</label>{" "}
          <input
            id="stopLoss"
            type="checkbox"
            checked={isStopLossEnabled}
            onChange={(e) => setStopLossEnable(e.target.checked)}
          />
        </div>
        {isStopLossEnabled && (
          <RouteInput
            id="stopLoss"
            amountIn={amountIn}
            state={[stopLoss, stopLossDispatch]}
          />
        )}
      </div>
      <div>
        <div className="checkbox">
          <label htmlFor="stopLoss2">Stop-loss 2:</label>{" "}
          <input
            id="stopLoss2"
            type="checkbox"
            checked={isStopLoss2Enabled}
            onChange={(e) => setStopLoss2Enable(e.target.checked)}
          />
        </div>
        {isStopLoss2Enabled && (
          <RouteInput
            id="stopLoss2"
            amountIn={amountIn}
            state={[stopLoss2, stopLoss2Dispatch]}
          />
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
          onClick={onCreate}
          disabled={!isStopLossEnabled && !isTakeProfitEnabled}
        >
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
  const [isTakeProfitEnabled, setTakeProfitEnable] = useState(false);
  const [takeProfit, takeProfitDispatch] = useReducer(
    routeReducer,
    routeInitState
  );
  const [isStopLossEnabled, setStopLossEnable] = useState(false);
  const [stopLoss, stopLossDispatch] = useReducer(routeReducer, routeInitState);
  const [isStopLoss2Enabled, setStopLoss2Enable] = useState(false);
  const [stopLoss2, stopLoss2Dispatch] = useReducer(
    routeReducer,
    routeInitState
  );
  const [updateOrderTx, setUpdateOrderTx] = useState(null);
  const [updateOrderCallData, setUpdateOrderCallData] = useState(null);

  const onUpdate = async () => {
    if (Number.isNaN(orderId)) {
      return setError(`Invalid order id: "${orderId}"`);
    }

    setError("");
    if (isStopLossEnabled) {
      if (Number.isNaN(Number(stopLoss.amountOut))) {
        return setError(
          `Invalid stop loss amount out: "${stopLoss.amountOut}"`
        );
      }
      if (Number.isNaN(Number(stopLoss.slippage))) {
        return setError(`Invalid stop loss slippage: "${stopLoss.slippage}"`);
      }
    }
    if (isStopLoss2Enabled) {
      if (Number.isNaN(Number(stopLoss2.amountOut))) {
        return setError(
          `Invalid stop loss 2 amount out: "${stopLoss2.amountOut}"`
        );
      }
      if (Number.isNaN(Number(stopLoss2.slippage))) {
        return setError(
          `Invalid stop loss 2 slippage: "${stopLoss2.slippage}"`
        );
      }
    }
    if (isTakeProfitEnabled) {
      if (Number.isNaN(Number(takeProfit.amountOut))) {
        return setError(
          `Invalid take profit amount out: "${takeProfit.amountOut}"`
        );
      }
      if (Number.isNaN(Number(takeProfit.slippage))) {
        return setError(
          `Invalid take profit slippage: "${takeProfit.slippage}"`
        );
      }
    }

    const data = await handlerAdapter.methods.updateOrder(
      orderId,
      isStopLossEnabled ? routeToAdapterInput(stopLoss) : null,
      isStopLoss2Enabled ? routeToAdapterInput(stopLoss2) : null,
      isTakeProfitEnabled ? routeToAdapterInput(takeProfit) : null
    );
    setUpdateOrderTx(data.tx);
    setUpdateOrderCallData({
      callDataRaw: data.callDataRaw,
      callData: data.callData,
    });
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
        <div>
          <label htmlFor="takeProfit">Take profit:</label>
          <input
            id="takeProfit"
            type="checkbox"
            checked={isTakeProfitEnabled}
            onChange={(e) => setTakeProfitEnable(e.target.checked)}
          />
        </div>
        {isTakeProfitEnabled && (
          <RouteInput
            id="takeProfit"
            amountIn="0"
            state={[takeProfit, takeProfitDispatch]}
          />
        )}
      </div>
      <div>
        <div>
          <label htmlFor="stopLoss">Stop-loss:</label>
          <input
            id="stopLoss"
            type="checkbox"
            checked={isStopLossEnabled}
            onChange={(e) => setStopLossEnable(e.target.checked)}
          />
        </div>
        {isStopLossEnabled && (
          <RouteInput
            id="stopLoss"
            amountIn="0"
            state={[stopLoss, stopLossDispatch]}
          />
        )}
      </div>
      <div>
        <div>
          <label htmlFor="stopLoss2">Stop-loss 2:</label>
          <input
            id="stopLoss2"
            type="checkbox"
            checked={isStopLoss2Enabled}
            onChange={(e) => setStopLoss2Enable(e.target.checked)}
          />
        </div>
        {isStopLoss2Enabled && (
          <RouteInput
            id="stopLoss2"
            amountIn="0"
            state={[stopLoss2, stopLoss2Dispatch]}
          />
        )}
      </div>
      <div>
        <button
          onClick={onUpdate}
          disabled={!orderId || (!isStopLossEnabled && !isTakeProfitEnabled)}
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

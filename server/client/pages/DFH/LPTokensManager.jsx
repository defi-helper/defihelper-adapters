import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { useQueryParams } from "../../common/useQueryParams";
import { useDebounce } from "react-use";
import { useProvider } from "../../common/ether";
import * as adaptersGateway from "../../common/adapter";

export function LPTokensManagerPage() {
  const searchParams = useQueryParams();
  const [, signer] = useProvider();
  const [error, setError] = useState("");
  const [automateAddress, setAutomateAddress] = useState(
    searchParams.get("automate") ?? ""
  );
  const [liquidityRouterAddress, setLiquidityRouterAddress] = useState(
    searchParams.get("router") ?? ""
  );
  const [pairAddress, setPairAddress] = useState(
    searchParams.get("pair") ?? ""
  );
  const [buyLiquidityAdapter, setBuyLiquidityAdapter] = useState(null);
  const [sellLiquidityAdapter, setSellLiquidityAdapter] = useState(null);
  const [buyInToken, setBuyInToken] = useState("");
  const [buyBalance, setBuyBalance] = useState("0");
  const [buyAmount, setBuyAmount] = useState("0");
  const [buySlippage, setBuySlippage] = useState("5");
  const [buyProcess, setBuyProcess] = useState(false);
  const [buyError, setBuyError] = useState("");
  const [buyETHBalance, setBuyETHBalance] = useState("0");
  const [buyETHAmount, setBuyETHAmount] = useState("0");
  const [buyETHSlippage, setBuyETHSlippage] = useState("5");
  const [buyETHProcess, setBuyETHProcess] = useState(false);
  const [buyETHError, setBuyETHError] = useState("");
  const [sellOutToken, setSellOutToken] = useState("");
  const [sellBalance, setSellBalance] = useState("0");
  const [sellAmount, setSellAmount] = useState("0");
  const [sellSlippage, setSellSlippage] = useState("5");
  const [sellProcess, setSellProcess] = useState(false);
  const [sellError, setSellError] = useState("");
  const [sellETHAmount, setSellETHAmount] = useState("0");
  const [sellETHSlippage, setSellETHSlippage] = useState("5");
  const [sellETHProcess, setSellETHProcess] = useState(false);
  const [sellETHError, setSellETHError] = useState("");

  const fetchAdapter = async () => {
    const adapter = await adaptersGateway.load("dfh");
    const [buyLiquidity, sellLiquidity] = await Promise.all([
      adapter.automates.buyLiquidity(signer, automateAddress, {
        router: liquidityRouterAddress,
        pair: pairAddress,
      }),
      adapter.automates.sellLiquidity(signer, automateAddress, {
        router: liquidityRouterAddress,
        pair: pairAddress,
      }),
    ]);
    setBuyLiquidityAdapter(buyLiquidity);
    setSellLiquidityAdapter(sellLiquidity);
  };

  const fetchBuyBalance = async () => {
    if (!buyLiquidityAdapter) return;

    setBuyBalance(await buyLiquidityAdapter.methods.balanceOf(buyInToken));
  };

  const fetchBuyETHBalance = async () => {
    if (!buyLiquidityAdapter) return;

    setBuyETHBalance(await buyLiquidityAdapter.methods.balanceETHOf());
  };

  const fetchSellBalance = async () => {
    if (!sellLiquidityAdapter) return;

    setSellBalance(await sellLiquidityAdapter.methods.balanceOf());
  };

  useEffect(() => {
    if (
      !signer ||
      !ethers.utils.isAddress(automateAddress) ||
      !ethers.utils.isAddress(liquidityRouterAddress) ||
      !ethers.utils.isAddress(pairAddress)
    ) {
      return;
    }

    setBuyLiquidityAdapter(null);
    fetchAdapter();
  }, [signer, automateAddress, liquidityRouterAddress, pairAddress]);

  useEffect(() => {
    if (buyLiquidityAdapter === null) return;
    if (!ethers.utils.isAddress(buyInToken)) {
      return;
    }
    fetchBuyBalance();
  }, [buyInToken]);

  useEffect(() => {
    if (buyLiquidityAdapter === null) return;
    fetchBuyETHBalance();
  }, [buyLiquidityAdapter]);

  useEffect(() => {
    if (sellLiquidityAdapter === null) return;
    fetchSellBalance();
  }, [sellLiquidityAdapter]);

  useDebounce(
    () => {
      if (
        !sellLiquidityAdapter ||
        !ethers.utils.isAddress(sellOutToken) ||
        Number.isNaN(Number(sellAmount))
      ) {
        return;
      }
      if (sellAmount === "0") return;

      sellLiquidityAdapter.methods
        .amountOut(sellOutToken, sellAmount)
        .then((v) => console.info(`Amount out: ${v}`));
    },
    500,
    [sellAmount, sellOutToken]
  );

  useDebounce(
    () => {
      if (!sellLiquidityAdapter || Number.isNaN(Number(sellETHAmount))) {
        return;
      }
      if (sellETHAmount === "0") return;

      sellLiquidityAdapter.methods
        .amountOut("0x0000000000000000000000000000000000000000", sellETHAmount)
        .then((v) => console.info(`ETH Amount out: ${v}`));
    },
    500,
    [sellETHAmount]
  );

  const onBuyApprove = async () => {
    if (!buyLiquidityAdapter || !ethers.utils.isAddress(buyInToken)) return;

    setBuyProcess(true);
    try {
      const res = await buyLiquidityAdapter.methods.approve(
        buyInToken,
        buyAmount
      );
      if (res instanceof Error) {
        return setError(res.message);
      }
    } finally {
      setBuyProcess(false);
    }
  };

  const onBuy = async () => {
    if (!buyLiquidityAdapter || !ethers.utils.isAddress(buyInToken)) return;

    setBuyProcess(true);
    try {
      const canBuy = await buyLiquidityAdapter.methods.canBuy(
        buyInToken,
        buyAmount
      );
      if (canBuy instanceof Error) {
        setBuyError(canBuy.message);
        setBuyProcess(false);
        return;
      }

      const res = await buyLiquidityAdapter.methods.buy(
        buyInToken,
        buyAmount,
        buySlippage,
        300
      );
      if (res instanceof Error) {
        return setError(res.message);
      }
    } finally {
      setBuyProcess(false);
    }
  };

  const onBuyETH = async () => {
    if (!buyLiquidityAdapter) return;

    setBuyETHProcess(true);
    try {
      const canBuy = await buyLiquidityAdapter.methods.canBuyETH(buyETHAmount);
      if (canBuy instanceof Error) {
        setBuyETHError(canBuy.message);
        setBuyETHProcess(false);
        return;
      }

      const res = await buyLiquidityAdapter.methods.buyETH(
        buyETHAmount,
        buyETHSlippage,
        300
      );
      if (res instanceof Error) {
        return setError(res.message);
      }
    } finally {
      setBuyETHProcess(false);
    }
  };

  const onSellApprove = async () => {
    if (!sellLiquidityAdapter) return;

    setSellProcess(true);
    try {
      const res = await sellLiquidityAdapter.methods.approve(sellAmount);
      if (res instanceof Error) {
        return setError(res.message);
      }
    } finally {
      setSellProcess(false);
    }
  };

  const onSell = async () => {
    if (!sellLiquidityAdapter || !ethers.utils.isAddress(sellOutToken)) return;

    setSellProcess(true);
    try {
      const canSell = await sellLiquidityAdapter.methods.canSell(sellAmount);
      if (canSell instanceof Error) {
        setSellError(canSell.message);
        setSellProcess(false);
        return;
      }

      const res = await sellLiquidityAdapter.methods.sell(
        sellOutToken,
        sellAmount,
        sellSlippage,
        300
      );
      if (res instanceof Error) {
        return setError(res.message);
      }
    } finally {
      setSellProcess(false);
    }
  };

  const onSellETHApprove = async () => {
    if (!sellLiquidityAdapter) return;

    setSellProcess(true);
    try {
      const res = await sellLiquidityAdapter.methods.approve(sellETHAmount);
      if (res instanceof Error) {
        return setError(res.message);
      }
    } finally {
      setSellProcess(false);
    }
  };

  const onSellETH = async () => {
    if (!sellLiquidityAdapter) return;

    setSellETHProcess(true);
    try {
      const canSell = await sellLiquidityAdapter.methods.canSell(sellETHAmount);
      if (canSell instanceof Error) {
        setSellETHError(canSell.message);
        setSellETHProcess(false);
        return;
      }

      const res = await sellLiquidityAdapter.methods.sellETH(
        sellETHAmount,
        sellETHSlippage,
        300
      );
      if (res instanceof Error) {
        return setError(res.message);
      }
    } finally {
      setSellETHProcess(false);
    }
  };

  return (
    <div className="container">
      <h2>DeFiHelper LP tokens manager</h2>
      {error === "" || <div style={{ color: "red" }}>{error}</div>}
      <div>
        <div>
          <label>LP tokens manager:</label>
          <input
            type="text"
            placeholder="0x..."
            value={automateAddress}
            onChange={(e) => setAutomateAddress(e.target.value)}
          />
        </div>
        <div>
          <label>Liquidity router:</label>
          <input
            type="text"
            placeholder="0x..."
            value={liquidityRouterAddress}
            onChange={(e) => setLiquidityRouterAddress(e.target.value)}
          />
        </div>
        <div>
          <label>Pair:</label>
          <input
            type="text"
            placeholder="0x..."
            value={pairAddress}
            onChange={(e) => setPairAddress(e.target.value)}
          />
        </div>
      </div>
      {buyLiquidityAdapter === null ? (
        <div>Loading...</div>
      ) : (
        <>
          <div>
            <h3>Buy:</h3>
            <div>
              <label>In token:</label>
              <input
                type="text"
                placeholder="0x..."
                value={buyInToken}
                onChange={(e) => setBuyInToken(e.target.value)}
              />
            </div>
            <div>
              <label>Amount ({buyBalance}):</label>
              <input
                type="text"
                value={buyAmount}
                onChange={(e) => setBuyAmount(e.target.value)}
              />
            </div>
            <div>
              <label>Slippage:</label>
              <select
                value={buySlippage}
                onChange={(e) => setBuySlippage(e.target.value)}
              >
                <option value="1">1%</option>
                <option value="5">5%</option>
                <option value="10">10%</option>
                <option value="20">20%</option>
                <option value="100">100%</option>
              </select>
            </div>
            <div>
              {buyError !== "" && (
                <span style={{ color: "red" }}>{buyError}</span>
              )}
            </div>
            {buyProcess ? (
              <div>Loading...</div>
            ) : (
              <div>
                <button onClick={onBuyApprove}>Approve</button>
                <button onClick={onBuy}>Buy</button>
              </div>
            )}
          </div>
          <div>
            <h3>Buy ETH:</h3>
            <div>
              <label>Amount ({buyETHBalance}):</label>
              <input
                type="text"
                value={buyETHAmount}
                onChange={(e) => setBuyETHAmount(e.target.value)}
              />
            </div>
            <div>
              <label>Slippage:</label>
              <select
                value={buyETHSlippage}
                onChange={(e) => setBuyETHSlippage(e.target.value)}
              >
                <option value="1">1%</option>
                <option value="5">5%</option>
                <option value="10">10%</option>
                <option value="20">20%</option>
                <option value="100">100%</option>
              </select>
            </div>
            <div>
              {buyETHError !== "" && (
                <span style={{ color: "red" }}>{buyETHError}</span>
              )}
            </div>
            {buyETHProcess ? (
              <div>Loading...</div>
            ) : (
              <div>
                <button onClick={onBuyETH}>Buy</button>
              </div>
            )}
          </div>
        </>
      )}
      {sellLiquidityAdapter === null ? (
        <div>Loading...</div>
      ) : (
        <>
          <div>
            <h3>Sell:</h3>
            <div>
              <label>Out token:</label>
              <input
                type="text"
                placeholder="0x..."
                value={sellOutToken}
                onChange={(e) => setSellOutToken(e.target.value)}
              />
            </div>
            <div>
              <label>Amount ({sellBalance}):</label>
              <input
                type="text"
                value={sellAmount}
                onChange={(e) => setSellAmount(e.target.value)}
              />
            </div>
            <div>
              <label>Slippage:</label>
              <select
                value={sellSlippage}
                onChange={(e) => setSellSlippage(e.target.value)}
              >
                <option value="1">1%</option>
                <option value="5">5%</option>
                <option value="10">10%</option>
                <option value="20">20%</option>
                <option value="100">100%</option>
              </select>
            </div>
            <div>
              {sellError !== "" && (
                <span style={{ color: "red" }}>{sellError}</span>
              )}
            </div>
            {sellProcess ? (
              <div>Loading...</div>
            ) : (
              <div>
                <button onClick={onSellApprove}>Approve</button>
                <button onClick={onSell}>Sell</button>
              </div>
            )}
          </div>
          <div>
            <h3>Sell ETH:</h3>
            <div>
              <label>Amount ({sellBalance}):</label>
              <input
                type="text"
                value={sellETHAmount}
                onChange={(e) => setSellETHAmount(e.target.value)}
              />
            </div>
            <div>
              <label>Slippage:</label>
              <select
                value={sellETHSlippage}
                onChange={(e) => setSellETHSlippage(e.target.value)}
              >
                <option value="1">1%</option>
                <option value="5">5%</option>
                <option value="10">10%</option>
                <option value="20">20%</option>
                <option value="100">100%</option>
              </select>
            </div>
            <div>
              {sellETHError !== "" && (
                <span style={{ color: "red" }}>{sellETHError}</span>
              )}
            </div>
            {sellETHProcess ? (
              <div>Loading...</div>
            ) : (
              <div>
                <button onClick={onSellETHApprove}>Approve</button>
                <button onClick={onSellETH}>Sell</button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

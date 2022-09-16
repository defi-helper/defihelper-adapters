import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { useQueryParams } from "../../common/useQueryParams";
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
  const [sellOutToken, setSellOutToken] = useState("");
  const [sellBalance, setSellBalance] = useState("0");
  const [sellAmount, setSellAmount] = useState("0");
  const [sellSlippage, setSellSlippage] = useState("5");
  const [sellProcess, setSellProcess] = useState(false);

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
    if (sellLiquidityAdapter === null) return;
    if (!ethers.utils.isAddress(sellOutToken)) {
      return;
    }
    fetchSellBalance();
  }, [sellOutToken]);

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

  const onSellApprove = async () => {
    if (!sellLiquidityAdapter || !ethers.utils.isAddress(sellOutToken)) return;

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
          {buyProcess ? (
            <div>Loading...</div>
          ) : (
            <div>
              <button onClick={onBuyApprove}>Approve</button>
              <button onClick={onBuy}>Buy</button>
            </div>
          )}
        </div>
      )}
      {sellLiquidityAdapter === null ? (
        <div>Loading...</div>
      ) : (
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
          {sellProcess ? (
            <div>Loading...</div>
          ) : (
            <div>
              <button onClick={onSellApprove}>Approve</button>
              <button onClick={onSell}>Sell</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

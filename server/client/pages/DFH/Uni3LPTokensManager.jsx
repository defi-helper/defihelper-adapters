import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useQueryParams } from "../../common/useQueryParams";
import { useProvider } from "../../common/ether";
import * as adaptersGateway from "../../common/adapter";

export function Uni3LPTokensManagerPage() {
  const searchParams = useQueryParams();
  const [, signer] = useProvider();
  const [error, setError] = useState("");
  const [buyLiquidityAdapter, setBuyLiquidityAdapter] = useState(null);
  const [sellLiquidityAdapter, setSellLiquidityAdapter] = useState(null);
  const [automateAddress, setAutomateAddress] = useState(
    searchParams.get("automate") ?? ""
  );
  const [positionManagerAddress, setPositionManagerAddress] = useState(
    searchParams.get("position-manager") ??
      "0xC36442b4a4522E871399CD717aBDD847Ab11FE88"
  );
  const [routerAddress, setRouterAddress] = useState(
    searchParams.get("router") ?? "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45"
  );
  const [autorouteURL, setAutorouteURL] = useState(
    searchParams.get("autoroute") ?? ""
  );
  const [quoterAddress, setQuoterAddress] = useState(
    searchParams.get("quoter") ?? "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6"
  );
  const [poolAddress, setPoolAddress] = useState(
    searchParams.get("pool") ?? ""
  );

  const fetchBuyAdapter = async () => {
    const adapter = await adaptersGateway.load("dfh");
    setBuyLiquidityAdapter(
      await adapter.automates.uni3.buyLiquidity(signer, automateAddress, {
        positionManager: positionManagerAddress,
        router: routerAddress,
        autorouteURL,
        quoter: quoterAddress,
        pool: poolAddress,
      })
    );
  };

  const fetchSellAdapter = async () => {
    const adapter = await adaptersGateway.load("dfh");
    setSellLiquidityAdapter(
      await adapter.automates.uni3.sellLiquidity(signer, automateAddress, {
        positionManager: positionManagerAddress,
        router: routerAddress,
        autorouteURL,
        quoter: quoterAddress,
        pool: poolAddress,
      })
    );
  };

  const exportMethods = (methods) => {
    console.info("Use methods object for call adapter");
    console.info(`available methods: ${Object.keys(methods).join(", ")}`);
    window.methods = methods;
  };

  React.useEffect(() => {
    if (buyLiquidityAdapter === null) return;
    exportMethods(buyLiquidityAdapter.methods);
  }, [buyLiquidityAdapter]);

  React.useEffect(() => {
    if (sellLiquidityAdapter === null) return;
    exportMethods(sellLiquidityAdapter.methods);
  }, [sellLiquidityAdapter]);

  return (
    <div className="container">
      <h2>DeFiHelper Uni3 LP tokens manager</h2>
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
          <label>Position manager:</label>
          <input
            type="text"
            placeholder="0x..."
            value={positionManagerAddress}
            onChange={(e) => setPositionManagerAddress(e.target.value)}
          />
        </div>
        <div>
          <label>Liquidity router:</label>
          <input
            type="text"
            placeholder="0x..."
            value={routerAddress}
            onChange={(e) => setRouterAddress(e.target.value)}
          />
        </div>
        <div>
          <label>Autoroute URL:</label>
          <input
            type="text"
            placeholder="https://"
            value={autorouteURL}
            onChange={(e) => setAutorouteURL(e.target.value)}
          />
        </div>
        <div>
          <label>Quoter:</label>
          <input
            type="text"
            placeholder="0x..."
            value={quoterAddress}
            onChange={(e) => setQuoterAddress(e.target.value)}
          />
        </div>
        <div>
          <label>Pool:</label>
          <input
            type="text"
            placeholder="0x..."
            value={poolAddress}
            onChange={(e) => setPoolAddress(e.target.value)}
          />
        </div>
        <div>
          <button onClick={fetchBuyAdapter}>Load buy adapter</button>
          <button onClick={fetchSellAdapter}>Load sell adapter</button>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useProvider } from "../../common/ether";
import * as adaptersGateway from "../../common/adapter";

export function SmartTradePage() {
  const [provider, signer] = useProvider();
  const [adapters, setAdapters] = useState(null);
  const [routerAdapter, setRouterAdapter] = useState(null);

  const onAdaptersReload = async () => {
    setAdapters(null);
    setAdapters(await adaptersGateway.load("dfh"));
  };

  const onRouterAdapterReload = async () => {
    if (!signer || !adapters) return;

    setRouterAdapter(adapters.automates.smartTrade.router(signer, ""));
  };

  useEffect(onAdaptersReload, []);
  useEffect(onRouterAdapterReload, [signer, adapters]);

  return (
    <div className="container">
      <h2>DeFiHelper SmartTrade</h2>
    </div>
  );
}

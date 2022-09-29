import React from "react";
import { MockHandler } from "./MockHandler";
import { SwapHandler } from "./SwapHandler";

export function Handler({
  name,
  signer,
  routerAdapter,
  adapters,
  searchParams,
}) {
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
        routerAdapter={routerAdapter}
        searchParams={searchParams}
      />
    </div>
  );
}

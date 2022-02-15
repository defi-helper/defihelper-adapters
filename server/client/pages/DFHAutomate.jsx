import React, { useEffect } from "react";
import ReactJson from "react-json-view";
import { ReactJsonWrap } from "../components/ReactJsonWrap";
import { useProvider } from "../common/ether";
import { AdapterModalSteps } from "../components";
import networks from "@defihelper/networks/contracts.json";
import * as adaptersGateway from "../common/adapter";
import { Button } from "../components/Button";

export function DFHAutomate() {
  const [provider, signer] = useProvider();
  const [buyLiquidityAddress, setBuyLiquidityAddress] = React.useState(null);
  const [automateReload, setAutomateReload] = React.useState(false);
  const [modalSteps, setModalSteps] = React.useState([]);
  const [modalResult, setModalResult] = React.useState(null);

  const resolveBuyLiquidityAddress = async () => {
    const networkId = await provider
      .getNetwork()
      .then(({ chainId }) => String(chainId));
    const address = networks[networkId]?.BuyLiquidity?.address;
    if (address === undefined)
      throw new Error('Automate "BuyLiquidity" for this network not found');
    setBuyLiquidityAddress(address);
  };

  const onAutomateReload = async () => {
    setAutomateReload(true);
    setModalSteps([]);

    const adapter = await adaptersGateway.load("dfh");
    await adapter.automates
      .buyLiquidity(signer, buyLiquidityAddress, {
        tokens: [
          {
            address: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
            symbol: "WAVAX",
          },
        ],
        router: "0x60aE616a2155Ee3d9A68541Ba4544862310933d4",
        pair: "0x41f3092d6dd8db25ec0f7395f56cac107ecb7a12",
      })
      .then(({ buy }) => setModalSteps(buy));

    setAutomateReload(false);
  };

  useEffect(() => {
    if (provider === null) return;
    resolveBuyLiquidityAddress();
  }, [provider]);

  return (
    <div className="container">
      <h2>DeFiHelper automates</h2>
      <div>
        <Button
          onClick={onAutomateReload}
          loading={automateReload}
          disabled={!buyLiquidityAddress}
        >
          Reload
        </Button>
      </div>
      {!modalSteps.length || (
        <div>
          <h3>Modal</h3>
          <AdapterModalSteps steps={modalSteps} onAction={setModalResult} />
        </div>
      )}
      {modalResult !== null &&
        (typeof modalResult === "object" ? (
          <ReactJsonWrap>
            <ReactJson
              src={JSON.parse(JSON.stringify(modalResult))}
              collapsed={1}
            />
          </ReactJsonWrap>
        ) : (
          <div>{modalResult}</div>
        ))}
    </div>
  );
}

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
            address: "0x0a180a76e4466bf68a7f86fb029bed3cccfaaac5",
            symbol: "WETH",
          },
        ],
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

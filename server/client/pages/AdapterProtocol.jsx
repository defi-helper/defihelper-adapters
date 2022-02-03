import React from "react";
import * as adaptersGateway from "../common/adapter";
import { useProvider as useEthProvider } from "../common/ether";
import { useProvider as useWavesProvider } from "../common/waves";
import { AdapterModalSteps } from "../components";
import ReactJson from "react-json-view";

export function AdapterProtocol(props) {
  const [ethProvider, ethSigner] = useEthProvider();
  const [wavesProvider, wavesSigner] = useWavesProvider();
  const [blockchain, setBlockchain] = React.useState("ethereum");
  const [protocol, setProtocol] = React.useState(null);
  const [currentAdapter, setCurrentAdapter] = React.useState("");
  const [contract, setContract] = React.useState("");
  const [contractReload, setContractReload] = React.useState(false);
  const [contractMetrics, setContractMetrics] = React.useState(null);
  const [wallet, setWallet] = React.useState("");
  const [walletReload, setWalletReload] = React.useState(false);
  const [walletMetrics, setWalletMetrics] = React.useState(null);
  const [actions, setActions] = React.useState(null);
  const [currentAction, setCurrentAction] = React.useState("stake");
  const [actionReload, setActionReload] = React.useState(false);
  const [actionResult, setActionResult] = React.useState(null);
  const [actionSteps, setActionSteps] = React.useState([]);

  React.useEffect(async () => {
    const protocol = await adaptersGateway.load(props.protocol);
    setCurrentAdapter(Object.keys(protocol)[0]);
    setProtocol(protocol);
  }, []);

  const onContractReload = async () => {
    if (protocol === null) return;
    if (contract === "") return;

    setContractReload(true);
    try {
      let metrics = {};
      switch (blockchain) {
        case "ethereum":
          metrics = await protocol[currentAdapter](ethProvider, contract, {
            blockNumber: "latest",
            signer: ethSigner,
          });
          break;
        case "waves":
          metrics = await protocol[currentAdapter](wavesProvider, contract, {
            node: await wavesProvider
              .publicState()
              .then(({ network: { server } }) => server),
          });
          break;
        default:
          throw new Error(`Undefined blockchain "${blockchain}"`);
      }
      setContractMetrics(metrics);
    } catch (e) {
      console.error(e);
    }
    setContractReload(false);
  };

  const onWalletReload = async () => {
    if (protocol === null) return;
    if (contract === "") return;
    if (wallet === "") return;

    setWalletReload(true);
    try {
      const [metrics, actions] = await Promise.all([
        contractMetrics.wallet(wallet),
        contractMetrics.actions(wallet),
      ]);
      setWalletMetrics(metrics);
      setActions(actions);
      setCurrentAction(Object.keys(actions)[0]);
    } catch (e) {
      console.error(e);
    }
    setWalletReload(false);
  };

  const onAction = async () => {
    if (!currentAction) return;

    setActionReload(true);
    setActionSteps([]);
    try {
      setActionSteps(actions[currentAction]);
      setActionResult(null);
    } catch (e) {
      console.error(e);
    }
    setActionReload(false);
  };

  if (protocol === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h2>{props.protocol}</h2>
      <div className="row">
        <div className="column">
          <label>Adapter: </label>
          <select
            value={blockchain}
            onChange={(e) => setBlockchain(e.target.value)}
          >
            {["ethereum", "waves"].map((bc) => (
              <option key={bc} value={bc}>
                {bc}
              </option>
            ))}
          </select>
        </div>
        <div className="column">
          <label>Adapter: </label>
          <select
            value={currentAdapter}
            onChange={(e) => setCurrentAdapter(e.target.value)}
          >
            {Object.keys(protocol).map((adapterName) => (
              <option key={adapterName} value={adapterName}>
                {adapterName}
              </option>
            ))}
          </select>
        </div>
        <div className="column">
          <label>Address: </label>
          <input
            type="text"
            placeholder="0x"
            value={contract}
            onChange={(e) => setContract(e.target.value)}
          />
        </div>
        <div className="column">
          <button
            className="button"
            onClick={onContractReload}
            disabled={contractReload}
          >
            {contractReload ? "Loading" : "Reload"}
          </button>
        </div>
      </div>
      {!contractMetrics || (
        <div>
          <div>
            <ReactJson
              src={JSON.parse(JSON.stringify(contractMetrics))}
              collapsed={1}
            />
          </div>
          <div className="row">
            <div className="column">
              <label>Wallet:</label>
              <input
                type="text"
                placeholder="0x"
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
              />
            </div>
            <div className="column">
              <button
                className="button"
                onClick={onWalletReload}
                disabled={walletReload}
              >
                {walletReload ? "Loading" : "Reload"}
              </button>
            </div>
          </div>
          {!walletMetrics || (
            <div>
              <div>
                <ReactJson
                  src={JSON.parse(JSON.stringify(walletMetrics))}
                  collapsed={1}
                />
              </div>
            </div>
          )}
          {!actions || (
            <div>
              <h3>Action</h3>
              <div className="row">
                <div className="column column-90">
                  <label>Action: </label>
                  <select
                    value={currentAction}
                    onChange={(e) => setCurrentAction(e.target.value)}
                  >
                    {Object.keys(actions).map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="column column-10">
                  <button
                    className="button"
                    onClick={onAction}
                    disabled={actionReload}
                  >
                    Call
                  </button>
                </div>
              </div>
            </div>
          )}
          {!actionSteps.length || (
            <div>
              <h3>Action steps</h3>
              <AdapterModalSteps
                steps={actionSteps}
                onAction={setActionResult}
              />
            </div>
          )}
          {actionResult !== null && <div>{JSON.stringify(actionResult)}</div>}
        </div>
      )}
    </div>
  );
}

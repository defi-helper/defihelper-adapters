import React from "react";
import * as adaptersGateway from "../common/adapter";
import { useProvider } from "../common/ether";
import { createWavesProvider } from "../common/waves";
import ReactJson from "react-json-view";

export function AdapterProtocol(props) {
  const [ethProvider, ethSigner] = useProvider();
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
  const [actionsReload, setActionsReload] = React.useState(false);
  const [currentAction, setCurrentAction] = React.useState("");
  const [actionParams, setActionParams] = React.useState("[]");
  const [actionResult, setActionResult] = React.useState(null);

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
      const bc =
        blockchain === "ethereum" ? ethProvider : await createWavesProvider();
      const params =
        blockchain === "ethereum"
          ? {
              blockNumber: "latest",
              signer: ethSigner,
            }
          : undefined;
      const metrics = await protocol[currentAdapter](bc, contract, params);
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

  const onAction = async (method) => {
    if (currentAction === "") return;

    setActionsReload(true);
    try {
      const action = actions[currentAction];
      const actionResult = await action[method].apply(
        action,
        JSON.parse(actionParams)
      );
      setActionResult(
        actionResult instanceof Error ? actionResult.toString() : actionResult
      );
    } catch (e) {
      console.error(e);
    }
    setActionsReload(false);
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
              <div className="row">
                <div className="column">
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
                <div className="column">
                  <button
                    className="button"
                    onClick={() => onAction("can")}
                    disabled={actionsReload}
                  >
                    Can
                  </button>{" "}
                  <button
                    className="button"
                    onClick={() => onAction("send")}
                    disabled={actionsReload}
                  >
                    Send
                  </button>
                </div>
              </div>
              <div>
                <textarea
                  value={actionParams}
                  onChange={(e) => setActionParams(e.target.value)}
                ></textarea>
              </div>
              {!actionResult || JSON.stringify(actionResult)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

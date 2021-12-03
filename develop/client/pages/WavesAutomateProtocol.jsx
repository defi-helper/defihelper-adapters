import React, { useEffect } from "react";
import * as automatesGateway from "../common/automate";
import * as adaptersGateway from "../common/adapter";
import ReactJson from "react-json-view";
import { useProvider } from "../common/waves";
import * as WavesTx from "@waves/waves-transactions";

function AutomateArtifactSelector({ automates, onReload }) {
  const [current, setCurrent] = React.useState(automates[0]);
  const [reload, setReload] = React.useState(false);

  const onReloadHandler = async () => {
    if (current === null) return;

    setReload(true);
    try {
      onReload(current, await automatesGateway.wavesLoad(current));
    } catch (e) {
      console.error(e);
    }
    setReload(false);
  };

  return (
    <div>
      <div>
        <label>Contract: </label>
      </div>
      <div className="row">
        <div className="column column-90">
          <select
            value={current === null ? "" : current}
            onChange={(e) =>
              setCurrent(automatesGateway.Automate.fromString(e.target.value))
            }
          >
            {automates.map((automate) => (
              <option key={automate} value={automate}>
                {automate.contract}
              </option>
            ))}
          </select>
        </div>
        <div className="column column-10">
          <button
            className="button"
            onClick={onReloadHandler}
            disabled={reload}
          >
            {reload ? "Loading" : "Reload"}
          </button>
        </div>
      </div>
    </div>
  );
}

function automateReducer(state, { type, value }) {
  switch (type) {
    case "artifact":
      return {
        ...state,
        artifact: value,
      };
    case "wallet":
      return {
        ...state,
        wallet: {
          seed: value.seed,
          address: value.address,
        },
      };
    default:
      return state;
  }
}

const automateAdapterActions = ["migrate", "deposit", "refund", "run"];

export function WavesAutomateProtocol(props) {
  const [provider, signer] = useProvider();
  const [automates, setAutomates] = React.useState(null);
  const [automate, automateDispatch] = React.useReducer(automateReducer, {
    artifact: null,
    wallet: null,
  });
  const [adapters, setAdapters] = React.useState(null);
  const [automateDeployReload, setAutomateDeployReload] = React.useState(false);
  const [instance, setInstance] = React.useState("");
  const [currentAction, setCurrentAction] = React.useState("run");
  const [actionReload, setActionReload] = React.useState(false);
  const [actionResult, setActionResult] = React.useState(null);

  React.useEffect(() => {
    automatesGateway
      .wavesList()
      .then((automates) =>
        automates.filter(({ protocol }) => protocol === props.protocol)
      )
      .then(setAutomates);
  }, []);

  const onAutomateReload = async ({ protocol }, artifact) => {
    automateDispatch({
      type: "artifact",
      value: artifact,
    });
    const protocolAdapters = await adaptersGateway.load(protocol);
    setAdapters(protocolAdapters.automates);
  };

  const onAutomateDeploy = async () => {
    if (!provider || automate.artifact === null) return;

    setAutomateDeployReload(true);
    automateDispatch({
      type: "wallet",
      value: { seed: null, address: null },
    });
    try {
      const deploySeed = WavesTx.libs.crypto.randomSeed();
      const deployAddress = WavesTx.libs.crypto.address(
        deploySeed,
        signer.network.code
      );
      automateDispatch({
        type: "wallet",
        value: { seed: deploySeed, address: deployAddress },
      });

      const transferTx = JSON.parse(
        await provider.signAndPublishTransaction({
          type: 4,
          data: {
            amount: { tokens: "0.04", assetId: "WAVES" },
            recipient: deployAddress,
          },
        })
      );
      await WavesTx.waitForTx(transferTx.id, {
        apiBase: signer.network.server,
      });
      const setScriptTx = await WavesTx.broadcast(
        WavesTx.setScript(
          {
            script: `base64:${automate.artifact.base64}`,
            chainId: signer.network.code,
          },
          deploySeed
        ),
        signer.network.server
      );
      await WavesTx.waitForTx(setScriptTx.id, {
        apiBase: signer.network.server,
      });

      setInstance(deployAddress);
    } catch (e) {
      console.error(e);
    }
    setAutomateDeployReload(false);
  };

  const onAction = async () => {
    if (!instance || !currentAction) return;

    setActionReload(true);
    try {
      const actions = await adapters[automate.artifact.contractName](
        signer,
        instance
      );
      if (currentAction === "run") {
        const actionResult = await actions.run();
        setActionResult(
          actionResult instanceof Error ? actionResult.toString() : actionResult
        );
      } else {
        /*
        setSteps(actions[currentAction]);
        const firstStep = actions[currentAction][0];
        if (!firstStep) return;
        setStepInputs([]);
        setStepInfo(null);
        setStepName(firstStep.name);
        setActionResult(null);
	*/
      }
    } catch (e) {
      console.error(e);
    }
    setActionReload(false);
  };

  if (automates === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h2>{props.protocol}</h2>
      <AutomateArtifactSelector
        automates={automates}
        onReload={onAutomateReload}
      />
      {automate.artifact === null || (
        <div>
          <h3>Automate</h3>
          <div>
            <ReactJson
              src={JSON.parse(JSON.stringify(automate.artifact))}
              collapsed={1}
            />
          </div>
          <div>
            {automate.wallet === null || (
              <div>
                <h4>wallet</h4>
                <ReactJson
                  src={JSON.parse(JSON.stringify(automate.wallet))}
                  collapsed={1}
                />
              </div>
            )}
            <div className="row">
              <div className="column column-20">
                <button
                  className="button"
                  onClick={onAutomateDeploy}
                  disabled={automateDeployReload}
                >
                  {automateDeployReload ? "Loading" : "Deploy"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {!adapters || (
        <div>
          <h3>Action</h3>
          <div className="row">
            <div className="column column-45">
              <label>Automate:</label>
              <input
                type="text"
                placeholder="0x"
                value={instance}
                onChange={(e) => setInstance(e.target.value)}
              />
            </div>
            <div className="column column-45">
              <label>Action: </label>
              <select
                value={currentAction}
                onChange={(e) => setCurrentAction(e.target.value)}
              >
                {automateAdapterActions.map((name) => (
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
                Send
              </button>
            </div>
          </div>
        </div>
      )}
      {actionResult !== null && <div>{JSON.stringify(actionResult)}</div>}
    </div>
  );
}

import React from "react";
import ReactJson from "react-json-view";

import * as automatesGateway from "../common/automate";
import * as adaptersGateway from "../common/adapter";
import { useProvider } from "../common/waves";
import { AdapterModalSteps } from "../components";
import { Button } from "../components/Button";

function AutomateArtifactSelector({ automates, onReload }) {
  const [current = null, setCurrent] = React.useState(automates[0]);
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
          <Button onClick={onReloadHandler} loading={reload}>
            Reload
          </Button>
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
  const [deploySteps, setDeploySteps] = React.useState([]);
  const [deployResult, setDeployResult] = React.useState(null);
  const [instance, setInstance] = React.useState("");
  const [currentAction, setCurrentAction] = React.useState("run");
  const [actionReload, setActionReload] = React.useState(false);
  const [actionResult, setActionResult] = React.useState(null);
  const [actionSteps, setActionSteps] = React.useState([]);

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

    const deployFactory =
      protocolAdapters.automates.deploy[artifact.contractName];
    setDeploySteps(
      await deployFactory(signer, artifact.base64).then(({ deploy }) => deploy)
    );
  };

  const onAutomateDeploy = async (data) => {
    if (typeof data === "object") {
      if (typeof data.wait === "function") {
        await data.wait();
      }
      if (typeof data.getAddress === "function") {
        setInstance(await data.getAddress());
      }

      setDeployResult({ tx: data.tx });
    } else {
      setDeployResult(data);
    }
  };

  const onAction = async () => {
    if (!instance || !currentAction) return;

    setActionReload(true);
    setActionSteps([]);
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
        setActionSteps(actions[currentAction]);
        const firstStep = actions[currentAction][0];
        if (!firstStep) return;
        setActionResult(null);
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
          <div style={{ overflowX: "auto", maxWidth: "100%" }}>
            <ReactJson
              src={JSON.parse(JSON.stringify(automate.artifact))}
              collapsed={1}
            />
          </div>
          {!deploySteps.length || (
            <AdapterModalSteps
              steps={deploySteps}
              onAction={onAutomateDeploy}
            />
          )}
          {!deployResult || (
            <pre>
              <code>{JSON.stringify(deployResult, null, 2)}</code>
            </pre>
          )}
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
              <Button onClick={onAction} loading={actionReload}>
                Call
              </Button>
            </div>
          </div>
        </div>
      )}
      {!actionSteps.length || (
        <div>
          <h3>Action steps</h3>
          <AdapterModalSteps steps={actionSteps} onAction={setActionResult} />
        </div>
      )}
      {actionResult !== null && (
        <pre>
          <code>{JSON.stringify(actionResult, null, 2)}</code>
        </pre>
      )}
    </div>
  );
}

import React, { useEffect } from "react";
import * as automatesGateway from "../common/automate";
import * as adaptersGateway from "../common/adapter";
import ReactJson from "react-json-view";
import { useProvider } from "../common/ether";
import { abi as ProxyFactoryABI } from "../../../node_modules/@defihelper/networks/abi/ProxyFactory.json";
import networks from "../../../node_modules/@defihelper/networks/contracts.json";
import { ethers } from "ethers";

function txMinimal({ hash, type, from, data, r, s, v }) {
  return {
    hash,
    type,
    from,
    data,
    r,
    s,
    v,
  };
}

function receiptMinimal({
  blockHash,
  blockNumber,
  transactionIndex,
  contractAddress,
  gasUsed,
  confirmations,
  status,
  logsBloom,
  logs,
}) {
  return {
    blockHash,
    blockNumber,
    transactionIndex,
    contractAddress,
    gasUsed: gasUsed.toString(),
    confirmations,
    status,
    logsBloom,
    logs,
  };
}

function AutomateArtifactSelector({ provider, automates, onReload }) {
  const [current, setCurrent] = React.useState(automates[0]);
  const [reload, setReload] = React.useState(false);

  const onReloadHandler = async () => {
    if (current === null) return;

    setReload(true);
    try {
      const { chainId } = await provider.getNetwork();
      onReload(current, await automatesGateway.load(current, chainId));
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

function AutomateInit({
  state: { artifact, erc1167, storage, inputs, prototype },
  dispatch,
}) {
  const onChangeInitIntpus = (value, index) => {
    const newInitInputs = [...inputs];
    newInitInputs[index] = value;
    dispatch({ type: "inputs", value: newInitInputs });
  };

  return (
    <div>
      <div className="row">
        <div className="column column-50">
          <label>ERC1167 Library:</label>
          <input
            type="text"
            placeholder="0x"
            value={erc1167}
            onChange={(e) =>
              dispatch({ type: "erc1167", value: e.target.value })
            }
          />
        </div>
        <div className="column column-50">
          <label>Storage:</label>
          <input
            type="text"
            placeholder="0x"
            value={storage}
            onChange={(e) =>
              dispatch({ type: "storage", value: e.target.value })
            }
          />
        </div>
      </div>
      <div>
        <label>Init inputs:</label>
        {new ethers.utils.Interface(artifact.abi)
          .getFunction("init")
          .inputs.map(({ name, type }, i) => (
            <input
              key={name}
              type="text"
              placeholder={`${type} ${name}`}
              value={inputs[i]}
              onChange={(e) => onChangeInitIntpus(e.target.value, i)}
            />
          ))}
      </div>
      <div>
        <label>Prototype:</label>
        <input
          type="text"
          placeholder="0x"
          value={prototype}
          onChange={(e) =>
            dispatch({ type: "prototype", value: e.target.value })
          }
        />
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
        inputs: new ethers.utils.Interface(value.abi)
          .getFunction("init")
          .inputs.map(() => ""),
      };
    case "erc1167":
      return { ...state, erc1167: value };
    case "storage":
      return { ...state, storage: value };
    case "inputs":
      return { ...state, inputs: value };
    case "prototype":
      return { ...state, prototype: value };
    default:
      return state;
  }
}

const automateAdapterActions = ["migrate", "deposit", "refund", "run"];

export function EthereumAutomateProtocol(props) {
  const [provider, signer] = useProvider();
  const [automates, setAutomates] = React.useState(null);
  const [automate, automateDispatch] = React.useReducer(automateReducer, {
    artifact: null,
    erc1167: "",
    storage: "",
    inputs: [],
    prototype: "",
  });
  const [adapters, setAdapters] = React.useState(null);
  const [automateDeployReload, setAutomateDeployReload] = React.useState(false);
  const [deploy, setDeploy] = React.useState({ tx: null, receipt: null });
  const [automateProxyDeployReload, setAutomateProxyDeployReload] =
    React.useState(false);
  const [proxy, setProxy] = React.useState({ tx: null, receipt: null });
  const [currentAction, setCurrentAction] = React.useState("run");
  const [instance, setInstance] = React.useState("");
  const [actionReload, setActionReload] = React.useState(false);
  const [actionResult, setActionResult] = React.useState(null);
  const [steps, setSteps] = React.useState([]);
  const [stepName, setStepName] = React.useState("");
  const [stepInfo, setStepInfo] = React.useState(null);
  const [stepInputs, setStepInputs] = React.useState([]);

  React.useEffect(() => {
    automatesGateway
      .ethereumList()
      .then((automates) =>
        automates.filter(({ protocol }) => protocol === props.protocol)
      )
      .then(setAutomates);
  }, []);

  useEffect(async () => {
    if (!provider) return;

    const { chainId } = await provider.getNetwork();
    const network = networks[chainId.toString()];
    automateDispatch({
      type: "storage",
      value: network ? network.Storage.address : "",
    });
    automateDispatch({
      type: "erc1167",
      value: network ? network.ERC1167.address : "",
    });

    if (!automate.artifact || !automate.artifact.address) return;
    automateDispatch({
      type: "prototype",
      value: automate.artifact.address,
    });
  }, [provider, automate.artifact]);

  useEffect(async () => {
    if (proxy.receipt !== null) {
      setInstance(
        ethers.utils.defaultAbiCoder.decode(
          ["address"],
          proxy.receipt.logs[0].topics[2]
        )[0]
      );
    } else if (deploy.receipt !== null) {
      setInstance(deploy.receipt.contractAddress);
    } else if (automate.artifact && automate.artifact.address) {
      setInstance(automate.artifact.address);
    }
  }, [automate.artifact, deploy, proxy]);

  const onAutomateReload = async ({ protocol }, artifact) => {
    automateDispatch({
      type: "artifact",
      value: artifact,
    });
    const protocolAdapters = await adaptersGateway.load(protocol);
    setAdapters(protocolAdapters.automates);
  };

  const onAutomateDeploy = async () => {
    if (
      !provider ||
      automate.artifact === null ||
      automate.erc1167 === "" ||
      automate.storage === ""
    )
      return;

    setAutomateDeployReload(true);
    try {
      const factory = new ethers.ContractFactory(
        automate.artifact.abi,
        automatesGateway.linkLibraries(automate.artifact, {
          ERC1167: automate.erc1167,
        }),
        signer
      );
      const automateDeploy = await factory.deploy(automate.storage);
      const { deployTransaction } = automateDeploy;
      setDeploy({
        tx: txMinimal(deployTransaction),
        receipt: null,
      });
      const receipt = await deployTransaction.wait();
      await (
        await automateDeploy.init.apply(automateDeploy, automate.inputs)
      ).wait();
      setDeploy({
        tx: txMinimal(deployTransaction),
        receipt: receiptMinimal(receipt),
      });
    } catch (e) {
      console.error(e);
    }
    setAutomateDeployReload(false);
  };

  const onAutomateProxyDeploy = async () => {
    if (!provider || automate.artifact === null || automate.prototype === "")
      return;

    setAutomateProxyDeployReload(true);
    try {
      const { chainId } = await provider.getNetwork();
      const network = networks[chainId.toString()];
      const proxyFactory = new ethers.Contract(
        network.ProxyFactory.address,
        ProxyFactoryABI,
        signer
      );
      const tx = await proxyFactory.create(
        automate.prototype,
        new ethers.utils.Interface(automate.artifact.abi).encodeFunctionData(
          "init",
          automate.inputs
        )
      );
      setProxy({
        tx: txMinimal(tx),
        receipt: null,
      });
      const receipt = await tx.wait();
      setProxy({
        tx: txMinimal(tx),
        receipt: receiptMinimal(receipt),
      });
    } catch (e) {
      console.error(e);
    }
    setAutomateProxyDeployReload(false);
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
        setSteps(actions[currentAction]);
        const firstStep = actions[currentAction][0];
        if (!firstStep) return;
        setStepInputs([]);
        setStepInfo(null);
        setStepName(firstStep.name);
        setActionResult(null);
      }
    } catch (e) {
      console.error(e);
    }
    setActionReload(false);
  };

  const onStepInputChange = (inputIndex, newValue) => {
    setStepInputs(
      stepInputs.reduce(
        (result, value, i) => [...result, i === inputIndex ? newValue : value],
        []
      )
    );
  };

  const onStepCanClick = async () => {
    const step = steps.find(({ name }) => stepName === name);
    if (!step) return;

    setActionResult(await step.can.apply(step, stepInputs));
  };

  const onStepSendClick = async () => {
    const step = steps.find(({ name }) => stepName === name);
    if (!step) return;

    const { tx } = await step.send.apply(step, stepInputs);
    setActionResult({
      tx,
    });
    setActionResult({
      tx,
      receipt: await tx.wait(),
    });
  };

  useEffect(async () => {
    const step = steps.find(({ name }) => stepName === name);
    if (!step) return;
    const stepInfo = await step.info();
    setStepInputs(
      Array.from(new Array((stepInfo.inputs ?? []).length).values()).map(
        (_, i) => stepInfo.inputs[i].value ?? ""
      )
    );
    setStepInfo(stepInfo);
  }, [stepName]);

  if (automates === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h2>{props.protocol}</h2>
      <AutomateArtifactSelector
        provider={provider}
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
            <AutomateInit state={automate} dispatch={automateDispatch} />
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
              <div className="column column-20">
                <button
                  className="button"
                  onClick={onAutomateProxyDeploy}
                  disabled={automateProxyDeployReload}
                >
                  {automateProxyDeployReload ? "Loading" : "Proxy"}
                </button>
              </div>
            </div>
          </div>
          {!deploy.tx || (
            <div>
              <div>Deploy transaction:</div>
              <div>
                <ReactJson
                  src={JSON.parse(JSON.stringify(deploy.tx))}
                  collapsed={1}
                />
              </div>
              {deploy.receipt === null ? (
                <div>Transaction waiting...</div>
              ) : (
                <>
                  <div>Deploy receipt:</div>
                  <div>
                    <ReactJson
                      src={JSON.parse(JSON.stringify(deploy.receipt))}
                      collapsed={1}
                    />
                  </div>
                </>
              )}
            </div>
          )}
          {!proxy.tx || (
            <div>
              <div>Proxy transaction:</div>
              <div>
                <ReactJson
                  src={JSON.parse(JSON.stringify(proxy.tx))}
                  collapsed={1}
                />
              </div>
              {proxy.receipt === null ? (
                <div>Transaction waiting...</div>
              ) : (
                <>
                  <div>Proxy receipt:</div>
                  <div>
                    <ReactJson
                      src={JSON.parse(JSON.stringify(proxy.receipt))}
                      collapsed={1}
                    />
                  </div>
                </>
              )}
            </div>
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
      {!steps.length || (
        <div>
          <h3>Action steps</h3>
          <div className="row">
            {steps.map(({ name }) => (
              <div
                style={{
                  cursor: "pointer",
                  backgroundColor: name === stepName ? "#eee" : "",
                }}
                className="column"
                key={name}
                onClick={() => setStepName(name)}
              >
                {name}
              </div>
            ))}
          </div>
          {stepInfo && (
            <div>
              <p>{stepInfo.description}</p>
              <div>
                {(stepInfo.inputs ?? []).map(({ placeholder, value }, i) => (
                  <div key={i}>
                    {placeholder !== "" && <label>{placeholder}:</label>}
                    <input
                      type="text"
                      placeholder={placeholder}
                      value={stepInputs[i]}
                      onChange={(e) => onStepInputChange(i, e.target.value)}
                    />
                  </div>
                ))}
              </div>
              <div>
                <button onClick={onStepCanClick}>Can</button>
                <button onClick={onStepSendClick}>Send</button>
              </div>
            </div>
          )}
        </div>
      )}
      {actionResult !== null && <div>{JSON.stringify(actionResult)}</div>}
    </div>
  );
}

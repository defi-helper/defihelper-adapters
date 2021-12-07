import React from "react";
import * as automatesGateway from "../common/automate";
import * as adaptersGateway from "../common/adapter";
import ReactJson from "react-json-view";
import { useProvider } from "../common/ether";
import { AutomateSteps } from "../components";
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

function AutomateArtifactSelector({ chainId, automates, onReload }) {
  const [current, setCurrent] = React.useState(automates[0]);
  const [reload, setReload] = React.useState(false);

  const onReloadHandler = async () => {
    if (current === null) return;

    setReload(true);
    try {
      onReload(current, await automatesGateway.ethereumLoad(current, chainId));
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

const automateAdapterActions = ["migrate", "deposit", "refund", "run"];

export function EthereumAutomateProtocol(props) {
  const [automates, setAutomates] = React.useState(null);
  const [provider, signer] = useProvider();
  const [chainId, setChainId] = React.useState(null);
  const [erc1167, setErc1167] = React.useState("");
  const [storage, setStorage] = React.useState("");
  const [automateArtifact, setAutomateArtifact] = React.useState(null);
  const [automateDeployLoading, setAutomateDeployLoading] =
    React.useState(false);
  const [adapters, setAdapters] = React.useState(null);
  const [deploy, setDeploy] = React.useState({ tx: null, receipt: null });
  const [prototype, setPrototype] = React.useState("");
  const [deploySteps, setDeploySteps] = React.useState([]);
  const [deployProxyResult, setDeployProxyResult] = React.useState(null);
  const [instance, setInstance] = React.useState("");
  const [currentAction, setCurrentAction] = React.useState("run");
  const [actionReload, setActionReload] = React.useState(false);
  const [actionResult, setActionResult] = React.useState(null);
  const [actionSteps, setActionSteps] = React.useState([]);

  React.useEffect(() => {
    automatesGateway
      .ethereumList()
      .then((automates) =>
        automates.filter(({ protocol }) => protocol === props.protocol)
      )
      .then(setAutomates);
  }, []);

  React.useEffect(async () => {
    if (!provider) return;

    const { chainId } = await provider.getNetwork();
    setChainId(chainId);

    const network = networks[chainId.toString()];
    setStorage(network ? network.Storage.address : "");
    setErc1167(network ? network.ERC1167.address : "");
  }, [provider]);

  React.useEffect(() => {
    if (!automateArtifact || !automateArtifact.address) return;

    setPrototype(automateArtifact.address);
  }, [automateArtifact]);

  React.useEffect(async () => {
    if (instance !== "") return;

    if (deploy.receipt !== null) {
      setInstance(deploy.receipt.contractAddress);
    } else if (automateArtifact && automateArtifact.address) {
      setInstance(automateArtifact.address);
    }
  }, [automateArtifact, deploy]);

  const onAutomateReload = async ({ protocol }, artifact) => {
    setAutomateArtifact(artifact);

    const protocolAdapters = await adaptersGateway.load(protocol);
    setAdapters(protocolAdapters.automates);
  };

  const onDeployStepsCall = async () => {
    if (!provider || !chainId || automateArtifact === null || prototype === "")
      return;

    const network = networks[chainId.toString()];
    setDeploySteps(
      await adapters.deploy[automateArtifact.contractName](
        signer,
        network.ProxyFactory.address,
        prototype
      ).then(({ deploy }) => deploy)
    );
  };

  const onAutomateDeploy = async () => {
    if (
      !provider ||
      automateArtifact === null ||
      erc1167 === "" ||
      storage === ""
    )
      return;

    setAutomateDeployLoading(true);
    try {
      const factory = new ethers.ContractFactory(
        automateArtifact.abi,
        automatesGateway.linkLibraries(automateArtifact, {
          ERC1167: erc1167,
        }),
        signer
      );
      const automateDeploy = await factory.deploy(storage);
      const { deployTransaction } = automateDeploy;
      setDeploy({
        tx: txMinimal(deployTransaction),
        receipt: null,
      });
      const receipt = await deployTransaction.wait();
      setDeploy({
        tx: txMinimal(deployTransaction),
        receipt: receiptMinimal(receipt),
      });
    } catch (e) {
      console.error(e);
    }
    setAutomateDeployLoading(false);
  };

  const setProxyDeployResult = async (data) => {
    if (typeof data === "object") {
      if (typeof data.getAddress === "function") {
        const proxyAddress = await data.getAddress();
        setInstance(proxyAddress);
      }
    }

    setDeployProxyResult(data);
  };

  const onAction = async () => {
    if (!instance || !currentAction) return;

    setActionReload(true);
    setActionSteps([]);
    try {
      const actions = await adapters[automateArtifact.contractName](
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
        chainId={chainId}
        automates={automates}
        onReload={onAutomateReload}
      />
      {automateArtifact === null || (
        <div>
          <div>
            <h3>Automate</h3>
            <div>
              <ReactJson
                src={JSON.parse(JSON.stringify(automateArtifact))}
                collapsed={1}
              />
            </div>
            <div>
              <div>
                <div className="row">
                  <div className="column column-50">
                    <label>ERC1167 Library:</label>
                    <input
                      type="text"
                      placeholder="0x"
                      value={erc1167}
                      onChange={(e) => setErc1167(e.target.value)}
                    />
                  </div>
                  <div className="column column-50">
                    <label>Storage:</label>
                    <input
                      type="text"
                      placeholder="0x"
                      value={storage}
                      onChange={(e) => setStorage(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <button
                    className="button"
                    onClick={onAutomateDeploy}
                    disabled={automateDeployLoading}
                  >
                    {!automateDeployLoading ? "Deploy" : "Loading"}
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
          </div>
          <div>
            <h3>Proxy</h3>
            <div className="row">
              <div className="column">
                <label>Prototype:</label>
                <input
                  type="text"
                  placeholder="0x"
                  value={prototype}
                  onChange={(e) => setPrototype(e.target.value)}
                />
              </div>
              <div className="column">
                <button onClick={onDeployStepsCall}>Call</button>
              </div>
            </div>
            {!deploySteps.length || (
              <AutomateSteps
                steps={deploySteps}
                onAction={setProxyDeployResult}
              />
            )}
            {deployProxyResult !== null && (
              <div>
                {deployProxyResult.tx ? (
                  <ReactJson
                    src={JSON.parse(
                      JSON.stringify(txMinimal(deployProxyResult.tx))
                    )}
                    collapsed={1}
                  />
                ) : (
                  JSON.stringify(deployProxyResult)
                )}
              </div>
            )}
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
                Call
              </button>
            </div>
          </div>
        </div>
      )}
      {!actionSteps.length || (
        <div>
          <h3>Action steps</h3>
          <AutomateSteps steps={actionSteps} onAction={setActionResult} />
        </div>
      )}
      {actionResult !== null && <div>{JSON.stringify(actionResult)}</div>}
    </div>
  );
}

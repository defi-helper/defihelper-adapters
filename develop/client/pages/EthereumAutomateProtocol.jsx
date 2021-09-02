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

const automateAdapterActions = ["migrate", "deposit", "refund", "run"];

export function EthereumAutomateProtocol(props) {
  const [provider, signer] = useProvider();
  const [automates, setAutomates] = React.useState(null);
  const [currentAutomate, setCurrentAutomate] = React.useState(null);
  const [adapters, setAdapters] = React.useState(null);
  const [automateArtifact, setAutomateArtifact] = React.useState(null);
  const [automateArtifactReload, setAutomateArtifactReload] =
    React.useState(false);
  const [erc1167, setErc1167] = React.useState("");
  const [storage, setStorage] = React.useState("");
  const [contract, setContract] = React.useState("");
  const [automateDeployReload, setAutomateDeployReload] = React.useState(false);
  const [deploy, setDeploy] = React.useState({ tx: null, receipt: null });
  const [prototype, setPrototype] = React.useState("");
  const [automateProxyDeployReload, setAutomateProxyDeployReload] =
    React.useState(false);
  const [proxy, setProxy] = React.useState({ tx: null, receipt: null });
  const [currentAction, setCurrentAction] = React.useState("run");
  const [instance, setInstance] = React.useState("");
  const [actionReload, setActionReload] = React.useState(false);
  const [actionResult, setActionResult] = React.useState(null);

  React.useEffect(async () => {
    automatesGateway
      .ethereumList()
      .then((automates) => {
        return automates.filter(({ protocol }) => protocol === props.protocol);
      })
      .then((automates) => {
        setAutomates(automates);
        setCurrentAutomate(automates[0]);
      });
  }, []);

  const onStorageAutodetect = async () => {
    if (!provider) return;

    const { chainId } = await provider.getNetwork();
    const network = networks[chainId.toString()];
    if (!network) {
      setStorage("");
      return;
    }

    setStorage(network.Storage.address);
  };
  useEffect(onStorageAutodetect, [provider]);

  const onErc1167Autodetect = async () => {
    if (!provider) return;

    const { chainId } = await provider.getNetwork();
    const network = networks[chainId.toString()];
    if (!network) {
      setErc1167("");
      return;
    }

    setErc1167(network.ERC1167.address);
  };
  useEffect(onErc1167Autodetect, [provider]);

  const onPrototypeAutodetect = async () => {
    if (!automateArtifact || !automateArtifact.address) return;

    setPrototype(automateArtifact.address);
  };
  useEffect(onPrototypeAutodetect, [automateArtifact]);

  const onAdapterAutodetect = async () => {
    if (proxy.receipt !== null) {
      setInstance(
        ethers.utils.defaultAbiCoder.decode(
          ["address"],
          proxy.receipt.logs[0].topics[2]
        )[0]
      );
    } else if (deploy.receipt !== null) {
      setInstance(deploy.receipt.contractAddress);
    } else if (automateArtifact && automateArtifact.address) {
      setInstance(automateArtifact.address);
    }
  };
  useEffect(onAdapterAutodetect, [automateArtifact, deploy, proxy]);

  const onAutomateReload = async () => {
    if (currentAutomate === null) return;

    setAutomateArtifactReload(true);
    try {
      const { chainId } = await provider.getNetwork();
      const artifact = await automatesGateway.load(currentAutomate, chainId);
      setAutomateArtifact(artifact);
      onStorageAutodetect();
      onErc1167Autodetect();
      const protocolAdapters = await adaptersGateway.load(
        currentAutomate.protocol
      );
      setAdapters(protocolAdapters.automates);
    } catch (e) {
      console.error(e);
    }
    setAutomateArtifactReload(false);
  };

  const onAutomateDeploy = async () => {
    if (
      !provider ||
      !automateArtifact ||
      erc1167 === "" ||
      storage === "" ||
      contract === ""
    )
      return;

    setAutomateDeployReload(true);
    try {
      const factory = new ethers.ContractFactory(
        automateArtifact.abi,
        automatesGateway.linkLibraries(automateArtifact, {
          ERC1167: erc1167,
        }),
        signer
      );
      const automate = await factory.deploy(storage);
      const { deployTransaction } = automate;
      setDeploy({
        tx: txMinimal(deployTransaction),
        receipt: null,
      });
      const receipt = await deployTransaction.wait();
      await (await automate.init(contract)).wait();
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
    if (!provider || !automateArtifact || prototype === "") return;

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
        prototype,
        new ethers.utils.Interface(automateArtifact.abi).encodeFunctionData(
          "init",
          [contract]
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
      const actions = await adapters[currentAutomate.contract](
        signer,
        instance
      );
      const action = actions[currentAction];
      const actionResult = await action();
      setActionResult(
        actionResult instanceof Error ? actionResult.toString() : actionResult
      );
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
      <div>
        <div>
          <label>Contract: </label>
        </div>
        <div className="row">
          <div className="column column-90">
            <select
              value={currentAutomate === null ? "" : currentAutomate}
              onChange={(e) =>
                setCurrentAutomate(
                  automatesGateway.Automate.fromString(e.target.value)
                )
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
              onClick={onAutomateReload}
              disabled={automateArtifactReload}
            >
              {automateArtifactReload ? "Loading" : "Reload"}
            </button>
          </div>
        </div>
      </div>
      {!automateArtifact || (
        <div>
          <h3>Automate</h3>
          <div>
            <ReactJson
              src={JSON.parse(JSON.stringify(automateArtifact))}
              collapsed={1}
            />
          </div>
          <div className="row">
            <div className="column column-30">
              <label>ERC1167 Library:</label>
              <input
                type="text"
                placeholder="0x"
                value={erc1167}
                onChange={(e) => setErc1167(e.target.value)}
              />
            </div>
            <div className="column column-30">
              <label>Storage:</label>
              <input
                type="text"
                placeholder="0x"
                value={storage}
                onChange={(e) => setStorage(e.target.value)}
              />
            </div>
            <div className="column column-30">
              <label>Target contract:</label>
              <input
                type="text"
                placeholder="0x"
                value={contract}
                onChange={(e) => setContract(e.target.value)}
              />
            </div>
            <div className="column column-10">
              <button
                className="button"
                onClick={onAutomateDeploy}
                disabled={automateDeployReload}
              >
                {automateDeployReload ? "Loading" : "Deploy"}
              </button>
            </div>
          </div>
          {!deploy.tx || (
            <div>
              <div>Transaction:</div>
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
                  <div>Receipt:</div>
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
          <div className="row">
            <div className="column column-45">
              <label>Prototype:</label>
              <input
                type="text"
                placeholder="0x"
                value={prototype}
                onChange={(e) => setPrototype(e.target.value)}
              />
            </div>
            <div className="column column-45">
              <label>Target contract:</label>
              <input
                type="text"
                placeholder="0x"
                value={contract}
                onChange={(e) => setContract(e.target.value)}
              />
            </div>
            <div className="column column-10">
              <button
                className="button"
                onClick={onAutomateProxyDeploy}
                disabled={automateProxyDeployReload}
              >
                {automateProxyDeployReload ? "Loading" : "Proxy"}
              </button>
            </div>
          </div>
          {!proxy.tx || (
            <div>
              <div>Transaction:</div>
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
                  <div>Receipt:</div>
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
          {!actionResult || JSON.stringify(actionResult)}
        </div>
      )}
    </div>
  );
}

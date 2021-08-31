import React, { useEffect } from "react";
import * as automatesGateway from "../common/automate";
import ReactJson from "react-json-view";
import { useProvider } from "../common/ether";
import networks from "../../../node_modules/@defihelper/networks/contracts.json";
import { ethers } from "ethers";

export function EthereumAutomateProtocol(props) {
  const [provider, signer] = useProvider();
  const [automates, setAutomates] = React.useState(null);
  const [currentAutomate, setCurrentAutomate] = React.useState(null);
  const [automateArtifact, setAutomateArtifact] = React.useState(null);
  const [automateArtifactReload, setAutomateArtifactReload] =
    React.useState(false);
  const [erc1167, setErc1167] = React.useState("");
  const [storage, setStorage] = React.useState("");
  const [contract, setContract] = React.useState("");
  const [automateDeployReload, setAutomateDeployReload] = React.useState(false);
  const [deploy, setDeploy] = React.useState({ tx: null, receipt: null });

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

  const onAutomateReload = async () => {
    if (currentAutomate === null) return;

    setAutomateArtifactReload(true);
    try {
      const artifact = await automatesGateway.load(currentAutomate);
      setAutomateArtifact(artifact);
      onStorageAutodetect();
      onErc1167Autodetect();
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
      const tx = {
        hash: deployTransaction.hash,
        type: deployTransaction.type,
        from: deployTransaction.from,
        data: deployTransaction.data,
        r: deployTransaction.r,
        s: deployTransaction.s,
        v: deployTransaction.v,
      };
      setDeploy({
        tx,
        receipt: null,
      });
      const receipt = await deployTransaction.wait();
      await (await automate.init(contract)).wait();
      setDeploy({
        tx,
        receipt: {
          blockHash: receipt.blockHash,
          blockNumber: receipt.blockNumber,
          transactionIndex: receipt.transactionIndex,
          contractAddress: receipt.contractAddress,
          gasUsed: receipt.gasUsed.toString(),
          confirmations: receipt.confirmations,
          status: receipt.status,
          logsBloom: receipt.logsBloom,
          logs: receipt.logs,
        },
      });
    } catch (e) {
      console.error(e);
    }
    setAutomateDeployReload(false);
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
        </div>
      )}
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
    </div>
  );
}

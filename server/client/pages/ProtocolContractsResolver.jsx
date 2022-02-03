import React from "react";
import * as adaptersGateway from "../common/adapter";
import { useProvider } from "../common/ether";
import { createWavesProvider } from "../common/waves";
import ReactJson from "react-json-view";

export function ProtocolContractsResolver(props) {
  const [ethProvider, ethSigner] = useProvider();
  const [blockchain, setBlockchain] = React.useState("ethereum");
  const [protocol, setProtocol] = React.useState(null);
  const [contractReload, setContractReload] = React.useState(false);
  const [currentOutput, setCurrentOutput] = React.useState("[null]");
  const [contractsResolversList, setContractsResolversList] = React.useState(
    []
  );
  const [currentResolver, setCurrentResolver] = React.useState("default");

  React.useEffect(async () => {
    const protocol = await adaptersGateway.load(props.protocol);
    setProtocol(protocol);
    setContractsResolversList(protocol.automates.contractsResolver || []);
  }, []);

  const onContractReload = async () => {
    if (protocol === null) return;

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

      const output = await protocol.automates.contractsResolver[
        currentResolver
      ](bc, params);
      setCurrentOutput(JSON.stringify(output));
    } catch (e) {
      console.error(e);
    }
    setContractReload(false);
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
          <label>Resolver:</label>
          <select
            value={currentResolver}
            onChange={(e) => setCurrentResolver(e.target.value)}
          >
            {Object.keys(contractsResolversList).map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
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

      <div>
        <div>
          <ReactJson src={JSON.parse(currentOutput)} collapsed={1} />
        </div>
      </div>
    </div>
  );
}

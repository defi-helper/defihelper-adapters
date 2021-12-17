import React from "react";
import { Link } from "react-router-dom";
import * as adaptersGateway from "../common/adapter";
import * as automatesGateway from "../common/automate";

function AdaptersList({ adapters }) {
  if (adapters === null) return <div>Loading...</div>;

  return (
    <ul>
      {adapters.map((protocol) => (
        <li key={protocol}>
          <Link to={`/client/adapter/${protocol}`}>{protocol}</Link>
          <div>
            <small> <Link to={`/client/contracts-resolver/${protocol}`}>contracts resolver</Link></small>
          </div>
        </li>
      ))}
    </ul>
  );
}

function AutomatesList({ blockchain, automates }) {
  if (automates === null) return <div>Loading...</div>;

  return (
    <ul>
      {automates.map(({ protocol, contract }) => (
        <li key={`${protocol}/${contract}`}>
          <Link to={`/client/automate/${blockchain}/${protocol}`}>
            {protocol}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function Main() {
  const [adapters, setAdapters] = React.useState(null);
  const [ethereumAutomates, setEthereumAutomates] = React.useState(null);
  const [wavesAutomates, setWavesAutomates] = React.useState(null);

  React.useEffect(async () => {
    adaptersGateway.list().then(setAdapters);
    automatesGateway.ethereumList().then(setEthereumAutomates);
    automatesGateway.wavesList().then(setWavesAutomates);
  }, []);

  return (
    <div className="row">
      <div className="column">
        <h2>Adapters</h2>
        <div>
          <AdaptersList adapters={adapters} />
        </div>
      </div>

      <div className="column">
        <h2>Automates</h2>
        <h3>Ethereum</h3>
        <div>
          <AutomatesList blockchain="ethereum" automates={ethereumAutomates} />
        </div>
        <h3>Waves</h3>
        <div>
          <AutomatesList blockchain="waves" automates={wavesAutomates} />
        </div>
      </div>
    </div>
  );
}

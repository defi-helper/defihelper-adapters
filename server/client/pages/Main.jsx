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
            <small>
              {" "}
              <Link to={`/client/contracts-resolver/${protocol}`}>
                contracts resolver
              </Link>
            </small>
          </div>
        </li>
      ))}
    </ul>
  );
}

function AutomatesList({ blockchain, automates }) {
  if (automates === null) return <div>Loading...</div>;
  const protocols = [...new Set(automates.map(({ protocol }) => protocol))];

  return (
    <ul>
      {protocols.map((protocol) => (
        <li key={protocol}>
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

  React.useEffect(() => {
    const handler = async () => {
      adaptersGateway.list().then(setAdapters);
      automatesGateway.ethereumList().then(setEthereumAutomates);
      automatesGateway.wavesList().then(setWavesAutomates);
    };

    handler().catch(console.error);
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

      <div className="column">
        <h2>DFH</h2>
        <h3>Ethereum</h3>
        <div>
          <ul>
            <li>
              <Link to="/client/dfh/balance">Balance</Link>
            </li>
            <li>
              <Link to="/client/dfh/smart-trade">SmartTrade</Link>
            </li>
            <li>
              <Link to="/client/dfh/zap">LP Tokens manager</Link>
            </li>
            <li>
              <Link to="/client/dfh/uni3zap">Uni3 LP Tokens manager</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

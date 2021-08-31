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
        </li>
      ))}
    </ul>
  );
}

function EthereumAutomatesList({ automates }) {
  if (automates === null) return <div>Loading...</div>;

  return (
    <ul>
      {automates.map(({ protocol, contract }) => (
        <li key={`${protocol}/${contract}`}>
          <Link to={`/client/automate/ethereum/${protocol}`}>{protocol}</Link>
        </li>
      ))}
    </ul>
  );
}

export function Main() {
  const [adapters, setAdapters] = React.useState(null);
  const [automates, setAutomates] = React.useState(null);

  React.useEffect(async () => {
    adaptersGateway.list().then(setAdapters);
    automatesGateway.ethereumList().then(setAutomates);
  }, []);

  return (
    <div>
      <h2>Adapters</h2>
      <div>
        <AdaptersList adapters={adapters} />
      </div>
      <h2>Automates</h2>
      <div>
        <EthereumAutomatesList automates={automates} />
      </div>
    </div>
  );
}

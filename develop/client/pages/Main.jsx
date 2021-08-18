import React from 'react';
import { Link } from 'react-router-dom';
import * as adaptersGateway from '../common/adapter';

export function Main() {
  const [adapters, setAdapters] = React.useState(null);

  React.useEffect(async () => {
    setAdapters(await adaptersGateway.list());
  }, []);

  if (adapters === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ul>
        {adapters.map((protocolName) => (
          <li key={protocolName}>
            <Link to={`/client/${protocolName}`}>{protocolName}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

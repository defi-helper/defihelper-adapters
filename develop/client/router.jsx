import React from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { Main, AdapterProtocol, EthereumAutomateProtocol } from "./pages";

export function Router() {
  return (
    <BrowserRouter>
      <div>
        <nav>
          <div>
            <Link to="/client">Home</Link>
          </div>
        </nav>
        <Switch>
          <Route
            path="/client/adapter/:protocol"
            render={({ match }) => (
              <AdapterProtocol protocol={match.params.protocol} />
            )}
          ></Route>
          <Route
            path="/client/automate/ethereum/:protocol"
            render={({ match }) => (
              <EthereumAutomateProtocol protocol={match.params.protocol} />
            )}
          ></Route>
          <Route path="/client" component={Main}></Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

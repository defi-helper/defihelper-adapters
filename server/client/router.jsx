import React from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import {
  Main,
  AdapterProtocol,
  EthereumAutomateProtocol,
  WavesAutomateProtocol,
  ProtocolContractsResolver,
  DFH,
} from "./pages";

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
            path="/client/contracts-resolver/:protocol"
            render={({ match }) => (
              <ProtocolContractsResolver protocol={match.params.protocol} />
            )}
          ></Route>
          <Route
            path="/client/automate/ethereum/:protocol"
            render={({ match }) => (
              <EthereumAutomateProtocol protocol={match.params.protocol} />
            )}
          ></Route>
          <Route
            path="/client/automate/waves/:protocol"
            render={({ match }) => (
              <WavesAutomateProtocol protocol={match.params.protocol} />
            )}
          ></Route>
          <Route
            path="/client/dfh/balance"
            component={DFH.BalancePage}
          ></Route>
          <Route
            path="/client/dfh/smart-trade"
            component={DFH.SmartTradePage}
          ></Route>
          <Route
            path="/client/dfh/zap"
            component={DFH.LPTokensManagerPage}
          ></Route>
          <Route
            path="/client/dfh/uni3zap"
            component={DFH.Uni3LPTokensManagerPage}
          ></Route>
          <Route
            path="/client/dfh/automate"
            component={DFH.AutomatePage}
          ></Route>
          <Route path="/client" component={Main}></Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

import React from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import { Main, Protocol } from './pages';

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
          <Route path="/client/:protocol" render={({ match }) => <Protocol protocol={match.params.protocol} />}></Route>
          <Route path="/client" component={Main}></Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

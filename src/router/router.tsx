import React from 'react'
import {
  Route,
  Router as BrowserRouter,
  Switch,
} from 'react-router-dom'

import { paths } from '~/paths'
import { history } from '~/common/history'
import { Adapter } from '~/adapters-page'

export type RouterProps = unknown

export const Router: React.VFC<RouterProps> = () => {
  return (
    <BrowserRouter history={history}>
      <Switch>
        <Route path={paths.main}>
          <Adapter />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}

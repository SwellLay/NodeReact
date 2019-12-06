import NotFound from 'components/404'

import MainRoute from 'components/app/MainRoute'
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from './components'

export function DashboardRoute(url) {


  return (

    <Switch>
      <MainRoute exact path={`${url}`} component={Home} />
      <Route component={NotFound} />
    </Switch>
  )
}


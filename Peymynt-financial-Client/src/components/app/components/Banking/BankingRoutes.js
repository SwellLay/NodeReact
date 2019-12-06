import React from 'react'
import { Switch } from 'react-router-dom'
import MainRoute from 'components/app/MainRoute'
import BankConnections from './components/BankConnections'
import Payouts from './components/Payouts'

export function BankingRoutes(url) {
    return (

        <Switch>
            <MainRoute exact path={`${url}/bankconnections`} component={BankConnections} />
            <MainRoute exact path={`${url}/payouts`} component={Payouts} />
        </Switch>
    )
};
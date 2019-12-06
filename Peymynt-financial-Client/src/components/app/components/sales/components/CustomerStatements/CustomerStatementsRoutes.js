import React from 'react'

import { Switch } from 'react-router-dom'
import MainRoute from 'components/app/MainRoute'
import CustomerStatements from '.';



export function CustomerStatementsRoutes(url) {
    return (
        <div className="checkoutWrapper">
            <Switch>
                <MainRoute exact path={`${url}`} component={CustomerStatements} />
            </Switch>
        </div>
    )
};

import React from 'react'

import { Switch } from 'react-router-dom'
import MainRoute from 'components/app/MainRoute'
import Checkouts from '.';



export function CheckoutsRoutes(url) {
    return (
        <div className="content-wrapper__main checkoutWrapper">
            <Switch>
                <MainRoute exact path={`${url}`} component={Checkouts} />
            </Switch>
        </div>
    )
};

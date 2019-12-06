import React from 'react'

import { Switch } from 'react-router-dom'

import MainRoute from 'components/app/MainRoute'
import EditBussinessInfo from './EditBussiness';
import AddBusiness from './AddBusiness';



export function BusinessRoutes(url) {
    return (

        <Switch>
            <MainRoute exact path={`${url}/edit/:businessId`} component={EditBussinessInfo} />
            <MainRoute exact path={`${url}/add`} component={AddBusiness} />
        </Switch>
    )
};

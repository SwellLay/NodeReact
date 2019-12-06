import React from 'react'

import { Switch } from 'react-router-dom'
import { Col } from 'reactstrap';
import MainRoute from 'components/app/MainRoute'

import Profile from './components/Profile'
import ChangePassword from './components/ChangePassword';
import Business from './components/Business';
import EditBusiness from './components/EditBusiness';
import AddBusiness from './components/AddBusiness';
import EmailsConnected from './components/EmailsConnected';
import EmailNotification from './components/EmailNotification';
import ConfirmPrimary from './components/ConfirmPrimary';


export function ProfileRoutes(url, params) {
    return (
        <Switch>
            <MainRoute exact path={`${url}`} component={Profile} params={params} />
            <MainRoute exact path={`${url}/password`} component={ChangePassword} params={params} />
            <MainRoute exact path={`${url}/business`} component={Business} params={params} />
            <MainRoute exact path={`${url}/email-connected`} component={EmailsConnected} params={params} />
            <MainRoute exact path={`${url}/email-notification`} component={EmailNotification} params={params} />
            <MainRoute exact path={`${url}/business/:businessId/edit`} component={EditBusiness} params={params} />
            <MainRoute exact path={`${url}/business/:businessId/primary`} component={ConfirmPrimary} params={params} />
            <MainRoute exact path={`${url}/business/add`} component={AddBusiness} params={params} />
        </Switch>
    )
};

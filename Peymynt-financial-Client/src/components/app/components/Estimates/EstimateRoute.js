import React from 'react';
import Estimates from '.';
import { Switch } from 'react-router-dom';
import MainRoute from 'components/app/MainRoute';
import EditEstimate from './components/EditEstimate';
import EstimateForm from './components/EstimateForm';
import EstimateInvoice from './components/EstimateInvoice';
import EditBusinessInformation from './components/EditBusinessInformation';
import EditBusiness from '../profile/components/EditBusiness';


export function EstimateRoute(url) {
    return (
        <div className={'estimateWrapper'}>
            <Switch>
                <MainRoute exact path={`${url}`} component={Estimates} />
                <MainRoute exact path={`${url}/add`} component={EstimateForm} />
                <MainRoute exact path={`${url}/edit/:id`} component={EditEstimate} />
                <MainRoute exact path={`${url}/view/:id`} component={EstimateInvoice} />
                <MainRoute exact path={`${url}/edit-business-information`} component={EditBusiness} />
            </Switch>
        </div>
    )
};

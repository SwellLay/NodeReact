import React from 'react'

import { Switch } from 'react-router-dom'

import MainRoute from 'components/app/MainRoute'
import Payment from '.';
import OnBoarding from './components/OnBoardingForm/';
import ViewPayment from './components/viewPayment';
import ViewRefund from './components/viewRefund';
import { KycError } from './components/KycError';

export function PaymentRoutes(url) {
    return (

        <Switch>
            <MainRoute exact path={`${url}`} component={Payment} />
            <MainRoute exact path={`${url}/onboarding`} component={OnBoarding} />
            <MainRoute exact path={`${url}/kyc`} component={KycError} />
            <MainRoute exact path={`${url}/view-refund/:id`} component={ViewRefund} />
            <MainRoute exact path={`${url}/view-payment/:id`} component={ViewPayment} />
        </Switch>
    )
};

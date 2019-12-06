import React from 'react'

import { Switch } from 'react-router-dom'

import MainRoute from 'components/app/MainRoute'
import Invoice from '.';
import ViewInvoice from './components/InvoiceForm/ViewInvoice';
import AddInvoice from './components/InvoiceForm/AddInvoice';
import EditInvoice from './components/InvoiceForm/EditInvoice';
import InvoiceStart from './components/InvoiceStart';

export function InvoiceRoutes(url) {
    return (

        <Switch>
            <MainRoute exact path={`${url}`} component={Invoice} />
            <MainRoute exact path={`${url}/start`} component={InvoiceStart} />
            <MainRoute exact path={`${url}/add`} component={AddInvoice} />
            <MainRoute exact path={`${url}/edit/:id`} component={EditInvoice} />
            <MainRoute exact path={`${url}/view/:id`} component={ViewInvoice} />
        </Switch>
    )
};

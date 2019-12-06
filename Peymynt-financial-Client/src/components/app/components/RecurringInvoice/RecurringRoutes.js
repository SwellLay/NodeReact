import React from 'react'

import { Switch } from 'react-router-dom'
import MainRoute from 'components/app/MainRoute'
import RecurringInvoice from '.';
import RecurringInvoiceView from './RecurringInvoiceView';
import CreateRecurring from './CreateRecurring';
import EditRecurring from './EditRecurrintg';
import RecurringInvoiceCreate from './recurringinvoicecreate';


export function RecurringRoutes(url) {
    return (

        <Switch>
            <MainRoute exact path={`${url}`} component={RecurringInvoice} />
            <MainRoute exact path={`${url}/view/:id`} component={RecurringInvoiceView} />
            <MainRoute exact path={`${url}/add`} component={CreateRecurring} />
            <MainRoute exact path={`${url}/edit/:id`} component={EditRecurring} />
            <MainRoute exact path={`${url}/recurringinvoicecreate`} component={RecurringInvoiceCreate} />
        </Switch>
    )
};

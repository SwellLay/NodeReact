import MainRoute from 'components/app/MainRoute'
import React from 'react'
import { Switch } from 'react-router-dom'
import InvoiceCustomization from './components/InvoiceCustomization'
import Receipts from './components/Receipts'
import Payments from './components/Payments';


export function SettingRoutes(url) {
  return (
    <Switch>
      <MainRoute exact path={`${url}/receipts`} component={Receipts} />
      <MainRoute exact path={`${url}/invoice-customization`} component={InvoiceCustomization} />
      <MainRoute exact path={`${url}/payments`} component={Payments} />
    </Switch>
  );
};

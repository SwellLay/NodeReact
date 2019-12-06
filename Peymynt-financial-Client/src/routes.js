import NotFound from 'components/404'
import InternalServerError from 'components/500'
import { DashboardRoute } from 'components/app/components/dashboard/DashboardRoute';
import { InvoiceRoutes } from 'components/app/components/invoice/InvoiceRoutes'
import LaunchpadRoutes from 'components/app/components/Launchpad/routes';
import { PaymentRoutes } from 'components/app/components/payments/PaymentRoutes'
import { SalesRoute } from 'components/app/components/sales/SalesRoute'
import { SettingRoutes } from 'components/app/components/setting/SettingRoutes'
import ForgotPassword from 'components/forgotPassword'
import Login from 'components/login'
import ResetPassword from 'components/resetPassword'
import SignUp from 'components/signUp'
import React from 'react'
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
// import 'style/bootstrap.scss';
// import 'bootstrap/dist/css/bootstrap.min.css';
import "react-datepicker/dist/react-datepicker.css";
import { Redirect, Route, Switch } from 'react-router'
import 'style/app.scss';
import { BusinessRoutes } from './components/app/components/BusinessInfo/BusinessRoutes';
import { EstimateRoute } from './components/app/components/Estimates/EstimateRoute'
import InvoiceCustomerView from './components/app/components/invoice/components/InvoiceCustomerView';
import MailPreview from './components/app/components/invoice/components/InvoiceForm/MailPreview';
import ReceiptPreview from './components/app/components/invoice/components/InvoiceForm/ReceiptPreview';
import InvoiceViewBrowser from './components/app/components/invoice/components/InvoiceViewBrowser';
import PublicPayout from './components/app/components/invoice/components/Payout';
import CloseUserAccount from './components/app/components/profile/components/CloseUserAccount';
import { ProfileRoutes } from './components/app/components/profile/ProfileRoutes';
import { PurchaseRoute } from './components/app/components/purchase/PurchaseRoutes';
import { RecurringRoutes } from './components/app/components/RecurringInvoice/RecurringRoutes';

import PublicCheckout from './components/app/components/sales/components/Checkouts/PublicCheckout';
import StatementPreview from './components/app/components/sales/components/CustomerStatements/StatementPreview'
import Onboarding from './components/onboarding'
import ReminderPreview from './components/openPages/ReminderPreview';
import ViewEstimate from './components/ViewEstimate';
import ViewBrowser from './components/ViewEstimate/ViewBrowser';
import './react-select.css';
import { Terms } from './global/Terms';
import { Policy } from './global/Policy';
import { Security } from './global/Security';

import { BankingRoutes } from './components/app/components/Banking/BankingRoutes';

const Main = ({}) => {
  document.title = 'Peymynt';
  return <Switch>
    <Redirect from="/" exact to="/login" />
    <Route exact path="/login" component={Login} />
    <Route exact path="/password/reset/confirm/:token" component={ResetPassword} />
    <Route path='/register' component={SignUp} />
    <Route path='/forgot-password' component={ForgotPassword} />
    <Route path='/reset-password' component={ResetPassword} />
    <Route path='/onboarding' component={Onboarding} />
    <Route path='/closeaccount' component={CloseUserAccount} />
    <Route path='/app/:userId/accounts/'
      render={({ match: { url, params } }) => (
        ProfileRoutes(url, params)
      )}
    />
    <Route path="/app/dashboard/"
      render={({ match: { url } }) => (
        DashboardRoute(url)
      )}
    />
    {/* <Route path='/business' component={AddBusiness} /> */}

    <Route
      path="/app/sales/"
      render={({ match: { url } }) => (
        SalesRoute(url)
      )}
    />

    <Route exact path="/public/checkout/:uuid" component={PublicCheckout} />
    <Route exact path="/public/payout/:uuid" component={PublicPayout} />
    <Route exact path="/public/statements/preview/:uuid" component={StatementPreview} />

    <Route
      path="/app/estimates/"
      render={({ match: { url } }) => (
        EstimateRoute(url)
      )}
    />

    <Route
      path="/app/invoices"
      render={({ match: { url } }) => (
        InvoiceRoutes(url)
      )}
    />

    <Route
      path="/app/payments"
      render={({ match: { url } }) => (
        PaymentRoutes(url)
      )}
    />

    <Route
      path="/app/recurring"
      render={({ match: { url } }) => (
        RecurringRoutes(url)
      )}
    />


    <Route
      path="/app/setting/"
      render={({ match: { url } }) => (
        SettingRoutes(url)
      )}
    />
    <Route
      path="/business/"
      render={({ match: { url } }) => (
        BusinessRoutes(url)
      )}
    />

    <Route
      path="/app/banking/"
      render={({ match: { url } }) => (
        BankingRoutes(url)
      )}
    />


    <Route
      path="/app/purchase/"
      render={({ match: { url } }) => (
        PurchaseRoute(url)
      )}
    />
    <Route
      path="/app/launchpad/"
      render={({ match: { url } }) => (
        <LaunchpadRoutes url={url} />
      )}
    />
    <Route exact path="/estimate/readonly/:id" component={ViewEstimate} />
    <Route exact path="/public/estimate/:id" component={ViewBrowser} />
    <Route exact path="/terms" component={Terms} />
    <Route exact path="/policy" component={Policy} />
    <Route exact path="/security" component={Security} />
    <Route exact path="/public/invoice/:id" component={InvoiceViewBrowser} />
    <Route exact path={`/invoices-preview/:id`} component={ReminderPreview} />
    <Route exact path={`/invoices/readonly/:id`} component={InvoiceCustomerView} />
    <Route exact path={`/invoice/:id/public/reciept-view/readonly/:receiptId`} component={ReceiptPreview} />
    <Route exact path={`/invoices/:id/receipt-preview/:receiptId`} component={ReceiptPreview} />
    <Route exact path={`/invoices/:id/mail-preview`} component={MailPreview} />
    <Route exact path={`/estimate/:id/mail-preview`} component={MailPreview} />
    <Route exact path={`/app/error/500`} component={InternalServerError} />
    <Route component={NotFound} />

  </Switch>
};

export default Main;

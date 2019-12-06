import React from 'react'

import { Switch } from 'react-router-dom'

import MainRoute from 'components/app/MainRoute'
import ProductServices from './components/productServices'
import AddProduct from './components/productServices/AddProduct'
import EditProduct from './components/productServices/EditProduct'

import Checkouts from './components/Checkouts'
import AddCheckout from './components/Checkouts/AddCheckout'
import EditCheckout from './components/Checkouts/EditCheckout'
import CheckoutPreviewForm from './components/Checkouts/CheckoutPreviewForm'
import PreviewCheckout from './components/Checkouts/PreviewCheckout'
import ShareCheckout from './components/Checkouts/ShareCheckout'
import PublicCheckout from './components/Checkouts/PublicCheckout'
import CustomerStatements from './components/CustomerStatements'

import Customer from './components/customer'
import AddCustomer from './components/customer/AddCustomer'
import EditCustomer from './components/customer/EditCustomer'
import ImportCsv from 'global/ImportCsv'

export function SalesRoute(url) {
    return (

        <Switch>
            <MainRoute exact path={`${url}/products`} component={ProductServices} url={url}/>
            <MainRoute exact path={`${url}/products/add`} component={AddProduct} url={url}/>
            <MainRoute exact path={`${url}/products/edit/:id`} component={EditProduct} url={url}/>

            <MainRoute exact path={`${url}/customer`} component={Customer} />
            <MainRoute exact path={`${url}/customer/add`} component={AddCustomer} />
            <MainRoute exact path={`${url}/customer/edit/:id`} component={EditCustomer} />
            <MainRoute exact path={`${url}/customer/csv`} component={ImportCsv} />

            <MainRoute exact path={`${url}/checkouts`} component={Checkouts} />
            <MainRoute exact path={`${url}/checkouts/add`} component={AddCheckout} />
            <MainRoute exact path={`${url}/checkouts/edit/:id`} component={EditCheckout} />
            <MainRoute exact path={`${url}/checkouts/preview`} component={PreviewCheckout} />
            <MainRoute exact path={`${url}/checkouts/share/:id`} component={ShareCheckout} />
            
            <MainRoute exact path={`${url}/customerstatements`} component={CustomerStatements} />
        </Switch>
    )
};

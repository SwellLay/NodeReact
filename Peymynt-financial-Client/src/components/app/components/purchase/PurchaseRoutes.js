import EditBankDetails from 'components/app/components/purchase/Components/vendor/components/EditBankDetails';
import ViewBankDetails from 'components/app/components/purchase/Components/vendor/components/ViewBankDetails';
import MainRoute from 'components/app/MainRoute'
import React from 'react'
import { Switch } from 'react-router-dom'
import ImportCsv from '../../../../global/ImportCsv';
import productServices from '../sales/components/productServices';
import AddProduct from '../sales/components/productServices/AddProduct';
import EditProduct from '../sales/components/productServices/EditProduct';
import Bills from './Components/bills';
import CreateBill from './Components/bills/components/CreateBill';
import EditBill from './Components/bills/components/EditBill';
import Receipts from './Components/receipts';
import Vendor from './Components/vendor';
import AddVendor from './Components/vendor/components/AddVendor';
import EditVendor from './Components/vendor/components/EditVendor';

export function PurchaseRoute(url) {
  return (
    <Switch>
      <MainRoute exact path={`${url}/products`} component={productServices} url={url} />
      <MainRoute exact path={`${url}/products/add`} component={AddProduct} url={url} />
      <MainRoute exact path={`${url}/products/edit/:id`} component={EditProduct} url={url} />

      <MainRoute exact path={`${url}/vendors`} component={Vendor} url={url} />
        <MainRoute exact path={`${url}/vendors/add`} component={AddVendor} url={url} />
        <MainRoute exact path={`${url}/vendors/edit/:id`} component={EditVendor} url={url} />
        <MainRoute exact path={`${url}/vendors/import-csv`} component={ImportCsv} url={url} />
      <MainRoute exact path={`${url}/vendors/:id/bank-details/edit`} component={EditBankDetails} url={url} />
      <MainRoute exact path={`${url}/vendors/:id/bank-details`} component={ViewBankDetails} url={url} />

      <MainRoute exact path={`${url}/bills`} component={Bills} url={url} />
      <MainRoute exact path={`${url}/bills/add`} component={CreateBill} url={url} />
      <MainRoute exact path={`${url}/bills/add/:vendorId`} component={CreateBill} url={url} />
      <MainRoute exact path={`${url}/bills/:id`} component={EditBill} url={url} />

      <MainRoute exact path={`${url}/receipts`} component={Receipts} url={url} />
    </Switch>
  );
}

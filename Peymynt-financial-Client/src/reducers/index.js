import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';
import * as ActionTypes from '../constants/ActionTypes';
import appUserReducer from './appUserReducer'
import { billsReducer, getAllBills } from './billsReducer';
import businessReducer from './businessReducer';
import checkoutReducer from './checkoutReducer';
import customerReducer from './CustomerReducer';
import { deleteCards, getAllCards } from './getAllCardsReducer';
import { getAllBankAccounts, getAllInvoicePayments } from './invoiceReducer';
import paymentReducer from './paymentReducer';
import productReducer from './productReducer';
import receipts from './receiptReducer';
import receiptSettings from './receiptSettings';
import { sendMail } from './sendMailReducer';
import settings from './settings';
import snackbarReducer from './snackBarReducer';
import { getAllRecurring, getAllRecurringCount } from './RecurringReducer';
import { getResetLink, passwordReset, linkVerify } from './authReducer';

import { addVendor, deleteVendor, getAllVendors, getByIdVendor, updateVendor, vendorBank } from './vendorReducer';
import paymentSettings from './paymentSettings';

const reducers = {
  routing: routerReducer,
  settings,
  appUserReducer,
  productReducer,
  checkoutReducer,
  customerReducer,
  businessReducer,
  snackbar: snackbarReducer,
  paymentReducer,
  getAllVendors,
  addVendor,
  updateVendor,
  deleteVendor,
  getByIdVendor,
  getAllBills,
  sendMail,
  getAllBankAccounts,
  getAllInvoicePayments,
  getAllCards,
  receiptSettings,
  vendorBank,
  bills: billsReducer,
  deleteCards,
  receipts,
  getAllRecurring,
  getAllRecurringCount,
  getResetLink,
  passwordReset,
  linkVerify,
  paymentSettings
};

// const rootReducer = combineReducers(reducers);
// export default rootReducer;
// 19 jan 2019 21:20:37
const appReducer = combineReducers(reducers);
const rootReducer = (state, action) => {
  if (action.type === ActionTypes.USER_LOGOUT) {
    state = undefined
  }
  return appReducer(state, action)
};

// module.exports = combineReducers(reducers);
module.exports = rootReducer;

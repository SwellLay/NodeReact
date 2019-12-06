import * as types from '../constants/ActionTypes';
import { initialState } from './initialValues';

export const getAllBankAccounts = (state = initialState, { type, payload, message }) => {
    switch (type) {
      case types.GET_ALL_ACCOUNTS_SUCCESS:
        return {
          ...state,
          success: true,
          loading: false,
          error: false,
          data: payload,
          message
        };
      case types.GET_ALL_ACCOUNTS_ERROR:
        return {
          ...state,
          success: false,
          loading: false,
          error: true,
          data: payload,
          message
        };
      case types.GET_ALL_ACCOUNTS_LOADING:
        return {
          ...state,
          loading: true,
          success: false,
          error: false,
          data: payload,
          message
        };
      default:
        return state;
    }
};

export const getAllInvoicePayments = (state = initialState, { type, payload, message }) => {
  switch (type) {
    case types.GET_ALL_INVOICE_PAYMENTS_SUCCESS:
      return {
        ...state,
        success: true,
        loading: false,
        error: false,
        data: payload,
        message
      };
    case types.GET_ALL_INVOICE_PAYMENTS_ERROR:
      return {
        ...state,
        success: false,
        loading: false,
        error: true,
        data: payload,
        message
      };
    case types.GET_ALL_INVOICE_PAYMENTS_LOADING:
      return {
        ...state,
        loading: true,
        success: false,
        error: false,
        data: payload,
        message
      };
    default:
      return state;
  }
};

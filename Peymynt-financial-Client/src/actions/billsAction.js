import { openGlobalSnackbar } from 'actions/snackBarAction';
import * as billsServices from "../api/billsService";
import * as actionTypes from "../constants/ActionTypes";
import history from '../customHistory';

export const getAllBills = (query) => {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.GET_ALL_BILLS_LOADING, payload: null, message: 'Loading' });
    try {
      let allBills = await billsServices.fetchAllBills(query);
      if (allBills.statusCode === 200) {
        return dispatch({ type: actionTypes.GET_ALL_BILLS_SUCCESS, message: allBills.message, payload: allBills.data })
      } else {
        return dispatch({ type: actionTypes.GET_ALL_BILLS_ERROR, payload: allBills.data, message: allBills.message })
      }
    } catch (err) {
      return dispatch({ type: actionTypes.GET_ALL_BILLS_ERROR, payload: err, message: err.message })
    }
  }
};

function setBillLoading() {
  return {
    type: actionTypes.GET_BILL_BY_ID_LOADING,
  };
}

function setBillData(data) {
  return {
    type: actionTypes.GET_BILL_BY_ID_SUCCESS,
    data,
  };
}

function setBillError(message) {
  return {
    type: actionTypes.GET_BILL_BY_ID_ERROR,
    message,
  };
}

export function getBillById(id) {
  return async (dispatch) => {
    dispatch(setBillLoading());
    try {
      const response = await billsServices.fetchBillById(id);
      if (response.statusCode === 200) {
        dispatch(setBillData(response.data.bill));
      } else if (response.statusCode === 404) {
        history.push('/app/404');
      } else {
        dispatch(openGlobalSnackbar(response.message, true));
        dispatch(setBillError(response.message));
      }
    } catch (e) {
      if (e.statusCode === 404) {
        history.push('/app/404');
        return;
      }
      dispatch(openGlobalSnackbar(e.message, true));
      dispatch(setBillError(e.message));
    }
  }
}

export function duplicateBill(id, callback) {
  return async (dispatch) => {
    dispatch(setBillLoading());
    try {
      const response = await billsServices.duplicateBill(id);
      if (response.statusCode === 200) {
        dispatch(setBillData(response.data.bill));
        if (callback) {
          callback(response.data.bill);
        }
      } else {
        dispatch(openGlobalSnackbar(response.message, true));
        dispatch(setBillError(response.message));
      }
    } catch (e) {
      dispatch(openGlobalSnackbar(e.message, true));
      dispatch(setBillError(e.message));
    }
  }
}

export function recordPayment(id, payload, callback) {
  return async (dispatch) => {
    dispatch(setBillLoading());
    try {
      const response = await billsServices.recordPayment(id, { paymentInput: payload });
      if (response.statusCode === 200) {
        if (callback) {
          callback(response.data.payment);
        }
        dispatch(setBillLoading(false));
      } else {
        dispatch(openGlobalSnackbar(response.message, true));
        dispatch(setBillError(response.message));
      }
    } catch (e) {
      dispatch(openGlobalSnackbar(e.message, true));
      dispatch(setBillError(e.message));
    }
  }
}

export function fetchPayments(billId, callback) {
  console.warn(billId);
  return async (dispatch) => {
    try {
      const response = await billsServices.fetchPayments(billId);
      console.warn(response);
      if (response.statusCode === 200) {
        if (callback) {
          callback(response.data);
        }
      } else {
        dispatch(openGlobalSnackbar(response.message, true));
      }
    } catch (e) {
      console.warn(e);
      dispatch(openGlobalSnackbar(e.message, true));
    }
  }
}

export function deletePayment(id, callback) {
  return async (dispatch) => {
    try {
      const response = await billsServices.deletePayment(id);
      if (response.statusCode === 200) {
        dispatch(openGlobalSnackbar(response.message));
        if (callback) {
          callback(undefined, response.data);
        }
      } else {
        dispatch(openGlobalSnackbar(response.message, true));
        if (callback) {
          callback(response.message, response.data);
        }
      }
    } catch (e) {
      console.warn(e);
      dispatch(openGlobalSnackbar(e.message, true));
      if (callback) {
        callback(e);
      }
    }
  }
}

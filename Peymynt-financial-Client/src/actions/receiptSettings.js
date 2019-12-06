import { openGlobalSnackbar } from 'actions/snackBarAction';
import { fetchPurchaseSetting, savePurchaseSetting } from '../api/SettingService';
import {
  GET_RECEIPT_SETTINGS_SUCCESS,
  SET_RECEIPT_SETTINGS_LOADING,
  SET_RECEIPT_SETTINGS_SUCCESS
} from '../constants/ActionTypes';

export function getReceiptSettings(data) {
  return {
    type: GET_RECEIPT_SETTINGS_SUCCESS,
    data,
  };
}

export function setReceiptSettings(data) {
  return {
    type: SET_RECEIPT_SETTINGS_SUCCESS,
    data,
  };
}

export function setReceiptLoading(loading = true) {
  return {
    type: SET_RECEIPT_SETTINGS_LOADING,
    data: loading,
  };
}

export function fetchReceiptSettings() {
  return async (dispatch) => {
    dispatch(setReceiptLoading());
    const response = await fetchPurchaseSetting();
    try {
      if (response.statusCode === 200) {
        dispatch(getReceiptSettings(response.data.purchaseSetting));
      } else {
        dispatch(setReceiptLoading(false));
        dispatch(openGlobalSnackbar(response.message, true));
      }
    } catch (error) {
      dispatch(setReceiptLoading(false));
      dispatch(openGlobalSnackbar(error.message, true));
    }
  };
}

export function saveReceiptSettings(payload) {
  return async (dispatch) => {
    dispatch(setReceiptLoading());
    const response = await savePurchaseSetting({ purchaseSettingInput: payload });
    try {
      if (response.statusCode === 200) {
        dispatch(setReceiptSettings(response.data.purchaseSetting));
      } else {
        dispatch(setReceiptLoading(false));
        dispatch(openGlobalSnackbar(response.message, true));
      }
    } catch (error) {
      console.error(error);
      dispatch(setReceiptLoading(false));
      dispatch(openGlobalSnackbar(error.message, true));
    }
  };
}

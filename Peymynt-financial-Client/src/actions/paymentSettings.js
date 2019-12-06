import { openGlobalSnackbar } from 'actions/snackBarAction';
import { fetchPaymentSetting, savePaymentSetting } from '../api/SettingService';
import {
  GET_PAYMENT_SETTINGS_SUCCESS,
  SET_PAYMENT_SETTINGS_SUCCESS,
  SET_PAYMENT_SETTINGS_LOADING
} from '../constants/ActionTypes';

export function getPaymentSettings(data) {
  return {
    type: GET_PAYMENT_SETTINGS_SUCCESS,
    data,
  };
}

export function setPaymentSettings(data) {
  return {
    type: SET_PAYMENT_SETTINGS_SUCCESS,
    data,
  };
}

export function setPaymentLoading(loading = true) {
  return {
    type: SET_PAYMENT_SETTINGS_LOADING,
    data: loading,
  };
}

export function fetchPaymentSettings() {
  return async (dispatch) => {
    dispatch(setPaymentLoading());
    const response = await fetchPaymentSetting();
    try {
      if (response.statusCode === 200) {
        console.log('checkR', response.data)
        dispatch(getPaymentSettings(response.data.paymentSetting));
      } else {
        dispatch(setPaymentLoading(false));
        dispatch(openGlobalSnackbar(response.message, true));
      }
    } catch (error) {
      dispatch(setPaymentLoading(false));
      dispatch(openGlobalSnackbar(error.message, true));
    }
  };
}

export function savePaymentSettings(payload) {
  return async (dispatch) => {
    dispatch(setPaymentLoading());
    const response = await savePaymentSetting({ paymentSettingInput: payload });
    try {
      if (response.statusCode === 200) {
        dispatch(setPaymentSettings(response.data.paymentSetting));
      } else {
        dispatch(setPaymentLoading(false));
        dispatch(openGlobalSnackbar(response.message, true));
      }
    } catch (error) {
      console.error(error);
      dispatch(setPaymentLoading(false));
      dispatch(openGlobalSnackbar(error.message, true));
    }
  };
}

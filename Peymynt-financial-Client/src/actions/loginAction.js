import history from 'customHistory'

import LoginService from '../api/LoginService'
import { fetchSalesSetting } from '../api/SettingService';
import * as types from '../constants/ActionTypes'
import { setBusinessList, setSelectedBussiness } from './businessAction'
import { openGlobalSnackbar } from './snackBarAction';

/**
 * Action used for authenticate user
 * @param {*} loginPayload
 */
export function login(loginPayload) {
  return async (dispatch, getState) => {
    try {
      const response = await LoginService.authenticate(loginPayload);
      if (response.statusCode === 200) {
        const userData = response.data.user;
        const businessList = userData.businesses;
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user.id', userData._id);
        localStorage.setItem('isStatementVisible', 'Yes');
        localStorage.setItem('user.email', userData.email);
        dispatch(loginSuccess(response.data));
        // dispatch(openGlobalSnackbar(response.message, false, 20000));

        if (businessList.length > 0) {
          let selected = businessList.find(item => {
            return item.isPrimary === true;
          });
          dispatch(setSelectedBussiness(selected || businessList[0]));
          dispatch(setBusinessList(businessList));
          const payload = await fetchSalesSetting();
          payload.data.salesSetting.companyLogo = payload.data.salesSetting.companyLogo || undefined
          dispatch(setUserSettings(payload.data.salesSetting));
          history.push(`/app/dashboard`)
        } else {
          history.push(`/onboarding`)
        }
        return response
      }
      else {
        // return { success: false, erroType: 'message', error: response.errorMessage }
        console.error('------------else response-----------', response);

        return response
      }

    } catch (error) {
      dispatch(openGlobalSnackbar(error && error.data ? error.data.message : error.message, true, 20000))
    }
  };
}

export function googleLogin(googleLoginPayload) {
  return async (dispatch, getState) => {
    try {
      const response = await LoginService.googleAuth(googleLoginPayload);
      if (response.statusCode === 200) {
        const userData = response.data.user;
        const businessList = userData.businesses;
        console.log("businessList : " + JSON.stringify(businessList));
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user.id', userData._id);
        localStorage.setItem('isStatementVisible', 'Yes');
        localStorage.setItem('user.email', userData.email);
        dispatch(loginSuccess(response.data));
        if (businessList.length > 0) {
          let selected = businessList.filter(item => {
            return item.isPrimary === true;
          });
          dispatch(setSelectedBussiness(selected.length > 0 ? selected[0] : businessList[0]));
          dispatch(setBusinessList(businessList));
          const payload = await fetchSalesSetting();
          dispatch(setUserSettings(payload.data.salesSetting));
          history.push(`/app/dashboard`)
        } else {
          history.push(`/onboarding`)
        }
        return response;
      }
      else {
        // return { success: false, erroType: 'message', error: response.errorMessage }
        console.log('------------else response-----------', response);
        return response;
      }
    } catch (error) {
      console.error("errrrrrrrrrrrrrrrrrrrrr", error);
      dispatch(openGlobalSnackbar(error && error.data ? error.data.message : error.message, true, 5000))
    }
  };
}
/**
 * Action used after login success
 * @param {*} responseLogin
 */
export function loginSuccess(token) {
  return { type: types.LOGIN_SUCCESS, token };
}

export const setUserSettings = (payload) => {
  return { type: types.USER_SETTINGS, payload }
};

export function loadLogin() {
  return history.push(`/login`)
}
export const setErrorMessage = (errorMessage) => {
  return { type: types.LOGIN_FAILED, errorMessage }
};

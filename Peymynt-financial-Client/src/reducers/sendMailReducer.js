import * as types from '../constants/ActionTypes';
// import { initialState } from './initialValues';

const initialState = {
    loading: false,
    success: false,
    error: false,
    data: null,
    message: '',
}

export const sendMail = (state = initialState, { type, payload, message }) => {
    switch (type) {
      case types.SENDMAIL_SUCCESS:
        return {
          ...state,
          success: true,
          loading: false,
          error: false,
          data: payload,
          message
        };
      case types.SENDMAIL_ERROR:
        return {
          ...state,
          success: false,
          loading: false,
          error: true,
          data: payload,
          message
        };
      case types.SENDMAIL_LOADING:
        return {
          ...state,
          loading: true,
          success: false,
          error: false,
          data: payload,
          message
        };
      default:
        return initialState;
    }
  }
import * as types from '../constants/ActionTypes';
import { initialState } from './initialValues';

export const getResetLink = (state = initialState, { type, payload }) => {
    switch (type) {
      case types.GENERATE_RESET_LINK_SUCCESS:
        return {
          ...state,
          success: true,
          loading: false,
          error: false,
          data: payload,

        };
      case types.GENERATE_RESET_LINK_ERROR:
        return {
          ...state,
          success: false,
          loading: false,
          error: true,
          data: payload,

        };
      case types.GENERATE_RESET_LINK_LOADING:
        return {
          ...state,
          loading: true,
          success: false,
          error: false,
          data: payload,

        };
      default:
        return state;
    }
};

export const passwordReset = (state = initialState, { type, payload }) => {
    switch (type) {
      case types.RESET_PASSWORD_SUCCESS:
        return {
          ...state,
          success: true,
          loading: false,
          error: false,
          data: payload,

        };
      case types.RESET_PASSWORD_ERROR:
        return {
          ...state,
          success: false,
          loading: false,
          error: true,
          data: payload,

        };
      case types.RESET_PASSWORD_LOADING:
        return {
          ...state,
          loading: true,
          success: false,
          error: false,
          data: payload,

        };
      default:
        return state;
    }
};


export const linkVerify = (state = initialState, { type, payload }) => {
    switch (type) {
      case types.VERIFY_LINK_SUCCESS:
        return {
          ...state,
          success: true,
          loading: false,
          error: false,
          data: payload,

        };
      case types.VERIFY_LINK_ERROR:
        return {
          ...state,
          success: false,
          loading: false,
          error: true,
          data: payload,

        };
      case types.VERIFY_LINK_LOADING:
        return {
          ...state,
          loading: true,
          success: false,
          error: false,
          data: payload,

        };
      default:
        return state;
    }
};
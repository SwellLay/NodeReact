import * as types from '../constants/ActionTypes';
import { initialState } from './initialValues';

export const getAllRecurring = (state = initialState, { type, payload, message }) => {
    switch (type) {
      case types.GET_ALL_RECURRING_SUCCESS:
        return {
          ...state,
          success: true,
          loading: false,
          error: false,
          data: payload,
          message
        };
      case types.GET_ALL_RECURRING_ERROR:
        return {
          ...state,
          success: false,
          loading: false,
          error: true,
          data: payload,
          message
        };
      case types.GET_ALL_RECURRING_LOADING:
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

export const getAllRecurringCount = (state = initialState, { type, payload, message }) => {
    switch (type) {
      case types.GET_ALL_RECURRING_COUNT_SUCCESS:
        return {
          ...state,
          success: true,
          loading: false,
          error: false,
          data: payload,
          message
        };
      case types.GET_ALL_RECURRING_COUNT_ERROR:
        return {
          ...state,
          success: false,
          loading: false,
          error: true,
          data: payload,
          message
        };
      case types.GET_ALL_RECURRING_COUNT_LOADING:
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
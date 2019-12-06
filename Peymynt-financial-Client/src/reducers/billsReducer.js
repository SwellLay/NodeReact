import * as types from '../constants/ActionTypes';
import { GET_BILL_BY_ID_ERROR, GET_BILL_BY_ID_LOADING, GET_BILL_BY_ID_SUCCESS } from '../constants/ActionTypes';
import { initialState } from './initialValues';

export const getAllBills = (state = initialState, { type, payload, message }) => {
  switch (type) {
    case types.GET_ALL_BILLS_SUCCESS:
      return {
        ...state,
        success: true,
        loading: false,
        error: false,
        data: payload,
        message
      };
    case types.GET_ALL_BILLS_ERROR:
      return {
        ...state,
        success: false,
        loading: false,
        error: true,
        data: payload,
        message
      };
    case types.GET_ALL_BILLS_LOADING:
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

export function billsReducer(state = initialState, { type, data, message }) {
  switch (type) {
    case GET_BILL_BY_ID_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_BILL_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        data,
      };

    case GET_BILL_BY_ID_ERROR:
      return {
        ...state,
        data: {},
        loading: false,
        error: true,
        message,
      };
    default:
      return state;
  }
}

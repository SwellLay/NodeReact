import * as types from '../constants/ActionTypes';
import { initialState } from './initialValues';

export const getAllCards = (state = initialState, { type, payload, message }) => {
  switch (type) {
    case types.GET_ALL_CUSTOMER_CARDS_SUCCESS:
      return {
        ...state,
        success: true,
        loading: false,
        error: false,
        data: payload,
        message
      };
    case types.GET_ALL_CUSTOMER_CARDS_ERROR:
      return {
        ...state,
        success: false,
        loading: false,
        error: true,
        data: payload,
        message
      };
    case types.GET_ALL_CUSTOMER_CARDS_LOADING:
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

export const deleteCards = (state = initialState, { type, payload, message }) => {
  switch (type) {
    case types.DELETE_CUSTOMER_CARDS_SUCCESS:
      return {
        ...state,
        success: true,
        loading: false,
        error: false,
        data: payload,
        message
      };
    case types.DELETE_CUSTOMER_CARDS_ERROR:
      return {
        ...state,
        success: false,
        loading: false,
        error: true,
        data: payload,
        message
      };
    case types.DELETE_CUSTOMER_CARDS_LOADING:
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

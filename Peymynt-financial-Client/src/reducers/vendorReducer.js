import * as types from '../constants/ActionTypes';
import {
  GET_BY_ID_VENDOR_BANK_ERROR,
  GET_BY_ID_VENDOR_BANK_LOADING,
  GET_BY_ID_VENDOR_BANK_SUCCESS,
  UPDATE_VENDOR_BANK_ERROR,
  UPDATE_VENDOR_BANK_LOADING,
  UPDATE_VENDOR_BANK_SUCCESS
} from '../constants/ActionTypes';
import { initialState } from './initialValues';

export const getAllVendors = (state = initialState, { type, payload, message }) => {
  switch (type) {
    case types.GET_ALL_VENDORS_SUCESS:
      return {
        ...state,
        success: true,
        loading: false,
        error: false,
        data: payload,
        message
      };
    case types.GET_ALL_VENDORS_ERROR:
      return {
        ...state,
        success: false,
        loading: false,
        error: true,
        data: payload,
        message
      };
    case types.GET_ALL_VENDORS_LOADING:
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

export const addVendor = (state = initialState, { type, payload, message }) => {
  switch (type) {
    case types.ADD_VENDOR_SUCCESS:
      return {
        ...state,
        success: true,
        loading: false,
        error: false,
        data: payload,
        message
      };
    case types.ADD_VENDOR_ERROR:
      return {
        ...state,
        success: false,
        loading: false,
        error: true,
        data: payload,
        message
      };
    case types.ADD_VENDOR_LOADING:
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

export const updateVendor = (state = initialState, { type, payload, message }) => {
  switch (type) {
    case types.UPDATE_VENDOR_SUCCESS:
      return {
        ...state,
        success: true,
        loading: false,
        error: false,
        data: payload,
        message
      };
    case types.UPDATE_VENDOR_ERROR:
      return {
        ...state,
        success: false,
        loading: false,
        error: true,
        data: payload,
        message
      };
    case types.UPDATE_VENDOR_LOADING:
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

export const deleteVendor = (state = initialState, { type, payload, message }) => {
  switch (type) {
    case types.DELETE_VENDOR_SUCCESS:
      return {
        ...state,
        success: true,
        loading: false,
        error: false,
        data: payload,
        message
      };
    case types.DELETE_VENDOR_ERROR:
      return {
        ...state,
        success: false,
        loading: false,
        error: true,
        data: payload,
        message
      };
    case types.DELETE_VENDOR_LOADING:
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

export const getByIdVendor = (state = initialState, { type, payload, message }) => {
  switch (type) {
    case types.GET_BY_ID_VENDOR_SUCCESS:
      return {
        ...state,
        success: true,
        loading: false,
        error: false,
        data: payload,
        message
      };
    case types.GET_BY_ID_VENDOR_ERROR:
      return {
        ...state,
        success: false,
        loading: false,
        error: true,
        data: payload,
        message
      };
    case types.GET_BY_ID_VENDOR_LOADING:
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

const initialBankState = {
  loading: false,
  data: {},
  error: '',
};

export function vendorBank(state = initialBankState, action) {
  switch (action.type) {
    case GET_BY_ID_VENDOR_BANK_LOADING:
    case UPDATE_VENDOR_BANK_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_BY_ID_VENDOR_BANK_SUCCESS:
    case UPDATE_VENDOR_BANK_SUCCESS:
      return {
        ...state,
        loading: false,
        error: '',
        data: {
          ...action.data,
        },
      };
    case GET_BY_ID_VENDOR_BANK_ERROR:
    case UPDATE_VENDOR_BANK_ERROR:
      return {
        ...state,
        loading: false,
        error: action.message,
      };
    default:
      return state;
  }
}

import {
GET_PAYMENT_SETTINGS_SUCCESS,
SET_PAYMENT_SETTINGS_SUCCESS,
SET_PAYMENT_SETTINGS_LOADING
} from '../constants/ActionTypes';

const initialSettings = {
  loading: false,
  data: {
    accept_card: false,
    accept_bank: false,
    preferred_mode: false,
    enabled: false
  },
};

const settings = (state = initialSettings, action) => {
  switch (action.type) {
    case GET_PAYMENT_SETTINGS_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          ...action.data,
        },
        loading: false,
      };
    case SET_PAYMENT_SETTINGS_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          ...action.data,
        },
        loading: false,
      };
    case SET_PAYMENT_SETTINGS_LOADING:
      return {
        ...state,
        loading: action.data,
      };
    default:
      return state;
  }
};

export default settings;

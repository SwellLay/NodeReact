import {
  GET_RECEIPT_SETTINGS_SUCCESS,
  SET_RECEIPT_SETTINGS_LOADING,
  SET_RECEIPT_SETTINGS_SUCCESS
} from '../constants/ActionTypes';

const initialSettings = {
  loading: false,
  data: {
    upload_via_mail: false,
    capture_automatically: false,
  },
};

const settings = (state = initialSettings, action) => {
  switch (action.type) {
    case GET_RECEIPT_SETTINGS_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          ...action.data,
        },
        loading: false,
      };
    case SET_RECEIPT_SETTINGS_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          ...action.data,
        },
        loading: false,
      };
    case SET_RECEIPT_SETTINGS_LOADING:
      return {
        ...state,
        loading: action.data,
      };
    default:
      return state;
  }
};

export default settings;

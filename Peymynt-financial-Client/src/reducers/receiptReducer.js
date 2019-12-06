import {
  LIST_RECEIPTS_ERROR,
  LIST_RECEIPTS_LOADING,
  LIST_RECEIPTS_SUCCESS,
  UPDATE_RECEIPT_LOADING,
  UPLOAD_RECEIPT_ERROR,
  UPLOAD_RECEIPT_LOADING,
  UPLOAD_RECEIPT_PROGRESS,
  UPLOAD_RECEIPT_SUCCESS,
} from '../constants/ActionTypes';

const initialSettings = {
  loading: false,
  uploading: false,
  updating: false,
  progress: 0,
  data: {},
  list: [],
  message: ''
};

const receipts = (state = initialSettings, action) => {
  switch (action.type) {
    case UPLOAD_RECEIPT_SUCCESS:
      return {
        ...state,
        data: action.data,
        progress: 0,
        uploading: false,
        message: ''
      };
    case UPLOAD_RECEIPT_ERROR:
      return {
        ...state,
        uploading: false,
        progress: 0,
        message: action.message
      };
    case UPLOAD_RECEIPT_PROGRESS:
      return {
        ...state,
        progress: action.data,
      };
    case UPLOAD_RECEIPT_LOADING:
      return {
        ...state,
        uploading: action.data,
      };
    case LIST_RECEIPTS_SUCCESS:
      return {
        ...state,
        list: action.data,
        loading: false,
        message: ''
      };
    case LIST_RECEIPTS_ERROR:
      return {
        ...state,
        loading: false,
        message: action.message
      };
    case LIST_RECEIPTS_LOADING:
      return {
        ...state,
        loading: action.data,
      };
    case UPDATE_RECEIPT_LOADING:
      return {
        ...state,
        updating: action.data,
      };
    default:
      return state;
  }
};

export default receipts;

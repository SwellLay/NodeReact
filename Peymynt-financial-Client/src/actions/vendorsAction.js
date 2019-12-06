import { openGlobalSnackbar } from 'actions/snackBarAction';
import vendorServices, { fetchVendorAccounts, updateVendorAccounts } from "../api/vendorsService";
import * as actionTypes from '../constants/ActionTypes';
import {
  GET_BY_ID_VENDOR_BANK_ERROR,
  GET_BY_ID_VENDOR_BANK_LOADING,
  GET_BY_ID_VENDOR_BANK_SUCCESS,
  UPDATE_VENDOR_BANK_SUCCESS
} from '../constants/ActionTypes';

export const getAllVendors = () => {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.GET_ALL_VENDORS_LOADING, payload: null, message: 'Loading' });
    try {
      let allVendors = await vendorServices.fetchAllVendors();
      if (allVendors.statusCode === 200) {
        return dispatch({
          type: actionTypes.GET_ALL_VENDORS_SUCESS,
          message: allVendors.message,
          payload: allVendors.data
        })
      } else {
        return dispatch({
          type: actionTypes.GET_ALL_VENDORS_ERROR,
          payload: allVendors.data,
          message: allVendors.message
        })
      }
    } catch (err) {
      console.log("allVendors Error ===> ", err);
      return dispatch({
        type: actionTypes.GET_ALL_VENDORS_ERROR,
        payload: err,
        message: err.message || 'Something Went Wrong!'
      })
    }
    // return ProductServices.addProduct(productInfo)
    //     .then(addProductResponse => {
    //         if (addProductResponse.statusCode === 201) {
    //             dispatch({
    //                 type: actionTypes.ADD_PRODUCT
    //             });
    //             return addProductResponse.data.product
    //         }
    //     })
    //     .catch(err => {
    //         console.error("--> error while adding product : => ", err);
    //         return err;
    //     });
  };
};

export const addVendor = vendorInput => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.ADD_VENDOR_LOADING, payload: null, messgae: 'Loading' });
    try {
      let addVendor = await vendorServices.addVendor({ vendorInput: vendorInput });
      if (addVendor.statusCode === 201) {
        return dispatch({ type: actionTypes.ADD_VENDOR_SUCCESS, payload: addVendor.data, message: addVendor.message })
      } else {
        return dispatch({ type: actionTypes.ADD_VENDOR_ERROR, payload: addVendor.data, message: addVendor.message })
      }
    } catch (err) {
      console.log('Error in add vendor ====>', err);
      return dispatch({
        type: actionTypes.ADD_VENDOR_ERROR,
        payload: err,
        message: err.message || 'Something Went Wrong!'
      })
    }
  }
};

export const updateVendor = (vendorInput, id) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.UPDATE_VENDOR_LOADING, payload: null, messgae: 'Loading' });
    try {
      let updateVendor = await vendorServices.updateVendor({ vendorInput: vendorInput }, id);
      if (updateVendor.statusCode === 200) {
        return dispatch({
          type: actionTypes.UPDATE_VENDOR_SUCCESS,
          payload: updateVendor.data,
          message: updateVendor.message
        })
      } else {
        return dispatch({
          type: actionTypes.UPDATE_VENDOR_ERROR,
          payload: updateVendor.data,
          message: updateVendor.message
        })
      }
    } catch (err) {
      console.log('Error in add vendor ====>', err);
      return dispatch({
        type: actionTypes.UPDATE_VENDOR_ERROR,
        payload: err,
        message: err.message || 'Something Went Wrong!'
      })
    }
  }
};

export const deleteVendor = id => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.DELETE_VENDOR_LOADING, payload: null, messgae: 'Loading' });
    try {
      let deleteVendor = await vendorServices.deleteVendor(id);
      if (deleteVendor.statusCode === 200) {
        return dispatch({
          type: actionTypes.DELETE_VENDOR_SUCCESS,
          payload: deleteVendor.data,
          message: deleteVendor.message
        })
      } else {
        return dispatch({
          type: actionTypes.DELETE_VENDOR_ERROR,
          payload: deleteVendor.data,
          message: deleteVendor.message
        })
      }
    } catch (err) {
      console.log('Error in add vendor ====>', err);
      return dispatch({
        type: actionTypes.DELETE_VENDOR_ERROR,
        payload: err,
        message: err.message || 'Something Went Wrong!'
      })
    }
  }
};

export const getByIdVendor = id => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.GET_BY_ID_VENDOR_LOADING, payload: null, messgae: 'Loading' });
    try {
      let getByIdVendor = await vendorServices.getByIdVendor(id);
      if (getByIdVendor.statusCode === 200) {
        return dispatch({
          type: actionTypes.GET_BY_ID_VENDOR_SUCCESS,
          payload: getByIdVendor.data,
          message: getByIdVendor.message
        })
      } else {
        return dispatch({
          type: actionTypes.GET_BY_ID_VENDOR_ERROR,
          payload: getByIdVendor.data,
          message: getByIdVendor.message
        })
      }
    } catch (err) {
      console.log('Error in add vendor ====>', err);
      return dispatch({
        type: actionTypes.GET_BY_ID_VENDOR_ERROR,
        payload: err,
        message: err.message || 'Something Went Wrong!'
      })
    }
  }
};

export function getVendorBankDetails(data) {
  return {
    type: GET_BY_ID_VENDOR_BANK_SUCCESS,
    data,
  };
}

function setVendorBankDetailsError(message) {
  return {
    type: GET_BY_ID_VENDOR_BANK_ERROR,
    message,
  };
}

function setVendorBankDetails(data) {
  return {
    type: UPDATE_VENDOR_BANK_SUCCESS,
    data,
  };
}

function setVendorBankDetailsLoading() {
  return {
    type: GET_BY_ID_VENDOR_BANK_LOADING,
  };
}

export function fetchVendorBankDetails(id) {
  return async (dispatch) => {
    dispatch(setVendorBankDetailsLoading());
    try {
      const response = await fetchVendorAccounts(id);
      if (response.statusCode === 200) {
        dispatch(getVendorBankDetails(response.data.account));
      } else {
        dispatch(setVendorBankDetailsError(response.message));
        dispatch(openGlobalSnackbar(response.message, true));
      }
    } catch (error) {
      dispatch(setVendorBankDetailsError(error.message));
      dispatch(openGlobalSnackbar(error.message, true));
    }
  };
}

export function saveVendorBankDetails(id, payload, callback) {
  return async (dispatch) => {
    dispatch(setVendorBankDetailsLoading());
    try {
      const response = await updateVendorAccounts(id, { accountInput: payload });
      if (response.statusCode === 200) {
        dispatch(setVendorBankDetails(response.data.account));
        dispatch(openGlobalSnackbar('Bank details saved!'));
        if (callback) {
          callback(response.data.account);
        }
      } else {
        dispatch(setVendorBankDetailsError(response.message));
        dispatch(openGlobalSnackbar(response.message, true));
      }
    } catch (error) {
      console.error(error);
      dispatch(setVendorBankDetailsError(error.message));
      dispatch(openGlobalSnackbar(error.message, true));
    }
  };
}

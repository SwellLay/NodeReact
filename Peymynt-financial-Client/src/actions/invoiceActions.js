import * as invoiceServices from "../api/InvoiceService";
import * as actionTypes from "../constants/ActionTypes";

export const getBankAccounts = data => {
    return async (dispatch, getState) => {
      dispatch({ type: actionTypes.GET_ALL_ACCOUNTS_LOADING, payload: null, message: 'Loading' });
        try{
            let allACCOUNTS = await invoiceServices.getBankAccounts(data);
          console.log('allAccounts', allACCOUNTS);
            if(allACCOUNTS.statusCode === 200){
                return dispatch({type: actionTypes.GET_ALL_ACCOUNTS_SUCCESS, message: allACCOUNTS.message, payload: allACCOUNTS.data})
            }else{
                return dispatch({type: actionTypes.GET_ALL_ACCOUNTS_ERROR, payload: allACCOUNTS.data, message: allACCOUNTS.message})
            }
        }catch(err){
          console.log("allACCOUNTS Error ===> ", err);
            return dispatch({type: actionTypes.GET_ALL_ACCOUNTS_ERROR, payload: err, message: 'Something Went Wrong!'})
        }
    }
};

export const getInvoicePayments = id => {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.GET_ALL_INVOICE_PAYMENTS_LOADING, payload: null, message: 'Loading' });
    try {
      let allPayments = await invoiceServices.getInvoicePayments(id);
      console.log('allPayments', allPayments);
      if (allPayments.statusCode === 200) {
        return dispatch({
          type: actionTypes.GET_ALL_INVOICE_PAYMENTS_SUCCESS,
          message: allPayments.message,
          payload: allPayments.data
        })
      } else {
        return dispatch({
          type: actionTypes.GET_ALL_INVOICE_PAYMENTS_ERROR,
          payload: allPayments.data,
          message: allPayments.message
        })
      }
    } catch (err) {
      console.log("allPayments Error ===> ", err);
      return dispatch({
        type: actionTypes.GET_ALL_INVOICE_PAYMENTS_ERROR,
        payload: err,
        message: 'Something Went Wrong!'
      })
    }
  }
};

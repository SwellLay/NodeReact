import * as recurringService from "../api/RecurringService";
import * as actionTypes from "../constants/ActionTypes";

export const getAllRecurringInvoices = query => {
    return async (dispatch, getState) => {
      dispatch({ type: actionTypes.GET_ALL_RECURRING_LOADING, payload: null, message: 'Loading' });
        try{
            let allRecurringData = await recurringService.getRecurringInvoices(query);
          console.log('allAccounts', allRecurringData);
            if(allRecurringData.statusCode === 200){
                return dispatch({type: actionTypes.GET_ALL_RECURRING_SUCCESS, message: allRecurringData.message, payload: allRecurringData.data})
            }else{
                return dispatch({type: actionTypes.GET_ALL_RECURRING_ERROR, payload: allRecurringData.data, message: allRecurringData.message})
            }
        }catch(err){
          console.log("allRecurringData Error ===> ", err);
            return dispatch({type: actionTypes.GET_ALL_RECURRING_ERROR, payload: err, message: 'Something Went Wrong!'})
        }
    }
};

export const getRecurringCounts = query => {
    return async (dispatch, getState) => {
      dispatch({ type: actionTypes.GET_ALL_RECURRING_COUNT_LOADING, payload: null, message: 'Loading' });
        try{
            let allRecurringCount = await recurringService.getRecurringInvoicesCount(query);
          console.log('allAccounts', allRecurringCount);
            if(allRecurringCount.statusCode === 200){
                return dispatch({type: actionTypes.GET_ALL_RECURRING_COUNT_SUCCESS, message: allRecurringCount.message, payload: allRecurringCount.data})
            }else{
                return dispatch({type: actionTypes.GET_ALL_RECURRING_COUNT_ERROR, payload: allRecurringCount.data, message: allRecurringCount.message})
            }
        }catch(err){
          console.log("allRecurringCount Error ===> ", err);
            return dispatch({type: actionTypes.GET_ALL_RECURRING_COUNT_ERROR, payload: err, message: 'Something Went Wrong!'})
        }
    }
};
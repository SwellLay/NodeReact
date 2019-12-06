import CustomerServices from '../api/CustomerServices';
import * as actionTypes from '../constants/ActionTypes';
import { openGlobalSnackbar } from './snackBarAction';

export const addCustomer = (customerInfo)=> {
    return async (dispatch) => {
        try {
          let response = await CustomerServices.addCustomer(customerInfo);
            if(response.statusCode===201){
                 dispatch({
                    type: actionTypes.ADD_CUSTOMER
                });
                return response.data.customer
            }
        } catch (error) {
            dispatch(openGlobalSnackbar('Something went worng, please try again', true))
        }
    }
};

export const resetAddCustomer = ()=> {
    return async (dispatch) =>{
        return dispatch({
            type: actionTypes.RESET_ADD_CUSTOMER
        });
    };
};

export const updateCustomer =(customerId, customerInfo) => {
    return async dispatch => {
        try {
          const response = await CustomerServices.updateCustomerById(customerId, customerInfo);
            if (response.statusCode === 200) {
                dispatch({
                    type: actionTypes.UPDATE_CUSTOMER
                });
                return response.data.customer
            }
        } catch (error) {
          console.error('----error in updatecustomer action', error);
            dispatch(openGlobalSnackbar('Something went worng, please try again', true))
        }
    }
};

export const deleteCustomer =(id) => {
    return async (dispatch) => {
        try {
          const response = await CustomerServices.deleteCustomer(id);
            if (response.statusCode === 200) {
                return { message: "success" }
            }
        } catch (error) {
            dispatch(openGlobalSnackbar('Something went worng, please try again', true))
        }
    }
};

export const fetchCustomers = ()=> {
    return async(dispatch) => {
        try {
          let response = await CustomerServices.fetchCustomers();
                if(response.statusCode === 200){
                    return dispatch({
                        type: actionTypes.FETCH_CUSTOMERS,
                        payload: response.data.customers
                    });
                }
            } catch (error) {
          console.error('------error-------> ', error.message);
                dispatch(openGlobalSnackbar('Something went worng, please try again', true))
        }
    }
};

export const setSelectedCustomer = (customer) => {
    return {
        type: actionTypes.FETCH_CUSTOMER_BY_ID,
        selectedCustomer: customer
    }
};

export const setCountry = (country) => {
    return {
        type: actionTypes.SET_COUNTRY,
        payload: country
    }
};

export const setCountrytStates = (selectedCountryStates) => {
    return {
        type: actionTypes.SET_STATES,
        payload: selectedCountryStates
    };
};

export const setCountrytStatesForShipping = (selectedCountryStates) => {
    return {
        type: actionTypes.SET_STATES_FOR_SHIPPING,
        payload: selectedCountryStates
    };
};

export const resetCountrytStates = (selectedCountryStates) => {
    return {
        type: actionTypes.RESET_STATES
    };
};

// export function seCountrytStates(selectedCountryStates) {
//     return function (dispatch) {
//         return dispatch({
//             type: actionTypes.SET_STATES,
//             payload: selectedCountryStates
//         });
//     }
// }


export const fetchCustomerById = (customerId) => {
    return async dispatch => {
        try {
          const response = await CustomerServices.fetchCustomerById(customerId);
            if (response.statusCode === 200) {
                return dispatch(setSelectedCustomer(response.data.customer))
            }
        } catch (error) {
          console.error("fetch customer by Id error", error);
            dispatch(openGlobalSnackbar('Something went worng, please try again', true))
        }
    }
};

export const fetchCountries=  async() => {
    try {
        const response = await CustomerServices.fetchCountries();
        if (response) {
            return response.countries;
        }
    } catch (error) {
        console.error('-------error in fetching country------> ',error)
    }
};

export const fetchCurrencies = async() => {
    try {
        const response = await CustomerServices.fetchCurrencies();
        if (response) {
            return response;
        }
    } catch (error) {
        return error;
    }
};



export  const fetchStatesByCountryId = async(id) => {
    try {
        const response = await CustomerServices.fetchStatesByCountryId(id);
        if (response) {
            return response;
        }
    } catch (error) {
        return error;
    }
};

export const fetchAllCustomerCards = id => {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.GET_ALL_CUSTOMER_CARDS_LOADING, payload: null, message: 'Loading' });
    try {
      const response = await CustomerServices.fetchCustomerCards(id);
      if (response.statusCode === 200) {
        return dispatch({
          type: actionTypes.GET_ALL_CUSTOMER_CARDS_SUCCESS,
          payload: response.data,
          message: response.message
        })
      } else {
        return dispatch({
          type: actionTypes.GET_ALL_CUSTOMER_CARDS_ERROR,
          payload: response.data,
          message: response.message
        })
      }
    } catch (err) {
      return dispatch({
        type: actionTypes.GET_ALL_CUSTOMER_CARDS_ERROR,
        payload: err,
        message: err.message
      })
    }
  }
};

export const deleteCustomerCard = (id, cardId) => {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.DELETE_CUSTOMER_CARDS_LOADING, payload: null, message: 'Loading' });
    try {
      const response = await CustomerServices.deleteCustomerCards(id, cardId);
      if (response.statusCode === 200) {
        return dispatch({
          type: actionTypes.DELETE_CUSTOMER_CARDS_SUCCESS,
          payload: response.data,
          message: response.message
        })
      } else {
        return dispatch({
          type: actionTypes.DELETE_CUSTOMER_CARDS_ERROR,
          payload: response.data,
          message: response.message
        })
      }
    } catch (err) {
      return dispatch({
        type: actionTypes.DELETE_CUSTOMER_CARDS_ERROR,
        payload: err,
        message: err.message
      })
    }
  }
};

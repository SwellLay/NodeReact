import history from "customHistory";
import CheckoutServices from "../api/CheckoutService";
import * as actionTypes from "../constants/ActionTypes";
import { errorHandle } from "../actions/errorHandling";
import { openGlobalSnackbar } from './snackBarAction';

export const checkoutError = errorMessage => {
    return { type: actionTypes.CHECKOUT_FAILED, errorMessage };
};

export const checkoutList = checkouts => {
    return {
        type: actionTypes.FETCH_CHECKOUTS,
        payload: checkouts
    };
};

export function resetAddCheckout() {
    return function (dispatch) {
        return dispatch({
            type: actionTypes.RESET_ADD_CHECKOUT
        });
    };
}

export const addCheckout = (checkoutInfo)=> {
    return async (dispatch) => {
        try {
            let response= await CheckoutServices.addCheckout(checkoutInfo)
            if(response.statusCode===201){
                 dispatch({
                    type: actionTypes.ADD_CHECKOUT
                });
                return response.data.checkout
            }
        } catch (error) {
            dispatch(openGlobalSnackbar('Something went worng, please try again', true))
        }
        
    }
}

export function fetchCheckouts() {
    return async dispatch => {
        return CheckoutServices.fetchCheckouts()
            .then(checkoutsResponse => {
                console.log("=> fetchCheckouts Response ===> ", checkoutsResponse);
                if (checkoutsResponse.statusCode === 200) {
                    console.log(
                        " => inside success (200) checkouts list , ",
                        checkoutsResponse.data
                    );
                    return dispatch(checkoutList(checkoutsResponse.data.checkouts));
                } else if (response.statusCode === 351) {
                    return dispatch(checkoutList([]));
                }
            })
            .catch(error => {
                console.log("--> error while fetching checkouts : => ", error);
            });
    };
}

export function fetchCheckoutByUUID(uuid) {
    return async dispatch => {
        return CheckoutServices.fetchCheckoutByUUID(uuid)
            .then(checkoutsResponse => {
                console.log("=> fetchCheckoutByUUID Response ===> ", checkoutsResponse);
                if (checkoutsResponse.statusCode === 200) {
                    console.log(
                        " => inside success (200) checkouts list , ",
                        checkoutsResponse.data
                    );
                    return dispatch(checkoutList(checkoutsResponse.data));
                }
            })
            .catch(error => {
                console.log("--> error while fetching checkouts : => ", error);
            });
    };
}

export function fetchCheckoutById(checkoutId) {
    return async dispatch => {
        try {
            const response = await CheckoutServices.fetchCheckoutById(checkoutId);
            if (response.statusCode === 200) {
                return dispatch({
                    type: actionTypes.FETCH_CHECKOUT_BY_ID,
                    selectedCheckout: response.data.checkout
                });
            }
        } catch (error) {
            dispatch(checkoutError(error));
        }
    };
}

export function deleteCheckout(id) {
    return function (dispatch) {
        return CheckoutServices.deleteCheckout(id)
            .then(checkoutResponse => {
                console.log("=> deleteCustomer Response ===> ", checkoutResponse);
                if (checkoutResponse.statusCode === 200) {
                    console.log("=> 200 Response ===> ", checkoutResponse);
                    return { message: "success" };
                }
            })
            .catch(error => {
                console.log("--> error in deleting customer : ", error);
                return dispatch({
                    type: actionTypes.CHECKOUT_FAILED,
                    payload: error
                });
            });
    };
}

export function doCheckoutPayment(checkoutInfo) {
    return function (dispatch, getState) {
        return CheckoutServices.doCheckoutPaymentById(checkoutInfo)
            .then(checkoutPaymentResponse => {
                console.log("=> checkoutPaymentResponse ===> ", checkoutPaymentResponse);
                if (checkoutPaymentResponse.statusCode === 201) {
                    return dispatch({
                        type: actionTypes.CHECKOUT_PAYMENT
                    });
                }
            })
            .catch(errorResposne => {
                console.log("--> error while checkout payment : => ", errorResposne);
                return dispatch({
                    error: errorResposne.data
                })
            });
    };
}

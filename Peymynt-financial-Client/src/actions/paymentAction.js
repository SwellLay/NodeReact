import PaymentServices from "../api/paymentService";
import * as actionTypes from "../constants/ActionTypes";
import { openGlobalSnackbar } from './snackBarAction';
import history from 'customHistory';

export const addBodyToPayment = (paymentArg) => {
    return async (dispatch) => {
      dispatch({ type: actionTypes.ADD_PAYMENT_LOADING, payload: null});
      try {
        let response = await PaymentServices.patchPayment(paymentArg);
        if (response.statusCode === 200) {
          return dispatch({
            type: actionTypes.FETCH_PAYMENT_STATE,
            data: response.data
        });
        } 
      } catch (err) {
        console.log("Error while payment onboarding ===> ", err);
      }
    };
  };


export function getOnboardingStatus() {
    return function (dispatch, getState) {
        return PaymentServices.fetchPayment()
            .then(addOnboardingResponse => {
                console.log("=> addOnboardingResponse ===> ", addOnboardingResponse);
                if (addOnboardingResponse.statusCode === 200) {
                    return dispatch({
                        type: actionTypes.FETCH_PAYMENT_STATE,
                        data: addOnboardingResponse.data
                    });
                } else if (!addOnboardingResponse || addOnboardingResponse.statusCode === 351) {
                    return dispatch({
                        type: actionTypes.FETCH_PAYMENT_STATE,
                        data: []
                    });
                }
            })
            .catch(errorResposne => {
                console.log("--> error while payment onboarding : => ", errorResposne);
                return dispatch({
                    error: errorResposne.data
                })
            });
    };
}

export const verifyPaymentOnboarding = (tos_args) => {
    return async (dispatch) => {
      dispatch({ type: actionTypes.ADD_PAYMENT_LOADING, payload: null});
      try {
        let response = await PaymentServices.verify(tos_args);
        if (response.statusCode === 200) {
            return dispatch({
                type: actionTypes.VERIFY_ONBOARDING,
                data: response.data
            });
        }else{
            return dispatch({
                type: actionTypes.VERIFY_ONBOARDING_ERROR,
                data: response.data
            });
        }
      } catch (errorResposne) {
        console.log("--> error while verifying payment onboarding : => ", errorResposne);
                return dispatch({
                    type: actionTypes.VERIFY_ONBOARDING_ERROR,
                    data: errorResposne
                });
      }
    };
  };
// export function verifyPaymentOnboarding(tos_args) {
//     return function (dispatch, getState) {
//         return PaymentServices.verify(tos_args)
//             .then(verifyResponse => {
//                 console.log("=> verifyResponse ===> ", verifyResponse);
//                 if (verifyResponse.statusCode === 200) {
//                     return dispatch({
//                         type: actionTypes.VERIFY_ONBOARDING,
//                         data: verifyResponse.data
//                     });
//                 }else{
//                     return dispatch({
//                         type: actionTypes.VERIFY_ONBOARDING_ERROR,
//                         data: verifyResponse.data
//                     });
//                 }
//             })
//             .catch(errorResposne => {
//                 console.log("--> error while verifying payment onboarding : => ", errorResposne);
//                 return dispatch({
//                     type: actionTypes.VERIFY_ONBOARDING_ERROR,
//                     data: errorResposne
//                 });
//             });
//     };
// }

export function getPaymentById(id) {
    return function (dispatch, getState) {
        return PaymentServices.getPaymentById(id)
            .then(paymentResponse => {
                console.log("=> paymentResponse ===> ", paymentResponse);
                if (paymentResponse.statusCode === 200) {
                    return dispatch({
                        type: actionTypes.GET_PAYMENT_BY_ID,
                        data: paymentResponse.data
                    });
                }else if(paymentResponse.statusCode ===400 ){
                    history.push(`${process.env.WEB_URL}/app/400`)
                }else{
                    history.push(`${process.env.WEB_URL}/app/error/500`)
                }
            })
            .catch(errorResposne => {
                console.log("--> error while getting payment records : => ", errorResposne);
            });
    };
}

export function getAllPayments(tos_args) {
    return function (dispatch, getState) {
        return PaymentServices.getAllPayments(tos_args)
            .then(paymentResponse => {
                console.log("=> paymentResponse ===>", paymentResponse);
                if (paymentResponse.statusCode === 200) {
                    return dispatch({
                        type: actionTypes.GET_ALL_PAYMENT_RECORDS,
                        data: paymentResponse.data,
                        message: paymentResponse.message,
                        statusCode: paymentResponse.statusCode
                    });
                } else if (paymentResponse.statusCode === 351) {
                    return dispatch({
                        type: 'GET_ALL_PAYMENT_ERROR',
                        data: [],
                        message: paymentResponse.message,
                        statusCode: paymentResponse.statusCode
                    });
                } else if (paymentResponse.statusCode === 351) {
                    history.push('/app/payments/kyc')
                    return dispatch({
                        type: 'GET_ALL_PAYMENT_ERROR',
                        data: [],
                        message: paymentResponse.message,
                        statusCode: paymentResponse.statusCode
                    });
                }
            })
            .catch(errorResposne => {
                console.log("--> error while getting payment records : => ", errorResposne);
                return dispatch({
                    type: 'GET_ALL_PAYMENT_ERROR',
                    data: errorResposne,
                    message: 'No Data',
                    statusCode: errorResposne.statusCode
                })
            });
    };
}

export function getRefundById(id) {
    return function (dispatch, getState) {
        return PaymentServices.getRefundById(id)
            .then(refundResponse => {
                console.log("=> refundResponse ===> ", refundResponse);
                if (refundResponse.statusCode === 200) {
                    return dispatch({
                        type: actionTypes.GET_REFUND_BY_ID,
                        data: refundResponse.data
                    });
                }
            })
            .catch(errorResposne => {
                console.log("--> error while getting payment records : => ", errorResposne);
            });
    };
}

export function getRefundByPaymentId(id) {
    return function (dispatch, getState) {
        return PaymentServices.getRefundByPaymentId(id)
            .then(refundResponse => {
                console.log("=> refundResponse ===> ", refundResponse);
                if (refundResponse.statusCode === 200) {
                    return dispatch({
                        type: actionTypes.GET_REFUND_BY_PAYMENT_ID,
                        data: refundResponse.data
                    });
                }
            })
            .catch(errorResposne => {
                console.log("--> error while getting payment records : => ", errorResposne);
            });
    };
}

export function getAllRefunds(tos_args) {
    return function (dispatch, getState) {
        return PaymentServices.getAllRefunds(tos_args)
            .then(refundResponse => {
                console.log("=> refundResponse ===> ", refundResponse);
                if (refundResponse.statusCode === 200) {
                    return dispatch({
                        type: actionTypes.GET_ALL_REFUND_RECORDS,
                        data: refundResponse.data
                    });
                }
            })
            .catch(errorResposne => {
                console.log("--> error while getting payment records : => ", errorResposne);
            });
    };
}

export function postNewRefund(body) {
    return function (dispatch, getState) {
        return PaymentServices.createRefund(body)
            .then(refundResponse => {
                console.log("=> refundResponse ===> ", refundResponse);
                if (refundResponse.statusCode === 200) {
                    dispatch(openGlobalSnackbar('Refund has been initiated successfully', false))
                    return dispatch({
                        type: actionTypes.POST_REFUND,
                        data: refundResponse.data
                    });
                }
            })
            .catch(errorResposne => {
                console.log("--> error while getting payment records : => ", errorResposne);
                dispatch(openGlobalSnackbar(errorResposne.message, true))
            });
    };
}

export const chargeCard = body => {
    return async(dispatch) => {
        dispatch({type: actionTypes.CHARGE_CARD_LOADING});
        try{
            let chargeCardRes = await PaymentServices.chargeCardService(body)
            if(chargeCardRes.statusCode===200){
                return dispatch({type: actionTypes.CHARGE_CARD_SUCCESS, payload: chargeCardRes.data, message: chargeCardRes.message})
            }else{
                return dispatch({type: actionTypes.CHARGE_CARD_ERROR, payload: chargeCardRes.data, message: chargeCardRes.message})
            }
        }catch(err){
            return dispatch({type: actionTypes.CHARGE_CARD_ERROR, payload: err, message: 'Something went wrong.'})
        }
    }
}
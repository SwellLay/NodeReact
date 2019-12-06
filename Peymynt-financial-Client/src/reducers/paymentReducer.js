import {
  ADD_PAYMENT_LOADING,
    FETCH_PAYMENT_STATE,
    ADD_BUSINESS_TYPE_ONBOARDING,
    ADD_BUSINESS_DETAIL_ONBOARDING,
    ADD_YOUR_DETAIL_ONBOARDING,
    ADD_BANK_DETAIL_ONBOARDING,
    ADD_CUSTOMIZED_STATEMENT_ONBOARDING,
    VERIFY_ONBOARDING,
    GET_ALL_PAYMENT_RECORDS,
    GET_PAYMENT_INTERMEDIATE_DATA,
    GET_ALL_REFUND_RECORDS,
    POST_REFUND,
    GET_PAYMENT_BY_ID,
    GET_REFUND_BY_ID,
    CHARGE_CARD_ERROR,
    CHARGE_CARD_LOADING,
    CHARGE_CARD_SUCCESS,
    GET_REFUND_BY_PAYMENT_ID
  } from '../constants/ActionTypes';

  const initialState = {
    onboardingBody : {},
    verified: false,
    paymentRecords: [],
    paymentData:null,
    paymentIntermediateData:null,
    paymentDataLoaded:false,
    statusCode: 200,
    loading:false
  }

  const paymentReducer = (state = initialState, action) => {
    
  	switch(action.type){
      case 'ADD_PAYMENT_LOADING':
  			return {
          ...state,
          loading:true,
  			}
  			break;
  		case 'FETCH_PAYMENT_STATE':
  			return {
          ...state,
          loading:false,
  				onboardingBody: action.data ? action.data.business : {}
  			}
  			break;
      case 'VERIFY_ONBOARDING':
        return {
          ...state,
          tosAcceptance: action.data ? action.data : {},
          verified: true,
          error: false
        }
        break;
      case 'VERIFY_ONBOARDING_ERROR':
        return {
          ...state,
          tosAcceptance: action.data ? action.data : {},
          verified: false,
          error: true,
        }
        break;
      case 'GET_ALL_PAYMENT_ERROR':
        return {
          statusCode: action.statusCode ? action.statusCode : 200,
          paymentRecords: null,
          paymentDataLoaded:true,
          message:(action.message)? action.message : ''
        }
        break;
      case GET_ALL_PAYMENT_RECORDS:
        return {
          ...state,
          paymentRecords: (action.data && action.data.payments) ? action.data.payments : [],
          paymentData:action.data,
          statusCode: action.statusCode ? action.statusCode : 200,
          verified: (action.data && action.data.verification && action.data.verification.isVerified)? true : false,
          paymentDataLoaded:true,
          message:(action.message)? action.message : ''
        }
        break;
      case GET_PAYMENT_INTERMEDIATE_DATA:
        return {
          ...state,
          paymentIntermediateData: action.data,
          paymentDataLoaded:true
        }
        break;
      case GET_ALL_REFUND_RECORDS:
        return {
          ...state,
          refundRecords: action.data.refunds ? action.data.refunds : []
        }
        break;
      case POST_REFUND:
        return {
          ...state,
          refundInfo: action.data
        }
        break;
      case GET_PAYMENT_BY_ID:
        return {
          paymentInfo: action.data.payment
        }
        break;
      case GET_REFUND_BY_ID:
        return {
          refundInfo: action.data.refund
        }
        break;
      case CHARGE_CARD_SUCCESS:
        return {
          loading: false,
          success: true,
          error: false,
          data: action.payload,
          message: action.message
        }
        break;
      case CHARGE_CARD_LOADING:
          return {
            loading: true,
            success: false,
            error: false,
            data: null,
            message: 'loading'
          }
          break;
      case CHARGE_CARD_ERROR:
          return {
            loading: false,
            success: false,
            error: true,
            data: action.payload,
            message: action.message
          }
          break;
      case GET_REFUND_BY_PAYMENT_ID:
          return{
            loading: false,
            success: true,
            error: false,
            data: action.data,
            refundList: action.data.refunds
        }
  		default:
  			return {
  				...state
  			}
  			break;
  	}
  }

  module.exports = paymentReducer;
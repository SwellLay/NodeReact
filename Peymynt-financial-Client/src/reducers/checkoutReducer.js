import * as actionTypes from '../constants/ActionTypes';

const initialSettings = {
    checkouts: [],
    selectedCheckout: {},
    errorMessage: '',
    isCheckoutAdd: false,
    isCheckoutUpdate: false
};
const checkoutReducer = (state = initialSettings, action) => {
    switch (action.type) {
        case actionTypes.ADD_CHECKOUT:
            return {
                ...state,
                isCheckoutAdd: true
            }
        case actionTypes.UPDATE_CHECKOUT:
            return {
                ...state,
                isCheckoutUpdate: true
            }

        case actionTypes.RESET_ADD_CHECKOUT:
            return {
                ...state,
                isCheckoutAdd: false,
                isCheckoutUpdate: false
            }

        case actionTypes.FETCH_CHECKOUTS:
            return {
                ...state,
                checkouts: action.payload,
                errorMessage: ''
            }
        case actionTypes.CHECKOUT_FAILED:
            return {
                ...state,
                errorMessage: action.errorMessage
            }
        case actionTypes.FETCH_CHECKOUT_BY_ID:
            return {
                ...state,
                selectedCheckout: action.selectedCheckout,
                errorMessage: ''
            }
        default:
            return state;
    }
};

module.exports = checkoutReducer;

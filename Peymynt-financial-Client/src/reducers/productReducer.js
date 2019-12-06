import * as actionTypes from '../constants/ActionTypes';

const initialSettings = {
    products: [],
    selectedProduct: {},
    errorMessage: '',
    isProductAdd: false,
    isProductUpdate: false
};
const productReducer = (state = initialSettings, action) => {
    switch (action.type) {
        case actionTypes.ADD_PRODUCT:
            return {
                ...state,
                isProductAdd: true
            }
        case actionTypes.UPDATE_PRODUCT:
            return {
                ...state,
                isProductUpdate: true
            }

        case actionTypes.RESET_ADD_PRODUCT:
            return {
                ...state,
                isProductAdd: false,
                isProductUpdate: false
            }

        case actionTypes.FETCH_PRODUCTS:
            return {
                ...state,
                products: action.payload,
                errorMessage: ''
            }
        case actionTypes.PRODUCT_FAILED:
            return {
                ...state,
                errorMessage: action.errorMessage
            }
        case actionTypes.FETCH_PRODUCT_BY_ID:
            return {
                ...state,
                selectedProduct: action.selectedProduct,
                errorMessage: ''
            }
        default:
            return state;
    }
};

module.exports = productReducer;

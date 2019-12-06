import * as actionTypes from '../constants/ActionTypes';

const initialSettings = {
    customers: [],
    selectedCustomer: {},
    errorMessage: '',
    isCustomerAdd: false,
    isCustomerUpdate: false,
    countryCurrencyList: [],
    selectedCountry: {},
    selectedState: {},
    selectedCountryStates: [],
    selectedCountryStatesForShipping: []
};
const customerReducer = (state = initialSettings, action) => {
    switch (action.type) {
        case actionTypes.DEMO:
            return {
                ...state,
                demo: action.isDemo
            };

        case actionTypes.RESET_ADD_CUSTOMER:
            return {
                ...state,
                isCustomerAdd: false,
                isCustomerUpdate: false,
            };

        case actionTypes.ADD_CUSTOMER:
            return {
                ...state,
                isCustomerAdd: true
            };

        case actionTypes.UPDATE_CUSTOMER:
            return {
                ...state,
                isCustomerUpdate: true
            };

        case actionTypes.FETCH_CUSTOMERS:
            return {
                ...state, customers: action.payload
            }

        case actionTypes.CUSTOMER_FAILED:
            return {
                ...state, errorMessage: action.payload
            }
        case actionTypes.FETCH_CUSTOMER_BY_ID:
            return {
                ...state,
                selectedCustomer: action.selectedCustomer,
                errorMessage: ''
            }
        case actionTypes.SET_COUNTRY:
            return {
                ...state,
                selectedCountry: action.payload
            }
        case actionTypes.SET_STATES:
            return {
                ...state,
                selectedCountryStates: action.payload.states
            }

        case actionTypes.RESET_STATES:
            return {
                ...state,
                // selectedCountryStates: [],
                // selectedCountry: {}
            }

        case actionTypes.SET_STATES_FOR_SHIPPING:
            return {
                ...state,
                selectedCountryStatesForShipping: action.payload.states
            }
        default:
            return state;
    }
};

module.exports = customerReducer;

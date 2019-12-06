import * as actionTypes from '../constants/ActionTypes';

const initialSettings = {
    business: [],
    errorMessage:''

};
const businessReducer = (state = initialSettings, action) => {
    switch (action.type) {
        case actionTypes.FETCH_BUSINESS:
            return {
                ...state,
                business: action.payload,
                errorMessage:''
            }
            case actionTypes.SELECTED_BUSINESS:
            return{
                ...state,
                selectedBusiness:action.selectedBusiness,
                errorMessage:''
            }
            case actionTypes.BUSINESS_FAILED:
            return{
                ...state,
                errorMessage:action.errorMessage

            }
        default:
            return state;
    }
};

module.exports = businessReducer;

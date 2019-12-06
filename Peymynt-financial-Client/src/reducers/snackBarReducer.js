import * as actionTypes from '../constants/ActionTypes';
import moment from'moment';

const initialSettings = {
    message: '',
    duration: 6000,
    open: false,
    error: false
};
const snackBarReducer = (state = initialSettings, action) => {
    switch (action.type) {
        case actionTypes.OPEN_SNACKBAR:
            return {
                ...state,
                message : action.data.message,
                duration : action.data.duration,
                open: true,
                error: action.data.error
            }
        case actionTypes.CLOSE_SNACKBAR:
            return {
                ...state,
                message : '',
                duration : 6000,
                open: false,
                error: false
            }
        case actionTypes.UPDATE_DATA:
        return{
            ...state,
            updateData:moment.unix()
        }

        default:
            return state;
    }
};

export default snackBarReducer;

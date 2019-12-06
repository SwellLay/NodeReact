import history from 'customHistory';
import profileServices from '../api/profileService';
import * as actionTypes from '../constants/ActionTypes';

import { errorHandle } from './errorHandling';
import { openGlobalSnackbar } from './snackBarAction';

export const updateUser = (userInput)=> {
    let id = localStorage.getItem('user.id');
    return async (dispatch) => {
        try {
            let response= await profileServices.updateUser(userInput, id)
            if(response.statusCode===200){
                dispatch({
                    type: actionTypes.UPDATE_USER, data: response.data
                });
                console.log("response", response.data)
                return response.data.user
            }
        } catch (error) {
            dispatch(openGlobalSnackbar('Something went worng, please try again', true))
        }
    }
}

export const changePass = (data)=> {
    let id = localStorage.getItem('user.id');
    return async (dispatch) => {
        try {
            let response= await profileServices.changePass(data)
            if(response.statusCode===200){
                dispatch({
                    type: actionTypes.CHANGE_PASS, data: response.data
                });
                console.log("response", response.data)
                return response.data
            }
        } catch (error) {
            dispatch(openGlobalSnackbar('Something went worng, please try again', true))
        }
    }
}
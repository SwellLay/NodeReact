import * as types from '../constants/ActionTypes'

import history from 'customHistory'

import LoginService from '../api/LoginService'

export const generateResetLink = data => {
    return async (dispatch, getState) => {
        dispatch({type: types.GENERATE_RESET_LINK_LOADING});
        try{
            const res = await LoginService.generateResetLink(data);
            if(res.statusCode === 200){
                if(!!res.data && !!res.data.publicToken){
                    localStorage.setItem('reset-publicToken', res.data.publicToken)
                }
                return dispatch({type: types.GENERATE_RESET_LINK_SUCCESS, payload: res.data})
            }else{
                return dispatch({type: types.GENERATE_RESET_LINK_ERROR, payload: res.data})
            }
        }catch(err){
            return dispatch({type: types.GENERATE_RESET_LINK_ERROR, payload: err})
        }
    }
}

export const resetPassword = data => {
    return async (dispatch, getState) => {
        dispatch({type: types.RESET_PASSWORD_LOADING});
        try{
            const res = await LoginService.resetPassword(data);
            if(res.statusCode === 200){
                return dispatch({type: types.RESET_PASSWORD_SUCCESS, payload: res.data})
            }else{
                return dispatch({type: types.RESET_PASSWORD_ERROR, payload: res.data})
            }
        }catch(err){
            return dispatch({type: types.RESET_PASSWORD_ERROR, payload: err})
        }
    }
}

export const verifyLink = token => {
    return async (dispatch, getState) => {
        dispatch({type: types.VERIFY_LINK_LOADING});
        try{
            const res = await LoginService.verifyResetLink(token);
            if(res.statusCode === 200){
                return dispatch({type: types.VERIFY_LINK_SUCCESS, payload: res.data})
            }else{
                return dispatch({type: types.VERIFY_LINK_ERROR, payload: res.data})
            }
        }catch(err){
            return dispatch({type: types.VERIFY_LINK_ERROR, payload: err})
        }
    }
}
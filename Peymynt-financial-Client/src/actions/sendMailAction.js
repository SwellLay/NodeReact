import * as types from '../constants/ActionTypes';
import {sendMail} from '../api/sendMailService';

export const sendMailAction = (id, payload) => {
    return async(dispatch, getState) => {
        console.log("in sendMail")
        try{
            dispatch({type: types.SENDMAIL_LOADING, message: 'Loading', payload: null});
            let res = await sendMail(id, payload);
            if(res.statusCode === 200){
                return dispatch({type: types.SENDMAIL_SUCCESS, message: res.message, payload: res.data})
            }else{
                return dispatch({type: types.SENDMAIL_ERROR, payload: res.data, message: res.message})
            }
        }catch(err) {
            console.log("err in send mail", err)
            return dispatch({type: types.SENDMAIL_ERROR, payload: err, message: 'Something went Wrong.'})
        }
    }
}
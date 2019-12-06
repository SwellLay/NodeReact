import {
    LOGIN_SUCCESS,
    LOGIN_FAILED 
  } from '../constants/ActionTypes';

  const initialLogin = {
    token : ''
  }

  const appUserReducer = (state = initialLogin, action)=>{
      switch(action.type){
          case LOGIN_SUCCESS : return{
              ...state,
              token : action.token,
              errorMessage:''
          }
          case LOGIN_FAILED:
          return{
              ...state,
              errorMessage:action.errorMessage
          }
          default:
      return state;
      }
  }

  module.exports = appUserReducer
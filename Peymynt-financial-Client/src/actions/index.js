import * as types from '../constants/ActionTypes';

export function demo(isDemo) {
  return { type: types.DEMO, isDemo };
}

export const openPayment = ()=>{
  return{
    type:types.OPEN_PAYMENT
  }
}

export const closePayment = ()=>{
  return{
    type:types.CLOSE_PAYMENT
  }
}

export const openMailBox = ()=>{
  return{
    type:types.OPEN_MAIL
  }
}

export const closeMailBox = ()=>{
  return{
    type:types.CLOSE_MAIL
  }
}
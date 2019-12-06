
import request from './request'

function authenticate(data) {
  return request({
    url: '/api/v1/authenticate',
    method: 'POST',
    data
  });
}


function googleAuth(data) {
  return request({
    url: '/api/v1/authenticate/google',
    method: 'POST',
    data
  });
}

export const forgotPassword = data =>{
  return request({
    url: '/api/v1/utility/forgot',
    method: 'POST',
    data
  });
}

const generateResetLink = data =>{
  return request({
    url: '/api/v1/authenticate/password/reset',
    method: 'POST',
    data
  });
}

const resetPassword = data =>{
  return request({
    url: '/api/v1/authenticate/password/reset/confirm',
    method: 'POST',
    data
  });
}

const verifyResetLink = (token) => {
  return request({
    url: `/api/v1/authenticate/password/reset/${token}/verify`,
    method: 'GET'
  });
}

const LoginService = {
  authenticate, googleAuth, generateResetLink, verifyResetLink, resetPassword
}

export default LoginService;




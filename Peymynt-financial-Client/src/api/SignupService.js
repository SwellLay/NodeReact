import request from './request'

function registration(data) {
  return request({
    url: '/api/v1/register',
    method: 'POST',
    data
  });
}



// function emailVerify(uidb64, token) {
//   return request({
//     url: '/users/activate/' + uidb64 + '/' + token,
//     method: 'GET'
//   });
// }

const SignupService = {
  registration
  //emailVerif
}

export default SignupService;




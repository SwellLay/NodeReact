import { HTTP_PUT } from '../components/app/components/Estimates/components/constant';
import requestWithToken from './requestWithToken'

const profileServices = {
  updateUser,
  changePass,
  deletePass,
  getUserById,
  getUserNotifications,
  updateUserNotifications,
  getConnectedAccounts,
  getConnectedEmails,
  addConnectedEmail,
  addConnectedAccount,
  setPrimaryEmail,
  deleteConnectedEmail,
  deleteConnectedAccount,
};

function updateUser(data, id) {
  return requestWithToken({
    url: `/api/v1/users/${id}`,
    method: HTTP_PUT,
    data
  });
}

function changePass(data) {
  return requestWithToken({
    url: `/api/v1/authenticate/changepassword`,
    method: 'POST',
    data
  });
}

function deletePass(id) {
  return requestWithToken({
    url: `/api/v1/users/${id}`,
    method: 'DELETE'
  });
}

function getUserById(id) {
  return requestWithToken({
    url: `/api/v1/users/${id}`,
    method: 'GET'
  });
}

function getUserNotifications(id) {
  return requestWithToken({
    url: `/api/v1/users/${id}/notifications`,
    method: 'GET'
  });
}

function updateUserNotifications(id, data) {
  return requestWithToken({
    url: `/api/v1/users/${id}/notifications`,
    method: 'PATCH',
    data,
  });
}

function getConnectedAccounts(id) {
  return requestWithToken({
    url: `/api/v1/users/${id}/accounts`,
    method: 'GET'
  });
}

function getConnectedEmails(id) {
  return requestWithToken({
    url: `/api/v1/users/${id}/emails`,
    method: 'GET'
  });
}

function addConnectedEmail(id, data) {
  return requestWithToken({
    url: `/api/v1/users/${id}/emails`,
    method: 'POST',
    data,
  });
}

function addConnectedAccount(id, data) {
  return requestWithToken({
    url: `/api/v1/users/${id}/accounts`,
    method: 'POST',
    data,
  });
}

function deleteConnectedEmail(id, email) {
  return requestWithToken({
    url: `/api/v1/users/${id}/emails/${email}`,
    method: 'DELETE',
  });
}

function deleteConnectedAccount(id, accountId) {
  return requestWithToken({
    url: `/api/v1/users/${id}/accounts/${accountId}`,
    method: 'DELETE',
  });
}

function setPrimaryEmail(id, emailId) {
  return requestWithToken({
    url: `/api/v1/users/${id}/emails/${emailId}`,
    method: 'PUT',
  });
}

export default profileServices;

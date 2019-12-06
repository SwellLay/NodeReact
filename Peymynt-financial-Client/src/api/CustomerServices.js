import { HTTP_DELETE, HTTP_GET, HTTP_PUT } from '../components/app/components/Estimates/components/constant';
import requestWithToken from './requestWithToken'

const customerServices = {
  addCustomer,
  fetchCustomers,
  deleteCustomer,
  fetchCustomerById,
  updateCustomerById,
  fetchCountries,
  fetchCurrencies,
  csvUploadForCustomers,
  fetchCustomerCards,
  deleteCustomerCards
};

function addCustomer(data) {
  return requestWithToken({
    url: '/api/v1/customers',
    method: 'POST',
    data
  });
}
function csvUploadForCustomers(data) {
  return requestWithToken({
    url: '/api/v1/customers/import',
    method: 'POST',
    data
  });
}

function fetchCustomers() {
  return requestWithToken({
    url: '/api/v1/customers',
    method: 'GET'
  })
}

function deleteCustomer(id) {
  return requestWithToken({
    url: '/api/v1/customers/' + id,
    method: 'DELETE'
  });
}

function fetchCustomerById(customerId) {
  return requestWithToken({
    url: '/api/v1/customers/' + customerId,
    method: 'GET'
  })
}

function updateCustomerById(customerId, data) {
  return requestWithToken({
    url: `/api/v1/customers/${customerId}`,
    method: HTTP_PUT,
    data
  })
}


function fetchCountries() {
  return requestWithToken({
    url: '/api/v1/utility/countries/',
    method: 'GET'
  })
}


export const fetchStatesByCountryId = (id) => {
  return requestWithToken({
    url: '/api/v1/utility/countries/' + id,
    method: 'GET'
  })
};


function fetchCurrencies() {
  return requestWithToken({
    url: '/api/v1/utility/currencies/',
    method: 'GET'
  })
}

function fetchCustomerCards(id) {
  return requestWithToken({
    url: `/api/v1/customers/${id}/cards`,
    method: HTTP_GET
  })
}

function deleteCustomerCards(id, cardId) {
  return requestWithToken({
    url: `/api/v1/customers/${id}/cards/${cardId}`,
    method: HTTP_DELETE
  })
}
export default customerServices;

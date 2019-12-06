import requestWithToken from './requestWithToken'
import axios from 'axios'

function addCompany(data) {
  return requestWithToken({
    url: '/api/v1/businesses',
    method: 'POST',
    data
  });
}

export const updateCompany = (id, data) => {
  return requestWithToken({
    url: `/api/v1/businesses/${id}`,
    method: 'PATCH',
    data
  });
}

export const fetchBusiness = () => {
  return requestWithToken({
    url: '/api/v1/businesses',
    method: 'GET'
  });
}

export const fetchBusinessById = (businessId) => {
  return requestWithToken({
    url: `/api/v1/businesses/${businessId}`,
    method: 'GET'
  });
}

export const deleteBusinessById = (businessId) => {
  return requestWithToken({
    url: `/api/v1/businesses/${businessId}`,
    method: 'DELETE'
  });
}

export const fetchBusinessCountries = () => {
  return requestWithToken({
    url: '/api/v1/businesses/countries',
    method: 'GET'
  })
}

export const fetchSignedUrl = (data) => {
  return requestWithToken({
    url: '/api/v1/aws/signedurl',
    method: 'POST',
    data
  })
}

export const uploadImage = (url, data, contentType) => {
  return axios({
    method: 'put',
    url: url,
    headers: { 'Content-Type': contentType },
    data
  });

}

export const fetchArchiveBusiness = () => {
  return requestWithToken({
    url: '/api/v1/businesses/list/archived',
    method: 'GET'
  })
}

export const restoreBusiness = (id) => {
  return requestWithToken({
    url: `/api/v1/businesses/${id}/restore`,
    method: 'PATCH'
  })
}

const BusinessService = {
  addCompany,
  fetchBusiness,
  fetchBusinessCountries,
  fetchArchiveBusiness,
  restoreBusiness
}

export default BusinessService;




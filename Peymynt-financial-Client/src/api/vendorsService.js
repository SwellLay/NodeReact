import { HTTP_DELETE, HTTP_GET, HTTP_POST, HTTP_PUT } from '../components/app/components/Estimates/components/constant';
import requestWithToken from './requestWithToken'

const vendorServices = {
    fetchAllVendors,
    addVendor,
    updateVendor,
    deleteVendor,
    getByIdVendor,
    csvUpload,
};

function fetchAllVendors() {
    return requestWithToken({
        url: `/api/v1/vendors`,
        method: 'GET'
    })
}

function csvUpload(data) {
    return requestWithToken({
        url: '/api/v1/vendors/import',
        method: 'POST',
        data
    });
}

function getByIdVendor(id) {
    return requestWithToken({
        url: `/api/v1/vendors/${id}`,
        method: 'GET'
    })
}

function addVendor(data) {
    return requestWithToken({
        url: `/api/v1/vendors`,
        method: HTTP_POST,
        data
    })
}

function updateVendor(data, id) {
    return requestWithToken({
        url: `/api/v1/vendors/${id}`,
        method: HTTP_PUT,
        data
    })
}

function deleteVendor(id) {
    return requestWithToken({
        url: `/api/v1/vendors/${id}`,
        method: HTTP_DELETE
    })
}

export function fetchVendorAccounts(id) {
    return requestWithToken({
        url: `/api/v1/vendors/${id}/accounts`,
        method: HTTP_GET,
    })
}

export function updateVendorAccounts(id, data) {
    return requestWithToken({
        url: `/api/v1/vendors/${id}/accounts`,
        method: HTTP_PUT,
        data,
    });
}


export default vendorServices;

import requestWithToken from './requestWithToken'
export const HTTP_POST = "POST";
export const HTTP_GET = "GET";
export const HTTP_PUT = "PUT";
export const HTTP_DELETE = "DELETE";
export const HTTP_PATCH = "PATCH";
const checkoutServices = {
    addCheckout,
    fetchCheckouts,
    fetchCheckoutById,
    fetchCheckoutByUUID,
    deleteCheckout,
    doCheckoutPayment
}

function addCheckout(data) {
    return requestWithToken({
        url: '/api/v1/checkouts',
        method: 'POST',
        data
    });
}

function fetchCheckoutById(checkoutId) {
    return requestWithToken({
        url: '/api/v1/checkouts/' + checkoutId,
        method: 'GET'
    })
}

function fetchCheckoutByUUID(uuid) {
    return requestWithToken({
        url: '/api/v1/checkouts/' + uuid + '/public',
        method: 'GET'
    })
}

function fetchCheckouts() {
    return requestWithToken({
        url: '/api/v1/checkouts',
        method: 'GET'
    })
}

export const updateCheckoutById = (checkoutId, updateData) => {
    return requestWithToken({
        url: `/api/v1/checkouts/${checkoutId}`,
        method: HTTP_PUT,
        data: updateData
    });
};


function deleteCheckout (checkoutId) {
    return requestWithToken({
        url: `api/v1/checkouts/${checkoutId}`,
        method: "DELETE"
    })
}

function doCheckoutPayment(data) {
    return requestWithToken({
        url: '/api/v1/payments/checkout/charge',
        method: 'POST',
        data: data
    });
}

export default checkoutServices;

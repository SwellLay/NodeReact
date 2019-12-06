import requestWithToken from './requestWithToken'

const taxServices = {
    addTax,
    fetchTaxes
}
function addTax(data) {
    return requestWithToken({
        url: '/api/v1/taxes',
        method: 'POST',
        data
    });
}

function fetchTaxes() {
    return requestWithToken({
        url: '/api/v1/taxes',
        method: 'GET'
    })
}

export default taxServices;

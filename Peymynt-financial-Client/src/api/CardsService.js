import requestWithToken from './requestWithToken'

export const initiateCard = id => {
    return requestWithToken({
        url: `/api/v1/customers/${id}/cards/initiate`,
        method: 'POST'
    });
}

export const addCard = (id, data) => {
    return requestWithToken({
        url: `/api/v1/customers/${id}/cards`,
        method: 'POST',
        data
    });
}

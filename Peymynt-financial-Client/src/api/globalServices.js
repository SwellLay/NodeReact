import requestWithToken from './requestWithToken'

export const fetchCountries = ()=> {
    return requestWithToken({
        url: '/api/v1/utility/countries/',
        method: 'GET'
    })
}


export const  fetchStatesByCountryId = id => {
    return requestWithToken({
        url: '/api/v1/utility/countries/' + id,
        method: 'GET'
    })
}


export const fetchCurrencies = () => {
    return requestWithToken({
        url: '/api/v1/utility/currencies/',
        method: 'GET'
    })
}

export const currentExchangeRate = async (base, current) => {
    return requestWithToken({
        url: `/api/v1/utility/exchangerate?base=${base}&current=${current}`,
        method: "GET"
    });
};


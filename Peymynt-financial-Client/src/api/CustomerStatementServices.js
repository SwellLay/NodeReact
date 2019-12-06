import requestWithToken from './requestWithToken'

const customerStatementServices = {
    fetchCustomerStatements,
    getPublicStatement,
    generateStatement
}


function fetchCustomerStatements(filterQueryData) {
    var data = filterQueryData;

    return requestWithToken({
        url: `/api/v1/statements`,
        method: 'POST',
        data
    })
}

function getPublicStatement(uuid) {
    return requestWithToken({
        url: `api/v1/statements/` + uuid,
        method: 'GET'
    })
}

function generateStatement(filterQueryData) {
    var data = filterQueryData;

    return requestWithToken({
        url: `/api/v1/statements/generate`,
        method: 'POST',
        data
    })
}


export default customerStatementServices;

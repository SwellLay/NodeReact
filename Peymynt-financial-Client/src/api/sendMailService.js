import requestWithToken from './requestWithToken'

export const sendMail = (id, data)=> {
    return requestWithToken({
        url: `/api/v1/utility/sendemail/${id}`,
        method: 'post',
        data
    })
}

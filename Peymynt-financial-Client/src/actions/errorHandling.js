export function errorHandle(error) {
    if (error.data && error.data.items && error.data.items.non_field_errors) {
        return error.data.items.non_field_errors[0];
    } else if (error.data && error.data.items && Object.keys(error.data.items).length > 0){
        return error.data.items
    } else if (error.data && error.data.message) {
        return error.data.message;
    } else if (error && error.message) {
        return error.message;
    } else {
        return 'Internal server error, Please try after some time'
    }
}
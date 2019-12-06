import { CLOSE_SNACKBAR, OPEN_SNACKBAR, UPDATE_DATA } from "../constants/ActionTypes";

export const openGlobalSnackbar = (message, error, duration=6000) => {
    console.log("i npoen", message, error)
    return {
        type: OPEN_SNACKBAR,
        data: { message, duration, error }
    }
}

export const closeGlobalSnackbar = () => {
    return {
        type: CLOSE_SNACKBAR
    }
}

export const updateData = () =>{
    return{
        type:UPDATE_DATA
    }
}
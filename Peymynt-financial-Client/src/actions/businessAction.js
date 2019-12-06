import history from 'customHistory';
import BusinessService from '../api/businessService';
import * as actionTypes from '../constants/ActionTypes';
import profileServices from '../api/profileService';
import { fetchSalesSetting } from '../api/SettingService';
import { setUserSettings } from './loginAction';

export const businessError = (errorMessage) => {
    return { type: actionTypes.BUSINESS_FAILED, errorMessage }
}

export const setBusinessList = (business) => {
    return {
        type: actionTypes.FETCH_BUSINESS,
        payload: business
    }
}

export function logoutAction() {
    return { type: actionTypes.USER_LOGOUT };
}

export function fetchBusiness() {
    return async (dispatch, getState) => {
        try {
            let response = await BusinessService.fetchBusiness();
            if (response.statusCode === 200) {
                const businessList = response.data.businesses
                if (businessList.length > 0) {
                    let businessId = localStorage.getItem('businessId')
                    let selected = businessList.find(item => {
                        return item._id === businessId
                    })
                    // let selectedBusiness = getState().businessReducer.selectedBusiness
                    // selectedBusiness = selectedBusiness ? selectedBusiness : businessList[0]
                    dispatch(setSelectedBussiness(selected || businessList[0]))
                    const payload = await fetchSalesSetting()
                    dispatch(setUserSettings(payload.data.salesSetting));
                    return dispatch(setBusinessList(businessList));
                } else {
                    history.push('/onboarding')
                }
            }

        } catch (error) {
            dispatch(businessError(error.errorMessage))
        }
    }
}

export const setSelectedBussiness = selectedBusiness => {
    localStorage.setItem('businessId', selectedBusiness._id)
    return {
        type: actionTypes.SELECTED_BUSINESS,
        selectedBusiness
    }
}


export const setPrimaryBussiness = (selectedBusiness, id) => {
    return async (dispatch, getState) => {
        try {
            let response = await profileServices.updateUser({userInput: {primaryBusiness:  selectedBusiness._id}}, id);
            if(response.statusCode === 200){
                // dispatch(setSelectedBussiness(selectedBusiness));
                const payload = await fetchSalesSetting()
                dispatch(setUserSettings(payload.data.salesSetting));
                // window.location.href = '/'
            }
        } catch (err) {
            console.log("err", err)
        }
    }
}

export const restoreBusiness = (id) => {
    return async (dispatch, getState) => {
        try {
            let response = await BusinessService.restoreBusiness(id);
            if(response.statusCode === 200){
                // dispatch(setSelectedBussiness(selectedBusiness));
                // dispatch(setUserSettings(payload.data.salesSetting));
                // window.location.href = '/'
            }
        } catch (err) {
            console.log("err", err)
        }
    }
}

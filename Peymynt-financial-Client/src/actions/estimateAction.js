export function fetchBusiness() {
    return async (dispatch, getState) => {
        try {
            let response = await BusinessService.fetchBusiness();
            if (response.statusCode === 200) {
                const businessList = response.data.businesses
                if (businessList.length > 0) {
                    let selected = businessList.filter(item => {
                        return item.isPrimary === true
                    })
                    // let selectedBusiness = getState().businessReducer.selectedBusiness
                    // selectedBusiness = selectedBusiness ? selectedBusiness : businessList[0]
                    dispatch(setSelectedBussiness(selected.length > 0 ? selected[0] : businessList[0]))
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
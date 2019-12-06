export const initialCustomerObject = (state, isEditMode, businessInfo) => {
  console.log("stae, isEditMode, businessInfo", state, "=>", isEditMode, "=>", businessInfo);
    let data = {
        id: state && state._id || '',
        customerName: state && state.customerName || '',
        email: state && state.email || '',
        firstName: state && state.firstName || '',
        lastName: state && state.lastName || '',
        userId: state && state.userId || localStorage.getItem('user.id'),
        businessId: state && state.businessId || localStorage.getItem('businessId'),
        communication: state && state.communication || communicationPayload(),
        addressBilling: state && state.addressBilling || addressBillingPayload(businessInfo),
        addressShipping: state && state.addressShipping || addressShippingPayload(businessInfo),
        currency: currencyObject(isEditMode, state, businessInfo),
        isShipping:state && state.isShipping || false
    };
    if (!isEditMode) {
        delete data.id
    }
    return data
};

export const currencyObject = (isEdit, state, businessInfo) => {
    console.log("currencyObject", state)
    let defaultObject = {
        name: '',
        code: '',
        displayName: '',
        symbol: ''
    };
    if (isEdit) {
        if (state && state.currency && state.currency.name === '') {
            defaultObject = businessInfo && businessInfo.currency || defaultObject
        } else {
            defaultObject = state && state.currency || defaultObject
        }
    }
    return defaultObject
};

export const communicationPayload = () => {
    const data = {
        accountNumber: '',
        phone: '',
        fax: '',
        mobile: '',
        tollFree: '',
        website: ''
    };
    return data
};

export const addressBillingPayload = (businessInfo) => {
    try {
        if(businessInfo){
            businessInfo.country["id"] = parseInt(businessInfo.country.id);
        }
    } catch (error) {
        console.error("got error")
    }
    let data = {
      country: {
            id: 0,
            name: '',
            sortname: ''
        },
        state: {
            id: '',
            name: '',
            country_id: ''
        },
        city: '',
        addressLine1: '',
        addressLine2: '',
        postal: ""
    };
    return data
};

export const addressShippingPayload = (businessInfo) => {
    try {
        if(businessInfo){
            businessInfo.country["id"] = parseInt(businessInfo.country.id);
        }
    } catch (error) {
        console.error("got error",error)
    }
    const data = {
        contactPerson: '',
        phone: '',
      country: {
            id: 0,
            name: '',
            sortname: ''
        },
        state: {
            id: '',
            name: '',
            country_id: ''
        },
        city: '',
        postal: "",
        addressLine1: '',
        addressLine2: '',
        deliveryNotes: ''
    };
    return data
};

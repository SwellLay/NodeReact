export const businessObject = (state)=>{
    let payload = {
        _id : (state && state._id) || "",
        organizationName : (state && state.organizationName) || "",
        businessType : (state && state.businessType) || "",
        businessSubType : (state && state.businessSubType) || "",
        organizationType : (state && state.organizationType) || "",
        address : (state && addressObject(state.address)) || addressObject(),
        timezone: (state && state.timezone) || timeZoneObject,
        communication: (state && state.communication) || communicationObject,
        currency: (state && state.currency) || currencyObj
    }
    return payload
}
const addressObject = (address) =>{
return {
    country: address && address.country || undefined,
      state: address && address.state || undefined,
      city:  address && address.city || "",
      postal:  address && address.postal || null,
      addressLine1:  address && address.addressLine1 || "",
      addressLine2: address && address.addressLine2 || ""
}
}
const timeZoneObject = {
    displayName: "",
    offset: "",
    timeZoneShortName: ""
}

const communicationObject = {
    phone: "",
    fax: "",
    mobile: "",
    tollFree: "",
    website: ""
  }

 export const timeZoneList = [
    { timeZoneShortName : "", offset: '(GMT-03:00)', displayName: 'America/Argentina/Salta' },
    { timeZoneShortName : "", offset: '(GMT-03:00)', displayName: 'America/Argentina/San_Juan' },
    { timeZoneShortName : "", offset: '(GMT-03:00)', displayName: 'America/Argentina/San_Luis' },
    { timeZoneShortName : "", offset: '(GMT-03:00)', displayName: 'America/Argentina/Tucuman' },
    { timeZoneShortName : "", offset: '(GMT-03:00)', displayName: 'America/Argentina/Ushuaia' },
    { timeZoneShortName : "", offset: '(GMT-04:00)', displayName: 'America/Aruba' },
    { timeZoneShortName : "", offset: '(GMT-04:00)', displayName: 'America/Asuncion' },
    { timeZoneShortName : "", offset: '(GMT-05:00)', displayName: 'America/Atikokan' },
    { timeZoneShortName : "", offset: '(GMT-09:00)', displayName: 'America/Atka' },
    { timeZoneShortName : "", offset: '(GMT-03:00)', displayName: 'America/Bahia' }
  ]

  export const currencyObj = () => {
      return {
          code: "",
          name: "",
          symbol: "",
          displayName: ""
      }
  }
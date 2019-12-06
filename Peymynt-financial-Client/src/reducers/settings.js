import APPCONFIG from 'constants/Config';
import {
  DEMO, OPEN_PAYMENT, CLOSE_PAYMENT, OPEN_MAIL, CLOSE_MAIL, USER_SETTINGS 
} from '../constants/ActionTypes';

// const initialSettings = APPCONFIG.settings;

const initialSettings={
  isPayment:false,
  isMailBox:false,
  userSettings:{
    businessId: localStorage.getItem("businessId"),
    template: "contemporary",
    companyLogo: undefined,
    displayLogo: false,
    accentColour: "#000000",
    invoiceSetting: {
        defaultPaymentTerm: {
            key: "dueOnReceipt",
            value: "Due upon receipt"
        },
        defaultTitle: "Invoice",
        defaultSubTitle: "",
        defaultFooter: "",
        defaultMemo: ""
    },
    estimateSetting: {
        defaultTitle: "Estimate",
        defaultSubTitle: "",
        defaultFooter: "",
        defaultMemo: ""
    },
    itemHeading: {
        column1: {
            name: "Items",
            shouldShow: true
        },
        column2: {
            name: "Quantity",
            shouldShow: true
        },
        column3: {
            name: "Price",
            shouldShow: true
        },
        column4: {
            name: "Amount",
            shouldShow: true
        },
        hideItem: false,
        hideDescription: false,
        hideQuantity: false,
        hidePrice: false,
        hideAmount: false
    }
}
}

const settings = (state = initialSettings, action) => {
  switch (action.type) {
    case DEMO:
      return {
        ...state,
        demo: action.isDemo
      }
      case USER_SETTINGS : return{
        ...state,
        userSettings:action.payload
      }  
      case OPEN_PAYMENT: return{
        ...state,
        isPayment:true,
        isMailBox:false
      }
      case CLOSE_PAYMENT: return{
        ...state,
        isMailBox:false,
        isPayment:false
      }
      case OPEN_MAIL: return{
        ...state,
        isMailBox:true,
        isPayment:false
      }
      case CLOSE_MAIL: return{
        ...state,
        isMailBox:false,
        isPayment:false
      }
    default:
      return state;
  }
};

export default settings;

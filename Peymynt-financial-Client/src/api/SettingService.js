import { HTTP_GET, HTTP_PATCH, HTTP_POST } from '../components/app/components/Estimates/components/constant';
import requestWithToken from './requestWithToken'

export const addSalesSetting = (data) => {
  return requestWithToken({
    url: `/api/v1/settings/sales`,
    method: HTTP_POST,
    data
  });
};

export const fetchSalesSetting = () => {
  return requestWithToken({
    url: '/api/v1/settings/sales',
    method: HTTP_GET
  })
};

export const patchSalesSetting = (data) => {
  return requestWithToken({
    url: `/api/v1/settings/sales`,
    method: HTTP_PATCH,
    data
  });
};

export const fetchPurchaseSetting = () => {
  return requestWithToken({
    url: '/api/v1/settings/purchase',
    method: HTTP_GET
  })
};

export const savePurchaseSetting = (data) => {
    return requestWithToken({
        url: `/api/v1/settings/purchase`,
        method: HTTP_PATCH,
        data
    });
};

export const fetchPaymentSetting = () => {
  return requestWithToken({
    url: '/api/v1/settings/payment',
    method: HTTP_GET
  })
};  

export const savePaymentSetting = (data) => {
    return requestWithToken({
        url: `/api/v1/settings/payment`,
        method: HTTP_PATCH,
        data
    });
};

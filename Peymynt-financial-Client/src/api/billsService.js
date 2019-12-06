import {
  HTTP_DELETE,
  HTTP_GET,
  HTTP_POST,
  HTTP_PUT
} from "../components/app/components/purchase/Components/bills/constants/BillFormConstants";
import request from "./request";
import requestWithToken from "./requestWithToken";

export const addBill = data => {
  return requestWithToken({
    url: `/api/v1/bills`,
    method: HTTP_POST,
    data
  });
};

export function fetchAllBills(queryString) {
  return requestWithToken({
    url: `/api/v1/bills?${queryString || ''}`,
    method: HTTP_GET
  });
}

export const deleteBill = id => {
  return requestWithToken({
    url: "/api/v1/bills/" + id,
    method: HTTP_DELETE
  });
};

export const fetchBillById = billId => {
  return requestWithToken({
    url: "/api/v1/bills/" + billId,
    method: HTTP_GET
  });
};

export const updateBill = (billId, data) => {
  return requestWithToken({
    url: `/api/v1/bills/${billId}`,
    method: HTTP_PUT,
    data
  });
};

export const recordPayment = (billId, data) => {
  return requestWithToken({
    url: `/api/v1/bills/${billId}/payments`,
    method: HTTP_PUT,
    data
  });
};

export const fetchPayments = (billId) => {
  return requestWithToken({
    url: `/api/v1/bills/${billId}/payments`,
    method: HTTP_GET,
  });
};

export const deletePayment = (id) => {
  return requestWithToken({
    url: `/api/v1/bills/${id}/payments`,
    method: HTTP_DELETE,
  });
};

export const duplicateBill = (billId) => {
  return requestWithToken({
    url: `/api/v1/bills/${billId}/duplicate`,
    method: HTTP_GET,
  });
};


export const fetchLatestBillNumber = () => {
  return requestWithToken({
    url: "/api/v1/bills/createbillnumber",
    method: HTTP_GET
  });
};

export const checkBillNumberExist = (billNumber) => {
  return requestWithToken({
    url: "/api/v1/bills/checkbillnumber/" + billNumber,
    method: HTTP_GET
  });
};

export const fetchBillByUUID = uuid => {
  return request({
    url: `/api/v1/bills/share/${uuid}`,
    method: HTTP_GET
  });
};


import {
  HTTP_DELETE,
  HTTP_GET,
  HTTP_POST,
  HTTP_PUT
} from "../components/app/components/purchase/Components/bills/constants/BillFormConstants";
import requestWithToken from "./requestWithToken";

export function uploadReceipt(payload, onUploadProgress) {
  return requestWithToken({
    url: `/api/v1/receipts/upload`,
    method: HTTP_POST,
    data: payload,
    onUploadProgress,
  });
}

export function listReceipts(q) {
  return requestWithToken({
    url: `/api/v1/receipts${q || ''}`,
    method: HTTP_GET,
  });
}

export function getReceipt(id) {
  return requestWithToken({
    url: `/api/v1/receipts/${id}`,
    method: HTTP_GET,
  });
}

export function updateReceipt(id, payload) {
  return requestWithToken({
    url: `/api/v1/receipts/${id}`,
    method: HTTP_PUT,
    data: payload,
  });
}

export function patchReceipt(id, payload) {
  return requestWithToken({
    url: `/api/v1/receipts/${id}`,
    method: 'PATCH',
    data: payload,
  });
}

export function updateReceiptBusiness(id, businessId) {
  return requestWithToken({
    url: `/api/v1/receipts/${id}/move/businesses/${businessId}`,
    method: HTTP_PUT,
  });
}

export function deleteReceipt(id) {
  return requestWithToken({
    url: `/api/v1/receipts/${id}`,
    method: HTTP_DELETE,
  });
}

export default {
  uploadReceipt,
  listReceipts,
  getReceipt,
  patchReceipt,
  updateReceipt,
  deleteReceipt,
  updateReceiptBusiness,
}

import { openGlobalSnackbar } from 'actions/snackBarAction';
import receiptsService from '../api/receiptsService';
import {
  LIST_RECEIPTS_ERROR,
  LIST_RECEIPTS_LOADING,
  LIST_RECEIPTS_SUCCESS,
  UPDATE_RECEIPT_LOADING,
  UPLOAD_RECEIPT_ERROR,
  UPLOAD_RECEIPT_LOADING,
  UPLOAD_RECEIPT_PROGRESS,
  UPLOAD_RECEIPT_SUCCESS,
} from '../constants/ActionTypes';

export function uploadReceiptSuccess(data) {
  return {
    type: UPLOAD_RECEIPT_SUCCESS,
    data,
  };
}

export function uploadReceiptProgress(data) {
  return {
    type: UPLOAD_RECEIPT_PROGRESS,
    data,
  };
}

export function uploadReceiptError(message) {
  return {
    type: UPLOAD_RECEIPT_ERROR,
    message,
  };
}

export function uploadReceiptLoading(loading = true) {
  return {
    type: UPLOAD_RECEIPT_LOADING,
    data: loading,
  };
}

export function updateReceiptLoading(loading = true) {
  return {
    type: UPDATE_RECEIPT_LOADING,
    data: loading,
  };
}

export function listReceiptsSuccess(data) {
  return {
    type: LIST_RECEIPTS_SUCCESS,
    data,
  };
}

export function listReceiptsError(message) {
  return {
    type: LIST_RECEIPTS_ERROR,
    message,
  };
}

export function listReceiptsLoading(loading = true) {
  return {
    type: LIST_RECEIPTS_LOADING,
    data: loading,
  };
}

const updateProgress = (event, dispatch) => {
  const totalLength = event.lengthComputable ? event.total : event.target.getResponseHeader('content-length') || event.target.getResponseHeader('x-decompressed-content-length');
  const loaded = event.loaded;
  if (!totalLength || loaded === null || loaded === undefined) {
    return;
  }
  const percent = Number((loaded * 100) / totalLength).toFixed(2);

  dispatch(uploadReceiptProgress(percent));
};

export function uploadReceipt(file, callback) {
  const payload = new FormData();
  payload.append('receipt', file);
  return async (dispatch) => {
    dispatch(uploadReceiptLoading());
    try {
      const response = await receiptsService.uploadReceipt(payload, (e) => updateProgress(e, dispatch));
      if (response.statusCode === 200) {
        dispatch(uploadReceiptSuccess({}));
        dispatch(openGlobalSnackbar(response.message));
        if (callback) {
          callback();
        }
      } else {
        dispatch(uploadReceiptError(response.message));
        dispatch(openGlobalSnackbar(response.message, true));
      }
    } catch (error) {
      dispatch(uploadReceiptError(error.message));
      dispatch(openGlobalSnackbar(error.message, true));
    }
  };
}

export function listReceipts(status, callback) {
  const q = status ? `?status=${status}` : '';

  return async (dispatch) => {
    dispatch(listReceiptsLoading());
    try {
      const response = await receiptsService.listReceipts(q);
      if (response.statusCode === 200) {
        dispatch(listReceiptsSuccess(response.data.receipts));
        if (callback) {
          callback(response.data.receipts);
        }
      } else {
        dispatch(listReceiptsError(response.message));
        dispatch(openGlobalSnackbar(response.message, true));
      }
    } catch (error) {
      dispatch(listReceiptsError(error.message));
      dispatch(openGlobalSnackbar(error.message, true));
    }
  };
}

export function updateReceipt(id, payload, callback) {
  return async (dispatch) => {
    dispatch(updateReceiptLoading());
    try {
      const response = await receiptsService.updateReceipt(id, { receiptInput: payload });
      if (response.statusCode === 200) {
        dispatch(openGlobalSnackbar(response.message));
        dispatch(updateReceiptLoading(false));
        if (callback) {
          callback(response.data.receipt);
        }
      } else {
        dispatch(updateReceiptLoading(false));
        dispatch(openGlobalSnackbar(response.message, true));
      }
    } catch (error) {
      dispatch(updateReceiptLoading(false));
      dispatch(openGlobalSnackbar(error.message, true));
    }
  };
}

export function patchReceipt(id, payload, callback) {
  return async (dispatch) => {
    dispatch(updateReceiptLoading());
    try {
      const response = await receiptsService.patchReceipt(id, { receiptInput: payload });
      if (response.statusCode === 200) {
        dispatch(openGlobalSnackbar(response.message));
        dispatch(updateReceiptLoading(false));
        if (callback) {
          callback(response.data.receipt);
        }
      } else {
        dispatch(updateReceiptLoading(false));
        dispatch(openGlobalSnackbar(response.message, true));
      }
    } catch (error) {
      dispatch(updateReceiptLoading(false));
      dispatch(openGlobalSnackbar(error.message, true));
    }
  };
}

export function deleteReceipt(id, callback) {
  return async (dispatch) => {
    dispatch(updateReceiptLoading());
    try {
      const response = await receiptsService.deleteReceipt(id);
      if (response.statusCode === 200) {
        dispatch(openGlobalSnackbar(response.message));
        dispatch(updateReceiptLoading(false));
        if (callback) {
          callback(response);
        }
      } else {
        dispatch(updateReceiptLoading(false));
        dispatch(openGlobalSnackbar(response.message, true));
      }
    } catch (error) {
      dispatch(updateReceiptLoading(false));
      dispatch(openGlobalSnackbar(error.message, true));
    }
  };
}

export function moveReceipt(id, businessId, callback) {
  return async (dispatch) => {
    dispatch(updateReceiptLoading());
    try {
      const response = await receiptsService.updateReceiptBusiness(id, businessId);
      if (response.statusCode === 200) {
        dispatch(openGlobalSnackbar(response.message));
        dispatch(updateReceiptLoading(false));
        if (callback) {
          callback(response);
        }
      } else {
        dispatch(updateReceiptLoading(false));
        dispatch(openGlobalSnackbar(response.message, true));
      }
    } catch (error) {
      dispatch(updateReceiptLoading(false));
      dispatch(openGlobalSnackbar(error.message, true));
    }
  };
}

import { errorResponse, okResponse } from "../../util/HttpResponse";
import { HTTP_OK, HTTP_INTERNAL_SERVER_ERROR, HTTP_BAD_REQUEST } from "../../util/constant";
import { createItem, getItem, getItems, patchItem, deleteItem } from './account.profile.dal';

export const addAccount = async (accountProfileInput, userId) => {
    try {
        let accountAccount = await createItem(accountProfileInput, userId);
        return okResponse(HTTP_OK, { accountAccount }, "Account added successfully!");
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};

export const getAllAccounts = async (userId) => {
    try {
        let accounts = await getItems(userId);
        return okResponse(HTTP_OK, { accounts }, "OK");
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};

export const deleteAccount = async (accountAccountId, userId) => {
    try {

        let response = await deleteItem(accountAccountId, userId);
        if (response != null)
            return okResponse(HTTP_OK, null, "Account removed successfully!");
        else return errorResponse(HTTP_BAD_REQUEST, null, "Seems this account doesn't exist");
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};
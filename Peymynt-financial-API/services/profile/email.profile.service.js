import { errorResponse, okResponse } from "../../util/HttpResponse";
import { HTTP_OK, HTTP_INTERNAL_SERVER_ERROR, HTTP_BAD_REQUEST } from "../../util/constant";
import { createItem, getItem, getItems, patchItem, deleteItem } from './email.profile.dal';

export const addEmailAccount = async (emailProfileInput, userId) => {
    try {
        let emailAccount = await createItem(emailProfileInput, userId);
        return okResponse(HTTP_OK, { emailAccount }, "Email added successfully!");
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};

export const getAllEmails = async (userId, filter) => {
    try {
        let emails = await getItems(userId, filter);
        return okResponse(HTTP_OK, { emails }, "OK");
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};

export const setPrimaryEmail = async (emailAccountId, userId) => {
    try {
        // Clear existing primary first
        let emails = await getItems(userId);
        if (emails && emails.length) {
            emails.map(async e => {
                if (e.id == emailAccountId) {
                    await patchItem(e.id, {
                        isPrimary: true,
                        primaryDate: new Date()
                    });
                } else {
                    await patchItem(e.id, {
                        isPrimary: false
                    });
                }
            })
            return errorResponse(HTTP_BAD_REQUEST, null, "Email has been set as primary");
        }
        return okResponse(HTTP_OK, null, "Seems this email doesn't exist");
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};


export const deleteEmail = async (emailAccountId, userId) => {
    try {

        let response = await deleteItem(emailAccountId, userId);
        if (response != null)
            return okResponse(HTTP_OK, null, "Email removed successfully!");
        else return errorResponse(HTTP_BAD_REQUEST, null, "Seems this email doesn't exist");
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};
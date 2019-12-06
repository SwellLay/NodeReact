import moment from 'moment';
import { EstimateModel } from "../models/estimate.model";
import { UserModel } from "../models/user.model";
import { SalesSettingModel } from "../models/setting/sales.setting.model";
import { DELETE_SUCCESS, FAILED, HTTP_BAD_REQUEST, HTTP_CONFLICT, HTTP_CREATED, HTTP_INTERNAL_SERVER_ERROR, HTTP_NOT_FOUND, HTTP_OK, NULL, PUBLIC_URL, SUCCESS } from "../util/constant";
import { errorResponse, okResponse } from "../util/HttpResponse";
import { isValidObjectId, getDateOnly, getTemplateCode } from "../util/utils";
import { invoiceInput } from "../util/InvoiceUtil";
import { addInvoice, getLatestInvoiceNumber } from "./InvoiceService";
let pdfEngine = require('../tasks/pdfEngine');

export const addEstimate = async (estimateInput, user, businessId) => {
    try {
        let estimate;
        estimate = await EstimateModel.findOne({ estimateNumber: estimateInput.estimateNumber, isActive: true, isDeleted: false, businessId, userId: user._id });
        if (estimate) {
            return errorResponse(HTTP_CONFLICT, null, "Estimate already exists with this number");
        }
        const today = moment({ hour: 0, minute: 0, second: 0 }).utc();
        if (moment(estimateInput.expiryDate) < today) {
            estimateInput.status = "expired";
        }
        if (estimateInput.items.length < 1) {
            return errorResponse(HTTP_BAD_REQUEST, null, "Estimate must have atleast one item");
        }
        estimate = new EstimateModel(estimateInput);
        estimate = await estimate.save();
        if (estimate) {
            estimate.publicView["shareableLinkUrl"] = PUBLIC_URL + "/public/estimate/" + estimate.uuid;
            let estimateWithLink = await addShareableLink(estimate);
            return okResponse(HTTP_CREATED, { estimate: estimateWithLink }, "Estimate Added successfully");
        } else {
            return errorResponse(HTTP_NOT_FOUND, null, "Estimate not found");
        }
    } catch (error) {
        console.log("--> error ", error);
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};


export const cloneEstimate = async (id, businessId, user) => {
    if (!id) {
        return okResponse(HTTP_OK, null, "Estimate ID not found");
    }
    try {
        let estimateInfo = await EstimateModel.findById({ _id: id });
        console.log("estimateInfo", estimateInfo);
        let clonedEstimate = getEstimateObject(estimateInfo);
        console.log("clonedEstimate", clonedEstimate);
        let estimateNumber = await getLatestEstimateNumber(businessId, user);
        clonedEstimate.estimateNumber = estimateNumber;
        let estimate = new EstimateModel(clonedEstimate);
        estimate = await estimate.save();
        if (estimate) {
            estimate.publicView["shareableLinkUrl"] = PUBLIC_URL + "/public/estimate/" + estimate.uuid;
            let estimateWithLink = await addShareableLink(estimate);
            return okResponse(HTTP_CREATED, { estimateWithLink }, "success");
        } else {
            return errorResponse(HTTP_NOT_FOUND, null, "Estimate not found");
        }
    } catch (error) {
        console.log(error);
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
}

const getEstimateObject = (estimateObject) => {
    let status = "saved";
    console.log("Estimate date : " + estimateObject.estimateDate);
    console.log("current date : " + new Date());
    if (estimateObject.expiryDate < new Date()) {
        status = "expired";
    }
    const newObject = {
        "amountBreakup": estimateObject.amountBreakup,
        "invoice": estimateObject.invoice,
        "status": status,
        "name": estimateObject.name,
        "customer": estimateObject.customer,
        "currency": estimateObject.currency,
        "exchangeRate": estimateObject.exchangeRate,
        "estimateDate": estimateObject.estimateDate,
        "expiryDate": estimateObject.expiryDate,
        "subheading": estimateObject.subheading,
        "footer": estimateObject.footer,
        "memo": estimateObject.memo,
        "items": estimateObject.items,
        "totalAmount": estimateObject.totalAmount,
        "totalAmountInHomeCurrency": estimateObject.totalAmountInHomeCurrency,
        "userId": estimateObject.userId,
        "businessId": estimateObject.businessId,
        "purchaseOrder": estimateObject.purchaseOrder,
        "taxes": estimateObject.taxes
    }
    return newObject;
}

export const fetchEstimates = async (businessId, offset, limit, { status, customer, startDate, endDate }) => {
    console.log("--------get estimate services--------->", businessId);

    if (startDate) {
        startDate = getDateOnly(startDate);
        startDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    }
    if (endDate) {
        endDate = getDateOnly(endDate);
        endDate.set({ hour: 23, minute: 59, second: 59, millisecond: 0 })
    }
    try {
        let searchCondition = {
            isDeleted: false,
            businessId,
            isActive: true
        };

        if (status) {
            searchCondition.status = status;
        }

        if (customer) {
            searchCondition.customer = customer;
        }

        if (startDate && !endDate) {
            searchCondition.estimateDate = { $gte: startDate }
        }

        if (endDate && !startDate) {
            searchCondition.estimateDate = { $lte: endDate }
        }

        if (startDate && endDate) {
            searchCondition.estimateDate = { $gte: startDate, $lte: endDate }
        }


        let estimates = await EstimateModel.find(searchCondition).populate("customer").populate("businessId")
            .skip(offset).limit(limit); //.sort({ estimateDate: -1 });

        estimates = await checkExpiredEstimates(estimates);

        return okResponse(HTTP_OK, { estimates }, "success");
    } catch (error) {
        console.log(error);
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};

export const fetchEstimateById = async (id, user, businessId) => {
    try {
        const validId = isValidObjectId(id);

        if (!validId) {
            return errorResponse(HTTP_BAD_REQUEST, { error: "Invalid ID passed" }, "Invalid ID passed");
        }

        let estimate = await EstimateModel.findById({
            _id: id,
            isActive: true,
            isDeleted: false,
            userId: user._id,
            businessId
        }).populate("customer").populate("businessId").populate("amountBreakup.taxTotal.taxName");

        if (!estimate) {
            return errorResponse(HTTP_NOT_FOUND, { error: "estimate not found" }, "failed");
        }
        const userInfo = await UserModel.findById(estimate.userId);
        const businessId = estimate.businessId._id;
        const salesSetting = await SalesSettingModel.findOne({ businessId });
        return okResponse(HTTP_OK, { estimate, salesSetting, userInfo: userInfo.toPublicJson() }, "success");
    } catch (error) {
        console.log(error)
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed=>");
    }
};


export const fetchEstimateByUUID = async (uuid, isInternal) => {
    try {
        let estimate = await EstimateModel.findOne({
            uuid,
            isActive: true,
            isDeleted: false
        }).populate("customer").populate("businessId").populate("amountBreakup.taxTotal.taxName");
        if (!estimate) {
            return errorResponse(HTTP_NOT_FOUND, error, "failed");
        }
        if (estimate.status != "draft" && !isInternal) {
            if (estimate.status != "expired") {
                estimate.status = "viewed";
            }
            if (!estimate.report || !estimate.report.viewCount) {
                estimate.report = {
                    viewCount: 1,
                    lastViewedOn: new Date()
                };
            }
            else {
                estimate.report.lastViewedOn = new Date();
                estimate.report.viewCount = estimate.report.viewCount + 1;
            }
            await estimate.save();
        }
        const userInfo = await UserModel.findById(estimate.userId);
        const businessId = estimate.businessId._id;
        const salesSetting = await SalesSettingModel.findOne({ businessId });
        return okResponse(HTTP_OK, { estimate, salesSetting, userInfo: userInfo.toPublicJson() }, "success");
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};

export const updateEstimate = async (id, estimateInput, user, businessId) => {
    try {
        let estimate = await EstimateModel.findOne({
            _id: id,
            isActive: true,
            isDeleted: false,
            businessId
        });
        if (!estimate) {
            return errorResponse(HTTP_NOT_FOUND, NULL, "failed");
        }
        if (estimateInput.items.length < 1) {
            return errorResponse(HTTP_BAD_REQUEST, null, "Estimate must have atleast one item");
        }
        console.log("Estimate date : " + estimateInput.expiryDate);
        console.log("current date : " + new Date());
        if (estimateInput.expiryDate < new Date()) {
            estimateInput.status = "expired";
        } else if (estimateInput.status = "expired") {
            estimateInput.status = "saved";
        }
        await estimate.updateOne(estimateInput);
        estimate = await EstimateModel.findById(id);
        return okResponse(200, { estimate }, "success");
    } catch (error) {
        return errorResponse(500, error, "failed");
    }
};

export const deleteEstimate = async (id, user, businessId) => {
    try {
        let estimate = await EstimateModel.findOne({
            _id: id,
            isActive: true,
            isDeleted: false,
            businessId
        });
        if (!estimate) {
            return errorResponse(400, estimate, "Estimate does not exists");
        }
        await estimate.updateOne({ isDeleted: true, isActive: false });

        return okResponse(200, { deleteEstimate: true }, DELETE_SUCCESS);
    } catch (error) {
        return errorResponse(500, error, FAILED);
    }
};

export const checkEstimateNumberExists = async (
    estimateNumber,
    user,
    businessId
) => {
    try {
        let estimate = await EstimateModel.findOne({
            estimateNumber,
            isActive: true,
            userId: user._id,
            isDeleted: false,
            businessId
        });

        if (!estimate) {
            return errorResponse(409, { checkEstimateNumberExists: false }, FAILED);
        }

        return okResponse(HTTP_OK, { checkEstimateNumberExists: false }, SUCCESS);
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, FAILED);
    }
};

export const estimateEmail = async () => { };

export const createShareableLink = async (estimateId) => {
    if (estimateId) {
        let estimate = await EstimateModel.findOne({ _id: estimateId });
        try {
            return okResponse(200, { url: "http://localhost:5060/estimatesharelink?uuid=" + estimate.uuid }, "success");
        } catch (error) {
            return errorResponse(500, error, "error");
        }
    } else {
        return okResponse(200, { error: "estimatedId not found" }, "estimatedId not found");
    }
}

export const createLatestEstimateNumber = async (businessId, user) => {
    try {
        let searchCondition = {
            isDeleted: false,
            businessId, userId: user._id,
            isActive: true
        };
        let estimates = await EstimateModel.find(searchCondition).
            sort({ createdAt: -1 });
        if (estimates[0]) {
            return okResponse(200, { estimateNumber: estimates[0].estimateNumber + 1 }, "success");
        } else {
            return okResponse(200, { estimateNumber: +1 }, "success");
        }
    } catch (error) {
        console.log(error);
        return errorResponse(500, error, "error");
    }
}

export const checkEstimateNumberExist = async (estimateNumber, businessId, user) => {
    if (estimateNumber) {
        try {
            let estimate = await EstimateModel.findOne({
                estimateNumber: parseInt(estimateNumber),
                businessId: businessId,
                userId: user._id,
                isDeleted: false,
                isActive: true
            });
            if (estimate) {
                return okResponse(200,
                    { estimateNumberExist: true, message: "estimateNumber found" }, "estimateNumber found");
            }
            else {
                return okResponse(200, {
                    estimateNumberExist: false,
                    message: "estimateNumber not found"
                }, "success");
            }
        } catch (error) {
            console.log(error);
            return errorResponse(500, error, "error");
        }
    } else {
        return okResponse(200, {
            estimateNumber: null,
            message: "please provide estimateNumber"
        }, "success");
    }
}

const checkExpiredEstimates = async (estimates) => {
    for (let i = 0; i < estimates.length; i++) {
        if (estimates[i].status !== "expired") {
            if (estimates[i].expiryDate < new Date().setHours(0, 0, 0, 0)) {
                estimates[i].status = "expired";
                await estimates[i].updateOne({ status: "expired" });
            }
        }
    }
    return estimates;
}


const addShareableLink = async (estimate) => {
    await estimate.updateOne(estimate);
    estimate = await EstimateModel.findById(estimate._id);
    return estimate;
}


const getLatestEstimateNumber = async (businessId, user) => {
    try {
        let searchCondition = {
            isDeleted: false,
            businessId, userId: user._id,
            isActive: true
        };
        let estimates = await EstimateModel.find(searchCondition).
            sort({ createdAt: -1 });
        return estimates[0].estimateNumber + 1;
    } catch (error) {
        return 0;
    }
}

export const convertEstimate = async (id, businessId, user) => {
    if (!id) {
        return okResponse(HTTP_OK, null, "Estimate ID not found");
    }
    try {
        let estimate = await EstimateModel.findById(id);
        if (!estimate) {
            return errorResponse(HTTP_NOT_FOUND, error, "Estimate not found");
        }
        let input = invoiceInput(estimate);
        input.createdFrom = "estimate";
        input.other = {
            clonedFromEstimateId: id
        }
        let invoiceNumber = await getLatestInvoiceNumber(businessId, user);
        console.log("Invoice Number ----------------> ", invoiceNumber);
        //TODO: Set the payload according to Invoice
        input.invoiceNumber = invoiceNumber;
        let items = []
        for (let i = 0; i < input.items.length > 0; i++) {
            let item = {
                taxes: input.items[i].taxes,
                item: input.items[i].item,
                column1: input.items[i].name,
                column2: input.items[i].description,
                column3: input.items[i].quantity,
                column4: input.items[i].price,
                amount: input.items[i].amount
            }
            items.push(item);
        }
        input.items = items;
        return addInvoice(input, user, businessId);
    } catch (error) {
        console.log(error);
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
}


export const exportEstimateToPdf = async (estimateUuid, businessId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await fetchEstimateByUUID(estimateUuid, true);
            if (response.statusCode != HTTP_OK) {
                resolve(response);
            } else {
                const templateCode = getTemplateCode("estimate", response.data.salesSetting.template);
                let output = await pdfEngine.exportPdf(response.data, templateCode);
                resolve(output);
            }
        } catch (e) {
            console.log("Error while getting output from pdf engine", e);
            reject(e);
        }
    })
}
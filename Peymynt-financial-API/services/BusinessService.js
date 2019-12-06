import { okResponse, errorResponse } from "../util/HttpResponse";
import { OrganizationModel } from "../models/organization.model";
import { UserModel } from "../models/user.model";
import {
    HTTP_CREATED,
    HTTP_INTERNAL_SERVER_ERROR,
    HTTP_OK,
    HTTP_NOT_FOUND,
    NULL,
    SUCCESS,
    OK,
    DELETE_SUCCESS,
    FAILED,
    HTTP_CONFLICT,
    HTTP_BAD_REQUEST
} from "../util/constant";
import fs from "fs";
import { addSalesSetting } from "./SalesService";
let countries = fs.readFileSync("./raw_data/country-currency.json");
try {
    countries = JSON.parse(countries);
} catch (error) {
    console.log(error);
    process.exit(1);
}

export const addBusiness = async (businessInput, user) => {
    try {
        businessInput.users = [user._id];
        if (!businessInput.address) {
            businessInput.address = {
                country: businessInput.country
            }
        }
        businessInput.meta = {
            invoice: {
                firstVisit: true,
                showSetup: true,
                lastInvoiceNumber: 0,
                totalInvoice: 0,
                shouldShowPaymentModal: true
            },
            checkout: {
                firstVisit: true,
                showShowSetup: true,
                totalCheckout: 0
            },
            payment: {
                firstVisit: true,
                showShowSetup: true
            }
        }
        console.log("new biz *********** ", businessInput);
        let business = new OrganizationModel(businessInput);
        business = await business.save();
        user = await UserModel.findById(user._id);
        if (!user) {
            return errorResponse(400, undefined, "User not found");
        }
        let businessId = business._id;
        console.log(businessId);
        let businesses = user.businesses || [];
        if (user.businesses && user.businesses.length > 0) {
            user.businesses.push(businessId);
        } else {
            businesses = [businessId];
        }
        await user.updateOne({ businesses });
        await addSalesSetting(salesSettingInput(user._id, businessId), user, businessId);
        business = await OrganizationModel.findById(businessId).populate("users");
        return okResponse(201, { business }, "success");
    } catch (error) {
        console.log("errrrrrrrrr", error);
        return errorResponse(500, error, "failed");
    }
};

export const fetchBusinesses = async (user) => {
    console.log("------------fetch business------- > ");
    try {
        const businesses = await OrganizationModel.find({
            isDeleted: false,
            isActive: true,
            users: { $in: [user._id] }
        })
            .collation({ locale: "en" })
            .sort({ "organizationName": 1 })
        return okResponse(200, { businesses }, "OK");
    } catch (error) {
        console.log(error);
        return errorResponse(500, error, "failed");
    }
};

export const fetchBusinessById = async id => {
    try {
        const business = await OrganizationModel.findOne({
            isActive: true,
            isDeleted: false,
            _id: id
        });
        if (!business) {
            return okResponse(404, null, "No Business found");
        }
        return okResponse(200, { business }, "OK");
    } catch (error) {
        console.log(error);
        return errorResponse(500, error, "failed");
    }
};

export const updateBusiness = async (id, businessInput, user) => {
    try {
        console.log('Update Business Id  ----', id);
        let businessData = await OrganizationModel.findOne({ _id: id, isActive: true, isDeleted: false });
        if (!businessData) {
            return errorResponse(500, NULL, "failed");
        }
        if (businessInput.address)
            businessInput.country = businessInput.address.country;
        await businessData.updateOne(businessInput);
        let business = await OrganizationModel.findOne({
            isActive: true,
            isDeleted: false,
            _id: id
        });
        return okResponse(200, { business }, "success");
    } catch (error) {
        console.log("errrrrrrrrr ==>", error);
        return errorResponse(500, error, "failed");
    }
};

export const updatePrimaryBusiness = async (userId, primaryBusiness) => {
    const businesses = await OrganizationModel.find({ "users": { $in: [userId] } });
    for (let b of businesses) {
        b.isPrimary = b._id == primaryBusiness;
        await b.save();
    }
    return okResponse(200, NULL, "success");
}

export const deleteBusiness = async (id) => {
    try {
        let business = await OrganizationModel.findById(id);
        if (!business) {
            return errorResponse(404, undefined, "Business data not found");
        }

        await business.updateOne({ isDeleted: true, isActive: false });
        return okResponse(200, { deleteBusiness: true }, "success");
    } catch (error) {
        return errorResponse(500, error, "failed");
    }
};

export const businessCountries = () => {
    try {
        return okResponse(200, { countries }, "Currency and countries list");
    } catch (error) {
        errorResponse(500, undefined, "Error occured");
    }
}

export const patchBusiness = async (businessInput, businessId) => {
    try {
        let business = await OrganizationModel.findOne({ _id: businessId, isActive: true, isDeleted: false });
        if (!business) {
            return errorResponse(HTTP_BAD_REQUEST, NULL, "Seems this business doesn't exist");
        }
        // Make data in sync
        if (businessInput.address)
            businessInput.country = businessInput.address.country;
        await business.updateOne(businessInput);
        business = await OrganizationModel.findById(businessId);
        return okResponse(200, { business: business.toUserJson() }, SUCCESS);
    }
    catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, FAILED);
    }
};

export const salesSettingInput = (userId, businessId) => {
    return {
        template: "contemporary",
        companyLogo: "",
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
            hideAmount: false,
        },
        isActive: true,
        isDeleted: false,
        userId,
        businessId
    }
}

export const fetchArchivedBusiness = async (user) => {
    console.log("------------fetch business------- > ");
    try {
        const businesses = await OrganizationModel.find({
            isDeleted: true,
            users: { $in: [user._id] }
        })
            .collation({ locale: "en" })
            .sort({ "organizationName": 1 })
        return okResponse(HTTP_OK, {
            businesses: businesses.map(b => {
                return {
                    organizationName: b.organizationName,
                    id: b.id,
                    organizationType: b.organizationType
                }
            })
        }, "OK");
    } catch (error) {
        console.log(error);
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};

export const restoreBusiness = async (businessId, user) => {
    try {
        let business = await OrganizationModel.findOne({ _id: businessId, isDeleted: true });
        if (!business) {
            return errorResponse(HTTP_BAD_REQUEST, NULL, "Seems this business is not available for restoring");
        }
        business.isDeleted = false;
        business.isActive = true;
        await business.save();
        return okResponse(HTTP_OK, business, `${business.organizationName} restored successfully`);
    }
    catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, FAILED);
    }
};
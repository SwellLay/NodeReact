import { VendorModel } from "../../models/purchase/vendor.model";
import { okResponse, errorResponse } from "../../util/HttpResponse";
import { HTTP_CREATED, HTTP_INTERNAL_SERVER_ERROR, HTTP_OK, HTTP_NOT_FOUND, NULL, ERROR_NOT_FOUND, HTTP_BAD_REQUEST } from "../../util/constant";

export const addVendor = async (vendorInput) => {
    let vendor = new VendorModel(vendorInput);
    try {
        vendor = await vendor.save();
        return okResponse(HTTP_CREATED, { vendor: vendor.toUserJson() }, "success");
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};

export const insertVendors = async (vendors, userId, businessId) => {
    if (vendors.length >= 1) {
        for (let vendor of vendors) {
            let vendorObject = {
                vendorName: vendor.vendorName,
                vendorType: 'regular',
                firstName: vendor.firstName,
                lastName: vendor.lastName,
                email: vendor.email,
                currency: vendor.currency,
                address: {
                    country: vendor.country,
                    state: vendor.state,
                    city: vendor.city,
                    postal: vendor.postal,
                    addressLine1: vendor.addressLine1,
                    addressLine2: vendor.addressLine2
                },
                userId: userId,
                businessId: businessId
            };
            let v = new VendorModel(vendorObject);
            await v.save();
        }
        return okResponse(HTTP_OK, null, 'Vendor data imported successfully');
    } else {
        return errorResponse(HTTP_BAD_REQUEST, null, 'There is no data to import');
    }
}

export const fetchVendors = async businessId => {
    console.log("--------get vendors services--------->", businessId);
    try {
        let vendorQuery = VendorModel.find({
            isActive: true,
            isDeleted: false,
            businessId
        });
        vendorQuery.collation({ locale: "en" })
        vendorQuery.sort({ vendorName: 1 })
        let vendors = await vendorQuery.exec();
        return okResponse(HTTP_OK, { vendors: vendors.map(v => v.toUserJson()) }, "success");
    } catch (error) {
        console.log("====================================", error);
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};

export const fetchVendorById = async id => {
    try {
        let vendor = await VendorModel.findOne({ _id: id, isActive: true, isDeleted: false });
        if (!vendor) {
            return errorResponse(HTTP_NOT_FOUND, null, ERROR_NOT_FOUND);
        }
        return okResponse(HTTP_OK, { vendor: vendor.toUserJson() }, "success");
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};

export const updateVendor = async (id, vendorInput, businessId) => {
    try {
        let vendor = await VendorModel.findOne({ _id: id, isActive: true, isDeleted: false, businessId });
        if (!vendor) {
            return errorResponse(HTTP_NOT_FOUND, NULL, ERROR_NOT_FOUND);
        }

        await vendor.updateOne(vendorInput);
        vendor = await VendorModel.findById(id);
        return okResponse(200, { vendor: vendor.toUserJson() }, "success");
    } catch (error) {
        return errorResponse(500, error, "failed");
    }
};

export const deleteVendor = async (id, businessId) => {
    try {
        let vendor = await VendorModel.findOne({ _id: id, isActive: true, isDeleted: false, businessId });
        if (!vendor) {
            return errorResponse(HTTP_NOT_FOUND, true, ERROR_NOT_FOUND);
        }
        await vendor.updateOne({ isDeleted: true, isActive: false });

        return okResponse(200, { deleteVendor: true }, "success");
    } catch (error) {
        return errorResponse(500, error, "failed");
    }
};

export const updateVendorAccount = async (accountInput, vendorId, businessId) => {
    try {
        let vendor = await VendorModel.findOne({ _id: vendorId, isActive: true, isDeleted: false, businessId });
        if (!vendor) {
            return errorResponse(HTTP_NOT_FOUND, NULL, ERROR_NOT_FOUND);
        }
        if (vendor.vendorType != 'contractor') {
            return errorResponse(400, NULL, "Account can not be added for this vendor type");
        }
        let date = new Date();
        // Check if account already exists
        if (vendor.account && vendor.account.createdAt) {
            vendor.account = { ...accountInput, updatedAt: date };
        } else {
            vendor.account = { ...accountInput, createdAt: date, updatedAt: date };
        }
        vendor.isAccountAdded = true;
        await vendor.save();
        vendor = await VendorModel.findById(vendorId);
        return okResponse(200, { account: vendor.toAccountJson() }, "success");
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};

export const fetchVendorAccount = async id => {
    try {
        let account = await VendorModel.findOne({ _id: id, isActive: true, isDeleted: false }, { account: 1 });
        if (!account) {
            return errorResponse(HTTP_NOT_FOUND, null, "Seems no data available");
        }
        return okResponse(HTTP_OK, { account: account.toAccountJson() }, "success");
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};
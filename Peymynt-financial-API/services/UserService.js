import { UserModel } from "../models/user.model";
import { OrganizationModel } from "../models/organization.model";
import { updatePrimaryBusiness } from "../services/BusinessService";
import { okResponse, errorResponse } from "../util/HttpResponse";

export const addUser = async userInput => {
    let user = new UserModel(userInput);
    let buissnessIds = [];
    userInput["buissnessIds"] = buissnessIds;
    try {
        if (userInput.businesses) {
            userInput.businesses.forEach(async businessObject => {
                let businessModel;
                try {
                    businessModel = new OrganizationModel(businessObject);
                    businessModel.save();
                } catch (error) {
                    console.log("========>forEach error < == ", error);
                }
                userInput["buissnessIds"].push(id);
            });
        }
        delete userInput.businesses;
        let userResult = await user.save();
        return okResponse(201, userResult, "success");
    } catch (error) {
        return errorResponse(500, error, "failed");
    }
};

export const fetchUsers = async () => {
    try {
        let users = await UserModel.find({
            isDeleted: false,
            isActive: true
        }).populate("businesses");
        return okResponse(200, { users }, "success");
    } catch (error) {
        return errorResponse(500, error, "failed");
    }
};

export const fetchUserById = async id => {
    try {
        let user = await UserModel.findOne({
            isActive: true,
            isDeleted: false,
            _id: id
        });
        return okResponse(200, { user: user.toUserJson() }, "success");
    } catch (error) {
        return errorResponse(500, error, "failed");
    }
};

export const updateUser = async (id, userInput) => {
    try {
        let user = await UserModel.findOne({
            isActive: true,
            isDeleted: false,
            _id: id
        });
        if (!user) {
            return errorResponse(404, null, "No user found");
        }
        if (userInput.primaryBusiness) {
            console.log("Updating primary business");
            updatePrimaryBusiness(id, userInput.primaryBusiness);
        }
        await user.updateOne(userInput);
        user = await UserModel.findById(id);
        return okResponse(200, { user: user.toUserJson() }, "success");
    } catch (error) {
        return errorResponse(500, error, "failed");
    }
};

export const deleteUser = async id => {
    try {
        console.log("--> id ", id);
        let user = await UserModel.findById(id);
        if (!user) {
            return errorResponse(404, _, "No User found");
        }

        await user.updateOne({ isDeleted: true, isActive: false });
        await OrganizationModel.updateMany({ users: { $in: [id] } },
            { isDeleted: true, isActive: false });
        return okResponse(200, { deleteUser: true, deleteBusiness: true }, "success");
    } catch (error) {
        return errorResponse(500, error, "failed");
    }
};

export const enableUser = async id => {
    try {
        console.log("--> id ", id);
        let user = await UserModel.findById(id);
        if (!user) {
            return errorResponse(404, _, "No User found");
        }

        await user.updateOne({ isDeleted: false, isActive: true });
        await OrganizationModel.updateMany({ users: { $in: [id] } },
            { isDeleted: false, isActive: true });
        return okResponse(200, { enableUser: true, enableBusiness: true }, "success");
    } catch (error) {
        return errorResponse(500, error, "failed");
    }
};


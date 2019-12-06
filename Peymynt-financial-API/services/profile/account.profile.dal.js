import { ProfileAccountModel } from "../../models/setting/account.profile.model";

export const createItem = async (accountProfileInput, userId) => {
    try {
        if (!accountProfileInput.userId) {
            accountProfileInput.userId = userId;
        }
        let accountProfile = new ProfileAccountModel(accountProfileInput);
        accountProfile = await accountProfile.save();
        return accountProfile.toUserJson();
    } catch (error) {
        throw error;
    }
};
export const getItem = async (accountAccountId) => {
    try {
        const account = await ProfileAccountModel.findOne({
            _id: accountAccountId,
            isActive: true
        });
        if (account)
            return account.toUserJson();
        else return null
    } catch (error) {
        throw error;
    }
};

export const getItems = async (userId) => {
    try {
        const accounts = await ProfileAccountModel.find({
            userId,
            isActive: true,
            isDeleted: false
        });
        return accounts.map(e => e.toUserJson());
    } catch (error) {
        throw error;
    }
};

export const patchItem = async (accountAccountId, accountProfileInput) => {
    try {
        let accountProfile = await ProfileAccountModel.findById(accountAccountId);
        if (accountProfile)
            return await accountProfile.updateOne(accountProfileInput);
        else return null;
    } catch (error) {
        throw error;
    }
};

export const deleteItem = async (accountAccountId) => {
    try {
        let accountProfile = await getItem(accountAccountId)
        if (accountProfile) {
            return await patchItem(accountAccountId, {
                isDeleted: true,
                isActive: false,
                deletedAt: new Date()
            });
        } else return null;
    } catch (error) {
        throw error;
    }
};
import { ProfileEmailModel } from "../../models/setting/email.profile.model";

export const createItem = async (emailProfileInput, userId) => {
    try {
        if (!emailProfileInput.userId) {
            emailProfileInput.userId = userId;
        }
        let emailProfile = new ProfileEmailModel(emailProfileInput);
        emailProfile = await emailProfile.save();
        return emailProfile.toUserJson();
    } catch (error) {
        throw error;
    }
};
export const getItem = async (emailAccountId) => {
    try {
        const email = await ProfileEmailModel.findOne({
            _id: emailAccountId,
            isActive: true
        });
        if (email)
            return email.toUserJson();
        else return null
    } catch (error) {
        throw error;
    }
};

export const getItems = async (userId, filter) => {
    let { status, isPrimary } = filter;
    try {
        const emailQuery = ProfileEmailModel.find({
            userId,
            isActive: true,
            isDeleted: false
        });
        if (status) {
            status = status == 'verified' ? 'Verified' : status;
            emailQuery.where("status").equals(status);
        }
        if (isPrimary)
            emailQuery.where("isPrimary").equals(isPrimary);

        let emails = await emailQuery.exec();
        return emails.map(e => e.toUserJson());
    } catch (error) {
        throw error;
    }
};

export const patchItem = async (emailAccountId, emailProfileInput) => {
    try {
        let emailProfile = await ProfileEmailModel.findById(emailAccountId);
        if (emailProfile)
            return await emailProfile.updateOne(emailProfileInput);
        else return null;
    } catch (error) {
        throw error;
    }
};

export const deleteItem = async (emailAccountId) => {
    try {
        let emailProfile = await getItem(emailAccountId)
        if (emailProfile) {
            return await patchItem(emailAccountId, {
                isDeleted: true,
                isActive: false,
                deletedAt: new Date()
            });
        } else return null;
    } catch (error) {
        throw error;
    }
};
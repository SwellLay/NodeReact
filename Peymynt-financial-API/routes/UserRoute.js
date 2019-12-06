import express from "express";
const router = express.Router();
import { ensureAuthenticated } from "../auth/JWTToken";
import { errorResponse } from "../util/HttpResponse";
import { validate } from "../util/utils";
import { UserPatchSchema } from "../validations/UserValidation";
import { addUser, updateUser, fetchUsers, fetchUserById, deleteUser, enableUser } from "../services/UserService";
import { fetchNotificationSetting, patchNotificationSetting } from "../services/profile/notification.setting.service";
import { addEmailAccount, getAllEmails, setPrimaryEmail, deleteEmail } from "../services/profile/email.profile.service";
import { addAccount, getAllAccounts, deleteAccount } from "../services/profile/account.profile.service";

router.post("/", ensureAuthenticated, async (req, res) => {
    let { userInput } = req.body;
    let { user, businessId } = req;
    if (!userInput) {
        return res.status(400).json(errorResponse(400, "Please pass valid payload", true));
    }
    let result = await addUser(req.body);
    console.log(result);
    return res.status(result.statusCode).json(result);
});

router.put("/:id", ensureAuthenticated, async (req, res) => {
    let { userInput } = req.body;
    let [err, message] = await validate(userInput, UserPatchSchema);

    if (err) {
        const validationError = errorResponse(400, null, message);
        return res.status(validationError.statusCode).json(validationError);
    }
    let result = await updateUser(req.params.id, userInput);
    res.status(result.statusCode).json(result);
});

router.get("/", ensureAuthenticated, async (req, res) => {
    let result = await fetchUsers();
    res.status(result.statusCode).json(result);
});

router.get("/:id", ensureAuthenticated, async (req, res) => {
    let result = await fetchUserById(req.params.id);
    res.status(result.statusCode).json(result);
});

router.delete("/:id", ensureAuthenticated, async (req, res) => {
    let result = await deleteUser(req.params.id);
    res.status(result.statusCode).json(result);
});

router.put("/:id/enable", ensureAuthenticated, async (req, res) => {
    let result = await enableUser(req.params.id);
    res.status(result.statusCode).json(result);
});

// Notifications
router.get("/:id/notifications", ensureAuthenticated, async (req, res) => {
    const result = await fetchNotificationSetting(req.params.id);
    res.status(result.statusCode).json(result);
});

router.patch("/:id/notifications", ensureAuthenticated, async (req, res) => {
    try {
        let { notificationSettingInput } = req.body;
        const result = await patchNotificationSetting(notificationSettingInput, req.params.id);
        res.status(result.statusCode).json(result);
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode).json(error);
    }
});

// Email & connected accounts
router.post("/:id/emails", ensureAuthenticated, async (req, res) => {
    let { emailProfileInput } = req.body;
    const result = await addEmailAccount(emailProfileInput, req.params.id);
    res.status(result.statusCode).json(result);
});

router.get("/:id/emails", ensureAuthenticated, async (req, res) => {
    const result = await getAllEmails(req.params.id, req.query);
    res.status(result.statusCode).json(result);
});

router.delete("/:id/emails/:emailId", ensureAuthenticated, async (req, res) => {
    const result = await deleteEmail(req.params.emailId);
    res.status(result.statusCode).json(result);
});

router.put("/:id/emails/:emailId", ensureAuthenticated, async (req, res) => {
    const result = await setPrimaryEmail(req.params.emailId, req.params.id);
    res.status(result.statusCode).json(result);
});

router.post("/:id/accounts", ensureAuthenticated, async (req, res) => {
    let { accountProfileInput } = req.body;
    const result = await addAccount(accountProfileInput, req.params.id);
    res.status(result.statusCode).json(result);
});

router.get("/:id/accounts", ensureAuthenticated, async (req, res) => {
    const result = await getAllAccounts(req.params.id);
    res.status(result.statusCode).json(result);
});

router.delete("/:id/accounts/:accountId", ensureAuthenticated, async (req, res) => {
    const result = await deleteAccount(req.params.accountId);
    res.status(result.statusCode).json(result);
});

export default router;
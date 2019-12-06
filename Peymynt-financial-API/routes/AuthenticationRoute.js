import express from "express";
import { authenticate, changePassword, googleAuth, sendResetLink, verifyResetLink, resetPassword } from "../services/AuthenticationService";
import { ensureAuthenticated } from "../auth/JWTToken";
import { UserModel } from '../models/user.model';
import { errorResponse } from "../util/HttpResponse";
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        let { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json(errorResponse(400, undefined, "Please provide email and password"));
        }
        let data = await authenticate({ email, password });
        // res.status(200).json({ data, message: "Login Successful", status: 200 });
        res.status(data.statusCode).json(data);
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode).json(error);
    }
});

router.post("/google", async (req, res) => {
    try {
        let result = await googleAuth(req.body);
        return res.status(result.statusCode).json(result);
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode).json(error);
    }
});

router.get('/google', async (req, res) => {
    console.log("--Google callback called ");
    return res.status(200).json({ message: "success" });
});

router.post("/changepassword", ensureAuthenticated, async (req, res) => {
    try {
        let { currentPassword, newPassword } = req.body;
        let result = await changePassword(req.user._id, currentPassword, newPassword);
        res.status(result.statusCode).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

// Generate reset link
router.post("/password/reset", async (req, res) => {
    try {
        let { email } = req.body;
        let result = await sendResetLink(email);
        res.status(result.statusCode).json(result);
    } catch (error) {
        return res.status(500).json(error);
    }
});

// Verify reset link
router.get("/password/reset/:token/verify", async (req, res) => {
    try {
        let result = await verifyResetLink(req.params.token);
        res.status(result.statusCode).json(result);
    } catch (error) {
        return res.status(500).json(error);
    }
});

// Reset password using public and private token
router.post("/password/reset/confirm", async (req, res) => {
    try {
        let { password, privateToken, publicToken } = req.body;
        let result = await resetPassword(password, publicToken, privateToken);
        res.status(result.statusCode).json(result);
    } catch (error) {
        return res.status(500).json(error);
    }
});

export default router;

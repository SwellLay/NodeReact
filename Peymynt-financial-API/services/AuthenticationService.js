import { UserModel } from "../models/user.model";
import { ResetHistoryModel } from "../models/auth/reset.model";
import { generateToken } from "../auth/JWTToken";
import { encode } from "../auth/codec";
import { sendResetEmail } from "../util/mail";
import { okResponse, errorResponse } from "../util/HttpResponse";
import { HTTP_OK, HTTP_BAD_REQUEST, HTTP_INTERNAL_SERVER_ERROR, HTTP_NOT_FOUND } from "../util/constant";
const { OAuth2Client } = require('google-auth-library');
import * as config from '../util/db.config';
import { slides } from "googleapis/build/src/apis/slides";
import moment from "moment";
import uuidv4 from "uuid/v4";

export const authenticate = async ({ email, password }) => {
    //TODO: Do authentication stuff here.
    try {
        let user = await UserModel.findOne({
            email,
            isActive: true,
            isDeleted: false
        }).populate("businesses");

        if (!user) {
            return errorResponse(400, undefined, "Sorry, seems this account not available.");
        }

        //Check for password
        if (!validPassword(user.password, password)) {
            return errorResponse(401, undefined, "You seems to have entered invalid credentials");
        }

        console.log("user ---------> ", user._doc);
        let token = generateToken(user.toTokenJson());
        return okResponse(HTTP_OK, { token, user: user.toUserJson() }, "Login successful!");
    } catch (error) {
        console.log(` errrrrrrrrrrrrrrr => ${JSON.stringify(error)}`);
        throw { statusCode: 500, data: {}, error, message: "Failed to login at the moment. Please try later" };
    }
};

export const changePassword = async (userId, currentPassword, newPasswrod) => {
    try {
        let userInfo = await UserModel.findById({ _id: userId });
        if (!validPassword(userInfo.password, currentPassword)) {
            return errorResponse(401, undefined, "Your current password is not correct");
        }
        userInfo.password = encode(newPasswrod);
        let result = await userInfo.updateOne(userInfo);
        return okResponse(200, null, "Password changed successful.");
    } catch (error) {
        errorResponse(500, undefined, "current password is wrong");
    }
};

export const validPassword = (origPass, reqPass) => {
    if (origPass === encode(reqPass)) {
        return true;
    }
    return false;
};

export const googleAuth = async (googleAuthResponse) => {
    if (googleAuthResponse && googleAuthResponse.profileObj) {
        const googleAuthProfile = {
            googleId: googleAuthResponse.profileObj.googleId,
            imageUrl: googleAuthResponse.profileObj.imageUrl,
            email: googleAuthResponse.profileObj.email,
            name: googleAuthResponse.profileObj.name,
            givenName: googleAuthResponse.profileObj.givenName,
            familyName: googleAuthResponse.profileObj.familyName,
            accessToken: googleAuthResponse.accessToken
        }
        console.log("---> google req <---", googleAuthProfile);

        // Here verifying idToken which
        // is coming from client slides.
        const client = new OAuth2Client(config.googleCliendId);
        const ticket = await client.verifyIdToken({
            idToken: googleAuthResponse.tokenId,
            audience: config.googleCliendId,
        });

        const payload = ticket.getPayload();
        const userid = payload['sub'];
        if (googleAuthResponse.googleId === userid) {
            const result = await dbCheckForGoogleAuth(googleAuthProfile);
            return result;
        } else {
            return errorResponse(500, error, "You seems to have entered invalid credentials");
        }
    }

    return errorResponse(500, undefined, "Sorry, we do not recognize the email and/or password provided. Please try again or create an account.");
}

const dbCheckForGoogleAuth = async (googleAuthProfile) => {
    console.log(" ---------dbCheckForGoogleAuth---------------")
    const user = await UserModel.findOne({
        email: googleAuthProfile.email,
        isActive: true,
        isDeleted: false
    });
    // Check if user already exists
    if (user) {
        // Check if already registered with google
        let updateResult;
        if (user.googleUser && user.googleUser.googleId == googleAuthProfile.googleId) {
            // Already registered, Lets update
            updateResult = await updateGoogleUser(user._id, googleAuthProfile);
        } else {
            // Account is there but Google login has been done just now. Lets update Google info on account
            updateResult = await updateGoogleUser(user._id, googleAuthProfile);
        }
        console.log("updateResult result: " + JSON.stringify(updateResult, null, 2));
        return updateResult;
    } else {
        // Create new user
        let result = await insertGoogleUser(googleAuthProfile);
        return result;
    }
}

const insertGoogleUser = async (googleAuthResponse) => {
    console.log(" ---------insertGoogleUser---------------")
    const newUser = new UserModel({
        googleUser: {
            "googleId": googleAuthResponse.googleId,
            "imageUrl": googleAuthResponse.imageUrl,
            "email": googleAuthResponse.email,
            "name": googleAuthResponse.name,
            "givenName": googleAuthResponse.givenName,
            "familyName": googleAuthResponse.familyName,
            "accessToken": googleAuthResponse.accessToken
        },
        "securityCheck": {
            "emailVerified": true,
            "mobileVerified": false,
            "isBlocked": false
        },
        "isActive": true,
        "isDeleted": false,
        "firstName": googleAuthResponse.name,
        "email": googleAuthResponse.email,
        "password": ""

    });
    try {
        const userInfo = await newUser.save();
        console.log("newUser.toObject() : " + JSON.stringify(userInfo.toObject(), null, 2));
        let token = await generateToken(userInfo.toTokenJson());
        return okResponse(200, { token, user: userInfo.toUserJson() }, "Google login success");
    } catch (error) {
        return errorResponse(500, error, "Failed to login with Google");
    }

}

const updateGoogleUser = async (userId, googleAuthResponse) => {
    console.log(" ---------updateGoogleUser---------------")
    try {
        let googleUser = {
            "googleId": googleAuthResponse.googleId,
            "imageUrl": googleAuthResponse.imageUrl,
            "email": googleAuthResponse.email,
            "name": googleAuthResponse.name,
            "givenName": googleAuthResponse.givenName,
            "familyName": googleAuthResponse.familyName,
            "accessToken": googleAuthResponse.accessToken
        };
        const updatedUser = await UserModel.findOneAndUpdate({ _id: userId }, { googleUser }, { new: true })
            .populate("businesses");
        console.log("after userInfo : " + JSON.stringify(updatedUser.toObject(), null, 2));
        if (!updatedUser) {
            return errorResponse(500, error, "Failed to update Google authentication detail");
        }
        let token = generateToken(updatedUser.toTokenJson());
        return okResponse(200, { token, user: updatedUser.toUserJson() }, "Google login success");
    } catch (error) {
        return errorResponse(500, error, "Google login failed");
    }
}

export const sendResetLink = async (email) => {
    try {
        let messageToDisplay = `<span class='messageToDisplay'>If we find <span style='background-color:#f5f1a3'>${email}</span> in our system, we will send you an email with a link to reset your password.</span>`;
        let user = await UserModel.findOne({
            email,
            isDeleted: false
        })
        if (!user) {
            return okResponse(HTTP_OK, { messageToDisplay }, "Success");
        }
        if (user.isActive == false) {
            messageToDisplay = `<span class='messageToDisplay'>We found that <span style='background-color:#f5f1a3'>${email}</span> is not active. Please contact the support team.</span>`
            return okResponse(HTTP_NOT_FOUND, { messageToDisplay }, "Failed");
        }
        let reset = new ResetHistoryModel({
            email,
            userId: user._id,
            expiredAt: moment().add(30, 'minutes')
        })
        reset = await reset.save();
        console.log("Reset publicToken : ", reset.publicToken);
        let mailerResponse = await sendResetEmail(email, reset.publicToken);
        console.log("mailerResponse", mailerResponse);
        return okResponse(HTTP_OK, { messageToDisplay, publicToken: reset.publicToken }, "Success");
    } catch (error) {
        // console.log(error);
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
}

export const verifyResetLink = async (publicToken, isConsuming = false, privateToken) => {
    try {
        let messageToDisplay = `<span class='messageToDisplay'>The password reset link was invalid, possibly because it has already been used.<br> Please request another password reset.</span>`;
        if (!publicToken) {
            messageToDisplay = "Public token is missing";
            return errorResponse(HTTP_BAD_REQUEST, { messageToDisplay }, "Public token is missing");
        }
        let resetQuery = ResetHistoryModel.findOne({
            publicToken,
            isActive: true
        })
        if (isConsuming) {
            if (!privateToken) {
                messageToDisplay = "Private token is missing";
                return errorResponse(HTTP_BAD_REQUEST, { messageToDisplay }, "Private token is missing");
            }
            resetQuery.where("privateToken").equals(privateToken);
        }

        let reset = await resetQuery.exec();
        if (!reset) {
            return okResponse(HTTP_NOT_FOUND, { messageToDisplay }, "Failed");
        }

        // check if link is expired
        let currentTime = moment();
        if (currentTime > reset.expiredAt) {
            return okResponse(HTTP_BAD_REQUEST, { messageToDisplay }, "Failed");
        }
        let data = {}
        if (isConsuming) {
            reset.isConsumed = true;
            reset.consumedAt = moment();
            reset.isActive = false;
            data = {
                userId: reset.userId
            }
        } else {
            reset.isVerified = true;
            reset.verifiedAt = new Date();
            reset.hitCount++;
            reset.privateToken = uuidv4();
            data = {
                privateToken: reset.privateToken
            }
        }
        reset = await reset.save();
        messageToDisplay = ``;
        return okResponse(HTTP_OK, data, "Success");
    } catch (error) {
        console.log(error);
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
}

export const resetPassword = async (password, publicToken, privateToken) => {
    try {
        let verificationResponse = await verifyResetLink(publicToken, true, privateToken);
        if (verificationResponse.statusCode == HTTP_OK) {
            let user = await UserModel.findById(verificationResponse.data.userId);
            if (!user) {
                return errorResponse(HTTP_BAD_REQUEST, { messageToDisplay: "Seems this user doesn't exist. Please contact support team" }, "Seems this user doesn't exist. Please contact support team");
            }
            console.log("password ", password);
            user.password = password;
            await user.save();
            return okResponse(HTTP_OK, null, "Password changed successfully");
        } else {
            return errorResponse(HTTP_BAD_REQUEST, { messageToDisplay: verificationResponse.data ? verificationResponse.data.messageToDisplay : "Internal server error" }, "Failed");
        }
    } catch (error) {
        console.log(error);
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
}
/**
 * The file contains authentication utils and middlewares to
 * ensure whether the user is authenticated or not.
 * */

import crypto from "crypto";
import jsonwebtoken from "jsonwebtoken";
import moment from "moment";
import uuid from "uuid";

/*Authentication interceptor*/
export const ensureAuthenticated = (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).send({
                code: 401,
                message: "Please make sure your request has an Authorization header",
                status: "failed",
                reason: "Invalid Auth header"
            });
        }
        //TODO: This will only active once client side implementation is done.

        // if (!req.headers["x-peymynt-business-id"]) {
        if (!req.headers["x-peymynt-business-id"]) {
            return res.status(401).send({
                code: 401,
                message: "Please make sure your request has an x-peymynt-business-id header",
                status: "failed",
                reason: "Invalid header"
            });
        }

        let authToken = req.headers.authorization;
        // req.businessId = req.headers["x-peymynt-business-id"];
        req.businessId = req.headers["x-peymynt-business-id"];
        req.user = decodeToken(authToken);
        let decodedVerifiedJwtToken;
        try {
            decodedVerifiedJwtToken = jsonwebtoken.verify(authToken, process.env.SECRET_TOKEN);
        } catch (err) {
            console.error("errrrrrrrrrrr---------------> ", err);
            return res.status(401).json(err);
        }
        return next();
    } catch (error) {
        console.error(`Error ${error}`);
        res.status(401).json(error);
    }

};

export const generateToken = (
    input,
    secretToken = process.env.SECRET_TOKEN
) => {
    let token = jsonwebtoken.sign(input, secretToken, {
        expiresIn: process.env.TOKEN_EXPIRE_TIME,
        jwtid: uuid.v4()
    });
    return token;
};

export const generateSecret = input => {
    return jsonwebtoken.sign(input, process.env.CHECKSUM_SECRET, {
        expiresIn: process.env.SECRET_EXPIRE_TIME,
        jwtid: uuid.v4()
    });
};

export const decodeToken = payload => {
    try {
        return jsonwebtoken.decode(payload);
    } catch (error) {
        throw error;
    }
};

export const decodeRefreshToken = refreshToken => {
    try {
        return jsonwebtoken.decode(refreshToken, process.env.CHECKSUM_SECRET);
    } catch (err) {
        throw new Error(err);
    }
};

export const validateHashKey = (req, res, buf, encoding) => {
    let headers = req.headers;
    //Check if hash key validation required
    if (req.path && req.path.indexOf("/otp") === -1) {
        return;
    }

    if (!headers) {
        let err = {
            code: 400,
            status: "Failed"
        };

        console.log("headers err => ", err);
        throw new Error(err);
    }

    let qs = buf.toString(encoding);

    console.log("qs => ", qs);

    let locale = headers["x-request-locale"] || "en";
    let currentTime = moment().unix();
    if (
        currentTime - headers["x-request-date"] > 300 ||
        currentTime - headers["x-request-date"] < -300
    ) {
        console.error(
            "=>validateHashKey Invalid date currentTime",
            currentTime,
            req.path,
            req.headers,
            qs
        );
        let err = {
            code: 400,
            status: "Invalid datetime on phone"
        };
        throw new Error(err);
    }

    qs += headers["x-request-date"];
    let hashVal = crypto
        .createHmac("md5", process.env.CHECKSUM_SECRET)
        .update(qs)
        .digest("base64");

    console.log("=>validateHashKey qs", qs);
    if (hashVal !== headers["x-request-hash"]) {
        console.error("=>validateHashKey Invalid hash", req.path, req.headers, qs);
        let err = {
            code: 400,
            status: "Invalid request hash"
        };
        throw new Error(err);
    }
};

export const validateRefresh = (req, res, next) => {
    let refreshToken = req.query.refreshToken;

    console.log(req.query);

    if (!refreshToken) {
        console.log("Missing refresh token in params");
        return res
            .status(400)
            .send(
                ["Error", "Please make sure your request has a refreshToken"].join(":")
            );
    }

    let payload = decodeRefreshToken(refreshToken);

    req.refreshToken = payload.refreshToken;
    return next();
};

export const verifyPassword = async (dbPass, requestedPass) => {
    //TODO: Validate pass.
    return true;
};

export const verifyAndDecodeToken = (authToken) => {
    let decodedJwtTokenRequest = decodeToken(authToken);
    if (!decodedJwtTokenRequest) {
        throw new Error('Auth token supplied is corrupted');
    }

    let decodedVerifiedJwtToken;
    try {
        decodedVerifiedJwtToken = jwt.verify(authToken, process.env.SECRET_TOKEN);
    } catch (err) {
        if (err.message === 'invalid issuer')
            res.status(500).json({ message: `Token issued, cannot be used in this endpoint.` });
        if (err.name === 'JsonWebTokenError' || err.message === 'invalid signature')
            res.status(500).json({ message: `Invalid access token, because of ${err.message}` });
        else if (err.name === 'TokenExpiredError')
            res.status(500).json({ message: "Access token for API Key has expired" });
    }

    console.log(decodedVerifiedJwtToken);

    return decodedVerifiedJwtToken;
}

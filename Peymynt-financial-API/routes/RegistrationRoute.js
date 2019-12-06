import express from "express";
import { UserSchema } from '../validations/UserValidation';
import { registerUser } from "../services/RegistrationService";
import { errorResponse } from "../util/HttpResponse";
import Joi from "joi";
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        let { userInput } = req.body;
        if (!userInput) {
            console.log("Please provide user input");
            return res
                .status(400)
                .json(errorResponse(400, undefined, "Please provide user input"));
        }
        try {
            const result = await Joi.validate(userInput, UserSchema);
            console.log("----------------> ", result);
        } catch (validationError) {
            console.log("----validation error------------> ", validationError);
            validationError = errorResponse(500, null, validationError);
            return res.status(validationError.statusCode).json(validationError);
        }

        const [err, data] = await registerUser(userInput);
        if (err) {
            console.log("error occured", err);
            return res.status(err.statusCode).json(err);
        }

        return res.status(data.statusCode).json(data);
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode).json(error);
    }
});

export default router;

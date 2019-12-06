import { UserModel } from "../models/user.model";
import { errorResponse, okResponse } from "../util/HttpResponse";
import { generateToken } from "../auth/JWTToken";

export const registerUser = async userInput => {
    try {
        console.log("-----------> register service <----------", userInput);
        let { email } = userInput;
        let user = await UserModel.findOne({ email, isActive: true, isDeleted: false });
        if (user) {
            return [errorResponse(409, null, "User with this email already exists"), null];
        }
        user = new UserModel(userInput);
        user = await user.save();
        let token = generateToken(user._doc);
        return [false, okResponse(201, { user, token }, "Registration successful")];
    } catch (error) {
        console.log(error);
        return [errorResponse(500, null, error), null];
    }
};

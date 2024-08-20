import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";


export const verifyJWT = asyncHandler(async (req, res, next) => {

    try {

        const token = req.cookies?.accessToken || req.header("authorization")?.replace("Bearer ", "");
        
        if (!token) {
            throw new ApiError(401, "User is not logged in");
        }

        const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decoded?._id).select("-password -refreshToken")

        if (!user) {
            throw new ApiError(401, "User is not logged in");
        }

        req.user = user;
        next();
        
    } 
    catch (error) {
        
        console.log("error", error);
        throw new ApiError(401, "User is not logged in");
    }
})

import { asyncHandler } from "../util/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../model/User.model.js";
import { Apierrorr } from "../util/Apierrorr.js";

export const verifyJWT = asyncHandler(async(req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        // console.log(token);
        if (!token) {
            throw new Apierrorr(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            console.log("user not find" , error)
            
        }
    
        req.user = user;
        next()
    } catch (error) {
        throw new Apierrorr(401, error?.message || "Invalid access token")
    }
    
});
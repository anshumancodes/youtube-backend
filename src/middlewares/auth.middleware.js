import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";

const verifyJwt=asyncHandler(async(req,res,next)=>{
    req.cookies?.accessToken || req.header ("Authorization")?.replace("Bearer ", "");

    if(!token){
        throw new ApiError(401,"Unauthorized Request")
    }
})
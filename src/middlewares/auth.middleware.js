import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js"
const verifyJwt=asyncHandler(async(req,res,next)=>{
  try {
     const token= req.cookies?.accessToken || req.header ("Authorization")?.replace("Bearer ", "");
  
      if(!token){
          throw new ApiError(401,"Unauthorized Request")
      }
     const verifiedToken=jwt.verify(token,process.env.ACESS_SECRET_KEY);
     const user= await User.findById(verifiedToken._id).select("-password -refeshToken");
  
     if(!user){
      throw new ApiError(401,"Invalid access Token")
     }
     req.user=user;

     next()
  } catch (error) {
    throw new ApiError(401,error? error.message : "Invalid access token" )
  }

}) ;


export {verifyJwt}
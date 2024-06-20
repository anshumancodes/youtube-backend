import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
// import {User} from "../models/user.model.js"
// import mongoose from "mongoose";

const resigterUser=asyncHandler(async(req,res)=>{
    // get user data from client side
    // check info aint null or empty
    // check if imgs there if it exits upload it to cloudinary from local
    // check if cloudinary upload is sucessfull
    // check if user already exists by email or username [anything unique will do]
    // if not exists create new user using user model
    // check if user is created if created then:
    // send response to client side on sucesfull user creation!

    // done !

    const {email,username,fullname,password}=req.body;
    console.log(email);

    if(!email){
     

        throw new ApiError(400,"email field cant be empty",)


    }
   
})

export {resigterUser}
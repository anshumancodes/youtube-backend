import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {validatePasswordFormat,validateEmailFormat,validateFormFields}from "../utils/FormValidation.js"
import {User} from "../models/user.model.js"
import { uploadOnCloud } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

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


    // check if any form field is empty
    const {email,username,fullname,password}=req.body;
    console.log(email);

    const fields =[email, username, fullname, password]

    validateFormFields(fields);

    validateEmailFormat(email)

    validatePasswordFormat(password)
    

    //check if user already exits
    const existedUser=User.findOne({
        $or: [{email},{username}]
    });

    if(existedUser){
        throw new ApiError(409,"User with email or username already exits");
    }
    

    // get files

   const avatarLocalPath= req.files?.avatar[0]?.path;
   const coverLocalPath=req.files?.coverImage[0]?.path;
   

   if(!avatarLocalPath){
    throw new ApiError(400,"Avatar img is required");
   }

  const avatar= await uploadOnCloud(avatarLocalPath);
  const coverImage= await uploadOnCloud(coverLocalPath);


  if(!avatar){
    throw new ApiError(400,"Avatar img is required");
}
const user= await User.create({
    username:username.tolowercase,
    email,
    fullname,
    avatar:avatar,
    coverImage:coverImage?coverImage:null,
    password,
    refreshToken


})

const isUserCreated=User.findById(user._id).select("-password -refreshToken");

if(!isUserCreated){
    throw new ApiError(500,"Something went wrong in server while creating the user profile");
}
else{
    return new ApiResponse(201,isUserCreated,"created user profile sucessfully")
}


   
})

export {resigterUser}  
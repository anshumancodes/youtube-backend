import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {
  validatePasswordFormat,
  validateEmailFormat,
  validateFormFields,
} from "../utils/FormValidation.js";
import { User } from "../models/user.model.js";
import { deleteOldUploadOnUpdate, uploadOnCloud } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

const resigterUser = asyncHandler(async (req, res) => {
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
  const { email, username, fullname, password } = req.body;

  const fields = [email, username, fullname, password];

  validateFormFields(fields);

  validateEmailFormat(email);

  validatePasswordFormat(password);

  //check if user already exits
  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exits");
  }

  // get files

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar img is required");
  }

  const avatar = await uploadOnCloud(avatarLocalPath);
  const coverImage = await uploadOnCloud(coverLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar img is required");
  }
  const user = await User.create({
    username: username.toLowerCase(),
    email,
    fullname,
    avatar: avatar,
    coverImage: coverImage ? coverImage : null,
    password,
  });

  const isUserCreated = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!isUserCreated) {
    throw new ApiError(
      500,
      "Something went wrong in server while creating the user profile",
    );
  } else {
    return res
      .status(201)
      .json(
        new ApiResponse(200, isUserCreated, "created user profile sucessfully"),
      );
  }
});


const generateAccessAndRefreshTokens=async(userId)=>{

    try {

        const existedUser=await User.findById(userId)
        const accessToken =existedUser.generateAccessToken()
        const refreshToken=existedUser.generateRefreshToken()

        existedUser.refreshToken=refreshToken;
        await existedUser.save({validateBeforeSave:false});

        return {accessToken,refreshToken};
        
    } catch (error) {
        throw new ApiError(503,"unable to generate tokens right now ! please try again");
        
    }

}
const loginUser = asyncHandler(async (req, res) => {
  // take email or username,passoword
  // check if username already exists or not if not redirect to register page
  // if exists then check password if correct then login else show error
  // on login provide a acess token , refresh token by cookie
  // send sucess response.
  // and redirect to homepage!

  const { username, email, password } = req.body;

  const emailOrusername = username || email;

  const fields = [emailOrusername, password];
  validateFormFields(fields); // check if input fields are filled or not

  const user = await User.findOne({"$or":[{username},{email}]});

  if(!user){
    throw new ApiError(404,"User not found ! please register before trying to login")
  }
  
  //   check password
  const correctPassword=await user.isPasswordCorrect(password);

  if(!correctPassword){
    throw new ApiError(401, "incorrect password ! please try again")
  }
  const {accessToken,refreshToken}= await generateAccessAndRefreshTokens(user._id);


  const options={
    httpOnly:true,
    secure:true
  }

  const loggedinUser={
    username:user.username,
    email:user.email,
    refreshToken,
    accessToken

  }
  
  return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(
    new ApiResponse(200,
        {
            
         user: loggedinUser
        },"logged in successfully",)
  )



});

const logOutUser=asyncHandler(async(req,res)=>{
 await User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{

        refreshToken:undefined,
      }
    
    }
  )

  const options={
    httpOnly:true,
    secure:true
  }

  return res.status(200).clearCookie("accessToken",options).json(new ApiResponse(200,{},"logged out successfully"));





})


const reassignAcessToken=asyncHandler(async()=>{
  const refreshTokenWithUserReq=req.cookies.refreshToken || req.body.refreshToken;
  if(!refreshTokenWithUserReq){
    throw new ApiError(401,"Unauthroized access attempt . please login! ")


  }

  try {
    const decodedToken= jwt.verify(refreshTokenWithUserReq,process.env. REFRSH_TOKEN_KEY);
  
    const UserfreshTokenInDb=await User.findById(decodedToken?._id).refreshToken;
  
    if(!UserfreshTokenInDb){
      throw new ApiError(401,"Invalid refresh Token")
    }
  
    if(refreshTokenWithUserReq!=UserfreshTokenInDb){
    throw new ApiError(401,"Expired Refresh token or used")
    }
  
    const options={
      httpOnly:true,
      secure:true
    }
    const {accessToken,newRefreshToken}= await generateAccessAndRefreshTokens(decodedToken._id);
    return res.status(200).cookie("accessToken",accessToken,options).
    cookie("refreshToken",newRefreshToken,options).
    json(new ApiResponse("200",{
      accessToken,refreshToken:newRefreshToken
    },"reassigned tokens"))
    
  } catch (error) {
    throw new ApiError(401,error?.message || "something went wrong while reassigning tokens")
    
  }
})

const changePassword=asyncHandler(async(req,res)=>{

  const { oldPassword,newPassword,confirmPassword}=req.body;

  const tokenWithUser= req.cookies.refreshToken;
  const decodedToken=jwt.verify(tokenWithUser,process.env.REFRSH_TOKEN_KEY);
  const user=await User.findById(decodedToken._id);

  const passwordCheck=await user.isPasswordCorrect(oldPassword);
  if(!passwordCheck){
    throw new ApiError(401,"old password is incorrect")
  }

  if(newPassword!=confirmPassword){
    throw new ApiError(401,"new password and confirm password does not match")


  }
  user.password=newPassword
  await user.save({validateBeforeSave:false});
  res.status(200).json(new ApiResponse("200","password changed successfully"))

})

const getCurrentUser=asyncHandler(async(req,res)=>{
  const user=req.user;
  res.status(200).json(new ApiResponse("200",user,"current user fetched successfully"))

})
const HandleForgotPassword=asyncHandler(async(req,res,next)=>{
  const {email ,username}=req.body;

})

const updateUserAvatar=asyncHandler(async()=>{
 
  const avatarLocalPath = req.file?.avatar?.path;

  if(!avatarLocalPath){
    throw new ApiError(400,"avatar is required");

  }

  const avatarUpdatedonCloud=await uploadOnCloud(avatarLocalPath);

  if(!avatarUpdatedonCloud.url){
    throw new ApiError(400,"avatar is not uploaded failed please try again");

  }

  const user=await User.findByIdAndUpdate(req.user._id,{
    "$set":{
      avatar:avatarUpdatedonCloud.url
    }
  }).select("-password");
  

  const avatarBeforeUpdate=user.avatar;
  await deleteOldUploadOnUpdate(avatarBeforeUpdate);  // deletes avatar file on cloudinary on update;

  return res.status(200).json(new ApiResponse("200",{updatedAvatarUrl:avatarUpdatedonCloud.url},"Avatar image updated successfully!"));



 
})

const updateCoverImage=asyncHandler(async()=>{

  const coverImageLocalPath=req.file?.coverImage?.path;
  if(!coverImageLocalPath){throw new ApiError(400,"cover image is required");}
  const coverImageUpdatedOnCloud=await uploadOnCloud(coverImageLocalPath);
  if(!coverImageUpdatedOnCloud.url)
    {throw new ApiError(400,"cover image is not uploaded , upload failed please try again");}
  
  await User.findByIdAndUpdate(req.user._id,{
    "$set":{
      coverImage:coverImageUpdatedOnCloud.url
    }
  },
  {new:true}).select("-password");

  return res.status(200).json(new ApiResponse("200",{updatedCoverImageUrl:coverImageUpdatedOnCloud.url},"cover image updated successfully!"));



})

const getUserChannel=asyncHandler(async(req,res)=>{
  const {username}=req.params;

  if(!username?.trim()){
    throw new ApiError(400,"username missing!")
  }

 const channel= await User.aggregate([
    {
      $match:{
        username:username?.toLowerCase()
      }
    },
    {
      $lookup:{
        from:"subscriptions",
        localField:"_id",
        foreignField:"channel",
        as:"subscribers"
      }
    },{
      $lookup:{
        from:"subscriptions",
        localField:"_id",
        foreignField:"subscriber",
        as:"subscribedTo"

      }
    },{
      $addFields:{
        subscribers:{$size:"$subscribers"},
        subscribedTo:{$size:"$subscribedTo"}
      }
    },{
      $project:{
        _id:1,
        username:1,
        fullname:1,
        email:1,
        subscribers:1,
        subscribedTo:1,
        avatar:1,
        coverImage:1,

    }}
  ])
  res.status(200).json(new ApiResponse(200,{channel},"channel info"))

})

export { resigterUser, loginUser ,logOutUser,reassignAcessToken,changePassword,getCurrentUser,HandleForgotPassword ,updateCoverImage,updateUserAvatar};

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {
  validatePasswordFormat,
  validateEmailFormat,
  validateFormFields,
} from "../utils/FormValidation.js";
import { User } from "../models/user.model.js";
import { uploadOnCloud } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

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

export { resigterUser, loginUser ,logOutUser };

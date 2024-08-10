import mongoose,{isValidObjectId} from "mongoose";
import {Like} from "../models/like.model"
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";



const toggleVideoLike=asyncHandler(async(res,req)=>{
    const{videoId}=req.params;

    const isValid=isValidObjectId(videoId);

    if(!isValid){
        throw new ApiError(400,"Bad request!");

    }

    const user=req.user;

   try {
     const isVideoLiked=await Like.findOne({video:videoId,likedby:user._id});
     if(isVideoLiked){
         await Like.deleteOne({video:videoId,likedby:user._id});
         return res.status(200).json(new ApiResponse(200,"Video unliked successfully!")) ;}
     else{
         await Like.create({video:videoId,likedby:user._id});
         return res.status(200).json(new ApiResponse(200,"Video liked successfully!"))
         
 
     }
     
   } catch (error) {
     throw new ApiError(500,error?.message||"Internal server error!");
   }



});

const toggleCommentLike=asyncHandler(async (req,res) => {

    const {commentId}=req.params;
    const user=req.user;

    const isCommentValid=isValidObjectId(commentId);
    const isuseridValid=isValidObjectId(user._id);

    if(!isCommentValid || !isuseridValid){
        throw new ApiError(400,"Bad request!");
    }

    try {
        const isCommentLiked=await Like.findOne({Comment:commentId,likedby:user._id});
        if(isCommentLiked){
            await Like.deleteOne({Comment:commentId,likedby:user._id});
        }
        else{
            await Like.create({Comment:commentId,likedby:user._id});
        }
        return res.status(200).json(new ApiResponse.success({message:"Comment liked successfully!"}));
    } catch (error) {
        throw new ApiError(500,error?.message||"Internal server error!");
        
    }
    


    
});

const toggleCommunityPostLike=asyncHandler(async (req,res) => {
    const {postId}=req.params;
    const user=req.user;

    const ispostValid=isValidObjectId(postId);
    const isuseridValid=isValidObjectId(user._id);

    if(!ispostValid || !isuseridValid){
        throw new ApiError(400,"Bad request")
    }

    const isPostLiked=await Like.findOne({communityPost:postId,likedby:user._id});

    try {
        if(isPostLiked){
            await Like.deleteOne({communityPost:postId,likedby:user._id});
            return res.status(200).json(new ApiResponse(200,"unliked community post "))
        }
        else{
            await Like.create({communityPost:postId,likedby:user._id});
            return res.status(200).json(new ApiResponse(200,"liked community post "))
        }
    } catch (error) {
        
        throw new ApiError(500,error?.message||"Internal server error!");
    }
    


});

// to add 
// #controller for liked videos by user




export {toggleCommentLike,toggleCommunityPostLike,toggleVideoLike}
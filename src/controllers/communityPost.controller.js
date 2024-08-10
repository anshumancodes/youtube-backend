import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { communityPost } from "../models/communityPost.model.js";
import mongoose from "mongoose";
import {User} from "../models/user.model.js"


const composePost=asyncHandler(async(req,res)=>{


    const {content}=req.body;
    const user=req.user;
    const owner=await User.findById(user._id).select("-password -watchHistory -avatar -coverImage -refreshToken ");

    if(!content){
        return new ApiError(400,"Please Insert some content");
    }

   const post= await communityPost.create({
        content,
        owner
    });

    if(!post){
        return new ApiError(500,"Failed to create post");
    }

    return res.status(200).json(new ApiResponse(200,"Post created Succesfully ",{
        content:post.content,
        authorDetails:post.owner
    }))





    

});

const updatePost=asyncHandler(async(req,res)=>{
    const {content}=req.body;
    const {postId}=req.params;
   
    if(!content){
        return new ApiError(400,"Please Insert some content that to be updated");
    }
    if(!postId){
        return new ApiError(400,"Bad Request", "Missing required parameter : postId");
    }
   const updatedPost=await communityPost.findOneAndUpdate({_id:postId},{
        "$set":{
            content:content
        }
    },{new:true});

    return res.status(200).json(new ApiResponse(200,{
        content:updatedPost.content
    },"Post content updated Succesfully!"))

})

const getPosts=asyncHandler(async(req,res)=>{
    const {user}=req.user;

    const posts=await communityPost.find({
        
            owner:user._id

        
    });
    if(!posts){
        return new ApiError(404,"cant retrieve posts");
    }
    if(posts.length==0){
        return new ApiError(404,"No posts found");
    }


    return res.status(200).json(new ApiResponse(200,"Posts retrieved Succesfully!",{
        posts:posts
    }));

});

const deletePost=asyncHandler(async(req,res)=>{
    const {postId}=req.params;
    if(!postId){
        return new ApiError(400,"Bad Request", "Missing required parameter : postId");
    }

    const deleted=await communityPost.findOneAndDelete({
        _id:postId
    })
    if(!deleted){
        return new ApiError(500,"Unable to delete post");
    }
    return res.status(200).json(new ApiResponse(200,"Post deleted Succesfully!"));
})

export {composePost,updatePost,getPosts,deletePost}
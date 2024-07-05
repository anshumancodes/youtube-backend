import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { communityPost } from "../models/communityPost.model.js";
import mongoose from "mongoose";



const composePost=asyncHandler(async(req,res)=>{


    const {content}=req.body;
    if(!content){
        throw new ApiError(400,"content is required");
    }
    const writeContent= async(content)=>{
        

        const postOwner=communityPost.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(req.user._id),}
            },{
                $lookup:{
                    from:"users",
                    localField:"owner",
                    foreignField:"_id",
                    as:"owner"
                }
            },
            {
                $project:{
                    username:1,
                    fullname:1,
                    avatar:1,
                }
            },{
                $addFields:{
                    owner:{
                        $first:"$owner"
                }
            }}
        ])

        const newcommunitypost=await communityPost.create({
            content,
            owner:postOwner
        })
        

        return res.status(200).json(new ApiResponse(200,{
            content:newcommunitypost,
            owner:owner
        },"communityPost created sucessfully!"))

        
    }

    try {

        await writeContent(content)
        
    } catch (error) {
        throw new ApiError(500,"Internal Server Error");
        
    }

})


export {composePost}
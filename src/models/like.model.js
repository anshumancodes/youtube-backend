import mongoose, { Schema } from "mongoose";

const likeSchema=new Schema({
    Comment:{
        type:Schema.Types.ObjectId,
        ref:"Comments"

    },video:{
        type:Schema.Types.ObjectId,
        ref:"Videos"

    },
    likedBy:{
        type:Schema.Types.ObjectId,
        ref:"Users"

    },
    communityPost:{
        type:Schema.Types.ObjectId,
        ref:"CommunityPosts"

    }
},{timestamps:true})

export const Likes= mongoose.model("Likes",likeSchema);
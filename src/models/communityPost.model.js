import mongoose, { Schema } from "mongoose";


const communitypost=new Schema({
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    content:{
        type:String,
        required:true,


    }
},{timestamps:true});

export const communityPost = mongoose.model("communitypost",communitypost);
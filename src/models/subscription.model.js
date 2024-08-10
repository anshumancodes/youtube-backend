import mongoose ,{Schema} from "mongoose";

const subscriptionSchema= new Schema({

    subscriber:{
        type:Schema.Types.ObjectId,     // one who is subscribing  -subscriber id 
        ref:"User"
    },
    channel:
        {
            type:Schema.Types.ObjectId,  // one to whom 'subscriber' is subscribing - channel id 
            ref:"User"
        }
    


},{timestamps:true})


export const Subscription=mongoose.model("Subscription",subscriptionSchema);
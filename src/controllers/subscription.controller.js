import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import {Subscription} from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"


// strucutre of subscription schema
// subscriber - one that subscribes
// channel - to which this subscriber has subsribed  

// to extract subcriber count for channel x we can count all docs that contains channel x as channel 
// to extract what channels the subscriber has subcribed to we can check all the channel with same subscriber


// to toggle subcription , we will get channel id - check if subscriber has the channel matched if matched unsubcribed , else subscribe 


const toggleSubcription=asyncHandler(async(req,res)=>{
    const {channelId}=req.params;
    const {subscriber}=req.user;

    const isSubcribed=Subscription.findOne({
        subscriber,
        channel:channelId
    });
    if(isSubcribed){
        await Subscription.deleteOne({
            subscriber: subscriber,
            channel: channelId
        });
        return res.status(200).json(new ApiResponse(200, "Unsubscribed!"));
    }
    else{
        const newSubscription=new Subscription({
            subscriber,
            channel:channelId
    });
    await newSubscription.save();

    return res.status(200).json(new ApiResponse(200, "Subscribed!"));



}

    


})

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params;

    const subscriberCount= await Subscription.aggregate([
        {
            $match: {channel:channelId}
        },{
            $group: {
                _id: "$channel",
                count: { $sum: 1 } // Counting the number of subscribers
            }
        }
    ]);
    
    return res.status(200).json(new ApiResponse(200,{
        subscribers:subscriberCount>0?subscriberCount:0
    },"Subscriber Count"))

    

})


export {toggleSubcription,getUserChannelSubscribers}




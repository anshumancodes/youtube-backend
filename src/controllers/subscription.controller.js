import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import {Subscription} from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js";



// strucutre of subscription schema
// subscriber - one that subscribes
// channel - to which this subscriber has subsribed  

// to extract subcriber count for channel x we can count all docs that contains channel x as channel 
// to extract what channels the subscriber has subcribed to we can check all the channel with same subscriber


// to toggle subcription , we will get channel id - check if subscriber has the channel matched if matched unsubcribed , else subscribe 


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const user= req.user.id; // Fixed: Access user ID properly
    console.log(user,"->",channelId)
    // Fixed: Added await and proper error checking
    const isSubscribed = await Subscription.findOne({
        subscriber: user,
        channel: channelId
    });

    if (isSubscribed) {
        // Unsubscribe
       const removedSubscription= await Subscription.findByIdAndDelete(isSubscribed._id);
        return res.status(200).json(
            new ApiResponse(200,{removedSubscription} ,"Unsubscribed")
        );
    } else {
        // Subscribe
        const subscription = await Subscription.create({
            subscriber: user,
            channel: channelId
        });
        
        // Fixed: Remove unnecessary save() call since create() already saves
        return res.status(200).json(
            new ApiResponse(200,{subscription} ,"Subscribed")
        );
    }
});

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


export {toggleSubscription,getUserChannelSubscribers}




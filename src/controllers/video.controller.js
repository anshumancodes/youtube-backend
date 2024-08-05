import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import {
  uploadOnCloud,

  uploadVideo,
} from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

const uploadVideoOnchannel = asyncHandler(async (req, res) => {
  const { description, title, isPublished } = req.body;

  const contentdetails = [description, title];

  contentdetails.forEach((detail) => {
    if (!detail) {
      throw new ApiError(400, "Please fill all the details");
    }
  });

  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
  const videoFileLocalPath = req.files?.videoFile[0]?.path;

  if (!videoFileLocalPath) {
    throw new ApiError(400, "video file required");
  }

  const video = await uploadVideo(videoFileLocalPath); // returns object {filename,duration,url,public_id}

  if (!thumbnailLocalPath) {
    new ApiResponse(
      100,
      "video Uploaded without a thumbnail , you can add one later !",
    );
  }

  const thumbnail = await uploadOnCloud(thumbnailLocalPath); // directly returns the url

  const owner = await User.findById(req.user._id);

  const videoUpload = await Video.create({

    videoFile: video.url, 
    thumbnail: thumbnail,
    title,
    description,
    duration: video.duration,
    isPublished,
    owner,
  });
  // if(thumbnail){
  //   await videoUpload.updateOne({$set:{thumbnail:thumbnail.url}})
  // }

  const isVideoUploaded = await Video.findById(videoUpload._id);

  if (!isVideoUploaded) {
    throw new ApiError(500, "Video Upload Failed!");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        isVideoUploaded,
      },
      "video uploaded successfully!",
    ),
  );
});


const getVideoById = asyncHandler(async (req, res) => {
  // approach to algo
  //  get videoId from paramas , the id will of the specific document in the collection ,
  //  now with the id search and fetch the videoFile link and fetch the video and send 
    const { videoId } = req.params;
    const video = await Video.findById(videoId);
    if(!video){
      throw new ApiError(404, "Video Not Found or Unavailble at the moment"); 

    }
    
    return res.status(200).json(new ApiResponse(200,{video},"Video details"))


   
})

const UpdateVideoDetails = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const user = req.user;

  // Update video details like title, description, thumbnail
  const { title, description } = req.body;
  const thumbnailLocalPath = req.file?.thumbnail?.path;

  // Ensure the video exists before proceeding with updates
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Invalid video ID / No such video found!");
  }

  // Check if the current user is the owner of the video
  if (video.owner.toString() !== user._id.toString()) {
    throw new ApiError(403, "You are not the owner of this video");
  }

  // Upload the new thumbnail if provided
  let updatedThumbnail = video.thumbnail;
  if (thumbnailLocalPath) {
    updatedThumbnail = await uploadOnCloud(thumbnailLocalPath);
  }

  // Update the video details
  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      "$set": {
        title,
        description,
        thumbnail: updatedThumbnail,
      },
    },
    { new: true }
  );

  return res.status(200).json(new ApiResponse(200, { Updated: updatedVideo }, "Video details updated successfully"));
});


const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const user = req.user;

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video Not Found or Unavailable at the moment");
  }

  // Match user and owner of the video
  if (video.owner.toString() !== user._id.toString()) {
    throw new ApiError(403, "You are not the owner of this video");
  }

  await Video.deleteOne({ _id: videoId });

  return res.status(200).json(new ApiResponse(200, "Video deleted successfully!"));
});


const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if(!videoId){
    throw new ApiError(404, "Invalid video id / No such video found !");
  }
  const {isPublished}=req.body;
  const video = await Video.findByIdAndUpdate(videoId,{
    $set:{
     isPublished:isPublished // swap true false [boolean]
    }
  }
,{ new: true })

  return res.status(200,new ApiResponse(200,{
    isPublished:video.isPublished
    },"Video status updated successfully"))
  
})


export { uploadVideoOnchannel ,UpdateVideoDetails,getVideoById,togglePublishStatus,deleteVideo};

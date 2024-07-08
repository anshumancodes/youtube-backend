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

  const video = await uploadVideo(videoFileLocalPath);

  if (!thumbnailLocalPath) {
    new ApiResponse(
      100,
      "video Uploaded without a thumbnail , you can add one later !",
    );
  }

  const thumbnail = await uploadOnCloud(thumbnailLocalPath);

  const owner = await User.findById(req.user._id);

  const videoUpload = await Video.create({
    videoFile: video.uploadDetails.url,
    thumbnail: thumbnail ? thumbnail : null,
    title,
    description,
    duration: video.uploadDetails.duration,
    isPublished,
    owner,
  });

  const isVideoUploaded = Video.findById(videoUpload._id);

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

export { uploadVideoOnchannel };

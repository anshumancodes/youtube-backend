import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { uploadVideoOnchannel ,UpdateVideoDetails,getVideoById, deleteVideo,GetallVideos} from "../controllers/video.controller.js";



import { Router } from "express";

const router=Router();


router.route("/upload").post(verifyJwt,upload.fields([
    {name:"thumbnail",maxCount:1},
    {name:"videoFile",maxCount:1}]),uploadVideoOnchannel);

router.route("/play/:videoId").get(getVideoById); // videos can be played without tokens 
router.route("/update/:videoId").put(verifyJwt,upload.fields([{name:"thumbnail",maxCount:1},]),UpdateVideoDetails); // can be done by owner only
router.route("/delete/:videoId").delete(verifyJwt,deleteVideo);
router.route("/getvideos").get(GetallVideos);


export default router;

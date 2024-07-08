import { verifyJwt } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";
import { uploadVideoOnchannel } from "../controllers/video.controller";



import { Router } from "express";

const router=Router();


router.route("/upload",verifyJwt,upload.fields([
    {name:"thumbnail",maxCount:1},
    {name:"videoFile",maxCount:1}]),uploadVideoOnchannel);


export default router;

import { Router } from "express";
import { resigterUser  , loginUser,logOutUser,reassignAcessToken, changePassword, getCurrentUser, HandleForgotPassword, updateUserAvatar, updateCoverImage, getUserChannel, getWatchHistory } from "../controllers/user.controller.js";
import {upload} from"../middlewares/multer.middleware.js"
import { verifyJwt } from "../middlewares/auth.middleware.js";
const router=Router();

router.route("/register").post(
upload.fields([
    {name:"avatar",maxCount:1},
    {name:"coverImage",maxCount:1}]),
resigterUser);

router.route("/login").post(loginUser);


// accessible on login;

router.route("/logout").post(verifyJwt,logOutUser);
router.route("/refreshtoken").post(reassignAcessToken);
router.route("/change-password").post(verifyJwt,changePassword);
router.route("/get-user").get(verifyJwt,getCurrentUser);
router.route("/update-avatar").patch(verifyJwt,upload.single("avatar"),updateUserAvatar);
router.route("/update-coverimage").patch(verifyJwt,upload.single("coverImage"),updateCoverImage);
router.route("/channel/:username").get(verifyJwt,getUserChannel);
router.route("get-watch-history").get(verifyJwt,getWatchHistory);

// can acess with or without a token or login

router.route("passwordreset").post(HandleForgotPassword);




export default router;
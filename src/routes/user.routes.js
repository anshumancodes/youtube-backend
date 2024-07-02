import { Router } from "express";
import { resigterUser  , loginUser,logOutUser,reassignAcessToken, changePassword, getCurrentUser, HandleForgotPassword, updateUserAvatar, updateCoverImage, getUserChannel } from "../controllers/user.controller.js";
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
router.route("/changepassword").post(verifyJwt,changePassword);
router.route("/getuser").get(verifyJwt,getCurrentUser);
router.route("/updateavatar").post(verifyJwt,updateUserAvatar);
router.route("/updatecoverimage").post(verifyJwt,updateCoverImage);
router.route("/getchannel").get(getUserChannel);

// can acess with or without a token or login

router.route("passwordreset").post(HandleForgotPassword);



export default router;
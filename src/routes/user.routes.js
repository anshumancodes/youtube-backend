import { Router } from "express";
import { resigterUser  , loginUser,logOutUser,reassignAcessToken } from "../controllers/user.controller.js";
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
router.route("/refreshtoken").post(reassignAcessToken)

export default router;
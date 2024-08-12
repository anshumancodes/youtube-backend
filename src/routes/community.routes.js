import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import{getPosts,deletePost,updatePost,composePost} from "../controllers/communityPost.controller.js"


const router=Router();

router.route("/compose").post(verifyJwt, composePost);

// Route to get all posts for the authenticated user
router.route("/posts").get(verifyJwt, getPosts);

// Route to update a specific post
router.route("/update/:postId").put(verifyJwt, updatePost);

// Route to delete
router.route("/delete/:postId").delete(verifyJwt, deletePost);


export default router;
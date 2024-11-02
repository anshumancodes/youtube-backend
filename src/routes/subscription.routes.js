import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {getUserChannelSubscribers,toggleSubcription} from "../controllers/subscription.controller.js"

const router=Router();

router.route("/subscribe/:channelId").post(verifyJwt,toggleSubcription);
router.route("/subscribers/:channelId").get(getUserChannelSubscribers);

export default router;
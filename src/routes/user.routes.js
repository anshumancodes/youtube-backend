import { Router } from "express";
import { resigterUser } from "../controllers/user.controller.js";
const router=Router();

router.route("/register").post(resigterUser)

export default router;
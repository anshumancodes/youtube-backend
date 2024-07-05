import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";


const router=Router;

router.route("/post").post(verifyJwt,)
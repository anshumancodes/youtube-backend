import express from  "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";


const app = express();
app.use(cors());
app.use(express.json({limit:"12kb"}));
app.use(express.urlencoded({extended:true,limit:"12kb"}));
app.use(express.static("public"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

// routes

import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js"
import communityPostRouter from "./routes/community.routes.js"

app.use("/api/v0/user",userRouter);
app.use("/api/v0/video",videoRouter);
app.use("/api/v0/post",communityPostRouter);




export default app;
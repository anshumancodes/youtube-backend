import dotenv from "dotenv";

import connectDB from "./db/index.js";
import app from "./app.js";

dotenv.config({
    path:'./.env'
})

connectDB()
.then(()=>{
app.listen(process.env.PORT || 8000 ,()=>{console.log("Server is running sucessfully on port ",process.env.PORT || 8000)});
app.on("error",(err)=>{
    console.error("app loading failed !! -> ", err);
    throw err
})
})
.catch(((err)=>{
    console.log("database connection failed !!!")
}))
import mongoDbConnection from "./db/db.js";
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import userRouter from "./routers/userRouter.js";
import cookieParser from "cookie-parser";

dotenv.config({
    path:".env"
})

const app= express()
app.use(cors({
    origin:process.env.ORGIN,
    Credential:true
}))
app.use(express.json())
app.use(cookieParser())

app.use(express.static("public"))
app.use("/api/v1/user",userRouter)

mongoDbConnection()
app.listen(process.env.PORT ||8000,()=>{
    console.log(`server is running on ${process.env.PORT}`);
})

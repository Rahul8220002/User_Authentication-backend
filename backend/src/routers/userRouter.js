import express from "express"
import { getuser, login, logout, UserRegister } from "../controllers/userController.js"
import { mupload } from "../middlerwares/multermiddlerware.js";
import verifyToken from "../middlerwares/auth.js";

const userRouter=express.Router()

userRouter.post("/register",
    mupload.single(
      'avatar'
    )
    ,UserRegister)

userRouter.post("/login",login)
userRouter.get("/logout",verifyToken,logout)
userRouter.get("/currentUser/:id",verifyToken,getuser)

export default userRouter;
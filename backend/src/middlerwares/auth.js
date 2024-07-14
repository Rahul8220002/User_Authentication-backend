import jwt from "jsonwebtoken"
import { User } from "../models/userModels.js"

const verifyToken= async (req, res,next)=>{
    const token =req.cookies?.Token;
    if (!token) {
        return res.status(401).json({
            message:"invaild user",
            sucess:false
        })
    }
    try {
        const decodetoken= jwt.verify(token,process.env.JWT_TOKEN_SECRET)
        // req.user={id:decodetoken.id,email:decodetoken.email}
        const user=await User.findById(decodetoken.id,decodetoken.email).select("-password")

        if (!user) {
            return res.status(401).json({
                message:"invaild token user",
                sucess:false
            })
        }
        req.user=user;
        next()
    } catch (error) {
        res.status(400).json({
            message:"invaild token",
            sucess:false
        })
    }
    
}
export default verifyToken;
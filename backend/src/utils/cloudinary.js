import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv"

dotenv.config()
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_URL,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const imageUploadCloudinary = async (imagePath) => {
  
    try {
      if (!imagePath) {
        return null;
      } else {
        const imagepathrespose = await cloudinary.uploader.upload(imagePath);
        console.log(imagepathrespose);
        return imagepathrespose;
      }
    } catch (error) {
      fs.unlinkSync(imagePath)
      console.log(error);
    }
};



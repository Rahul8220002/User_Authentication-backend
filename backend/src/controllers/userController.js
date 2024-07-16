import { User } from "../models/userModels.js";
// import {uploadCloudinary }from "../utils/cloudinary.js";
import { imageUploadCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import cookieparser from "cookie-parser";

const UserRegister = async (req, res) => {
  const { userName, email, password, avatar } = req.body;
  if (userName === "" || email === "" || password === "" || avatar === "") {
    return res.status(400).json({
      message: "all field are required",
      sucess: false,
    });
  }
  const existEmail = await User.findOne({ email });
  if (existEmail) {
    return res.status(400).json({
      message: "this email allready exist",
      sucess: false,
    });
  }

  const avatarlocal = req.file.path || file.filename;

  if (!avatarlocal) {
    return res.status(401).json({
      message: "user avatar is required",
      sucess: false,
    });
  }

  const avatarUpload = await imageUploadCloudinary(avatarlocal);

  if (!avatarUpload) {
    return res.status(400).json({
      message: "does not upload avatar in cloudinary",
      sucess: false,
    });
  }

  const user = await User.create({
    userName,
    avatar: avatarUpload.url,
    email,
    password,
  });

  const userCreated = await User.findById(user._id).select("-password");

  if (!userCreated) {
    return res.status(400).json({
      message: "something went wrong",
      sucess: false,
    });
  }

  return res.status(200).json({
    message: "user register sucessfully",
    sucess: true,
    userCreated,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(401).json({
      message: "please provide email and password",
      sucess: false,
    });
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({
      message: "email and passsword invaild",
      sucess: false,
    });
  }
  const passwordMatch = await user.correntpassword(password);
  if (!passwordMatch) {
    return res.status(401).json({
      message: "email and passsword invaild",
      sucess: false,
    });
  }
  const GenratorToken = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_TOKEN_SECRET,
    {
      expiresIn: process.env.TOKEN_EXPIRY,
    }
  );

  const options = {
    httponly: true,
    secure: true,
  };

  return res.status(200).cookie("Token", GenratorToken, options).json({
    message: "user login sucessfully",
    sucess: true,
  });
};

const logout = async (req, res) => {
  try {
    const options = {
      httponly: true,
    };
    return res.status(200).cookie("Token", null, options).json({
      message: "user logout sucessfully",
      sucess: true,
    });
  } catch (error) {
    return res.status(501).json({
      message: error.message,
      sucess: false,
    });
  }
};

const getuser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    return res.status(200).json({
      message: "current user data",
      sucess: true,
      user,
    });
  } catch (error) {
    return res.status(501).json({
      message: error.message,
      sucess: false,
    });
  }
};

export { UserRegister, login, logout, getuser };

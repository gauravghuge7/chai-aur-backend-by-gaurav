
import { ApiError } from '../utils/ApiError.js';
import {asyncHandler } from '../utils/asyncHandler.js'
import {User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {

   try {

      const user = await User.findById(userId);

      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();

      user.refreshToken = refreshToken;

      await user.save({ValiditeBeforeSave: false});
      
      return {accessToken, refreshToken};
      
   } 
   catch (error) {
      
      console.log("error => ", error);
      throw new ApiError(500, error.message);
   }
} 



const registerUser = asyncHandler(async (req, res) => {

   // get user detail from frontend
   // validation not empty

   // check user already exist or not

   const {username, fullName, email, password, } = req.body;

   console.log("req.body => ", req.body);
   

   if(
      [username, fullName, email, password].some(item => item?.trim() === "")
   ){
      throw new ApiError(400, "Please fill all the fields");
   }

   const existingUser = await User.findOne({
      $or: [{ username }, { email }]
   })

   if(existingUser){
      throw new ApiError(409, "User already exist in the system");
   }

   const avatarLocalPath = req.files?.avatar[0]?.path;

   const coverImageLocalPath = req.files?.coverImage[0]?.path;

   if(!avatarLocalPath) {
      throw new ApiError(400, "Please upload avatar");
   }

   console.log("avatarLocalPath => ", avatarLocalPath);

   const avatar = await uploadOnCloudinary(avatarLocalPath);

   console.log("avatar => ", avatar);

   const coverImage = await uploadOnCloudinary(coverImageLocalPath);

   // if(!avatar) {
   //    throw new ApiError(400, "Please upload avatar");
   // }

   const user = await User.create({
      fullName,
      avatar: avatar?.url || "",
      coverImage: coverImage?.url || "",
      username: username.toLowerCase(),
      email,
      password,

   })


   // remove password and refresh token from response 

   const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
   )



   console.log("createdUser => ", createdUser);


   if(!createdUser){
      throw new ApiError(500, "Internal server error");
   }

   return res.status(201).json(
      new ApiResponse(200, "User created successfully", createdUser)
   );


})


const loginUser = asyncHandler(async (req, res) => {

   // get the user detail from the frontend
   // validation not empty
   // check user exist or not
   // check password correct or not
   // generate access token
   // send the response

   const {email, username, password} = req.body;

   if( !email && !username || !password){
      throw new ApiError(400, "Please fill all the fields");
   }

   const user = await User.findOne({
      $or: [
         {username},
         {email}
      ]
   })

   if(!user){
      throw new ApiError(404, "User not exist in the system");
   }

   const isPasswordCorrect = await user.isPasswordCorrect(password);

   if(!isPasswordCorrect){
      throw new ApiError(401, "Invalid username or password");
   }


   const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);


   const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
   )

   const options = {
      httpOnly: true,
      secure: true,
   }




   return res.status(200)
   .cookie("accessToken", accessToken, options)
   .cookie("refreshToken", refreshToken, options)
   .json(
      new ApiResponse(200, "User logged in successfully", {
         user: loggedInUser,
         accessToken,
         refreshToken
      })
   );

})



const logoutUser = asyncHandler(async (req, res) => {

   const {_id} = req.user;


   await User.findByIdAndUpdate(_id, {
      $set: {
         refreshToken: undefined,
      },
      
      },
      {
         new: true,
      }
   )

   const options = {
      httpOnly: true,
      secure: true,
      
   }

   return res
   .status(200)
   .clearCookie("accessToken", options)
   .clearCookie("refreshToken", options)
   .json(
      new ApiResponse(200, "User logged out successfully", {})
   )


})


const refreshAccessToken = asyncHandler(async (req, res) => {

   const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

   if(!incomingRefreshToken){
      throw new ApiError(400, "Please provide refresh token");
   }


   try {
      const decodedToken = jwt.verify(
         incomingRefreshToken,
         process.env.REFRESH_TOKEN_SECRET,
      )
   
      const user = await User.findById(decodedToken?._id);
      
      if(!user){
         throw new ApiError(401, "Invalid refresh token");
      }
   
      if(incomingRefreshToken !== user?.refreshToken){
         throw new ApiError(401, "Token is expired or used");
      }
   
   
      const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id);
   
      return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
         new ApiResponse(
            200, 
            "Access token refreshed successfully and logged in successfully",
            {
               user: user,
               accessToken: accessToken,
               refreshToken: newRefreshToken
            }
         )
      )
   } 
   catch (error) {
      console.log("error => ", error);
      throw new ApiError(500, error.message);
   }

})


const changeCurrentPassword = asyncHandler(async (req, res) => {

   const {oldPassword, newPassword} = req.body;

   const user = await User.findById(req.user._id);

   if(!user){
      throw new ApiError(404, "User not found");
   }

   const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

   if(!isPasswordCorrect){
      throw new ApiError(401, "Invalid old password");
   }

   user.password = newPassword;

   await user.save({validateBeforeSave: false});

   return res
   .status(200).json(
      new ApiResponse(200, "Password changed successfully", {})
   );

})


const getCurrentUser = asyncHandler(async (req, res) => {

   const user = await User.findById(req.user._id);


   return res
   .status(200).json(
      new ApiResponse(200, "User fetched successfully", user)
   );

})



const updateAccountDetails = asyncHandler(async (req, res) => {

   const {fullName, email} = req.body;

   if(!fullName || !email){
      throw new ApiError(400, "Please fill all the fields");
   }


   const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
         $set: {
            fullName,
            email,
         }
      },
      {new: true}
   
   ).select("-password -refreshToken");


   return res
   .status(200).json(
      new ApiResponse(200, "Account details updated successfully", user)
   );

})


const updateUserAvatar = asyncHandler(async (req, res) => {

   const avatarLocalPath = req.file?.path;

   if(!avatarLocalPath) {
      throw new ApiError(400, "Please upload avatar");
   }

   const avatar = await uploadOnCloudinary(avatarLocalPath);

   if(!avatar.url) {
      throw new ApiError(500, "Error while uploading avatar");
   }

   const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
         $set: {
            avatar: avatar.url,
         }
      },
      {
         new: true,
      }
   ).select("-password -refreshToken");

   return res
   .status(200).json(
      new ApiResponse(200, "Avatar updated successfully", user)
   );
})

const updateUserCoverImage = asyncHandler(async (req, res) => {

   const coverImageLocalPath = req.file?.path;

   if(!coverImageLocalPath) {
      throw new ApiError(400, "Please upload avatar");
   }

   const coverImage = await uploadOnCloudinary(coverImageLocalPath);

   if(!coverImage.url) {
      throw new ApiError(500, "Error while uploading avatar");
   }

   const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
         $set: {
            coverImage: coverImage?.url,
         }
      },
      {
         new: true,
      }
   ).select("-password -refreshToken");

   return res
   .status(200).json(
      new ApiResponse(200, "coverImage updated successfully", user)
   );
})


const getUserChannerlProfile = asyncHandler(async (req, res) => {

   const {username} = req.params || req.query;

   if(!username?.trim()) {
      throw new ApiError(400, "Please provide username");
   }

   // User.findOne({username})


   const channel =  await User.aggregate([

      {
         $match: {
            username: username?.toLowerCase()
         }
      },
      {
         $lookup: {
            
         }
      }


   ])

})




export {
   registerUser,
   loginUser,

   logoutUser,
   refreshAccessToken,
   getCurrentUser,
   changeCurrentPassword,

   updateAccountDetails,
}
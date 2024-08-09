
import { ApiError } from '../utils/ApiError.js';
import {asyncHandler } from '../utils/asyncHandler.js'
import {User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {

   // get user detail from frontend
   // validation not empty

   // check user already exist or not

   const {username, fullName, email, password, } = req.body;
   

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

   const avatar = await uploadOnCloudinary(avatarLocalPath);
   const coverImage = await uploadOnCloudinary(coverImageLocalPath);

   if(!avatar) {
      throw new ApiError(400, "Please upload avatar");
   }

   const user = await User.create({
      fullName,
      avatar: avatar?.url || "",
      coverImage: coverImage?.url || "",
      username: username.toLowerCase(),
      email,
      password,

   })

})


export {registerUser}
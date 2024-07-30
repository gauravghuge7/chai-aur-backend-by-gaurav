import {v2 as Cloudinary} from 'cloudinary';
import fs from 'fs';
import {ApiError} from './ApiError.js';

const cloudinary = new Cloudinary({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,  
  api_secret: process.env.CLOUDINARY_API_SECRET,
});





const uploadOnCloudinary = async (filePath) => {

    try {
    
        if(!filePath) return null;
        
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: 'auto',

        });

        if(!result.secure_url) return null;

        console.log(" file uploaded successfully", result);



        return result;
        
    } 
    catch (error) {

        fs.unlink(filePath);
        console.log(error);
        throw new ApiError(400, error.message);

    }

}


export {uploadOnCloudinary};
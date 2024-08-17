import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import {ApiError} from './ApiError.js';
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from '../constants.js';




cloudinary.config({

  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,

});

// cloudinary.config({

//   cloud_name: 'dsh5742fk',
//   api_key: '899594559273632',
//   api_secret: '9E2v2LfZFqO2qiFf1-yuZmO3JX8'

// });

// console.log("cloudinary => ", cloudinary);




const uploadOnCloudinary = async (filePath) => {

    console.log("CLoudinary => ", CLOUDINARY_API_KEY);

    try {
    
        if(!filePath) return null;
        
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: 'auto',
            
        });

        if(!result.secure_url) return null;

        console.log(" file uploaded successfully", result);

        fs.unlinkSync(filePath);

        return result;
        
    } 
    catch (error) {

        fs.unlinkSync(filePath);
        console.log(error);
        throw new ApiError(400, error.message);

    }

}


export {uploadOnCloudinary};
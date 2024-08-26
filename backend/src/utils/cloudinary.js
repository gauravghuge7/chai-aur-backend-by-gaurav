import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import {ApiError} from './ApiError.js';





// cloudinary.config({

//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,

// });


cloudinary.config({

  cloud_name: 'dsh5742fk',
  api_key: '899594559273632',
  api_secret: '9E2v2LfZFqO2qiFf1-yuZmO3JX8'

});





const uploadOnCloudinary = async (filePath) => {

    

    try {
    
        if(!filePath) return null;
        
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: 'auto',
            
        });

        


        // fs.unlinkSync(filePath);

        return result;
        
    } 
    catch (error) {

        // fs.unlinkSync(filePath);
        console.log(error);
        throw new ApiError(400, error.message);

    }

}


export {
    uploadOnCloudinary
};

export const DB_NAME = 'chai-backend';

export const MONGODB_URI = `mongodb://localhost:27017/${DB_NAME}`;

export const CORS_ORIGIN = '*';




export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;



console.log("CLOUDINARY_API_KEY => ", CLOUDINARY_API_KEY);
console.log("CLOUDINARY_API_SECRET => ", CLOUDINARY_API_SECRET);
console.log("CLOUDINARY_CLOUD_NAME => ", CLOUDINARY_CLOUD_NAME);
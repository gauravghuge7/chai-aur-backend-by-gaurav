import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';
import { MONGODB_URI } from '../constants.js';


const connectDB = async () => {
    try {
        
        const conn = await mongoose.connect(MONGODB_URI, {
        })

        console.log(`MongoDb connection successfully established to ${conn.connection.host}`);
        
        
    } catch (err) {
        console.log("MongoDb connection error: =>  ", err);
        process.exit(1);
    }
};



export default connectDB;
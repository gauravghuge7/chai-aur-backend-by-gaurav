import express from 'express';
import cors from 'cors';
import { CORS_ORIGIN } from './constants.js';
import cookieParser from 'cookie-parser';
const app = express();



app.use(cors(
    {
        origin: CORS_ORIGIN,
        credentials: true,
        // methods: ["GET", "POST", "PUT", "DELETE"],
        // allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"]
    }
));


app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(cookieParser());




export {app};
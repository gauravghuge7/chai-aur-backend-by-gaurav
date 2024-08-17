import connectDB from "./db/db.js";
import dotenv from 'dotenv';
import { app } from "./app.js";
import path from 'path';


// dotenv.config({
//     path: './.env'
// })


dotenv.config({
    path: path.resolve('.env')
});

const PORT = process.env.PORT || 5683;

connectDB()

.then(() => {

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT} \n 
            here you can check the server status at http://localhost:${PORT}
        `);
    })

    
})

.catch(err => {

    console.log("Error while connecting to Database to Application => ", err);
    process.exit(1);

})
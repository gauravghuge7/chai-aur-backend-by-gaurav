import {Router} from 'express'
import { upload } from '../middlewares/multer.middleware.js';
const router = Router();


import { registerUser } from '../controller/user.controller.js';


router.route('/register').post(

   upload.fields([
      {
         name: "avatar",
         maxCount: 1
      },
      {
         name: "coverImage",
         maxCount: 2
      }
   ]),
   registerUser
);



export default router;
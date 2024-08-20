import {Router} from 'express'
import { upload } from '../middlewares/multer.middleware.js';
const router = Router();


import { loginUser, logoutUser, registerUser } from '../controller/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';


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

router.route('/login').post(

   verifyJWT,
   loginUser
);


// secured routes 
router.route('/logout').post(
   
   verifyJWT,
   logoutUser
)



export default router;
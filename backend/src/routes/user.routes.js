import {Router} from 'express'
import { upload } from '../middlewares/multer.middleware.js';
const router = Router();


import { changeCurrentPassword, getCurrentUser, getUserChannelProfile, getWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage } from '../controller/user.controller.js';
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
   upload.none(),
   loginUser
);


// secured routes 
router.route('/logout').post(
   
   upload.none(),
   verifyJWT,
   logoutUser
)


router.route('/refresh-access-token').post(
   upload.none(),
   refreshAccessToken
)

router.route("/change-current-password").post(
   upload.none(),
   verifyJWT,
   changeCurrentPassword
)

router.route("/get-current-user").get(
   upload.none(),
   verifyJWT,
   getCurrentUser
)

router.route("/update-account-details").patch(   
   upload.none(),
   verifyJWT,
   updateAccountDetails
)

router.route("/update-user-avatar").patch(      
   upload.single("avatar"),
   verifyJWT,
   updateUserAvatar
)

router.route("update-user-cover-image").patch(      
   upload.single("coverImage"),
   verifyJWT,
   updateUserCoverImage
)

router.route("/get-channel/:username").get(
   upload.none(),
   verifyJWT,
   getUserChannelProfile
)


router.route("/get-watch-history").get(
   upload.none(),
   verifyJWT,
   getWatchHistory
)

export default router;
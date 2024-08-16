const router = require("express").Router();
const authControll = require("../controller/authControl");
const { verifyUserToken } = require("../middleware/authUser");
const { upload } = require("../middleware/upload");


// To register a user
router.post("/register", authControll.register);
// TO add a profile photo
router.post("/add-profile-pic",verifyUserToken, upload, authControll.addProfilePic);
// To login in a user
router.post("/login", authControll.login);
// To change user details 
router.patch("/change-details", verifyUserToken, authControll.changeDetails)
// To sign a user out
router.post("/signout", authControll.SignOut);
// To request otp for password change
router.post("/request-otp", authControll.requestOtp);
// To reset password (with otp)
router.post("/reset-password", authControll.resetPassword);
// To change password using old password
router.post("/change-password", verifyUserToken, authControll.changePassword);
// To to delete a user accout
router.delete("/delete", verifyUserToken, authControll.deleteUser);
// To get user details
router.get("/user-details", verifyUserToken, authControll.userData)




module.exports = router;

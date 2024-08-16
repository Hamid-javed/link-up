const router = require("express").Router();
const userDataControl = require("../controller/userDataController")
const authControll = require("../controller/authControl");
const { verifyUserToken } = require("../middleware/authUser");



router.get("/posts",verifyUserToken, userDataControl.getPosts);
router.get("/user-details", verifyUserToken, userDataControl.userData)





module.exports = router;

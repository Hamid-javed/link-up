const router = require("express").Router();
const userDataControl = require("../controller/userDataController")
const { verifyUserToken } = require("../middleware/authUser");


router.get("/user-details", verifyUserToken, userDataControl.userData)
router.get("/:userId/user-details", verifyUserToken, userDataControl.userDataByUserId)
router.get("/posts", verifyUserToken, userDataControl.getPosts);
router.get("/:userId/posts", verifyUserToken, userDataControl.getPostsByUserId);
router.post("/follow/:userId", verifyUserToken, userDataControl.follow);
router.delete("/follow/:userId", verifyUserToken, userDataControl.delFollow);
router.get("/followers", verifyUserToken, userDataControl.getFollowers);
router.get("/following", verifyUserToken, userDataControl.getFollowing);
router.get("/liked", verifyUserToken, userDataControl.getLiked);
router.get("/search-users", verifyUserToken, userDataControl.searchUser)









module.exports = router;

const router = require("express").Router();
const groupControl = require("../controller/groupControl");
const postControl = require("../controller/postControl")
const { verifyUserToken } = require("../middleware/authUser");


router.post("/create", verifyUserToken, groupControl.createGroup)
router.post("/:groupId/posts/add", verifyUserToken, postControl.addPost)
router.delete("/:groupId/posts/del", verifyUserToken, postControl.deletePost)






module.exports = router;

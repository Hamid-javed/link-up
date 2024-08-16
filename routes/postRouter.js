const router = require("express").Router();
const postControl = require("../controller/postControl");
const { verifyUserToken } = require("../middleware/authUser");
const { post } = require("../middleware/post");


router.post("/add", verifyUserToken, post, postControl.addPost)
router.post("/:postId/like", verifyUserToken, postControl.addLike)
router.delete("/:postId/like/:likeId", verifyUserToken, postControl.delLike)
router.post("/:postId/comments/add", verifyUserToken, postControl.addComment)






module.exports = router;
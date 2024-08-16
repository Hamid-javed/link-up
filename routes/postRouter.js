const router = require("express").Router();
const postControl = require("../controller/postControl");
const { verifyUserToken } = require("../middleware/authUser");
const { post } = require("../middleware/post");


router.post("/add", verifyUserToken, post, postControl.addPost)
router.post("/:postId/like", verifyUserToken, postControl.addLike)
router.delete("/:postId/like", verifyUserToken, postControl.delLike)
router.post("/comments/:commentId/like", verifyUserToken, postControl.likeComment)
router.delete("/comments/:commentId/like", verifyUserToken, postControl.unLikeComment)
router.post("/:postId/comments/add", verifyUserToken, postControl.addComment)
router.delete("/:postId/comments/:commentId", verifyUserToken, postControl.delComment)
router.post("/comments/:commentId/reply", verifyUserToken, postControl.addReply)
router.get("/:postId/likes", verifyUserToken, postControl.getPostLikes)









module.exports = router;
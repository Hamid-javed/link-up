const router = require("express").Router();
const postControl = require("../controller/postControl");
const { verifyUserToken } = require("../middleware/authUser");
const { post } = require("../middleware/post");


router.post("/add", verifyUserToken, post, postControl.addPost)
router.post("/:postId/likes", verifyUserToken, postControl.addLike)
router.delete("/:postId/likes", verifyUserToken, postControl.delLike)
router.post("/comments/:commentId/likes", verifyUserToken, postControl.likeComment)
router.delete("/comments/:commentId/likes", verifyUserToken, postControl.unLikeComment)
router.patch("/:postId/update", verifyUserToken, post, postControl.updatePost)
router.delete("/:postId/delete", verifyUserToken, postControl.deletePost)
router.post("/:postId/like", verifyUserToken, postControl.addLike)
router.delete("/:postId/like", verifyUserToken, postControl.delLike)
router.post("/comments/:commentId/like", verifyUserToken, postControl.likeComment)
router.delete("/comments/:commentId/like", verifyUserToken, postControl.unLikeComment)
router.post("/:postId/comments/add", verifyUserToken, postControl.addComment)
router.patch("/:postId/comments/:commentId/update", verifyUserToken, postControl.updComment)
router.delete("/:postId/comments/:commentId", verifyUserToken, postControl.delComment)
router.post("/comments/:commentId/replies", verifyUserToken, postControl.addReply)
router.get("/:postId/likes", verifyUserToken, postControl.getPostLikes)
router.get("/:postId/comments", verifyUserToken, postControl.getPostComments)
router.get("/comments/:commentId/replies", verifyUserToken, postControl.getCommentReplies)
router.get("/comments/:commentId/likes", verifyUserToken, postControl.getCommentLikes)
router.get("/feed", verifyUserToken, postControl.getFeed)
router.post("/stories/add", verifyUserToken, post, postControl.addStory)
router.delete("/stories/:storyId/del", verifyUserToken, postControl.delStory)
router.get("/stories/feed", verifyUserToken, postControl.getStoriesFeed)
router.get("/stories/get", verifyUserToken, postControl.getUserOwnStories)
router.get("/:userId/stories/get", verifyUserToken, postControl.getUserStoriesById)













module.exports = router;
const router = require("express").Router();
const groupControl = require("../controller/groupControl");
const postControl = require("../controller/postControl")
const { verifyUserToken } = require("../middleware/authUser");


router.post("/create", verifyUserToken, groupControl.createGroup)
router.delete("/:groupId/admin/delete", verifyUserToken, groupControl.delGroup)
router.post("/:groupId/posts/add", verifyUserToken, postControl.addPost)
router.delete("/:groupId/admin/posts/:postId/delete", verifyUserToken, groupControl.delPostAdmin)
router.delete('/:groupId/admin/posts/:postId/commnets/:commentId/delete', verifyUserToken, groupControl.delComment)
router.post('/:groupId/admin/add-admin/:userId', verifyUserToken, groupControl.addAdmin)
router.delete('/:groupId/admin/del-admin/:userId', verifyUserToken, groupControl.delAdmin)
router.post('/:groupId/admin/add-member/:userId', verifyUserToken, groupControl.addMember)
router.delete('/:groupId/admin/del-member/:userId', verifyUserToken, groupControl.delMember)
router.get("/:groupId/get-admins", verifyUserToken, groupControl.getAdmins)
router.get("/:groupId/get-members", verifyUserToken, groupControl.getMembers)
router.get("/:groupId/get-members/search", verifyUserToken, groupControl.searchMembers)
router.get("/:groupId/posts/get", verifyUserToken, groupControl.getPosts)
router.get("/search", verifyUserToken, groupControl.searchGroups)
router.post("/:groupId/join", verifyUserToken, groupControl.joinGroup)
router.post("/:groupId/leave", verifyUserToken, groupControl.leaveGroup)













module.exports = router;

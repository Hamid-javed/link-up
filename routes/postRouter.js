const router = require("express").Router();
const postControl = require("../controller/postControl");
const { verifyUserToken } = require("../middleware/authUser");
const { upload } = require("../middleware/upload");


router.post("/add", postControl.addPost)



module.exports = router;
const router = require("express").Router();
const chatControl = require("../controller/chatControl");
const { verifyUserToken } = require("../middleware/authUser");


router.post("/", verifyUserToken, chatControl.chat)
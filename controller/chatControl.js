const Chat = require("../models/chatSchema")

exports.chat = async (req, res) => {
    try {
        const { message } = req.message;
        const userId = req.id;
        res.send("hh")
    } catch (error) {

    }
}

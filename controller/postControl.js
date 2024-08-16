const Post = require("../models/postSchema");
const User = require("../models/userSchema")


exports.addPost = async (req, res) => {
    try {
        const userId = req.id;
        const { caption } = req.body;
        const user = await User.findOne({ _id: userId })
        const file = req.file;
        postURL = `/uploads/posts/${file.filename}`;
        const post = new Post({
            user: userId,
            caption: caption,
            content: file ? postURL : ""
        })
        const newPost = await post.save()
        user.posts.push(newPost._id)
        await user.save()
        res.status(201).json({ message: "Post added!" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}




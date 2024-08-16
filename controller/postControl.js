const Post = require("../models/postSchema");
const User = require("../models/userSchema")


exports.addPost = async (req, res) => {
    try {
        const userId = req.id;
        const { caption } = req.body;
        const user = await User.findOne({ _id: userId })
        const file = req.file;
        const post = new Post({
            user: userId,
            caption: caption ? caption : "",
            content: file ? file.path : ""
        })
        const newPost = await post.save()
        user.posts.push(newPost._id)
        await user.save()
        res.status(201).json({ message: "Post added!" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.addLike = async (req, res) => {
  try {
    const userId = req.id;
    const {postId} = req.params;
    const post = await Post.findOne({_id: postId});
    if(!post) return res.status(400).json({msg: "post not found"})
    post.likes.push({user: userId});
    await post.save()
    res.status(200).json({msg: "post liked"})
  } catch (error) {
    res.status(500).json({ message: error.message })
    
  }    
}





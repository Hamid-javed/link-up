const Post = require("../models/postSchema");
const User = require("../models/userSchema");
const Comment = require("../models/commentSchema");

exports.addPost = async (req, res) => {
  try {
    const userId = req.id;
    const { caption } = req.body;
    if(!caption && !req.file) return res.status(400).json({msg: "please add either image or caption"})
    const user = await User.findOne({ _id: userId });
    const file = req.file;
    const post = new Post({
      user: userId,
      caption: caption ? caption : "",
      content: file ? file.path : "",
    });
    const newPost = await post.save();
    user.posts.push(newPost._id);
    await user.save();
    res.status(201).json({ message: "Post added!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addLike = async (req, res) => {
  try {
    const userId = req.id;
    const { postId } = req.params;
    const post = await Post.findOne({ _id: postId });
    if (!post) return res.status(400).json({ msg: "post not found" });
    const alreadyLiked = post.likes.find(
      (like) => like.user.toString() === userId.toString()
    );
    if (alreadyLiked)
      return res.status(400).json({ msg: "Post already liked" });
    post.likes.push({ user: userId });
    await post.save();
    res.status(200).json({ msg: "post liked" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.delLike = async (req, res) => {
  try {
    const { postId, likeId } = req.params;
    const post = await Post.findOne({ _id: postId });
    if (!post) return res.status(400).json({ msg: "post not found" });
    const likeExists = post.likes.id(likeId);
    if (!likeExists) return res.status(404).json({ msg: "Like not found" });
    post.likes.pull(likeId);
    await post.save();
    res.status(200).json({ msg: "like deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const userId = req.id;
    const { postId } = req.params;
    const { content } = req.body;
    const post = await Post.findById(postId);
    if (!post) return res.status(400).json({ msg: "post not found" });
    const newComment = await Comment.create({
      user: userId,
      post: postId,
      content: content,
    });
    post.comments.push(newComment._id);
    await post.save();
    res.status(200).json({ msg: "comment added" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

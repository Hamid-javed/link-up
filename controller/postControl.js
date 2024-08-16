const Post = require("../models/postSchema");
const User = require("../models/userSchema");
const Comment = require("../models/commentSchema");
const { post } = require("moongose/routes");

exports.addPost = async (req, res) => {
    try {
        const userId = req.id;
        const { caption } = req.body;
        if (!caption && !req.file)
            return res.status(400).json({
                msg: "please add either image or caption"
            });
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

exports.updatePost = async (req, res) => {
    try {
        const userId = req.id;
        const { newCaption } = req.body;
        const { postId } = req.params;
        const userPost = await Post.findOne({ _id: postId });
        if (userPost.user === userId) {
            userPost.caption = newCaption || userPost.caption
            userPost.save();
            res.status(201).json({ message: "Post Updated!" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.id;
        const userPost = await Post.findOne({ _id: postId })
        if (userPost.user === userId) {
            user.posts = user.posts.filter(post => post.toString() !== postId);
            const user = await User.findOne({ _id: userId });
            user.save()
            await Post.deleteOne({ _id: postId });
            res.status(201).json({ message: "Post deleted!" });
        }
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
        const user = await User.findById(userId);
        if (post.likes.includes(userId))
            return res.status(400).json({ msg: "Post already liked" });
        post.likes.push(userId);
        user.likedPosts.push(postId);
        await post.save();
        await user.save();
        res.status(200).json({ msg: "post liked" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.delLike = async (req, res) => {
    try {
        const userId = req.id;
        const { postId, likeId } = req.params;
        const post = await Post.findOne({ _id: postId });
        if (!post) return res.status(400).json({ msg: "post not found" });
        const user = await User.findById(userId);
        post.likes.pull(userId)
        user.likedPosts.pull(postId)
        await post.save()
        await user.save()
        res.status(200).json({ msg: "like deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.likeComment = async (req, res) => {
    try {
        const userId = req.id;
        const { commentId } = req.params;
        const comment = await Comment.findById(commentId)
        if (!comment) return res.status(400).json({ msg: "comment not found" });
        if (comment.likes.includes(userId))
            return res.status(400).json({ msg: "comment already liked" });
        comment.likes.push(userId)
        await comment.save()
        res.status(200).json({ msg: "comment liked" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.unLikeComment = async (req, res) => {
    try {
        const userId = req.id;
        const { commentId } = req.params;
        const comment = await Comment.findById(commentId)
        if (!comment) return res.status(400).json({ msg: "comment not found" });
        comment.likes.pull(userId)
        await comment.save()
        res.status(200).json({ msg: "comment unliked" });
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}


exports.addComment = async (req, res) => {
    try {
        const userId = req.id;
        const { postId } = req.params;
        const { content } = req.body;
        const post = await Post.findById(postId);
        if (!post) return res.status(400).json({ msg: "post not found" });
        const newComment = new Comment({
            user: userId,
            post: postId,
            content: content,
        });
        const savedComment = await newComment.save();
        post.comments.push(savedComment._id);
        await post.save();
        res.status(200).json({ msg: "comment added" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.delComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const post = await Post.findById(postId);
        if (!post) return res.status(400).json({ msg: "post not found" });
        const comment = await Comment.findById(commentId)
        if (!comment) return res.status(400).json({ msg: "comment not found" });
        await Comment.deleteOne({ _id: commentId })
        post.comments.pull(commentId);
        await post.save();
        res.status(200).json({ msg: "comment deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addReply = async (req, res) => {
    try {
        const userId = req.id;
        const { content } = req.body;
        const { commentId } = req.params;
        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(400).json({ msg: "comment not found" });
        const newComment = new Comment({
            user: userId,
            post: comment.post,
            content: content,
        });
        const savedComment = await newComment.save();
        comment.replies.push(savedComment);
        await comment.save();
        res.status(200).json({ msg: "reply added" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPostLikes = async (req, res) => {
    try {
        const { postId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 25;
        const post = await Post.findById(postId).populate({
            path: "likes",
            select: "name _id",
            options: {
                skip: (page - 1) * limit,
                limit: limit,
            },
        });
        if (!post) return res.status(400).json({ msg: "post not found" });
        const likes = post.likes;
        res.status(200).json(likes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

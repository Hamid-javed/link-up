const Post = require("../models/postSchema");
const User = require("../models/userSchema");
const Comment = require("../models/commentSchema");

exports.addPost = async (req, res) => {
  try {
    const userId = req.id;
    const { caption } = req.body;
    if (!caption && !req.file)
      return res
        .status(400)
        .json({ msg: "please add either image or caption" });
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
        // make it opposite, (userPost.user !== userId) return error
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
        // make it opposite, (userPost.user !== userId) return error
        if (userPost.user === userId) {
            user.posts = user.posts.filter(post => post.toString() !== postId);
            const user = await User.findOne({ _id: userId });
            //remove post from user too
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
    post.likes.pull(userId);
    user.likedPosts.pull(postId);
    await post.save();
    await user.save();
    res.status(200).json({ msg: "like deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.likeComment = async (req, res) => {
  try {
    const userId = req.id;
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(400).json({ msg: "comment not found" });
    if (comment.likes.includes(userId))
      return res.status(400).json({ msg: "comment already liked" });
    comment.likes.push(userId);
    await comment.save();
    res.status(200).json({ msg: "comment liked" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.unLikeComment = async (req, res) => {
  try {
    const userId = req.id;
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(400).json({ msg: "comment not found" });
    comment.likes.pull(userId);
    await comment.save();
    res.status(200).json({ msg: "comment unliked" });
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

exports.updComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { content } = req.body;
    if(!content) return res.status(400).json({ msg: "no content sent" });
    const post = await Post.findById(postId);
    if (!post) return res.status(400).json({ msg: "post not found" });
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(400).json({ msg: "comment not found" });
    comment.content = content
    await comment.save()
    res.status(200).json({ msg: "comment updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.delComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const post = await Post.findById(postId);
    if (!post) return res.status(400).json({ msg: "post not found" });
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(400).json({ msg: "comment not found" });
    await Comment.deleteOne({ _id: commentId });
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
    res.json({
      page,
      limit,
      totalPages: Math.ceil(post.likes.length / limit),
      likes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const post = await Post.findById(postId).populate({
      path: "comments",
      select: "content noOfLikes noOfReplies user",
      options: {
        skip: (page - 1) * limit,
        limit: limit,
      },
      populate: [
        {
          path: "user",
          select: "name profilePicture",
        },
     
      ],
    });
    if (!post) return res.status(400).json({ msg: "post not found" });
    const comments = post.comments;
    res.json({
      page,
      limit,
      totalPages: Math.ceil(post.comments.length / limit),
      comments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCommentReplies = async (req, res) => {
  try {
    const {commentId} = req.params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const comment = await Comment.findById(commentId).populate({
      path: "replies",
      select: "content noOfLikes noOfReplies user",
      options: {
        skip: (page - 1) * limit,
        limit: limit,
      },
      populate: [
        {
          path: "user",
          select: "name profilePicture",
        },
      ],
    });
    if (!comment) return res.status(400).json({ msg: "comment not found" });
    const replies = comment.replies;
    res.json({
      page,
      limit,
      totalPages: Math.ceil(comment.replies.length / limit),
      replies
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCommentLikes = async (req, res) => {
  try {
    const { commentId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const comment = await Comment.findById(commentId).populate({
      path: "likes",
      select: "name _id",
      options: {
        skip: (page - 1) * limit,
        limit: limit,
      }
    });
    if (!comment) return res.status(400).json({ msg: "comment not found" });
    const likes = comment.likes;
    res.json({
      page,
      limit,
      totalPages: Math.ceil(comment.likes.length / limit),
      likes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFeed = async (req, res) => {
  try {
    const userId = req.id;
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const followingIds = user.following;

    const totalFollowedPostsCount = await Post.countDocuments({ user: { $in: followingIds } });
    const totalOtherPostsCount = await Post.countDocuments({ user: { $nin: followingIds } });

    const totalPostsCount = totalFollowedPostsCount + totalOtherPostsCount;
    const totalPages = Math.ceil(totalPostsCount / limit);

    const followedPosts = await Post.find({ user: { $in: followingIds } }).populate({path: "user", select: "name profilePicture"})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    let posts = followedPosts;

    if (followedPosts.length < limit) {
      const additionalPosts = await Post.find({ user: { $nin: followingIds } }).populate({path: "user", select: "name profilePicture"})
        .sort({ createdAt: -1 })
        .skip(Math.max(0, skip - followedPosts.length))
        .limit(limit - followedPosts.length);
      posts = posts.concat(additionalPosts);
    }
    
    const postsToSend = posts.map((post) => {
      return {
        id: post._id,
        user: post.user,
        caption: post.caption,
        content: post.content,
        noOfLikes: post.noOfLikes,
        noOfComments: post.noOfComments,
        createdAt: post.createdAt,
      };
    });

    res.status(200).json({
      page,
      limit,
      totalPages,
      postsToSend
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

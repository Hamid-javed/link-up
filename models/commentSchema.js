const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  content: { type: String, required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  noOfLikes: { type: Number, default: 0 },
  noOfReplies: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

commentSchema.pre("save", function (next) {
  const noOfLikes = this.likes.length;
  const noOfReplies = this.replies.length;

  this.noOfLikes = noOfLikes;
  this.noOfReplies = noOfReplies;
  next();
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;

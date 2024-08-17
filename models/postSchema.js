const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  group: { type: mongoose.Schema.Types.ObjectId, ref: "Group"},
  caption: { type: String },
  content: { type: String },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  noOfLikes: { type: Number, default: 0 },
  noOfComments: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

postSchema.pre("save", function (next) {
  const noOfLikes = this.likes.length;
  const noOfComments = this.comments.length;

  this.noOfLikes = noOfLikes;
  this.noOfComments = noOfComments;

  next();
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;

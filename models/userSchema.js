const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: '' },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  noOfFollowers: { type: Number, default: 0 },
  noOfFollowing: { type: Number, default: 0 },
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }],
  likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  createdAt: { type: Date, default: Date.now },
  otp: { otp: { type: Number }, expireDate: { type: Number } },
});

userSchema.pre("save", function (next) {
  const noOfFollowers = this.followers.length
  const noOfFollowing = this.following.length

  this.noOfFollowers = noOfFollowers;
  this.noOfFollowing = noOfFollowing

  next();
});


module.exports = mongoose.model("User", userSchema);

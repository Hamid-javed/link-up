const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  name: { type: String, required: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: '' },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  otp: { otp: { type: Number }, expireDate: { type: Number } },
});


module.exports = mongoose.model("User", userSchema);

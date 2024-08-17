const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  noOfMembers: {type: Number, default: 0},
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  createdAt: { type: Date, default: Date.now },
});

groupSchema.pre("save", function (next) {
  const members = this.members.length

  this.noOfMembers = members ? members : 0

  next();
});

const Group = mongoose.model("Group", groupSchema);
module.exports = Group;
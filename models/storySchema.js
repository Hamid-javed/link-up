const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, },
  caption: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now, expires: "1d" },
});


const Story = mongoose.model("Story", storySchema);
module.exports = Story;
const Group = require("../models/groupSchema");
const Post = require("../models/postSchema");
const User = require("../models/userSchema");
const Comment = require("../models/commentSchema");

exports.createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ msg: "Name is required" });
    const group = new Group({
      name,
      description,
      admins: [req.id],
      members: [req.id],
    });
    const savedGroup = await group.save();
    res.status(201).json({ msg: "group created" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.delPostAdmin = async (req, res) => {
  try {
    const { groupId, postId } = req.params;
    const userId = req.id;
    const group = await Group.findById(groupId);
    if (!group) return res.status(400).json({ msg: "group not found" });
    const post = await Post.findById(postId);
    if (!post) return res.status(400).json({ msg: "post not found" });
    if (!group.admins.includes(userId))
      return res
        .status(403)
        .json({ msg: "not authorized to delete this post" });
    if (!group.posts.includes(postId))
      return res
        .status(403)
        .json({ msg: "not authorized to delete this post" });
    const postOwner = await User.findById(post.user);
    await Post.deleteOne({ _id: postId });
    postOwner.posts.pull(postId);
    group.posts.pull(postId);
    await postOwner.save();
    await group.save();
    res.status(200).json({ msg: "post deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.delComment = async (req, res) => {
  try {
    const { groupId, postId, commentId } = req.params;
    const userId = req.id;
    const group = await Group.findById(groupId);
    if (!group) return res.status(400).json({ msg: "group not found" });
    const post = await Post.findById(postId);
    if (!post) return res.status(400).json({ msg: "post not found" });
    if (!group.admins.includes(userId))
      return res
        .status(403)
        .json({ msg: "not authorized to delete this comment" });
    if (!group.posts.includes(postId))
      return res
        .status(403)
        .json({ msg: "not authorized to delete this comment" });
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

exports.addAdmin = async (req, res) => {
  try {
    const user = req.id;
    const { groupId, userId } = req.params;
    const group = await Group.findById(groupId);
    if (!group) return res.status(400).json({ msg: "group not found" });
    if (!group.admins.includes(user))
      return res.status(403).json({ msg: "not authorized add admin" });
    const userToAdd = await User.findById(userId);
    if (!userToAdd) return res.status(400).json({ msg: "user not found" });
    if (group.admins.includes(userId))
      return res.status(400).json({ msg: "the user is already an admin" });
    group.admins.push(userId);
    await group.save();
    res.status(200).json({ msg: "admin added" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.delAdmin = async (req, res) => {
  try {
    const user = req.id;
    const { groupId, userId } = req.params;
    const group = await Group.findById(groupId);
    if (!group) return res.status(400).json({ msg: "group not found" });
    if (!group.admins.includes(user))
      return res.status(403).json({ msg: "not authorized delete admin" });
    group.admins.pull(userId);
    await group.save();
    res.status(200).json({ msg: "admin deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addMember = async (req, res) => {
  try {
    const user = req.id;
    const { groupId, userId } = req.params;
    const group = await Group.findById(groupId);
    if (!group) return res.status(400).json({ msg: "group not found" });
    if (!group.admins.includes(user))
      return res.status(403).json({ msg: "not authorized add member" });
    const userToAdd = await User.findById(userId);
    if (!userToAdd) return res.status(400).json({ msg: "user not found" });
    if (group.members.includes(userId))
      return res.status(400).json({ msg: "the user is already an member" });
    group.members.push(userId);
    await group.save();
    res.status(200).json({ msg: "member added" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.delMember = async (req, res) => {
  try {
    const user = req.id;
    const { groupId, userId } = req.params;
    const group = await Group.findById(groupId);
    if (!group) return res.status(400).json({ msg: "group not found" });
    if (!group.admins.includes(user))
      return res.status(403).json({ msg: "not authorized delete member" });
    group.members.pull(userId);
    await group.save();
    res.status(200).json({ msg: "member deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAdmins = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId).populate({ path: "admins" });
    if (!group) return res.status(400).json({ msg: "group not found" });
    const admins = group.admins.map((user) => ({
      id: user._id,
      name: user.name,
      profile: user.profilePicture,
      follwers: user.followers.length,
      follwing: user.following.length,
    }));
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMembers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { groupId } = req.params;
    const group = await Group.findById(groupId).populate({
      path: "members",
      options: { skip: (page - 1) * limit, limit: limit },
    });
    if (!group) return res.status(400).json({ msg: "group not found" });
    const members = group.members.map((user) => ({
      id: user._id,
      name: user.name,
      profile: user.profilePicture,
      follwers: user.followers.length,
      follwing: user.following.length,
    }));
    res.status(200).json({
      page,
      limit,
      totalPages: Math.ceil(group.members.length / limit),
      members: members,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchMembers = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { query } = req.query || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!query) {
      return res.status(200).json({ message: "No query provided" });
    }

    const searchPattern = new RegExp(query, "i");
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const memberIds = group.members;

    const members = await User.find({
      _id: { $in: memberIds },
      name: { $regex: searchPattern },
    })
      .skip(skip)
      .limit(limit);

    const memberData = members.map((user) => ({
      id: user._id,
      name: user.name,
      profile: user.profilePicture,
      followers: user.followers.length,
      following: user.following.length,
    }));

    const totalResults = await User.countDocuments({
      _id: { $in: memberIds },
      name: { $regex: searchPattern },
    });

    const totalPages = Math.ceil(totalResults / limit);

    res.status(200).json({
      page,
      totalPages,
      totalUsers: totalResults,
      memberData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { groupId } = req.params;
    const group = await Group.findById(groupId).populate({
      path: "posts",
      select: "user group caption content noOfLikes noOfComments",
      options: { skip: skip, limit: limit, sort: { createdAt: -1 }, },
      
      populate: [
        {
          path: "user",
          select: "name profilePicture",
        },
      ],
    });
    if (!group) return res.status(400).json({ msg: "group not found" });

    const countLength = await Group.findById(groupId);
    const totalPages = Math.ceil(countLength.posts.length / limit);

    res.status(200).json({
      page,
      limit,
      totalPages,
      posts: group.posts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

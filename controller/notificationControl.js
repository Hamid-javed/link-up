const Notification = require("../models/notificationSchema");
const User = require("../models/userSchema");
const io = require('socket.io')
// const post = require('../controller/postControl')
const Post = require("../models/postSchema");
const Comment = require("../models/commentSchema");



// Add a notification
exports.addNotification = async (req, res, io) => {
  try {
    const { userId, message, expiryInDays = 7 } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ message: "User ID and message are required" });
    }

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryInDays);

    const notification = new Notification({
      userId,
      message,
      expiryDate,
    });

    await notification.save();

    await User.findByIdAndUpdate(userId, {
      $push: { notifications: notification._id }
    });

    // Emit notification to the user in real-time
    io.to(userId).emit('receiveNotification', { message });

    res.status(201).json({ message: "Notification added successfully", notification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Mark a notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.isRead = true;

    await notification.save();

    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all notifications
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.id;
    const unreadOnly = req.query.unreadOnly === "true";

    const query = { userId };
    if (unreadOnly) query.isRead = false;

    const notifications = await Notification.find(query);

    res.status(200).json({ notifications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a notifi
exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    await Notification.findByIdAndDelete(notificationId);

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark all notifications as read for a user
exports.markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    await Notification.updateMany({ userId, isRead: false }, { isRead: true });

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get unread notification count
exports.getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const count = await Notification.countDocuments({ userId, isRead: false });

    res.status(200).json({ unreadCount: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Filter notifications
exports.filterNotifications = async (req, res) => {
  try {
    const { userId, type, startDate, endDate } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const query = { userId };
    if (type) query.type = type;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const notifications = await Notification.find(query);

    res.status(200).json({ notifications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// likeNotification notifications
exports.likeNotification = async (req, res, io) => {
  try {
    const { postId, likedByUserId } = req.body;

    const post = await Post.findById(postId).populate("user");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const message = `${likedByUserId} liked your post.`;
    const notification = new Notification({
      userId: post.user._id,
      message,
      expiryDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    });

    await notification.save();

    await User.findByIdAndUpdate(post.user._id, {
      $push: { notifications: notification._id },
    });

    io.to(post.user._id.toString()).emit("receiveNotification", { message });

    res.status(201).json({ message: "Like notification sent", notification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// followNotification notifications

exports.followNotification = async (req, res, io) => {
  try {
    const { followedUserId, followerUserId } = req.body;

    const message = `${followerUserId} started following you.`;
    const notification = new Notification({
      userId: followedUserId,
      message,
      expiryDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    });

    await notification.save();

    await User.findByIdAndUpdate(followedUserId, {
      $push: { notifications: notification._id },
    });

    io.to(followedUserId.toString()).emit("receiveNotification", { message });

    res.status(201).json({ message: "Follow notification sent", notification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// commentNotification 

exports.commentNotification = async (req, res, io) => {
  try {
    const { postId, commentedByUserId } = req.body;

    const post = await Post.findById(postId).populate("user");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const message = `${commentedByUserId} commented on your post.`;
    const notification = new Notification({
      userId: post.user._id,
      message,
      expiryDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    });

    await notification.save();

    await User.findByIdAndUpdate(post.user._id, {
      $push: { notifications: notification._id },
    });

    io.to(post.user._id.toString()).emit("receiveNotification", { message });

    res.status(201).json({ message: "Comment notification sent", notification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


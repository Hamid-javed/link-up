const User = require("../models/userSchema");

// send user details
exports.userData = async (req, res) => {
  try {
    const userId = req.id;
    if (!userId) {
      res.status(406).json({
        Message: "No data Found for user!",
      });
    }
    const userData = await User.findOne({ _id: userId });
    // console.log("User data is", userData)
    res.status(200).json({
      id: userData._id,
      name: userData.name,
      email: userData.email,
      followers: userData.noOfFollowers,
      following: userData.noOfFollowing,
      profilePic: userData.profilePicture,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.userDataByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(200).json({ msg: "user not found" });
    res.status(200).json({
      id: user._id,
      name: user.name,
      followers: user.noOfFollowers,
      following: user.noOfFollowing,
      profilePic: user.profilePicture,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const userId = req.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;

    if (page < 1 || limit < 1) {
      return res.status(400).json({ msg: "Invalid page or limit values" });
    }
    const user = await User.findById(userId).populate({
      path: "posts",
      options: {
        skip: (page - 1) * limit,
        limit: limit,
        sort: { createdAt: -1 },
      },
      populate: [
        {
          path: "user",
          select: "name profilePicture",
        },
      ],
    });
    console.log(user);

    const posts = user.posts.map((post) => {
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
    const countPosts = await User.findById(userId);
    const totalPages = Math.ceil(countPosts.posts.length / limit);

    res.json({
      page,
      limit,
      totalPages,
      posts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPostsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;

    if (page < 1 || limit < 1) {
      return res.status(400).json({ msg: "Invalid page or limit values" });
    }
    const user = await User.findById(userId).populate({
      path: "posts",
      options: {
        skip: (page - 1) * limit,
        limit: limit,
        sort: { createdAt: -1 },
      },
      populate: [
        {
          path: "user",
          select: "name profilePicture",
        },
      ],
    });

    const posts = user.posts.map((post) => {
      return {
        _id: post._id,
        user: post.user,
        caption: post.caption,
        content: post.content,
        noOfLikes: post.noOfLikes,
        noOfComments: post.noOfComments,
        createdAt: post.createdAt,
      };
    });
    const countPosts = await User.findById(userId);
    const totalPages = Math.ceil(countPosts.posts.length / limit);

    res.json({
      page,
      limit,
      totalPages,
      posts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.follow = async (req, res) => {
  try {
    const user = await User.findById(req.id);
    const { userId } = req.params;
    if (user.following.includes(userId))
      return res.status(404).json({ msg: "already following" });
    const userToAdd = await User.findById(userId);
    if (!userToAdd) return res.status(400).json({ msg: "user not found" });
    user.following.push(userId);
    userToAdd.followers.push(req.id);
    await user.save();
    await userToAdd.save();
    res.status(200).json({ message: "follow successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.delFollow = async (req, res) => {
  try {
    const user = await User.findById(req.id);
    const { userId } = req.params;
    const userToDel = await User.findById(userId);
    if (!userToDel) return res.status(400).json({ msg: "user not found" });
    user.following.pull(userId);
    userToDel.followers.pull(req.id);
    await user.save();
    await userToDel.save();
    res.status(200).json({ message: "unfollowed user" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFollowers = async (req, res) => {
  try {
    const userId = req.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const user = await User.findById(userId).populate({
      path: "followers",
      options: {
        skip: (page - 1) * limit,
        limit: limit,
      },
    });

    const followers = user.followers.map((follower) => {
      return {
        id: follower._id,
        name: follower.name,
        followers: follower.noOfFollowers,
        following: follower.noOfFollowing,
        profilePicture: follower.profilePicture,
      };
    });
    const countFollowers = await User.findById(userId);
    const totalPages = Math.ceil(countFollowers.followers.length / limit);
    const results = {
      page,
      limit,
      totalPages,
      followers,
    };

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFollowing = async (req, res) => {
  try {
    const userId = req.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const user = await User.findById(userId).populate({
      path: "following",
      options: {
        skip: (page - 1) * limit,
        limit: limit,
      },
    });
    const following = user.following.map((follower) => {
      return {
        id: follower._id,
        name: follower.name,
        followers: follower.noOfFollowers,
        following: follower.noOfFollowing,
        profilePicture: follower.profilePicture,
      };
    });
    const countFollowing = await User.findById(userId);
    const totalPages = Math.ceil(countFollowing.following.length / limit);
    const results = {
      page,
      limit,
      totalPages,
      following,
    };

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLiked = async (req, res) => {
  try {
    const userId = req.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const user = await User.findById(userId).populate({
      path: "likedPosts",
      options: {
        skip: (page - 1) * limit,
        limit: limit,
        sort: { createdAt: -1 },
      },
      populate: [
        {
          path: "user",
          select: "name profilePicture",
        },
      ],
    });

    const posts = user.likedPosts.map((post) => {
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
    const countLikes = await User.findById(userId);
    const totalPages = Math.ceil(countLikes.likedPosts.length / limit);

    res.json({
      page,
      limit,
      totalPages,
      posts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchUser = async (req, res) => {
  try {
    const { query } = req.query || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    if (!query) {
      return res.status(200).json({ message: "No query provided" });
    }

    const searchPattern = new RegExp(query, "i");
    const users = await User.find({ name: { $regex: searchPattern } })
      .skip(skip)
      .limit(limit);
    const usersData = users.map((user) => ({
      id: user._id,
      name: user.name,
      profile: user.profilePicture,
      followers: user.followers.length,
      following: user.following.length,
    }));
    const totalResults = await User.find({
      name: { $regex: searchPattern },
    }).countDocuments();
    const totalPages = Math.ceil(totalResults / limit);
    res.status(200).json({
      page,
      totalPages,
      totalUsers,
      usersData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

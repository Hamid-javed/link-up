const User = require("../models/userSchema");

exports.getPosts = async (req, res) => {
  try {
    const userId = req.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;

    if (page < 1 || limit < 1) {
      return res.status(400).json({ msg: "Invalid page or limit values" });
    }
    const user = await User.findById(userId).populate({
      path: 'posts',
      options: {
          skip: (page - 1) * limit,
          limit: limit,
          sort: { createdAt: -1 }
      },
      populate: [
          {
              path: 'user', 
              select: 'name email profilePicture'
          }
      ]
  });

  console.log(user.posts)

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

    res.json({
      page,
      limit,
      totalPosts: user.posts.length,
      posts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
      name: userData.name,
      email: userData.email,
      profilePic: userData.profilePicture,
    });
  } catch (error) {
    console.log("The error is", error);
  }
};

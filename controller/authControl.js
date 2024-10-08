const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const utils = require("../utils/utils");
const nodemailer = require("nodemailer");
const { SECRET_TOKEN } = require("../config/crypto");
const cloudinary = require('../config/cloudinaryConfig');



// Controller for user registeration
exports.register = async (req, res) => {
  const { name, email, number, password } = req.body;
  try {
    if (!name) {
      return res.status(400).json({ message: "Name is required!" })
    }
    if (!email) {
      return res.status(400).json({ message: "Email is required!" })
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required!" })
    }

    const user = await User.findOne({ email: email })
    if (user) {
      return res.status(400).json({ message: "Email is Taken!" })
    }
    const hasdedPAss = await bcrypt.hash(password, 10);
    await User.create({ name, email, number, password: hasdedPAss });
    res.status(200).json({ message: " user cretaed successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addProfilePic = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const userId = req.id
    const user = await User.findOne({ _id: userId })
    const url = req.file.path;
    if (user.profilePicture) {
      const publicId = user.profilePicture.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }
    user.profilePicture = url
    await user.save()
    res.status(201).json({ msg: "profile picture added" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller for user Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({
      message: "Invalid email",
      user
    });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Password is wrong" });
    let payload = { id: user._id };
    const token = jwt.sign(payload, SECRET_TOKEN);
    res.cookie("token", token, {
      httpOnly: true,
      path: '/',
      sameSite: 'None',
      // maxAge: 60 * 60 * 1000,
      secure: true
    });
    res.status(200).json({
      message: "User successfully logged in",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      Error: err,
    });
  }
};

// TO change user details
exports.changeDetails = async (req, res) => {
  try {
    const userId = req.id;
    const { name, email, password } = req.body;
    const user = await User.findOne({ _id: userId })
    if (!user) {
      return res.status(404).json("User not found!");
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json("Password does not match!");
    }
    user.name = name || user.name;
    user.email = email || user.email;
    await user.save();
    res.status(200).json({ message: "User details changed successfully!" })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}


// To frequestOpt
exports.requestOtp = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ email: email });
  if (!user) return res.status(400).json({ message: "User Not Found" });

  const otp = utils.generateRandomFourDigitNumber();
  const otpExpires = Date.now() + 180 * 1000;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "otpsendericr@gmail.com",
      pass: "opbz tfty xbrw cigw",
    },
  });
  async function sendOtpEmail(email, otp) {
    const mailOptions = {
      from: process.env.email,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for resetting the password is ${otp}`,
      html: `<b>Your OTP for resetting the password is <strong>${otp}</strong></b>`,
    };
    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending OTP:", error);
      res.status(500).json({ message: error.message });
    }
  }

  user.otp.otp = otp;
  user.otp.expireDate = otpExpires;
  await user.save();
  await sendOtpEmail(email, otp);
  res.status(200).json({ message: "OTP sent to your email" });
};

// request change password
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res
      .status(400)
      .json({ message: "Email, OTP, and new password are required" });
  }
  try {
    const user = await User.findOne({ email: email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp.otp !== otp || user.expireDate < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    const hasdNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hasdNewPassword;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error resetting password" });
  }
};

// Controller for user signout
exports.SignOut = async (req, res) => {
  try {
    const cookie = req.cookies.token;
    if (!cookie) {
      return res.status(401).json({ message: "No token provided" });
    }
    jwt.verify(cookie, SECRET_TOKEN, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }
      // Clear the token cookie
      res.clearCookie("token");
      return res.status(200).json({ message: "User Sign out successfully" });
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Controller to delete user account
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.id;

    const delUser = await User.deleteOne({ _id: userId });
    if (!delUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "User deleted successfully!",
    });
  } catch (error) {
    console.log(error.stack);
  }
};

// Too change the user password!
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const userID = req.id;
    const fetchUser = await User.findOne({ _id: userID });
    const isMatch = await bcrypt.compare(oldPassword, fetchUser.password);
    if (!isMatch) {
      return res.status(404).json({
        message: "Wrong Password!",
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "New passwords do not match!",
      });
    }
    // Saving new password after hashing
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    fetchUser.password = hashedPassword;
    await fetchUser.save();

    res.status(200).json({
      message: "Password changed successfully!",
    });
  } catch (error) {
    console.log("The error is", error);
    res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};

exports.delProfilePic = async (req, res) => {
  try {
    const userId = req.id
    const user = await User.findOne({ _id: userId })
    if (user.profilePicture) {
      const publicId = user.profilePicture.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }
    user.profilePicture = ""
    await user.save()
    res.status(201).json({ message: "profile picture deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

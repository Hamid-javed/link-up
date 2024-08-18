const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  expiryDate: { type: Date, required: true },
});

notificationSchema.pre("save", function (next) {
  const Notification = mongoose.model("Notification");
  const User = mongoose.model("User");

  Notification.countDocuments({ userId: this.userId, isRead: false })
    .then(unreadNotificationsCount => {
      return User.findByIdAndUpdate(this.userId, { $set: { unreadNotificationsCount } });
    })
    .then(() => next())
    .catch(error => next(error));
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
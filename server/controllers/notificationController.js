const Notification = require("../models/notificationModel");
const User = require("../models/userModel");

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("fromUser", "username name profilePic")
      .populate("suggestedUser", "username name profilePic");
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};
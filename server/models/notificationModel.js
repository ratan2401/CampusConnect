const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // recipient
  type: { type: String, enum: ["like", "comment", "friend_request", "friend_accept", "suggested_friend"], required: true },
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // for like/comment/friend_request
  suggestedUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // for suggested_friend
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model("Notification", notificationSchema);
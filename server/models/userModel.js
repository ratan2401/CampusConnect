const mongoose = require("mongoose");

const authSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: String,
    college: String,
    phone: String,
    profilePic: { type: String, default: "https://picsum.photos/100" },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    sentRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    skills: { type: [String], default: [] },
    experience: { type: [String], default: [] },
  },
  { timestamps: true }
);

const authModel = mongoose.model("User", authSchema);

module.exports = authModel;

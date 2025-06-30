const User = require("../models/userModel");
const Friend = require("../models/friendModel");
const Notification = require("../models/notificationModel");

exports.getProfileByToken = async (req, res) => {
  const user = await User.findOne({ username: req.user.username }).select(
    "-password"
  );
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user });
};

exports.getProfileByUsername = async (req, res) => {
  const user = await User.findOne({ username: req.params.username }).select(
    "-password"
  );
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user });
};

exports.searchUsers = async (req, res) => {
  const q = req.query.q || "";
  const users = await User.find({
    $or: [
      { username: { $regex: q, $options: "i" } },
      { name: { $regex: q, $options: "i" } },
    ],
    _id: { $ne: req.user._id },
  }).select("name username profilePic");
  res.json({ users });
};

exports.getFriends = async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    "friends",
    "name username profilePic"
  );
  res.json({ friends: user.friends });
};

exports.getOtherUsers = async (req, res) => {
  const friends = await Friend.find({ user: req.user._id }).select("friend");
  const friendIds = friends.map((f) => f.friend);
  const users = await User.find({
    _id: { $nin: [...friendIds, req.user._id] },
  }).select("name username profilePic");
  res.json({ users });
};

exports.addFriend = async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: "UserId required" });
  await Friend.create({ user: req.user._id, friend: userId });
  await Friend.create({ user: userId, friend: req.user._id }); // mutual
  res.json({ message: "Friend added" });
};
exports.updateProfile = async (req, res) => {
  const { name, college, phone } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, college, phone },
    { new: true }
  ).select("-password");
  res.json({ user });
};

exports.changeProfilePhoto = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const user = await User.findById(req.user._id);
  user.profilePic = req.file.path;
  await user.save();

  res.json({ message: "Profile image updated", imageUrl: req.file.path });
};
exports.sendFriendRequest = async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: "UserId required" });
  if (userId == req.user._id)
    return res.status(400).json({ message: "Cannot send request to yourself" });

  const user = await User.findById(userId);
  const me = await User.findById(req.user._id);
  await Notification.create({
    user: userId, // recipient
    type: "friend_request",
    fromUser: req.user._id,
  });

  if (!user) return res.status(404).json({ message: "User not found" });

  // Prevent duplicate requests or already friends
  if (
    user.friendRequests.includes(req.user._id) ||
    user.friends.includes(req.user._id) ||
    me.sentRequests.includes(userId)
  ) {
    return res
      .status(400)
      .json({ message: "Request already sent or already friends" });
  }

  user.friendRequests.push(req.user._id);
  me.sentRequests.push(userId);

  await user.save();
  await me.save();

  res.json({ message: "Friend request sent" });
};

// Accept a friend request
exports.acceptFriendRequest = async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: "UserId required" });

  const user = await User.findById(userId);
  const me = await User.findById(req.user._id);

  if (!user) return res.status(404).json({ message: "User not found" });

  if (!me.friendRequests.includes(userId)) {
    return res
      .status(400)
      .json({ message: "No friend request from this user" });
  }

  me.friends.push(userId);
  user.friends.push(req.user._id);

  me.friendRequests = me.friendRequests.filter(
    (id) => id.toString() !== userId
  );
  user.sentRequests = user.sentRequests.filter(
    (id) => id.toString() !== req.user._id.toString()
  );

  await me.save();
  await user.save();

  // Create notification only after successful acceptance
  await Notification.create({
    user: userId, // the user who sent the request
    type: "friend_accept",
    fromUser: req.user._id, // the user who accepted
  });

  res.json({ message: "Friend request accepted" });
};

exports.removeFriend = async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: "UserId required" });

  const user = await User.findById(userId);
  const me = await User.findById(req.user._id);

  if (!user) return res.status(404).json({ message: "User not found" });

  // Remove from friends list
  me.friends = me.friends.filter((id) => id.toString() !== userId);
  user.friends = user.friends.filter(
    (id) => id.toString() !== req.user._id.toString()
  );

  await me.save();
  await user.save();

  res.json({ message: "Friend removed" });
};

exports.getSuggestedFriends = async (req, res) => {
  const college = req.query.college;
  if (!college) return res.status(400).json({ message: "College required" });

  // Exclude self and current friends
  const me = await User.findById(req.user._id);
  const excludeIds = [req.user._id, ...(me.friends || [])];

  const users = await User.find({
    college,
    _id: { $nin: excludeIds },
  }).select("_id name username profilePic");

  // Fetch already notified suggested user IDs for this user
  const notified = await Notification.find({
    user: req.user._id,
    type: "suggested_friend",
  }).distinct("suggestedUser");

  const suggestedUsers = [];

  for (const u of users) {
    const requestReceived = me.friendRequests.includes(u._id);
    const requestSent = me.sentRequests.includes(u._id);

    // If not already notified, create notification
    if (!notified.map((id) => id.toString()).includes(u._id.toString())) {
      await Notification.create({
        user: req.user._id,
        type: "suggested_friend",
        suggestedUser: u._id,
      });
    }

    suggestedUsers.push({
      ...u.toObject(),
      requestReceived,
      requestSent,
    });
  }

  res.json({ users: suggestedUsers });
};

exports.addSkill = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.skills.push(req.body.skill);
    await user.save();
    res.json({ skills: user.skills });
  } catch (err) {
    res.status(500).json({ error: "Failed to add skill" });
  }
};

exports.addExperience = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.experience.push(req.body.experience);
    await user.save();
    res.json({ experience: user.experience });
  } catch (err) {
    res.status(500).json({ error: "Failed to add experience" });
  }
};

exports.deleteSkill = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.skills = user.skills.filter((skill) => skill !== req.body.skill);
    await user.save();
    res.json({ skills: user.skills });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete skill" });
  }
};

exports.deleteExperience = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.experience = user.experience.filter((exp) => exp !== req.body.experience);
    await user.save();
    res.json({ experience: user.experience });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete experience" });
  }
};

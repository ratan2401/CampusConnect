const Post = require("../models/postModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");
const Notification = require("../models/notificationModel");
// const path = require("path");
const fs = require("fs");

exports.getFeed = async (req, res) => {
  const posts = await Post.find({})
    .sort({ createdAt: -1 })
    .populate("userId", "username name profilePic")
    .populate("comments.user", "username");
  res.json(posts);
};

exports.getSmartFeed = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user's friends
    const user = await User.findById(userId).populate("friends", "_id college");
    const friendIds = user.friends.map((f) => f._id);

    // Get suggested friends (same college, not already friends)
    const suggested = await User.find({
      _id: { $ne: userId, $nin: friendIds },
      college: user.college,
    }).select("_id");
    const suggestedIds = suggested.map((u) => u._id);

    // Get friends of friends (excluding self and direct friends)
    const friendsOfFriendsSet = new Set();
    for (const friend of user.friends) {
      const f = await User.findById(friend._id).select("friends");
      f.friends.forEach((fid) => {
        if (
          fid.toString() !== userId.toString() &&
          !friendIds.includes(fid) &&
          !suggestedIds.includes(fid)
        ) {
          friendsOfFriendsSet.add(fid.toString());
        }
      });
    }
    const friendsOfFriendsIds = Array.from(friendsOfFriendsSet);

    // Fetch posts
    const posts = await Post.find({
      $or: [
        { userId: userId },
        { userId: { $in: friendIds } },
        { userId: { $in: suggestedIds } },
        { userId: { $in: friendsOfFriendsIds } },
      ],
    })
      .populate("userId", "username profilePic")
      .populate("comments.user", "username profilePic")
      .lean();

    // Add some random posts (not from above users)
    const allIds = [
      userId,
      ...friendIds,
      ...suggestedIds,
      ...friendsOfFriendsIds,
    ].map((id) => id.toString());
    const randomPosts = await Post.aggregate([
      {
        $match: {
          userId: { $nin: allIds.map((id) => new mongoose.Types.ObjectId(id)) },
        },
      },
      { $sample: { size: 5 } },
    ]);

    const randomPopulated = await Post.populate(randomPosts, [
      {
        path: "userId",
        select: "username profilePic",
      },
      {
        path: "comments.user",
        select: "username profilePic",
      },
    ]);

    const allPosts = [...posts, ...randomPopulated];

    res.json(allPosts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch smart feed" });
  }
};

exports.getUserPosts = async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) return res.status(404).json({ posts: [] });
  const posts = await Post.find({ userId: user._id })
    .sort({ createdAt: -1 })
    .populate("userId", "username name profilePic")
    .populate("comments.user", "username profilePic");

  res.json({ posts });
};

exports.createPost = async (req, res) => {
  let image_filename = "";
  let video_filename = "";

  const fileUrl = req.file.path; // Cloudinary URL
  const mimetype = req.file.mimetype;
  if (mimetype.startsWith("image")) {
    image_filename = fileUrl;
  } else if (mimetype.startsWith("video")) {
    video_filename = fileUrl;
  }

  try {
    const post = await Post.create({
      userId: req.user._id,
      content: req.body.content,
      image: image_filename,
      video: video_filename,
    });
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Failed to create post" });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Only allow the owner to delete
    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await Post.findByIdAndDelete(postId);
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete post" });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user._id;
    const index = post.likes.indexOf(userId);

    if (index === -1) {
      post.likes.push(userId); // Like
    } else {
      post.likes.splice(index, 1); // Unlike
    }

    await post.save();

    // Only notify if it's a like (not unlike) and not liking own post
    if (index === -1 && post.userId.toString() !== userId.toString()) {
      await Notification.create({
        user: post.userId,
        type: "like",
        fromUser: req.user._id,
      });
    }

    res.json({ likes: post.likes });
  } catch (err) {
    res.status(500).json({ message: "Failed to like/unlike post" });
  }
};

exports.commentPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId).populate(
      "comments.user",
      "username profilePic"
    ); // Populate existing comments' user

    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = {
      user: req.user._id,
      text: req.body.text,
      createdAt: new Date(),
    };

    post.comments.push(comment);
    await post.save();

    // Populate the user field for the newly added comment
    await post.populate("comments.user", "username profilePic");

    // Notify post owner if not commenting on own post
    if (post.userId.toString() !== req.user._id.toString()) {
      await Notification.create({
        user: post.userId,
        type: "comment",
        fromUser: req.user._id,
      });
    }

    res.status(201).json({ comments: post.comments });
  } catch (err) {
    res.status(500).json({ message: "Failed to add comment" });
  }
};

exports.sharePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // You can implement more logic here (e.g., track shares)
    const postUrl = `${req.protocol}://${req.get("host")}/post/${post._id}`;
    res.json({ url: postUrl });
  } catch (err) {
    res.status(500).json({ message: "Failed to share post" });
  }
};



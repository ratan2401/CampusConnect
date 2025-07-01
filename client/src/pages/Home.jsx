import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/authContext";
import Navigation from "../components/Navigation";
import { useNavigate } from "react-router-dom";
import Button1 from "../components/ui/Button1";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [commentTexts, setCommentTexts] = useState({});
  const [posting, setPosting] = useState(false);
  const [openComments, setOpenComments] = useState({});
  const commentsRef = useRef({});
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: "",
    college: "",
    phone: "",
    profilePic: "",
  });

  const { token, user } = useAuth();
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        college: user.college || "",
        phone: user.phone || "",
        profilePic: user.profilePic || "",
      });
    }
  }, [user]);

  const fetchFeed = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/post/smartfeed", {
        headers: { token: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to fetch feed:", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchFeed();
    }
  }, [token]);

  const handlePostSubmit = async () => {
    if (!newPost.trim() && !image && !video) return;
    setPosting(true);
    const formData = new FormData();
    formData.append("content", newPost);
    if (image) formData.append("file", image);
    if (video) formData.append("file", video);

    try {
      await axios.post("http://localhost:3000/api/post", formData, {
        headers: {
          token: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setNewPost("");
      setImage(null);
      setVideo(null);
      fetchFeed();
    } catch (err) {
      console.error("Post failed:", err);
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(
        `http://localhost:3000/api/post/like/${postId}`,
        {},
        { headers: { token: `Bearer ${token}` } }
      );
      fetchFeed(); // Refresh posts after liking
    } catch (err) {
      console.error("Failed to like post:", err);
    }
  };

  const handleComment = async (postId, commentText) => {
    try {
      await axios.post(
        `http://localhost:3000/api/post/comment/${postId}`,
        { text: commentText },
        { headers: { token: `Bearer ${token}` } }
      );
      fetchFeed();
    } catch (err) {
      console.error("Failed to comment on post:", err);
    }
  };

  const handleShare = (postId) => {
    const url = `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(url);
    alert("Post link copied to clipboard!");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if any comment box is open
      const openPostId = Object.keys(openComments).find(
        (id) => openComments[id]
      );
      if (!openPostId) return;

      // If click is outside the open comment box and not on the comment button
      if (
        commentsRef.current[openPostId] &&
        !commentsRef.current[openPostId].contains(event.target) &&
        !event.target.closest(`[data-comment-btn="${openPostId}"]`)
      ) {
        setOpenComments((prev) => ({ ...prev, [openPostId]: false }));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openComments]);

  const toggleComments = (postId) => {
    setOpenComments({ [postId]: true }); 
  };

  return (
    <div className="min-h-screen bg-gray-700 ">
      <Navigation />

      <div className="flex w-full max-w-6xl mx-auto mt-8 pt-25">
        {/* Left Section */}
        <div className="w-1/3 pr-4">
          <div
            className=" fixed top-33 left-35 bg-gray-900 rounded shadow  
                        flex flex-col items-center p-6 w-80 "
          >
            
            <img
              src={user.profilePic}
              alt=""
              className="w-24 h-24 rounded-full mb-4  border-2 border-white"
            />
            <div className="text-xl font-bold text-white">{user.name}</div>
            <div className="text-white">{user.college}</div>
            {(!user.name || !user.college) && (
              <Button1 onClick={() => navigate(`/profile/${user.username}`)}>
                Complete Profile
              </Button1>
            )}
          </div>
        </div>
        {/* Right Section */}
        <div className="w-2/3">
          {/* Post Creation */}
          <div className="bg-gray-900 p-4 rounded shadow mb-6">
            <textarea
              className="w-full border rounded p-2 resize-none text-white"
              rows="2"
              placeholder="What's on your mind?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            ></textarea>
            <div className="flex gap-8 mt-2">
              <label className="flex flex-col items-center gap-1 cursor-pointer w-1/3">
                <span role="img" aria-label="Upload Image" className="text-5xl">
                  🖼️
                </span>
                <span className="text-xs text-gray-300">Post Image</span>
                <input
                  type="file"
                  accept="image/*"
                  placeholder="Upload Image"
                  onChange={(e) => setImage(e.target.files[0])}
                  style={{ display: "none" }}
                />
                {/* Show selected image file name */}
                {image && (
                  <span className="text-xs text-green-400 mt-1">
                    {image.name}
                  </span>
                )}
              </label>
              <label className="flex flex-col items-center gap-1 cursor-pointer w-1/3">
                <span role="img" aria-label="Upload Video" className="text-5xl">
                  🎥
                </span>
                <span className="text-xs text-gray-300">Post Video</span>
                <input
                  type="file"
                  accept="video/*"
                  placeholder="Upload Video"
                  onChange={(e) => setVideo(e.target.files[0])}
                  style={{ display: "none" }}
                />
                {/* Show selected video file name */}
                {video && (
                  <span className="text-xs text-green-400 mt-1">
                    {video.name}
                  </span>
                )}
              </label>
            </div>
            <div className="flex justify-end mt-2">
              <Button1 onClick={handlePostSubmit} disabled={posting}>
                {posting ? (
                  <span>
                    <svg
                      className="inline animate-spin mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      ></path>
                    </svg>
                    Posting...
                  </span>
                ) : (
                  "Post"
                )}
              </Button1>
            </div>
          </div>
          {/* Feed */}
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post._id} className="bg-gray-900 p-6 rounded shadow">
                <div className="flex items-center justify-between">
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() =>
                      navigate(`/profile/${post.userId?.username}`)
                    }
                    title={post.userId?.username}
                  >
                    {post.userId?.profilePic && (
                      <img
                        src={post.userId?.profilePic}
                        alt={post.userId?.username}
                        className="w-8 h-8 rounded-full border-2 border-white object-cover"
                      />
                    )}
                    <span className="text-gray-300 font-semibold">
                      {post.userId?.username}
                    </span>
                  </div>
                  {post.createdAt && (
                    <div className="text-xs text-gray-400">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
                <p className="mt-2 text-white">{post.content}</p>
                {post.image && (
                  <img src={post.image} alt="" className="w-100%" />
                )}
                {post.video && (
                  <video src={post.video} controls className="w-100%" />
                )}

                <div className="flex gap-6 mt-3 text-sm text-gray-400">
                  <button
                    className="bg-black border-1 border-black cursor-pointer rounded p-2"
                    onClick={() => handleLike(post._id)}
                  >
                    👍 {post.likes?.length || 0}
                  </button>
                  <button
                    className="bg-black border-1 border-black cursor-pointer rounded p-2"
                    onClick={() => toggleComments(post._id)}
                    data-comment-btn={post._id}
                  >
                    💬 {post.comments?.length || 0}
                  </button>
                  <button
                    className="bg-black border-1 border-black cursor-pointer rounded p-2"
                    onClick={() => handleShare(post._id)}
                  >
                    🔗 Share
                  </button>
                </div>
                {/* Toggleable Comments Section */}
                {openComments[post._id] && (
                  <div
                    className="mt-4"
                    ref={(el) => (commentsRef.current[post._id] = el)}
                  >
                    <div className="mb-2">
                      {post.comments && post.comments.length > 0 ? (
                        post.comments.map((c, idx) => (
                          <div
                            key={idx}
                            className="text-gray-200 text-sm mb-1 flex items-center gap-2"
                          >
                            {/* User profile pic and username, clickable */}
                            <span
                              className="flex items-center gap-1 cursor-pointer"
                              onClick={() =>
                                navigate(`/profile/${c.user?.username}`)
                              }
                              title={c.user?.username}
                            >
                              {c.user?.profilePic && (
                                <img
                                  src={c.user.profilePic}
                                  alt={c.user?.username}
                                  className="w-6 h-6 rounded-full border border-white object-cover"
                                />
                              )}

                              <span className="font-semibold">
                                {c.user?.username || "User"}:
                              </span>
                            </span>{" "}
                            {c.text}
                            <span className="ml-2 text-gray-400 text-xs">
                              {c.createdAt
                                ? new Date(c.createdAt).toLocaleString()
                                : ""}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-400 text-sm">
                          No comments yet.
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="border rounded px-2 py-1 text-white"
                        placeholder="Write a comment..."
                        value={commentTexts[post._id] || ""}
                        onChange={(e) =>
                          setCommentTexts({
                            ...commentTexts,
                            [post._id]: e.target.value,
                          })
                        }
                      />
                      <button
                        className="bg-black text-white px-3 rounded cursor-pointer"
                        onClick={() => {
                          handleComment(post._id, commentTexts[post._id] || "");
                          setCommentTexts({ ...commentTexts, [post._id]: "" });
                        }}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

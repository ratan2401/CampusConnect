import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Navigation from "../components/Navigation";
import Button1 from "../components/ui/Button1";

export default function Profile() {
  const { username } = useParams();
  const { user: loggedInUser, setUser: setLoggedInUser } = useAuth();
  const [profile, setProfile] = useState({});
  const [posts, setPosts] = useState([]);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [isFriend, setIsFriend] = useState(false);
  const [friendRequested, setFriendRequested] = useState(false);
  const [requestReceived, setRequestReceived] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentTexts, setCommentTexts] = useState({});

  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [experience, setExperience] = useState([]);
  const [newExperience, setNewExperience] = useState("");
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [showAllExperience, setShowAllExperience] = useState(false);
  const [showAddSkillPopup, setShowAddSkillPopup] = useState(false);
  const [showDeleteSkillPopup, setShowDeleteSkillPopup] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState("");
  const [showAddExperiencePopup, setShowAddExperiencePopup] = useState(false);
  const [showDeleteExperiencePopup, setShowDeleteExperiencePopup] =
    useState(false);
  const [experienceToDelete, setExperienceToDelete] = useState("");
  const [openComments, setOpenComments] = useState({});
  const commentsRef = useRef({});

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/user/profile/${username}`,
        {
          headers: { token: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setProfile(res.data.user);
      setForm(res.data.user);
      setSkills(res.data.user.skills || []);
      setExperience(res.data.user.experience || []);

      if (loggedInUser && res.data.user._id !== loggedInUser._id) {
        const isFriendNow = res.data.user.friends?.includes(loggedInUser._id);
        const friendRequestedNow = res.data.user.friendRequests?.includes(
          loggedInUser._id
        );
        const requestReceivedNow =
          loggedInUser.friendRequests?.includes(res.data.user._id) &&
          !isFriendNow;

        setIsFriend(isFriendNow);
        setFriendRequested(friendRequestedNow);
        setRequestReceived(requestReceivedNow);
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  useEffect(() => {
    fetchProfile();

    axios
      .get(`http://localhost:3000/api/post/user/${username}`, {
        headers: { token: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setPosts(res.data.posts))
      .catch((err) => console.error("Failed to fetch posts:", err));
  }, [username, loggedInUser, edit]);

  const handleSave = async () => {
    await axios.put("http://localhost:3000/api/user/updateProfile", form, {
      headers: { token: `Bearer ${localStorage.getItem("token")}` },
    });
    setEdit(false);
  };

  const handleDeleteSkill = async () => {
    if (!skillToDelete.trim()) return;
    try {
      const res = await axios.post(
        "http://localhost:3000/api/user/deleteSkill",
        { skill: skillToDelete },
        { headers: { token: `Bearer ${localStorage.getItem("token")}` } }
      );
      setSkills(res.data.skills);
      setSkillToDelete("");
      setShowDeleteSkillPopup(false);
    } catch {
      alert("Failed to delete skill");
    }
  };

  const handleDeleteExperience = async () => {
    if (!experienceToDelete.trim()) return;
    try {
      const res = await axios.post(
        "http://localhost:3000/api/user/deleteExperience",
        { experience: experienceToDelete },
        { headers: { token: `Bearer ${localStorage.getItem("token")}` } }
      );
      setExperience(res.data.experience);
      setExperienceToDelete("");
      setShowDeleteExperiencePopup(false);
    } catch {
      alert("Failed to delete experience");
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;
    try {
      const res = await axios.post(
        "http://localhost:3000/api/user/addSkill",
        { skill: newSkill },
        { headers: { token: `Bearer ${localStorage.getItem("token")}` } }
      );
      setSkills(res.data.skills);
      setNewSkill("");
      setShowAddSkillPopup(false);
    } catch {
      alert("Failed to add skill");
    }
  };

  const handleAddExperience = async () => {
    if (!newExperience.trim()) return;
    try {
      const res = await axios.post(
        "http://localhost:3000/api/user/addExperience",
        { experience: newExperience },
        { headers: { token: `Bearer ${localStorage.getItem("token")}` } }
      );
      setExperience(res.data.experience);
      setNewExperience("");
    } catch {
      alert("Failed to add experience");
    }
  };

  const handleSendFriendRequest = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/user/sendFriendRequest",
        { userId: profile._id },
        { headers: { token: `Bearer ${localStorage.getItem("token")}` } }
      );
      setFriendRequested(true);
    } catch (err) {
      alert("Failed to send friend request.");
    }
  };

  const handleAcceptFriendRequest = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/user/acceptFriendRequest",
        { userId: profile._id },
        { headers: { token: `Bearer ${localStorage.getItem("token")}` } }
      );

      // refresh loggedInUser context
      const updatedMe = await axios.get(
        "http://localhost:3000/api/user/profile",
        {
          headers: { token: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setLoggedInUser(updatedMe.data.user);

      // update local states
      setIsFriend(true);
      setRequestReceived(false);
      await fetchProfile();
    } catch (err) {
      alert("Failed to accept friend request.");
    }
  };

  const handleRemoveFriend = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/user/removeFriend",
        { userId: profile._id },
        { headers: { token: `Bearer ${localStorage.getItem("token")}` } }
      );

      const updatedMe = await axios.get(
        "http://localhost:3000/api/user/profile",
        {
          headers: { token: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setLoggedInUser(updatedMe.data.user);

      setIsFriend(false);
      setFriendRequested(false);
      setRequestReceived(false);
      await fetchProfile();
    } catch (err) {
      alert("Failed to remove friend.");
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(
        `http://localhost:3000/api/post/deletePost/${postId}`,
        {
          headers: { token: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setPosts(posts.filter((p) => p._id !== postId));
      if (selectedPost && selectedPost._id === postId) setSelectedPost(null);
    } catch (err) {
      alert("Failed to delete post.");
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await axios.post(
        `http://localhost:3000/api/post/like/${postId}`,
        {},
        { headers: { token: `Bearer ${localStorage.getItem("token")}` } }
      );
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, likes: res.data.likes } : p
        )
      );
      if (selectedPost && selectedPost._id === postId) {
        setSelectedPost({ ...selectedPost, likes: res.data.likes });
      }
    } catch (err) {
      alert("Failed to like post.");
    }
  };

  const handleComment = async (postId) => {
    try {
      const res = await axios.post(
        `http://localhost:3000/api/post/comment/${postId}`,
        { text: commentTexts[postId] },
        { headers: { token: `Bearer ${localStorage.getItem("token")}` } }
      );
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, comments: res.data.comments } : p
        )
      );
      if (selectedPost && selectedPost._id === postId) {
        setSelectedPost({ ...selectedPost, comments: res.data.comments });
      }
      setCommentTexts({ ...commentTexts, [postId]: "" });
    } catch (err) {
      alert("Failed to comment.");
    }
  };

  const handleShare = async (postId) => {
    try {
      const res = await axios.post(
        `http://localhost:3000/api/post/share/${postId}`,
        {},
        { headers: { token: `Bearer ${localStorage.getItem("token")}` } }
      );
      window.prompt("Copy and share this link:", res.data.url);
    } catch (err) {
      alert("Failed to share post.");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const openPostId = Object.keys(openComments).find(
        (id) => openComments[id]
      );
      if (!openPostId) return;
      if (
        commentsRef.current[openPostId] &&
        !commentsRef.current[openPostId].contains(event.target)
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
    <div className="flex flex-col w-full min-h-screen bg-gray-700 pt-25">
      <Navigation />
      <div className="flex">
        {/* Left: Profile Info */}
        <div className="w-1/3 p-8">
          <div
            className="fixed top-33 left-35 bg-gray-900 rounded-tl-5xl rounded-bl-5xl 
                  rounded-tr-5xl rounded-br-5xl shadow p-6 w-80"
          >
            <div className="relative w-24 h-24 mx-auto mb-4">
              <img
                src={profile.profilePic}
                alt="profile"
                className="w-24 h-24 rounded-full text-black text-center border-2 border-white text-white object-cover"
              />
              {loggedInUser.username === username && (
                <>
                  {/* Edit icon overlay, only visible on hover */}
                  <label
                    htmlFor="profile-photo-input"
                    className="absolute inset-0 opacity-0 flex items-center justify-center  
                              bg-opacity-100 rounded-full opacity-0 hover:opacity-100 
                              cursor-pointer transition-opacity "
                    style={{ transition: "opacity 0.2s" }}
                    title="Change Profile Photo"
                  >
                    {/* Edit (camera) icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553 2.276A2 2 0 0122 14.118V17a2 2 0 01-2 2H4a2 2 0 01-2-2v-2.882a2 2 0 01.447-1.842L7 10m8 0V7a4 4 0 10-8 0v3m8 0H7"
                      />
                    </svg>
                  </label>
                  <input
                    id="profile-photo-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const formData = new FormData();
                      formData.append("photo", file);
                      try {
                        const res = await axios.post(
                          "http://localhost:3000/api/user/changeProfilePhoto",
                          formData,
                          {
                            headers: {
                              token: `Bearer ${localStorage.getItem("token")}`,
                              "Content-Type": "multipart/form-data",
                            },
                          }
                        );
                        setProfile((prev) => ({
                          ...prev,
                          profilePic: res.data.profilePic,
                        }));
                      } catch {
                        alert("Failed to change profile photo");
                      }
                    }}
                  />
                </>
              )}
            </div>
            {/* ...rest of your profile card... */}
            {edit ? (
              <>
                <div className="flex flex-col items-center gap-4 mb-4">
                  <input
                    className="rounded px-2 py-1 text-white border border-white bg-gray-800 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.name}
                    placeholder="Name"
                    autoFocus
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <input
                    className="rounded px-2 py-1 text-white border border-white bg-gray-800 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.college}
                    placeholder="College"
                    onFocus={(e) => e.target.select()}
                    onChange={(e) =>
                      setForm({ ...form, college: e.target.value })
                    }
                  />
                  <input
                    className="rounded px-2 py-1 text-white border border-white bg-gray-800 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.phone}
                    placeholder="Phone"
                    onFocus={(e) => e.target.select()}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                  <Button1 onClick={handleSave}>Save</Button1>
                </div>
              </>
            ) : (
              <>
                <div className="pb-4">
                  <div className="text-xl font-bold text-left text-white ">
                    {profile.name}
                  </div>
                  <div className="text-gray-600 text-left text-white">
                    Username: @{profile.username}
                  </div>
                  <div className="text-gray-600 text-left text-white">
                    Email: {profile.email}
                  </div>
                  <div className="text-gray-600 text-left text-white">
                    Phone: {profile.phone}
                  </div>
                  <div className="text-gray-600 text-left text-white">
                    College: {profile.college}
                  </div>
                </div>
                {loggedInUser.username === username && (
                  <Button1 onClick={() => setEdit(true)}>Edit</Button1>
                )}
                {/* Friend Request/Accept/Remove Logic */}
                {loggedInUser.username !== username && (
                  <>
                    {!isFriend && !friendRequested && !requestReceived && (
                      <button
                        className="mt-4 bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
                        onClick={handleSendFriendRequest}
                      >
                        Send Friend Request
                      </button>
                    )}
                    {friendRequested && (
                      <div className="mt-4 text-yellow-400">
                        Friend request sent. Awaiting acceptance.
                      </div>
                    )}
                    {requestReceived && (
                      <button
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
                        onClick={handleAcceptFriendRequest}
                      >
                        Accept Friend Request
                      </button>
                    )}
                    {isFriend && (
                      <>
                        <div className="mt-4 text-blue-400">
                          You are friends
                        </div>
                        <Button1
                          onClick={handleRemoveFriend}
                        >
                          Remove Friend
                        </Button1>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
        {/* Right: User Posts, Skills, Experience */}
        <div className="w-2/3 p-8 flex flex-col gap-6">
          {/* Posts Section */}
          <div className="rounded shadow p-6 bg-gray-900">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Works</h2>
              <button
                className="text-blue-400 underline cursor-pointer"
                onClick={() => setShowAllPosts((v) => !v)}
              >
                {showAllPosts ? "View Less" : "View Full"}
              </button>
            </div>
            {!selectedPost ? (
              <div className="grid grid-cols-3 gap-4">
                {(showAllPosts ? posts : posts.slice(0, 6)).map((post) => (
                  <div
                    key={post._id}
                    className="relative group border rounded overflow-hidden bg-gray-800 cursor-pointer"
                  >
                    {post.image && (
                      <img
                        src={post.image}
                        alt=""
                        className="w-full h-32 object-cover"
                      />
                    )}
                    {post.video && (
                      <video
                        src={post.video}
                        className="w-full h-32 object-cover"
                        controls={false}
                        muted
                      />
                    )}
                    {!post.image && !post.video && (
                      <div className="w-full h-32 flex items-center justify-center text-white">
                        {post.content}
                      </div>
                    )}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="w-full h-full backdrop-blur-sm"></div>
                    </div>
                    {/* Hover actions */}
                    <div className=" absolute inset-0 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity pointer-events-auto">
                      <button
                        className="mb-2 bg-blue-600 text-white px-3 py-1 rounded cursor-pointer"
                        onClick={() => setSelectedPost(post)}
                        title="View Post"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                      {loggedInUser._id === profile._id && (
                        <button
                          className="bg-red-600 text-white px-3 py-1 rounded cursor-pointer"
                          onClick={() => handleDeletePost(post._id)}
                          title="Delete"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-7 0h10"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Opened post view
              <div className="bg-gray-800 p-6 rounded shadow relative pl-15">
                <div className="flex items-center justify-between">
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => {
                      if (selectedPost.userId?.username) {
                        window.location.href = `/profile/${selectedPost.userId.username}`;
                      }
                    }}
                    title={selectedPost.userId?.username}
                  >
                    {selectedPost.userId?.profilePic && (
                      <img
                        src={selectedPost.userId?.profilePic}
                        alt={selectedPost.userId?.username || "User"}
                        className="w-8 h-8 rounded-full border-2 border-white object-cover"
                      />
                    )}
                    <span className="text-gray-300 font-semibold">
                      {selectedPost.userId?.username || "User"}
                    </span>
                  </div>
                  {selectedPost.createdAt && (
                    <div className="text-xs text-gray-400">
                      {new Date(selectedPost.createdAt).toLocaleDateString()}
                    </div>
                  )}
                  <Button1 onClick={() => setSelectedPost(null)}>Close</Button1>
                </div>

                <p className="mt-2 text-white w-full">{selectedPost.content}</p>
                {selectedPost.image && (
                  <img
                    src={selectedPost.image}
                    alt=""
                    className="w-4/5  object-contain my-2"
                  />
                )}
                {selectedPost.video && (
                  <video
                    src={selectedPost.video}
                    controls
                    className="w-4/5  object-contain my-2"
                  />
                )}
                <div className="flex gap-6 mt-3 text-sm text-gray-400">
                  <button
                    className="bg-black border-1 border-black cursor-pointer rounded p-2"
                    onClick={() => handleLike(selectedPost._id)}
                  >
                    👍 {selectedPost.likes?.length || 0}
                  </button>
                  <button
                    className="bg-black border-1 border-black cursor-pointer rounded p-2"
                    onClick={() => toggleComments(selectedPost._id)}
                  >
                    💬 {selectedPost.comments?.length || 0}
                  </button>
                  <button
                    className="bg-black border-1 border-black cursor-pointer rounded p-2"
                    onClick={() => handleShare(selectedPost._id)}
                  >
                    🔗 Share
                  </button>
                </div>
                {openComments[selectedPost._id] && (
                  <div
                    className="mt-4"
                    ref={(el) => (commentsRef.current[selectedPost._id] = el)}
                  >
                    <div className="mb-2">
                      {selectedPost.comments &&
                      selectedPost.comments.length > 0 ? (
                        selectedPost.comments.map((c, idx) => (
                          <div
                            key={idx}
                            className="text-gray-200 text-sm mb-1 flex items-center gap-2"
                          >
                            <span
                              className="flex items-center gap-1 cursor-pointer"
                              onClick={() => {
                                if (c.user?.username) {
                                  window.location.href = `/profile/${c.user.username}`;
                                }
                              }}
                              title={c.user?.username}
                            >
                              {c.user?.profilePic && (
                                <img
                                  src={c.user?.profilePic}
                                  alt={c.user?.username || "User"}
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
                        value={commentTexts[selectedPost._id] || ""}
                        onChange={(e) =>
                          setCommentTexts({
                            ...commentTexts,
                            [selectedPost._id]: e.target.value,
                          })
                        }
                      />
                      <button
                        className="bg-blue-600 text-white px-3 rounded cursor-pointer"
                        onClick={() => handleComment(selectedPost._id)}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Skills Section */}
          <div className="rounded shadow p-6 bg-gray-900">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Skills</h2>
              <button
                className="text-blue-400 underline cursor-pointer"
                onClick={() => setShowAllSkills((v) => !v)}
              >
                {showAllSkills ? "View Less" : "View Full"}
              </button>
            </div>
            <ul className="list-disc pl-5 text-white mb-2">
              {(showAllSkills ? skills : skills.slice(0, 5)).map(
                (skill, idx) => (
                  <li key={idx}>{skill}</li>
                )
              )}
            </ul>
            {loggedInUser.username === username && (
              <div className="flex gap-2 mt-2">
                <Button1 onClick={() => setShowAddSkillPopup(true)}>
                  Add Skill
                </Button1>
                <Button1 onClick={() => setShowDeleteSkillPopup(true)}>
                  Delete Skill
                </Button1>
              </div>
            )}
            {/* Add Skill Popup */}
            {showAddSkillPopup && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <div>
                    <h3 className="text-lg text-white font-bold">Add Skill</h3>
                    <input
                      className="modal-input"
                      placeholder="Enter new skill"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-20 item-center justify-center">
                    <button className="modal-button" onClick={handleAddSkill}>
                      Add
                    </button>
                    <button
                      className="modal-button"
                      onClick={() => setShowAddSkillPopup(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* Delete Skill Popup */}
            {showDeleteSkillPopup && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h3 className="text-lg text-white font-bold">Delete Skill</h3>
                  <div className="select-wrapper">
                    <select
                      className="modal-select"
                      value={skillToDelete}
                      onChange={(e) => setSkillToDelete(e.target.value)}
                    >
                      <option value="">Select a skill</option>
                      {skills.map((skill, idx) => (
                        <option key={idx} value={skill}>
                          {skill}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-20 justify-center">
                    <button
                      className="modal-button"
                      onClick={handleDeleteSkill}
                    >
                      Delete
                    </button>
                    <button
                      className="modal-button"
                      onClick={() => setShowDeleteSkillPopup(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Experience Section */}
          <div className="rounded shadow p-6 bg-gray-900">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Experience</h2>
              <button
                className="text-blue-400 underline cursor-pointer"
                onClick={() => setShowAllExperience((v) => !v)}
              >
                {showAllExperience ? "View Less" : "View Full"}
              </button>
            </div>
            <ul className="list-disc pl-5 text-white mb-2">
              {(showAllExperience ? experience : experience.slice(0, 5)).map(
                (exp, idx) => (
                  <li key={idx}>{exp}</li>
                )
              )}
            </ul>
            {loggedInUser.username === username && (
              <div className="flex gap-2 mt-2">
                <Button1 onClick={() => setShowAddExperiencePopup(true)}>
                  Add Experience
                </Button1>
                <Button1 onClick={() => setShowDeleteExperiencePopup(true)}>
                  Delete Experience
                </Button1>
              </div>
            )}
            {/* Add Experience Popup */}
            {showAddExperiencePopup && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <div>
                    <h3 className="text-lg text-white font-bold">
                      Add Experience
                    </h3>
                    <input
                      className="modal-input"
                      placeholder="Enter new experience"
                      value={newExperience}
                      onChange={(e) => setNewExperience(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-20 item-center justify-center">
                    <button
                      className="modal-button"
                      onClick={handleAddExperience}
                    >
                      Add
                    </button>
                    <button
                      className="modal-button"
                      onClick={() => setShowAddExperiencePopup(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* Delete Experience Popup */}
            {showDeleteExperiencePopup && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h3 className="text-lg text-white font-bold">
                    Delete Experience
                  </h3>
                  <div className="select-wrapper">
                    <select
                      className="modal-select"
                      value={experienceToDelete}
                      onChange={(e) => setExperienceToDelete(e.target.value)}
                    >
                      <option value="">Select an experience</option>
                      {experience.map((exp, idx) => (
                        <option key={idx} value={exp}>
                          {exp}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-20 justify-center">
                    <button
                      className="modal-button"
                      onClick={handleDeleteExperience}
                    >
                      Delete
                    </button>
                    <button
                      className="modal-button"
                      onClick={() => setShowDeleteExperiencePopup(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

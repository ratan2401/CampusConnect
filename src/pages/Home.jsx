import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const [user, setUser] = useState(null); // State to store logged-in user details
  const [friendsPosts, setFriendsPosts] = useState([]); // State to store posts by friends
  const [likes, setLikes] = useState({}); // State to track likes for each post
  const [userLikes, setUserLikes] = useState([]); // State to track posts liked by the current user
  const [comments, setComments] = useState({}); // State to track comments for each post
  const navigate = useNavigate();


  useEffect(() => {
    // Retrieve the logged-in user details from localStorage
    const loggedInUser = JSON.parse(localStorage.getItem("currentUser"));
    if (loggedInUser) {
      setUser(loggedInUser);

      // Retrieve all posts and filter posts created by friends
      const posts = JSON.parse(localStorage.getItem("posts")) || [];
      const friendsPosts = posts.filter((post) =>
        loggedInUser.friendsList?.includes(post.authorEmail)
      );
      setFriendsPosts(friendsPosts);

      // Retrieve likes and user-specific likes from localStorage
      const storedLikes = JSON.parse(localStorage.getItem("likes")) || {};
      const storedUserLikes = JSON.parse(localStorage.getItem("userLikes")) || {};
      setLikes(storedLikes);
      setUserLikes(storedUserLikes[loggedInUser.email] || []);
    } else {
      // If no user is logged in, redirect to the login page
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    // Remove only the current session data
    localStorage.removeItem("currentUser");
    // Redirect to the login page
    navigate("/login");
  };

  const handleLike = (postId) => {
    if (userLikes.includes(postId)) {
      alert("You have already liked this post!");
      return;
    }

    const updatedLikes = { ...likes, [postId]: (likes[postId] || 0) + 1 };
    const updatedUserLikes = [...userLikes, postId];

    setLikes(updatedLikes);
    setUserLikes(updatedUserLikes);

    // Save likes and user-specific likes to localStorage
    localStorage.setItem("likes", JSON.stringify(updatedLikes));
    const storedUserLikes = JSON.parse(localStorage.getItem("userLikes")) || {};
    storedUserLikes[user.email] = updatedUserLikes;
    localStorage.setItem("userLikes", JSON.stringify(storedUserLikes));
  };

  const handleComment = (postId, comment) => {
    setComments((prevComments) => ({
      ...prevComments,
      [postId]: [...(prevComments[postId] || []), comment],
    }));

    // Save comments to localStorage
    const storedComments = JSON.parse(localStorage.getItem("comments")) || {};
    storedComments[postId] = [...(storedComments[postId] || []), comment];
    localStorage.setItem("comments", JSON.stringify(storedComments));
  };

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className="flex flex-col w-60 h-screen border-r border-gray-400 overflow-hidden">
        <div className="mt-10 text-[25px] font-serif h-10 flex items-center pl-8">
          ShareXP
        </div>

        <div className="flex-1"></div>

        <Link to="." className="text-[20px] text-white font-serif h-10 flex items-center pl-4">
          <button className="w-full text-left">Home</button>
        </Link>
        <Link to="/Search" className="text-[20px] mt-1 text-white font-serif h-10 flex items-center pl-4">
          <button className="w-full text-left">Search</button>
        </Link>
        <Link to="/messages" className="text-[20px] mt-1 text-white font-serif h-10 flex items-center pl-4">
          <button className="w-full text-left">Messages</button>
        </Link>
        <Link to="/notifications" className="text-[20px] mt-1 text-white font-serif h-10 flex items-center pl-4">
          <button className="w-full text-left">Notifications</button>
        </Link>
        <Link to="/create" className="text-[20px] mt-1 text-white font-serif h-10 flex items-center pl-4">
          <button className="w-full text-left">Create</button>
        </Link>
        <Link to="/profile" className="text-[20px] mt-1 mb-10 text-white font-serif h-10 flex items-center pl-4">
          <button className="w-full text-left">Profile</button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 hide-scrollbar">
        <h3 className="text-4xl font-bold text-white">Welcome to Student Community</h3>
        <p className="text-gray-400 mt-2">A place to share skills, experiences, and semester reports.</p>

        {/* Friends' Posts */}
        <div className="mt-10 space-y-10">
          {friendsPosts.length > 0 ? (
            friendsPosts.map((post) => (
              <div
                key={post.id}
                className="bg-[#1a1a1a] p-4 rounded-lg shadow-md text-white"
              >
                <h4 className="text-lg font-bold">{post.authorName}</h4>
                <p className="text-sm text-gray-400">{post.createdAt}</p>
                <div className="mt-4">
                  {post.type === "text" && <p>{post.content}</p>}
                  {post.type === "image" && (
                    <img
                      src={post.content}
                      alt="Post"
                      className="rounded-lg max-w-full"
                    />
                  )}
                  {post.type === "link" && (
                    <a
                      href={post.content}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline"
                    >
                      {post.content}
                    </a>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <button
                    onClick={() => handleLike(post.id)}
                    style={{
                      backgroundColor: "#4a90e2",
                      color: "white",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Like ({likes[post.id] || 0})
                  </button>
                  <button
                    onClick={() => {
                      const comment = prompt("Enter your comment:");
                      if (comment) handleComment(post.id, comment);
                    }}
                    style={{
                      backgroundColor: "#4a90e2",
                      color: "white",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Comment
                  </button>
                </div>
                {comments[post.id] && comments[post.id].length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-sm font-bold">Comments:</h5>
                    <ul className="mt-2 space-y-2">
                      {comments[post.id].map((comment, index) => (
                        <li key={index} className="text-gray-300">
                          {comment}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-400">No posts from your friends yet.</p>
          )}
        </div>
      </div>

      {/* Right Sidebar (User Info) */}
      <div className="flex flex-col w-55 ml-auto h-screen overflow-hidden">
        {user ? (
          <>
            <p className="text-[15px] mt-5 text-white font-serif h-5 flex items-center pl-4">
              {user.name} {/* Display the logged-in user's name */}
            </p>
            <p className="text-[15px] mt-2 text-white font-serif h-5 flex items-center pl-4">
              <Link to="/profile" className="text-left">View Profile</Link>
              <button onClick={handleLogout} className="ml-5 text-left text-red-500">
                Logout
              </button>
            </p>
          </>
        ) : (
          <p className="text-[15px] mt-5 text-white font-serif h-5 flex items-center pl-4">
            Loading user details...
          </p>
        )}
      </div>
    </div>
  );
}
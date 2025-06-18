import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
//import "./Profile.css"; // Import CSS for styling

const Profile = () => {
  const [user, setUser] = useState(null); // State to store logged-in user details
  const [friendsList, setFriendsList] = useState([]); // State to store the list of friends
  const [showFriendsList, setShowFriendsList] = useState(false); // State to toggle the friends list view
  const [selectedFriend, setSelectedFriend] = useState(null); // State to store the selected friend's details
  const [selectedPosts, setSelectedPosts] = useState([]); // State to store posts or projects to display
  const [viewType, setViewType] = useState(""); // State to track whether viewing posts or projects
  const [likes, setLikes] = useState({}); // State to track likes for posts/projects
  const [comments, setComments] = useState({}); // State to track comments for posts/projects
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the logged-in user details from localStorage
    const loggedInUser = JSON.parse(localStorage.getItem("currentUser"));
    if (loggedInUser) {
      setUser(loggedInUser);

      // Retrieve all users and filter the friends of the logged-in user
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const friends = users.filter((u) => loggedInUser.friendsList?.includes(u.email));
      setFriendsList(friends);
    } else {
      // If no user is logged in, redirect to the login page
      navigate("/login");
    }
  }, [navigate]);

  const handleProfilePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const updatedUser = { ...user, profilePhoto: reader.result };
        setUser(updatedUser);
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));

        // Update the user in the "users" list in localStorage
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const updatedUsers = users.map((u) =>
          u.email === updatedUser.email ? updatedUser : u
        );
        localStorage.setItem("users", JSON.stringify(updatedUsers));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleViewPosts = () => {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const userPosts = posts.filter((post) => post.authorEmail === user.email);
    setSelectedPosts(userPosts);
    setViewType("posts");
  };

  const handleViewProjects = () => {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const userProjects = posts.filter((post) => post.authorEmail === user.email && post.isProjectRelated);
    setSelectedPosts(userProjects);
    setViewType("projects");
  };

  const handleLike = (postId) => {
    setLikes((prevLikes) => ({
      ...prevLikes,
      [postId]: (prevLikes[postId] || 0) + 1,
    }));
  };

  const handleComment = (postId, comment) => {
    setComments((prevComments) => ({
      ...prevComments,
      [postId]: [...(prevComments[postId] || []), comment],
    }));
  };

  const handleRemoveFriend = (friendEmail) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const updatedUsers = users.map((user) => {
      if (user.email === currentUser.email) {
        return {
          ...user,
          friends: user.friends - 1,
          friendsList: user.friendsList.filter((email) => email !== friendEmail),
        };
      }
      if (user.email === friendEmail) {
        return {
          ...user,
          friends: user.friends - 1,
          friendsList: user.friendsList.filter((email) => email !== currentUser.email),
        };
      }
      return user;
    });

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    const updatedCurrentUser = updatedUsers.find((user) => user.email === currentUser.email);
    localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser));

    setUser(updatedCurrentUser);
    setFriendsList(updatedUsers.filter((u) => updatedCurrentUser.friendsList?.includes(u.email)));

    alert("Friend removed successfully!");
  };

  const handleViewFriendProfile = (friendEmail) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const friend = users.find((u) => u.email === friendEmail);
    setSelectedFriend(friend);
    setShowFriendsList(false);
  };

  return (
    <div className="profile-container" style={{ display: "flex", backgroundColor: "black", color: "white", minHeight: "100vh" }}>
      {/* Main Profile Section */}
      <div style={{ flex: 1, padding: "20px" }}>
        {user ? (
          <>
            {/* Profile Header */}
            <header className="profile-header text-center">
              <img
                src={user.profilePhoto || "https://via.placeholder.com/150"}
                alt="Profile"
                className="profile-photo"
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  margin: "0 auto",
                  display: "block",
                  border: "3px solid white",
                }}
              />
              <label
                htmlFor="profilePhotoInput"
                style={{
                  display: "block",
                  marginTop: "10px",
                  cursor: "pointer",
                  color: "#4a90e2",
                  textDecoration: "underline",
                }}
              >
                Edit Profile Photo
              </label>
              <input
                id="profilePhotoInput"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleProfilePhotoChange}
              />
              <h1 className="profile-name text-3xl font-bold mt-4">{user.name}</h1>
              <p className="profile-tagline text-gray-400">Aspiring Developer | Student</p>
            </header>

            {/* Profile Stats */}
            <section className="profile-stats mt-10 text-center">
              <div className="stats-grid" style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px" }}>
                <div>
                  <h2
                    className="text-2xl font-bold cursor-pointer"
                    onClick={() => {
                      setShowFriendsList(!showFriendsList);
                      setSelectedFriend(null);
                    }}
                    style={{ textDecoration: "underline", cursor: "pointer" }}
                  >
                    {user.friends || 0}
                  </h2>
                  <p className="text-gray-400">Friends</p>
                </div>
                <div>
                  <h2
                    className="text-2xl font-bold cursor-pointer"
                    onClick={handleViewPosts}
                    style={{ textDecoration: "underline", cursor: "pointer" }}
                  >
                    {user.posts || 0}
                  </h2>
                  <p className="text-gray-400">Posts</p>
                </div>
                <div>
                  <h2
                    className="text-2xl font-bold cursor-pointer"
                    onClick={handleViewProjects}
                    style={{ textDecoration: "underline", cursor: "pointer" }}
                  >
                    {user.projects || 0}
                  </h2>
                  <p className="text-gray-400">Projects</p>
                </div>
              </div>
            </section>

            {/* Contact Details */}
            <section className="profile-contact mt-10">
              <h2 className="text-2xl font-bold mb-4">Contact Details</h2>
              <p>Email: {user.email}</p>
              <p>Phone: {user.phone}</p>
              <p>Nationality: {user.nationality}</p>
            </section>
          </>
        ) : (
          <p className="text-center text-white">Loading user details...</p>
        )}
      </div>

      {/* Friends List Sidebar */}
      {showFriendsList && (
        <div
          className="friends-list-sidebar"
          style={{
            width: "300px",
            backgroundColor: "#1a1a1a",
            padding: "20px",
            borderLeft: "1px solid gray",
            overflowY: "auto",
          }}
        >
          <h2 className="text-2xl font-bold mb-4">Friends List</h2>
          {friendsList.length > 0 ? (
            <ul>
              {friendsList.map((friend) => (
                <li key={friend.email} style={{ marginBottom: "10px" }}>
                  <p>Name: {friend.name}</p>
                  <p>Email: {friend.email}</p>
                  <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
                    <button
                      onClick={() => handleViewFriendProfile(friend.email)}
                      style={{
                        backgroundColor: "#4a90e2",
                        color: "white",
                        padding: "5px 10px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => handleRemoveFriend(friend.email)}
                      style={{
                        backgroundColor: "red",
                        color: "white",
                        padding: "5px 10px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Remove Friend
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No friends to display.</p>
          )}
        </div>
      )}

      {/* Friend Profile Sidebar */}
      {selectedFriend && (
        <div
          className="friend-profile-sidebar"
          style={{
            width: "300px",
            backgroundColor: "#1a1a1a",
            padding: "20px",
            borderLeft: "1px solid gray",
            overflowY: "auto",
          }}
        >
          <h2 className="text-2xl font-bold mb-4">Friend's Profile</h2>
          <img
            src={selectedFriend.profilePhoto || "https://via.placeholder.com/150"}
            alt="Friend Profile"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              marginBottom: "10px",
              display: "block",
              margin: "0 auto",
            }}
          />
          <p>Name: {selectedFriend.name}</p>
          <p>Email: {selectedFriend.email}</p>
          <p>Phone: {selectedFriend.phone}</p>
          <p>Nationality: {selectedFriend.nationality}</p>
          <p>Friends: {selectedFriend.friends || 0}</p>
          <p>Posts: {selectedFriend.posts || 0}</p>
          <p>Projects: {selectedFriend.projects || 0}</p>
        </div>
      )}

      {/* Sidebar for Posts or Projects */}
      {selectedPosts.length > 0 && (
        <div
          className="posts-projects-sidebar"
          style={{
            width: "400px",
            backgroundColor: "#1a1a1a",
            padding: "20px",
            borderLeft: "1px solid gray",
            overflowY: "auto",
          }}
        >
          <h2 className="text-2xl font-bold mb-4">{viewType === "posts" ? "Posts" : "Projects"}</h2>
          {selectedPosts.map((post) => (
            <div
              key={post.id}
              style={{
                marginBottom: "20px",
                padding: "15px",
                backgroundColor: "#333",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
              }}
            >
              <p className="text-gray-300">{post.content}</p>
              {post.type === "image" && (
                <img
                  src={post.content}
                  alt="Post"
                  style={{
                    width: "100%",
                    borderRadius: "5px",
                    marginTop: "10px",
                  }}
                />
              )}
              {post.type === "link" && (
                <a
                  href={post.content}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#4a90e2", textDecoration: "underline" }}
                >
                  {post.content}
                </a>
              )}
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
                  <h5 className="text-sm font-bold text-gray-400">Comments:</h5>
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
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
import React, { useState } from "react";
//import "./Search.css";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [isAlreadyFriend, setIsAlreadyFriend] = useState(false); // State to track if the user is already a friend
  const [viewProfile, setViewProfile] = useState(false); // State to toggle the profile view

  const handleSearch = () => {
    // Retrieve all registered users from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // Find the user whose name, email, or phone matches the search term
    const result = users.find(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
    );

    if (result) {
      // Check if the searched user is already a friend
      const isFriend = currentUser.friendsList?.includes(result.email) || false;
      setIsAlreadyFriend(isFriend);
    } else {
      setIsAlreadyFriend(false);
    }

    setSearchResult(result || null);
    setViewProfile(false); // Reset the profile view
  };

  const handleAddFriend = () => {
    if (searchResult) {
      // Retrieve all users from localStorage
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));

      // Increment the friends count for the searched user and the current user
      const updatedUsers = users.map((user) => {
        if (user.email === searchResult.email) {
          return {
            ...user,
            friends: user.friends + 1,
            friendsList: [...(user.friendsList || []), currentUser.email], // Add the current user's email to the searched user's friends list
          };
        }
        if (user.email === currentUser.email) {
          return {
            ...user,
            friends: user.friends + 1,
            friendsList: [...(user.friendsList || []), searchResult.email], // Add the searched user's email to the current user's friends list
          };
        }
        return user;
      });

      // Save the updated users back to localStorage
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      // Update the current user in localStorage
      const updatedCurrentUser = updatedUsers.find((user) => user.email === currentUser.email);
      localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser));

      alert("Friend added successfully!");
      setSearchResult(null); // Clear the search result
      setIsAlreadyFriend(false); // Reset the friend status
    }
  };

  const handleRemoveFriend = () => {
    if (searchResult) {
      // Retrieve all users from localStorage
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));

      // Decrement the friends count for the searched user and the current user
      const updatedUsers = users.map((user) => {
        if (user.email === searchResult.email) {
          return {
            ...user,
            friends: user.friends - 1,
            friendsList: user.friendsList.filter((email) => email !== currentUser.email), // Remove the current user's email from the searched user's friends list
          };
        }
        if (user.email === currentUser.email) {
          return {
            ...user,
            friends: user.friends - 1,
            friendsList: user.friendsList.filter((email) => email !== searchResult.email), // Remove the searched user's email from the current user's friends list
          };
        }
        return user;
      });

      // Save the updated users back to localStorage
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      // Update the current user in localStorage
      const updatedCurrentUser = updatedUsers.find((user) => user.email === currentUser.email);
      localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser));

      alert("Friend removed successfully!");
      setSearchResult(null); // Clear the search result
      setIsAlreadyFriend(false); // Reset the friend status
    }
  };

  return (
    <div className="search-container" style={{ display: "flex", backgroundColor: "black", color: "white", minHeight: "100vh" }}>
      {/* Left Section: Search Box */}
      <div style={{ flex: 1, padding: "20px" }}>
        <h1 className="text-3xl font-bold text-center">Search</h1>
        <div className="search-bar" style={{ maxWidth: "400px", margin: "20px auto" }}>
          <input
            type="text"
            placeholder="Search by name, email, or phone"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%", padding: "10px", margin: "10px 0" }}
          />
          <button
            onClick={handleSearch}
            style={{
              backgroundColor: "#4a90e2",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              width: "100%",
            }}
          >
            Search
          </button>
        </div>
        {searchResult && !viewProfile && (
          <div
            className="search-result"
            style={{
              marginTop: "20px",
              padding: "20px",
              backgroundColor: "#1a1a1a",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
              maxWidth: "400px",
              margin: "20px auto",
            }}
          >
            <h2 className="text-2xl font-bold text-center mb-4">Profile</h2>
            <p><strong>Name:</strong> {searchResult.name}</p>
            <p><strong>Email:</strong> {searchResult.email}</p>
            <p><strong>Phone:</strong> {searchResult.phone}</p>
            <p><strong>Nationality:</strong> {searchResult.nationality}</p>
            <p><strong>Friends:</strong> {searchResult.friends}</p>
            <div style={{ display: "flex", gap: "10px", marginTop: "10px", justifyContent: "center" }}>
              <button
                onClick={() => setViewProfile(true)}
                style={{
                  backgroundColor: "#4a90e2",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                View Profile
              </button>
              {isAlreadyFriend ? (
                <button
                  onClick={handleRemoveFriend}
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Remove Friend
                </button>
              ) : (
                <button
                  onClick={handleAddFriend}
                  style={{
                    backgroundColor: "#4a90e2",
                    color: "white",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Add Friend
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right Section: Profile Sidebar */}
      {viewProfile && searchResult && (
        <div
          className="profile-sidebar"
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
            src={searchResult.profilePhoto || "https://via.placeholder.com/150"}
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
          <p><strong>Name:</strong> {searchResult.name}</p>
          <p><strong>Email:</strong> {searchResult.email}</p>
          <p><strong>Phone:</strong> {searchResult.phone}</p>
          <p><strong>Nationality:</strong> {searchResult.nationality}</p>
          <p><strong>Friends:</strong> {searchResult.friends || 0}</p>
        </div>
      )}
    </div>
  );
};

export default Search;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
//import "./Create.css"; // Import CSS for styling
import { useEffect } from "react";

const Create = () => {
  const [postType, setPostType] = useState("text"); // State to track the type of post
  const [content, setContent] = useState(""); // State to track the content of the post
  const [image, setImage] = useState(null); // State to track the uploaded image
  const [link, setLink] = useState(""); // State to track the link
  const [isProjectRelated, setIsProjectRelated] = useState(false); // State to track if the post is project-related
  const navigate = useNavigate();

  const handlePostSubmit = (e) => {
    e.preventDefault();

    // Retrieve existing posts from localStorage or initialize an empty array
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // Create a new post object
    const newPost = {
      id: Date.now(),
      type: postType,
      content: postType === "text" ? content : postType === "image" ? image : link,
      createdAt: new Date().toLocaleString(),
      authorEmail: currentUser.email,
      authorName: currentUser.name,
      isProjectRelated,
    };

    // Add the new post to the posts array
    posts.push(newPost);

    // Save the updated posts array back to localStorage
    localStorage.setItem("posts", JSON.stringify(posts));

    // Update the current user's post and project counts
    const updatedUser = {
      ...currentUser,
      posts: (currentUser.posts || 0) + 1,
      projects: isProjectRelated ? (currentUser.projects || 0) + 1 : currentUser.projects || 0,
    };

    // Save the updated user back to localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map((user) => (user.email === currentUser.email ? updatedUser : user));
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    alert("Post created successfully!");
    navigate("/profile"); // Redirect to the profile page after creating the post
  };

  return (
    <div
      className="create-container"
      style={{
        backgroundColor: "black",
        minHeight: "100vh",
        padding: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="create-box"
        style={{
          backgroundColor: "#1a1a1a",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
          width: "400px",
        }}
      >
        <h1 className="text-3xl font-bold text-center" style={{ marginBottom: "20px", color: "#4a90e2" }}>
          Create a New Post
        </h1>
        <form onSubmit={handlePostSubmit}>
          {/* Post Type Selector */}
          <div className="form-group" style={{ marginBottom: "20px" }}>
            <label style={{ fontWeight: "bold", marginBottom: "10px", display: "block", color: "white" }}>
              Select Post Type:
            </label>
            <select
              value={postType}
              onChange={(e) => setPostType(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                backgroundColor: "#333",
                color: "white",
              }}
            >
              <option value="text">Text</option>
              <option value="image">Image</option>
              <option value="link">Link</option>
            </select>
          </div>

          {/* Post Content */}
          {postType === "text" && (
            <div className="form-group" style={{ marginBottom: "20px" }}>
              <label style={{ fontWeight: "bold", marginBottom: "10px", display: "block", color: "white" }}>
                Enter Text:
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write something..."
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  backgroundColor: "#333",
                  color: "white",
                  minHeight: "100px",
                }}
                required
              ></textarea>
            </div>
          )}

          {postType === "image" && (
            <div className="form-group" style={{ marginBottom: "20px" }}>
              <label style={{ fontWeight: "bold", marginBottom: "10px", display: "block", color: "white" }}>
                Upload Image:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  backgroundColor: "#333",
                  color: "white",
                }}
                required
              />
              {image && (
                <img
                  src={image}
                  alt="Preview"
                  style={{
                    marginTop: "10px",
                    width: "100%",
                    borderRadius: "5px",
                  }}
                />
              )}
            </div>
          )}

          {postType === "link" && (
            <div className="form-group" style={{ marginBottom: "20px" }}>
              <label style={{ fontWeight: "bold", marginBottom: "10px", display: "block", color: "white" }}>
                Enter Link:
              </label>
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://example.com"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  backgroundColor: "#333",
                  color: "white",
                }}
                required
              />
            </div>
          )}

          {/* Project-Related Checkbox */}
          <div className="form-group" style={{ marginBottom: "20px" }}>
            <label style={{ fontWeight: "bold", marginBottom: "10px", display: "block", color: "white" }}>
              Is this post project-related?
            </label>
            <input
              type="checkbox"
              checked={isProjectRelated}
              onChange={(e) => setIsProjectRelated(e.target.checked)}
              style={{
                marginRight: "10px",
              }}
            />
            <span style={{ color: "white" }}>Yes</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              backgroundColor: "#4a90e2",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              width: "100%",
              fontSize: "16px",
            }}
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default Create;
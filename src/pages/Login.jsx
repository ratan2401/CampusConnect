import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css"; // Import CSS for styling


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the email and password fields when the component is mounted
    setEmail("");
    setPassword("");
    setError(""); // Clear any previous error messages
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    // Retrieve all registered users from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Find the user with the matching email and password
    const loggedInUser = users.find(
      (user) => user.email === email && user.password === password
    );

    if (loggedInUser) {
      // Set the current user in localStorage
      localStorage.setItem("currentUser", JSON.stringify(loggedInUser));

      // Navigate to the home page if credentials match
      navigate("/home");
    } else {
      // Show error message if credentials don't match
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="login-container" style={{ backgroundColor: "black", color: "white", minHeight: "100vh", padding: "20px" }}>
      <h1 className="text-3xl font-bold text-center">Login</h1>
      <form
        className="login-form"
        style={{ maxWidth: "400px", margin: "20px auto" }}
        onSubmit={handleLogin}
      >
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "10px", margin: "10px 0" }}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "10px", margin: "10px 0" }}
            required
          />
        </div>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
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
          }}
        >
          Login
        </button>
      </form>
      <p className="text-center">
        Don't have an account? <Link to="/register" style={{ color: "#4a90e2" }}>Register</Link>
      </p>
    </div>
  );
};

export default Login;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
//import "./Register.css"; // Import CSS for styling

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [nationality, setNationality] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    // Retrieve existing users from localStorage or initialize an empty array
    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

    // Check if the email is already registered
    const isEmailRegistered = existingUsers.some((user) => user.email === email);
    if (isEmailRegistered) {
      alert("This email is already registered. Please use a different email.");
      return;
    }

    // Create a new user object with friends, posts, and projects initialized to 0
    const newUser = { 
      name, 
      email, 
      password, 
      phone, 
      nationality, 
      friends: 0, 
      posts: 0, 
      projects: 0 
    };

    // Add the new user to the array of users
    existingUsers.push(newUser);

    // Save the updated array back to localStorage
    localStorage.setItem("users", JSON.stringify(existingUsers));

    // Navigate to the login page after registration
    navigate("/login");
  };

  return (
    <div className="register-container" style={{ backgroundColor: "black", color: "white", minHeight: "100vh", padding: "20px" }}>
      <h1 className="text-3xl font-bold text-center">Register</h1>
      <form
        className="register-form"
        style={{ maxWidth: "400px", margin: "20px auto" }}
        onSubmit={handleRegister}
      >
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: "10px", margin: "10px 0" }}
            required
          />
        </div>
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
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ width: "100%", padding: "10px", margin: "10px 0" }}
            required
          />
        </div>
        <div className="form-group">
          <label>Nationality:</label>
          <input
            type="text"
            placeholder="Enter your nationality"
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            style={{ width: "100%", padding: "10px", margin: "10px 0" }}
            required
          />
        </div>
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
          Register
        </button>
      </form>
      <p className="text-center">
        Already have an account? <Link to="/login" style={{ color: "#4a90e2" }}>Login</Link>
      </p>
    </div>
  );
};

export default Register;
import  {  useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CampusConnect.css";
import experienceImage from "../assets/experience.jpg";
import globeImage from "../assets/globe.png";
import connectImage from "../assets/connect.png";
import axios from "axios";
import { useAuth } from "../context/authContext";
const CampusConnect = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const { token, setToken, user } = useAuth();

  const handleRegister = async () => {
    //setError("");
    try {
      const username = document.querySelector(
        'input[placeholder="Username"]'
      ).value;
      const email = document.querySelector('input[placeholder="Email"]').value;
      const password = document.querySelector(
        'input[placeholder="Password"]'
      ).value;

      const res = await axios.post("http://localhost:3000/api/auth/register", {
        username,
        email,
        password,
      });

      if (res.status === 201) {
        alert("Registered successfully!");
        setIsRegistering(false);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
      
    }
  };

  const handleLogin = async () => {
    try {
      const email = document.querySelector('input[placeholder="Email"]').value;
      const password = document.querySelector(
        'input[placeholder="Password"]'
      ).value;

      const res = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password,
      });

      
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
       
        
      }
    } catch (error) {
      
      alert(error.response?.data?.message || "Login failed");
      
    }
  };
  useEffect(() => {
    if (token && user.username) {
      navigate(`/home/${user.username}`);
    }
  },[token,user]);

  const handleJoinClick = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setIsRegistering(false);
  };

  return (
    <div className="CampusConnect-container bg-gray-900">
      {/* Header */}
      <header className="CampusConnect-header">
        <h1 className="CampusConnect-title">CampusConnect</h1>
        <p className="CampusConnect-tagline">Your Journey, Our Community.</p>
      </header>

      {/* Main Content */}
      <main className="CampusConnect-main">
        <section className="frameset">
          <div className="frame">
            <img
              src={experienceImage}
              alt="Experience"
              className="frame-image small-image"
            />
            <div className="frame-overlay">
              <h3>Share Your Journey</h3>
            </div>
          </div>
          <div className="frame">
            <img
              src={globeImage}
              alt="Global"
              className="frame-image small-image"
            />
            <div className="frame-overlay">
              <h3>Connect Globally</h3>
            </div>
          </div>
          <div className="frame">
            <img
              src={connectImage}
              alt="Connect"
              className="frame-image small-image"
            />
            <div className="frame-overlay">
              <h3>Inspire Others</h3>
            </div>
          </div>
        </section>

        {/* Description */}
        <section className="CampusConnect-description">
          <p className="font-[200] text-[30px]" align="center">
            CampusConnect is your platform to share experiences, connect with
            inspiring people, and discover amazing stories. Your journey matters
            here.
          </p>
        </section>

        {/* CTA */}
        <section className="CampusConnect-cta">
          <center>
            <button className="cta-button" onClick={handleJoinClick}>
              🚀 Join Now
            </button>
          </center>
        </section>
      </main>

      {/* Footer */}
      <footer className="CampusConnect-footer">
        © 2025 CampusConnect. All rights reserved.
      </footer>

      {/* Modal Popup */}
      {showModal && (
        <div className="modal-overlay ">
          <div className="modal-content ">
            <button className="close-button" onClick={handleCloseModal}>
              ✖
            </button>
            <h2>{isRegistering ? "Register" : "Login"} to CampusConnect</h2>

            {isRegistering && (
              <input
                type="text"
                placeholder="Username"
                className="modal-input"
              />
            )}

            <input type="email" placeholder="Email" className="modal-input" />
            <input
              type="password"
              placeholder="Password"
              className="modal-input"
            />

            <button
              onClick={isRegistering ? handleRegister : handleLogin}
              className="modal-button"
            >
              {isRegistering ? "Register" : "Login"}
            </button>

            <p
              style={{ marginTop: "15px", cursor: "pointer", fontSize: "14px" }}
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering
                ? "Already have an account? Login"
                : "Don't have an account? Register"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampusConnect;

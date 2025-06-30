import React from "react";
import "./ErrorPage.css";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="error-page">
      <h1 className="error-code">404</h1>
      <p className="error-message">Oops! The page you're looking for doesn't exist.</p>
      <button className="home-button" onClick={goHome}>
        Go Back Home
      </button>
    </div>
  );
};

export default ErrorPage;

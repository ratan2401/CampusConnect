import React from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../context/authContext";

const Protected = ({ children }) => {
    const { token } = useAuth();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default Protected;

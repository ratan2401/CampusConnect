const jwt = require("jsonwebtoken");
const authModel = require("../models/userModel");

const authMiddleware = async(req, res, next) => {
  //console.log("req",req);
  const authHeader = req.headers.token;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing or invalid" });
  }

  const token = authHeader.split(" ")[1];
  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = await authModel.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;

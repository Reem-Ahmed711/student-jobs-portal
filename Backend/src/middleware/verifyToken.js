// D:\student-jobs-portal\Backend\src\middleware\verifyToken.js
const { admin } = require("../config/firebase");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    
    console.log("Decoded token UID:", decoded.uid); // للتأكد
    
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      role: decoded.role || "student",
    };

    next();
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = verifyToken;
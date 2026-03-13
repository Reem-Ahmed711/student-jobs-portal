const admin = require("firebase-admin");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded; 
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = verifyToken;
const admin = require("firebase-admin");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split("Bearer ")[1];

  admin
    .auth()
    .verifyIdToken(token)
    .then((decoded) => {
      req.user = decoded;
      next();
    })
    .catch(() => {
      return res.status(401).json({ message: "Invalid token" });
    });
};

module.exports = verifyToken;
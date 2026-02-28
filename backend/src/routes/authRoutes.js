const express = require("express");
const router = express.Router();

const { registerUser, loginUser } = require("../auth/authService"); 
const verifyToken = require("../middleware/verifyToken");


// ✅ Register
router.post("/register", async (req, res) => {
  try {
    const result = await registerUser(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// ✅ Login
router.post("/login", async (req, res) => {
  try {
    const result = await loginUser(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// ✅ Get current user
router.get("/me", verifyToken, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
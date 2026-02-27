const express = require("express");
const router = express.Router();

const { loginUser } = require("../auth/authService"); 
const verifyTokenMiddleware = require("../middleware/verifyToken");


router.post("/login", async (req, res) => {
  try {
    const result = await loginUser(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.get("/profile", verifyTokenMiddleware, async (req, res) => {
 
  res.json(req.user);
});

module.exports = router;
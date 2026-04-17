const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../auth/authService");

router.post("/register", async (req, res) => {
  try {
    let userData = req.body;

    if (userData.username) {
      userData.name = userData.username;
      delete userData.username;
    }

    const result = await registerUser(userData);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const result = await loginUser(req.body);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;

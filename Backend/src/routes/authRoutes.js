const express = require("express");
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  googleLogin,
  linkedinLogin,
  forgotPassword,
  resetPassword,
  verifyToken,
  updateUserProfile
} = require("../auth/authService");
const verifyTokenMiddleware = require("../middleware/verifyToken");

router.post("/register", async (req, res) => {
  try {
     //console.log(req.body);
     console.log(admin.apps.length);
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const result = await loginUser(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/google", async (req, res) => {
  try {
    const { idToken } = req.body;
    const result = await googleLogin(idToken);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/linkedin", async (req, res) => {
  try {
    const { accessToken, profileData } = req.body;
    const result = await linkedinLogin(accessToken, profileData);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const result = await forgotPassword(email);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/google", async (req, res) => {
  try {
    const { idToken } = req.body;
    const result = await googleLogin(idToken);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/linkedin", async (req, res) => {
  try {
    const { accessToken, profileData } = req.body;
    const result = await linkedinLogin(accessToken, profileData);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const result = await forgotPassword(email);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { oobCode, newPassword } = req.body;
    const result = await resetPassword(oobCode, newPassword);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/profile", verifyTokenMiddleware, async (req, res) => {
  try {
    const result = await verifyToken(req.headers.authorization?.split("Bearer ")[1]);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

router.put("/profile", verifyTokenMiddleware, async (req, res) => {
  try {
    const result = await updateUserProfile(req.user.uid, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const { admin } = require('../config/firebase');
const { registerUser, loginUser } = require("../auth/authService");
const verifyTokenMiddleware = require("../middleware/verifyToken");
const axios = require("axios");
const multer = require('multer');
const { uploadProfileImage, deleteProfileImage } = require('../services/storageService');

const db = admin.firestore();

// Multer configuration for file upload
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'), false);
    }
  }
});

// Register
router.post("/register", async (req, res) => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error("Register route error:", error.message);
    res.status(400).json({ success: false, error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const result = await loginUser(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get profile
router.get("/profile", verifyTokenMiddleware, async (req, res) => {
  try {
    const uid = req.user.uid;
    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists) return res.status(404).json({ error: "User not found" });
    res.json({ uid, ...userDoc.data() });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Update profile
router.put("/profile", verifyTokenMiddleware, async (req, res) => {
  try {
    const uid = req.user.uid;
    const updateData = req.body;
    delete updateData.uid;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    
    await db.collection("users").doc(uid).update({
      ...updateData,
      updatedAt: new Date().toISOString()
    });
    
    const updatedDoc = await db.collection("users").doc(uid).get();
    res.json({ success: true, user: { uid, ...updatedDoc.data() } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user (me)
router.get("/me", verifyTokenMiddleware, async (req, res) => {
  try {
    const uid = req.user.uid;
    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists) return res.status(404).json({ error: "User not found" });
    res.json({ success: true, user: { uid, ...userDoc.data() } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Forgot password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const API_KEY = process.env.FIREBASE_API_KEY || "AIzaSyCD3-s0qrIQ4oIgI8T3r7_HnbMSO1Z6K1s";
    await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${API_KEY}`,
      { email, requestType: "PASSWORD_RESET" }
    );
    res.json({ success: true, message: "Reset email sent" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Upload profile image
router.post("/upload-image", verifyTokenMiddleware, upload.single('profileImage'), async (req, res) => {
  try {
    const { uid } = req.user;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const result = await uploadProfileImage(uid, file);
    
    if (result.success) {
      await db.collection("users").doc(uid).update({
        profileImage: result.url,
        updatedAt: new Date().toISOString()
      });
      res.json({ success: true, url: result.url });
    } else {
      res.status(500).json({ error: result.message });
    }
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete profile image
router.delete("/profile-image", verifyTokenMiddleware, async (req, res) => {
  try {
    const { uid } = req.user;
    
    const result = await deleteProfileImage(uid);
    
    if (result.success) {
      await db.collection("users").doc(uid).update({
        profileImage: null,
        updatedAt: new Date().toISOString()
      });
      res.json({ success: true, message: result.message });
    } else {
      res.status(500).json({ error: result.message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get profile image
router.get("/profile-image", verifyTokenMiddleware, async (req, res) => {
  try {
    const { uid } = req.user;
    const userDoc = await db.collection("users").doc(uid).get();
    const profileImage = userDoc.data()?.profileImage || null;
    res.json({ success: true, profileImage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

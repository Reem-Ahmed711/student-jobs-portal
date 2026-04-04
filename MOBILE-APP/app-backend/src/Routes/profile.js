const express = require("express");
const router = express.Router();

const {
  getProfile,
  getAllProfiles,
  createProfile,
  updateProfile,
  deleteProfile,
} = require("../Controllers/profileController");

// 🟢 GET all users
router.get("/profiles", getAllProfiles);

// 🟢 GET single profile
router.get("/profile/:id", getProfile);

// 🟡 POST create profile
router.post("/profile", createProfile);

// 🔵 PUT update profile
router.put("/profile/:id", updateProfile);

// 🔴 DELETE profile
router.delete("/profile/:id", deleteProfile);

module.exports = router;

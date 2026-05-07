// MOBILE-APP/app-backend/src/Routes/studentRoute.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const {
  updateProfile,
  getProfile,
} = require("../Controllers/studentController");

router.use(verifyToken);

// get profile
router.get("/profile", getProfile);

// update profile
router.put("/profile", updateProfile);

module.exports = router;

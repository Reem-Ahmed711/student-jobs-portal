// MOBILE-APP/app-backend/src/Routes/cvRoute.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const {
  uploadAndParseCV,
  uploadMiddleware,
} = require("../Controllers/cvController");

router.use(verifyToken);

// رفع وتحليل السيرة الذاتية
router.post("/upload-cv", uploadMiddleware, uploadAndParseCV);

module.exports = router;

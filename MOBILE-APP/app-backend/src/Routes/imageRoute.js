// MOBILE-APP/app-backend/src/Routes/imageRoute.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const {
  uploadImage,
  getUserImages,
  deleteImage,
} = require("../Controllers/imageController");

router.use(verifyToken);

router.post("/upload", uploadImage);

router.get("/user/:userId", getUserImages);

router.delete("/:imageId", deleteImage);

module.exports = router;

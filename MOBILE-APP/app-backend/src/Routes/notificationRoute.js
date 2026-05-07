// MOBILE-APP/app-backend/src/Routes/notificationRoute.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const {
  registerPushToken,
  testNotification,
} = require("../Controllers/notificationController");

router.use(verifyToken);

router.post("/register-token", registerPushToken);
router.post("/test", testNotification);

module.exports = router;

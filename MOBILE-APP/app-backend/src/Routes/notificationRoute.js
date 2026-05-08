// MOBILE-APP/app-backend/src/Routes/notificationRoute.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const {
  registerPushToken,
  testNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadNotificationsCount,
} = require("../Controllers/notificationController");

router.use(verifyToken);

router.post("/register-token", registerPushToken);
router.post("/test", testNotification);
router.get("/", getNotifications);
router.get("/unread/count", getUnreadNotificationsCount);
router.put("/:notificationId/read", markAsRead);
router.put("/read-all", markAllAsRead);

module.exports = router;
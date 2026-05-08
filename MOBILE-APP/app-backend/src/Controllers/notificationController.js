// MOBILE-APP/app-backend/src/Controllers/notificationController.js
const {
  savePushToken,
  sendNotificationToStudent,
  getStudentNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadCount,
} = require("../Service/notificationService");
const { requireStudent } = require("../auth/roleGuard");

// حفظ توكن الإشعار
const registerPushToken = async (req, res) => {
  try {
    await requireStudent(req.user.uid);
    const { pushToken } = req.body;

    if (!pushToken) {
      return res
        .status(400)
        .json({ success: false, message: "Push token is required" });
    }

    const result = await savePushToken(req.user.uid, pushToken);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// جلب جميع إشعارات الطالب
const getNotifications = async (req, res) => {
  try {
    await requireStudent(req.user.uid);
    const { limit } = req.query;
    const result = await getStudentNotifications(req.user.uid, limit ? parseInt(limit) : 50);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// تحديد إشعار كمقروء
const markAsRead = async (req, res) => {
  try {
    await requireStudent(req.user.uid);
    const { notificationId } = req.params;
    const result = await markNotificationAsRead(req.user.uid, notificationId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// تحديد كل الإشعارات كمقروءة
const markAllAsRead = async (req, res) => {
  try {
    await requireStudent(req.user.uid);
    const result = await markAllNotificationsAsRead(req.user.uid);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// جلب عدد الإشعارات غير المقروءة
const getUnreadNotificationsCount = async (req, res) => {
  try {
    await requireStudent(req.user.uid);
    const result = await getUnreadCount(req.user.uid);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// إرسال إشعار تجريبي (للتجربة فقط)
const testNotification = async (req, res) => {
  try {
    await requireStudent(req.user.uid);
    const { title, body, type } = req.body;
    const result = await sendNotificationToStudent(
      req.user.uid,
      title || "🎉 مرحباً!",
      body || "هذه رسالة تجريبية من التطبيق",
      type || "general",
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  registerPushToken,
  testNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadNotificationsCount,
};
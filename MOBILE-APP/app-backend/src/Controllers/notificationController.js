// MOBILE-APP/app-backend/src/Controllers/notificationController.js
const {
  savePushToken,
  sendNotificationToStudent,
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

// إرسال إشعار تجريبي (للتجربة فقط)
const testNotification = async (req, res) => {
  try {
    await requireStudent(req.user.uid);
    const result = await sendNotificationToStudent(
      req.user.uid,
      "🎉 مرحباً!",
      "هذه رسالة تجريبية من التطبيق",
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  registerPushToken,
  testNotification,
};

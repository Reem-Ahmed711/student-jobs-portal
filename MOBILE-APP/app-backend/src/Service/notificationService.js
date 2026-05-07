// MOBILE-APP/app-backend/src/Service/notificationService.js
const { admin, db } = require("../firebase");

// إرسال إشعار لطالب معين
const sendNotificationToStudent = async (
  studentUid,
  title,
  body,
  data = {},
) => {
  try {
    // جلب توكن الإشعار الخاص بالطالب
    const userDoc = await db.collection("users").doc(studentUid).get();
    const pushToken = userDoc.data()?.expoPushToken;

    if (!pushToken) {
      console.log(`No push token for student: ${studentUid}`);
      return { success: false, message: "No push token found" };
    }

    // إرسال الإشعار عبر خدمة Expo
    const message = {
      to: pushToken,
      sound: "default",
      title: title,
      body: body,
      data: data,
    };

    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error("Error sending notification:", error);
    return { success: false, message: error.message };
  }
};

// إرسال إشعار لجميع الطلاب
const sendNotificationToAllStudents = async (title, body, data = {}) => {
  try {
    // جلب جميع الطلاب الذين لديهم push token
    const studentsSnapshot = await db
      .collection("users")
      .where("role", "==", "student")
      .get();

    const messages = [];
    studentsSnapshot.forEach((doc) => {
      const pushToken = doc.data().expoPushToken;
      if (pushToken) {
        messages.push({
          to: pushToken,
          sound: "default",
          title: title,
          body: body,
          data: data,
        });
      }
    });

    // إرسال الإشعارات (Expo تقبل حتى 100 إشعار في الطلب الواحد)
    const chunks = [];
    for (let i = 0; i < messages.length; i += 100) {
      chunks.push(messages.slice(i, i + 100));
    }

    const results = [];
    for (const chunk of chunks) {
      const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chunk),
      });
      results.push(await response.json());
    }

    return { success: true, data: results };
  } catch (error) {
    console.error("Error sending notifications:", error);
    return { success: false, message: error.message };
  }
};

// حفظ توكن الإشعار للطالب
const savePushToken = async (studentUid, pushToken) => {
  try {
    await db.collection("users").doc(studentUid).update({
      expoPushToken: pushToken,
      pushTokenUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error saving push token:", error);
    return { success: false, message: error.message };
  }
};

module.exports = {
  sendNotificationToStudent,
  sendNotificationToAllStudents,
  savePushToken,
};

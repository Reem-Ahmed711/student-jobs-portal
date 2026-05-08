// MOBILE-APP/app-backend/src/Service/notificationService.js
const { admin, db } = require("../firebase");

// حفظ إشعار في قاعدة البيانات
const saveNotificationToDB = async (studentUid, title, body, type, data = {}) => {
  try {
    const notificationRef = db.collection("notifications").doc();
    await notificationRef.set({
      id: notificationRef.id,
      studentUid,
      title,
      body,
      type, // application, job_match, interview, message, deadline, profile
      data,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { success: true, notificationId: notificationRef.id };
  } catch (error) {
    console.error("Error saving notification to DB:", error);
    return { success: false, message: error.message };
  }
};

// جلب إشعارات الطالب
const getStudentNotifications = async (studentUid, limit = 50) => {
  try {
    const snapshot = await db
      .collection("notifications")
      .where("studentUid", "==", studentUid)
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();

    const notifications = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      notifications.push({
        id: doc.id,
        title: data.title,
        body: data.body,
        type: data.type,
        read: data.read || false,
        createdAt: data.createdAt,
        data: data.data || {},
      });
    });

    return { success: true, notifications };
  } catch (error) {
    console.error("Error getting notifications:", error);
    return { success: false, notifications: [], message: error.message };
  }
};

// تحديث حالة الإشعار (قراءة)
const markNotificationAsRead = async (studentUid, notificationId) => {
  try {
    const notificationRef = db.collection("notifications").doc(notificationId);
    const notificationDoc = await notificationRef.get();

    if (!notificationDoc.exists) {
      return { success: false, message: "Notification not found" };
    }

    if (notificationDoc.data().studentUid !== studentUid) {
      return { success: false, message: "Access denied" };
    }

    await notificationRef.update({
      read: true,
      readAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return { success: false, message: error.message };
  }
};

// تحديد كل الإشعارات كمقروءة
const markAllNotificationsAsRead = async (studentUid) => {
  try {
    const snapshot = await db
      .collection("notifications")
      .where("studentUid", "==", studentUid)
      .where("read", "==", false)
      .get();

    const batch = db.batch();
    snapshot.forEach((doc) => {
      batch.update(doc.ref, { read: true, readAt: admin.firestore.FieldValue.serverTimestamp() });
    });
    await batch.commit();

    return { success: true, count: snapshot.size };
  } catch (error) {
    console.error("Error marking all as read:", error);
    return { success: false, message: error.message };
  }
};

// إرسال إشعار لطالب معين (Push + Save to DB)
const sendNotificationToStudent = async (studentUid, title, body, type = "general", data = {}) => {
  try {
    // 1. حفظ الإشعار في قاعدة البيانات
    await saveNotificationToDB(studentUid, title, body, type, data);

    // 2. جلب توكن الإشعار الخاص بالطالب
    const userDoc = await db.collection("users").doc(studentUid).get();
    const pushToken = userDoc.data()?.expoPushToken;

    if (!pushToken) {
      console.log(`No push token for student: ${studentUid}`);
      return { success: true, message: "Saved to DB only, no push token" };
    }

    // 3. إرسال الإشعار عبر خدمة Expo
    const message = {
      to: pushToken,
      sound: "default",
      title: title,
      body: body,
      data: { type, ...data },
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
    return { success: true, data: result, savedToDB: true };
  } catch (error) {
    console.error("Error sending notification:", error);
    return { success: false, message: error.message };
  }
};

// إرسال إشعار لجميع الطلاب
const sendNotificationToAllStudents = async (title, body, type = "general", data = {}) => {
  try {
    // جلب جميع الطلاب
    const studentsSnapshot = await db
      .collection("users")
      .where("role", "==", "student")
      .get();

    const messages = [];
    const students = [];

    studentsSnapshot.forEach((doc) => {
      const pushToken = doc.data().expoPushToken;
      const studentUid = doc.id;
      students.push(studentUid);
      
      // حفظ الإشعار في DB لكل طالب
      saveNotificationToDB(studentUid, title, body, type, data);
      
      if (pushToken) {
        messages.push({
          to: pushToken,
          sound: "default",
          title: title,
          body: body,
          data: { type, ...data },
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

    return { success: true, data: results, studentsCount: students.length };
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

// جلب عدد الإشعارات غير المقروءة
const getUnreadCount = async (studentUid) => {
  try {
    const snapshot = await db
      .collection("notifications")
      .where("studentUid", "==", studentUid)
      .where("read", "==", false)
      .get();

    return { success: true, count: snapshot.size };
  } catch (error) {
    console.error("Error getting unread count:", error);
    return { success: false, count: 0 };
  }
};

module.exports = {
  sendNotificationToStudent,
  sendNotificationToAllStudents,
  savePushToken,
  getStudentNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadCount,
  saveNotificationToDB,
};
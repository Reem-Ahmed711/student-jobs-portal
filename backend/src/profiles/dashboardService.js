const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
// استدعاء ملف الـ controller اللي لسه معدلينه فوق
const dashboardController = require("../controllers/dashboardController"); 

// السطر ده هو اللي كان بيطلع الـ TypeError لأنه كان بينادي اسم غلط
router.get("/users", verifyToken, dashboardController.getAllUsers);

module.exports = router;

async function updateProfile(uid, data) {
  try {
    await admin.firestore().collection("users").doc(uid).update({
      ...data,
      updatedAt: new Date().toISOString(),
    });
    return { message: "Profile updated successfully" };
  } catch (error) {
    throw new Error(error.message);
  }
}

// التصدير الصح عشان الـ require تشتغل
module.exports = { getProfile, updateProfile };
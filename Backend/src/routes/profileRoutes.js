// D:\student-jobs-portal\Backend\src\routes\profileRoutes.js
const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");

const {
  getProfile,
  updateProfile
} = require("../services/profileService");

const {
  uploadAndSaveProfileImage
} = require("../Controllers/profileControl");

const {
  getUserRole,
  getUserProfile,
  updateUserProfile,
  deleteUser
} = require("../auth/roleGuard");

// GET profile - الحصول على معلومات المستخدم
router.get("/", verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    console.log("GET Profile - UID:", uid);
    
    if (!uid) {
      return res.status(400).json({ success: false, message: "UID not found in token" });
    }
    
    const result = await getProfile(uid);
    return res.status(result.success ? 200 : 404).json(result);

  } catch (error) {
    console.error("GET Profile Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// UPDATE profile - تحديث معلومات المستخدم
router.put("/", verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    console.log("PUT Profile - UID:", uid);
    console.log("PUT Profile - Body:", req.body);
    
    if (!uid) {
      return res.status(400).json({ success: false, message: "UID not found in token" });
    }
    
    const updatedData = req.body;
    
    // إزالة أي حقول لا نريد تحديثها
    delete updatedData.uid;
    delete updatedData.id;
    delete updatedData.createdAt;
    
    const result = await updateProfile(uid, updatedData);
    return res.status(result.success ? 200 : 400).json(result);

  } catch (error) {
    console.error("PUT Profile Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE user - حذف مستخدم (للأدمن فقط)
router.delete("/", verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    console.log("DELETE User - UID:", uid);
    
    if (!uid) {
      return res.status(400).json({ success: false, message: "UID not found in token" });
    }
    
    const role = await getUserRole(uid);

    if (role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can delete users"
      });
    }

    const targetUid = req.body.targetUid || req.query.uid;
    
    if (!targetUid) {
      return res.status(400).json({
        success: false,
        message: "targetUid is required"
      });
    }

    const result = await deleteUser(uid, targetUid);
    return res.status(result.success ? 200 : 400).json(result);

  } catch (error) {
    console.error("DELETE User Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Upload profile image
router.post("/upload", verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    console.log("Upload Image - UID:", uid);
    
    if (!uid) {
      return res.status(400).json({ success: false, message: "UID not found in token" });
    }
    
    if (!req.files || !req.files.profileImage) {
      return res.status(400).json({
        success: false,
        message: "No image file provided"
      });
    }

    const file = req.files.profileImage;
    const result = await uploadAndSaveProfileImage(uid, file);
    return res.status(result.success ? 200 : 400).json(result);

  } catch (error) {
    console.error("Upload Image Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
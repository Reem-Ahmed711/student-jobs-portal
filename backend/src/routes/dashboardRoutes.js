const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const admin = require("firebase-admin");

// تعريف قاعدة البيانات مباشرة من الأدمن عشان نتفادى خطأ الـ undefined
const db = admin.firestore();

// الدالة الأساسية لجلب المستخدمين
const getAllUsers = async (req, res) => {
  try {
    // 1. التأكد من أن اللي باعت الريكوست "admin"
    // ملاحظة: req.user بيتم تعريفه جوه الـ verifyToken middleware
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ 
        success: false, 
        message: "Access denied: Admins only" 
      });
    }

    // 2. جلب البيانات من مجموعة users في Firestore
    const usersSnapshot = await db.collection('users').get();
    
    // تحويل البيانات لشكل JSON مفهوم
    const users = usersSnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));

    // 3. الرد بنجاح وإرسال لستة المستخدمين
    res.status(200).json({ 
      success: true, 
      count: users.length,
      data: users 
    });

  } catch (error) {
    // لو حصل أي خطأ في السيرفر أو الفايربيز
    res.status(500).json({ 
      success: false, 
      message: "Server Error: " + error.message 
    });
  }
};

// تعريف الرابط (Route) وربطه بالـ Middleware والدالة
router.get("/users", verifyToken, getAllUsers);

module.exports = router;
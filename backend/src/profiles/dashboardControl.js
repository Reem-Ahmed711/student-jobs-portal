const { db } = require('../config/firebase'); // تأكدي من مسار ملف الفايربيز عندك

exports.getAllUsers = async (req, res) => {
  try {
    // 1. التأكد من صلاحية الأدمن (بتيجي من الـ Middleware)
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied: Admins only" });
    }

    // 2. جلب البيانات من Firestore
    const usersSnapshot = await db.collection('users').get();
    const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // 3. إرسال الرد لـ Postman
    res.status(200).json({ 
      success: true, 
      count: users.length,
      data: users 
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
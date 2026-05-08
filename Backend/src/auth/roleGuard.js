// MOBILE-APP/app-backend/src/auth/roleGuard.js
const { admin, db } = require("../config/firebase");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@university.edu";

const getUserRole = async (uid) => {
  const docRef = admin.firestore().collection("users").doc(uid);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    throw new Error("User not found");
  }

  return docSnap.data().role;
};

const requireStudent = async (uid) => {
  const role = await getUserRole(uid);
  if (role !== "student") {
    throw new Error("Access denied: student only");
  }
  return true;
};

const requireEmployer = async (uid) => {
  const role = await getUserRole(uid);
  if (role !== "employer") {
    throw new Error("Access denied: employer only");
  }
  return true;
};

const requireAdmin = async (uid) => {
  const docRef = admin.firestore().collection("users").doc(uid);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    throw new Error("User not found");
  }

  const userData = docSnap.data();
  const isMainAdmin = userData.email === ADMIN_EMAIL;
  const hasAdminRole = userData.role === "admin";

  if (!isMainAdmin && !hasAdminRole) {
    throw new Error("Access denied: admin only");
  }

  return true;
};

const isMainAdmin = async (uid) => {
  const docRef = admin.firestore().collection("users").doc(uid);
  const docSnap = await docRef.get();

  if (!docSnap.exists) return false;

  return docSnap.data().email === ADMIN_EMAIL;
};

const requireMainAdmin = async (uid) => {
  const docRef = admin.firestore().collection("users").doc(uid);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    throw new Error("User not found");
  }

  if (docSnap.data().email !== ADMIN_EMAIL) {
    throw new Error("Access denied: main admin only");
  }

  return true;
};


// جلب بروفايل المستخدم (للمستخدم نفسه أو للأدمن)
const getUserProfile = async (requesterUid, targetUid) => {
  try {
    const requesterRole = await getUserRole(requesterUid);
    
    // الأدمن يقدر يشوف أي مستخدم
    if (requesterRole === "admin") {
      const userDoc = await db.collection("users").doc(targetUid).get();
      if (!userDoc.exists) {
        return { success: false, message: "User not found" };
      }
      return { success: true, data: { id: userDoc.id, ...userDoc.data() } };
    }
    
    // غير الأدمن يقدر يشوف بس نفسه
    if (requesterUid !== targetUid) {
      return { success: false, message: "Access denied" };
    }
    
    const userDoc = await db.collection("users").doc(targetUid).get();
    if (!userDoc.exists) {
      return { success: false, message: "User not found" };
    }
    return { success: true, data: { id: userDoc.id, ...userDoc.data() } };
    
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// تحديث بروفايل المستخدم (للمستخدم نفسه أو للأدمن)
const updateUserProfile = async (requesterUid, targetUid, updatedData) => {
  try {
    const requesterRole = await getUserRole(requesterUid);
    
    // منع تحديث الحقول الحساسة
    const restricted = ["uid", "createdAt", "role", "email", "createdAt"];
    restricted.forEach(field => delete updatedData[field]);
    
    // الأدمن يقدر يحدث أي مستخدم
    if (requesterRole === "admin") {
      await db.collection("users").doc(targetUid).update({
        ...updatedData,
        updatedAt: new Date().toISOString()
      });
      
      const updatedDoc = await db.collection("users").doc(targetUid).get();
      return { 
        success: true, 
        message: "Profile updated successfully", 
        data: { id: updatedDoc.id, ...updatedDoc.data() } 
      };
    }
    
    // غير الأدمن يقدر يحدث بس نفسه
    if (requesterUid !== targetUid) {
      return { success: false, message: "Access denied" };
    }
    
    await db.collection("users").doc(targetUid).update({
      ...updatedData,
      updatedAt: new Date().toISOString()
    });
    
    const updatedDoc = await db.collection("users").doc(targetUid).get();
    return { 
      success: true, 
      message: "Profile updated successfully", 
      data: { id: updatedDoc.id, ...updatedDoc.data() } 
    };
    
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// حذف المستخدم (للأدمن فقط)
const deleteUser = async (requesterUid, targetUid) => {
  try {
    const requesterRole = await getUserRole(requesterUid);
    
    if (requesterRole !== "admin") {
      return { success: false, message: "Only admins can delete users" };
    }
    
    // منع الأدمن من حذف نفسه
    if (requesterUid === targetUid) {
      return { success: false, message: "Admins cannot delete themselves" };
    }
    
    // حذف من Firebase Authentication
    await admin.auth().deleteUser(targetUid);
    
    // حذف من Firestore
    await db.collection("users").doc(targetUid).delete();
    
    return { success: true, message: "User deleted successfully" };
    
  } catch (error) {
    return { success: false, message: error.message };
  }
};

module.exports = {
  getUserRole,
  requireStudent,
  requireEmployer,
  requireAdmin,
  isMainAdmin,
  requireMainAdmin,
  // الدوال الجديدة
  getUserProfile,
  updateUserProfile,
  deleteUser,
};

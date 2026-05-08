// D:\student-jobs-portal\Backend\src\services\profileService.js
const { db } = require("../config/firebase");

const createProfile = async (uid, profileData) => {
  try {
    if (!uid) {
      return { success: false, message: "UID is required" };
    }
    
    const userRef = db.collection("users").doc(uid);  // استخدم الطريقة دي بدل doc
    
    await userRef.set({
      ...profileData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return { success: true, message: "Profile created successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const getProfile = async (uid) => {
  try {
    if (!uid) {
      return { success: false, message: "UID is required" };
    }
    
    const userRef = db.collection("users").doc(uid);
    const snapshot = await userRef.get();

    if (!snapshot.exists) {
      return { success: false, message: "User not found" };
    }

    return { success: true, data: { id: snapshot.id, ...snapshot.data() } };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const updateProfile = async (uid, updatedData) => {
  try {
    if (!uid) {
      return { success: false, message: "UID is required" };
    }
    
    if (!updatedData || Object.keys(updatedData).length === 0) {
      return { success: false, message: "No data to update" };
    }
    
    console.log("Updating profile for UID:", uid);
    console.log("Update data:", updatedData);
    
    const userRef = db.collection("users").doc(uid);
    
    // إزالة الحقول الفارغة أو غير المرغوب فيها
    const cleanData = { ...updatedData };
    delete cleanData.uid;
    delete cleanData.id;
    delete cleanData.createdAt;
    
    await userRef.update({
      ...cleanData,
      updatedAt: new Date().toISOString()
    });

    // جلب البيانات بعد التحديث للتأكد
    const updatedDoc = await userRef.get();
    
    return { 
      success: true, 
      message: "Profile updated successfully",
      data: { id: updatedDoc.id, ...updatedDoc.data() }
    };
  } catch (error) {
    console.error("Update profile error:", error);
    return { success: false, message: error.message };
  }
};

module.exports = {
  createProfile,
  getProfile,
  updateProfile
};
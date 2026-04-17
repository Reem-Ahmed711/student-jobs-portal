const { doc, setDoc, getDoc, updateDoc, serverTimestamp } = require("firebase-admin");
const { db } = require("../config/firebase");

const createProfile = async (uid, profileData) => {
  try {
    const userRef = doc(db, "users", uid);

    await setDoc(userRef, {
      ...profileData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return { success: true, message: "Profile created successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const getProfile = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      return { success: false, message: "User not found" };
    }

    return { success: true, data: snapshot.data() };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const updateProfile = async (uid, updatedData) => {
  try {
    const userRef = doc(db, "users", uid);

    await updateDoc(userRef, {
      ...updatedData,
      updatedAt: serverTimestamp()
    });

    return { success: true, message: "Profile updated successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

module.exports = {
  createProfile,
  getProfile,
  updateProfile
};

const { collection, doc, getDoc, getDocs, updateDoc, deleteDoc, query } = require("firebase/firestore");
const { db } = require("../firebase/firebaseConfig");
const { requireAdmin } = require("../auth/roleGuard");


const getUserProfile = async (adminUid, targetUid) => {
  await requireAdmin(adminUid); // نتأكد إن الشخص admin
  const userRef = doc(db, "users", targetUid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    return { success: false, message: "User not found" };
  }

  return { success: true, data: snapshot.data() };
};

const updateUserProfile = async (adminUid, targetUid, updatedData) => {
  await requireAdmin(adminUid);

  const userRef = doc(db, "users", targetUid);
  await updateDoc(userRef, { ...updatedData });

  return { success: true, message: "Profile updated successfully" };
};

const deleteUser = async (adminUid, targetUid) => {
  await requireAdmin(adminUid);

  const userRef = doc(db, "users", targetUid);
  await deleteDoc(userRef);

  return { success: true, message: "User deleted successfully" };
};


const getAllUsers = async (adminUid) => {
  await requireAdmin(adminUid);

  const q = query(collection(db, "users"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getAllUsers
};
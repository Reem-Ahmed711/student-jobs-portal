// MOBILE-APP/app-backend/src/auth/roleGuard.js
const admin = require("firebase-admin");

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

module.exports = {
  getUserRole,
  requireStudent,
  requireEmployer,
  requireAdmin,
  isMainAdmin,
  requireMainAdmin,
};

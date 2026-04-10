
const { doc, getDoc } = require("firebase/firestore");
const { db } = require("../firebase");

const getUserRole = async (uid) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) throw new Error("User not found");

  return docSnap.data().role;
};

const requireStudent = async (uid) => {
  const role = await getUserRole(uid);
  if (role !== "student") throw new Error("Access denied: student only");
};

const requireEmployer = async (uid) => {
  const role = await getUserRole(uid);
  if (role !== "employer") throw new Error("Access denied: employer only");
};


const requireAdmin = async (uid) => {
  const role = await getUserRole(uid);
  if (role !== "admin") throw new Error("Access denied: admin only");
};

module.exports = {
  getUserRole,
  requireStudent,
  requireEmployer,
  requireAdmin
};
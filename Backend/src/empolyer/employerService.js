const { collection, query, where, getDocs } = require("firebase/firestore");
const { db } = require("../firebase/firebaseConfig");
const { requireEmployer } = require("../auth/roleGuard");

const getAllStudents = async (uid) => {
  await requireEmployer(uid); 

  const q = query(collection(db, "users"), where("role", "==", "student"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

module.exports = { getAllStudents };
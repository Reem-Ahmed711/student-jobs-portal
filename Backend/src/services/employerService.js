const { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc 
} = require("firebase/firestore");

const { db } = require("../firebase/firebaseConfig");
const { requireEmployer } = require("../auth/roleGuard");

const getAllStudents = async (uid) => {
  await requireEmployer(uid);

  const q = query(
    collection(db, "users"),
    where("role", "==", "student")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};


const getStudentProfile = async (employerUid, studentUid) => {
  await requireEmployer(employerUid);

  const userRef = doc(db, "users", studentUid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    throw new Error("Student not found");
  }

  return snapshot.data();
};

const getApplicants = async (employerUid, jobId) => {
  await requireEmployer(employerUid);

  const q = query(
    collection(db, "applications"),
    where("jobId", "==", jobId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};



const addToShortlist = async (employerUid, studentUid, jobId) => {
  await requireEmployer(employerUid);

  await addDoc(collection(db, "shortlist"), {
    employerUid,
    studentUid,
    jobId,
    createdAt: new Date()
  });

  return { success: true };
};

const getShortlist = async (employerUid) => {
  await requireEmployer(employerUid);

  const q = query(
    collection(db, "shortlist"),
    where("employerUid", "==", employerUid)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};


module.exports = {
  getAllStudents,
  getStudentProfile,
  getApplicants,
  addToShortlist,
  getShortlist
};
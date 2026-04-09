
const { db } = require("../firebase/firebaseConfig");
const { collection,
     doc, 
     setDoc,
      getDocs, 
      query, 
      where, 
      serverTimestamp } = require("firebase/firestore");


const applyToJob = async (studentUid, jobId) => {
  const appRef = doc(collection(db, "applications"));
  await setDoc(appRef, { studentUid, jobId, status: "pending", appliedAt: serverTimestamp() });
  return { success: true, applicationId: appRef.id };
};


const getJobApplications = async (employerUid, jobId) => {
  const q = query(collection(db, "applications"), where("jobId", "==", jobId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};


const getStudentApplications = async (studentUid) => {
  const q = query(collection(db, "applications"), where("studentUid", "==", studentUid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

module.exports = { applyToJob, getJobApplications, getStudentApplications };
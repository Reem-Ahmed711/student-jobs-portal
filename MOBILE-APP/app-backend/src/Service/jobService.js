
const { db } = require("../firebase/firebaseConfig");
const { collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, serverTimestamp } = require("firebase/firestore");


const createJob = async (employerUid, jobData) => {
  const jobRef = doc(collection(db, "jobs"));
  await setDoc(jobRef, {
    ...jobData,
    employerUid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return { success: true, jobId: jobRef.id };
};


const updateJob = async (employerUid, jobId, updatedData) => {
  const jobRef = doc(db, "jobs", jobId);
  const snapshot = await getDoc(jobRef);
  if (!snapshot.exists()) return { success: false, message: "Job not found" };
  if (snapshot.data().employerUid !== employerUid) return { success: false, message: "Access denied" };

  await updateDoc(jobRef, { ...updatedData, updatedAt: serverTimestamp() });
  return { success: true };
};


const deleteJob = async (employerUid, jobId) => {
  const jobRef = doc(db, "jobs", jobId);
  const snapshot = await getDoc(jobRef);
  if (!snapshot.exists()) return { success: false, message: "Job not found" };
  if (snapshot.data().employerUid !== employerUid) return { success: false, message: "Access denied" };

  await deleteDoc(jobRef);
  return { success: true };
};


const getAllJobs = async () => {
  const snapshot = await getDocs(collection(db, "jobs"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};


const getJobById = async (jobId) => {
  const jobRef = doc(db, "jobs", jobId);
  const snapshot = await getDoc(jobRef);
  if (!snapshot.exists()) return { success: false, message: "Job not found" };
  return { success: true, data: snapshot.data() };
};

module.exports = { createJob, updateJob, deleteJob, getAllJobs, getJobById };
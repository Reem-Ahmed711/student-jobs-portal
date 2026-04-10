const { db } = require("../firebase");
const { FieldValue } = require("firebase-admin/firestore");

const createJob = async (employerUid, jobData) => {
  const jobRef = db.collection("jobs").doc();
  await jobRef.set({
    ...jobData,
    employerUid,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  return { success: true, jobId: jobRef.id };
};

const updateJob = async (employerUid, jobId, updatedData) => {
  const jobRef = db.collection("jobs").doc(jobId);
  const snapshot = await jobRef.get();
  if (!snapshot.exists) return { success: false, message: "Job not found" };
  if (snapshot.data().employerUid !== employerUid) return { success: false, message: "Access denied" };

  await jobRef.update({ ...updatedData, updatedAt: FieldValue.serverTimestamp() });
  return { success: true };
};

const deleteJob = async (employerUid, jobId) => {
  const jobRef = db.collection("jobs").doc(jobId);
  const snapshot = await jobRef.get();
  if (!snapshot.exists) return { success: false, message: "Job not found" };
  if (snapshot.data().employerUid !== employerUid) return { success: false, message: "Access denied" };

  await jobRef.delete();
  return { success: true };
};

const getAllJobs = async () => {
  const snapshot = await db.collection("jobs").get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

const getJobById = async (jobId) => {
  const jobRef = db.collection("jobs").doc(jobId);
  const snapshot = await jobRef.get();
  if (!snapshot.exists) return { success: false, message: "Job not found" };
  return { success: true, data: snapshot.data() };
};

module.exports = { createJob, updateJob, deleteJob, getAllJobs, getJobById };
const admin = require("firebase-admin");
const db = admin.firestore();

const createJob = async (employerUid, jobData) => {
  const jobRef = db.collection("jobs").doc();

  await jobRef.set({
    ...jobData,
    employerUid,
    status: "active",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    applicantsCount: 0,
  });

  return {
    success: true,
    jobId: jobRef.id,
    message: "Job created successfully",
  };
};

const updateJob = async (employerUid, jobId, updateData) => {
  const jobDoc = await db.collection("jobs").doc(jobId).get();
  if (!jobDoc.exists) return { success: false, message: "Job not found" };

  if (jobDoc.data().employerUid !== employerUid) {
    return {
      success: false,
      message: "You don't have permission to edit this job",
    };
  }

  await db
    .collection("jobs")
    .doc(jobId)
    .update({
      ...updateData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

  return { success: true, message: "Job updated successfully" };
};

const deleteJob = async (employerUid, jobId) => {
  const jobDoc = await db.collection("jobs").doc(jobId).get();
  if (!jobDoc.exists) return { success: false, message: "Job not found" };

  if (jobDoc.data().employerUid !== employerUid) {
    return {
      success: false,
      message: "You don't have permission to delete this job",
    };
  }

  // Delete related applications
  const appsSnap = await db
    .collection("applications")
    .where("jobId", "==", jobId)
    .get();
  const batch = db.batch();
  appsSnap.forEach((doc) => batch.delete(doc.ref));
  batch.delete(db.collection("jobs").doc(jobId));
  await batch.commit();

  return { success: true, message: "Job and related applications deleted" };
};

const getAllJobs = async () => {
  const snapshot = await db.collection("jobs").get();

  const jobs = [];
  snapshot.forEach((doc) => {
    jobs.push({
      id: doc.id,
      ...doc.data(),
    });
  });

  return jobs;
};

const getJobById = async (jobId) => {
  const doc = await db.collection("jobs").doc(jobId).get();
  if (!doc.exists) return { success: false, message: "Job not found" };

  return { success: true, data: { id: doc.id, ...doc.data() } };
};

module.exports = {
  createJob,
  updateJob,
  deleteJob,
  getAllJobs,
  getJobById,
};

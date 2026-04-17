const { admin, db } = require("../firebase");

// ================= Apply to Job =================
const applyToJob = async (studentUid, jobId) => {
  const appRef = db.collection("applications").doc();

  await appRef.set({
    studentUid,
    jobId,
    status: "pending",
    appliedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { success: true, applicationId: appRef.id };
};

// ================= Get Job Applications =================
const getJobApplications = async (employerUid, jobId) => {
  const snapshot = await db
    .collection("applications")
    .where("jobId", "==", jobId)
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// ================= Get Student Applications =================
const getStudentApplications = async (studentUid) => {
  const snapshot = await db
    .collection("applications")
    .where("studentUid", "==", studentUid)
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

module.exports = {
  applyToJob,
  getJobApplications,
  getStudentApplications,
};

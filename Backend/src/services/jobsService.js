const admin = require("firebase-admin");
require("../config/firebase");

const db = admin.firestore();
const JOBS_COLLECTION = "jobs";

exports.createJob = async (jobData) => {
  try {
    const newJob = {
      title: jobData.title || "Untitled Job",
      department: jobData.department || "Computer Science",
      type: jobData.type || "Part-Time",
      deadline: jobData.deadline || null,
      location: jobData.location || "",
      description: jobData.description || "",
      requirements: jobData.requirements || [],
      skills: jobData.skills || [],
      hours: jobData.hours || "15",
      duration: jobData.duration || "One Semester",
      compensationType: jobData.compensationType || "Paid",
      salary: jobData.salary || "",
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      applicants: 0,
      views: 0
    };

    if (jobData.employerUid) {
      newJob.employerUid = jobData.employerUid;
    }
    if (jobData.postedBy) {
      newJob.postedBy = jobData.postedBy;
    }

    const docRef = await db.collection(JOBS_COLLECTION).add(newJob);
    return { id: docRef.id, ...newJob };
  } catch (error) {
    throw new Error("Failed to create job: " + error.message);
  }
};

exports.findAllJobs = async () => {
  try {
    const snapshot = await db.collection(JOBS_COLLECTION).get();
    const jobs = [];

    snapshot.forEach((doc) => {
      jobs.push({ id: doc.id, ...doc.data() });
    });

    return jobs;
  } catch (error) {
    throw new Error("Failed to fetch jobs: " + error.message);
  }
};

exports.findJobById = async (jobId) => {
  try {
    const doc = await db.collection(JOBS_COLLECTION).doc(jobId).get();

    if (!doc.exists) {
      return null;
    }

    return { id: doc.id, ...doc.data() };
  } catch (error) {
    throw new Error("Failed to fetch job: " + error.message);
  }
};

exports.findJobsByEmployer = async (employerUid) => {
  try {
    const snapshot = await db
      .collection(JOBS_COLLECTION)
      .where("employerUid", "==", employerUid)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error("Failed to fetch employer jobs: " + error.message);
  }
};

exports.updateJob = async (jobId, updateData) => {
  try {
    await db.collection(JOBS_COLLECTION).doc(jobId).update({
      ...updateData,
      updatedAt: new Date().toISOString()
    });
    return { id: jobId, ...updateData };
  } catch (error) {
    throw new Error("Failed to update job: " + error.message);
  }
};

exports.deleteJob = async (jobId) => {
  try {
    await db.collection(JOBS_COLLECTION).doc(jobId).delete();
    return { success: true };
  } catch (error) {
    throw new Error("Failed to delete job: " + error.message);
  }
};

// ============ EXPORTS ============
module.exports = {
  createJob: exports.createJob,
  findAllJobs: exports.findAllJobs,
  findJobById: exports.findJobById,
  findJobsByEmployer: exports.findJobsByEmployer,
  updateJob: exports.updateJob,
  deleteJob: exports.deleteJob
};

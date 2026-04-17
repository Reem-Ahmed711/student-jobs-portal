// MOBILE-APP/app-backend/src/Controllers/applicationController.js
const admin = require("firebase-admin");
const db = admin.firestore();

const {
  applyToJob,
  getJobApplications,
  getStudentApplications,
  updateApplicationStatus,  // ✅ إضافة الـ Service الجديد
} = require("../Service/applicationService");

const {
  requireStudent,
  requireEmployer,
} = require("../auth/roleGuard");

const applyToJobController = async (req, res) => {
  try {
    await requireStudent(req.user.uid);
    const result = await applyToJob(req.user.uid, req.body.jobId);
    res.status(201).json(result);
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};

const getJobApplicationsController = async (req, res) => {
  console.log("✅ getJobApplicationsController called!");
  console.log("Job ID:", req.params.jobId);
  console.log("Employer UID:", req.user?.uid);
  try {
    await requireEmployer(req.user.uid);
    const { jobId } = req.params;
    const result = await getJobApplications(req.user.uid, jobId);
    res.status(200).json(result);
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};

const getStudentApplicationsController = async (req, res) => {
  try {
    await requireStudent(req.user.uid);
    const result = await getStudentApplications(req.user.uid);
    res.status(200).json(result);
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};

// ✅ Controller جديد لقبول/رفض الطلبات
const updateApplicationStatusController = async (req, res) => {
  try {
    await requireEmployer(req.user.uid);
    const { applicationId } = req.params;
    const { status } = req.body;
    
    const result = await updateApplicationStatus(req.user.uid, applicationId, status);
    res.status(200).json(result);
  } catch (err) {
    const statusCode = err.message.includes("Access denied") ? 403 : 500;
    res.status(statusCode).json({ success: false, message: err.message });
  }
};

module.exports = {
  applyToJobController,
  getJobApplicationsController,
  getStudentApplicationsController,
  updateApplicationStatusController, // ✅ تصدير الـ Controller الجديد
};
const {
  getEmployerProfile,
  updateEmployerProfile,
  getEmployerJobs,
  getJobApplicationsWithDetails,
  acceptApplication,
  rejectApplication,
  getEmployerStats,
  getEmployerDashboard,
} = require("../Service/employerService");

const { requireEmployer } = require("../auth/roleGuard");

// ================= Get Employer Profile =================
const getEmployerProfileController = async (req, res) => {
  try {
    await requireEmployer(req.user.uid);
    const result = await getEmployerProfile(req.user.uid);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    const status = err.message.includes("Access denied") ? 403 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

// ================= Update Employer Profile =================
const updateEmployerProfileController = async (req, res) => {
  try {
    await requireEmployer(req.user.uid);
    const result = await updateEmployerProfile(req.user.uid, req.body);
    res.status(200).json(result);
  } catch (err) {
    const status = err.message.includes("Access denied") ? 403 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

// ================= Get Employer Jobs =================
const getEmployerJobsController = async (req, res) => {
  try {
    await requireEmployer(req.user.uid);
    const { status } = req.query;
    const result = await getEmployerJobs(req.user.uid, { status });
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    const status = err.message.includes("Access denied") ? 403 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

// ================= Get Job Applications With Details =================
const getJobApplicationsWithDetailsController = async (req, res) => {
  try {
    await requireEmployer(req.user.uid);
    const { jobId } = req.params;
    const result = await getJobApplicationsWithDetails(req.user.uid, jobId);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    const status = err.message.includes("Access denied") ? 403 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

// ================= Accept Application =================
const acceptApplicationController = async (req, res) => {
  try {
    await requireEmployer(req.user.uid);
    const { applicationId } = req.params;
    const result = await acceptApplication(req.user.uid, applicationId);
    res.status(200).json(result);
  } catch (err) {
    const status = err.message.includes("Access denied") ? 403 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

// ================= Reject Application =================
const rejectApplicationController = async (req, res) => {
  try {
    await requireEmployer(req.user.uid);
    const { applicationId } = req.params;
    const { reason } = req.body;
    const result = await rejectApplication(req.user.uid, applicationId, reason);
    res.status(200).json(result);
  } catch (err) {
    const status = err.message.includes("Access denied") ? 403 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

// ================= Get Employer Stats =================
const getEmployerStatsController = async (req, res) => {
  try {
    await requireEmployer(req.user.uid);
    const result = await getEmployerStats(req.user.uid);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    const status = err.message.includes("Access denied") ? 403 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

// ================= Get Employer Dashboard =================
const getEmployerDashboardController = async (req, res) => {
  try {
    await requireEmployer(req.user.uid);
    const result = await getEmployerDashboard(req.user.uid);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    const status = err.message.includes("Access denied") ? 403 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

module.exports = {
  getEmployerProfileController,
  updateEmployerProfileController,
  getEmployerJobsController,
  getJobApplicationsWithDetailsController,
  acceptApplicationController,
  rejectApplicationController,
  getEmployerStatsController,
  getEmployerDashboardController,
};

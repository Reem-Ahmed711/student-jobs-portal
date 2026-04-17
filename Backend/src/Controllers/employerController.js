const {
  getEmployerProfile,
  updateEmployerProfile,
  getEmployerJobs,
  getJobApplicationsWithDetails,
  acceptApplication,
  rejectApplication,
  getEmployerStats,
  getEmployerDashboard,
} = require("../services/employerService");

const getEmployerProfileController = async (req, res) => {
  try {
    const result = await getEmployerProfile(req.user.uid);
    return res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEmployerProfileController = async (req, res) => {
  try {
    const result = await updateEmployerProfile(req.user.uid, req.body);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEmployerJobsController = async (req, res) => {
  try {
    const result = await getEmployerJobs(req.user.uid);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJobApplicationsWithDetailsController = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({ message: "jobId is required" });
    }

    const result = await getJobApplicationsWithDetails(jobId, req.user.uid);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const acceptApplicationController = async (req, res) => {
  try {
    const { applicationId } = req.params;

    if (!applicationId) {
      return res.status(400).json({ message: "applicationId is required" });
    }

    const result = await acceptApplication(applicationId, req.user.uid);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rejectApplicationController = async (req, res) => {
  try {
    const { applicationId } = req.params;

    if (!applicationId) {
      return res.status(400).json({ message: "applicationId is required" });
    }

    const result = await rejectApplication(applicationId, req.user.uid);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEmployerStatsController = async (req, res) => {
  try {
    const result = await getEmployerStats(req.user.uid);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEmployerDashboardController = async (req, res) => {
  try {
    const result = await getEmployerDashboard(req.user.uid);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
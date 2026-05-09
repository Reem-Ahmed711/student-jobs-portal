const {
  getEmployerProfile,
  updateEmployerProfile,
  getEmployerJobs,
  getJobApplicationsWithDetails,
  acceptApplication,
  rejectApplication,
  getEmployerStats,
  getEmployerDashboard,
  createJob,
  getHiringHistory,
  getShortlistedCandidates,
  addToShortlist,
  removeFromShortlist,
  updateShortlistStage,
} = require("../services/employerService");

// Helper function to check user authentication
const checkUser = (req, res) => {
  if (!req.user || !req.user.uid) {
    res.status(401).json({ success: false, message: "User not authenticated" });
    return false;
  }
  return true;
};

const getEmployerProfileController = async (req, res) => {
  try {
    if (!checkUser(req, res)) return;
    const result = await getEmployerProfile(req.user.uid);
    return res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEmployerProfileController = async (req, res) => {
  try {
    if (!checkUser(req, res)) return;
    const result = await updateEmployerProfile(req.user.uid, req.body);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEmployerJobsController = async (req, res) => {
  try {
    if (!checkUser(req, res)) return;
    const result = await getEmployerJobs(req.user.uid);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJobApplicationsWithDetailsController = async (req, res) => {
  try {
    if (!checkUser(req, res)) return;
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
    if (!checkUser(req, res)) return;
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

const createJobController = async (req, res) => {
  try {
    if (!checkUser(req, res)) return;
    const result = await createJob(req.user.uid, req.body);
    return res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rejectApplicationController = async (req, res) => {
  try {
    if (!checkUser(req, res)) return;
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
    if (!checkUser(req, res)) return;
    const result = await getEmployerStats(req.user.uid);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEmployerDashboardController = async (req, res) => {
  try {
    if (!checkUser(req, res)) return;
    const result = await getEmployerDashboard(req.user.uid);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getHiringHistoryController = async (req, res) => {
  try {
    if (!checkUser(req, res)) return;
    const result = await getHiringHistory(req.user.uid);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getShortlistedCandidatesController = async (req, res) => {
  try {
    if (!checkUser(req, res)) return;
    console.log("🔵 Fetching shortlisted for UID:", req.user.uid);
    const result = await getShortlistedCandidates(req.user.uid);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error("❌ Error in getShortlistedCandidatesController:", error);
    res.status(500).json({ message: error.message });
  }
};

const addToShortlistController = async (req, res) => {
  try {
    if (!checkUser(req, res)) return;
    const { applicationId, notes } = req.body;
    
    if (!applicationId) {
      return res.status(400).json({ success: false, message: "applicationId is required" });
    }
    
    const result = await addToShortlist(req.user.uid, applicationId, notes);
    return res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeFromShortlistController = async (req, res) => {
  try {
    if (!checkUser(req, res)) return;
    const { shortlistId } = req.params;
    
    if (!shortlistId) {
      return res.status(400).json({ success: false, message: "shortlistId is required" });
    }
    
    const result = await removeFromShortlist(req.user.uid, shortlistId);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateShortlistStageController = async (req, res) => {
  try {
    if (!checkUser(req, res)) return;
    const { shortlistId } = req.params;
    const { stage, interviewDate, feedback } = req.body;
    
    if (!shortlistId) {
      return res.status(400).json({ success: false, message: "shortlistId is required" });
    }
    
    if (!stage) {
      return res.status(400).json({ success: false, message: "stage is required" });
    }
    
    const result = await updateShortlistStage(req.user.uid, shortlistId, stage, interviewDate, feedback);
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
  createJobController,
  getHiringHistoryController,
  getShortlistedCandidatesController,
  addToShortlistController,
  removeFromShortlistController,
  updateShortlistStageController,
};
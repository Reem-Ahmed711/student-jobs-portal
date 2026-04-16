const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

const {
  getEmployerProfileController,
  updateEmployerProfileController,
  getEmployerJobsController,
  getJobApplicationsWithDetailsController,
  acceptApplicationController,
  rejectApplicationController,
  getEmployerStatsController,
  getEmployerDashboardController,
} = require("../Controllers/employerController");

// ================= Employer Profile =================
router.get("/employer/profile", verifyToken, getEmployerProfileController);
router.put("/employer/profile", verifyToken, updateEmployerProfileController);

// ================= Employer Jobs =================
router.get("/employer/jobs", verifyToken, getEmployerJobsController);

// ================= Employer Applications =================
router.get(
  "/employer/jobs/:jobId/applications",
  verifyToken,
  getJobApplicationsWithDetailsController,
);
router.post(
  "/employer/applications/:applicationId/accept",
  verifyToken,
  acceptApplicationController,
);
router.post(
  "/employer/applications/:applicationId/reject",
  verifyToken,
  rejectApplicationController,
);

// ================= Employer Stats & Dashboard =================
router.get("/employer/stats", verifyToken, getEmployerStatsController);
router.get("/employer/dashboard", verifyToken, getEmployerDashboardController);

module.exports = router;

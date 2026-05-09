const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const verifyRole = require("../middleware/verifyRole");  // ✅ اسم الدالة دلوقتي verifyRole

const {
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
} = require("../Controllers/employerController");

// ✅ تأكد من استخدام verifyRole مع employer
router.use(verifyToken, verifyRole("employer"));

router.get("/profile", getEmployerProfileController);
router.put("/profile", updateEmployerProfileController);
router.get("/jobs", getEmployerJobsController);
router.get("/jobs/:jobId/applications", getJobApplicationsWithDetailsController);
router.patch("/applications/:applicationId/accept", acceptApplicationController);
router.patch("/applications/:applicationId/reject", rejectApplicationController);
router.get("/stats", getEmployerStatsController);
router.get("/dashboard", getEmployerDashboardController);
router.post("/jobs", createJobController);
router.get("/hiring-history", getHiringHistoryController);

// Shortlist routes
router.get("/shortlisted", getShortlistedCandidatesController);
router.post("/shortlisted", addToShortlistController);
router.delete("/shortlisted/:shortlistId", removeFromShortlistController);
router.patch("/shortlisted/:shortlistId", updateShortlistStageController);

module.exports = router;
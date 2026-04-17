const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const verifyRole = require("../middleware/verifyRole"); 

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


router.use(verifyToken, verifyRole("employer"));

router.get("/profile",        getEmployerProfileController);
router.put("/profile",        updateEmployerProfileController);
router.get("/jobs",           getEmployerJobsController);
router.get("/jobs/:jobId/applications", getJobApplicationsWithDetailsController);
router.patch("/applications/:applicationId/accept", acceptApplicationController);
router.patch("/applications/:applicationId/reject", rejectApplicationController);
router.get("/stats",          getEmployerStatsController);
router.get("/dashboard",      getEmployerDashboardController);

module.exports = router;
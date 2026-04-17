const express = require("express");
const router = express.Router();
const jobsControl = require("../Controllers/jobsControl");
const applicationControl = require("../Controllers/applicationControl");
const verifyToken = require("../middleware/verifyToken");

// Jobs routes
router.post("/jobs", verifyToken, jobsControl.addJob);
router.get("/jobs", jobsControl.getAllJobs);
router.get("/jobs/:id", jobsControl.getJobById);

// Application route
router.post("/apply", verifyToken, applicationControl.applyForJob)
// Accept application
router.put(
  "/applications/:id/accept",
  verifyToken,
  applicationControl.acceptApplication
);
router.get(
  "/applications",
  verifyToken,
  applicationControl.getEmployerApplications
);
module.exports = router;
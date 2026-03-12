const express = require("express");
const router = express.Router();
const jobsControl = require("./jobsControl");
const applicationControl = require("./applicationControl");
const verifyToken = require("../middleware/verifyToken");

// Jobs routes
router.post("/jobs", verifyToken, jobsControl.addJob);
router.get("/jobs", jobsControl.getAllJobs);
router.get("/jobs/:id", jobsControl.getJobById);

// Application route
router.post("/apply", verifyToken, applicationControl.applyForJob);

module.exports = router;


const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");

const {
  applyToJobController,
  getJobApplicationsController,
  getStudentApplicationsController
} = require("../Controllers/applicationController");

router.post("/", verifyToken, applyToJobController);
router.get("/job/:jobId", verifyToken, getJobApplicationsController);
router.get("/student", verifyToken, getStudentApplicationsController);

module.exports = router;
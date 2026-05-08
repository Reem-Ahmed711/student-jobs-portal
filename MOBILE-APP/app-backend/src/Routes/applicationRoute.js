// MOBILE-APP/app-backend/src/Routes/applicationRoute.js
const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const { admin, db } = require("../firebase");
const {
  applyToJobController,
  getJobApplicationsController,
  getStudentApplicationsController,
  updateApplicationStatusController,
  getStudentApplicationsCountController,  // ✅ أضيفي هذا السطر
} = require("../Controllers/applicationController");

router.post("/", verifyToken, applyToJobController);
router.get("/job/:jobId", verifyToken, getJobApplicationsController);
router.get("/student", verifyToken, getStudentApplicationsController);
router.get("/student/count", verifyToken, getStudentApplicationsCountController); // ✅ هذا السطر
router.put("/:applicationId/status", verifyToken, updateApplicationStatusController);

module.exports = router;
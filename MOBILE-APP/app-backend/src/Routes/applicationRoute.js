// MOBILE-APP/app-backend/src/Routes/applicationRoute.js
const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");

const {
  applyToJobController,
  getJobApplicationsController,
  getStudentApplicationsController,
  updateApplicationStatusController,  // ✅ إضافة الـ Controller الجديد
} = require("../Controllers/applicationController");

router.post("/", verifyToken, applyToJobController);
router.get("/job/:jobId", verifyToken, getJobApplicationsController);
router.get("/student", verifyToken, getStudentApplicationsController);
router.put("/:applicationId/status", verifyToken, updateApplicationStatusController); // ✅ Route لقبول/رفض الطلبات

module.exports = router;
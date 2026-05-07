const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const verifyRole = require("../middleware/verifyRole");

const {
  getAllEmployersController,
  getEmployerByIdController,
  updateEmployerController,
  deleteEmployerController,
  toggleEmployerStatusController,

  getAllStudentsController,
  getStudentByIdController,
  updateStudentController,
  deleteStudentController,
  toggleStudentStatusController,

  getPlatformStatsController,

  makeAdminController,
  removeAdminController,
  adminDeleteUserController,

  adminGetAllJobsController,
  adminDeleteJobController,
  adminUpdateJobStatusController,

  adminGetAllApplicationsController,
  adminUpdateApplicationStatusController,

  getAllAdminsController,
} = require("../Controllers/adminController");

router.use(verifyToken, verifyRole("admin"));

// Employer
router.get("/employers",                    getAllEmployersController);
router.get("/employers/:uid",           getEmployerByIdController);
router.put("/employers/:uid",            updateEmployerController);
router.delete("/employers/:uid",             deleteEmployerController);
router.patch("/employers/:uid/toggle-status", toggleEmployerStatusController);

// Student 
router.get("/students",                   getAllStudentsController);
router.get("/students/:uid",              getStudentByIdController);
router.put("/students/:uid",               updateStudentController);
router.delete("/students/:uid",            deleteStudentController);
router.patch("/students/:uid/toggle-status",  toggleStudentStatusController);

// Platform Stats
router.get("/stats",    getPlatformStatsController);
// Admins
router.get("/admins", getAllAdminsController);

router.patch("/make-admin/:uid", makeAdminController);

router.patch("/remove-admin/:uid", removeAdminController);

router.delete("/users/:uid", adminDeleteUserController);

// Jobs
router.get("/jobs", adminGetAllJobsController);

router.delete("/jobs/:jobId", adminDeleteJobController);

router.patch("/jobs/:jobId/status", adminUpdateJobStatusController);

// Applications
router.get("/applications", adminGetAllApplicationsController);

router.patch(
  "/applications/:appId/status",
  adminUpdateApplicationStatusController
);

module.exports = router;
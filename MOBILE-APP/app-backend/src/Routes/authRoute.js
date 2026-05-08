// MOBILE-APP/app-backend/src/Routes/adminRoute.js
const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const { requireAdmin } = require("../auth/roleGuard");

const {
  getDashboardStats,
  getAllUsersController,
  makeAdminController,
  removeAdminController,
  adminDeleteJobController,
  adminDeleteUserController,
  adminGetAllJobsController,
  adminUpdateJobStatusController,
  adminGetAllApplicationsController,
  adminUpdateApplicationStatusController,
  getAllAdminsController,
  getAdminLogsController,
  searchUsersController,
} = require("../Controllers/adminController");
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
} = require("../auth/authService");

// Helper middleware to check admin
const adminGuard = async (req, res, next) => {
  try {
    await requireAdmin(req.user.uid);
    next();
  } catch (err) {
    res.status(403).json({ success: false, message: err.message });
  }
};

// Apply verifyToken first, then adminGuard
router.use(verifyToken);
router.use(adminGuard);

// Dashboard Stats
router.get("/stats", getDashboardStats);

// User Management
router.get("/users", getAllUsersController);
router.post("/users/:uid/make-admin", makeAdminController);
router.post("/users/:uid/remove-admin", removeAdminController);
router.delete("/users/:uid", adminDeleteUserController);

// Job Management
router.get("/jobs", adminGetAllJobsController);
router.delete("/jobs/:jobId", adminDeleteJobController);
router.patch("/jobs/:jobId/status", adminUpdateJobStatusController);

// Application Management
router.get("/applications", adminGetAllApplicationsController);
router.patch(
  "/applications/:applicationId/status",
  adminUpdateApplicationStatusController,
);

// Admins & Logs
router.get("/admins", getAllAdminsController);
router.get("/logs", getAdminLogsController);

// Search
router.get("/search/users", searchUsersController);

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const result = await forgotPassword({ email });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { oobCode, newPassword } = req.body;
    const result = await resetPassword({ oobCode, newPassword });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;

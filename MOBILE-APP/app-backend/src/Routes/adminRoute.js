// MOBILE-APP/app-backend/src/Routes/adminRoute.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { requireAdmin } = require("../auth/roleGuard");
const { admin, db } = require("../firebase"); 
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

// Helper middleware to check admin
const adminGuard = async (req, res, next) => {
  try {
    await requireAdmin(req.user.uid);
    next();
  } catch (err) {
    res.status(403).json({ success: false, message: err.message });
  }
};

// ✅ تأكدي إن verifyToken و adminGuard بيتطبقوا على كل routes
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
router.put("/profile", async (req, res) => {
  try {
    const { name, department, phone } = req.body;
    const userId = req.user.uid;
    
    await db.collection("users").doc(userId).update({
      name: name,
      department: department,
      phone: phone || "",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Profile update error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

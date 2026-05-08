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
router.get("/employers", getAllEmployersController);
router.get("/employers/:uid", getEmployerByIdController);
router.put("/employers/:uid", updateEmployerController);
router.delete("/employers/:uid", deleteEmployerController);
router.patch("/employers/:uid/toggle-status", toggleEmployerStatusController);

// Student
router.get("/students", getAllStudentsController);
router.get("/students/:uid", getStudentByIdController);
router.put("/students/:uid", updateStudentController);
router.delete("/students/:uid", deleteStudentController);
router.patch("/students/:uid/toggle-status", toggleStudentStatusController);

// Platform Stats
router.get("/stats", getPlatformStatsController);
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
  adminUpdateApplicationStatusController,
);
// ==================== GET ALL USERS (Combined) ====================
router.get("/users", async (req, res) => {
  try {
    const { db } = require("../config/firebase");

    // جلب جميع المستخدمين من Firestore
    const usersSnapshot = await db.collection("users").get();
    const users = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});
// ==================== Reports Management ====================

// جلب كل التقارير
router.get("/reports", async (req, res) => {
  try {
    const { db } = require("../config/firebase");
    const reportsSnapshot = await db
      .collection("reports")
      .orderBy("createdAt", "desc")
      .get();

    const reports = reportsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ success: true, data: reports });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// تحديث حالة التقرير (حل)
router.patch("/reports/:reportId/status", async (req, res) => {
  try {
    const { db } = require("../config/firebase");
    const { reportId } = req.params;
    const { status } = req.body;

    await db.collection("reports").doc(reportId).update({
      status: status,
      resolvedAt: new Date().toISOString(),
      resolvedBy: req.user.uid,
    });

    res.json({ success: true, message: "Report status updated" });
  } catch (error) {
    console.error("Error updating report:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// حذف تقرير (رفض)
router.delete("/reports/:reportId", async (req, res) => {
  try {
    const { db } = require("../config/firebase");
    const { reportId } = req.params;

    await db.collection("reports").doc(reportId).delete();

    res.json({ success: true, message: "Report deleted" });
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

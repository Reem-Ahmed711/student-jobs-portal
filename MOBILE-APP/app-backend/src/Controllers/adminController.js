// MOBILE-APP/app-backend/src/Controllers/adminController.js
const {
  getPlatformStats,
  getAllUsers,
  makeAdmin,
  removeAdmin,
  adminDeleteJob,
  adminDeleteUser,
  adminGetAllJobs,
  adminUpdateJobStatus,
  adminGetAllApplications,
  adminUpdateApplicationStatus,
  getAllAdmins,
  getAdminLogs,
  searchUsers,
} = require("../Service/adminService");

const { requireAdmin } = require("../auth/roleGuard");

// ================= Get Admin Dashboard Stats =================
const getDashboardStats = async (req, res) => {
  try {
    console.log("🟢 getDashboardStats called by user:", req.user?.uid);
    await requireAdmin(req.user.uid);
    const stats = await getPlatformStats();
    console.log("✅ Dashboard stats sent successfully");
    res.status(200).json({ success: true, data: stats });
  } catch (err) {
    console.error("🔴 Error in getDashboardStats:", err.message);
    const status = err.message.includes("Access denied") ? 403 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

// ================= Get All Users =================
const getAllUsersController = async (req, res) => {
  try {
    console.log("🟢 getAllUsersController called");
    await requireAdmin(req.user.uid);
    const { role, page = 1, limit = 20 } = req.query;
    const result = await getAllUsers(role, parseInt(page), parseInt(limit));
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error("🔴 Error in getAllUsersController:", err.message);
    const status = err.message.includes("Access denied") ? 403 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

// ================= Make User Admin =================
const makeAdminController = async (req, res) => {
  try {
    console.log("🟢 makeAdminController called for user:", req.params.uid);
    await requireAdmin(req.user.uid);
    const { uid } = req.params;
    const result = await makeAdmin(uid, req.user.uid);
    res.status(200).json(result);
  } catch (err) {
    console.error("🔴 Error in makeAdminController:", err.message);
    const status = err.message.includes("Access denied") ? 403 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

// ================= Remove Admin Role =================
const removeAdminController = async (req, res) => {
  try {
    console.log("🟢 removeAdminController called for user:", req.params.uid);
    await requireAdmin(req.user.uid);
    const { uid } = req.params;
    const result = await removeAdmin(uid, req.user.uid);
    res.status(200).json(result);
  } catch (err) {
    console.error("🔴 Error in removeAdminController:", err.message);
    const status = err.message.includes("Access denied") ? 403 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

// ================= Admin Delete Job =================
const adminDeleteJobController = async (req, res) => {
  try {
    console.log(
      "🟢 adminDeleteJobController called for job:",
      req.params.jobId,
    );
    await requireAdmin(req.user.uid);
    const { jobId } = req.params;

    if (!jobId) {
      return res
        .status(400)
        .json({ success: false, message: "Job ID is required" });
    }

    const result = await adminDeleteJob(jobId, req.user.uid);
    res.status(200).json(result);
  } catch (err) {
    console.error("🔴 Error in adminDeleteJobController:", err.message);
    const status = err.message.includes("Access denied") ? 403 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

// ================= Admin Delete User =================
const adminDeleteUserController = async (req, res) => {
  try {
    console.log(
      "🟢 adminDeleteUserController called for user:",
      req.params.uid,
    );
    await requireAdmin(req.user.uid);
    const { uid } = req.params;

    if (!uid) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const result = await adminDeleteUser(uid, req.user.uid);
    res.status(200).json(result);
  } catch (err) {
    console.error("🔴 Error in adminDeleteUserController:", err.message);
    const status = err.message.includes("Access denied") ? 403 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

// ================= Admin Get All Jobs (المعدل) =================
const adminGetAllJobsController = async (req, res) => {
  try {
    console.log("🟢 adminGetAllJobsController called");
    console.log("📝 Query params:", req.query);
    console.log("👤 Admin user:", req.user?.uid);

    await requireAdmin(req.user.uid);
    const { department, status } = req.query;
    const result = await adminGetAllJobs({ department, status });

    console.log(`✅ Returning ${result.length} jobs`);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error("🔴 Error in adminGetAllJobsController:", err.message);
    console.error("Stack trace:", err.stack);
    const status = err.message.includes("Access denied") ? 403 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

// ================= Admin Update Job Status =================
const adminUpdateJobStatusController = async (req, res) => {
  try {
    console.log(
      "🟢 adminUpdateJobStatusController called for job:",
      req.params.jobId,
    );
    console.log("📝 New status:", req.body.status);

    await requireAdmin(req.user.uid);
    const { jobId } = req.params;
    const { status } = req.body;

    if (!jobId) {
      return res
        .status(400)
        .json({ success: false, message: "Job ID is required" });
    }
    if (!status) {
      return res
        .status(400)
        .json({ success: false, message: "Status is required" });
    }

    const result = await adminUpdateJobStatus(jobId, status, req.user.uid);
    res.status(200).json(result);
  } catch (err) {
    console.error("🔴 Error in adminUpdateJobStatusController:", err.message);
    const status = err.message.includes("Access denied") ? 403 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

// ================= Admin Get All Applications =================
const adminGetAllApplicationsController = async (req, res) => {
  try {
    console.log("🟢 adminGetAllApplicationsController called");
    await requireAdmin(req.user.uid);
    const { status } = req.query;
    const result = await adminGetAllApplications({ status });
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error(
      "🔴 Error in adminGetAllApplicationsController:",
      err.message,
    );
    const status = err.message.includes("Access denied") ? 403 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

// ================= Admin Update Application Status =================
const adminUpdateApplicationStatusController = async (req, res) => {
  try {
    console.log("🟢 adminUpdateApplicationStatusController called");
    await requireAdmin(req.user.uid);
    const { applicationId } = req.params;
    const { status } = req.body;
    const result = await adminUpdateApplicationStatus(
      applicationId,
      status,
      req.user.uid,
    );
    res.status(200).json(result);
  } catch (err) {
    console.error(
      "🔴 Error in adminUpdateApplicationStatusController:",
      err.message,
    );
    const status = err.message.includes("Access denied") ? 403 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

// ================= Get All Admins =================
const getAllAdminsController = async (req, res) => {
  try {
    console.log("🟢 getAllAdminsController called");
    await requireAdmin(req.user.uid);
    const result = await getAllAdmins();
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error("🔴 Error in getAllAdminsController:", err.message);
    const status = err.message.includes("Access denied") ? 403 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

// ================= Get Admin Logs =================
const getAdminLogsController = async (req, res) => {
  try {
    console.log("🟢 getAdminLogsController called");
    await requireAdmin(req.user.uid);
    const { limit = 50 } = req.query;
    const result = await getAdminLogs(parseInt(limit));
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error("🔴 Error in getAdminLogsController:", err.message);
    const status = err.message.includes("Access denied") ? 403 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

// ================= Search Users =================
const searchUsersController = async (req, res) => {
  try {
    console.log("🟢 searchUsersController called with query:", req.query.q);
    await requireAdmin(req.user.uid);
    const { q, role } = req.query;
    if (!q) {
      return res
        .status(400)
        .json({ success: false, message: "Search term is required" });
    }
    const result = await searchUsers(q, role);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error("🔴 Error in searchUsersController:", err.message);
    const status = err.message.includes("Access denied") ? 403 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

const updateAllCommentCounts = async (req, res) => {
  try {
    const { admin, db } = require("../firebase");
    const jobsSnapshot = await db.collection("jobs").get();
    let updatedCount = 0;

    for (const jobDoc of jobsSnapshot.docs) {
      const commentsSnapshot = await db
        .collection("comments")
        .where("jobId", "==", jobDoc.id)
        .get();
      await db.collection("jobs").doc(jobDoc.id).update({
        commentCount: commentsSnapshot.size,
      });
      updatedCount++;
      console.log(`✅ Job ${jobDoc.id}: ${commentsSnapshot.size} comments`);
    }

    res.status(200).json({
      success: true,
      message: `Updated ${updatedCount} jobs with comment counts`,
    });
  } catch (error) {
    console.error("Error updating comment counts:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// ================= EXPORTS =================
module.exports = {
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
  updateAllCommentCounts,
};

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
    await requireAdmin(req.user.uid);
    const stats = await getPlatformStats();
    res.status(200).json({ success: true, data: stats });
  } catch (err) {
    const status = err.message.includes("Access denied") ? 403 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

// ================= Get All Users =================
const getAllUsersController = async (req, res) => {
  try {
    await requireAdmin(req.user.uid);
    const { role, page = 1, limit = 20 } = req.query;
    const result = await getAllUsers(role, parseInt(page), parseInt(limit));
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    const status = err.message.includes("Access denied") ? 403 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

// ================= Make User Admin =================
const makeAdminController = async (req, res) => {
  try {
    await requireAdmin(req.user.uid);
    const { uid } = req.params;
    const result = await makeAdmin(uid, req.user.uid);
    res.status(200).json(result);
  } catch (err) {
    const status = err.message.includes("Access denied") ? 403 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

// ================= Remove Admin Role =================
const removeAdminController = async (req, res) => {
  try {
    await requireAdmin(req.user.uid);
    const { uid } = req.params;
    const result = await removeAdmin(uid, req.user.uid);
    res.status(200).json(result);
  } catch (err) {
    const status = err.message.includes("Access denied") ? 403 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

// ================= Admin Delete Job =================
const adminDeleteJobController = async (req, res) => {
  try {
    await requireAdmin(req.user.uid);
    const { jobId } = req.params;
    const result = await adminDeleteJob(jobId, req.user.uid);
    res.status(200).json(result);
  } catch (err) {
    const status = err.message.includes("Access denied") ? 403 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

// ================= Admin Delete User =================
const adminDeleteUserController = async (req, res) => {
  try {
    await requireAdmin(req.user.uid);
    const { uid } = req.params;
    const result = await adminDeleteUser(uid, req.user.uid);
    res.status(200).json(result);
  } catch (err) {
    const status = err.message.includes("Access denied") ? 403 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

// ================= Admin Get All Jobs =================
const adminGetAllJobsController = async (req, res) => {
  try {
    await requireAdmin(req.user.uid);
    const { department, status } = req.query;
    const result = await adminGetAllJobs({ department, status });
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    const status = err.message.includes("Access denied") ? 403 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

// ================= Admin Update Job Status =================
const adminUpdateJobStatusController = async (req, res) => {
  try {
    await requireAdmin(req.user.uid);
    const { jobId } = req.params;
    const { status } = req.body;
    const result = await adminUpdateJobStatus(jobId, status, req.user.uid);
    res.status(200).json(result);
  } catch (err) {
    const status = err.message.includes("Access denied") ? 403 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

// ================= Admin Get All Applications =================
const adminGetAllApplicationsController = async (req, res) => {
  try {
    await requireAdmin(req.user.uid);
    const { status } = req.query;
    const result = await adminGetAllApplications({ status });
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    const status = err.message.includes("Access denied") ? 403 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

// ================= Admin Update Application Status =================
const adminUpdateApplicationStatusController = async (req, res) => {
  try {
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
    const status = err.message.includes("Access denied") ? 403 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

// ================= Get All Admins =================
const getAllAdminsController = async (req, res) => {
  try {
    await requireAdmin(req.user.uid);
    const result = await getAllAdmins();
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    const status = err.message.includes("Access denied") ? 403 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

// ================= Get Admin Logs =================
const getAdminLogsController = async (req, res) => {
  try {
    await requireAdmin(req.user.uid);
    const { limit = 50 } = req.query;
    const result = await getAdminLogs(parseInt(limit));
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    const status = err.message.includes("Access denied") ? 403 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

// ================= Search Users =================
const searchUsersController = async (req, res) => {
  try {
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
    const status = err.message.includes("Access denied") ? 403 : 500;
    res.status(status).json({ success: false, message: err.message });
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
};

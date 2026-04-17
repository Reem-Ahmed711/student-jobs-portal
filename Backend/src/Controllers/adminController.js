const { admin, db } = require("../config/firebase");

const {
  getAllEmployers,
  getEmployerByIdAsAdmin,
  updateEmployerAsAdmin,
  deleteEmployerAsAdmin,
  toggleEmployerStatus,

  getAllStudents,
  getStudentByIdAsAdmin,
  updateStudentAsAdmin,
  deleteStudentAsAdmin,
  toggleStudentStatus,

  getPlatformStats,
} = require("../services/adminService");


const getAllEmployersController = async (req, res) => {
  try {
    const result = await getAllEmployers();
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const getEmployerByIdController = async (req, res) => {
  try {
    const result = await getEmployerByIdAsAdmin(req.params.uid);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const updateEmployerController = async (req, res) => {
  try {
    const result = await updateEmployerAsAdmin(req.params.uid, req.body);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const deleteEmployerController = async (req, res) => {
  try {
    const result = await deleteEmployerAsAdmin(req.params.uid);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const toggleEmployerStatusController = async (req, res) => {
  try {
    const result = await toggleEmployerStatus(req.params.uid);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};


const getAllStudentsController = async (req, res) => {
  try {
    const result = await getAllStudents();
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const getStudentByIdController = async (req, res) => {
  try {
    const result = await getStudentByIdAsAdmin(req.params.uid);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const updateStudentController = async (req, res) => {
  try {
    const result = await updateStudentAsAdmin(req.params.uid, req.body);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const deleteStudentController = async (req, res) => {
  try {
    const result = await deleteStudentAsAdmin(req.params.uid);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const toggleStudentStatusController = async (req, res) => {
  try {
    const result = await toggleStudentStatus(req.params.uid);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const getPlatformStatsController = async (req, res) => {
  try {
    const result = await getPlatformStats();
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};


const makeAdminController = async (req, res) => {
  try {
    const uid = req.params.uid;

    await db.collection("users").doc(uid).update({ role: "admin" });
    await admin.auth().setCustomUserClaims(uid, { role: "admin" });

    res.json({ success: true, message: "User promoted to admin" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const removeAdminController = async (req, res) => {
  try {
    const uid = req.params.uid;

    await db.collection("users").doc(uid).update({ role: "student" });
    await admin.auth().setCustomUserClaims(uid, { role: "student" });

    res.json({ success: true, message: "Admin role removed" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const adminDeleteUserController = async (req, res) => {
  try {
    const uid = req.params.uid;

    await admin.auth().deleteUser(uid);
    await db.collection("users").doc(uid).delete();

    res.json({ success: true, message: "User deleted" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};


const adminGetAllJobsController = async (req, res) => {
  try {
    const snap = await db.collection("jobs").get();

    const jobs = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ success: true, data: jobs });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const adminDeleteJobController = async (req, res) => {
  try {
    await db.collection("jobs").doc(req.params.jobId).delete();
    res.json({ success: true, message: "Job deleted" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const adminUpdateJobStatusController = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status } = req.body;

    await db.collection("jobs").doc(jobId).update({
      status,
      updatedAt: new Date().toISOString(),
    });

    res.json({ success: true, message: "Job status updated" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};


const adminGetAllApplicationsController = async (req, res) => {
  try {
    const snap = await db.collection("applications").get();

    const applications = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ success: true, data: applications });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const adminUpdateApplicationStatusController = async (req, res) => {
  try {
    const { appId } = req.params;
    const { status } = req.body;

    await db.collection("applications").doc(appId).update({
      status,
      updatedAt: new Date().toISOString(),
    });

    res.json({ success: true, message: "Application updated" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};


const getAllAdminsController = async (req, res) => {
  try {
    const snap = await db.collection("users")
      .where("role", "==", "admin")
      .get();

    const admins = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ success: true, data: admins });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports = {
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
};
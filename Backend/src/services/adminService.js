const { db } = require("../config/firebase");
const admin = require("firebase-admin");

const serverTimestamp = admin.firestore.FieldValue.serverTimestamp;

// ── Helpers ───────────────────────────────────────────────────────
const getUserByUid = async (uid) => {
  const snap = await db.collection("users").doc(uid).get();
  return snap.exists ? { id: snap.id, ...snap.data() } : null;
};

const getUsersByRole = async (role) => {
  const snap = await db.collection("users").where("role", "==", role).get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// ════════════════════════════════════════════════════════
//  EMPLOYER MANAGEMENT
// ════════════════════════════════════════════════════════

const getAllEmployers = async () => {
  try {
    const employers = await getUsersByRole("employer");
    return { success: true, data: employers };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const getEmployerByIdAsAdmin = async (targetUid) => {
  try {
    const user = await getUserByUid(targetUid);
    if (!user) return { success: false, message: "Employer not found" };
    if (user.role !== "employer")
      return { success: false, message: "User is not an employer" };
    return { success: true, data: user };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const updateEmployerAsAdmin = async (targetUid, updatedData) => {
  try {
    const user = await getUserByUid(targetUid);
    if (!user) return { success: false, message: "Employer not found" };
    if (user.role !== "employer")
      return { success: false, message: "User is not an employer" };

    const restricted = ["uid", "createdAt"];
    restricted.forEach((f) => delete updatedData[f]);

    await db.collection("users").doc(targetUid).update({
      ...updatedData,
      updatedAt: serverTimestamp(),
    });

    return { success: true, message: "Employer updated successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const deleteEmployerAsAdmin = async (targetUid) => {
  try {
    const user = await getUserByUid(targetUid);
    if (!user) return { success: false, message: "Employer not found" };
    if (user.role !== "employer")
      return { success: false, message: "User is not an employer" };

    await db.collection("users").doc(targetUid).delete();
    return { success: true, message: "Employer deleted successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const toggleEmployerStatus = async (targetUid) => {
  try {
    const user = await getUserByUid(targetUid);
    if (!user) return { success: false, message: "Employer not found" };
    if (user.role !== "employer")
      return { success: false, message: "User is not an employer" };

    const newStatus = !user.isActive;
    await db.collection("users").doc(targetUid).update({
      isActive: newStatus,
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      message: `Employer ${newStatus ? "activated" : "deactivated"} successfully`,
      isActive: newStatus,
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// ════════════════════════════════════════════════════════
//  STUDENT MANAGEMENT
// ════════════════════════════════════════════════════════

const getAllStudents = async () => {
  try {
    const students = await getUsersByRole("student");
    return { success: true, data: students };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const getStudentByIdAsAdmin = async (targetUid) => {
  try {
    const user = await getUserByUid(targetUid);
    if (!user) return { success: false, message: "Student not found" };
    if (user.role !== "student")
      return { success: false, message: "User is not a student" };
    return { success: true, data: user };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const updateStudentAsAdmin = async (targetUid, updatedData) => {
  try {
    const user = await getUserByUid(targetUid);
    if (!user) return { success: false, message: "Student not found" };
    if (user.role !== "student")
      return { success: false, message: "User is not a student" };

    const restricted = ["uid", "createdAt"];
    restricted.forEach((f) => delete updatedData[f]);

    await db.collection("users").doc(targetUid).update({
      ...updatedData,
      updatedAt: serverTimestamp(),
    });

    return { success: true, message: "Student updated successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const deleteStudentAsAdmin = async (targetUid) => {
  try {
    const user = await getUserByUid(targetUid);
    if (!user) return { success: false, message: "Student not found" };
    if (user.role !== "student")
      return { success: false, message: "User is not a student" };

    await db.collection("users").doc(targetUid).delete();
    return { success: true, message: "Student deleted successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const toggleStudentStatus = async (targetUid) => {
  try {
    const user = await getUserByUid(targetUid);
    if (!user) return { success: false, message: "Student not found" };
    if (user.role !== "student")
      return { success: false, message: "User is not a student" };

    const newStatus = !user.isActive;
    await db.collection("users").doc(targetUid).update({
      isActive: newStatus,
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      message: `Student ${newStatus ? "activated" : "deactivated"} successfully`,
      isActive: newStatus,
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// ════════════════════════════════════════════════════════
//  PLATFORM STATS
// ════════════════════════════════════════════════════════

const getPlatformStats = async () => {
  try {
    const [employers, students] = await Promise.all([
      getUsersByRole("employer"),
      getUsersByRole("student"),
    ]);

    const [jobsSnap, appsSnap] = await Promise.all([
      db.collection("jobs").get(),
      db.collection("applications").get(),
    ]);

    return {
      success: true,
      data: {
        totalEmployers: employers.length,
        activeEmployers: employers.filter((e) => e.isActive).length,
        totalStudents: students.length,
        activeStudents: students.filter((s) => s.isActive).length,
        totalJobs: jobsSnap.size,
        totalApplications: appsSnap.size,
      },
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

module.exports = {
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
};
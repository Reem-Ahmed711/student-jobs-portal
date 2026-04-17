// MOBILE-APP/app-backend/src/Service/adminService.js
const { admin, db } = require("../firebase");

// ================= Get Platform Statistics =================
const getPlatformStats = async () => {
  // Total students
  const studentsSnap = await db
    .collection("users")
    .where("role", "==", "student")
    .get();
  const totalStudents = studentsSnap.size;

  // Total employers
  const employersSnap = await db
    .collection("users")
    .where("role", "==", "employer")
    .get();
  const totalEmployers = employersSnap.size;

  // Total admins
  const adminsSnap = await db
    .collection("users")
    .where("role", "==", "admin")
    .get();
  const totalAdmins = adminsSnap.size;

  // Total jobs
  const jobsSnap = await db.collection("jobs").get();
  const totalJobs = jobsSnap.size;

  // Total applications
  const appsSnap = await db.collection("applications").get();
  const totalApplications = appsSnap.size;

  // Jobs per department
  const jobsByDepartment = {};
  jobsSnap.forEach((doc) => {
    const data = doc.data();
    const dept = data.department || "غير محدد";
    jobsByDepartment[dept] = (jobsByDepartment[dept] || 0) + 1;
  });

  // Students per department
  const studentsByDepartment = {};
  studentsSnap.forEach((doc) => {
    const data = doc.data();
    const dept = data.department || "غير محدد";
    studentsByDepartment[dept] = (studentsByDepartment[dept] || 0) + 1;
  });

  // Employers per industry
  const employersByIndustry = {};
  employersSnap.forEach((doc) => {
    const data = doc.data();
    const industry = data.industry || "غير محدد";
    employersByIndustry[industry] = (employersByIndustry[industry] || 0) + 1;
  });

  // Applications by status
  const applicationsByStatus = { pending: 0, accepted: 0, rejected: 0 };
  appsSnap.forEach((doc) => {
    const data = doc.data();
    const status = data.status || "pending";
    applicationsByStatus[status] = (applicationsByStatus[status] || 0) + 1;
  });

  // Recent registrations (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  let recentRegistrations = 0;

  studentsSnap.forEach((doc) => {
    const createdAt = doc.data().createdAt;
    if (createdAt && new Date(createdAt) >= sevenDaysAgo) recentRegistrations++;
  });

  employersSnap.forEach((doc) => {
    const createdAt = doc.data().createdAt;
    if (createdAt && new Date(createdAt) >= sevenDaysAgo) recentRegistrations++;
  });

  // Top rated students
  const topStudents = [];
  for (const doc of studentsSnap.docs) {
    const ratingsSnap = await db
      .collection("ratings")
      .where("ratedUid", "==", doc.id)
      .get();

    if (!ratingsSnap.empty) {
      const ratings = ratingsSnap.docs.map((d) => d.data().rating);
      const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
      topStudents.push({
        uid: doc.id,
        name: doc.data().name,
        department: doc.data().department,
        averageRating: parseFloat(avgRating.toFixed(1)),
        totalRatings: ratings.length,
      });
    }
  }
  topStudents.sort((a, b) => b.averageRating - a.averageRating);

  // Top employers (by number of jobs)
  const topEmployers = [];
  for (const doc of employersSnap.docs) {
    const jobsCountSnap = await db
      .collection("jobs")
      .where("employerUid", "==", doc.id)
      .get();

    topEmployers.push({
      uid: doc.id,
      name: doc.data().name || doc.data().companyName,
      company: doc.data().companyName,
      totalJobs: jobsCountSnap.size,
    });
  }
  topEmployers.sort((a, b) => b.totalJobs - a.totalJobs);

  return {
    totalStudents,
    totalEmployers,
    totalAdmins,
    totalJobs,
    totalApplications,
    jobsByDepartment,
    studentsByDepartment,
    employersByIndustry,
    applicationsByStatus,
    recentRegistrations,
    topStudents: topStudents.slice(0, 10),
    topEmployers: topEmployers.slice(0, 10),
  };
};

// ================= Get All Users =================
const getAllUsers = async (role = null, page = 1, limit = 20) => {
  let query = db.collection("users");
  if (role) {
    query = query.where("role", "==", role);
  }

  const snapshot = await query.get();
  const allUsers = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  // Pagination
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedUsers = allUsers.slice(start, end);

  return {
    users: paginatedUsers,
    total: allUsers.length,
    page,
    totalPages: Math.ceil(allUsers.length / limit),
  };
};

// ================= Make User Admin =================
const makeAdmin = async (targetUid, adminUid) => {
  // Verify the target user exists
  const targetDoc = await db.collection("users").doc(targetUid).get();
  if (!targetDoc.exists) {
    throw new Error("User not found");
  }

  // Update Auth claims
  await admin.auth().setCustomUserClaims(targetUid, { role: "admin" });

  // Update Firestore
  await db.collection("users").doc(targetUid).update({
    role: "admin",
    madeAdminAt: admin.firestore.FieldValue.serverTimestamp(),
    madeAdminBy: adminUid,
  });

  // Log the action
  await db.collection("adminLogs").add({
    action: "make_admin",
    targetUid,
    performedBy: adminUid,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { success: true, message: "User promoted to admin successfully" };
};

// ================= Remove Admin Role =================
const removeAdmin = async (targetUid, adminUid) => {
  const targetDoc = await db.collection("users").doc(targetUid).get();
  if (!targetDoc.exists) {
    throw new Error("User not found");
  }

  const targetData = targetDoc.data();

  // Check if it's the main admin (cannot remove)
  if (targetData.email === process.env.ADMIN_EMAIL) {
    throw new Error("Cannot remove the main admin");
  }

  await admin.auth().setCustomUserClaims(targetUid, { role: "student" });
  await db.collection("users").doc(targetUid).update({
    role: "student",
    removedAdminAt: admin.firestore.FieldValue.serverTimestamp(),
    removedAdminBy: adminUid,
  });

  await db.collection("adminLogs").add({
    action: "remove_admin",
    targetUid,
    performedBy: adminUid,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { success: true, message: "Admin role removed successfully" };
};

// ================= Admin Delete Job =================
const adminDeleteJob = async (jobId, adminUid) => {
  const jobDoc = await db.collection("jobs").doc(jobId).get();
  if (!jobDoc.exists) {
    throw new Error("Job not found");
  }

  const jobData = jobDoc.data();

  // Delete related applications
  const appsSnap = await db
    .collection("applications")
    .where("jobId", "==", jobId)
    .get();
  const batch = db.batch();
  appsSnap.forEach((doc) => batch.delete(doc.ref));
  batch.delete(db.collection("jobs").doc(jobId));
  await batch.commit();

  // Log the action
  await db.collection("adminLogs").add({
    action: "delete_job",
    jobId,
    jobTitle: jobData.title,
    performedBy: adminUid,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { success: true, message: "Job and related applications deleted" };
};

// ================= Admin Delete User =================
const adminDeleteUser = async (targetUid, adminUid) => {
  const targetDoc = await db.collection("users").doc(targetUid).get();
  if (!targetDoc.exists) {
    throw new Error("User not found");
  }

  const targetData = targetDoc.data();

  // Cannot delete main admin
  if (targetData.email === process.env.ADMIN_EMAIL) {
    throw new Error("Cannot delete the main admin");
  }

  // Delete user's applications
  const appsSnap = await db
    .collection("applications")
    .where("studentUid", "==", targetUid)
    .get();
  const batch1 = db.batch();
  appsSnap.forEach((doc) => batch1.delete(doc.ref));

  // Delete ratings received
  const ratingsReceivedSnap = await db
    .collection("ratings")
    .where("ratedUid", "==", targetUid)
    .get();
  ratingsReceivedSnap.forEach((doc) => batch1.delete(doc.ref));

  // Delete ratings given
  const ratingsGivenSnap = await db
    .collection("ratings")
    .where("ratedBy", "==", targetUid)
    .get();
  ratingsGivenSnap.forEach((doc) => batch1.delete(doc.ref));

  if (
    !appsSnap.empty ||
    !ratingsReceivedSnap.empty ||
    !ratingsGivenSnap.empty
  ) {
    await batch1.commit();
  }

  // Delete user's jobs (if employer)
  const jobsSnap = await db
    .collection("jobs")
    .where("employerUid", "==", targetUid)
    .get();
  const batch2 = db.batch();
  jobsSnap.forEach((jobDoc) => {
    batch2.delete(jobDoc.ref);
  });
  if (!jobsSnap.empty) {
    await batch2.commit();
  }

  // Delete from Firestore
  await db.collection("users").doc(targetUid).delete();

  // Try to delete from Auth
  try {
    await admin.auth().deleteUser(targetUid);
  } catch (err) {
    console.log(
      "User not in Auth, continuing with Firestore delete only:",
      err.message,
    );
  }

  // Log the action
  await db.collection("adminLogs").add({
    action: "delete_user",
    targetUid,
    targetName: targetData.name,
    targetRole: targetData.role,
    performedBy: adminUid,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { success: true, message: "User deleted completely" };
};

// ================= Admin Get All Jobs =================
const adminGetAllJobs = async (filters = {}) => {
  let query = db.collection("jobs");

  if (filters.department) {
    query = query.where("department", "==", filters.department);
  }

  if (filters.status) {
    query = query.where("status", "==", filters.status);
  }

  const snapshot = await query.get();

  const jobs = [];
  for (const doc of snapshot.docs) {
    const jobData = { id: doc.id, ...doc.data() };

    // Get employer info
    const employerDoc = await db
      .collection("users")
      .doc(jobData.employerUid)
      .get();
    if (employerDoc.exists) {
      jobData.employer = {
        name: employerDoc.data().name,
        company: employerDoc.data().companyName,
      };
    }

    // Get applications count
    const appsCount = await db
      .collection("applications")
      .where("jobId", "==", doc.id)
      .get();
    jobData.applicationsCount = appsCount.size;

    jobs.push(jobData);
  }

  return jobs;
};

// ================= Admin Update Job Status =================
const adminUpdateJobStatus = async (jobId, status, adminUid) => {
  const validStatuses = ["active", "closed", "paused", "rejected"];
  if (!validStatuses.includes(status)) {
    throw new Error(
      "Invalid status. Must be: active, closed, paused, rejected",
    );
  }

  await db.collection("jobs").doc(jobId).update({
    status,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    statusUpdatedBy: adminUid,
  });

  await db.collection("adminLogs").add({
    action: "update_job_status",
    jobId,
    newStatus: status,
    performedBy: adminUid,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { success: true, message: `Job status updated to ${status}` };
};

// ================= Admin Get All Applications =================
const adminGetAllApplications = async (filters = {}) => {
  let query = db.collection("applications");

  if (filters.status) {
    query = query.where("status", "==", filters.status);
  }

  const snapshot = await query.get();

  const applications = [];
  for (const doc of snapshot.docs) {
    const appData = { id: doc.id, ...doc.data() };

    // Get student info
    const studentDoc = await db
      .collection("users")
      .doc(appData.studentUid)
      .get();
    if (studentDoc.exists) {
      appData.student = {
        uid: studentDoc.id,
        name: studentDoc.data().name,
        email: studentDoc.data().email,
        department: studentDoc.data().department,
        year: studentDoc.data().year,
        gpa: studentDoc.data().gpa,
      };
    }

    // Get job info
    const jobDoc = await db.collection("jobs").doc(appData.jobId).get();
    if (jobDoc.exists) {
      const jobData = jobDoc.data();
      appData.job = {
        id: jobDoc.id,
        title: jobData.title,
        department: jobData.department,
      };

      // Get employer info
      if (jobData.employerUid) {
        const employerDoc = await db
          .collection("users")
          .doc(jobData.employerUid)
          .get();
        if (employerDoc.exists) {
          appData.job.employer =
            employerDoc.data().name || employerDoc.data().companyName;
        }
      }
    }

    applications.push(appData);
  }

  return applications;
};

// ================= Admin Update Application Status =================
const adminUpdateApplicationStatus = async (
  applicationId,
  status,
  adminUid,
) => {
  const validStatuses = ["pending", "accepted", "rejected", "under_review"];
  if (!validStatuses.includes(status)) {
    throw new Error("Invalid status");
  }

  await db.collection("applications").doc(applicationId).update({
    status,
    reviewedAt: admin.firestore.FieldValue.serverTimestamp(),
    reviewedBy: adminUid,
  });

  await db.collection("adminLogs").add({
    action: "update_application_status",
    applicationId,
    newStatus: status,
    performedBy: adminUid,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { success: true, message: `Application status updated to ${status}` };
};

// ================= Get All Admins =================
const getAllAdmins = async () => {
  const snapshot = await db
    .collection("users")
    .where("role", "==", "admin")
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// ================= Get Admin Logs =================
const getAdminLogs = async (limit = 50) => {
  const snapshot = await db
    .collection("adminLogs")
    .orderBy("timestamp", "desc")
    .limit(limit)
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// ================= Search Users =================
const searchUsers = async (searchTerm, role = null) => {
  let query = db.collection("users");
  if (role) {
    query = query.where("role", "==", role);
  }

  const snapshot = await query.get();

  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((user) => {
      const name = (user.name || "").toLowerCase();
      const email = (user.email || "").toLowerCase();
      const search = searchTerm.toLowerCase();
      return name.includes(search) || email.includes(search);
    });
};

// ================= EXPORTS =================
module.exports = {
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
};

const { admin, db } = require("../firebase");

const getPlatformStats = async () => {
  try {
    console.log("📊 Fetching platform stats...");
    
    // Users
    const studentsSnap = await db.collection("users").where("role", "==", "student").get();
    const employersSnap = await db.collection("users").where("role", "==", "employer").get();
    const adminsSnap = await db.collection("users").where("role", "==", "admin").get();

    const totalStudents = studentsSnap.size;
    const totalEmployers = employersSnap.size;
    const totalAdmins = adminsSnap.size;

    // Jobs
    const allJobsSnap = await db.collection("jobs").get();
    const totalJobs = allJobsSnap.docs.filter(doc => doc.data().status === "active").length;

    // Applications
    const appsSnap = await db.collection("applications").get();
    const totalApplications = appsSnap.size;

    // Jobs per department
    const jobsByDepartment = {};
    allJobsSnap.forEach((doc) => {
      const dept = doc.data().department || "not defined";
      jobsByDepartment[dept] = (jobsByDepartment[dept] || 0) + 1;
    });

    // Students per department
    const studentsByDepartment = {};
    studentsSnap.forEach((doc) => {
      const dept = doc.data().department || "not defined";
      studentsByDepartment[dept] = (studentsByDepartment[dept] || 0) + 1;
    });

    // Employers per industry
    const employersByIndustry = {};
    employersSnap.forEach((doc) => {
      const industry = doc.data().industry || "not defined";
      employersByIndustry[industry] = (employersByIndustry[industry] || 0) + 1;
    });

    // Applications by status
    const applicationsByStatus = { pending: 0, accepted: 0, rejected: 0 };
    appsSnap.forEach((doc) => {
      const status = doc.data().status || "pending";
      applicationsByStatus[status] = (applicationsByStatus[status] || 0) + 1;
    });

    // Recent registrations (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    let recentRegistrations = 0;

    [...studentsSnap.docs, ...employersSnap.docs].forEach((doc) => {
      const createdAt = doc.data().createdAt;
      if (createdAt) {
        const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
        if (date >= sevenDaysAgo) recentRegistrations++;
      }
    });

    // Top rated students
    const topStudents = [];
    for (const doc of studentsSnap.docs) {
      try {
        const ratingsSnap = await db.collection("ratings").where("ratedUid", "==", doc.id).get();
        if (!ratingsSnap.empty) {
          const ratings = ratingsSnap.docs.map((d) => d.data().rating);
          const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
          topStudents.push({
            uid: doc.id,
            name: doc.data().name || "Unknown",
            department: doc.data().department || "not defined",
            averageRating: parseFloat(avgRating.toFixed(1)),
            totalRatings: ratings.length,
          });
        }
      } catch (err) {
        console.log(`Error fetching ratings for student ${doc.id}:`, err.message);
      }
    }
    topStudents.sort((a, b) => b.averageRating - a.averageRating);

    // Top employers
    const topEmployers = [];
    for (const doc of employersSnap.docs) {
      try {
        const jobsCountSnap = await db.collection("jobs").where("employerUid", "==", doc.id).get();
        topEmployers.push({
          uid: doc.id,
          name: doc.data().name || doc.data().companyName || "Unknown",
          company: doc.data().companyName || "not defined",
          totalJobs: jobsCountSnap.size,
        });
      } catch (err) {
        console.log(`Error fetching jobs for employer ${doc.id}:`, err.message);
      }
    }
    topEmployers.sort((a, b) => b.totalJobs - a.totalJobs);

    console.log("✅ Platform stats fetched successfully");
    
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
  } catch (error) {
    console.error("❌ Error in getPlatformStats:", error.message);
    throw new Error(`Failed to fetch platform stats: ${error.message}`);
  }
};

// ================= Get All Users =================
const getAllUsers = async (role = null, page = 1, limit = 20) => {
  try {
    let query = db.collection("users");
    if (role && role !== "all" && role.trim() !== "") query = query.where("role", "==", role);
    const snapshot = await query.get();
    const allUsers = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const start = (page - 1) * limit;
    const paginatedUsers = allUsers.slice(start, start + limit);
    return {
      users: paginatedUsers,
      total: allUsers.length,
      page,
      totalPages: Math.ceil(allUsers.length / limit),
    };
  } catch (error) {
    console.error("❌ Error in getAllUsers:", error.message);
    throw new Error(`Failed to fetch users: ${error.message}`);
  }
};

// ================= Make User Admin =================
const makeAdmin = async (targetUid, adminUid) => {
  try {
    if (!targetUid || targetUid.trim() === "") throw new Error("Target UID is required");
    
    const targetDoc = await db.collection("users").doc(targetUid).get();
    if (!targetDoc.exists) throw new Error("User not found");
    
    await admin.auth().setCustomUserClaims(targetUid, { role: "admin" });
    await db.collection("users").doc(targetUid).update({
      role: "admin",
      madeAdminAt: admin.firestore.FieldValue.serverTimestamp(),
      madeAdminBy: adminUid,
    });
    await db.collection("adminLogs").add({
      action: "make_admin", targetUid, performedBy: adminUid,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { success: true, message: "User promoted to admin successfully" };
  } catch (error) {
    console.error("❌ Error in makeAdmin:", error.message);
    throw error;
  }
};

// ================= Remove Admin Role =================
const removeAdmin = async (targetUid, adminUid) => {
  try {
    if (!targetUid || targetUid.trim() === "") throw new Error("Target UID is required");
    
    const targetDoc = await db.collection("users").doc(targetUid).get();
    if (!targetDoc.exists) throw new Error("User not found");
    if (targetDoc.data().email === process.env.ADMIN_EMAIL) throw new Error("Cannot remove the main admin");
    
    await admin.auth().setCustomUserClaims(targetUid, { role: "student" });
    await db.collection("users").doc(targetUid).update({
      role: "student",
      removedAdminAt: admin.firestore.FieldValue.serverTimestamp(),
      removedAdminBy: adminUid,
    });
    await db.collection("adminLogs").add({
      action: "remove_admin", targetUid, performedBy: adminUid,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { success: true, message: "Admin role removed successfully" };
  } catch (error) {
    console.error("❌ Error in removeAdmin:", error.message);
    throw error;
  }
};

// ================= Admin Delete Job =================
const adminDeleteJob = async (jobId, adminUid) => {
  try {
    if (!jobId || jobId.trim() === "") throw new Error("Job ID is required");
    
    const jobDoc = await db.collection("jobs").doc(jobId).get();
    if (!jobDoc.exists) throw new Error("Job not found");
    
    const jobData = jobDoc.data();
    const appsSnap = await db.collection("applications").where("jobId", "==", jobId).get();
    const batch = db.batch();
    appsSnap.forEach((doc) => batch.delete(doc.ref));
    batch.delete(db.collection("jobs").doc(jobId));
    await batch.commit();
    
    await db.collection("adminLogs").add({
      action: "delete_job", jobId, jobTitle: jobData.title || "Untitled", performedBy: adminUid,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { success: true, message: "Job and related applications deleted" };
  } catch (error) {
    console.error("❌ Error in adminDeleteJob:", error.message);
    throw error;
  }
};

// ================= Admin Delete User =================
const adminDeleteUser = async (targetUid, adminUid) => {
  try {
    if (!targetUid || targetUid.trim() === "") throw new Error("Target UID is required");
    
    const targetDoc = await db.collection("users").doc(targetUid).get();
    if (!targetDoc.exists) throw new Error("User not found");
    
    const targetData = targetDoc.data();
    if (targetData.email === process.env.ADMIN_EMAIL) throw new Error("Cannot delete the main admin");

    const appsSnap = await db.collection("applications").where("studentUid", "==", targetUid).get();
    const ratingsReceivedSnap = await db.collection("ratings").where("ratedUid", "==", targetUid).get();
    const ratingsGivenSnap = await db.collection("ratings").where("ratedBy", "==", targetUid).get();
    
    const batch1 = db.batch();
    appsSnap.forEach((doc) => batch1.delete(doc.ref));
    ratingsReceivedSnap.forEach((doc) => batch1.delete(doc.ref));
    ratingsGivenSnap.forEach((doc) => batch1.delete(doc.ref));
    if (!appsSnap.empty || !ratingsReceivedSnap.empty || !ratingsGivenSnap.empty) await batch1.commit();

    const jobsSnap = await db.collection("jobs").where("employerUid", "==", targetUid).get();
    if (!jobsSnap.empty) {
      const batch2 = db.batch();
      jobsSnap.forEach((doc) => batch2.delete(doc.ref));
      await batch2.commit();
    }

    await db.collection("users").doc(targetUid).delete();
    try { await admin.auth().deleteUser(targetUid); } catch (err) { console.log("Auth delete skipped:", err.message); }

    await db.collection("adminLogs").add({
      action: "delete_user", targetUid, targetName: targetData.name || "Unknown",
      targetRole: targetData.role, performedBy: adminUid,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { success: true, message: "User deleted completely" };
  } catch (error) {
    console.error("❌ Error in adminDeleteUser:", error.message);
    throw error;
  }
};

// ================= Admin Get All Jobs (المعدل بالكامل) =================
const adminGetAllJobs = async (filters = {}) => {
  try {
    console.log("📊 Fetching all jobs with filters:", filters);
    
    let query = db.collection("jobs");
    
    // تطبيق الفلاتر مع التحقق
    if (filters.department && filters.department !== "all" && filters.department.trim() !== "") {
      query = query.where("department", "==", filters.department);
    }
    if (filters.status && filters.status !== "all" && filters.status.trim() !== "") {
      query = query.where("status", "==", filters.status);
    }
    
    const snapshot = await query.get();
    console.log(`📊 Found ${snapshot.size} jobs in Firestore`);
    
    const jobs = [];
    
    for (const doc of snapshot.docs) {
      try {
        const jobData = { id: doc.id, ...doc.data() };
        
        // جلب بيانات الـ employer بشكل آمن
        if (jobData.employerUid && jobData.employerUid.trim() !== "") {
          try {
            const employerDoc = await db.collection("users").doc(jobData.employerUid).get();
            if (employerDoc.exists) {
              jobData.employer = {
                name: employerDoc.data().name || "Unknown",
                company: employerDoc.data().companyName || "No Company"
              };
            } else {
              jobData.employer = { name: "Unknown", company: "Unknown" };
            }
          } catch (err) {
            console.log(`Error fetching employer for job ${doc.id}:`, err.message);
            jobData.employer = { name: "Error", company: "Error" };
          }
        } else {
          jobData.employer = { name: "No Employer", company: "No Company" };
        }
        
        // جلب عدد التقديمات بشكل آمن
        try {
          const appsCount = await db.collection("applications").where("jobId", "==", doc.id).get();
          jobData.applicationsCount = appsCount.size;
        } catch (err) {
          console.log(`Error counting applications for job ${doc.id}:`, err.message);
          jobData.applicationsCount = 0;
        }
        
        jobs.push(jobData);
      } catch (err) {
        console.error(`Error processing job ${doc.id}:`, err.message);
        continue; // استمر مع بقية الوظائف
      }
    }
    
    console.log(`✅ Successfully processed ${jobs.length} jobs`);
    return jobs;
  } catch (error) {
    console.error("❌ Error in adminGetAllJobs:", error.message);
    throw new Error(`Failed to fetch jobs: ${error.message}`);
  }
};

// ================= Admin Update Job Status =================
const adminUpdateJobStatus = async (jobId, status, adminUid) => {
  try {
    if (!jobId || jobId.trim() === "") throw new Error("Job ID is required");
    if (!status || status.trim() === "") throw new Error("Status is required");
    
    const validStatuses = ["active", "closed", "paused", "rejected"];
    if (!validStatuses.includes(status)) throw new Error("Invalid status. Must be: active, closed, paused, rejected");
    
    const jobRef = db.collection("jobs").doc(jobId);
    const jobDoc = await jobRef.get();
    if (!jobDoc.exists) throw new Error("Job not found");
    
    await jobRef.update({ 
      status, 
      updatedAt: admin.firestore.FieldValue.serverTimestamp(), 
      statusUpdatedBy: adminUid 
    });
    
    await db.collection("adminLogs").add({ 
      action: "update_job_status", 
      jobId, 
      newStatus: status, 
      performedBy: adminUid, 
      timestamp: admin.firestore.FieldValue.serverTimestamp() 
    });
    
    return { success: true, message: `Job status updated to ${status}` };
  } catch (error) {
    console.error("❌ Error in adminUpdateJobStatus:", error.message);
    throw error;
  }
};

// ================= Admin Get All Applications =================
const adminGetAllApplications = async (filters = {}) => {
  try {
    let query = db.collection("applications");
    if (filters.status && filters.status !== "all" && filters.status.trim() !== "") {
      query = query.where("status", "==", filters.status);
    }
    
    const snapshot = await query.get();
    console.log(`📊 Found ${snapshot.size} applications`);
    
    const applications = [];
    
    for (const doc of snapshot.docs) {
      try {
        const appData = { id: doc.id, ...doc.data() };
        
        // جلب بيانات الطالب
        if (appData.studentUid) {
          const studentDoc = await db.collection("users").doc(appData.studentUid).get();
          if (studentDoc.exists) {
            appData.student = {
              uid: studentDoc.id,
              name: studentDoc.data().name || "Unknown",
              email: studentDoc.data().email || "",
              department: studentDoc.data().department || "",
              year: studentDoc.data().year || "",
              gpa: studentDoc.data().gpa || ""
            };
          }
        }
        
        // جلب بيانات الوظيفة
        if (appData.jobId) {
          const jobDoc = await db.collection("jobs").doc(appData.jobId).get();
          if (jobDoc.exists) {
            const jobData = jobDoc.data();
            appData.job = {
              id: jobDoc.id,
              title: jobData.title || "Untitled",
              department: jobData.department || ""
            };
            if (jobData.employerUid) {
              const employerDoc = await db.collection("users").doc(jobData.employerUid).get();
              if (employerDoc.exists) {
                appData.job.employer = employerDoc.data().name || employerDoc.data().companyName || "Unknown";
              }
            }
          }
        }
        
        applications.push(appData);
      } catch (err) {
        console.error(`Error processing application ${doc.id}:`, err.message);
        continue;
      }
    }
    
    return applications;
  } catch (error) {
    console.error("❌ Error in adminGetAllApplications:", error.message);
    throw new Error(`Failed to fetch applications: ${error.message}`);
  }
};

// ================= Admin Update Application Status =================
const adminUpdateApplicationStatus = async (applicationId, status, adminUid) => {
  try {
    if (!applicationId || applicationId.trim() === "") throw new Error("Application ID is required");
    if (!status || status.trim() === "") throw new Error("Status is required");
    
    const validStatuses = ["pending", "accepted", "rejected", "under_review"];
    if (!validStatuses.includes(status)) throw new Error("Invalid status");
    
    const appRef = db.collection("applications").doc(applicationId);
    const appDoc = await appRef.get();
    if (!appDoc.exists) throw new Error("Application not found");
    
    await appRef.update({ 
      status, 
      reviewedAt: admin.firestore.FieldValue.serverTimestamp(), 
      reviewedBy: adminUid 
    });
    
    await db.collection("adminLogs").add({ 
      action: "update_application_status", 
      applicationId, 
      newStatus: status, 
      performedBy: adminUid, 
      timestamp: admin.firestore.FieldValue.serverTimestamp() 
    });
    
    return { success: true, message: `Application status updated to ${status}` };
  } catch (error) {
    console.error("❌ Error in adminUpdateApplicationStatus:", error.message);
    throw error;
  }
};

// ================= Get All Admins =================
const getAllAdmins = async () => {
  try {
    const snapshot = await db.collection("users").where("role", "==", "admin").get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("❌ Error in getAllAdmins:", error.message);
    throw new Error(`Failed to fetch admins: ${error.message}`);
  }
};

// ================= Get Admin Logs =================
const getAdminLogs = async (limit = 50) => {
  try {
    const snapshot = await db.collection("adminLogs").orderBy("timestamp", "desc").limit(limit).get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("❌ Error in getAdminLogs:", error.message);
    throw new Error(`Failed to fetch admin logs: ${error.message}`);
  }
};

// ================= Search Users =================
const searchUsers = async (searchTerm, role = null) => {
  try {
    if (!searchTerm || searchTerm.trim() === "") return [];
    
    let query = db.collection("users");
    if (role && role !== "all" && role.trim() !== "") query = query.where("role", "==", role);
    
    const snapshot = await query.get();
    const search = searchTerm.toLowerCase();
    
    return snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((user) => {
        const name = (user.name || "").toLowerCase();
        const email = (user.email || "").toLowerCase();
        return name.includes(search) || email.includes(search);
      });
  } catch (error) {
    console.error("❌ Error in searchUsers:", error.message);
    throw new Error(`Failed to search users: ${error.message}`);
  }
};

// ================= EXPORTS =================
module.exports = {
  getPlatformStats, getAllUsers, makeAdmin, removeAdmin,
  adminDeleteJob, adminDeleteUser, adminGetAllJobs, adminUpdateJobStatus,
  adminGetAllApplications, adminUpdateApplicationStatus,
  getAllAdmins, getAdminLogs, searchUsers,
};
const { db } = require("../config/firebase");
const admin = require("firebase-admin");

// helper
const serverTimestamp = admin.firestore.FieldValue.serverTimestamp;

// ── Get Employer Profile ──────────────────────────────────────────
const getEmployerProfile = async (uid) => {
  try {
    const snapshot = await db.collection("users").doc(uid).get();

    if (!snapshot.exists) {
      return { success: false, message: "Employer not found" };
    }

    const data = snapshot.data();

    if (data.role !== "employer") {
      return { success: false, message: "User is not an employer" };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// ── Update Employer Profile ───────────────────────────────────────
const updateEmployerProfile = async (uid, updatedData) => {
  try {
    const restrictedFields = [
      "role",
      "uid",
      "email",
      "createdAt",
      "isActive",
      "rating",
    ];

    restrictedFields.forEach((field) => delete updatedData[field]);

    await db.collection("users").doc(uid).update({
      ...updatedData,
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      message: "Employer profile updated successfully",
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// ── Get Employer Jobs ─────────────────────────────────────────────
const getEmployerJobs = async (uid) => {
  try {
    const snapshot = await db
      .collection("jobs")
      .where("employerUid", "==", uid)
      .get();

    if (snapshot.empty) {
      return { success: true, data: [], message: "No jobs found" };
    }

    const jobs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, data: jobs };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// ── Get Applications with Details ─────────────────────────────────
const getJobApplicationsWithDetails = async (jobId, employerUid) => {
  try {
    const jobSnap = await db.collection("jobs").doc(jobId).get();

    if (!jobSnap.exists) {
      return { success: false, message: "Job not found" };
    }

    if (jobSnap.data().employerUid !== employerUid) {
      return {
        success: false,
        message: "Unauthorized: This job doesn't belong to you",
      };
    }

    const appsSnap = await db
      .collection("applications")
      .where("jobId", "==", jobId)
      .get();

    if (appsSnap.empty) {
      return { success: true, data: [], message: "No applications yet" };
    }

    const applications = await Promise.all(
      appsSnap.docs.map(async (appDoc) => {
        const appData = appDoc.data();

        const studentSnap = await db
          .collection("users")
          .doc(appData.studentUid)
          .get();

        const studentData = studentSnap.exists
          ? studentSnap.data()
          : {};

        return {
          applicationId: appDoc.id,
          status: appData.status,
          appliedAt: appData.appliedAt,
          student: {
            uid: appData.studentUid,
            name: studentData.name,
            email: studentData.email,
            university: studentData.university,
            major: studentData.major,
            profileImage: studentData.profileImage,
            cv: studentData.cv,
            skills: studentData.skills,
            gpa: studentData.gpa,
          },
        };
      })
    );

    return { success: true, data: applications };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// ── Accept Application ────────────────────────────────────────────
const acceptApplication = async (applicationId, employerUid) => {
  try {
    const appRef = db.collection("applications").doc(applicationId);
    const appSnap = await appRef.get();

    if (!appSnap.exists) {
      return { success: false, message: "Application not found" };
    }

    const appData = appSnap.data();

    const jobSnap = await db.collection("jobs").doc(appData.jobId).get();

    if (!jobSnap.exists || jobSnap.data().employerUid !== employerUid) {
      return { success: false, message: "Unauthorized action" };
    }

    if (appData.status !== "pending") {
      return {
        success: false,
        message: `Application is already ${appData.status}`,
      };
    }

    await appRef.update({
      status: "accepted",
      reviewedAt: serverTimestamp(),
    });

    return { success: true, message: "Application accepted successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// ── Reject Application ────────────────────────────────────────────
const rejectApplication = async (applicationId, employerUid) => {
  try {
    const appRef = db.collection("applications").doc(applicationId);
    const appSnap = await appRef.get();

    if (!appSnap.exists) {
      return { success: false, message: "Application not found" };
    }

    const appData = appSnap.data();

    const jobSnap = await db.collection("jobs").doc(appData.jobId).get();

    if (!jobSnap.exists || jobSnap.data().employerUid !== employerUid) {
      return { success: false, message: "Unauthorized action" };
    }

    if (appData.status !== "pending") {
      return {
        success: false,
        message: `Application is already ${appData.status}`,
      };
    }

    await appRef.update({
      status: "rejected",
      reviewedAt: serverTimestamp(),
    });

    return { success: true, message: "Application rejected successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// ── Employer Stats ────────────────────────────────────────────────
const getEmployerStats = async (uid) => {
  try {
    const jobsSnap = await db
      .collection("jobs")
      .where("employerUid", "==", uid)
      .get();

    const jobIds = jobsSnap.docs.map((d) => d.id);

    if (jobIds.length === 0) {
      return {
        success: true,
        data: {
          totalJobs: 0,
          totalApplications: 0,
          pending: 0,
          accepted: 0,
          rejected: 0,
        },
      };
    }

    const appsSnap = await db.collection("applications").get();

    let pending = 0,
      accepted = 0,
      rejected = 0;

    appsSnap.forEach((doc) => {
      const data = doc.data();
      if (!jobIds.includes(data.jobId)) return;

      if (data.status === "pending") pending++;
      if (data.status === "accepted") accepted++;
      if (data.status === "rejected") rejected++;
    });

    return {
      success: true,
      data: {
        totalJobs: jobsSnap.size,
        totalApplications: pending + accepted + rejected,
        pending,
        accepted,
        rejected,
      },
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// ── Dashboard ─────────────────────────────────────────────────────
const getEmployerDashboard = async (uid) => {
  try {
    const [profile, jobs, stats] = await Promise.all([
      getEmployerProfile(uid),
      getEmployerJobs(uid),
      getEmployerStats(uid),
    ]);

    return {
      success: true,
      data: {
        profile: profile.data || null,
        jobs: jobs.data || [],
        stats: stats.data || {},
      },
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

module.exports = {
  getEmployerProfile,
  updateEmployerProfile,
  getEmployerJobs,
  getJobApplicationsWithDetails,
  acceptApplication,
  rejectApplication,
  getEmployerStats,
  getEmployerDashboard,
};
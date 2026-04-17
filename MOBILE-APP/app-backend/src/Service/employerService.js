const admin = require("firebase-admin");
const db = admin.firestore();

// ================= Get Employer Profile =================
const getEmployerProfile = async (employerUid) => {
  const doc = await db.collection("users").doc(employerUid).get();

  if (!doc.exists) {
    throw new Error("Employer not found");
  }

  const data = doc.data();
  if (data.role !== "employer") {
    throw new Error("User is not an employer");
  }

  return { id: doc.id, ...data };
};

// ================= Update Employer Profile =================
const updateEmployerProfile = async (employerUid, profileData) => {
  const allowedFields = [
    "name",
    "companyName",
    "companyLogo",
    "companyDescription",
    "industry",
    "website",
    "phone",
    "about",
    "linkedin",
    "location",
    "employeesCount",
    "foundedYear",
  ];

  const updateData = {};
  allowedFields.forEach((field) => {
    if (profileData[field] !== undefined) {
      updateData[field] = profileData[field];
    }
  });

  updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

  await db.collection("users").doc(employerUid).update(updateData);

  const updatedDoc = await db.collection("users").doc(employerUid).get();
  return { success: true, data: { id: updatedDoc.id, ...updatedDoc.data() } };
};

// ================= Get Employer Jobs =================
const getEmployerJobs = async (employerUid, filters = {}) => {
  let query = db.collection("jobs").where("employerUid", "==", employerUid);

  if (filters.status) {
    query = query.where("status", "==", filters.status);
  }

  const snapshot = await query.get();

  const jobs = [];
  for (const doc of snapshot.docs) {
    const jobData = { id: doc.id, ...doc.data() };

    // Get applications count for each job
    const appsSnap = await db
      .collection("applications")
      .where("jobId", "==", doc.id)
      .get();

    jobData.applicationsCount = appsSnap.size;

    // Count by status
    jobData.pendingCount = 0;
    jobData.acceptedCount = 0;
    jobData.rejectedCount = 0;

    appsSnap.forEach((appDoc) => {
      const status = appDoc.data().status;
      if (status === "pending") jobData.pendingCount++;
      if (status === "accepted") jobData.acceptedCount++;
      if (status === "rejected") jobData.rejectedCount++;
    });

    jobs.push(jobData);
  }

  return jobs;
};

// ================= Get Job Applications With Student Details =================
const getJobApplicationsWithDetails = async (employerUid, jobId) => {
  // Verify job belongs to employer
  const jobDoc = await db.collection("jobs").doc(jobId).get();
  if (!jobDoc.exists) {
    throw new Error("Job not found");
  }

  const jobData = jobDoc.data();
  if (jobData.employerUid !== employerUid) {
    throw new Error("You don't have access to this job");
  }

  const snapshot = await db
    .collection("applications")
    .where("jobId", "==", jobId)
    .get();

  const applications = [];
  for (const doc of snapshot.docs) {
    const appData = { id: doc.id, ...doc.data() };

    // Get student info
    const studentDoc = await db
      .collection("users")
      .doc(appData.studentUid)
      .get();
    if (studentDoc.exists) {
      const studentData = studentDoc.data();
      appData.student = {
        uid: studentDoc.id,
        name: studentData.name,
        email: studentData.email,
        department: studentData.department,
        year: studentData.year,
        gpa: studentData.gpa,
        skills: studentData.skills,
        profileImage: studentData.profileImage,
        phone: studentData.phone,
        linkedin: studentData.linkedin,
        github: studentData.github,
        about: studentData.about,
      };
    }

    // Get student rating
    const ratingSnap = await db
      .collection("ratings")
      .where("ratedUid", "==", appData.studentUid)
      .get();

    if (!ratingSnap.empty) {
      const ratings = ratingSnap.docs.map((d) => d.data().rating);
      appData.student.averageRating = parseFloat(
        (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1),
      );
      appData.student.totalRatings = ratings.length;
    } else {
      appData.student.averageRating = 0;
      appData.student.totalRatings = 0;
    }

    applications.push(appData);
  }

  return applications;
};

// ================= Accept Application =================
const acceptApplication = async (employerUid, applicationId) => {
  const appDoc = await db.collection("applications").doc(applicationId).get();
  if (!appDoc.exists) {
    throw new Error("Application not found");
  }

  const appData = appDoc.data();

  // Verify job belongs to employer
  const jobDoc = await db.collection("jobs").doc(appData.jobId).get();
  if (!jobDoc.exists || jobDoc.data().employerUid !== employerUid) {
    throw new Error("You don't have access to this application");
  }

  await db.collection("applications").doc(applicationId).update({
    status: "accepted",
    reviewedAt: admin.firestore.FieldValue.serverTimestamp(),
    reviewedBy: employerUid,
  });

  return { success: true, message: "Application accepted successfully" };
};

// ================= Reject Application =================
const rejectApplication = async (employerUid, applicationId, reason = "") => {
  const appDoc = await db.collection("applications").doc(applicationId).get();
  if (!appDoc.exists) {
    throw new Error("Application not found");
  }

  const appData = appDoc.data();

  // Verify job belongs to employer
  const jobDoc = await db.collection("jobs").doc(appData.jobId).get();
  if (!jobDoc.exists || jobDoc.data().employerUid !== employerUid) {
    throw new Error("You don't have access to this application");
  }

  const updateData = {
    status: "rejected",
    reviewedAt: admin.firestore.FieldValue.serverTimestamp(),
    reviewedBy: employerUid,
  };

  if (reason) {
    updateData.rejectionReason = reason;
  }

  await db.collection("applications").doc(applicationId).update(updateData);

  return { success: true, message: "Application rejected" };
};

// ================= Get Employer Stats =================
const getEmployerStats = async (employerUid) => {
  const jobsSnap = await db
    .collection("jobs")
    .where("employerUid", "==", employerUid)
    .get();

  const totalJobs = jobsSnap.size;

  let totalApplications = 0;
  let pendingApplications = 0;
  let acceptedApplications = 0;
  let rejectedApplications = 0;

  for (const jobDoc of jobsSnap.docs) {
    const appsSnap = await db
      .collection("applications")
      .where("jobId", "==", jobDoc.id)
      .get();

    totalApplications += appsSnap.size;

    appsSnap.forEach((appDoc) => {
      const status = appDoc.data().status;
      if (status === "pending") pendingApplications++;
      if (status === "accepted") acceptedApplications++;
      if (status === "rejected") rejectedApplications++;
    });
  }

  // Get employer rating
  const ratingSnap = await db
    .collection("ratings")
    .where("ratedUid", "==", employerUid)
    .get();

  let averageRating = 0;
  let totalRatings = 0;
  if (!ratingSnap.empty) {
    const ratings = ratingSnap.docs.map((d) => d.data().rating);
    averageRating = parseFloat(
      (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1),
    );
    totalRatings = ratings.length;
  }

  return {
    totalJobs,
    totalApplications,
    pendingApplications,
    acceptedApplications,
    rejectedApplications,
    averageRating,
    totalRatings,
  };
};

// ================= Get Employer Dashboard =================
const getEmployerDashboard = async (employerUid) => {
  const stats = await getEmployerStats(employerUid);

  // Get recent applications (last 10)
  const jobsSnap = await db
    .collection("jobs")
    .where("employerUid", "==", employerUid)
    .get();

  const allApplications = [];
  for (const jobDoc of jobsSnap.docs) {
    const appsSnap = await db
      .collection("applications")
      .where("jobId", "==", jobDoc.id)
      .orderBy("appliedAt", "desc")
      .limit(5)
      .get();

    for (const appDoc of appsSnap.docs) {
      const appData = { id: appDoc.id, ...appDoc.data() };
      appData.jobTitle = jobDoc.data().title;
      appData.jobId = jobDoc.id;

      // Get student name
      const studentDoc = await db
        .collection("users")
        .doc(appData.studentUid)
        .get();
      if (studentDoc.exists) {
        appData.studentName = studentDoc.data().name;
      }

      allApplications.push(appData);
    }
  }

  // Sort by date and get top 10
  allApplications.sort((a, b) => {
    const dateA = a.appliedAt?.toDate?.() || new Date(a.appliedAt);
    const dateB = b.appliedAt?.toDate?.() || new Date(b.appliedAt);
    return dateB - dateA;
  });

  return {
    stats,
    recentApplications: allApplications.slice(0, 10),
  };
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

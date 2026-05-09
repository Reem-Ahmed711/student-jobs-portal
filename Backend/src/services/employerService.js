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
    const userRef = db.collection("users").doc(uid);
    const snapshot = await userRef.get();

    if (!snapshot.exists) {
      return {
        success: false,
        message: "Employer not found",
      };
    }

    const restrictedFields = [
      "role",
      "uid",
      "email",
      "createdAt",
      "isActive",
      "rating",
    ];

    restrictedFields.forEach((field) => delete updatedData[field]);

    await userRef.update({
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
// ── Create New Job ────────────────────────────────────────────────
const createJob = async (uid, jobData) => {
  try {
    const {
      title,
      department,
      type,
      deadline,
      description,
      responsibilities,
      requirements,
      skills,
      hours,
      duration,
      compensationType,
      salaryMin,
      salaryMax,
      benefits
    } = jobData;

    // التحقق من الحقول المطلوبة
    if (!title || !description || !deadline) {
      return { success: false, message: "Missing required fields: title, description, deadline" };
    }

    const jobRef = db.collection("jobs").doc();
    const jobId = jobRef.id;

    const newJob = {
      id: jobId,
      employerUid: uid,
      title,
      department: department || "General",
      type: type || "Part-Time",
      deadline: admin.firestore.Timestamp.fromDate(new Date(deadline)),
      description,
      responsibilities: responsibilities || [],
      requirements: requirements || [],
      skills: skills || [],
      hours: hours || 15,
      duration: duration || "One Semester",
      compensationType: compensationType || "Paid",
      salaryMin: salaryMin || null,
      salaryMax: salaryMax || null,
      benefits: benefits || [],
      status: "pending", // pending, active, closed
      approved: false,
      applicantsCount: 0,
      views: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await jobRef.set(newJob);

    return {
      success: true,
      message: "Job created successfully",
      data: { id: jobId, ...newJob }
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
// ── Get Hiring History (Accepted Applications) ─────────────────────
// ── Get Hiring History (Accepted Applications) ─────────────────────
const getHiringHistory = async (uid) => {
  try {
    const jobsSnap = await db
      .collection("jobs")
      .where("employerUid", "==", uid)
      .get();

    if (jobsSnap.empty) {
      return { success: true, data: [], message: "No jobs found" };
    }

    const jobIds = jobsSnap.docs.map(doc => doc.id);
    
    const applicationsSnap = await db
      .collection("applications")
      .where("jobId", "in", jobIds)
      .where("status", "==", "accepted")
      .get();

    if (applicationsSnap.empty) {
      return { success: true, data: [], message: "No hiring history yet" };
    }

    const hiringHistory = await Promise.all(
      applicationsSnap.docs.map(async (appDoc) => {
        const appData = appDoc.data();
        
        const jobSnap = await db.collection("jobs").doc(appData.jobId).get();
        const jobData = jobSnap.exists ? jobSnap.data() : {};
        
        const studentSnap = await db.collection("users").doc(appData.studentUid).get();
        const studentData = studentSnap.exists ? studentSnap.data() : {};
        
        const appliedAt = appData.appliedAt?.toDate ? appData.appliedAt.toDate() : new Date(appData.appliedAt);
        const reviewedAt = appData.reviewedAt?.toDate ? appData.reviewedAt.toDate() : new Date();
        const timeToHire = Math.ceil((reviewedAt - appliedAt) / (1000 * 60 * 60 * 24));
        
        return {
          id: appDoc.id,
          candidateName: studentData.name || "Unknown",
          candidateEmail: studentData.email || "",
          position: jobData.title || "Unknown Position",
          department: jobData.department || "General",
          hiredDate: reviewedAt,
          matchScore: appData.matchScore || Math.floor(Math.random() * 20) + 75,
          timeToHire: timeToHire > 0 ? timeToHire : 0,
          status: "Active"
        };
      })
    );
    
    hiringHistory.sort((a, b) => new Date(b.hiredDate) - new Date(a.hiredDate));
    
    return { success: true, data: hiringHistory };
  } catch (error) {
    console.error("Error in getHiringHistory:", error);
    return { success: false, message: error.message };
  }
};

// ── Get Shortlisted Candidates ─────────────────────────────────────
const getShortlistedCandidates = async (uid) => {
  try {
    const shortlistSnap = await db
      .collection("shortlisted")
      .where("employerUid", "==", uid)
      .get();

    if (shortlistSnap.empty) {
      return { success: true, data: [], message: "No shortlisted candidates" };
    }

    const shortlisted = await Promise.all(
      shortlistSnap.docs.map(async (doc) => {
        const data = doc.data();
        
        // جلب بيانات الطالب
        const studentSnap = await db.collection("users").doc(data.studentUid).get();
        const studentData = studentSnap.exists ? studentSnap.data() : {};
        
        // جلب بيانات الوظيفة
        const jobSnap = await db.collection("jobs").doc(data.jobId).get();
        const jobData = jobSnap.exists ? jobSnap.data() : {};
        
        return {
          id: doc.id,
          studentUid: data.studentUid,
          studentName: studentData.name || "Unknown",
          studentEmail: studentData.email || "",
          studentYear: studentData.year || "N/A",
          studentGpa: studentData.gpa || "N/A",
          studentSkills: studentData.skills || [],
          jobId: data.jobId,
          jobTitle: jobData.title || "Unknown Position",
          jobDepartment: jobData.department || "General",
          stage: data.stage || "Under Review",
          interviewDate: data.interviewDate || null,
          feedback: data.feedback || "",
          matchScore: data.matchScore || Math.floor(Math.random() * 20) + 75,
          addedAt: data.addedAt,
          updatedAt: data.updatedAt
        };
      })
    );
    
    // ترتيب حسب تاريخ الإضافة (الأحدث أولاً)
    shortlisted.sort((a, b) => {
      const dateA = a.addedAt?.toDate ? a.addedAt.toDate() : new Date(a.addedAt);
      const dateB = b.addedAt?.toDate ? b.addedAt.toDate() : new Date(b.addedAt);
      return dateB - dateA;
    });
    
    return { success: true, data: shortlisted };
  } catch (error) {
    console.error("Error in getShortlistedCandidates:", error);
    return { success: false, message: error.message };
  }
};

// ── Add to Shortlist ───────────────────────────────────────────────
const addToShortlist = async (uid, applicationId, notes) => {
  try {
    // جلب بيانات التطبيق
    const appSnap = await db.collection("applications").doc(applicationId).get();
    
    if (!appSnap.exists) {
      return { success: false, message: "Application not found" };
    }
    
    const appData = appSnap.data();
    
    // التحقق من ملكية الوظيفة
    const jobSnap = await db.collection("jobs").doc(appData.jobId).get();
    if (!jobSnap.exists || jobSnap.data().employerUid !== uid) {
      return { success: false, message: "Unauthorized" };
    }
    
    // التحقق من عدم التكرار
    const existingSnap = await db
      .collection("shortlisted")
      .where("employerUid", "==", uid)
      .where("studentUid", "==", appData.studentUid)
      .where("jobId", "==", appData.jobId)
      .get();
    
    if (!existingSnap.empty) {
      return { success: false, message: "Candidate already in shortlist" };
    }
    
    // إضافة إلى القائمة المختصرة
    const shortlistRef = db.collection("shortlisted").doc();
    await shortlistRef.set({
      id: shortlistRef.id,
      employerUid: uid,
      studentUid: appData.studentUid,
      jobId: appData.jobId,
      applicationId: applicationId,
      stage: "Under Review",
      notes: notes || "",
      matchScore: appData.matchScore || 75,
      addedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return { success: true, message: "Candidate added to shortlist", data: { id: shortlistRef.id } };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// ── Remove from Shortlist ──────────────────────────────────────────
const removeFromShortlist = async (uid, shortlistId) => {
  try {
    const shortlistRef = db.collection("shortlisted").doc(shortlistId);
    const shortlistSnap = await shortlistRef.get();
    
    if (!shortlistSnap.exists) {
      return { success: false, message: "Shortlist item not found" };
    }
    
    if (shortlistSnap.data().employerUid !== uid) {
      return { success: false, message: "Unauthorized" };
    }
    
    await shortlistRef.delete();
    return { success: true, message: "Candidate removed from shortlist" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// ── Update Shortlist Stage ─────────────────────────────────────────
const updateShortlistStage = async (uid, shortlistId, stage, interviewDate, feedback) => {
  try {
    const shortlistRef = db.collection("shortlisted").doc(shortlistId);
    const shortlistSnap = await shortlistRef.get();
    
    if (!shortlistSnap.exists) {
      return { success: false, message: "Shortlist item not found" };
    }
    
    if (shortlistSnap.data().employerUid !== uid) {
      return { success: false, message: "Unauthorized" };
    }
    
    const updateData = {
      stage: stage,
      updatedAt: serverTimestamp()
    };
    
    if (interviewDate) {
      updateData.interviewDate = new Date(interviewDate);
    }
    
    if (feedback) {
      updateData.feedback = feedback;
    }
    
    await shortlistRef.update(updateData);
    return { success: true, message: "Shortlist updated successfully" };
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
  createJob,
  getHiringHistory,
  getShortlistedCandidates,
  addToShortlist,
  removeFromShortlist,
  updateShortlistStage,
};
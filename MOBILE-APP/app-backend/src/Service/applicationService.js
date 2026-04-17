const { admin, db } = require("../firebase");

// ================= Apply to Job =================
const applyToJob = async (studentUid, jobId) => {
  // ✅ التحقق إذا كان الطالب قد تقدم بالفعل
  const existing = await db
    .collection("applications")
    .where("studentUid", "==", studentUid)
    .where("jobId", "==", jobId)
    .get();

  if (!existing.empty) {
    throw new Error("You have already applied to this job");
  }

  const appRef = db.collection("applications").doc();

  await appRef.set({
    id: appRef.id,
    studentUid,
    jobId,
    status: "pending",
    appliedAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { success: true, applicationId: appRef.id };
};

// ================= Get Job Applications (لصاحب العمل) =================
const getJobApplications = async (employerUid, jobId) => {
  // ✅ التحقق من أن الوظيفة تخص صاحب العمل
  const jobDoc = await db.collection("jobs").doc(jobId).get();
  if (!jobDoc.exists) {
    throw new Error("Job not found");
  }
  if (jobDoc.data().employerUid !== employerUid) {
    throw new Error("Access denied: You are not the owner of this job");
  }

  // ✅ جلب جميع الطلبات
  const snapshot = await db
    .collection("applications")
    .where("jobId", "==", jobId)
    .get();

  const applications = [];
  for (const doc of snapshot.docs) {
    const appData = doc.data();
    
    // ✅ جلب بيانات الطالب (الاسم والبريد)
    let studentName = "Unknown";
    let studentEmail = "";
    try {
      const studentDoc = await db.collection("users").doc(appData.studentUid).get();
      if (studentDoc.exists) {
        studentName = studentDoc.data().name || "Unknown";
        studentEmail = studentDoc.data().email || "";
      }
    } catch (err) {
      console.log("Error fetching student:", err);
    }

    applications.push({
      id: doc.id,
      ...appData,
      studentName,
      studentEmail,
    });
  }

  return applications;
};

// ================= Get Student Applications (للطالب) =================
const getStudentApplications = async (studentUid) => {
  const snapshot = await db
    .collection("applications")
    .where("studentUid", "==", studentUid)
    .get();

  const applications = [];
  for (const doc of snapshot.docs) {
    const appData = doc.data();
    
    // ✅ جلب بيانات الوظيفة (العنوان والقسم)
    let jobTitle = "Unknown Job";
    let jobDepartment = "Unknown Department";
    try {
      const jobDoc = await db.collection("jobs").doc(appData.jobId).get();
      if (jobDoc.exists) {
        jobTitle = jobDoc.data().title || "Unknown Job";
        jobDepartment = jobDoc.data().department || "Unknown Department";
      }
    } catch (err) {
      console.log("Error fetching job:", err);
    }

    applications.push({
      id: doc.id,
      ...appData,
      jobTitle,
      jobDepartment,
    });
  }

  return applications;
};

// ================= Update Application Status (قبول/رفض) =================
const updateApplicationStatus = async (employerUid, applicationId, newStatus) => {
  // ✅ 1. جلب بيانات الطلب
  const appDoc = await db.collection("applications").doc(applicationId).get();
  if (!appDoc.exists) {
    throw new Error("Application not found");
  }

  const application = appDoc.data();

  // ✅ 2. التحقق من أن الوظيفة تخص صاحب العمل
  const jobDoc = await db.collection("jobs").doc(application.jobId).get();
  if (!jobDoc.exists) {
    throw new Error("Job not found");
  }
  if (jobDoc.data().employerUid !== employerUid) {
    throw new Error("Access denied: You are not the owner of this job");
  }

  // ✅ 3. التحقق من أن الحالة الجديدة صالحة
  const validStatuses = ["pending", "accepted", "rejected", "under_review", "shortlisted"];
  if (!validStatuses.includes(newStatus)) {
    throw new Error(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
  }

  // ✅ 4. تحديث الحالة
  await db.collection("applications").doc(applicationId).update({
    status: newStatus,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return {
    success: true,
    message: `Application ${newStatus}`,
  };
};

module.exports = {
  applyToJob,
  getJobApplications,
  getStudentApplications,
  updateApplicationStatus,
};
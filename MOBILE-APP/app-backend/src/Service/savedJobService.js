// MOBILE-APP/app-backend/src/Service/savedJobService.js
const { admin, db } = require("../firebase");

// حفظ وظيفة
const saveJob = async (studentUid, jobId) => {
  // التأكد إن الوظيفة موجودة
  const jobDoc = await db.collection("jobs").doc(jobId).get();
  if (!jobDoc.exists) {
    throw new Error("Job not found");
  }

  // التأكد إن الطالب موجود
  const studentDoc = await db.collection("users").doc(studentUid).get();
  if (!studentDoc.exists || studentDoc.data().role !== "student") {
    throw new Error("Student not found");
  }

  // التأكد إنه محفوظش قبل كده
  const existing = await db
    .collection("savedJobs")
    .where("studentUid", "==", studentUid)
    .where("jobId", "==", jobId)
    .get();

  if (!existing.empty) {
    throw new Error("Job already saved");
  }

  // حفظ
  const savedRef = db.collection("savedJobs").doc();
  await savedRef.set({
    studentUid,
    jobId,
    savedAt: admin.firestore.FieldValue.serverTimestamp(),
    jobTitle: jobDoc.data().title,
    jobDepartment: jobDoc.data().department,
  });

  return {
    success: true,
    message: "Job saved successfully",
    savedId: savedRef.id,
  };
};

// إلغاء حفظ وظيفة
const unsaveJob = async (studentUid, jobId) => {
  const savedSnapshot = await db
    .collection("savedJobs")
    .where("studentUid", "==", studentUid)
    .where("jobId", "==", jobId)
    .get();

  if (savedSnapshot.empty) {
    throw new Error("Job not saved");
  }

  const batch = db.batch();
  savedSnapshot.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();

  return { success: true, message: "Job unsaved successfully" };
};

// جلب الوظائف المحفوظة لطالب
const getSavedJobs = async (studentUid) => {
  const savedSnapshot = await db
    .collection("savedJobs")
    .where("studentUid", "==", studentUid)
    .orderBy("savedAt", "desc")
    .get();

  const savedJobs = [];
  for (const doc of savedSnapshot.docs) {
    const savedData = doc.data();
    const jobDoc = await db.collection("jobs").doc(savedData.jobId).get();

    if (jobDoc.exists) {
      savedJobs.push({
        savedId: doc.id,
        job: {
          id: jobDoc.id,
          ...jobDoc.data(),
        },
        savedAt: savedData.savedAt,
      });
    }
  }

  return savedJobs;
};

// التحقق إذا كانت وظيفة محفوظة
const isJobSaved = async (studentUid, jobId) => {
  const savedSnapshot = await db
    .collection("savedJobs")
    .where("studentUid", "==", studentUid)
    .where("jobId", "==", jobId)
    .get();

  return { saved: !savedSnapshot.empty };
};

module.exports = {
  saveJob,
  unsaveJob,
  getSavedJobs,
  isJobSaved,
};

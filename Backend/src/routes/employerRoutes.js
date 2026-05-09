// C:\Student-job-portal\Backend\src\routes\employerRoutes.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { db } = require("../config/firebase");

router.use(verifyToken);

router.use(async (req, res, next) => {
  if (req.user.role !== "employer" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Employer only." });
  }
  next();
});

// ========== 1. نشر وظيفة جديدة ==========
router.post("/post-job", async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      employerUid: req.user.uid,
      postedBy: req.user.name || req.user.email,
      status: "active",
      applicantsCount: 0,
      createdAt: new Date().toISOString()
    };
    
    const docRef = await db.collection("jobs").add(jobData);
    res.json({ success: true, jobId: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== 2. جلب وظائف الـ Employer ==========
router.get("/my-jobs", async (req, res) => {
  try {
    const snapshot = await db
      .collection("jobs")
      .where("employerUid", "==", req.user.uid)
      .orderBy("createdAt", "desc")
      .get();
    
    const jobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== 3. جلب المتقدمين ==========
router.get("/applicants/:jobId", async (req, res) => {
  try {
    const { jobId } = req.params;
    const employerId = req.user.uid;
    
    const jobDoc = await db.collection("jobs").doc(jobId).get();
    if (!jobDoc.exists || jobDoc.data().employerUid !== employerId) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    
    const snapshot = await db.collection("applications").where("jobId", "==", jobId).get();
    const applicants = await Promise.all(snapshot.docs.map(async (doc) => {
      const appData = doc.data();
      const studentDoc = await db.collection("users").doc(appData.studentId).get();
      const studentData = studentDoc.data() || {};
      
      return {
        id: doc.id,
        ...appData,
        student: { name: studentData.name, email: studentData.email, department: studentData.department }
      };
    }));
    
    res.json({ success: true, data: applicants });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== 4. جميع الطلبات ==========
router.get("/applications", async (req, res) => {
  try {
    const jobsSnapshot = await db.collection("jobs").where("employerUid", "==", req.user.uid).get();
    const jobIds = jobsSnapshot.docs.map(doc => doc.id);
    
    if (jobIds.length === 0) return res.json({ success: true, data: [] });
    
    let allApps = [];
    for (const jobId of jobIds) {
      const appsSnapshot = await db.collection("applications").where("jobId", "==", jobId).get();
      for (const doc of appsSnapshot.docs) {
        allApps.push({ id: doc.id, ...doc.data() });
      }
    }
    
    res.json({ success: true, data: allApps });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== 5. قبول طالب ==========
router.patch("/accept/:applicationId", async (req, res) => {
  try {
    const { applicationId } = req.params;
    const employerId = req.user.uid;
    
    const appDoc = await db.collection("applications").doc(applicationId).get();
    if (!appDoc.exists) return res.status(404).json({ error: "Application not found" });
    
    const jobDoc = await db.collection("jobs").doc(appDoc.data().jobId).get();
    if (jobDoc.data().employerUid !== employerId) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    
    await db.collection("applications").doc(applicationId).update({ status: "accepted", reviewedAt: new Date().toISOString() });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== 6. رفض طالب ==========
router.patch("/reject/:applicationId", async (req, res) => {
  try {
    const { applicationId } = req.params;
    const employerId = req.user.uid;
    
    const appDoc = await db.collection("applications").doc(applicationId).get();
    if (!appDoc.exists) return res.status(404).json({ error: "Application not found" });
    
    const jobDoc = await db.collection("jobs").doc(appDoc.data().jobId).get();
    if (jobDoc.data().employerUid !== employerId) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    
    await db.collection("applications").doc(applicationId).update({ status: "rejected", reviewedAt: new Date().toISOString() });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== 7. إحصائيات ==========
router.get("/stats", async (req, res) => {
  try {
    const jobsSnapshot = await db.collection("jobs").where("employerUid", "==", req.user.uid).get();
    const jobs = jobsSnapshot.docs;
    
    let totalApplicants = 0;
    for (const job of jobs) {
      const apps = await db.collection("applications").where("jobId", "==", job.id).get();
      totalApplicants += apps.size;
    }
    
    res.json({
      success: true,
      data: {
        totalJobs: jobs.length,
        activeJobs: jobs.length,
        totalApplicants
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

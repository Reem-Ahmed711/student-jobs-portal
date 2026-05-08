// C:\Student-job-portal\Backend\src\routes\studentRoutes.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { db } = require("../config/firebase");

// ========== 1. جلب كل الوظائف النشطة (للطلاب) ==========
router.get("/jobs", verifyToken, async (req, res) => {
  try {
    // جلب الوظائف اللي حالتها active واللي deadline لسة مخلصش
    const now = new Date().toISOString();
    const snapshot = await db
      .collection("jobs")
      .where("status", "==", "active")
      .get();
    
    const jobs = [];
    snapshot.forEach(doc => {
      const jobData = doc.data();
      // تحقق أن deadline لسة مخلصش
      if (!jobData.deadline || new Date(jobData.deadline) > new Date()) {
        jobs.push({ id: doc.id, ...jobData });
      }
    });
    
    res.json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== 2. التقديم على وظيفة ==========
router.post("/apply", verifyToken, async (req, res) => {
  try {
    const { jobId, message, cvUrl } = req.body;
    const studentId = req.user.uid;
    
    // تحقق أن الوظيفة موجودة ونشطة
    const jobDoc = await db.collection("jobs").doc(jobId).get();
    if (!jobDoc.exists) {
      return res.status(404).json({ error: "Job not found" });
    }
    
    const jobData = jobDoc.data();
    if (jobData.status !== "active") {
      return res.status(400).json({ error: "This job is no longer available" });
    }
    
    // تحقق من عدم التقديم مرتين
    const existingApp = await db
      .collection("applications")
      .where("jobId", "==", jobId)
      .where("studentId", "==", studentId)
      .get();
    
    if (!existingApp.empty) {
      return res.status(400).json({ error: "You have already applied for this job" });
    }
    
    // إنشاء طلب جديد
    const application = {
      jobId,
      studentId,
      employerId: jobData.employerUid,
      status: "pending",
      message: message || "",
      cvUrl: cvUrl || "",
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const appRef = await db.collection("applications").add(application);
    
    // زيادة عدد المتقدمين في الوظيفة
    await db.collection("jobs").doc(jobId).update({
      applicantsCount: (jobData.applicantsCount || 0) + 1,
      updatedAt: new Date().toISOString()
    });
    
    res.json({ success: true, applicationId: appRef.id, message: "Application submitted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== 3. جلب طلبات الطالب ==========
router.get("/my-applications", verifyToken, async (req, res) => {
  try {
    const studentId = req.user.uid;
    
    const snapshot = await db
      .collection("applications")
      .where("studentId", "==", studentId)
      .orderBy("appliedAt", "desc")
      .get();
    
    const applications = await Promise.all(snapshot.docs.map(async (doc) => {
      const appData = doc.data();
      const jobDoc = await db.collection("jobs").doc(appData.jobId).get();
      const jobData = jobDoc.data() || {};
      
      return {
        id: doc.id,
        ...appData,
        jobTitle: jobData.title || "Unknown Job",
        department: jobData.department || "",
        employerName: jobData.postedBy || "Unknown Employer"
      };
    }));
    
    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== 4. حفظ وظيفة ==========
router.post("/save-job", verifyToken, async (req, res) => {
  try {
    const { jobId } = req.body;
    const studentId = req.user.uid;
    
    // تحقق من عدم الحفظ مسبقاً
    const existing = await db
      .collection("savedJobs")
      .where("studentId", "==", studentId)
      .where("jobId", "==", jobId)
      .get();
    
    if (!existing.empty) {
      return res.status(400).json({ error: "Job already saved" });
    }
    
    await db.collection("savedJobs").add({
      studentId,
      jobId,
      savedAt: new Date().toISOString()
    });
    
    res.json({ success: true, message: "Job saved successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== 5. إزالة وظيفة محفوظة ==========
router.delete("/save-job/:jobId", verifyToken, async (req, res) => {
  try {
    const { jobId } = req.params;
    const studentId = req.user.uid;
    
    const snapshot = await db
      .collection("savedJobs")
      .where("studentId", "==", studentId)
      .where("jobId", "==", jobId)
      .get();
    
    if (!snapshot.empty) {
      await snapshot.docs[0].ref.delete();
    }
    
    res.json({ success: true, message: "Job removed from saved" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== 6. جلب الوظائف المحفوظة ==========
router.get("/saved-jobs", verifyToken, async (req, res) => {
  try {
    const studentId = req.user.uid;
    
    const snapshot = await db
      .collection("savedJobs")
      .where("studentId", "==", studentId)
      .get();
    
    const jobs = await Promise.all(snapshot.docs.map(async (doc) => {
      const jobDoc = await db.collection("jobs").doc(doc.data().jobId).get();
      const jobData = jobDoc.data() || {};
      return { id: doc.data().jobId, ...jobData, savedAt: doc.data().savedAt };
    }));
    
    res.json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== 7. Like on Job ==========
router.post("/like", verifyToken, async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.user.uid;
    
    const existing = await db
      .collection("likes")
      .where("userId", "==", userId)
      .where("jobId", "==", jobId)
      .get();
    
    if (!existing.empty) {
      return res.status(400).json({ error: "Already liked" });
    }
    
    await db.collection("likes").add({
      userId,
      jobId,
      likedAt: new Date().toISOString()
    });
    
    res.json({ success: true, message: "Job liked" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== 8. Unlike Job ==========
router.delete("/like/:jobId", verifyToken, async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.uid;
    
    const snapshot = await db
      .collection("likes")
      .where("userId", "==", userId)
      .where("jobId", "==", jobId)
      .get();
    
    if (!snapshot.empty) {
      await snapshot.docs[0].ref.delete();
    }
    
    res.json({ success: true, message: "Job unliked" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== 9. Get Likes Count ==========
router.get("/likes/:jobId", verifyToken, async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.uid;
    
    const snapshot = await db
      .collection("likes")
      .where("jobId", "==", jobId)
      .get();
    
    const userLiked = !(await db
      .collection("likes")
      .where("userId", "==", userId)
      .where("jobId", "==", jobId)
      .get()).empty;
    
    res.json({ success: true, count: snapshot.size, userLiked });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== 10. Add Comment ==========
router.post("/comment", verifyToken, async (req, res) => {
  try {
    const { jobId, comment } = req.body;
    const userId = req.user.uid;
    
    // جلب اسم المستخدم
    const userDoc = await db.collection("users").doc(userId).get();
    const userName = userDoc.data()?.name || "Anonymous";
    
    const commentData = {
      jobId,
      userId,
      userName,
      comment: comment.trim(),
      createdAt: new Date().toISOString()
    };
    
    const docRef = await db.collection("comments").add(commentData);
    
    res.json({ success: true, comment: { id: docRef.id, ...commentData } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== 11. Get Comments ==========
router.get("/comments/:jobId", verifyToken, async (req, res) => {
  try {
    const { jobId } = req.params;
    
    const snapshot = await db
      .collection("comments")
      .where("jobId", "==", jobId)
      .orderBy("createdAt", "desc")
      .get();
    
    const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    res.json({ success: true, data: comments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

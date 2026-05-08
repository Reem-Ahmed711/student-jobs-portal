// MOBILE-APP/app-backend/src/Controllers/savedJobController.js
const {
  saveJob,
  unsaveJob,
  getSavedJobs,
  isJobSaved,
} = require("../Service/savedJobService");
const { requireStudent } = require("../auth/roleGuard");
const { db } = require("../firebase"); // ✅ أضيفي هذا السطر

// حفظ وظيفة
const saveJobController = async (req, res) => {
  try {
    await requireStudent(req.user.uid);
    const { jobId } = req.body;
    const result = await saveJob(req.user.uid, jobId);
    res.status(200).json(result);
  } catch (err) {
    const status = err.message.includes("denied") ? 403 : 400;
    res.status(status).json({ success: false, message: err.message });
  }
};

// إلغاء حفظ وظيفة
const unsaveJobController = async (req, res) => {
  try {
    await requireStudent(req.user.uid);
    const { jobId } = req.params;
    const result = await unsaveJob(req.user.uid, jobId);
    res.status(200).json(result);
  } catch (err) {
    const status = err.message.includes("denied") ? 403 : 400;
    res.status(status).json({ success: false, message: err.message });
  }
};

// جلب الوظائف المحفوظة
const getSavedJobsController = async (req, res) => {
  try {
    await requireStudent(req.user.uid);
    const result = await getSavedJobs(req.user.uid);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// التحقق من حالة الحفظ
const isJobSavedController = async (req, res) => {
  try {
    await requireStudent(req.user.uid);
    const { jobId } = req.params;
    const result = await isJobSaved(req.user.uid, jobId);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ جلب عدد الوظائف المحفوظة (للبروفايل)
const getSavedJobsCountController = async (req, res) => {
  try {
    await requireStudent(req.user.uid);
    const snapshot = await db
      .collection("savedJobs")
      .where("studentUid", "==", req.user.uid)
      .get();
    
    res.status(200).json({ 
      success: true, 
      count: snapshot.size 
    });
  } catch (err) {
    console.error("Error getting saved jobs count:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  saveJobController,
  unsaveJobController,
  getSavedJobsController,
  isJobSavedController,
  getSavedJobsCountController, // ✅ هذا السطر موجود
};
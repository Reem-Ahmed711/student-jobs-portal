// MOBILE-APP/app-backend/src/Controllers/savedJobController.js
const {
  saveJob,
  unsaveJob,
  getSavedJobs,
  isJobSaved,
} = require("../Service/savedJobService");
const { requireStudent } = require("../auth/roleGuard");

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

module.exports = {
  saveJobController,
  unsaveJobController,
  getSavedJobsController,
  isJobSavedController,
};

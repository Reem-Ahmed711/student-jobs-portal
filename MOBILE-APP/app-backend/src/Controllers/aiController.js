// MOBILE-APP/app-backend/src/Controllers/aiController.js
const { db } = require("../firebase"); // ✅ Added this line
const {
  recommendJobsForStudent,
  improveCV,
  analyzeApplication,
  generateJobDescription,
  analyzeJobMarket,
  generateSkillTest,
  getAITips,
  getMatchAnalysis,
} = require("../Service/aiService");

const {
  requireStudent,
  requireEmployer,
  requireAdmin,
} = require("../auth/roleGuard");

// للطلاب: توصية وظائف
const getJobRecommendations = async (req, res) => {
  try {
    await requireStudent(req.user.uid);
    const recommendedIds = await recommendJobsForStudent(req.user.uid);

    // جلب تفاصيل الوظائف الموصى بها
    const jobs = [];
    for (const id of recommendedIds) {
      const jobDoc = await db.collection("jobs").doc(id).get();
      if (jobDoc.exists) {
        jobs.push({ id: jobDoc.id, ...jobDoc.data() });
      }
    }

    res.status(200).json({ success: true, data: jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// للطلاب: تحسين السيرة الذاتية
const improveCVHandler = async (req, res) => {
  try {
    await requireStudent(req.user.uid);
    const { cvText, jobTitle } = req.body;
    const result = await improveCV(cvText, jobTitle);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// لأصحاب العمل: تحليل طلب توظيف
const analyzeApplicationHandler = async (req, res) => {
  try {
    await requireEmployer(req.user.uid);
    const { jobId, studentUid } = req.params;
    const result = await analyzeApplication(jobId, studentUid);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// لأصحاب العمل: إنشاء وصف وظيفي
const generateDescription = async (req, res) => {
  try {
    await requireEmployer(req.user.uid);
    const { title, department } = req.body;
    const result = await generateJobDescription(title, department);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// للأدمن: تحليل سوق العمل
const getMarketAnalysis = async (req, res) => {
  try {
    await requireAdmin(req.user.uid);
    const result = await analyzeJobMarket();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// لأصحاب العمل: إنشاء اختبار مهارات
const createSkillTest = async (req, res) => {
  try {
    await requireEmployer(req.user.uid);
    const { jobTitle, skills } = req.body;
    const result = await generateSkillTest(jobTitle, skills);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ NEW: Get AI Tips for Student
const getAITipsHandler = async (req, res) => {
  try {
    await requireStudent(req.user.uid);
    const tips = await getAITips(req.user.uid);
    res.status(200).json({ success: true, data: tips });
  } catch (err) {
    console.error("Get AI tips error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ NEW: Get Match Analysis for Student
const getMatchAnalysisHandler = async (req, res) => {
  try {
    await requireStudent(req.user.uid);
    const { jobId } = req.params;
    const match = await getMatchAnalysis(jobId, req.user.uid);
    res.status(200).json({ success: true, data: match });
  } catch (err) {
    console.error("Get match analysis error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getJobRecommendations,
  improveCVHandler,
  analyzeApplicationHandler,
  generateDescription,
  getMarketAnalysis,
  createSkillTest,
  getAITipsHandler,
  getMatchAnalysisHandler,
};
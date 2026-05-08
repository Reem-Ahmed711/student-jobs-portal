// MOBILE-APP/app-backend/src/Routes/aiRoute.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const {
  getJobRecommendations,
  improveCVHandler,
  analyzeApplicationHandler,
  generateDescription,
  getMarketAnalysis,
  createSkillTest,
  getAITipsHandler,
  getMatchAnalysisHandler,
} = require("../Controllers/aiController");

router.use(verifyToken);

// Existing routes
router.get("/recommendations", getJobRecommendations);
router.post("/improve-cv", improveCVHandler);
router.get("/analyze/:jobId/:studentUid", analyzeApplicationHandler);
router.post("/generate-description", generateDescription);
router.post("/skill-test", createSkillTest);
router.get("/market-analysis", getMarketAnalysis);

// ✅ NEW ROUTES
router.get("/tips", getAITipsHandler);
router.get("/match/:jobId", getMatchAnalysisHandler);

module.exports = router;
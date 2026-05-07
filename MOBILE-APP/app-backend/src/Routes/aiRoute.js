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
} = require("../Controllers/aiController");

router.use(verifyToken);

router.get("/recommendations", getJobRecommendations);
router.post("/improve-cv", improveCVHandler);

router.get("/analyze/:jobId/:studentUid", analyzeApplicationHandler);
router.post("/generate-description", generateDescription);
router.post("/skill-test", createSkillTest);

router.get("/market-analysis", getMarketAnalysis);

module.exports = router;

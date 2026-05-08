const express = require("express");

const router = express.Router();

const { analyzeCV } = require("../Controllers/aiController");

router.post("/analyze-cv", analyzeCV);

module.exports = router;
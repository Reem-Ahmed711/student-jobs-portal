const express = require("express");
const router = express.Router();

const {
  getDashboard,
  applyJob,
} = require("../Controllers/dashboardController");

// 🟢 GET dashboard
router.get("/dashboard/:userId", getDashboard);

// 🟡 APPLY job
router.post("/dashboard/apply", applyJob);

module.exports = router;

// MOBILE-APP/app-backend/src/Routes/savedJobRoute.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const {
  saveJobController,
  unsaveJobController,
  getSavedJobsController,
  isJobSavedController,
  getSavedJobsCountController, // ✅ أضيفي هذا السطر
} = require("../Controllers/savedJobController");

router.use(verifyToken);

router.post("/save", saveJobController);

router.delete("/unsave/:jobId", unsaveJobController);

router.get("/", getSavedJobsController);

router.get("/count", getSavedJobsCountController);

router.get("/check/:jobId", isJobSavedController);

module.exports = router;
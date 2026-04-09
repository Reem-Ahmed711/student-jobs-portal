const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

const {
  createJobController,
  updateJobController,
  deleteJobController,
  getAllJobsController,
  getJobByIdController
} = require("../Controllers/jobController");

router.get("/", verifyToken, getAllJobsController);
router.get("/:jobId", verifyToken, getJobByIdController);
router.post("/", verifyToken, createJobController);
router.put("/:jobId", verifyToken, updateJobController);
router.delete("/:jobId", verifyToken, deleteJobController);

module.exports = router;
const express = require("express");
const router = express.Router();

const {
  searchJobs,
  getJobDetails
} = require("./searchController");

router.get("/jobs", searchJobs);
router.get("/job/:id", getJobDetails);

module.exports = router;
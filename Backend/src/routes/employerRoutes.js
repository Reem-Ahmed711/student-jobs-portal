const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const {
  getAllStudents,
  getStudentProfile,
  getApplicants,
  addToShortlist,
  getShortlist
} = require("../Controllers/employerController");

router.get("/students", verifyToken, getAllStudents);
router.get("/students/:studentUid", verifyToken, getStudentProfile);

router.get("/applicants/:jobId", verifyToken, getApplicants);

router.post("/shortlist", verifyToken, addToShortlist);

router.get("/shortlist", verifyToken, getShortlist);


module.exports = router;
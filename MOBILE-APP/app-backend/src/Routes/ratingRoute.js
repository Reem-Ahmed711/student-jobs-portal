const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

const {
  rateStudentController,
  rateEmployerController,
  getUserRatingController,
  getMyRatingController,
  getRatingsGivenController,
  deleteRatingController,
  getStudentRatingByEmployerController,
} = require("../Controllers/ratingController");

// ================= Rate Users =================
router.post("/ratings/student/:studentUid", verifyToken, rateStudentController);
router.post(
  "/ratings/employer/:employerUid",
  verifyToken,
  rateEmployerController,
);

// ================= Get Ratings =================
router.get("/ratings/user/:uid", verifyToken, getUserRatingController);
router.get("/ratings/me", verifyToken, getMyRatingController);
router.get("/ratings/given", verifyToken, getRatingsGivenController);
router.get(
  "/ratings/student/:studentUid/by-me",
  verifyToken,
  getStudentRatingByEmployerController,
);

// ================= Admin: Delete Rating =================
router.delete("/ratings/:ratingId", verifyToken, deleteRatingController);

module.exports = router;

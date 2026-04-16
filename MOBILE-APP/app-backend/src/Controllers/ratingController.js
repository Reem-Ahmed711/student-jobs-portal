const {
  rateStudent,
  rateEmployer,
  getUserRating,
  getRatingsGiven,
  deleteRating,
  getStudentRatingByEmployer,
} = require("../Service/ratingService");

const {
  requireEmployer,
  requireAdmin,
  requireStudent,
} = require("../auth/roleGuard");

// ================= Rate Student (Employer or Admin) =================
const rateStudentController = async (req, res) => {
  try {
    const { studentUid } = req.params;
    const { rating, review, applicationId } = req.body;

    // Allow both employers and admins to rate students
    const userRole = req.user.role;
    if (userRole !== "employer" && userRole !== "admin") {
      throw new Error(
        "Access denied: only employers and admins can rate students",
      );
    }

    const result = await rateStudent(req.user.uid, studentUid, {
      rating,
      review,
      applicationId,
    });
    res.status(201).json(result);
  } catch (err) {
    const status = err.message.includes("Access denied")
      ? 403
      : err.message.includes("must be between")
        ? 400
        : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

// ================= Rate Employer (Student or Admin) =================
const rateEmployerController = async (req, res) => {
  try {
    const { employerUid } = req.params;
    const { rating, review } = req.body;

    const userRole = req.user.role;
    if (userRole !== "student" && userRole !== "admin") {
      throw new Error(
        "Access denied: only students and admins can rate employers",
      );
    }

    const result = await rateEmployer(req.user.uid, employerUid, {
      rating,
      review,
    });
    res.status(201).json(result);
  } catch (err) {
    const status = err.message.includes("Access denied")
      ? 403
      : err.message.includes("must be between")
        ? 400
        : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

// ================= Get User Rating =================
const getUserRatingController = async (req, res) => {
  try {
    const { uid } = req.params;
    const result = await getUserRating(uid);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= Get My Rating =================
const getMyRatingController = async (req, res) => {
  try {
    const result = await getUserRating(req.user.uid);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= Get Ratings I Gave =================
const getRatingsGivenController = async (req, res) => {
  try {
    const result = await getRatingsGiven(req.user.uid);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= Delete Rating (Admin Only) =================
const deleteRatingController = async (req, res) => {
  try {
    await requireAdmin(req.user.uid);
    const { ratingId } = req.params;
    const result = await deleteRating(ratingId, req.user.uid);
    res.status(200).json(result);
  } catch (err) {
    const status = err.message.includes("Access denied") ? 403 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

// ================= Get Student Rating by Employer =================
const getStudentRatingByEmployerController = async (req, res) => {
  try {
    await requireEmployer(req.user.uid);
    const { studentUid } = req.params;
    const result = await getStudentRatingByEmployer(req.user.uid, studentUid);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    const status = err.message.includes("Access denied") ? 403 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

module.exports = {
  rateStudentController,
  rateEmployerController,
  getUserRatingController,
  getMyRatingController,
  getRatingsGivenController,
  deleteRatingController,
  getStudentRatingByEmployerController,
};

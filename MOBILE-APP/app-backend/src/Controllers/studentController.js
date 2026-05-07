// MOBILE-APP/app-backend/src/Controllers/studentController.js
const {
  updateStudentProfile,
  getStudentProfile,
} = require("../Service/studentService");
const { requireStudent } = require("../auth/roleGuard");

// updateProfile
const updateProfile = async (req, res) => {
  try {
    await requireStudent(req.user.uid);
    const updateData = req.body;
    const result = await updateStudentProfile(req.user.uid, updateData);
    res.status(200).json(result);
  } catch (err) {
    const status = err.message.includes("not found")
      ? 404
      : err.message.includes("GPA")
        ? 400
        : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

// getProfile
const getProfile = async (req, res) => {
  try {
    await requireStudent(req.user.uid);
    const result = await getStudentProfile(req.user.uid);
    res.status(200).json(result);
  } catch (err) {
    const status = err.message.includes("not found") ? 404 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

module.exports = {
  updateProfile,
  getProfile,
};

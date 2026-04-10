const {
  getAllStudents,
  getStudentProfile,
  getApplicants,
  addToShortlist,
  getShortlist
} = require("../services/employerService");



const getAllStudentsController = async (req, res) => {
  try {
    const data = await getAllStudents(req.user.uid);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStudentProfileController = async (req, res) => {
  try {
    const data = await getStudentProfile(
      req.user.uid,
      req.params.studentId
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// جلب المتقدمين لوظيفة
const getApplicantsController = async (req, res) => {
  try {
    const data = await getApplicants(
      req.user.uid,
      req.params.jobId
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// إضافة shortlist
const addToShortlistController = async (req, res) => {
  try {
    const { studentUid, jobId } = req.body;

    const result = await addToShortlist(
      req.user.uid,
      studentUid,
      jobId
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getShortlistController = async (req, res) => {
  try {
    const data = await getShortlist(req.user.uid);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getAllStudentsController,
  getStudentProfileController,
  getApplicantsController,
  addToShortlistController,
  getShortlistController
};
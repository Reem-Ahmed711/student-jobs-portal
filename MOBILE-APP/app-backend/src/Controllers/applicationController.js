const {
  applyToJob,
  getJobApplications,
  getStudentApplications
} = require("../Service/applicationService");

const {
  requireStudent,
  requireEmployer
} = require("../auth/roleGuard");

const applyToJobController = async (req, res) => {
  try {
    await requireStudent(req.user.uid);
    const result = await applyToJob(req.user.uid, req.body.jobId);
    res.status(201).json(result);
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};



const getJobApplicationsController = async (req, res) => {
  try {
    await requireEmployer(req.user.uid);
    const { jobId } = req.params;
    const result = await getJobApplications(req.user.uid, jobId);
    res.status(200).json(result);
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};


const getStudentApplicationsController = async (req, res) => {
  try {
    await requireStudent(req.user.uid);
    const result = await getStudentApplications(req.user.uid);
    res.status(200).json(result);
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};

module.exports = { applyToJobController, getJobApplicationsController, getStudentApplicationsController };
const { 
  createJob,
  updateJob,
  deleteJob,
  getAllJobs,
  getJobById
} = require("../Service/jobService");

const { requireEmployer } = require("../auth/roleGuard");

const createJobController = async (req, res) => {
  try {
    await requireEmployer(req.user.uid);
    const result = await createJob(req.user.uid, req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};


const updateJobController = async (req, res) => {
  try {
    await requireEmployer(req.user.uid);
    const { jobId } = req.params;
    const result = await updateJob(req.user.uid, jobId, req.body);
    res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};


const deleteJobController = async (req, res) => {
  try {
    await requireEmployer(req.user.uid);
    const { jobId } = req.params;
    const result = await deleteJob(req.user.uid, jobId);
    res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};


const getAllJobsController = async (req, res) => {
  try {
    const jobs = await getAllJobs();
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getJobByIdController = async (req, res) => {
  try {
    const { jobId } = req.params;
    const result = await getJobById(jobId);
    res.status(result.success ? 200 : 404).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createJobController,
  updateJobController,
  deleteJobController,
  getAllJobsController,
  getJobByIdController
};
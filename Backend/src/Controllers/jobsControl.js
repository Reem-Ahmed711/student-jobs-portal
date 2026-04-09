const jobsService = require("../services/jobsService");

exports.addJob = async (req, res) => {
  try {
    const jobData = req.body;
    const result = await jobsService.createJob(jobData);
    res.status(201).json({ message: "Job added successfully", job: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await jobsService.findAllJobs();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await jobsService.findJobById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
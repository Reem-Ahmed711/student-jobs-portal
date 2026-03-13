const applicationService = require("./applicationService");

exports.applyForJob = async (req, res) => {
  try {
    const userId = req.user.uid;

    const { jobId, message, cvUrl } = req.body;

    if (!jobId) {
      return res.status(400).json({ error: "Job ID is required" });
    }
    const alreadyApplied = await applicationService.checkDuplicateApplication(
      userId,
      jobId,
    );

    if (alreadyApplied) {
      return res
        .status(400)
        .json({ error: "You have already applied for this job" });
    }

    const application = await applicationService.createApplication({
      userId,

      jobId,

      message,

      cvUrl,

      status: "pending",

      appliedAt: new Date().toISOString(),
    });
    res.status(201).json({
      message: "Application submitted successfully",

      application,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
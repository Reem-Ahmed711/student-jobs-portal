const applicationService = require("../services/applicationService");

exports.applyForJob = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { jobId, message, cvUrl } = req.body;

    if (!jobId) {
      return res.status(400).json({ error: "Job ID is required" });
    }

    const alreadyApplied =
      await applicationService.checkDuplicateApplication(userId, jobId);

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

// ✅ ADD THIS
exports.acceptApplication = async (req, res) => {
  try {
    console.log("ACCEPT HIT", req.params.id);
    const { id } = req.params;

    await applicationService.acceptApplication(id);

    res.status(200).json({
      message: "Application accepted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getEmployerApplications = async (req, res) => {
  try {
    const applications = await applicationService.getEmployerApplications();
    res.status(200).json({ applications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
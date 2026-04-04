const { db } = require("../firebase");

// 🟢 GET DASHBOARD
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.params.userId;

    const jobsSnapshot = await db.collection("jobs").get();

    const jobs = jobsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 🟡 APPLY JOB
exports.applyJob = async (req, res) => {
  try {
    const { userId, jobId } = req.body;

    if (!userId || !jobId) {
      return res.status(400).json({
        success: false,
        message: "userId & jobId required",
      });
    }

    await db.collection("applications").add({
      userId,
      jobId,
      status: "pending",
      appliedAt: new Date(),
    });

    res.status(200).json({
      success: true,
      message: "Applied successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

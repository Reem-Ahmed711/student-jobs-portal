const db = require("../config/firebase");

exports.searchJobs = async (req, res) => {
  try {

    const { keyword, location } = req.query;

    let query = db.collection("jobs");

    if (location) {
      query = query.where("location", "==", location);
    }

    const snapshot = await query.get();

    const jobs = [];

    snapshot.forEach(doc => {
      const data = doc.data();

      if (
        keyword &&
        !data.title.toLowerCase().includes(keyword.toLowerCase())
      ) return;

      jobs.push({
        id: doc.id,
        ...data
      });
    });

    res.json(jobs);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getJobDetails = async (req, res) => {

  try {

    const { id } = req.params;

    const doc = await db.collection("jobs").doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    res.json({
      id: doc.id,
      ...doc.data()
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};
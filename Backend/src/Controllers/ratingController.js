const { addRating, getRatingsForUser } = require("../services/ratingService");

const addRatingController = async (req, res) => {
  try {
    const raterUid  = req.user.uid;
    const raterRole = req.userRole;             
    const { targetUid, rating, comment } = req.body;

    if (!targetUid || !rating) {
      return res.status(400).json({ message: "targetUid and rating are required" });
    }

    const result = await addRating(raterUid, raterRole, targetUid, rating, comment);
    return res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRatingsController = async (req, res) => {
  try {
    const { targetUid } = req.params;
    const result = await getRatingsForUser(targetUid);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addRatingController,
  getRatingsController,
};
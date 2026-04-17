const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const verifyRole  = require("../middleware/verifyRole");
const { addRatingController, getRatingsController } = require("../Controllers/ratingController");

// Admin أو Employer يقدر يضيف rating
router.post(
  "/",
  verifyToken,
  verifyRole("admin", "employer"),
  addRatingController
);

// أي حد logged in يقدر يشوف ratings
router.get(
  "/:targetUid",
  verifyToken,
  getRatingsController
);

module.exports = router;
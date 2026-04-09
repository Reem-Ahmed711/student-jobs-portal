const express = require("express");
const router = express.Router();
const { likeJob, addComment, getComments } = require("../Controllers/interactionController");

const verifyToken = require("../middleware/verifyToken");

router.post("/like", verifyToken, likeJob);
router.post("/comment", verifyToken, addComment);
router.get("/comments/:jobId", verifyToken, getComments);

module.exports = router;
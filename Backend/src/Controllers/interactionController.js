const interactionService = require("../services/interactionService");

// POST /like
exports.likeJob = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ error: "Job ID is required" });
    }

    const { exists } = await interactionService.checkExistingLike(userId, jobId);

    if (exists) {
      await interactionService.removeLike(userId, jobId);
      return res.status(200).json({ message: "Job unliked" });
    } else {
      await interactionService.addLike(userId, jobId);
      return res.status(201).json({ message: "Job liked" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /comment
exports.addComment = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { jobId, comment } = req.body;

    if (!jobId || !comment || comment.trim() === "") {
      return res.status(400).json({ error: "Job ID and comment are required" });
    }

    const newComment = await interactionService.createComment({
      userId,
      jobId,
      comment,
    });

    res.status(201).json({
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /comments/:jobId
exports.getComments = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({ error: "Job ID is required" });
    }

    const comments = await interactionService.fetchCommentsByJob(jobId);

    res.status(200).json({
      count: comments.length,
      comments,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
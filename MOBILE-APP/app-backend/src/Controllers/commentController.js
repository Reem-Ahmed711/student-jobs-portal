// MOBILE-APP/app-backend/src/Controllers/commentController.js
const {
  addComment,
  getCommentsByJob,
  deleteComment,
  updateComment,
} = require("../Service/commentService");

// إضافة تعليق
const addCommentController = async (req, res) => {
  try {
    const { jobId, comment } = req.body;
    const userId = req.user.uid;
    const userName = req.user.name || req.user.email?.split("@")[0] || "User";

    if (!jobId || !comment) {
      return res
        .status(400)
        .json({ success: false, message: "Job ID and comment are required" });
    }

    const result = await addComment(userId, userName, jobId, comment);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// جلب تعليقات وظيفة
const getCommentsController = async (req, res) => {
  try {
    const { jobId } = req.params;
    const result = await getCommentsByJob(jobId);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// حذف تعليق
const deleteCommentController = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.uid;
    const userRole = req.user.role || "student";

    const result = await deleteComment(commentId, userId, userRole);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// تحديث تعليق
const updateCommentController = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { comment } = req.body;
    const userId = req.user.uid;

    if (!comment) {
      return res
        .status(400)
        .json({ success: false, message: "Comment is required" });
    }

    const result = await updateComment(commentId, userId, comment);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = {
  addCommentController,
  getCommentsController,
  deleteCommentController,
  updateCommentController,
};

// MOBILE-APP/app-backend/src/Routes/commentRoute.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const {
  addCommentController,
  getCommentsController,
  deleteCommentController,
  updateCommentController,
} = require("../Controllers/commentController");

// جميع الـ routes تحتاج توكن
router.use(verifyToken);

// إضافة تعليق
router.post("/comment", addCommentController);

// جلب تعليقات وظيفة
router.get("/comments/:jobId", getCommentsController);

// حذف تعليق
router.delete("/comments/:commentId", deleteCommentController);

// تحديث تعليق
router.put("/comments/:commentId", updateCommentController);

module.exports = router;

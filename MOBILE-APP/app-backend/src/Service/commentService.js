// MOBILE-APP/app-backend/src/Service/commentService.js
const { admin, db } = require("../firebase");

// إضافة تعليق جديد
const addComment = async (userId, userName, jobId, comment) => {
  try {
    console.log("📝 Adding comment for job:", jobId);
    console.log("📝 User:", userId, userName);
    console.log("📝 Comment:", comment);

    // التحقق من وجود الوظيفة
    const jobDoc = await db.collection("jobs").doc(jobId).get();
    if (!jobDoc.exists) {
      throw new Error("Job not found");
    }

    // إضافة التعليق
    const commentRef = db.collection("comments").doc();
    const newComment = {
      id: commentRef.id,
      jobId,
      userId,
      userName: userName || "Anonymous",
      comment: comment.trim(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: null,
    };

    await commentRef.set(newComment);
    console.log("✅ Comment saved with ID:", commentRef.id);

    // ✅ تحديث عدد التعليقات في الوظيفة
    const commentsSnapshot = await db
      .collection("comments")
      .where("jobId", "==", jobId)
      .get();
    const newCount = commentsSnapshot.size;

    await db.collection("jobs").doc(jobId).update({
      commentCount: newCount,
    });

    console.log("✅ Updated commentCount for job", jobId, "to", newCount);

    return {
      success: true,
      message: "Comment added successfully",
      data: {
        id: commentRef.id,
        ...newComment,
        commentCount: newCount,
      },
    };
  } catch (error) {
    console.error("❌ Add comment error:", error);
    throw new Error(error.message);
  }
};

// جلب تعليقات وظيفة معينة
const getCommentsByJob = async (jobId) => {
  try {
    console.log("📝 Fetching comments for job:", jobId);

    const snapshot = await db
      .collection("comments")
      .where("jobId", "==", jobId)
      .orderBy("createdAt", "desc")
      .get();

    const comments = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      comments.push({
        id: doc.id,
        ...data,
        createdAt:
          data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      });
    });

    console.log("✅ Found", comments.length, "comments");
    return {
      success: true,
      comments,
    };
  } catch (error) {
    console.error("❌ Get comments error:", error);
    throw new Error(error.message);
  }
};

// حذف تعليق
const deleteComment = async (commentId, userId, userRole) => {
  try {
    const commentDoc = await db.collection("comments").doc(commentId).get();
    if (!commentDoc.exists) {
      throw new Error("Comment not found");
    }

    const commentData = commentDoc.data();

    if (commentData.userId !== userId && userRole !== "admin") {
      throw new Error("You don't have permission to delete this comment");
    }

    const jobId = commentData.jobId;

    await db.collection("comments").doc(commentId).delete();

    // ✅ تحديث عدد التعليقات بعد الحذف
    const commentsSnapshot = await db
      .collection("comments")
      .where("jobId", "==", jobId)
      .get();
    const newCount = commentsSnapshot.size;

    await db.collection("jobs").doc(jobId).update({
      commentCount: newCount,
    });

    return {
      success: true,
      message: "Comment deleted successfully",
      commentCount: newCount,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

// تحديث تعليق
const updateComment = async (commentId, userId, newComment) => {
  try {
    const commentDoc = await db.collection("comments").doc(commentId).get();
    if (!commentDoc.exists) {
      throw new Error("Comment not found");
    }

    const commentData = commentDoc.data();

    if (commentData.userId !== userId) {
      throw new Error("You can only edit your own comments");
    }

    await db.collection("comments").doc(commentId).update({
      comment: newComment.trim(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      success: true,
      message: "Comment updated successfully",
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  addComment,
  getCommentsByJob,
  deleteComment,
  updateComment,
};

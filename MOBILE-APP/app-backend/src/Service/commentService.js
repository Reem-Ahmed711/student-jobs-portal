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
      likes: [], // ✅ إضافة مصفوفة اللايكات
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
        likes: data.likes || [],
        likeCount: (data.likes || []).length,
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

// ✅ لايك تعليق
const likeComment = async (commentId, userId) => {
  try {
    const commentRef = db.collection("comments").doc(commentId);
    const commentDoc = await commentRef.get();
    
    if (!commentDoc.exists) {
      throw new Error("Comment not found");
    }
    
    const commentData = commentDoc.data();
    const currentLikes = commentData.likes || [];
    
    // التحقق من أنه لم يعمل لايك من قبل
    if (currentLikes.includes(userId)) {
      throw new Error("You already liked this comment");
    }
    
    await commentRef.update({
      likes: admin.firestore.FieldValue.arrayUnion(userId)
    });
    
    const newLikeCount = currentLikes.length + 1;
    
    return { 
      success: true, 
      message: "Comment liked successfully",
      likeCount: newLikeCount
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

// ✅ إلغاء اللايك
const unlikeComment = async (commentId, userId) => {
  try {
    const commentRef = db.collection("comments").doc(commentId);
    const commentDoc = await commentRef.get();
    
    if (!commentDoc.exists) {
      throw new Error("Comment not found");
    }
    
    const commentData = commentDoc.data();
    const currentLikes = commentData.likes || [];
    
    // التحقق من أنه عمل لايك من قبل
    if (!currentLikes.includes(userId)) {
      throw new Error("You haven't liked this comment");
    }
    
    await commentRef.update({
      likes: admin.firestore.FieldValue.arrayRemove(userId)
    });
    
    const newLikeCount = currentLikes.length - 1;
    
    return { 
      success: true, 
      message: "Comment unliked successfully",
      likeCount: newLikeCount
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

// ✅ جلب اللايكات
const getCommentLikes = async (commentId) => {
  try {
    const commentDoc = await db.collection("comments").doc(commentId).get();
    
    if (!commentDoc.exists) {
      throw new Error("Comment not found");
    }
    
    const likes = commentDoc.data().likes || [];
    return { 
      success: true, 
      likes, 
      count: likes.length 
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

// ✅ تصدير جميع الدوال
module.exports = {
  addComment,
  getCommentsByJob,
  deleteComment,
  updateComment,
  likeComment,      // ✅ أضف هذا
  unlikeComment,    // ✅ أضف هذا
  getCommentLikes,  // ✅ أضف هذا
};
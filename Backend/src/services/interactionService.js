const { db } = require("../config/firebase");

// ---- LIKES ----
const checkExistingLike = async (userId, jobId) => {
  const likeRef = db.collection("likes").doc(`${userId}_${jobId}`);
  const likeDoc = await likeRef.get();
  return { exists: likeDoc.exists, ref: likeRef };
};

const addLike = async (userId, jobId) => {
  const likeRef = db.collection("likes").doc(`${userId}_${jobId}`);
  await likeRef.set({
    userId,
    jobId,
    likedAt: new Date().toISOString(),
  });
};

const removeLike = async (userId, jobId) => {
  const likeRef = db.collection("likes").doc(`${userId}_${jobId}`);
  await likeRef.delete();
};

// ---- COMMENTS ----
const createComment = async ({ userId, jobId, comment }) => {
  const newComment = {
    userId,
    jobId,
    comment: comment.trim(),
    createdAt: new Date().toISOString(),
  };
  const docRef = await db.collection("comments").add(newComment);
  return { id: docRef.id, ...newComment };
};

const fetchCommentsByJob = async (jobId) => {
  const snapshot = await db
    .collection("comments")
    .where("jobId", "==", jobId)
    .orderBy("createdAt", "desc")
    .get();

  const comments = [];
  snapshot.forEach((doc) => {
    comments.push({ id: doc.id, ...doc.data() });
  });
  return comments;
};

module.exports = {
  checkExistingLike,
  addLike,
  removeLike,
  createComment,
  fetchCommentsByJob,
};
const { db } = require("../config/firebase");
const admin = require("firebase-admin");

const serverTimestamp = admin.firestore.FieldValue.serverTimestamp;

// ── Helper ────────────────────────────────────────────────────────
const getUserByUid = async (uid) => {
  const snap = await db.collection("users").doc(uid).get();
  return snap.exists ? { id: snap.id, ...snap.data() } : null;
};

// ── Add Rating ────────────────────────────────────────────────────
const addRating = async (
  raterUid,
  raterRole,
  targetUid,
  rating,
  comment = ""
) => {
  try {
    if (!rating || rating < 1 || rating > 5) {
      return { success: false, message: "Rating must be between 1 and 5" };
    }

    const targetUser = await getUserByUid(targetUid);

    if (!targetUser) {
      return { success: false, message: "Target user not found" };
    }

    const allowedTargets = {
      admin: ["employer", "student"],
      employer: ["student"],
    };

    if (!allowedTargets[raterRole]?.includes(targetUser.role)) {
      return {
        success: false,
        message: `${raterRole} is not allowed to rate a ${targetUser.role}`,
      };
    }

    const ratingData = {
      raterUid,
      raterRole,
      targetUid,
      targetRole: targetUser.role,
      rating,
      comment,
      createdAt: serverTimestamp(),
    };

    await db.collection("ratings").add(ratingData);

    await recalculateAverageRating(targetUid);

    return { success: true, message: "Rating submitted successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// ── Recalculate Average Rating ─────────────────────────────────────
const recalculateAverageRating = async (targetUid) => {
  const snap = await db
    .collection("ratings")
    .where("targetUid", "==", targetUid)
    .get();

  if (snap.empty) return;

  const ratings = snap.docs.map((d) => d.data().rating);
  const average =
    ratings.reduce((a, b) => a + b, 0) / ratings.length;

  await db.collection("users").doc(targetUid).update({
    averageRating: parseFloat(average.toFixed(1)),
    totalRatings: ratings.length,
    updatedAt: serverTimestamp(),
  });
};

// ── Get Ratings ────────────────────────────────────────────────────
const getRatingsForUser = async (targetUid) => {
  try {
    const snap = await db
      .collection("ratings")
      .where("targetUid", "==", targetUid)
      .get();

    if (snap.empty) {
      return { success: true, data: [], message: "No ratings yet" };
    }

    const ratings = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    return { success: true, data: ratings };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

module.exports = {
  addRating,
  getRatingsForUser,
};
const admin = require("firebase-admin");
const db = admin.firestore();

// ================= Rate Student =================
const rateStudent = async (
  ratedByUid,
  studentUid,
  { rating, review, applicationId },
) => {
  // Validate rating
  if (!rating || rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  // Verify student exists
  const studentDoc = await db.collection("users").doc(studentUid).get();
  if (!studentDoc.exists) {
    throw new Error("Student not found");
  }

  if (studentDoc.data().role !== "student") {
    throw new Error("Target user is not a student");
  }

  // Check if already rated (same rater for same student)
  let existingQuery = db
    .collection("ratings")
    .where("ratedBy", "==", ratedByUid)
    .where("ratedUid", "==", studentUid);

  if (applicationId) {
    existingQuery = existingQuery.where("applicationId", "==", applicationId);
  }

  const existingRating = await existingQuery.get();

  if (!existingRating.empty) {
    // Update existing rating
    const ratingId = existingRating.docs[0].id;
    await db
      .collection("ratings")
      .doc(ratingId)
      .update({
        rating,
        review: review || "",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    return { success: true, message: "Rating updated", ratingId };
  }

  // Create new rating
  const ratingData = {
    ratedBy: ratedByUid,
    ratedUid: studentUid,
    rating,
    review: review || "",
    type: "student",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  if (applicationId) {
    ratingData.applicationId = applicationId;
  }

  const ratingRef = await db.collection("ratings").add(ratingData);

  return { success: true, message: "Rating added", ratingId: ratingRef.id };
};

// ================= Rate Employer =================
const rateEmployer = async (ratedByUid, employerUid, { rating, review }) => {
  if (!rating || rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  // Verify employer exists
  const employerDoc = await db.collection("users").doc(employerUid).get();
  if (!employerDoc.exists) {
    throw new Error("Employer not found");
  }

  if (employerDoc.data().role !== "employer") {
    throw new Error("Target user is not an employer");
  }

  // Check if already rated
  const existingRating = await db
    .collection("ratings")
    .where("ratedBy", "==", ratedByUid)
    .where("ratedUid", "==", employerUid)
    .get();

  if (!existingRating.empty) {
    const ratingId = existingRating.docs[0].id;
    await db
      .collection("ratings")
      .doc(ratingId)
      .update({
        rating,
        review: review || "",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    return { success: true, message: "Rating updated", ratingId };
  }

  const ratingRef = await db.collection("ratings").add({
    ratedBy: ratedByUid,
    ratedUid: employerUid,
    rating,
    review: review || "",
    type: "employer",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { success: true, message: "Rating added", ratingId: ratingRef.id };
};

// ================= Get User Rating =================
const getUserRating = async (uid) => {
  const snapshot = await db
    .collection("ratings")
    .where("ratedUid", "==", uid)
    .get();

  if (snapshot.empty) {
    return {
      average: 0,
      total: 0,
      ratings: [],
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };
  }

  const ratings = [];
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let totalRating = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    ratings.push({ id: doc.id, ...data });
    totalRating += data.rating;
    distribution[data.rating] = (distribution[data.rating] || 0) + 1;
  }

  const average = parseFloat((totalRating / ratings.length).toFixed(1));

  // Get rater names
  for (const rating of ratings) {
    const raterDoc = await db.collection("users").doc(rating.ratedBy).get();
    if (raterDoc.exists) {
      rating.raterName = raterDoc.data().name;
      rating.raterRole = raterDoc.data().role;
    }
  }

  return {
    average,
    total: ratings.length,
    ratings,
    distribution,
  };
};

// ================= Get Ratings Given By User =================
const getRatingsGiven = async (uid) => {
  const snapshot = await db
    .collection("ratings")
    .where("ratedBy", "==", uid)
    .get();

  const ratings = [];
  for (const doc of snapshot.docs) {
    const data = { id: doc.id, ...doc.data() };

    // Get rated user info
    const ratedDoc = await db.collection("users").doc(data.ratedUid).get();
    if (ratedDoc.exists) {
      data.ratedUser = {
        name: ratedDoc.data().name,
        role: ratedDoc.data().role,
      };
    }

    ratings.push(data);
  }

  return ratings;
};

// ================= Delete Rating (Admin Only) =================
const deleteRating = async (ratingId, adminUid) => {
  await db.collection("ratings").doc(ratingId).delete();

  await db.collection("adminLogs").add({
    action: "delete_rating",
    ratingId,
    performedBy: adminUid,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { success: true, message: "Rating deleted" };
};

// ================= Get Student Rating by Employer =================
const getStudentRatingByEmployer = async (employerUid, studentUid) => {
  const snapshot = await db
    .collection("ratings")
    .where("ratedBy", "==", employerUid)
    .where("ratedUid", "==", studentUid)
    .get();

  if (snapshot.empty) {
    return null;
  }

  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
};

module.exports = {
  rateStudent,
  rateEmployer,
  getUserRating,
  getRatingsGiven,
  deleteRating,
  getStudentRatingByEmployer,
};

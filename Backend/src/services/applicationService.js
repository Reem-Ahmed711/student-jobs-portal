const admin = require("firebase-admin");
require("../config/firebase");

const db = admin.firestore();
const APPLICATIONS_COLLECTION = "applications";

exports.checkDuplicateApplication = async (userId, jobId) => {
  try {
    const snapshot = await db
      .collection(APPLICATIONS_COLLECTION)
      .where("userId", "==", userId)
      .where("jobId", "==", jobId)
      .get();

    return !snapshot.empty;
  } catch (error) {
    throw new Error("Failed to check duplicate: " + error.message);
  }
};

exports.createApplication = async (applicationData) => {
  try {
    const docRef = await db
      .collection(APPLICATIONS_COLLECTION)
      .add(applicationData);
    return { id: docRef.id, ...applicationData };
  } catch (error) {
    throw new Error("Failed to create application: " + error.message);
  }
};
exports.acceptApplication = async (applicationId) => {
  try {
    await db
      .collection(APPLICATIONS_COLLECTION)
      .doc(applicationId)
      .update({
        status: "accepted",
      });
  } catch (error) {
    throw new Error("Failed to accept application: " + error.message);
  }
};
exports.getEmployerApplications = async () => {
  try {
    const snapshot = await db
      .collection(APPLICATIONS_COLLECTION)
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw new Error("Failed to get applications: " + error.message);
  }
};
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
    console.error("Error checking duplicate:", error);
    throw new Error("Failed to check duplicate: " + error.message);
  }
};

exports.createApplication = async (applicationData) => {
  try {
    // Clean up any undefined or null values
    const cleanData = {};
    
    for (const [key, value] of Object.entries(applicationData)) {
      // Skip undefined, null, and empty strings for optional fields
      if (value !== undefined && value !== null) {
        // For string fields, skip if empty
        if (typeof value === "string" && value.trim() === "") {
          continue;
        }
        cleanData[key] = value;
      }
    }
    
    console.log("Creating application with clean data:", cleanData);
    
    const docRef = await db.collection(APPLICATIONS_COLLECTION).add(cleanData);
    return { id: docRef.id, ...cleanData };
  } catch (error) {
    console.error("Error creating application:", error);
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
        reviewedAt: new Date().toISOString(),
      });
  } catch (error) {
    console.error("Error accepting application:", error);
    throw new Error("Failed to accept application: " + error.message);
  }
};

exports.rejectApplication = async (applicationId) => {
  try {
    await db
      .collection(APPLICATIONS_COLLECTION)
      .doc(applicationId)
      .update({
        status: "rejected",
        reviewedAt: new Date().toISOString(),
      });
  } catch (error) {
    console.error("Error rejecting application:", error);
    throw new Error("Failed to reject application: " + error.message);
  }
};

exports.getEmployerApplications = async () => {
  try {
    const snapshot = await db
      .collection(APPLICATIONS_COLLECTION)
      .get();
    
    const applications = await Promise.all(snapshot.docs.map(async (doc) => {
      const appData = doc.data();
      
      // Get job details
      let jobTitle = "Unknown Job";
      let department = "";
      try {
        const jobDoc = await db.collection("jobs").doc(appData.jobId).get();
        if (jobDoc.exists) {
          jobTitle = jobDoc.data().title || "Unknown Job";
          department = jobDoc.data().department || "";
        }
      } catch (err) {
        console.error("Error fetching job:", err);
      }
      
      // Get student details
      let studentName = "Unknown";
      let studentEmail = "";
      let studentYear = "";
      let studentGpa = "";
      try {
        const studentDoc = await db.collection("users").doc(appData.userId).get();
        if (studentDoc.exists) {
          const studentData = studentDoc.data();
          studentName = studentData.name || "Unknown";
          studentEmail = studentData.email || "";
          studentYear = studentData.year || "";
          studentGpa = studentData.gpa || "";
        }
      } catch (err) {
        console.error("Error fetching student:", err);
      }
      
      return {
        id: doc.id,
        ...appData,
        jobTitle,
        department,
        student: {
          name: studentName,
          email: studentEmail,
          year: studentYear,
          gpa: studentGpa
        }
      };
    }));
    
    return applications;
  } catch (error) {
    console.error("Error getting employer applications:", error);
    throw new Error("Failed to get applications: " + error.message);
  }
};

exports.getApplicationsByUserId = async (userId) => {
  try {
    const snapshot = await db
      .collection(APPLICATIONS_COLLECTION)
      .where("userId", "==", userId)
      .orderBy("appliedAt", "desc")
      .get();
    
    const applications = await Promise.all(snapshot.docs.map(async (doc) => {
      const appData = doc.data();
      
      // Get job details
      let jobTitle = "Unknown Job";
      try {
        const jobDoc = await db.collection("jobs").doc(appData.jobId).get();
        if (jobDoc.exists) {
          jobTitle = jobDoc.data().title || "Unknown Job";
        }
      } catch (err) {
        console.error("Error fetching job:", err);
      }
      
      return {
        id: doc.id,
        ...appData,
        jobTitle
      };
    }));
    
    return applications;
  } catch (error) {
    console.error("Error getting user applications:", error);
    throw new Error("Failed to get user applications: " + error.message);
  }
};

const admin = require("firebase-admin");
const serviceAccount = require("./service-account-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "student-jobs-portal.firebasestorage.app",
});

const db = admin.firestore();

console.log("✅ Firebase connected successfully");

module.exports = admin;
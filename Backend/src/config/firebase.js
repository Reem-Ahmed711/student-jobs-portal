const admin = require("firebase-admin");
const serviceAccount = require("./service-account-key.json");
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

console.log("✅ Firebase connected successfully");

module.exports = { admin, db };
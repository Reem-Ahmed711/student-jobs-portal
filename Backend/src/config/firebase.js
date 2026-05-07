const admin = require("firebase-admin");
const serviceAccount = require("./service-account-Key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

console.log("🔥 Firebase connected successfully");

module.exports = { admin, db };
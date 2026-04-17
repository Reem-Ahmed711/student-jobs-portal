// MOBILE-APP/app-backend/src/firebase.js
const admin = require("firebase-admin");

// ✅ غيّرنا اسم الملف هنا
const serviceAccount = require("./service-account-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = { admin, db };

const admin = require("firebase-admin");
const serviceAccount = require("./service-account-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "student-jobs-portal.firebasestorage.app"
});

// إنشاء اتصال Firestore
const db = admin.firestore();

console.log('✅ Firebase connected successfully');

// صدّر الـ db مش admin
module.exports = db;
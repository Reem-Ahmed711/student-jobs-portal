// C:\Student-job-portal\Backend\src\config\firebase.js
const admin = require("firebase-admin");

// التحقق إذا كان هناك app موجود بالفعل
if (!admin.apps.length) {
  const serviceAccount = require("./service-account-key.json");
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
console.log("🔥 Firebase connected successfully");

module.exports = { admin, db };

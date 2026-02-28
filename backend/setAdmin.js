const admin = require("firebase-admin");
const serviceAccount = require("./src/config/service-account-key.json"); // المسار صح

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const userEmail = "dinaaeebrahim@gmail.com"; 

admin.auth().getUserByEmail(userEmail)
  .then(userRecord => {
    return admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });
  })
  .then(() => {
    console.log("done admin");
  })
  .catch(error => {
    console.error("rror", error);
  });
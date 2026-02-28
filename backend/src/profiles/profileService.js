const admin = require("../config/firebase");

async function getProfile(uid) {
  const doc = await admin.firestore().collection("users").doc(uid).get();
  if (!doc.exists) throw new Error("User not found");
  return doc.data();
}

async function updateProfile(uid, data) {
  await admin.firestore().collection("users").doc(uid).update({
    ...data,
   updatedAt: new Date().toISOString(),
  });
  return { message: "Profile updated successfully" };
}

module.exports = { getProfile, updateProfile };
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const dashboardController = require("../controllers/dashboardController"); 
router.get("/users", verifyToken, dashboardController.getAllUsers);
module.exports = router;

async function updateProfile(uid, data) {
  try {
    await admin.firestore().collection("users").doc(uid).update({
      ...data,
      updatedAt: new Date().toISOString(),
    });
    return { message: "Profile updated successfully" };
  } catch (error) {
    throw new Error(error.message);
  }
}


module.exports = { getProfile, updateProfile };
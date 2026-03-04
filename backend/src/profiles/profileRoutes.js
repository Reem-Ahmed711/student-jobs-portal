const express = require('express');
const router = express.Router();
const admin = require('firebase-admin'); 
const verifyToken = require("../middleware/verifyToken"); 
const db = admin.firestore();

router.get('/', verifyToken, async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }

    const userDoc = await db.collection('users').doc(req.user.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(userDoc.data());

  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
}
);
router.put('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid; 
    const updatedData = req.body; 

    await db.collection('users').doc(userId).update(updatedData);

    res.status(200).json({ message: "Profile updated successfully!", data: updatedData });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
});
module.exports = router;

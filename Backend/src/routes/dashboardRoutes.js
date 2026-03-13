const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const admin = require("firebase-admin");

const db = admin.firestore();

const getAllUsers = async (req, res) => {
  try {

    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ 
        success: false, 
        message: "Access denied: Admins only" 
      });
    }

    const usersSnapshot = await db.collection('users').get();
    
    const users = usersSnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));

    res.status(200).json({ 
      success: true, 
      count: users.length,
      data: users 
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Server Error: " + error.message 
    });
  }
};

router.get("/users", verifyToken, getAllUsers);

module.exports = router;
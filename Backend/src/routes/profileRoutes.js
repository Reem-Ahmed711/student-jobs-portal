
const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

const { getProfile, updateProfile } = require("../services/profileService");
const { uploadAndSaveProfileImage } = require("../Controllers/profileController");

const { getAllStudents } = require("../services/employerService");
const {
  getUserRole,
  requireAdmin,
  requireStudent,
  requireEmployer
} = require("../auth/roleGuard");

const { 
  getUserProfile, 
  updateUserProfile, 
  deleteUser, 
  getAllUsers 
} = require("../services/adminService");

router.get('/', verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const role = await getUserRole(uid);

    if (role === "admin") {
      const targetUid = req.query.uid || uid;
      const result = await getUserProfile(uid, targetUid);
      return res.status(result.success ? 200 : 404).json(result);
    }

    if (role === "employer") {
      const students = await getAllStudents(uid);
      return res.status(200).json({ success: true, data: students });
    }

    if (role === "student") {
      const result = await getProfile(uid);
      return res.status(result.success ? 200 : 404).json(result);
    }

    res.status(403).json({ message: "Access denied" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.put('/', verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const role = await getUserRole(uid);
    const updatedData = req.body;

    if (role === "admin") {
      const targetUid = req.body.uid;
      if (!targetUid) return res.status(400).json({ message: "target UID required" });

      const result = await updateUserProfile(uid, targetUid, updatedData);
      return res.status(result.success ? 200 : 400).json(result);
    }

    if (role === "student") {
      const result = await updateProfile(uid, updatedData);
      return res.status(result.success ? 200 : 400).json(result);
    }

    res.status(403).json({ message: "Employers cannot update profiles" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.delete('/', verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const role = await getUserRole(uid);

    if (role !== "admin") {
      return res.status(403).json({ message: "Only admins can delete users" });
    }

    const targetUid = req.body.uid;
    if (!targetUid) return res.status(400).json({ message: "target UID required" });

    const result = await deleteUser(uid, targetUid);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post('/upload', verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const role = await getUserRole(uid);

    if (role === "employer") {
      return res.status(403).json({ message: "Employers cannot upload profile images" });
    }

    const file = req.files.profileImage; 
    const result = await uploadAndSaveProfileImage(uid, file);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
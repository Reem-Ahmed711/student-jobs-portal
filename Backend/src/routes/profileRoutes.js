const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");

const {
  getProfile,
  updateProfile
} = require("../services/profileService");

const {
  uploadAndSaveProfileImage
} = require("../Controllers/profileControl");

const {
  getUserRole,
  getUserProfile,
  updateUserProfile,
  deleteUser
} = require("../auth/roleGuard");

router.get("/", verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const role = await getUserRole(uid);

    // ADMIN
    if (role === "admin") {
      const targetUid = req.query.uid || uid;
      const result = await getUserProfile(uid, targetUid);
      return res.status(result.success ? 200 : 404).json(result);
    }
    const result = await getProfile(uid);
    return res.status(result.success ? 200 : 404).json(result);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.put("/", verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const role = await getUserRole(uid);
    const updatedData = req.body;


    if (role === "admin") {
      const targetUid = req.body.uid;

      const result = await updateUserProfile(uid, targetUid, updatedData);
      return res.status(result.success ? 200 : 400).json(result);
    }

    const result = await updateProfile(uid, updatedData);
    return res.status(result.success ? 200 : 400).json(result);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.delete("/", verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const role = await getUserRole(uid);

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only admins can delete users"
      });
    }

    const targetUid = req.body.uid;

    const result = await deleteUser(uid, targetUid);
    return res.status(result.success ? 200 : 400).json(result);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.post("/upload", verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;

    const file = req.files.profileImage;

    const result = await uploadAndSaveProfileImage(uid, file);

    return res.status(result.success ? 200 : 400).json(result);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
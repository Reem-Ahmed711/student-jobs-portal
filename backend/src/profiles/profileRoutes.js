const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { getProfile, updateProfile } = require("./profileService"); // تأكدي إن المسار هنا صح

// الحصول على البروفايل
router.get("/", verifyToken, async (req, res) => {
  try {
    const data = await getProfile(req.user.uid);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// تحديث البروفايل
router.put("/", verifyToken, async (req, res) => {
  try {
    const result = await updateProfile(req.user.uid, req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ⚠️ أهم سطر اللي كان ناقص أو فيه غلطة
module.exports = router;
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const dashboardController = require("../controllers/dashboardController"); 

// لما حد يطلب الرابط ده، السيرفر هينادي على الدالة اللي في الكنترولر
router.get("/users", verifyToken, dashboardController.getAllUsers);

module.exports = router;
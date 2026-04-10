const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadCVController } = require("../Controllers/cvController");

const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("cv"), uploadCVController);

module.exports = router;
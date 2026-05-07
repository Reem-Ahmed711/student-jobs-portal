// MOBILE-APP/app-backend/src/Controllers/cvController.js
const { processCV } = require("../Service/cvParserService");
const { requireStudent } = require("../auth/roleGuard");
const multer = require("multer");

// تكوين multer لاستقبال الملفات
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB حد أقصى
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
});

// رفع وتحليل السيرة الذاتية
const uploadAndParseCV = async (req, res) => {
  try {
    await requireStudent(req.user.uid);

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const pdfBuffer = req.file.buffer;
    const result = await processCV(pdfBuffer, req.user.uid);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (err) {
    const status = err.message.includes("Access denied") ? 403 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

module.exports = {
  uploadAndParseCV,
  uploadMiddleware: upload.single("cv"),
};

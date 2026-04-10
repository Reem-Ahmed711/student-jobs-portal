const fs = require("fs");
const { processCV } = require("../services/cvService");

const uploadCVController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded"
      });
    }

    const filePath = req.file.path;

    // 🔥 call service
    const data = await processCV(filePath);

    // 🧹 delete temp file
    fs.unlinkSync(filePath);

    return res.status(200).json({
      message: "CV processed successfully",
      data
    });

  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
};

module.exports = {
  uploadCVController
};
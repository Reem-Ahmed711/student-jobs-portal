const { askAI } = require("../services/aiService");

const analyzeCV = async (req, res) => {
  try {
    const { cvText } = req.body;

    const response = await askAI(cvText);

    res.json({
      success: true,
      result: response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  analyzeCV,
};
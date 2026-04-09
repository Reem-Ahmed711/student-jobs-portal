const extractTextFromPDF = require("../utils/extractTextFromPDF");
const extractCVData = require("../utils/extractCVData");
const { db } = require("../firebase"); 

const processCV = async (filePath) => {
  try {
  
    const text = await extractTextFromPDF(filePath);
    
    const data = extractCVData(text);

 await db.collection("cvs").add(data);

    return data;

  } catch (error) {
    throw new Error("Error processing CV: " + error.message);
  }
};

module.exports = {
  processCV
};
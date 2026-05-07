// MOBILE-APP/app-backend/src/Service/cvParserService.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { admin, db } = require("../firebase");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const os = require("os");
const path = require("path");

// تهيئة Gemini AI
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || "YOUR_API_KEY",
);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// استخراج النص من ملف PDF
const extractTextFromPDF = async (pdfBuffer) => {
  try {
    const data = await pdfParse(pdfBuffer);
    return data.text;
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error("Failed to extract text from PDF");
  }
};

// استخراج البيانات من النص باستخدام AI
const extractInformationWithAI = async (text) => {
  try {
    const prompt = `
      أنا طالب وأريد تسجيل حساب في منصة توظيف. لدي سيرتي الذاتية التالية.
      قم باستخراج المعلومات التالية من النص بدقة:
      
      1. الاسم الكامل (Full Name)
      2. رقم الهاتف (Phone Number) - إذا وجد
      3. البريد الإلكتروني (Email) - إذا وجد
      4. القسم أو التخصص (Department) - مثل: Computer Science, Physics, Chemistry, إلخ
      5. السنة الدراسية (Year) - مثل: 1, 2, 3, 4, Graduate
      6. المعدل التراكمي (GPA) - رقم من 0 إلى 5
      7. المهارات (Skills) - قائمة بالمهارات
      8. نبذة عني (About) - ملخص قصير
      
      نص السيرة الذاتية:
      ${text.substring(0, 3000)}  // أخذ أول 3000 حرف فقط
      
      أرسل لي الإجابة بتنسيق JSON فقط، بدون أي نص إضافي، مثل:
      {
        "name": "Ahmed Mohamed",
        "phone": "+201234567890",
        "email": "ahmed@example.com",
        "department": "Computer Science",
        "year": "3",
        "gpa": "3.7",
        "skills": ["Python", "JavaScript", "Data Analysis"],
        "about": "Computer Science student passionate about AI"
      }
      
      إذا لم تجد معلومة معينة، اتركها فارغة أو null.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // استخراج JSON من النص
    let jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const extractedData = JSON.parse(jsonMatch[0]);
      return extractedData;
    }

    throw new Error("Failed to parse AI response");
  } catch (error) {
    console.error("AI extraction error:", error);
    throw new Error("Failed to extract information with AI");
  }
};

// المعالجة الكاملة لرفع السيرة الذاتية
const processCV = async (pdfBuffer, studentUid = null) => {
  try {
    // 1. استخراج النص من PDF
    const extractedText = await extractTextFromPDF(pdfBuffer);

    // 2. استخراج البيانات باستخدام AI
    const extractedData = await extractInformationWithAI(extractedText);

    // 3. إذا كان هناك studentUid، قم بتحديث البيانات في Firebase
    if (studentUid) {
      const updateData = {};
      if (extractedData.name) updateData.name = extractedData.name;
      if (extractedData.phone) updateData.phone = extractedData.phone;
      if (extractedData.email) updateData.email = extractedData.email;
      if (extractedData.department)
        updateData.department = extractedData.department;
      if (extractedData.year) updateData.year = extractedData.year;
      if (extractedData.gpa) updateData.gpa = parseFloat(extractedData.gpa);
      if (extractedData.skills && extractedData.skills.length > 0)
        updateData.skills = extractedData.skills;
      if (extractedData.about) updateData.about = extractedData.about;

      if (Object.keys(updateData).length > 0) {
        updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp();
        await db.collection("users").doc(studentUid).update(updateData);
      }
    }

    return {
      success: true,
      data: extractedData,
    };
  } catch (error) {
    console.error("CV processing error:", error);
    return {
      success: false,
      message: error.message,
    };
  }
};

module.exports = {
  processCV,
  extractTextFromPDF,
  extractInformationWithAI,
};

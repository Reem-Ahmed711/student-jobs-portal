// MOBILE-APP/app-backend/src/Service/aiService.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { admin, db } = require("../firebase");

// تهيئة Gemini
const genAI = new GoogleGenerativeAI("AIzaSyAS11CRqpXPZHhN3UhPXXlu4cEk4jW3VTs"); // حطي المفتاح الجديد هنا
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// ================= 1. توصية وظائف للطالب =================
const recommendJobsForStudent = async (studentUid) => {
  try {
    // جلب بيانات الطالب
    const studentDoc = await db.collection("users").doc(studentUid).get();
    const student = studentDoc.data();

    // جلب جميع الوظائف المتاحة
    const jobsSnapshot = await db
      .collection("jobs")
      .where("status", "==", "active")
      .get();

    const jobs = jobsSnapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title,
      department: doc.data().department,
      description: doc.data().description,
      requirements: doc.data().requirements,
    }));

    if (jobs.length === 0) return [];

    // بناء الـ prompt لـ Gemini
    const prompt = `
      أنا طالب أبحث عن وظيفة. بياناتي:
      - التخصص: ${student.department || "غير محدد"}
      - المهارات: ${(student.skills || []).join(", ")}
      - GPA: ${student.gpa || "غير محدد"}
      - السنة: ${student.year || "غير محدد"}
      
      هذه قائمة بالوظائف المتاحة:
      ${jobs.map((job, i) => `${i + 1}. ${job.title} - ${job.department}`).join("\n")}
      
      قم بترتيب هذه الوظائف حسب مدى توافقها معي. أرسل لي فقط قائمة بالـ IDs مرتبة من الأفضل إلى الأقل توافقاً.
      مثال: ["jobId1", "jobId2", "jobId3"]
    `;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // تحويل النتيجة إلى array
    const recommendedIds = JSON.parse(response);
    return recommendedIds;
  } catch (error) {
    console.error("AI recommendation error:", error);
    return [];
  }
};

// ================= 2. تحسين السيرة الذاتية =================
const improveCV = async (cvText, jobTitle) => {
  try {
    const prompt = `
      قم بتحسين السيرة الذاتية التالية لوظيفة "${jobTitle}":
      
      ${cvText}
      
      أرسل لي السيرة المحسنة مع نصائح للتحسين.
      يجب أن تكون السيرة منظمة وجذابة لأرباب العمل.
    `;

    const result = await model.generateContent(prompt);
    return { success: true, improvedCV: result.response.text() };
  } catch (error) {
    console.error("AI CV improvement error:", error);
    return { success: false, message: error.message };
  }
};

// ================= 3. تحليل التطبيقات (لصاحب العمل) =================
const analyzeApplication = async (jobId, studentUid) => {
  try {
    // جلب بيانات الوظيفة
    const jobDoc = await db.collection("jobs").doc(jobId).get();
    const job = jobDoc.data();

    // جلب بيانات الطالب
    const studentDoc = await db.collection("users").doc(studentUid).get();
    const student = studentDoc.data();

    const prompt = `
      قم بتحليل مدى توافق الطالب التالي مع الوظيفة:
      
      الوظيفة:
      - المسمى: ${job.title}
      - القسم: ${job.department}
      - المتطلبات: ${job.requirements || "غير محددة"}
      
      الطالب:
      - التخصص: ${student.department || "غير محدد"}
      - المهارات: ${(student.skills || []).join(", ")}
      - GPA: ${student.gpa || "غير محدد"}
      - السنة: ${student.year || "غير محدد"}
      
      أرسل لي:
      1. نسبة التوافق (0-100%)
      2. نقاط القوة
      3. نقاط الضعف
      4. توصية (قبول/مراجعة/رفض)
    `;

    const result = await model.generateContent(prompt);
    const analysis = result.response.text();

    return { success: true, analysis };
  } catch (error) {
    console.error("AI analysis error:", error);
    return { success: false, message: error.message };
  }
};

// ================= 4. إنشاء وصف وظيفي (لصاحب العمل) =================
const generateJobDescription = async (title, department) => {
  try {
    const prompt = `
      قم بإنشاء وصف وظيفي احترافي لوظيفة:
      - المسمى: ${title}
      - القسم: ${department}
      
      أرسل لي:
      1. وصف المهام (3-5 نقاط)
      2. المتطلبات (3-5 نقاط)
      3. المؤهلات المفضلة
      4. المهارات المطلوبة
    `;

    const result = await model.generateContent(prompt);
    return { success: true, description: result.response.text() };
  } catch (error) {
    console.error("AI generate description error:", error);
    return { success: false, message: error.message };
  }
};

// ================= 5. تحليل سوق العمل =================
const analyzeJobMarket = async () => {
  try {
    // جلب جميع الوظائف
    const jobsSnapshot = await db.collection("jobs").get();
    const jobs = jobsSnapshot.docs.map((doc) => doc.data());

    // حساب الإحصائيات
    const departments = {};
    const avgSalaries = {};

    jobs.forEach((job) => {
      const dept = job.department || "غير محدد";
      departments[dept] = (departments[dept] || 0) + 1;

      const salary = parseInt(job.salary) || 0;
      if (salary > 0) {
        if (!avgSalaries[dept]) {
          avgSalaries[dept] = { total: 0, count: 0 };
        }
        avgSalaries[dept].total += salary;
        avgSalaries[dept].count++;
      }
    });

    // حساب متوسط الرواتب
    Object.keys(avgSalaries).forEach((dept) => {
      avgSalaries[dept] = avgSalaries[dept].total / avgSalaries[dept].count;
    });

    const prompt = `
      قم بتحليل سوق العمل بناءً على هذه البيانات:
      - عدد الوظائف لكل قسم: ${JSON.stringify(departments)}
      - متوسط الرواتب لكل قسم: ${JSON.stringify(avgSalaries)}
      
      أرسل لي:
      1. أكثر 3 أقسام طلباً
      2. أكثر المهارات المطلوبة (توقعاً)
      3. نصائح للطلاب الجدد
    `;

    const result = await model.generateContent(prompt);
    return {
      success: true,
      analysis: result.response.text(),
      departments,
      avgSalaries,
    };
  } catch (error) {
    console.error("AI market analysis error:", error);
    return { success: false, message: error.message };
  }
};

// ================= 6. إنشاء اختبار مهارات =================
const generateSkillTest = async (jobTitle, skills) => {
  try {
    const prompt = `
      قم بإنشاء اختبار قصير (5 أسئلة) لتقييم مهارات المرشح لوظيفة "${jobTitle}".
      المهارات المطلوبة: ${skills.join(", ")}
      
      كل سؤال يجب أن يكون:
      - السؤال
      - 4 اختيارات (مع تحديد الإجابة الصحيحة)
    `;

    const result = await model.generateContent(prompt);
    return { success: true, test: result.response.text() };
  } catch (error) {
    console.error("AI generate test error:", error);
    return { success: false, message: error.message };
  }
};

module.exports = {
  recommendJobsForStudent,
  improveCV,
  analyzeApplication,
  generateJobDescription,
  analyzeJobMarket,
  generateSkillTest,
};

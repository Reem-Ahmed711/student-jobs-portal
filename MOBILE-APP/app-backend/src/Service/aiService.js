// MOBILE-APP/app-backend/src/Service/aiService.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { admin, db } = require("../firebase");

// Initialize Gemini
const genAI = new GoogleGenerativeAI("AIzaSyCD3-s0qrIQ4oIgI8T3r7_HnbMSO1Z6K1s"); 
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const model = genAI.getGenerativeModel({  model: "gemini-2.0-flash" });

// ================= 1. Job Recommendations for Student =================
const recommendJobsForStudent = async (studentUid) => {
  try {
    // Fetch student data
    const studentDoc = await db.collection("users").doc(studentUid).get();
    const student = studentDoc.data();

    // Fetch all available jobs
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

    // Build prompt for Gemini
    const prompt = `
      I am a student looking for a job. My details:
      - Major: ${student.department || "Not specified"}
      - Skills: ${(student.skills || []).join(", ")}
      - GPA: ${student.gpa || "Not specified"}
      - Year: ${student.year || "Not specified"}
      
      Here are the available jobs:
      ${jobs.map((job, i) => `${i + 1}. ${job.title} - ${job.department} (ID: ${job.id})`).join("\n")}
      
      Return ONLY a JSON array of job IDs sorted from best match to least match.
      Example format: ["jobId1", "jobId2", "jobId3"]
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Extract JSON from response
    const jsonMatch = responseText.match(/\[[\s\S]*?\]/);
    let recommendedIds = [];
    
    if (jsonMatch) {
      try {
        recommendedIds = JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.error("Failed to parse JSON:", e);
        recommendedIds = jobs.map(job => job.id);
      }
    } else {
      recommendedIds = jobs.map(job => job.id);
    }
    
    return recommendedIds;
  } catch (error) {
    console.error("AI recommendation error:", error);
    const jobsSnapshot = await db.collection("jobs").where("status", "==", "active").get();
    return jobsSnapshot.docs.map((doc) => doc.id);
  }
};

// ================= 2. CV Improvement =================
const improveCV = async (cvText, jobTitle) => {
  try {
    const prompt = `
      Improve the following CV for the "${jobTitle}" position:
      
      ${cvText}
      
      Send me the improved CV with improvement tips.
      The CV should be well-organized and attractive to employers.
    `;

    const result = await model.generateContent(prompt);
    return { success: true, improvedCV: result.response.text() };
  } catch (error) {
    console.error("AI CV improvement error:", error);
    return { success: false, message: error.message };
  }
};

// ================= 3. Application Analysis (for Employers) =================
const analyzeApplication = async (jobId, studentUid) => {
  try {
    // Fetch job data
    const jobDoc = await db.collection("jobs").doc(jobId).get();
    const job = jobDoc.data();

    // Fetch student data
    const studentDoc = await db.collection("users").doc(studentUid).get();
    const student = studentDoc.data();

    const prompt = `
      Analyze how well the following student matches the job:
      
      Job:
      - Title: ${job.title}
      - Department: ${job.department}
      - Requirements: ${job.requirements || "Not specified"}
      
      Student:
      - Major: ${student.department || "Not specified"}
      - Skills: ${(student.skills || []).join(", ")}
      - GPA: ${student.gpa || "Not specified"}
      - Year: ${student.year || "Not specified"}
      
      Send me:
      1. Match percentage (0-100%)
      2. Strengths
      3. Weaknesses
      4. Recommendation (Accept/Review/Reject)
    `;

    const result = await model.generateContent(prompt);
    const analysis = result.response.text();

    return { success: true, analysis };
  } catch (error) {
    console.error("AI analysis error:", error);
    return { success: false, message: error.message };
  }
};

// ================= 4. Generate Job Description (for Employers) =================
const generateJobDescription = async (title, department) => {
  try {
    const prompt = `
      Create a professional job description for:
      - Title: ${title}
      - Department: ${department}
      
      Send me:
      1. Responsibilities (3-5 bullet points)
      2. Requirements (3-5 bullet points)
      3. Preferred qualifications
      4. Required skills
    `;

    const result = await model.generateContent(prompt);
    return { success: true, description: result.response.text() };
  } catch (error) {
    console.error("AI generate description error:", error);
    return { success: false, message: error.message };
  }
};

// ================= 5. Job Market Analysis =================
const analyzeJobMarket = async () => {
  try {
    // Fetch all jobs
    const jobsSnapshot = await db.collection("jobs").get();
    const jobs = jobsSnapshot.docs.map((doc) => doc.data());

    // Calculate statistics
    const departments = {};
    const avgSalaries = {};

    jobs.forEach((job) => {
      const dept = job.department || "Not specified";
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

    // Calculate average salaries
    Object.keys(avgSalaries).forEach((dept) => {
      avgSalaries[dept] = avgSalaries[dept].total / avgSalaries[dept].count;
    });

    const prompt = `
      Analyze the job market based on this data:
      - Number of jobs per department: ${JSON.stringify(departments)}
      - Average salary per department: ${JSON.stringify(avgSalaries)}
      
      Send me:
      1. Top 3 most in-demand departments
      2. Most in-demand skills (predicted)
      3. Tips for new graduates
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

// ================= 6. Generate Skills Test =================
const generateSkillTest = async (jobTitle, skills) => {
  try {
    const prompt = `
      Create a short quiz (5 questions) to assess candidate skills for the "${jobTitle}" position.
      Required skills: ${skills.join(", ")}
      
      Each question should include:
      - The question
      - 4 options (with the correct answer indicated)
    `;

    const result = await model.generateContent(prompt);
    return { success: true, test: result.response.text() };
  } catch (error) {
    console.error("AI generate test error:", error);
    return { success: false, message: error.message };
  }
};

// ================= 7. 🆕 GET AI TIPS (NEW) =================
const getAITips = async (studentUid) => {
  try {
    const studentDoc = await db.collection("users").doc(studentUid).get();
    const student = studentDoc.data();

    const applicationsSnapshot = await db
      .collection("applications")
      .where("studentUid", "==", studentUid)
      .get();
    
    const applicationsCount = applicationsSnapshot.size;

    const prompt = `
      Based on this student profile:
      - Major: ${student.department || "Not specified"}
      - Skills: ${(student.skills || []).join(", ")}
      - GPA: ${student.gpa || "Not specified"}
      - Year: ${student.year || "Not specified"}
      - Number of job applications: ${applicationsCount}
      
      Provide 5 personalized tips for job search improvement.
      Return as JSON array: [{"title": "Tip title", "description": "Tip description"}]
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\[[\s\S]*?\]/);
    
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.error("Failed to parse tips:", e);
      }
    }
    
    return [
      { title: "Complete Your Profile", description: "Add more skills and details to your profile" },
      { title: "Apply More", description: `You've applied to ${applicationsCount} jobs. Try to reach 15+ applications` }
    ];
  } catch (error) {
    console.error("AI tips error:", error);
    return [{ title: "Keep Learning", description: "Continue developing your skills" }];
  }
};

// ================= 8. 🆕 GET MATCH ANALYSIS (NEW) =================
const getMatchAnalysis = async (jobId, studentUid) => {
  try {
    const jobDoc = await db.collection("jobs").doc(jobId).get();
    const job = jobDoc.data();
    const studentDoc = await db.collection("users").doc(studentUid).get();
    const student = studentDoc.data();

    const prompt = `
      Analyze job fit:
      JOB: ${job.title} - ${job.department}
      Requirements: ${job.requirements || "None"}
      STUDENT: Major: ${student.department}, Skills: ${(student.skills || []).join(", ")}, GPA: ${student.gpa}
      
      Return JSON: {"matchPercentage": 0-100, "strengths": [], "weaknesses": [], "recommendation": "Accept/Review/Reject", "feedback": ""}
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.error("Failed to parse match:", e);
      }
    }
    
    return {
      matchPercentage: 50,
      strengths: student.skills || ["Good potential"],
      weaknesses: ["Limited experience"],
      recommendation: "Review",
      feedback: "Manual review recommended"
    };
  } catch (error) {
    console.error("AI match analysis error:", error);
    return { matchPercentage: 50, recommendation: "Review", feedback: "AI analysis unavailable" };
  }
};

// ================= EXPORT (UPDATE THIS!) =================
module.exports = {
  recommendJobsForStudent,
  improveCV,
  analyzeApplication,
  generateJobDescription,
  analyzeJobMarket,
  generateSkillTest,
  getAITips,        // 🆕 ADD THIS
  getMatchAnalysis, // 🆕 ADD THIS
};
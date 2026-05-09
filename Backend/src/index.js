const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const serviceAccount = require("./config/service-account-key.json");
const axios = require("axios");

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

console.log("🔥 Firebase connected");

// ========== HEALTH CHECK ==========
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running!", timestamp: new Date().toISOString() });
});

// ========== AUTH ROUTES ==========
app.post("/api/auth/register", async (req, res) => {
  const { email, password, name, role, department, year, gpa, skills, phone } = req.body;
  try {
    const user = await admin.auth().createUser({ email, password, displayName: name });
    
    const userData = {
      name,
      email,
      role: role || "student",
      department: department || "",
      year: year || "",
      gpa: gpa || "",
      skills: skills || [],
      phone: phone || "",
      createdAt: new Date().toISOString()
    };
    
    await db.collection("users").doc(user.uid).set(userData);
    
    // Get ID Token (not custom token)
    const API_KEY = "AIzaSyCD3-s0qrIQ4oIgI8T3r7_HnbMSO1Z6K1s";
    const loginResponse = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
      { email, password, returnSecureToken: true }
    );
    
    res.json({ 
      success: true,
      token: loginResponse.data.idToken,
      uid: user.uid,
      ...userData
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const API_KEY = "AIzaSyCD3-s0qrIQ4oIgI8T3r7_HnbMSO1Z6K1s";
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
      { email, password, returnSecureToken: true }
    );
    const { localId, idToken } = response.data;
    const userDoc = await db.collection("users").doc(localId).get();
    res.json({ 
      success: true,
      token: idToken, 
      uid: localId, 
      ...userDoc.data() 
    });
  } catch (err) {
    res.status(400).json({ error: err.response?.data?.error?.message || err.message });
  }
});

app.get("/api/auth/me", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const userDoc = await db.collection("users").doc(decoded.uid).get();
    res.json({ success: true, user: { uid: decoded.uid, ...userDoc.data() } });
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
});

app.get("/api/auth/profile", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const userDoc = await db.collection("users").doc(decoded.uid).get();
    if (!userDoc.exists) return res.status(404).json({ error: "User not found" });
    res.json({ success: true, ...userDoc.data() });
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
});

app.put("/api/auth/profile", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const { name, phone, bio, department, year, gpa, skills, linkedin, github, website } = req.body;
    
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (bio !== undefined) updateData.bio = bio;
    if (department !== undefined) updateData.department = department;
    if (year !== undefined) updateData.year = year;
    if (gpa !== undefined) updateData.gpa = gpa;
    if (skills !== undefined) updateData.skills = skills;
    if (linkedin !== undefined) updateData.linkedin = linkedin;
    if (github !== undefined) updateData.github = github;
    if (website !== undefined) updateData.website = website;
    updateData.updatedAt = new Date().toISOString();
    
    await db.collection("users").doc(decoded.uid).update(updateData);
    res.json({ success: true, message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/auth/change-password", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  const { oldPassword, newPassword } = req.body;
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const user = await admin.auth().getUser(decoded.uid);
    const API_KEY = "AIzaSyCD3-s0qrIQ4oIgI8T3r7_HnbMSO1Z6K1s";
    await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
      { email: user.email, password: oldPassword, returnSecureToken: true }
    );
    await admin.auth().updateUser(decoded.uid, { password: newPassword });
    res.json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/auth/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const API_KEY = "AIzaSyCD3-s0qrIQ4oIgI8T3r7_HnbMSO1Z6K1s";
    await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${API_KEY}`,
      { email, requestType: "PASSWORD_RESET" }
    );
    res.json({ success: true, message: "Reset email sent" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ========== PROFILE IMAGE ==========
app.post("/api/auth/upload-image", async (req, res) => {
  // Placeholder - will be implemented with storage
  res.json({ success: true, url: "https://via.placeholder.com/150" });
});

app.delete("/api/auth/profile-image", async (req, res) => {
  res.json({ success: true, message: "Image deleted" });
});

// ========== JOBS ROUTES ==========
app.get("/api/jobs", async (req, res) => {
  try {
    const snapshot = await db.collection("jobs").get();
    const jobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/jobs/:jobId", async (req, res) => {
  try {
    const { jobId } = req.params;
    const jobDoc = await db.collection("jobs").doc(jobId).get();
    if (!jobDoc.exists) return res.status(404).json({ error: "Job not found" });
    res.json({ success: true, data: { id: jobDoc.id, ...jobDoc.data() } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/jobs", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const jobData = { 
      ...req.body, 
      employerId: decoded.uid,
      status: "active",
      createdAt: new Date().toISOString(),
      applicantsCount: 0
    };
    const docRef = await db.collection("jobs").add(jobData);
    res.json({ success: true, id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/jobs/:jobId", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const { jobId } = req.params;
    await db.collection("jobs").doc(jobId).update({ ...req.body, updatedAt: new Date().toISOString() });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/jobs/:jobId", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const { jobId } = req.params;
    await db.collection("jobs").doc(jobId).delete();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== STUDENT ROUTES ==========
app.get("/api/student/stats", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const studentId = decoded.uid;
    
    const apps = await db.collection("applications").where("studentId", "==", studentId).get();
    const saved = await db.collection("savedJobs").where("studentId", "==", studentId).get();
    
    res.json({
      success: true,
      data: {
        totalApplications: apps.size,
        pendingReview: apps.docs.filter(d => d.data().status === "pending").length,
        interviewsScheduled: apps.docs.filter(d => d.data().status === "interview").length,
        savedJobs: saved.size,
        profileCompletion: 70
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/student/my-applications", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const studentId = decoded.uid;
    
    const snapshot = await db.collection("applications")
      .where("studentId", "==", studentId)
      .orderBy("appliedAt", "desc")
      .get();
    
    const applications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/student/apply", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const studentId = decoded.uid;
    const { jobId, coverLetter } = req.body;
    
    const existing = await db.collection("applications")
      .where("jobId", "==", jobId)
      .where("studentId", "==", studentId)
      .get();
    
    if (!existing.empty) {
      return res.status(400).json({ error: "Already applied" });
    }
    
    const jobDoc = await db.collection("jobs").doc(jobId).get();
    const jobData = jobDoc.data();
    
    await db.collection("applications").add({
      jobId,
      jobTitle: jobData?.title,
      studentId,
      employerId: jobData?.employerId,
      status: "pending",
      coverLetter: coverLetter || "",
      appliedAt: new Date().toISOString()
    });
    
    await db.collection("jobs").doc(jobId).update({
      applicantsCount: admin.firestore.FieldValue.increment(1)
    });
    
    res.json({ success: true, message: "Application submitted!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/student/saved-jobs", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const studentId = decoded.uid;
    
    const snapshot = await db.collection("savedJobs").where("studentId", "==", studentId).get();
    const jobs = await Promise.all(snapshot.docs.map(async (doc) => {
      const jobDoc = await db.collection("jobs").doc(doc.data().jobId).get();
      return { id: doc.data().jobId, ...jobDoc.data(), savedAt: doc.data().savedAt };
    }));
    
    res.json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/student/save-job", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const studentId = decoded.uid;
    const { jobId } = req.body;
    
    await db.collection("savedJobs").doc(`${studentId}_${jobId}`).set({
      studentId, jobId, savedAt: new Date().toISOString()
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/student/save-job/:jobId", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const studentId = decoded.uid;
    const { jobId } = req.params;
    
    await db.collection("savedJobs").doc(`${studentId}_${jobId}`).delete();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== LIKES ROUTES ==========
app.post("/api/student/like", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const { jobId } = req.body;
    
    await db.collection("likes").doc(`${decoded.uid}_${jobId}`).set({
      userId: decoded.uid, jobId, likedAt: new Date().toISOString()
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/student/like/:jobId", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const { jobId } = req.params;
    
    await db.collection("likes").doc(`${decoded.uid}_${jobId}`).delete();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/student/likes/:jobId", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const { jobId } = req.params;
    
    const snapshot = await db.collection("likes").where("jobId", "==", jobId).get();
    const userLike = await db.collection("likes")
      .where("userId", "==", decoded.uid)
      .where("jobId", "==", jobId)
      .get();
    
    res.json({ success: true, count: snapshot.size, userLiked: !userLike.empty });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== COMMENTS ROUTES ==========
app.post("/api/student/comment", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const { jobId, comment } = req.body;
    
    const userDoc = await db.collection("users").doc(decoded.uid).get();
    const userName = userDoc.data()?.name || "Anonymous";
    
    const commentData = {
      id: Date.now().toString(),
      jobId,
      userId: decoded.uid,
      userName,
      comment,
      createdAt: new Date().toISOString()
    };
    
    await db.collection("comments").add(commentData);
    res.json({ success: true, data: commentData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/student/comments/:jobId", async (req, res) => {
  try {
    const { jobId } = req.params;
    const snapshot = await db.collection("comments")
      .where("jobId", "==", jobId)
      .orderBy("createdAt", "desc")
      .get();
    
    const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data: comments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== EMPLOYER ROUTES ==========
app.get("/api/employer/my-jobs", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const snapshot = await db.collection("jobs").where("employerId", "==", decoded.uid).get();
    const jobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/employer/applications", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    
    const jobs = await db.collection("jobs").where("employerId", "==", decoded.uid).get();
    const jobIds = jobs.docs.map(doc => doc.id);
    
    if (jobIds.length === 0) return res.json({ success: true, data: [] });
    
    let allApps = [];
    for (const jobId of jobIds) {
      const apps = await db.collection("applications").where("jobId", "==", jobId).get();
      apps.docs.forEach(doc => allApps.push({ id: doc.id, ...doc.data() }));
    }
    
    res.json({ success: true, data: allApps });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/api/employer/accept/:applicationId", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const { applicationId } = req.params;
    await db.collection("applications").doc(applicationId).update({ status: "accepted" });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/api/employer/reject/:applicationId", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const { applicationId } = req.params;
    await db.collection("applications").doc(applicationId).update({ status: "rejected" });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/employer/shortlist/:applicationId", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const { applicationId } = req.params;
    await db.collection("applications").doc(applicationId).update({ status: "shortlisted" });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/employer/stats", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    
    const jobs = await db.collection("jobs").where("employerId", "==", decoded.uid).get();
    let totalApplicants = 0;
    
    for (const jobDoc of jobs.docs) {
      const apps = await db.collection("applications").where("jobId", "==", jobDoc.id).get();
      totalApplicants += apps.size;
    }
    
    res.json({
      success: true,
      data: {
        totalJobs: jobs.size,
        activeJobs: jobs.size,
        totalApplicants
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== AI RECOMMENDATIONS ==========
app.get("/api/jobs/recommended/student", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const userDoc = await db.collection("users").doc(decoded.uid).get();
    const student = userDoc.data();
    const studentSkills = student?.skills || [];
    const studentDepartment = student?.department || "";
    
    const jobsSnapshot = await db.collection("jobs").get();
    const jobs = jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    const recommendations = jobs.map(job => {
      let score = 0;
      if (job.department === studentDepartment) score += 40;
      
      const jobSkills = job.skills || [];
      const matchingSkills = jobSkills.filter(skill => 
        studentSkills.some(s => s.toLowerCase() === skill.toLowerCase())
      );
      score += (matchingSkills.length / Math.max(jobSkills.length, 1)) * 40;
      
      return { ...job, matchScore: Math.round(score) };
    });
    
    recommendations.sort((a, b) => b.matchScore - a.matchScore);
    res.json({ success: true, data: recommendations.slice(0, 10) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== DEMO JOBS ==========
app.get("/api/add-demo-jobs", async (req, res) => {
  try {
    const demoJobs = [
      {
        title: "Teaching Assistant - Physics 101",
        department: "Physics Department",
        hours: "15 hrs/week",
        salary: "2000 EGP/mo",
        type: "Part-Time",
        skills: ["Teaching", "Physics", "Communication"],
        status: "active",
        employerId: "demo",
        employerName: "Physics Department",
        createdAt: new Date().toISOString(),
        applicantsCount: 0
      },
      {
        title: "Teaching Assistant - Web Development",
        department: "Computer Science Department",
        hours: "15 hrs/week",
        salary: "2500 EGP/mo",
        type: "Part-Time",
        skills: ["JavaScript", "React", "HTML/CSS"],
        status: "active",
        employerId: "demo",
        employerName: "CS Department",
        createdAt: new Date().toISOString(),
        applicantsCount: 0
      },
      {
        title: "Research Assistant - Machine Learning",
        department: "Computer Science Department",
        hours: "20 hrs/week",
        salary: "3500 EGP/mo",
        type: "Research",
        skills: ["Python", "Machine Learning", "TensorFlow"],
        status: "active",
        employerId: "demo",
        employerName: "AI Lab",
        createdAt: new Date().toISOString(),
        applicantsCount: 0
      },
      {
        title: "Lab Assistant - Chemistry",
        department: "Chemistry Department",
        hours: "12 hrs/week",
        salary: "1800 EGP/mo",
        type: "Part-Time",
        skills: ["Lab Safety", "Chemistry", "Organization"],
        status: "active",
        employerId: "demo",
        employerName: "Chemistry Dept",
        createdAt: new Date().toISOString(),
        applicantsCount: 0
      }
    ];
    
    let added = 0;
    for (const job of demoJobs) {
      await db.collection("jobs").add(job);
      added++;
    }
    
    res.json({ success: true, message: `${added} demo jobs added successfully!` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== START SERVER ==========
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server on http://localhost:${PORT}`);
  console.log(`✅ Routes available:`);
  console.log(`   POST   /api/auth/register`);
  console.log(`   POST   /api/auth/login`);
  console.log(`   GET    /api/auth/me`);
  console.log(`   GET    /api/auth/profile`);
  console.log(`   PUT    /api/auth/profile`);
  console.log(`   GET    /api/jobs`);
  console.log(`   GET    /api/jobs/:jobId`);
  console.log(`   POST   /api/jobs`);
  console.log(`   GET    /api/student/stats`);
  console.log(`   GET    /api/student/my-applications`);
  console.log(`   POST   /api/student/apply`);
  console.log(`   GET    /api/student/saved-jobs`);
  console.log(`   POST   /api/student/save-job`);
  console.log(`   DELETE /api/student/save-job/:jobId`);
  console.log(`   POST   /api/student/like`);
  console.log(`   DELETE /api/student/like/:jobId`);
  console.log(`   GET    /api/student/likes/:jobId`);
  console.log(`   POST   /api/student/comment`);
  console.log(`   GET    /api/student/comments/:jobId`);
  console.log(`   GET    /api/employer/my-jobs`);
  console.log(`   GET    /api/employer/applications`);
  console.log(`   PATCH  /api/employer/accept/:applicationId`);
  console.log(`   PATCH  /api/employer/reject/:applicationId`);
});

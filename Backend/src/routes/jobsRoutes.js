const express = require('express');
const router = express.Router();
const { admin, db } = require('../config/firebase');
const verifyToken = require('../middleware/verifyToken');

// ==================== GET ALL JOBS ====================
router.get('/', async (req, res) => {
  try {
    const jobsSnapshot = await db.collection('jobs')
      .where('status', '==', 'active')
      .orderBy('createdAt', 'desc')
      .get();
    
    const jobs = [];
    jobsSnapshot.forEach(doc => {
      jobs.push({ id: doc.id, ...doc.data() });
    });
    
    res.json({ success: true, data: jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== GET JOB BY ID ====================
router.get('/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    const jobDoc = await db.collection('jobs').doc(jobId).get();
    
    if (!jobDoc.exists) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.json({ success: true, data: { id: jobDoc.id, ...jobDoc.data() } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== CREATE JOB ====================
router.post('/', verifyToken, async (req, res) => {
  try {
    const { role, uid, name, email } = req.user;
    
    if (role !== 'employer') {
      return res.status(403).json({ error: 'Only employers can post jobs' });
    }
    
    const jobData = {
      ...req.body,
      employerId: uid,
      employerName: name || email,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      applicantsCount: 0,
      views: 0,
      likes: 0,
      comments: []
    };
    
    const jobRef = await db.collection('jobs').add(jobData);
    
    res.status(201).json({ 
      success: true, 
      message: 'Job created successfully',
      data: { id: jobRef.id, ...jobData }
    });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== UPDATE JOB ====================
router.put('/:jobId', verifyToken, async (req, res) => {
  try {
    const { jobId } = req.params;
    const { uid, role } = req.user;
    
    const jobDoc = await db.collection('jobs').doc(jobId).get();
    
    if (!jobDoc.exists) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    const jobData = jobDoc.data();
    
    if (role !== 'admin' && jobData.employerId !== uid) {
      return res.status(403).json({ error: 'Unauthorized to edit this job' });
    }
    
    await db.collection('jobs').doc(jobId).update({
      ...req.body,
      updatedAt: new Date().toISOString()
    });
    
    res.json({ success: true, message: 'Job updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== DELETE JOB ====================
router.delete('/:jobId', verifyToken, async (req, res) => {
  try {
    const { jobId } = req.params;
    const { uid, role } = req.user;
    
    const jobDoc = await db.collection('jobs').doc(jobId).get();
    
    if (!jobDoc.exists) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    const jobData = jobDoc.data();
    
    if (role !== 'admin' && jobData.employerId !== uid) {
      return res.status(403).json({ error: 'Unauthorized to delete this job' });
    }
    
    await db.collection('jobs').doc(jobId).delete();
    
    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== GET EMPLOYER'S JOBS ====================
router.get('/employer/my-jobs', verifyToken, async (req, res) => {
  try {
    const { uid, role } = req.user;
    
    if (role !== 'employer') {
      return res.status(403).json({ error: 'Only employers can access' });
    }
    
    const jobsSnapshot = await db.collection('jobs')
      .where('employerId', '==', uid)
      .orderBy('createdAt', 'desc')
      .get();
    
    const jobs = [];
    jobsSnapshot.forEach(doc => {
      jobs.push({ id: doc.id, ...doc.data() });
    });
    
    res.json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== AI RECOMMENDED JOBS ====================
router.get('/recommended/student', verifyToken, async (req, res) => {
  try {
    const { uid } = req.user;
    
    const userDoc = await db.collection('users').doc(uid).get();
    const studentData = userDoc.data();
    const studentSkills = studentData.skills || [];
    const studentDepartment = studentData.department || '';
    const studentGPA = parseFloat(studentData.gpa) || 0;
    
    const jobsSnapshot = await db.collection('jobs')
      .where('status', '==', 'active')
      .get();
    
    const jobs = [];
    jobsSnapshot.forEach(doc => {
      jobs.push({ id: doc.id, ...doc.data() });
    });
    
    const recommendedJobs = jobs.map(job => {
      let score = 0;
      
      if (job.department === studentDepartment) score += 40;
      else if (job.department?.includes(studentDepartment)) score += 20;
      
      const jobSkills = job.skills || [];
      const matchingSkills = jobSkills.filter(skill => 
        studentSkills.some(s => s.toLowerCase() === skill.toLowerCase())
      );
      const skillScore = (matchingSkills.length / Math.max(jobSkills.length, 1)) * 40;
      score += skillScore;
      
      const minGPA = parseFloat(job.minGPA) || 0;
      if (minGPA === 0) score += 20;
      else if (studentGPA >= minGPA) score += 20;
      else if (studentGPA >= minGPA - 0.5) score += 10;
      
      return {
        ...job,
        matchScore: Math.round(score),
        matchingSkills: matchingSkills
      };
    });
    
    recommendedJobs.sort((a, b) => b.matchScore - a.matchScore);
    
    res.json({ success: true, data: recommendedJobs.slice(0, 10) });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== AI MATCHING FOR EMPLOYER ====================
router.get('/matching/:jobId', verifyToken, async (req, res) => {
  try {
    const { jobId } = req.params;
    const { role } = req.user;
    
    if (role !== 'employer') {
      return res.status(403).json({ error: 'Only employers can access' });
    }
    
    const jobDoc = await db.collection('jobs').doc(jobId).get();
    if (!jobDoc.exists) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    const job = jobDoc.data();
    const jobSkills = job.skills || [];
    const minGPA = parseFloat(job.minGPA) || 0;
    
    const studentsSnapshot = await db.collection('users')
      .where('role', '==', 'student')
      .get();
    
    const matches = [];
    for (const doc of studentsSnapshot.docs) {
      const student = doc.data();
      let score = 0;
      
      if (student.department === job.department) score += 40;
      
      const matchingSkills = jobSkills.filter(skill => 
        student.skills?.some(s => s.toLowerCase() === skill.toLowerCase())
      );
      score += (matchingSkills.length / Math.max(jobSkills.length, 1)) * 40;
      
      const studentGPA = parseFloat(student.gpa) || 0;
      if (studentGPA >= minGPA) score += 20;
      else if (studentGPA >= minGPA - 0.5) score += 10;
      
      matches.push({
        id: doc.id,
        name: student.name,
        email: student.email,
        department: student.department,
        skills: student.skills || [],
        gpa: studentGPA,
        matchScore: Math.round(score)
      });
    }
    
    matches.sort((a, b) => b.matchScore - a.matchScore);
    res.json({ success: true, data: matches.slice(0, 20) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

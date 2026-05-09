const express = require('express');
const router = express.Router();
const { admin, db } = require('../config/firebase');
const verifyToken = require('../middleware/verifyToken');

// ==================== APPLY FOR JOB ====================
router.post('/apply', verifyToken, async (req, res) => {
  try {
    const { uid, email, name } = req.user;
    const { jobId, coverLetter } = req.body;
    
    const existingApps = await db.collection('applications')
      .where('jobId', '==', jobId)
      .where('studentId', '==', uid)
      .get();
    
    if (!existingApps.empty) {
      return res.status(400).json({ error: 'Already applied to this job' });
    }
    
    const jobDoc = await db.collection('jobs').doc(jobId).get();
    if (!jobDoc.exists) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    const jobData = jobDoc.data();
    
    const applicationData = {
      jobId,
      jobTitle: jobData.title,
      department: jobData.department,
      employerId: jobData.employerId,
      studentId: uid,
      studentName: name || email,
      studentEmail: email,
      coverLetter: coverLetter || '',
      status: 'pending',
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const appRef = await db.collection('applications').add(applicationData);
    
    await db.collection('jobs').doc(jobId).update({
      applicantsCount: admin.firestore.FieldValue.increment(1)
    });
    
    res.status(201).json({ 
      success: true, 
      message: 'Application submitted successfully',
      data: { id: appRef.id, ...applicationData }
    });
  } catch (error) {
    console.error('Error applying:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== GET MY APPLICATIONS ====================
router.get('/my-applications', verifyToken, async (req, res) => {
  try {
    const { uid } = req.user;
    
    const appsSnapshot = await db.collection('applications')
      .where('studentId', '==', uid)
      .orderBy('appliedAt', 'desc')
      .get();
    
    const applications = [];
    for (const doc of appsSnapshot.docs) {
      const appData = doc.data();
      const jobDoc = await db.collection('jobs').doc(appData.jobId).get();
      const jobData = jobDoc.exists ? jobDoc.data() : {};
      
      applications.push({
        id: doc.id,
        ...appData,
        jobDetails: jobData
      });
    }
    
    res.json({ success: true, data: applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== SAVE JOB ====================
router.post('/save-job', verifyToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const { jobId } = req.body;
    
    const savedRef = db.collection('savedJobs').doc(`${uid}_${jobId}`);
    await savedRef.set({
      studentId: uid,
      jobId,
      savedAt: new Date().toISOString()
    });
    
    res.json({ success: true, message: 'Job saved' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== GET SAVED JOBS ====================
router.get('/saved-jobs', verifyToken, async (req, res) => {
  try {
    const { uid } = req.user;
    
    const savedSnapshot = await db.collection('savedJobs')
      .where('studentId', '==', uid)
      .get();
    
    const savedJobs = [];
    for (const doc of savedSnapshot.docs) {
      const { jobId } = doc.data();
      const jobDoc = await db.collection('jobs').doc(jobId).get();
      
      if (jobDoc.exists) {
        savedJobs.push({ id: jobId, ...jobDoc.data() });
      }
    }
    
    res.json({ success: true, data: savedJobs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== UNSAVE JOB ====================
router.delete('/save-job/:jobId', verifyToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const { jobId } = req.params;
    
    await db.collection('savedJobs').doc(`${uid}_${jobId}`).delete();
    
    res.json({ success: true, message: 'Job removed from saved' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== LIKE JOB ====================
router.post('/like', verifyToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const { jobId } = req.body;
    
    await db.collection('likes').doc(`${uid}_${jobId}`).set({
      studentId: uid,
      jobId,
      likedAt: new Date().toISOString()
    });
    
    await db.collection('jobs').doc(jobId).update({
      likes: admin.firestore.FieldValue.increment(1)
    });
    
    res.json({ success: true, message: 'Liked' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== UNLIKE JOB ====================
router.delete('/like/:jobId', verifyToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const { jobId } = req.params;
    
    await db.collection('likes').doc(`${uid}_${jobId}`).delete();
    
    await db.collection('jobs').doc(jobId).update({
      likes: admin.firestore.FieldValue.increment(-1)
    });
    
    res.json({ success: true, message: 'Unliked' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== GET LIKES COUNT ====================
router.get('/likes/:jobId', verifyToken, async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.uid;
    
    const likesSnapshot = await db.collection('likes').where('jobId', '==', jobId).get();
    const userLike = await db.collection('likes')
      .where('studentId', '==', userId)
      .where('jobId', '==', jobId)
      .get();
    
    res.json({ 
      success: true, 
      count: likesSnapshot.size, 
      userLiked: !userLike.empty 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ADD COMMENT ====================
router.post('/comment', verifyToken, async (req, res) => {
  try {
    const { uid, name, email } = req.user;
    const { jobId, comment } = req.body;
    
    const commentData = {
      id: Date.now().toString(),
      studentId: uid,
      studentName: name || email,
      comment,
      createdAt: new Date().toISOString()
    };
    
    const jobRef = db.collection('jobs').doc(jobId);
    const jobDoc = await jobRef.get();
    
    const existingComments = jobDoc.data()?.comments || [];
    await jobRef.update({
      comments: [...existingComments, commentData]
    });
    
    res.json({ success: true, data: commentData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== GET COMMENTS ====================
router.get('/comments/:jobId', verifyToken, async (req, res) => {
  try {
    const { jobId } = req.params;
    const jobDoc = await db.collection('jobs').doc(jobId).get();
    
    const comments = jobDoc.exists ? (jobDoc.data().comments || []) : [];
    res.json({ success: true, data: comments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== STUDENT STATS ====================
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const { uid } = req.user;
    
    const appsSnapshot = await db.collection('applications')
      .where('studentId', '==', uid)
      .get();
    
    const savedSnapshot = await db.collection('savedJobs')
      .where('studentId', '==', uid)
      .get();
    
    const applications = appsSnapshot.docs.map(doc => doc.data());
    const savedJobs = savedSnapshot.docs.length;
    
    const stats = {
      totalApplications: applications.length,
      pendingReview: applications.filter(a => a.status === 'pending').length,
      interviewsScheduled: applications.filter(a => a.status === 'interview').length,
      savedJobs: savedJobs,
      profileCompletion: 70
    };
    
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

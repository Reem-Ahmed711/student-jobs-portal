const db = require('../config/firebase');

const JOBS_COLLECTION = 'jobs';

exports.createJob = async (jobData) => {
    try {
        const newJob = {
            ...jobData,
            createdAt: new Date().toISOString()
        };
        
        const docRef = await db.collection(JOBS_COLLECTION).add(newJob);
        return { id: docRef.id, ...newJob };
    } catch (error) {
        throw new Error('Failed to create job: ' + error.message);
    }
};

exports.findAllJobs = async () => {
    try {
        const snapshot = await db.collection(JOBS_COLLECTION).get();
        const jobs = [];
        
        snapshot.forEach(doc => {
            jobs.push({ id: doc.id, ...doc.data() });
        });
        
        return jobs;
    } catch (error) {
        throw new Error('Failed to fetch jobs: ' + error.message);
    }
};

exports.findJobById = async (jobId) => {
    try {
        const doc = await db.collection(JOBS_COLLECTION).doc(jobId).get();
        
        if (!doc.exists) {
            return null;
        }
        
        return { id: doc.id, ...doc.data() };
    } catch (error) {
        throw new Error('Failed to fetch job: ' + error.message);
    }
};
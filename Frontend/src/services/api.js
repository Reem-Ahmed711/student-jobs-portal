// src/services/api.js
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const USE_MOCK = true;
const API_BASE_URL = 'http://localhost:5000/api';

const MOCK_JOBS = [
  { id: 1, title: 'Teaching Assistant - Web Development', department: 'Computer Science Department', departmentCode: 'CS', hours: '15 hrs/week', deadline: '2026-05-15', salary: '3500 EGP/mo', match: 94, skills: ['JavaScript', 'React', 'HTML/CSS', 'Node.js'], description: 'Help students with web development labs.', type: 'Teaching Assistant', location: 'CS Building, Lab 204', urgent: false, salaryRange: { min: 3000, max: 4000 }, postedBy: 'Dr. Ahmed', status: 'active', applicants: 18 },
  { id: 2, title: 'Research Assistant - Machine Learning', department: 'Computer Science Department', departmentCode: 'CS', hours: '20 hrs/week', deadline: '2026-05-30', salary: '5000 EGP/mo', match: 96, skills: ['Python', 'Machine Learning', 'TensorFlow', 'Data Analysis'], description: 'Work on cutting-edge ML projects.', type: 'Research Assistant', location: 'AI Research Lab', urgent: true, salaryRange: { min: 4500, max: 5500 }, postedBy: 'Prof. Mohamed', status: 'pending', applicants: 12 },
  { id: 3, title: 'Lab Assistant - Programming Labs', department: 'Computer Science Department', departmentCode: 'CS', hours: '12 hrs/week', deadline: '2026-05-10', salary: '2800 EGP/mo', match: 88, skills: ['Python', 'Java', 'Problem Solving'], description: 'Assist students during lab sessions.', type: 'Lab Assistant', location: 'CS Building, Labs 101-105', urgent: false, salaryRange: { min: 2500, max: 3000 }, postedBy: 'Dr. Rasha', status: 'active', applicants: 15 },
  { id: 4, title: 'Teaching Assistant - Physics 101', department: 'Physics Department', departmentCode: 'Physics', hours: '15 hrs/week', deadline: '2026-05-12', salary: '3000 EGP/mo', match: 92, skills: ['Teaching', 'Lab Work', 'Communication'], description: 'Help with Physics 101 labs.', type: 'Teaching Assistant', location: 'Physics Building, Room 203', urgent: false, salaryRange: { min: 2500, max: 3500 }, postedBy: 'Dr. Sarah', status: 'active', applicants: 24 },
  { id: 5, title: 'Research Assistant - Quantum Mechanics', department: 'Physics Department', departmentCode: 'Physics', hours: '20 hrs/week', deadline: '2026-05-25', salary: '4000 EGP/mo', match: 88, skills: ['Research', 'Data Analysis', 'Python'], description: 'Assist in quantum research.', type: 'Research Assistant', location: 'Research Center, Lab 305', urgent: false, salaryRange: { min: 3500, max: 4500 }, postedBy: 'Prof. Mohamed Ali', status: 'pending', applicants: 12 },
  { id: 6, title: 'Lab Assistant - Organic Chemistry', department: 'Chemistry Department', departmentCode: 'Chemistry', hours: '15 hrs/week', deadline: '2026-05-18', salary: '3200 EGP/mo', match: 89, skills: ['Lab Work', 'Safety', 'Organic Chemistry'], description: 'Assist in organic chemistry labs.', type: 'Lab Assistant', location: 'Chemistry Building, Lab 302', urgent: false, salaryRange: { min: 2800, max: 3500 }, postedBy: 'Dr. Mona', status: 'active', applicants: 14 }
];

let MOCK_USERS = [
  { id: 1, name: 'Ahmed Mohamed', email: 'ahmed@cu.edu.eg', role: 'student', status: 'active', department: 'CS', year: '3rd Year', gpa: 3.7 },
  { id: 2, name: 'Dr. Sara Ali', email: 'sara@cu.edu.eg', role: 'employer', status: 'pending', department: 'Physics', institution: 'Physics Department' },
  { id: 3, name: 'Mariam Hassan', email: 'mariam@cu.edu.eg', role: 'student', status: 'active', department: 'Chemistry', year: '4th Year', gpa: 3.9 },
  { id: 4, name: 'Prof. Mahmoud', email: 'mahmoud@cu.edu.eg', role: 'employer', status: 'active', department: 'Math', institution: 'Mathematics Department' },
  { id: 5, name: 'Admin User', email: 'admin@cu.edu.eg', role: 'admin', status: 'active', department: 'Administration' },
  { id: 6, name: 'Reem Ahmed', email: 'reem@cu.edu.eg', role: 'employer', status: 'active', department: 'Computer Science', institution: 'CS Department' }
];

let MOCK_APPLICATIONS = JSON.parse(localStorage.getItem('applications') || '[]');
let MOCK_SAVED_JOBS = JSON.parse(localStorage.getItem('savedJobs') || '[]');

export const login = async (formData) => {
  console.log('🔵 MOCK: login with', formData.email);
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  let userRole = 'student';
  if (formData.email.includes('admin')) {
    userRole = 'admin';
  } else if (formData.email.includes('@cu.edu.eg')) {
    userRole = 'employer';
  }
  
  return { 
    data: { 
      uid: '123456', 
      name: formData.email.split('@')[0], 
      email: formData.email, 
      role: userRole, 
      token: 'mock-token-12345'
    } 
  };
};


export const register = async (formData) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  return { data: { uid: Date.now().toString(), name: formData.name || formData.email.split('@')[0], email: formData.email, role: formData.role || 'student', token: 'mock-token-' + Date.now() } };
};

export const googleLogin = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { data: { uid: 'google-123', name: 'Google User', email: 'user@gmail.com', role: 'student', token: 'mock-google-token' } };
};

export const linkedinLogin = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { data: { uid: 'linkedin-123', name: 'LinkedIn User', email: 'user@linkedin.com', role: 'student', token: 'mock-linkedin-token' } };
};

export const forgotPassword = async (email) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { data: { success: true, message: 'Password reset link sent to your email' } };
};

export const getProfile = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { 
    data: { 
      uid: '123456', 
      name: 'Test Student', 
      email: 'student@test.com', 
      role: 'student', 
      department: 'Computer Science', 
      year: '3rd Year', 
      gpa: 3.7, 
      skills: ['JavaScript', 'React', 'Python'] 
    } 
  };
};
export const updateProfile = async (profileData) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { data: { success: true, message: 'Profile updated successfully', data: profileData } };
};

export const getAllJobs = async (filters = {}) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  let filteredJobs = [...MOCK_JOBS];
  if (filters.department?.length) {
    filteredJobs = filteredJobs.filter(job => filters.department.some(dept => job.department.includes(dept)));
  }
  return { data: filteredJobs };
};

export const getJobById = async (jobId) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return { data: MOCK_JOBS.find(j => j.id === parseInt(jobId)) };
};

export const createJob = async (jobData) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const newJob = { id: MOCK_JOBS.length + 1, ...jobData, postedDate: new Date().toISOString().split('T')[0], applicants: 0, match: Math.floor(Math.random() * 20) + 80 };
  MOCK_JOBS.push(newJob);
  return { data: newJob };
};

export const updateJob = async (jobId, jobData) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const index = MOCK_JOBS.findIndex(j => j.id === parseInt(jobId));
  if (index !== -1) {
    MOCK_JOBS[index] = { ...MOCK_JOBS[index], ...jobData };
    return { data: MOCK_JOBS[index] };
  }
  throw new Error('Job not found');
};

export const deleteJob = async (jobId) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const index = MOCK_JOBS.findIndex(j => j.id === parseInt(jobId));
  if (index !== -1) {
    MOCK_JOBS.splice(index, 1);
    return { data: { success: true } };
  }
  throw new Error('Job not found');
};

export const applyForJob = async (applicationData) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  const job = MOCK_JOBS.find(j => j.id === parseInt(applicationData.jobId));
  const newApplication = { id: Date.now(), jobId: applicationData.jobId, jobTitle: job?.title, company: job?.department, departmentCode: job?.departmentCode, location: job?.location, appliedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), status: 'Pending', match: job?.match, type: job?.type, salary: job?.salary };
  MOCK_APPLICATIONS.push(newApplication);
  localStorage.setItem('applications', JSON.stringify(MOCK_APPLICATIONS));
  return { data: { success: true, message: 'Application submitted successfully', application: newApplication } };
};

export const getUserApplications = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  MOCK_APPLICATIONS = JSON.parse(localStorage.getItem('applications') || '[]');
  if (MOCK_APPLICATIONS.length === 0) {
    const mockApps = [{ id: 101, jobId: 1, jobTitle: 'Teaching Assistant - Web Development', company: 'CS Department', departmentCode: 'CS', location: 'CS Building', appliedDate: 'Apr 5, 2026', status: 'Under Review', match: 94, type: 'Part-Time', salary: '3500 EGP/mo' }];
    localStorage.setItem('applications', JSON.stringify(mockApps));
    return { data: mockApps };
  }
  return { data: MOCK_APPLICATIONS };
};

export const getApplicationById = async (appId) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { data: MOCK_APPLICATIONS.find(a => a.id === parseInt(appId)) };
};

export const withdrawApplication = async (appId) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  MOCK_APPLICATIONS = MOCK_APPLICATIONS.filter(a => a.id !== parseInt(appId));
  localStorage.setItem('applications', JSON.stringify(MOCK_APPLICATIONS));
  return { data: { success: true, message: 'Application withdrawn successfully' } };
};

export const updateApplicationStatus = async (appId, status) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const app = MOCK_APPLICATIONS.find(a => a.id === parseInt(appId));
  if (app) { app.status = status; localStorage.setItem('applications', JSON.stringify(MOCK_APPLICATIONS)); }
  return { data: { success: true, message: 'Application status updated' } };
};

export const getSavedJobs = async () => {
  await new Promise(resolve => setTimeout(resolve, 400));
  MOCK_SAVED_JOBS = JSON.parse(localStorage.getItem('savedJobs') || '[]');
  if (MOCK_SAVED_JOBS.length === 0) { MOCK_SAVED_JOBS = [1, 2]; localStorage.setItem('savedJobs', JSON.stringify(MOCK_SAVED_JOBS)); }
  const savedJobsDetails = MOCK_JOBS.filter(job => MOCK_SAVED_JOBS.includes(job.id));
  return { data: savedJobsDetails };
};

export const saveJob = async (jobId) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const id = parseInt(jobId);
  MOCK_SAVED_JOBS = JSON.parse(localStorage.getItem('savedJobs') || '[]');
  if (!MOCK_SAVED_JOBS.includes(id)) { MOCK_SAVED_JOBS.push(id); localStorage.setItem('savedJobs', JSON.stringify(MOCK_SAVED_JOBS)); }
  return { data: { success: true, message: 'Job saved successfully' } };
};

export const unsaveJob = async (jobId) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  MOCK_SAVED_JOBS = JSON.parse(localStorage.getItem('savedJobs') || '[]');
  MOCK_SAVED_JOBS = MOCK_SAVED_JOBS.filter(id => id !== parseInt(jobId));
  localStorage.setItem('savedJobs', JSON.stringify(MOCK_SAVED_JOBS));
  return { data: { success: true, message: 'Job removed from saved' } };
};

export const getRecommendedJobs = async () => {
  await new Promise(resolve => setTimeout(resolve, 400));
  const recommended = [...MOCK_JOBS].sort((a, b) => b.match - a.match).slice(0, 5);
  return { data: recommended };
};

export const getStudentStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const applications = JSON.parse(localStorage.getItem('applications') || '[]');
  const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
  return { data: { totalApplications: applications.length, pendingReview: applications.filter(a => a.status === 'Pending' || a.status === 'Under Review').length, interviewsScheduled: applications.filter(a => a.status === 'Interview').length, savedJobs: savedJobs.length, profileCompletion: 80 } };
};

export const getEmployerStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return { data: { activeJobs: MOCK_JOBS.filter(j => new Date(j.deadline) > new Date()).length, totalApplicants: MOCK_APPLICATIONS.length, positionsToFill: 4, avgMatchScore: 76 } };
};

export const getAdminStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return { data: { totalUsers: MOCK_USERS.length, activeJobs: MOCK_JOBS.filter(j => new Date(j.deadline) > new Date()).length, totalApplications: MOCK_APPLICATIONS.length, placementRate: 67 } };
};
export const rejectApplication = async (applicantId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/api/employer/applicants/${applicantId}/reject`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error in rejectApplication:', error);
    throw error;
  }
};
export const getAllUsers = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { data: MOCK_USERS };
};
export const getEmployerDashboard = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/api/employer/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data; // هترجع البيانات مباشرة
  } catch (error) {
    console.error('Error in getEmployerDashboard:', error);
    throw error;
  }
}; 

export const updateUserRole = async (userId, role) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const user = MOCK_USERS.find(u => u.id === parseInt(userId));
  if (user) { user.role = role; return { data: { success: true, user } }; }
  throw new Error('User not found');
};

export const deleteUser = async (userId) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  MOCK_USERS = MOCK_USERS.filter(u => u.id !== parseInt(userId));
  return { data: { success: true } };
};

export const getEmployerJobs = async () => {
  await new Promise(resolve => setTimeout(resolve, 400));
  const employerJobs = MOCK_JOBS.filter(job => job.postedBy?.includes('Dr.') || job.postedBy?.includes('Prof.'));
  return { data: employerJobs.slice(0, 6) };
};

export const getJobApplicants = async (jobId) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  const applications = JSON.parse(localStorage.getItem('applications') || '[]');
  const jobApplicants = applications.filter(app => app.jobId === parseInt(jobId));
  const applicantsWithDetails = jobApplicants.map((app, index) => ({ ...app, applicantName: `Applicant ${index + 1}`, applicantEmail: `applicant${index + 1}@cu.edu.eg`, gpa: 3.5 + Math.random() * 0.5, year: ['3rd Year', '4th Year'][Math.floor(Math.random() * 2)] }));
  return { data: applicantsWithDetails };
};

export const shortlistApplicant = async (applicationId) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { data: { success: true, message: 'Shortlisted' } };
};
export const acceptApplication = async (applicantId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/api/employer/applicants/${applicantId}/accept`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error in acceptApplication:', error);
    throw error;
  }
};
export const getEmployerApplications = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_BASE_URL}/applications`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response;
};
export default {
  login, register, googleLogin, linkedinLogin, forgotPassword, getProfile, updateProfile,
  getAllJobs, getJobById, createJob, updateJob, deleteJob,
  applyForJob, getUserApplications, getApplicationById, withdrawApplication, updateApplicationStatus,
  getSavedJobs, saveJob, unsaveJob, getRecommendedJobs,
  getStudentStats, getEmployerStats, getAdminStats,
  getAllUsers, updateUserRole, deleteUser,
  getEmployerJobs, getJobApplicants, shortlistApplicant
};
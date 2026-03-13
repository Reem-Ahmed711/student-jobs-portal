// client/my-app/src/services/api.js
import axios from 'axios';

// Use mock data only
const USE_MOCK = true;

// Mock data for jobs - كل وظائف CS موجودة
const MOCK_JOBS = [
  // Computer Science Jobs
  {
    id: 7,
    title: 'Teaching Assistant - Web Development',
    department: 'Computer Science Department',
    departmentCode: 'CS',
    hours: '15 hrs/week',
    deadline: '5 days left',
    salary: '2500 EGP/mo',
    match: 94,
    skills: ['JavaScript', 'React', 'HTML/CSS', 'Node.js'],
    description: 'Help students with web development labs. Assist in teaching HTML, CSS, JavaScript, and React. Grade assignments and provide feedback.',
    type: 'Teaching Assistant',
    location: 'CS Building, Lab 204',
    urgent: false
  },
  {
    id: 8,
    title: 'Research Assistant - Machine Learning',
    department: 'Computer Science Department',
    departmentCode: 'CS',
    hours: '20 hrs/week',
    deadline: '10 days left',
    salary: '3500 EGP/mo',
    match: 96,
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'Data Analysis'],
    description: 'Join the AI research lab to work on cutting-edge machine learning projects. Help with data preprocessing, model training, and research paper writing.',
    type: 'Research Assistant',
    location: 'AI Research Lab, Building 3',
    urgent: false
  },
  {
    id: 9,
    title: 'Lab Assistant - CS Labs',
    department: 'Computer Science Department',
    departmentCode: 'CS',
    hours: '12 hrs/week',
    deadline: '7 days left',
    salary: '2000 EGP/mo',
    match: 88,
    skills: ['Python', 'Java', 'Problem Solving', 'Teaching'],
    description: 'Assist students during lab sessions for programming courses. Help with debugging, explain concepts, and maintain lab equipment.',
    type: 'Lab Assistant',
    location: 'CS Building, Labs 101-105',
    urgent: true
  },
  // Physics Jobs
  {
    id: 1,
    title: 'Teaching Assistant - Physics 101',
    department: 'Physics Department',
    departmentCode: 'Physics',
    hours: '15 hrs/week',
    deadline: '3 days left',
    salary: '2000 EGP/mo',
    match: 92,
    skills: ['Teaching', 'Lab Work', 'Communication'],
    description: 'Help professor with Physics 101 labs and tutorials. Assist students during lab sessions and grade assignments.',
    type: 'Teaching Assistant',
    location: 'Physics Building, Room 203'
  },
  {
    id: 2,
    title: 'Research Assistant - Quantum',
    department: 'Physics Department',
    departmentCode: 'Physics',
    hours: '20 hrs/week',
    deadline: '5 days left',
    salary: '2500 EGP/mo',
    match: 88,
    skills: ['Research', 'Data Analysis', 'Python'],
    description: 'Assist in quantum mechanics research projects. Help with data collection and analysis.',
    type: 'Research Assistant',
    location: 'Research Center, Lab 305'
  },
  {
    id: 3,
    title: 'Lab Assistant - General Physics',
    department: 'Physics Department',
    departmentCode: 'Physics',
    hours: '12 hrs/week',
    deadline: '7 days left',
    salary: '1800 EGP/mo',
    match: 85,
    skills: ['Lab Work', 'Safety', 'Organization'],
    description: 'Prepare and maintain physics laboratory equipment. Assist students during lab sessions.',
    type: 'Lab Assistant',
    location: 'Physics Building, Lab 101',
    urgent: true
  }
];

// Mock applications storage (use localStorage for persistence)
let MOCK_APPLICATIONS = JSON.parse(localStorage.getItem('applications') || '[]');

// Mock saved jobs storage
let MOCK_SAVED_JOBS = JSON.parse(localStorage.getItem('savedJobs') || '[]');

// ========== AUTH APIS ==========
export const login = async (formData) => {
  console.log('🔵 MOCK: login with', formData);
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    data: {
      uid: '123456',
      name: formData.email.split('@')[0],
      email: formData.email,
      role: 'student',
      token: 'mock-token-12345',
      department: 'Computer Science',
      year: '3rd Year',
      gpa: 3.7
    }
  };
};

export const register = async (formData) => {
  console.log('🔵 MOCK: register with', formData);
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    data: {
      uid: '123456',
      name: formData.name || formData.email.split('@')[0],
      email: formData.email,
      role: formData.role || 'student',
      token: 'mock-token-12345'
    }
  };
};

export const googleLogin = async () => {
  console.log('🔵 MOCK: google login');
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    data: {
      uid: 'google-123456',
      name: 'Google User',
      email: 'user@gmail.com',
      role: 'student',
      token: 'mock-google-token'
    }
  };
};

export const linkedinLogin = async () => {
  console.log('🔵 MOCK: linkedin login');
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    data: {
      uid: 'linkedin-123456',
      name: 'LinkedIn User',
      email: 'user@linkedin.com',
      role: 'student',
      token: 'mock-linkedin-token'
    }
  };
};

export const forgotPassword = async (email) => {
  console.log('🔵 MOCK: forgot password for', email);
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    data: {
      success: true,
      message: 'Password reset link sent to your email'
    }
  };
};

export const getProfile = async () => {
  console.log('🔵 MOCK: get profile');
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    data: {
      uid: '123456',
      name: 'Test Student',
      email: 'student@test.com',
      role: 'student',
      department: 'Computer Science',
      year: '3rd Year',
      gpa: 3.7
    }
  };
};

export const updateProfile = async (profileData) => {
  console.log('🔵 MOCK: update profile', profileData);
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    data: {
      success: true,
      message: 'Profile updated successfully',
      data: profileData
    }
  };
};

// ========== JOBS APIS ==========
export const getAllJobs = async () => {
  console.log('🔵 MOCK: get all jobs');
  await new Promise(resolve => setTimeout(resolve, 800));
  return { data: MOCK_JOBS };
};

export const getJobById = async (jobId) => {
  console.log('🔵 MOCK: get job by id', jobId);
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const job = MOCK_JOBS.find(j => j.id === parseInt(jobId));
  return { data: job };
};

export const createJob = async (jobData) => {
  console.log('🔵 MOCK: create job', jobData);
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    data: {
      id: Date.now(),
      ...jobData
    }
  };
};

// ========== APPLICATIONS APIS ==========
export const applyForJob = async (applicationData) => {
  console.log('🔵 MOCK: apply for job', applicationData);
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Get job details
  const job = MOCK_JOBS.find(j => j.id === parseInt(applicationData.jobId));
  
  // Create application
  const newApplication = {
    id: Date.now(),
    jobId: applicationData.jobId,
    jobTitle: job?.title || 'Unknown Job',
    company: job?.department || 'Unknown Department',
    departmentCode: job?.departmentCode || 'Unknown',
    location: job?.location || 'Cairo University',
    appliedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    status: 'Pending',
    match: job?.match || 85,
    type: job?.type || 'Part-Time',
    salary: job?.salary || '2000 EGP/mo'
  };
  
  MOCK_APPLICATIONS.push(newApplication);
  
  // Save to localStorage
  localStorage.setItem('applications', JSON.stringify(MOCK_APPLICATIONS));
  
  console.log('✅ Application saved:', newApplication);
  
  return {
    data: {
      success: true,
      message: 'Application submitted successfully',
      application: newApplication
    }
  };
};

export const getUserApplications = async () => {
  console.log('🔵 MOCK: get user applications');
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Read from localStorage
  MOCK_APPLICATIONS = JSON.parse(localStorage.getItem('applications') || '[]');
  
  // If no applications, create some mock ones
  if (MOCK_APPLICATIONS.length === 0) {
    MOCK_APPLICATIONS = [
      {
        id: 1,
        jobId: 1,
        jobTitle: 'Teaching Assistant - Physics 101',
        company: 'Physics Department',
        departmentCode: 'Physics',
        location: 'Physics Building',
        appliedDate: 'Feb 20, 2026',
        status: 'Pending',
        match: 92,
        type: 'Part-Time',
        salary: '2000 EGP/mo'
      },
      {
        id: 2,
        jobId: 7,
        jobTitle: 'Teaching Assistant - Web Development',
        company: 'Computer Science Department',
        departmentCode: 'CS',
        location: 'CS Building',
        appliedDate: 'Feb 24, 2026',
        status: 'Interview',
        match: 94,
        type: 'Part-Time',
        salary: '2500 EGP/mo',
        interviewDate: 'Mar 10, 2026 - 11:00 AM'
      }
    ];
    localStorage.setItem('applications', JSON.stringify(MOCK_APPLICATIONS));
  }
  
  return { data: MOCK_APPLICATIONS };
};

export const getApplicationById = async (appId) => {
  console.log('🔵 MOCK: get application by id', appId);
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const app = MOCK_APPLICATIONS.find(a => a.id === parseInt(appId));
  return { data: app };
};

export const withdrawApplication = async (appId) => {
  console.log('🔵 MOCK: withdraw application', appId);
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  MOCK_APPLICATIONS = MOCK_APPLICATIONS.filter(a => a.id !== parseInt(appId));
  localStorage.setItem('applications', JSON.stringify(MOCK_APPLICATIONS));
  
  return {
    data: {
      success: true,
      message: 'Application withdrawn successfully'
    }
  };
};

export const updateApplicationStatus = async (appId, status) => {
  console.log('🔵 MOCK: update application status', appId, status);
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const app = MOCK_APPLICATIONS.find(a => a.id === parseInt(appId));
  if (app) {
    app.status = status;
    localStorage.setItem('applications', JSON.stringify(MOCK_APPLICATIONS));
  }
  
  return {
    data: {
      success: true,
      message: 'Application status updated'
    }
  };
};

// ========== SAVED JOBS APIS ==========
export const getSavedJobs = async () => {
  console.log('🔵 MOCK: get saved jobs');
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Read from localStorage
  MOCK_SAVED_JOBS = JSON.parse(localStorage.getItem('savedJobs') || '[]');
  
  // If no saved jobs, create some
  if (MOCK_SAVED_JOBS.length === 0) {
    MOCK_SAVED_JOBS = [1, 7];
    localStorage.setItem('savedJobs', JSON.stringify(MOCK_SAVED_JOBS));
  }
  
  const savedJobsDetails = MOCK_JOBS.filter(job => MOCK_SAVED_JOBS.includes(job.id));
  return { data: savedJobsDetails };
};

export const saveJob = async (jobId) => {
  console.log('🔵 MOCK: save job', jobId);
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const id = parseInt(jobId);
  MOCK_SAVED_JOBS = JSON.parse(localStorage.getItem('savedJobs') || '[]');
  
  if (!MOCK_SAVED_JOBS.includes(id)) {
    MOCK_SAVED_JOBS.push(id);
    localStorage.setItem('savedJobs', JSON.stringify(MOCK_SAVED_JOBS));
  }
  
  return {
    data: {
      success: true,
      message: 'Job saved successfully'
    }
  };
};

export const unsaveJob = async (jobId) => {
  console.log('🔵 MOCK: unsave job', jobId);
  await new Promise(resolve => setTimeout(resolve, 500));
  
  MOCK_SAVED_JOBS = JSON.parse(localStorage.getItem('savedJobs') || '[]');
  MOCK_SAVED_JOBS = MOCK_SAVED_JOBS.filter(id => id !== parseInt(jobId));
  localStorage.setItem('savedJobs', JSON.stringify(MOCK_SAVED_JOBS));
  
  return {
    data: {
      success: true,
      message: 'Job removed from saved'
    }
  };
};

// ========== RECOMMENDATIONS ==========
export const getRecommendedJobs = async () => {
  console.log('🔵 MOCK: get recommended jobs');
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Return first 3 jobs as recommendations
  return { data: MOCK_JOBS.slice(0, 3) };
};

// ========== STATISTICS ==========
export const getStudentStats = async () => {
  console.log('🔵 MOCK: get student stats');
  await new Promise(resolve => setTimeout(resolve, 500));
  
  MOCK_APPLICATIONS = JSON.parse(localStorage.getItem('applications') || '[]');
  MOCK_SAVED_JOBS = JSON.parse(localStorage.getItem('savedJobs') || '[]');
  
  return {
    data: {
      totalApplications: MOCK_APPLICATIONS.length,
      pendingReview: MOCK_APPLICATIONS.filter(a => a.status === 'Pending').length,
      interviewsScheduled: MOCK_APPLICATIONS.filter(a => a.status === 'Interview').length,
      savedJobs: MOCK_SAVED_JOBS.length,
      profileCompletion: 80
    }
  };
};

export const getEmployerStats = async () => {
  return {
    data: {
      activeJobs: 6,
      totalApplicants: 48,
      positionsToFill: 4,
      avgMatchScore: 76
    }
  };
};

export const getAdminStats = async () => {
  return {
    data: {
      totalUsers: 1245,
      activeJobs: 82,
      totalApplications: 892,
      placementRate: 67
    }
  };
};

// ========== ADMIN APIS ==========
export const getAllUsers = async () => {
  console.log('🔵 MOCK: get all users');
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    data: [
      {
        id: 1,
        name: 'Ahmed Mohamed',
        email: 'ahmed@cu.edu.eg',
        role: 'student',
        status: 'active',
        department: 'Computer Science'
      },
      {
        id: 2,
        name: 'Dr. Sara Ali',
        email: 'sara@cu.edu.eg',
        role: 'employer',
        status: 'active',
        department: 'Physics'
      }
    ]
  };
};

export const deleteUser = async (userId) => {
  console.log('🔵 MOCK: delete user', userId);
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    data: {
      success: true,
      message: 'User deleted successfully'
    }
  };
};

export const updateUserRole = async (userId, role) => {
  console.log('🔵 MOCK: update user role', userId, role);
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    data: {
      success: true,
      message: 'User role updated'
    }
  };
};

export default {
  login,
  register,
  googleLogin,
  linkedinLogin,
  forgotPassword,
  getProfile,
  updateProfile,
  getAllJobs,
  getJobById,
  createJob,
  applyForJob,
  getUserApplications,
  getApplicationById,
  withdrawApplication,
  updateApplicationStatus,
  getSavedJobs,
  saveJob,
  unsaveJob,
  getRecommendedJobs,
  getStudentStats,
  getEmployerStats,
  getAdminStats,
  getAllUsers,
  deleteUser,
  updateUserRole
};
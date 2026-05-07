// C:\Student-job-portal\Frontend\src\services\api.js
import axios from 'axios';

// ✅ تغيير المنفذ إلى 5004
const API_BASE_URL = 'http://localhost:5004/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH ====================
export const login = async (formData) => {
  const response = await apiClient.post('/auth/login', formData);
  return response;
};

export const register = async (formData) => {
  const response = await apiClient.post('/auth/register', formData);
  return response;
};

export const forgotPassword = async (email) => {
  const response = await apiClient.post('/auth/forgot-password', { email });
  return response;
};

export const getProfile = async () => {
  const response = await apiClient.get('/profile');
  return response;
};

export const updateProfile = async (profileData) => {
  const response = await apiClient.put('/profile', profileData);
  return response;
};

// ==================== JOBS ====================
export const getAllJobs = async () => {
  const response = await apiClient.get('/jobs');
  return response;
};

export const getJobById = async (jobId) => {
  const response = await apiClient.get(`/jobs/${jobId}`);
  return response;
};

export const createJob = async (jobData) => {
  const response = await apiClient.post('/jobs', jobData);
  return response;
};

export const updateJob = async (jobId, jobData) => {
  const response = await apiClient.put(`/jobs/${jobId}`, jobData);
  return response;
};

export const deleteJob = async (jobId) => {
  const response = await apiClient.delete(`/jobs/${jobId}`);
  return response;
};

// ==================== APPLICATIONS ====================
export const applyForJob = async (applicationData) => {
  const response = await apiClient.post('/apply', applicationData);
  return response;
};

export const getUserApplications = async () => {
  const response = await apiClient.get('/applications/my-applications');
  return response;
};

export const withdrawApplication = async (applicationId) => {
  const response = await apiClient.delete(`/applications/${applicationId}`);
  return response;
};

export const acceptApplication = async (applicationId) => {
  const response = await apiClient.put(`/applications/${applicationId}/accept`);
  return response;
};

export const rejectApplication = async (applicationId) => {
  const response = await apiClient.put(`/applications/${applicationId}/reject`);
  return response;
};

export const confirmInterview = async (applicationId) => {
  const response = await apiClient.post(`/applications/${applicationId}/confirm`);
  return response;
};

// ==================== SAVED JOBS ====================
export const getSavedJobs = async () => {
  const response = await apiClient.get('/saved-jobs');
  return response;
};

export const saveJob = async (jobId) => {
  const response = await apiClient.post('/saved-jobs', { jobId });
  return response;
};

export const unsaveJob = async (jobId) => {
  const response = await apiClient.delete(`/saved-jobs/${jobId}`);
  return response;
};

// ==================== RECOMMENDATIONS & STATS ====================
export const getRecommendedJobs = async () => {
  const response = await apiClient.get('/recommendations');
  return response;
};

export const getStudentStats = async () => {
  const response = await apiClient.get('/stats/student');
  return response;
};

// ==================== EMPLOYER ====================
export const getEmployerStats = async () => {
  const response = await apiClient.get('/employer/stats');
  return response;
};

export const getEmployerJobs = async () => {
  const response = await apiClient.get('/employer/jobs');
  return response;
};

export const getJobApplicants = async (jobId) => {
  const response = await apiClient.get(`/employer/jobs/${jobId}/applications`);
  return response;
};

// ==================== CV & AI ====================
export const uploadCV = async (file) => {
  const formData = new FormData();
  formData.append('cv', file);
  const response = await apiClient.post('/extract-cv', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response;
};

export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await apiClient.post('/profile/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response;
};

export const deleteProfileImage = async () => {
  const response = await apiClient.delete('/profile/upload-image');
  return response;
};

export const getAIMatches = async (jobId, options = {}) => {
  const response = await apiClient.post('/ai/match', { jobId, ...options });
  return response;
};

export const addRating = async (targetUid, rating, comment) => {
  const response = await apiClient.post('/ratings', { targetUid, rating, comment });
  return response;
};

export const getRatings = async (targetUid) => {
  const response = await apiClient.get(`/ratings/${targetUid}`);
  return response;
};

// ==================== ADMIN ====================
export const getAllUsers = async () => {
  const response = await apiClient.get('/admin/users');
  return response;
};

export const updateUserRole = async (userId, role) => {
  const response = await apiClient.put(`/admin/users/${userId}/role`, { role });
  return response;
};

export const deleteUser = async (userId) => {
  const response = await apiClient.delete(`/admin/users/${userId}`);
  return response;
};

export const getAdminStats = async () => {
  const response = await apiClient.get('/admin/stats');
  return response;
};

export default apiClient;

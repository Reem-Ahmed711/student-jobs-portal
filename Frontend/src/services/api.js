// C:\Student-job-portal\Frontend\src\services\api.js
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

// Interceptor for token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH ====================
export const login = async (formData) => {
  const response = await apiClient.post("/auth/login", formData);
  return response;
};

export const register = async (formData) => {
  const response = await apiClient.post("/auth/register", formData);
  return response;
};

export const getCurrentUser = async () => {
  const response = await apiClient.get("/auth/me");
  return response;
};

export const forgotPassword = async (email) => {
  const response = await apiClient.post("/auth/forgot-password", { email });
  return response;
};

export const resetPassword = async (token, password) => {
  const response = await apiClient.post("/auth/reset-password", { token, password });
  return response;
};

export const changePassword = async (oldPassword, newPassword) => {
  const response = await apiClient.post("/auth/change-password", { oldPassword, newPassword });
  return response;
};

export const getProfile = async () => {
  const response = await apiClient.get("/auth/profile");
  return response;
};

export const updateProfile = async (profileData) => {
  const response = await apiClient.put("/auth/profile", profileData);
  return response;
};

export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append("profileImage", file);
  const response = await apiClient.post("/auth/upload-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response;
};

// ==================== JOBS ====================
export const getAllJobs = async () => {
  const response = await apiClient.get("/jobs");
  return response;
};

export const getJobById = async (jobId) => {
  const response = await apiClient.get(`/jobs/${jobId}`);
  return response;
};

export const createJob = async (jobData) => {
  const response = await apiClient.post("/jobs", jobData);
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

export const getRecommendedJobs = async () => {
  const response = await apiClient.get("/jobs/recommended");
  return response;
};

// ==================== STUDENT APPLICATIONS ====================
export const applyForJob = async (applicationData) => {
  const response = await apiClient.post("/student/apply", applicationData);
  return response;
};

export const getMyApplications = async () => {
  const response = await apiClient.get("/student/my-applications");
  return response;
};

export const getUserApplications = getMyApplications;

export const getApplicationById = async (id) => {
  const response = await apiClient.get(`/applications/${id}`);
  return response;
};

export const withdrawApplication = async (applicationId) => {
  const response = await apiClient.delete(`/applications/${applicationId}`);
  return response;
};

export const updateApplicationStatus = async (id, status) => {
  const response = await apiClient.put(`/applications/${id}/status`, { status });
  return response;
};

// ==================== STUDENT SAVED JOBS ====================
export const getSavedJobs = async () => {
  const response = await apiClient.get("/student/saved-jobs");
  return response;
};

export const saveJob = async (jobId) => {
  const response = await apiClient.post("/student/save-job", { jobId });
  return response;
};

export const unsaveJob = async (jobId) => {
  const response = await apiClient.delete(`/student/save-job/${jobId}`);
  return response;
};

export const isJobSaved = async (jobId) => {
  const response = await apiClient.get(`/student/saved-jobs/check/${jobId}`);
  return response;
};

// ==================== LIKES ====================
export const likeJob = async (jobId) => {
  const response = await apiClient.post("/student/like", { jobId });
  return response;
};

export const unlikeJob = async (jobId) => {
  const response = await apiClient.delete(`/student/like/${jobId}`);
  return response;
};

export const getLikes = async (jobId) => {
  const response = await apiClient.get(`/student/likes/${jobId}`);
  return response;
};

// ==================== COMMENTS ====================
export const addComment = async (jobId, comment) => {
  const response = await apiClient.post("/student/comment", { jobId, comment });
  return response;
};

export const getComments = async (jobId) => {
  const response = await apiClient.get(`/student/comments/${jobId}`);
  return response;
};

export const deleteComment = async (commentId) => {
  const response = await apiClient.delete(`/comments/${commentId}`);
  return response;
};

// ==================== STUDENT STATS ====================
export const getStudentStats = async () => {
  const response = await apiClient.get("/student/stats");
  return response;
};

// ==================== EMPLOYER ====================
export const getEmployerStats = async () => {
  const response = await apiClient.get("/employer/stats");
  return response;
};

export const getEmployerJobs = async () => {
  const response = await apiClient.get("/employer/my-jobs");
  return response;
};

export const getEmployerApplications = async () => {
  const response = await apiClient.get("/employer/applications");
  return response;
};

export const getEmployerDashboard = async () => {
  const response = await apiClient.get("/employer/dashboard");
  return response;
};

export const getJobApplicants = async (jobId) => {
  const response = await apiClient.get(`/employer/jobs/${jobId}/applicants`);
  return response;
};

export const acceptApplication = async (applicationId) => {
  const response = await apiClient.patch(`/employer/accept/${applicationId}`);
  return response;
};

export const rejectApplication = async (applicationId) => {
  const response = await apiClient.patch(`/employer/reject/${applicationId}`);
  return response;
};

export const shortlistApplicant = async (applicationId) => {
  const response = await apiClient.post(`/employer/applications/${applicationId}/shortlist`);
  return response;
};

export const postJob = async (jobData) => {
  const response = await apiClient.post("/employer/post-job", jobData);
  return response;
};

export const updateJobStatus = async (jobId, status) => {
  const response = await apiClient.patch(`/employer/update-job/${jobId}`, { status });
  return response;
};

// ==================== CV & AI ====================
export const uploadCV = async (file) => {
  const formData = new FormData();
  formData.append("cv", file);
  const response = await apiClient.post("/cv/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 60000
  });
  return response;
};

export const extractCVData = uploadCV;

export const deleteCV = async () => {
  const response = await apiClient.delete("/cv");
  return response;
};

export const getCV = async () => {
  const response = await apiClient.get("/cv");
  return response;
};

export const getAIMatching = async (jobId) => {
  const response = await apiClient.get(`/ai/matching/${jobId}`);
  return response;
};

// ==================== NOTIFICATIONS ====================
export const getNotifications = async () => {
  const response = await apiClient.get("/notifications");
  return response;
};

export const markNotificationAsRead = async (id) => {
  const response = await apiClient.put(`/notifications/${id}/read`);
  return response;
};

export const markAllNotificationsAsRead = async () => {
  const response = await apiClient.put("/notifications/read-all");
  return response;
};

// ==================== ADMIN ====================
export const getAllUsers = async () => {
  try {
    const response = await apiClient.get("/admin/users");
    const usersArray = response.data?.data || response.data || [];
    return { data: Array.isArray(usersArray) ? usersArray : [] };
  } catch (error) {
    console.error("Error fetching all users:", error);
    return { data: [] };
  }
};

export const updateUserRole = async (userId, role) => {
  const response = await apiClient.put(`/admin/users/${userId}/role`, { role });
  return response;
};

export const deleteUser = async (userId) => {
  const response = await apiClient.delete(`/admin/users/${userId}`);
  return response;
};

export const getAllEmployers = async () => {
  const response = await apiClient.get("/admin/employers");
  return response;
};

export const getAllStudents = async () => {
  const response = await apiClient.get("/admin/students");
  return response;
};

export const getAllAdmins = async () => {
  const response = await apiClient.get("/admin/admins");
  return response;
};

export const makeAdmin = async (uid) => {
  const response = await apiClient.patch(`/admin/make-admin/${uid}`);
  return response;
};

export const removeAdmin = async (uid) => {
  const response = await apiClient.patch(`/admin/remove-admin/${uid}`);
  return response;
};

export const adminDeleteUser = async (uid) => {
  const response = await apiClient.delete(`/admin/users/${uid}`);
  return response;
};

export const adminGetAllJobs = async () => {
  const response = await apiClient.get("/admin/jobs");
  return response;
};

export const adminDeleteJob = async (jobId) => {
  const response = await apiClient.delete(`/admin/jobs/${jobId}`);
  return response;
};

export const adminUpdateJobStatus = async (jobId, status) => {
  const response = await apiClient.patch(`/admin/jobs/${jobId}/status`, { status });
  return response;
};

export const adminGetAllApplications = async () => {
  const response = await apiClient.get("/admin/applications");
  return response;
};

export const adminUpdateApplicationStatus = async (appId, status) => {
  const response = await apiClient.patch(`/admin/applications/${appId}/status`, { status });
  return response;
};

export const getPlatformStats = async () => {
  const response = await apiClient.get("/admin/stats");
  return response;
};

export const getAdminStats = getPlatformStats;

// ==================== RATINGS ====================
export const addRating = async (targetUid, rating, comment) => {
  const response = await apiClient.post("/ratings", { targetUid, rating, comment });
  return response;
};

export const getRatings = async (targetUid) => {
  const response = await apiClient.get(`/ratings/${targetUid}`);
  return response;
};

// ==================== REPORTS ====================
export const getAllReports = async () => {
  const response = await apiClient.get("/admin/reports");
  return response;
};

export const updateReportStatus = async (reportId, status) => {
  const response = await apiClient.patch(`/admin/reports/${reportId}/status`, { status });
  return response;
};

export const deleteReport = async (reportId) => {
  const response = await apiClient.delete(`/admin/reports/${reportId}`);
  return response;
};
// ==================== PROFILE IMAGE (Full) ====================

export const deleteProfileImage = async () => {
  const response = await apiClient.delete("/auth/profile-image");
  return response;
};

export const getProfileImage = async () => {
  const response = await apiClient.get("/auth/profile-image");
  return response;
};


// ==================== AI RECOMMENDATIONS FOR STUDENT ====================
export const getRecommendedJobsForStudent = async () => {
  const response = await apiClient.get("/jobs/recommended/student");
  return response;
};

// ==================== JOB DETAILS ====================
export const getJobDetails = async (jobId) => {
  const response = await apiClient.get(`/jobs/${jobId}`);
  return response;
};

// ==================== SHARE JOB ====================
export const shareJob = async (jobId, platform) => {
  // This is client-side functionality, not an API call
  return { success: true };
};
export const refreshToken = async () => {
  const response = await apiClient.post("/auth/refresh-token");
  return response;
};

export default apiClient;

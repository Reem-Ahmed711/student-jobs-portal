// D:\student-jobs-portal\Frontend\src\services\api.js
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Add token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
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

export const forgotPassword = async (email) => {
  const response = await apiClient.post("/auth/forgot-password", { email });
  return response;
};

export const getProfile = async () => {
  const response = await apiClient.get("/profile");
  return response;
};

export const updateProfile = async (profileData) => {
  const response = await apiClient.put("/profile", profileData);
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

// ==================== APPLICATIONS ====================
export const applyForJob = async (applicationData) => {
  const response = await apiClient.post("/apply", applicationData);
  return response;
};

export const getUserApplications = async () => {
  const response = await apiClient.get("/applications/my-applications");
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
  const response = await apiClient.post(
    `/applications/${applicationId}/confirm`,
  );
  return response;
};

// ==================== SAVED JOBS ====================
export const getSavedJobs = async () => {
  const response = await apiClient.get("/saved-jobs");
  return response;
};

export const saveJob = async (jobId) => {
  const response = await apiClient.post("/saved-jobs", { jobId });
  return response;
};

export const unsaveJob = async (jobId) => {
  const response = await apiClient.delete(`/saved-jobs/${jobId}`);
  return response;
};

// ==================== RECOMMENDATIONS & STATS ====================
export const getRecommendedJobs = async () => {
  const response = await apiClient.get("/recommendations");
  return response;
};

export const getStudentStats = async () => {
  const response = await apiClient.get("/stats/student");
  return response;
};

// ==================== EMPLOYER ====================
export const getEmployerStats = async () => {
  const response = await apiClient.get("/employer/stats");
  return response;
};

export const getEmployerJobs = async () => {
  const response = await apiClient.get("/employer/jobs");
  return response;
};

export const getJobApplicants = async (jobId) => {
  const response = await apiClient.get(`/employer/jobs/${jobId}/applications`);
  return response;
};

// ==================== CV & AI ====================
export const uploadCV = async (file) => {
  const formData = new FormData();
  formData.append("cv", file);
  const response = await apiClient.post("/extract-cv", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response;
};

export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const response = await apiClient.post("/profile/upload-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response;
};

export const deleteProfileImage = async () => {
  const response = await apiClient.delete("/profile/upload-image");
  return response;
};

export const getAIMatches = async (jobId, options = {}) => {
  const response = await apiClient.post("/ai/match", { jobId, ...options });
  return response;
};

export const addRating = async (targetUid, rating, comment) => {
  const response = await apiClient.post("/ratings", {
    targetUid,
    rating,
    comment,
  });
  return response;
};

export const getRatings = async (targetUid) => {
  const response = await apiClient.get(`/ratings/${targetUid}`);
  return response;
};

// ==================== ADMIN -修正版 (متوافق مع الباكند بتاعك) ====================

// ---- Employers ----
export const getAllEmployers = async () => {
  const response = await apiClient.get("/admin/employers");
  return response;
};

export const getEmployerById = async (uid) => {
  const response = await apiClient.get(`/admin/employers/${uid}`);
  return response;
};

export const updateEmployer = async (uid, data) => {
  const response = await apiClient.put(`/admin/employers/${uid}`, data);
  return response;
};

export const deleteEmployer = async (uid) => {
  const response = await apiClient.delete(`/admin/employers/${uid}`);
  return response;
};

export const toggleEmployerStatus = async (uid) => {
  const response = await apiClient.patch(
    `/admin/employers/${uid}/toggle-status`,
  );
  return response;
};

// ---- Students ----
export const getAllStudents = async () => {
  const response = await apiClient.get("/admin/students");
  return response;
};

export const getStudentById = async (uid) => {
  const response = await apiClient.get(`/admin/students/${uid}`);
  return response;
};

export const updateStudent = async (uid, data) => {
  const response = await apiClient.put(`/admin/students/${uid}`, data);
  return response;
};

export const deleteStudent = async (uid) => {
  const response = await apiClient.delete(`/admin/students/${uid}`);
  return response;
};

export const toggleStudentStatus = async (uid) => {
  const response = await apiClient.patch(
    `/admin/students/${uid}/toggle-status`,
  );
  return response;
};

// ---- Admins ----
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

// ---- User Management (Delete any user) ----
export const adminDeleteUser = async (uid) => {
  const response = await apiClient.delete(`/admin/users/${uid}`);
  return response;
};

// ---- Admin Jobs Management ----
export const adminGetAllJobs = async () => {
  const response = await apiClient.get("/admin/jobs");
  return response;
};

export const adminDeleteJob = async (jobId) => {
  const response = await apiClient.delete(`/admin/jobs/${jobId}`);
  return response;
};

export const adminUpdateJobStatus = async (jobId, status) => {
  const response = await apiClient.patch(`/admin/jobs/${jobId}/status`, {
    status,
  });
  return response;
};

// ---- Admin Applications Management ----
export const adminGetAllApplications = async () => {
  const response = await apiClient.get("/admin/applications");
  return response;
};

export const adminUpdateApplicationStatus = async (appId, status) => {
  const response = await apiClient.patch(
    `/admin/applications/${appId}/status`,
    { status },
  );
  return response;
};

// ---- Platform Stats ----
export const getPlatformStats = async () => {
  const response = await apiClient.get("/admin/stats");
  return response;
};

export const getAllUsers = async () => {
  try {
    const response = await apiClient.get("/admin/users");
    // ✅ التأكد من إرجاع مصفوفة
    const usersArray = response.data?.data || response.data || [];
    return { data: Array.isArray(usersArray) ? usersArray : [] };
  } catch (error) {
    console.error("Error fetching all users:", error);
    return { data: [] };
  }
};

export const updateUserRole = async (userId, role) => {
  if (role === "admin") {
    return makeAdmin(userId);
  } else {
    return removeAdmin(userId);
  }
};

export const deleteUser = async (userId) => {
  return adminDeleteUser(userId);
};

export const getAdminStats = async () => {
  return getPlatformStats();
};

export default apiClient;

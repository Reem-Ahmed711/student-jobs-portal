// MOBILE-APP/frontEnd/src/api.js (كامل مع إضافات AI - الإصدار المعدل بالكامل)
// @ts-nocheck
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ================= BASE URL =================
// Emulator Android
// const API_URL = "http://localhost:3000";
// لو موبايل حقيقي غيّره لـ IP جهازك:

const API_URL = "http://10.104.209.249:3000";
console.log(" API URL:", API_URL);
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 120000,
});

// ================= TOKEN INTERCEPTOR =================
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    console.log("Token error:", e.message);
  }
  return config;
});

// ================= AUTH =================
export const loginUser = async (email, password) => {
  try {
    const res = await api.post("/api/login", { email, password });
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || err.message || "Login failed",
    };
  }
};

export const registerUser = async (userData) => {
  try {
    const res = await api.post("/api/register", userData);
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || err.message || "Register failed",
    };
  }
};

// ================= PROFILE =================
export const getUserProfile = async (uid) => {
  try {
    const res = await api.get(`/api/profile/${uid}`);
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || err.message,
    };
  }
};

export const updateStudentProfile = async (data) => {
  try {
    console.log("📤 Sending update:", data);
    const res = await api.put("/api/student/profile", data);
    console.log("📥 Update response:", res.data);
    return res.data;
  } catch (err) {
    console.log("❌ Update error:", err.response?.data);
    return {
      success: false,
      message: err?.response?.data?.message || err.message,
    };
  }
};

export const fetchStudentProfile = async () => {
  try {
    const res = await api.get("/api/student/profile");
    console.log("📥 Fetch profile response:", res.data);
    return res.data;
  } catch (err) {
    console.log("❌ Fetch error:", err.response?.data);
    return {
      success: false,
      message: err?.response?.data?.message || err.message,
    };
  }
};

// ================= JOBS =================
export const getAvailableJobs = async () => {
  try {
    const res = await api.get("/api/jobs");
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, data: [] };
  }
};

export const createNewJob = async (jobData) => {
  try {
    const res = await api.post("/api/jobs", jobData);
    return { success: true, data: res.data };
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || err.message,
    };
  }
};

export const deleteJob = async (jobId) => {
  try {
    const res = await api.delete(`/api/jobs/${jobId}`);
    return { success: true, data: res.data };
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || err.message,
    };
  }
};

// ================= APPLICATIONS =================
export const applyToJob = async (jobId) => {
  try {
    const res = await api.post("/api/applications", { jobId });
    return { success: true, data: res.data };
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || err.message,
    };
  }
};

export const getStudentApplications = async () => {
  try {
    const res = await api.get("/api/applications/student");
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, data: [] };
  }
};

export const getJobApplicants = async (jobId) => {
  try {
    const res = await api.get(`/api/applications/job/${jobId}`);
    return { success: true, data: res.data };
  } catch (err) {
    console.log(
      "🔴 getJobApplicants ERROR:",
      err.response?.status,
      err.response?.data,
    );
    return {
      success: false,
      data: [],
      status: err.response?.status,
      message: err.response?.data?.message || err.message,
    };
  }
};

// ================= EMPLOYER =================
export const getEmployerDashboard = async () => {
  try {
    const res = await api.get("/api/employer/dashboard");
    console.log("RAW RESPONSE:", JSON.stringify(res.data));
    return { success: true, data: res.data.data };
  } catch (err) {
    console.log("DASHBOARD ERROR STATUS:", err.response?.status);
    console.log("DASHBOARD ERROR DATA:", JSON.stringify(err.response?.data));
    console.log("DASHBOARD ERROR MSG:", err.message);
    return { success: false, data: null };
  }
};

export const getEmployerProfile = async () => {
  try {
    const res = await api.get("/api/employer/profile");
    return { success: true, data: res.data.data };
  } catch (err) {
    return { success: false, data: null };
  }
};

export const updateEmployerProfile = async (data) => {
  try {
    const res = await api.put("/api/employer/profile", data);
    return { success: true, data: res.data };
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || err.message,
    };
  }
};

export const getEmployerJobs = async () => {
  try {
    const res = await api.get("/api/employer/jobs");
    return { success: true, data: res.data.data };
  } catch (err) {
    return { success: false, data: [] };
  }
};

export const acceptApplication = async (applicationId) => {
  try {
    const res = await api.post(
      `/api/employer/applications/${applicationId}/accept`,
    );
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || err.message,
    };
  }
};

export const rejectApplication = async (applicationId, reason = "") => {
  try {
    const res = await api.post(
      `/api/employer/applications/${applicationId}/reject`,
      { reason },
    );
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || err.message,
    };
  }
};

// ================= RATINGS =================
export const getUserRating = async (uid) => {
  try {
    const res = await api.get(`/api/ratings/user/${uid}`);
    return res.data;
  } catch (err) {
    return { success: false, data: null };
  }
};

export const rateStudent = async (studentUid, ratingData) => {
  try {
    const res = await api.post(
      `/api/ratings/student/${studentUid}`,
      ratingData,
    );
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || err.message,
    };
  }
};

// ================= ADMIN APIs =================
export const getAdminStats = async () => {
  try {
    const res = await api.get("/api/admin/stats");
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || err.message,
    };
  }
};

export const adminGetAllJobs = async () => {
  try {
    const res = await api.get("/api/admin/jobs");
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || err.message,
      data: [],
    };
  }
};

export const adminDeleteJob = async (jobId) => {
  try {
    const res = await api.delete(`/api/admin/jobs/${jobId}`);
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || err.message,
    };
  }
};

export const adminUpdateJobStatus = async (jobId, status) => {
  try {
    const res = await api.patch(`/api/admin/jobs/${jobId}/status`, { status });
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || err.message,
    };
  }
};

export const getAllUsers = async (role = null, page = 1, limit = 20) => {
  try {
    let url = `/api/admin/users?page=${page}&limit=${limit}`;
    if (role) url += `&role=${role}`;
    const res = await api.get(url);
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || err.message,
      data: { users: [] },
    };
  }
};

export const adminDeleteUser = async (uid) => {
  try {
    const res = await api.delete(`/api/admin/users/${uid}`);
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || err.message,
    };
  }
};

export const makeAdmin = async (uid) => {
  try {
    const res = await api.post(`/api/admin/users/${uid}/make-admin`);
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || err.message,
    };
  }
};

export const removeAdmin = async (uid) => {
  try {
    const res = await api.post(`/api/admin/users/${uid}/remove-admin`);
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || err.message,
    };
  }
};

// ================= SAVED JOBS (معدل بالكامل) =================
// ================= SAVED JOBS (معدل) =================

export const saveJob = async (jobId) => {
  try {
    const res = await api.post("/api/saved-jobs/save", { jobId });
    console.log("✅ Job saved successfully:", res.data);
    return { success: true, data: res.data };
  } catch (err) {
    console.error(
      "❌ Save job error:",
      err.response?.status,
      err.response?.data,
    );
    return {
      success: false,
      message: err?.response?.data?.message || err.message,
    };
  }
};

export const unsaveJob = async (jobId) => {
  try {
    const res = await api.delete(`/api/saved-jobs/unsave/${jobId}`);
    console.log("✅ Job unsaved successfully:", res.data);
    return { success: true, data: res.data };
  } catch (err) {
    console.error(
      "❌ Unsave job error:",
      err.response?.status,
      err.response?.data,
    );
    return {
      success: false,
      message: err?.response?.data?.message || err.message,
    };
  }
};

export const getSavedJobs = async () => {
  try {
    const res = await api.get("/api/saved-jobs");
    console.log("📥 Saved jobs response:", JSON.stringify(res.data, null, 2));
    return res.data;
  } catch (err) {
    console.error(
      "❌ Get saved jobs error:",
      err.response?.status,
      err.response?.data,
    );
    return { success: false, data: [] };
  }
};

export const isJobSaved = async (jobId) => {
  try {
    const res = await api.get(`/api/saved-jobs/check/${jobId}`);
    return res.data;
  } catch (err) {
    console.error("❌ Check saved job error:", err.response?.data);
    return { success: false, data: { saved: false } };
  }
};
// ================= COUNTS FOR PROFILE =================

export const getSavedJobsCount = async () => {
  try {
    const res = await api.get("/api/saved-jobs/count");
    return { success: true, count: res.data.count || 0 };
  } catch (err) {
    console.error("❌ Get saved jobs count error:", err);
    return { success: false, count: 0 };
  }
};

export const getAppliedJobsCount = async () => {
  try {
    const res = await api.get("/api/applications/student/count");
    return { success: true, count: res.data.count || 0 };
  } catch (err) {
    console.error("❌ Get applied jobs count error:", err);
    return { success: false, count: 0 };
  }
};

// ================= COMMENTS =================
// ================= COMMENTS (معدل بالكامل مع اللايك) =================
export const addComment = async (jobId, comment) => {
  try {
    const res = await api.post("/api/comment", { jobId, comment });
    console.log("✅ Comment added:", res.data);
    return { success: true, data: res.data };
  } catch (err) {
    console.error("❌ Add comment error:", err.response?.status, err.response?.data);
    return {
      success: false,
      message: err?.response?.data?.message || err.message || "Failed to add comment",
    };
  }
};

export const getComments = async (jobId) => {
  try {
    const res = await api.get(`/api/comments/${jobId}`);
    console.log(`📝 Got comments for job ${jobId}:`, res.data);
    const comments = res.data.comments || [];
    return { success: true, comments };
  } catch (err) {
    console.error("❌ Get comments error:", err.response?.status, err.response?.data);
    return {
      success: false,
      comments: [],
      message: err?.response?.data?.message || err.message,
    };
  }
};

export const deleteComment = async (commentId) => {
  try {
    const res = await api.delete(`/api/comments/${commentId}`);
    console.log("✅ Comment deleted:", res.data);
    return { success: true, data: res.data };
  } catch (err) {
    console.error("❌ Delete comment error:", err.response?.status, err.response?.data);
    return {
      success: false,
      message: err?.response?.data?.message || err.message,
    };
  }
};

export const updateComment = async (commentId, comment) => {
  try {
    const res = await api.put(`/api/comments/${commentId}`, { comment });
    console.log("✅ Comment updated:", res.data);
    return { success: true, data: res.data };
  } catch (err) {
    console.error("❌ Update comment error:", err.response?.data);
    return {
      success: false,
      message: err?.response?.data?.message || err.message,
    };
  }
};

// ✅ دوال اللايك (Like) على التعليقات
export const likeComment = async (commentId) => {
  try {
    const res = await api.post(`/api/comments/${commentId}/like`);
    console.log("✅ Comment liked:", res.data);
    return { success: true, data: res.data };
  } catch (err) {
    console.error("❌ Like comment error:", err.response?.data);
    return {
      success: false,
      message: err?.response?.data?.message || err.message,
    };
  }
};

export const unlikeComment = async (commentId) => {
  try {
    const res = await api.delete(`/api/comments/${commentId}/like`);
    console.log("✅ Comment unliked:", res.data);
    return { success: true, data: res.data };
  } catch (err) {
    console.error("❌ Unlike comment error:", err.response?.data);
    return {
      success: false,
      message: err?.response?.data?.message || err.message,
    };
  }
};

export const getCommentLikes = async (commentId) => {
  try {
    const res = await api.get(`/api/comments/${commentId}/likes`);
    return { success: true, data: res.data };
  } catch (err) {
    console.error("❌ Get comment likes error:", err.response?.data);
    return { success: false, likes: [], count: 0 };
  }
};
// ================= IMAGE UPLOAD (Cloudinary) =================
export const uploadProfileImage = async (imageBase64) => {
  try {
    const res = await api.post("/api/images/upload", { imageBase64 });
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || err.message,
    };
  }
};

// ================= AI APIs =================
// جلب توصيات وظائف للطالب
export const getAIRecommendations = async () => {
  try {
    const res = await api.get("/api/ai/recommendations");
    return res.data;
  } catch (err) {
    console.log("❌ AI recommendations error:", err.response?.data);
    return { success: false, data: [] };
  }
};

// تحليل مدى توافق الطالب مع وظيفة معينة
export const analyzeMatchWithAI = async (jobId) => {
  try {
    const res = await api.get(`/api/ai/match/${jobId}`);
    return res.data;
  } catch (err) {
    console.log("❌ AI match analysis error:", err.response?.data);
    return { success: false, data: null };
  }
};

// تحسين السيرة الذاتية
export const improveCVWithAI = async (cvText, jobTitle) => {
  try {
    const res = await api.post("/api/ai/improve-cv", { cvText, jobTitle });
    return res.data;
  } catch (err) {
    console.log("❌ AI improve CV error:", err.response?.data);
    return { success: false, message: err.message };
  }
};

// نصائح شخصية للطالب
export const getAITips = async () => {
  try {
    const res = await api.get("/api/ai/tips");
    return res.data;
  } catch (err) {
    console.log("❌ AI tips error:", err.response?.data);
    return { success: false, data: null };
  }
};

// ================= NOTIFICATIONS =================

export const registerPushToken = async (pushToken) => {
  try {
    const res = await api.post("/api/notifications/register-token", {
      pushToken,
    });
    return res.data;
  } catch (err) {
    console.error("❌ Register push token error:", err);
    return { success: false, message: err.message };
  }
};

export const getNotifications = async (limit = 50) => {
  try {
    const res = await api.get(`/api/notifications?limit=${limit}`);
    return res.data;
  } catch (err) {
    console.error("❌ Get notifications error:", err);
    return { success: false, notifications: [] };
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const res = await api.put(`/api/notifications/${notificationId}/read`);
    return res.data;
  } catch (err) {
    console.error("❌ Mark as read error:", err);
    return { success: false };
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    const res = await api.put("/api/notifications/read-all");
    return res.data;
  } catch (err) {
    console.error("❌ Mark all as read error:", err);
    return { success: false };
  }
};

export const getUnreadNotificationsCount = async () => {
  try {
    const res = await api.get("/api/notifications/unread/count");
    return res.data;
  } catch (err) {
    console.error("❌ Get unread count error:", err);
    return { success: false, count: 0 };
  }
};

export const sendTestNotification = async (title, body, type = "general") => {
  try {
    const res = await api.post("/api/notifications/test", {
      title,
      body,
      type,
    });
    return res.data;
  } catch (err) {
    console.error("❌ Send test notification error:", err);
    return { success: false };
  }
};

// ================= FORGOT PASSWORD =================
export const forgotPassword = async (email) => {
  try {
    const res = await api.post("/api/forgot-password", { email });
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || err.message,
    };
  }
};

export const resetPassword = async (oobCode, newPassword) => {
  try {
    const res = await api.post("/api/reset-password", { oobCode, newPassword });
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || err.message,
    };
  }
};
// ================= EXPORT DEFAULT =================
export default api;
